// 훈련 세션 관리 컨트롤러
import { query } from '../config/database.js';
import logger from '../config/logger.js';

// 훈련 세션 시작
export const startTrainingSession = async (req, res) => {
  try {
    const { scenarioId } = req.body;
    const userId = req.user.id;

    // 시나리오 존재 확인
    const scenarioResult = await query(
      'SELECT id, title, estimated_duration FROM scenarios WHERE id = $1 AND is_active = true',
      [scenarioId]
    );

    if (scenarioResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '활성화된 시나리오를 찾을 수 없습니다.'
      });
    }

    const scenario = scenarioResult.rows[0];

    // 진행 중인 세션이 있는지 확인
    const existingSessionResult = await query(
      'SELECT id FROM training_sessions WHERE user_id = $1 AND status = $2',
      [userId, 'in_progress']
    );

    if (existingSessionResult.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: '이미 진행 중인 훈련 세션이 있습니다. 기존 세션을 완료하거나 중단해주세요.'
      });
    }

    // 새 훈련 세션 생성
    const sessionResult = await query(`
      INSERT INTO training_sessions (user_id, scenario_id, max_score)
      VALUES ($1, $2, $3)
      RETURNING id, started_at
    `, [userId, scenarioId, 100]); // 기본 최대 점수 100

    const sessionId = sessionResult.rows[0].id;
    const startedAt = sessionResult.rows[0].started_at;

    logger.info('훈련 세션 시작', { 
      sessionId, 
      userId, 
      scenarioId, 
      scenarioTitle: scenario.title 
    });

    res.status(201).json({
      success: true,
      message: '훈련 세션이 시작되었습니다.',
      data: {
        sessionId,
        scenarioId,
        scenarioTitle: scenario.title,
        estimatedDuration: scenario.estimated_duration,
        startedAt
      }
    });
  } catch (error) {
    logger.error('훈련 세션 시작 오류', { error: error.message, userId: req.user.id });
    res.status(500).json({
      success: false,
      message: '훈련 세션 시작 중 오류가 발생했습니다.'
    });
  }
};

// 훈련 응답 제출
export const submitTrainingResponse = async (req, res) => {
  try {
    const { sessionId, stepId, userResponse, selectedActionId, responseTime } = req.body;
    const userId = req.user.id;

    // 세션 존재 및 권한 확인
    const sessionResult = await query(
      'SELECT id, status FROM training_sessions WHERE id = $1 AND user_id = $2',
      [sessionId, userId]
    );

    if (sessionResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '훈련 세션을 찾을 수 없습니다.'
      });
    }

    const session = sessionResult.rows[0];

    if (session.status !== 'in_progress') {
      return res.status(400).json({
        success: false,
        message: '진행 중인 훈련 세션이 아닙니다.'
      });
    }

    // 단계 존재 확인
    const stepResult = await query(
      'SELECT id, step_type FROM scenario_steps WHERE id = $1',
      [stepId]
    );

    if (stepResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '훈련 단계를 찾을 수 없습니다.'
      });
    }

    const step = stepResult.rows[0];

    // 점수 계산
    let score = 0;
    if (step.step_type === 'multiple_choice' && selectedActionId) {
      const actionResult = await query(
        'SELECT points FROM scenario_actions WHERE id = $1',
        [selectedActionId]
      );
      if (actionResult.rows.length > 0) {
        score = actionResult.rows[0].points || 0;
      }
    } else if (step.step_type === 'descriptive' && userResponse) {
      // 서술형 답변의 경우 키워드 기반 점수 계산 (간단한 예시)
      score = calculateDescriptiveScore(userResponse);
    }

    // 응답 저장
    const responseResult = await query(`
      INSERT INTO training_responses (session_id, step_id, user_response, selected_action_id, score, response_time)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `, [sessionId, stepId, userResponse, selectedActionId, score, responseTime]);

    const responseId = responseResult.rows[0].id;

    logger.info('훈련 응답 제출', { 
      responseId, 
      sessionId, 
      stepId, 
      score, 
      responseTime 
    });

    res.json({
      success: true,
      message: '응답이 제출되었습니다.',
      data: {
        responseId,
        score,
        stepType: step.step_type
      }
    });
  } catch (error) {
    logger.error('훈련 응답 제출 오류', { error: error.message, userId: req.user.id });
    res.status(500).json({
      success: false,
      message: '응답 제출 중 오류가 발생했습니다.'
    });
  }
};

// 훈련 세션 완료
export const completeTrainingSession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const userId = req.user.id;

    // 세션 존재 및 권한 확인
    const sessionResult = await query(
      'SELECT id, scenario_id FROM training_sessions WHERE id = $1 AND user_id = $2 AND status = $3',
      [sessionId, userId, 'in_progress']
    );

    if (sessionResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '진행 중인 훈련 세션을 찾을 수 없습니다.'
      });
    }

    const session = sessionResult.rows[0];

    // 총 점수 계산
    const scoreResult = await query(`
      SELECT 
        SUM(score) as total_score,
        COUNT(*) as total_responses,
        AVG(response_time) as avg_response_time
      FROM training_responses 
      WHERE session_id = $1
    `, [sessionId]);

    const totalScore = scoreResult.rows[0].total_score || 0;
    const totalResponses = scoreResult.rows[0].total_responses || 0;
    const avgResponseTime = scoreResult.rows[0].avg_response_time || 0;

    // 완료율 계산 (시나리오의 총 단계 수 대비 응답한 단계 수)
    const scenarioStepsResult = await query(
      'SELECT COUNT(*) as total_steps FROM scenario_steps WHERE scenario_id = $1',
      [session.scenario_id]
    );

    const totalSteps = scenarioStepsResult.rows[0].total_steps;
    const completionPercentage = totalSteps > 0 ? (totalResponses / totalSteps) * 100 : 0;

    // 세션 완료 처리
    const updateResult = await query(`
      UPDATE training_sessions 
      SET 
        status = 'completed',
        completed_at = CURRENT_TIMESTAMP,
        total_score = $1,
        completion_percentage = $2
      WHERE id = $3
      RETURNING *
    `, [totalScore, completionPercentage, sessionId]);

    const completedSession = updateResult.rows[0];

    logger.info('훈련 세션 완료', { 
      sessionId, 
      userId, 
      totalScore, 
      completionPercentage,
      totalResponses,
      avgResponseTime 
    });

    res.json({
      success: true,
      message: '훈련 세션이 완료되었습니다.',
      data: {
        sessionId,
        totalScore,
        completionPercentage: Math.round(completionPercentage * 100) / 100,
        totalResponses,
        avgResponseTime: Math.round(avgResponseTime),
        completedAt: completedSession.completed_at
      }
    });
  } catch (error) {
    logger.error('훈련 세션 완료 오류', { error: error.message, userId: req.user.id });
    res.status(500).json({
      success: false,
      message: '훈련 세션 완료 중 오류가 발생했습니다.'
    });
  }
};

// 훈련 세션 중단
export const abandonTrainingSession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const userId = req.user.id;

    // 세션 존재 및 권한 확인
    const sessionResult = await query(
      'SELECT id FROM training_sessions WHERE id = $1 AND user_id = $2 AND status = $3',
      [sessionId, userId, 'in_progress']
    );

    if (sessionResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '진행 중인 훈련 세션을 찾을 수 없습니다.'
      });
    }

    // 세션 중단 처리
    await query(
      'UPDATE training_sessions SET status = $1 WHERE id = $2',
      ['abandoned', sessionId]
    );

    logger.info('훈련 세션 중단', { sessionId, userId });

    res.json({
      success: true,
      message: '훈련 세션이 중단되었습니다.'
    });
  } catch (error) {
    logger.error('훈련 세션 중단 오류', { error: error.message, userId: req.user.id });
    res.status(500).json({
      success: false,
      message: '훈련 세션 중단 중 오류가 발생했습니다.'
    });
  }
};

// 사용자의 훈련 세션 목록 조회
export const getUserTrainingSessions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE ts.user_id = $1';
    const params = [userId];
    let paramIndex = 2;

    if (status) {
      whereClause += ` AND ts.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    const result = await query(`
      SELECT 
        ts.id,
        ts.scenario_id,
        s.title as scenario_title,
        s.difficulty,
        ts.status,
        ts.started_at,
        ts.completed_at,
        ts.total_score,
        ts.completion_percentage,
        COUNT(tr.id) as responses_count
      FROM training_sessions ts
      JOIN scenarios s ON ts.scenario_id = s.id
      LEFT JOIN training_responses tr ON ts.id = tr.session_id
      ${whereClause}
      GROUP BY ts.id, s.title, s.difficulty
      ORDER BY ts.started_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `, [...params, limit, offset]);

    // 전체 개수 조회
    const countResult = await query(`
      SELECT COUNT(*) as total 
      FROM training_sessions ts
      ${whereClause}
    `, params);

    const total = parseInt(countResult.rows[0].total);

    logger.info('사용자 훈련 세션 목록 조회', { 
      userId, 
      page, 
      limit, 
      total, 
      count: result.rows.length 
    });

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('사용자 훈련 세션 목록 조회 오류', { error: error.message, userId: req.user.id });
    res.status(500).json({
      success: false,
      message: '훈련 세션 목록 조회 중 오류가 발생했습니다.'
    });
  }
};

// 특정 훈련 세션 상세 조회
export const getTrainingSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    // 세션 기본 정보 조회
    const sessionResult = await query(`
      SELECT 
        ts.*,
        s.title as scenario_title,
        s.description as scenario_description,
        s.difficulty,
        u.username
      FROM training_sessions ts
      JOIN scenarios s ON ts.scenario_id = s.id
      JOIN users u ON ts.user_id = u.id
      WHERE ts.id = $1 AND ts.user_id = $2
    `, [sessionId, userId]);

    if (sessionResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '훈련 세션을 찾을 수 없습니다.'
      });
    }

    const session = sessionResult.rows[0];

    // 응답 상세 조회
    const responsesResult = await query(`
      SELECT 
        tr.*,
        ss.step_order,
        ss.title as step_title,
        ss.step_type,
        sa.action_text,
        sa.is_correct
      FROM training_responses tr
      JOIN scenario_steps ss ON tr.step_id = ss.id
      LEFT JOIN scenario_actions sa ON tr.selected_action_id = sa.id
      WHERE tr.session_id = $1
      ORDER BY ss.step_order
    `, [sessionId]);

    logger.info('훈련 세션 상세 조회', { sessionId, userId });

    res.json({
      success: true,
      data: {
        ...session,
        responses: responsesResult.rows
      }
    });
  } catch (error) {
    logger.error('훈련 세션 상세 조회 오류', { error: error.message, sessionId: req.params.sessionId, userId: req.user.id });
    res.status(500).json({
      success: false,
      message: '훈련 세션 상세 조회 중 오류가 발생했습니다.'
    });
  }
};

// 서술형 답변 점수 계산 함수
const calculateDescriptiveScore = (response) => {
  const keywords = [
    '사고위치', '가스배관', '손상', '누출', '신고자', '신원', '화기', '사용금지', 
    '통제', '피해현황', '확인', 'ppm', '농도', '폭발', '위험'
  ];
  
  const responseLower = response.toLowerCase();
  let score = 0;
  
  keywords.forEach(keyword => {
    if (responseLower.includes(keyword.toLowerCase())) {
      score += 5; // 키워드당 5점
    }
  });
  
  // 최대 100점으로 제한
  return Math.min(score, 100);
};
