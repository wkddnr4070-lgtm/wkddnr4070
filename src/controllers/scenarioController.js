// 훈련 시나리오 관리 컨트롤러
import { query } from '../config/database.js';
import logger from '../config/logger.js';

// 시나리오 목록 조회
export const getScenarios = async (req, res) => {
  try {
    const { page = 1, limit = 10, difficulty, isActive } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (difficulty) {
      whereClause += ` AND difficulty = $${paramIndex}`;
      params.push(difficulty);
      paramIndex++;
    }

    if (isActive !== undefined) {
      whereClause += ` AND is_active = $${paramIndex}`;
      params.push(isActive === 'true');
      paramIndex++;
    }

    // 시나리오 목록 조회
    const scenariosResult = await query(`
      SELECT 
        id, 
        title, 
        description, 
        difficulty, 
        estimated_duration, 
        is_active, 
        created_at, 
        updated_at
      FROM scenarios 
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `, [...params, limit, offset]);

    // 전체 개수 조회
    const countResult = await query(`
      SELECT COUNT(*) as total 
      FROM scenarios 
      ${whereClause}
    `, params);

    const total = parseInt(countResult.rows[0].total);

    logger.info('시나리오 목록 조회', { 
      page, 
      limit, 
      total, 
      count: scenariosResult.rows.length 
    });

    res.json({
      success: true,
      data: scenariosResult.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('시나리오 목록 조회 오류', { error: error.message });
    res.status(500).json({
      success: false,
      message: '시나리오 목록 조회 중 오류가 발생했습니다.'
    });
  }
};

// 특정 시나리오 상세 조회
export const getScenario = async (req, res) => {
  try {
    const { scenarioId } = req.params;

    // 시나리오 기본 정보 조회
    const scenarioResult = await query(
      'SELECT * FROM scenarios WHERE id = $1',
      [scenarioId]
    );

    if (scenarioResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '시나리오를 찾을 수 없습니다.'
      });
    }

    const scenario = scenarioResult.rows[0];

    // 시나리오 단계 조회
    const stepsResult = await query(`
      SELECT 
        id, 
        step_order, 
        stage, 
        title, 
        description, 
        step_type, 
        time_limit
      FROM scenario_steps 
      WHERE scenario_id = $1 
      ORDER BY step_order
    `, [scenarioId]);

    // 각 단계의 액션(선택지) 조회
    const stepsWithActions = await Promise.all(
      stepsResult.rows.map(async (step) => {
        const actionsResult = await query(`
          SELECT 
            id, 
            action_text, 
            is_correct, 
            points, 
            action_order
          FROM scenario_actions 
          WHERE step_id = $1 
          ORDER BY action_order
        `, [step.id]);

        return {
          ...step,
          actions: actionsResult.rows
        };
      })
    );

    logger.info('시나리오 상세 조회', { 
      scenarioId, 
      stepsCount: stepsWithActions.length 
    });

    res.json({
      success: true,
      data: {
        ...scenario,
        steps: stepsWithActions
      }
    });
  } catch (error) {
    logger.error('시나리오 상세 조회 오류', { error: error.message, scenarioId: req.params.scenarioId });
    res.status(500).json({
      success: false,
      message: '시나리오 상세 조회 중 오류가 발생했습니다.'
    });
  }
};

// 시나리오 생성
export const createScenario = async (req, res) => {
  try {
    const { title, description, difficulty, estimatedDuration, steps } = req.body;

    // 트랜잭션 시작
    const client = await query('BEGIN');

    try {
      // 시나리오 생성
      const scenarioResult = await query(`
        INSERT INTO scenarios (title, description, difficulty, estimated_duration)
        VALUES ($1, $2, $3, $4)
        RETURNING id
      `, [title, description, difficulty, estimatedDuration]);

      const scenarioId = scenarioResult.rows[0].id;

      // 시나리오 단계 생성
      for (const step of steps) {
        const { stepOrder, stage, title: stepTitle, description: stepDescription, stepType, timeLimit, actions } = step;

        const stepResult = await query(`
          INSERT INTO scenario_steps (scenario_id, step_order, stage, title, description, step_type, time_limit)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING id
        `, [scenarioId, stepOrder, stage, stepTitle, stepDescription, stepType, timeLimit]);

        const stepId = stepResult.rows[0].id;

        // 액션(선택지) 생성
        for (const action of actions) {
          const { actionText, isCorrect, points, actionOrder } = action;
          
          await query(`
            INSERT INTO scenario_actions (step_id, action_text, is_correct, points, action_order)
            VALUES ($1, $2, $3, $4, $5)
          `, [stepId, actionText, isCorrect, points, actionOrder]);
        }
      }

      await query('COMMIT');

      logger.info('시나리오 생성 완료', { 
        scenarioId, 
        title, 
        stepsCount: steps.length 
      });

      res.status(201).json({
        success: true,
        message: '시나리오가 성공적으로 생성되었습니다.',
        data: { id: scenarioId }
      });
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    logger.error('시나리오 생성 오류', { error: error.message });
    res.status(500).json({
      success: false,
      message: '시나리오 생성 중 오류가 발생했습니다.'
    });
  }
};

// 시나리오 수정
export const updateScenario = async (req, res) => {
  try {
    const { scenarioId } = req.params;
    const { title, description, difficulty, estimatedDuration, isActive } = req.body;

    const result = await query(`
      UPDATE scenarios 
      SET title = $1, description = $2, difficulty = $3, estimated_duration = $4, is_active = $5, updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `, [title, description, difficulty, estimatedDuration, isActive, scenarioId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '시나리오를 찾을 수 없습니다.'
      });
    }

    logger.info('시나리오 수정 완료', { scenarioId });

    res.json({
      success: true,
      message: '시나리오가 성공적으로 수정되었습니다.',
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('시나리오 수정 오류', { error: error.message, scenarioId: req.params.scenarioId });
    res.status(500).json({
      success: false,
      message: '시나리오 수정 중 오류가 발생했습니다.'
    });
  }
};

// 시나리오 삭제
export const deleteScenario = async (req, res) => {
  try {
    const { scenarioId } = req.params;

    // 시나리오 존재 확인
    const scenarioResult = await query(
      'SELECT id FROM scenarios WHERE id = $1',
      [scenarioId]
    );

    if (scenarioResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '시나리오를 찾을 수 없습니다.'
      });
    }

    // 시나리오 삭제 (CASCADE로 관련 데이터도 함께 삭제)
    await query('DELETE FROM scenarios WHERE id = $1', [scenarioId]);

    logger.info('시나리오 삭제 완료', { scenarioId });

    res.json({
      success: true,
      message: '시나리오가 성공적으로 삭제되었습니다.'
    });
  } catch (error) {
    logger.error('시나리오 삭제 오류', { error: error.message, scenarioId: req.params.scenarioId });
    res.status(500).json({
      success: false,
      message: '시나리오 삭제 중 오류가 발생했습니다.'
    });
  }
};

// 시나리오 통계 조회
export const getScenarioStats = async (req, res) => {
  try {
    const { scenarioId } = req.params;

    // 시나리오 기본 통계
    const statsResult = await query(`
      SELECT 
        COUNT(DISTINCT ts.id) as total_sessions,
        COUNT(DISTINCT CASE WHEN ts.status = 'completed' THEN ts.id END) as completed_sessions,
        AVG(CASE WHEN ts.status = 'completed' THEN ts.completion_percentage END) as avg_completion_rate,
        AVG(CASE WHEN ts.status = 'completed' THEN ts.total_score END) as avg_score
      FROM scenarios s
      LEFT JOIN training_sessions ts ON s.id = ts.scenario_id
      WHERE s.id = $1
      GROUP BY s.id, s.title
    `, [scenarioId]);

    if (statsResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '시나리오를 찾을 수 없습니다.'
      });
    }

    const stats = statsResult.rows[0];

    // 단계별 통계
    const stepStatsResult = await query(`
      SELECT 
        ss.step_order,
        ss.title as step_title,
        COUNT(tr.id) as total_responses,
        AVG(tr.score) as avg_score,
        AVG(tr.response_time) as avg_response_time
      FROM scenario_steps ss
      LEFT JOIN training_responses tr ON ss.id = tr.step_id
      LEFT JOIN training_sessions ts ON tr.session_id = ts.id
      WHERE ss.scenario_id = $1 AND ts.status = 'completed'
      GROUP BY ss.id, ss.step_order, ss.title
      ORDER BY ss.step_order
    `, [scenarioId]);

    logger.info('시나리오 통계 조회', { scenarioId });

    res.json({
      success: true,
      data: {
        ...stats,
        stepStats: stepStatsResult.rows
      }
    });
  } catch (error) {
    logger.error('시나리오 통계 조회 오류', { error: error.message, scenarioId: req.params.scenarioId });
    res.status(500).json({
      success: false,
      message: '시나리오 통계 조회 중 오류가 발생했습니다.'
    });
  }
};
