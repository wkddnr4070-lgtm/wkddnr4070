// 결과 저장 및 조회 컨트롤러
import { query } from '../config/database.js';
import logger from '../config/logger.js';

// 사용자의 훈련 결과 통계 조회
export const getUserTrainingStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // 전체 통계 조회
    const statsResult = await query(`
      SELECT 
        COUNT(*) as total_sessions,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_sessions,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_sessions,
        COUNT(CASE WHEN status = 'abandoned' THEN 1 END) as abandoned_sessions,
        AVG(CASE WHEN status = 'completed' THEN total_score END) as avg_score,
        AVG(CASE WHEN status = 'completed' THEN completion_percentage END) as avg_completion_rate,
        MAX(CASE WHEN status = 'completed' THEN total_score END) as best_score,
        MIN(CASE WHEN status = 'completed' THEN total_score END) as worst_score
      FROM training_sessions 
      WHERE user_id = $1
    `, [userId]);

    // 시나리오별 통계 조회
    const scenarioStatsResult = await query(`
      SELECT 
        s.id as scenario_id,
        s.title as scenario_title,
        s.difficulty,
        COUNT(ts.id) as attempt_count,
        COUNT(CASE WHEN ts.status = 'completed' THEN 1 END) as completed_count,
        AVG(CASE WHEN ts.status = 'completed' THEN ts.total_score END) as avg_score,
        AVG(CASE WHEN ts.status = 'completed' THEN ts.completion_percentage END) as avg_completion_rate,
        MAX(CASE WHEN ts.status = 'completed' THEN ts.total_score END) as best_score,
        MAX(ts.started_at) as last_attempt
      FROM scenarios s
      LEFT JOIN training_sessions ts ON s.id = ts.scenario_id AND ts.user_id = $1
      GROUP BY s.id, s.title, s.difficulty
      ORDER BY last_attempt DESC NULLS LAST
    `, [userId]);

    // 최근 훈련 기록 조회
    const recentSessionsResult = await query(`
      SELECT 
        ts.id,
        ts.scenario_id,
        s.title as scenario_title,
        s.difficulty,
        ts.status,
        ts.started_at,
        ts.completed_at,
        ts.total_score,
        ts.completion_percentage
      FROM training_sessions ts
      JOIN scenarios s ON ts.scenario_id = s.id
      WHERE ts.user_id = $1
      ORDER BY ts.started_at DESC
      LIMIT 10
    `, [userId]);

    // 단계별 성취도 분석
    const stepAnalysisResult = await query(`
      SELECT 
        ss.step_order,
        ss.title as step_title,
        ss.stage,
        COUNT(tr.id) as attempt_count,
        AVG(tr.score) as avg_score,
        AVG(tr.response_time) as avg_response_time,
        COUNT(CASE WHEN tr.score >= 80 THEN 1 END) as high_score_count,
        COUNT(CASE WHEN tr.score < 60 THEN 1 END) as low_score_count
      FROM scenario_steps ss
      JOIN training_responses tr ON ss.id = tr.step_id
      JOIN training_sessions ts ON tr.session_id = ts.id
      WHERE ts.user_id = $1 AND ts.status = 'completed'
      GROUP BY ss.id, ss.step_order, ss.title, ss.stage
      ORDER BY ss.step_order
    `, [userId]);

    const stats = statsResult.rows[0];

    logger.info('사용자 훈련 결과 통계 조회', { 
      userId, 
      totalSessions: stats.total_sessions,
      completedSessions: stats.completed_sessions 
    });

    res.json({
      success: true,
      data: {
        overall: {
          totalSessions: parseInt(stats.total_sessions),
          completedSessions: parseInt(stats.completed_sessions),
          inProgressSessions: parseInt(stats.in_progress_sessions),
          abandonedSessions: parseInt(stats.abandoned_sessions),
          avgScore: stats.avg_score ? Math.round(stats.avg_score * 100) / 100 : 0,
          avgCompletionRate: stats.avg_completion_rate ? Math.round(stats.avg_completion_rate * 100) / 100 : 0,
          bestScore: stats.best_score || 0,
          worstScore: stats.worst_score || 0
        },
        byScenario: scenarioStatsResult.rows.map(row => ({
          scenarioId: row.scenario_id,
          scenarioTitle: row.scenario_title,
          difficulty: row.difficulty,
          attemptCount: parseInt(row.attempt_count),
          completedCount: parseInt(row.completed_count),
          avgScore: row.avg_score ? Math.round(row.avg_score * 100) / 100 : 0,
          avgCompletionRate: row.avg_completion_rate ? Math.round(row.avg_completion_rate * 100) / 100 : 0,
          bestScore: row.best_score || 0,
          lastAttempt: row.last_attempt
        })),
        recentSessions: recentSessionsResult.rows,
        stepAnalysis: stepAnalysisResult.rows.map(row => ({
          stepOrder: row.step_order,
          stepTitle: row.step_title,
          stage: row.stage,
          attemptCount: parseInt(row.attempt_count),
          avgScore: Math.round(row.avg_score * 100) / 100,
          avgResponseTime: Math.round(row.avg_response_time),
          highScoreCount: parseInt(row.high_score_count),
          lowScoreCount: parseInt(row.low_score_count),
          successRate: row.attempt_count > 0 ? Math.round((row.high_score_count / row.attempt_count) * 100) : 0
        }))
      }
    });
  } catch (error) {
    logger.error('사용자 훈련 결과 통계 조회 오류', { error: error.message, userId: req.user.id });
    res.status(500).json({
      success: false,
      message: '훈련 결과 통계 조회 중 오류가 발생했습니다.'
    });
  }
};

// 훈련 결과 상세 분석
export const getTrainingAnalysis = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    // 세션 기본 정보 조회
    const sessionResult = await query(`
      SELECT 
        ts.*,
        s.title as scenario_title,
        s.difficulty,
        s.description as scenario_description
      FROM training_sessions ts
      JOIN scenarios s ON ts.scenario_id = s.id
      WHERE ts.id = $1 AND ts.user_id = $2
    `, [sessionId, userId]);

    if (sessionResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '훈련 세션을 찾을 수 없습니다.'
      });
    }

    const session = sessionResult.rows[0];

    // 단계별 상세 분석
    const stepAnalysisResult = await query(`
      SELECT 
        ss.id as step_id,
        ss.step_order,
        ss.stage,
        ss.title as step_title,
        ss.step_type,
        ss.time_limit,
        tr.user_response,
        tr.selected_action_id,
        tr.score,
        tr.response_time,
        tr.submitted_at,
        sa.action_text as selected_action_text,
        sa.is_correct as selected_action_correct,
        sa.points as selected_action_points
      FROM scenario_steps ss
      LEFT JOIN training_responses tr ON ss.id = tr.step_id AND tr.session_id = $1
      LEFT JOIN scenario_actions sa ON tr.selected_action_id = sa.id
      WHERE ss.scenario_id = $2
      ORDER BY ss.step_order
    `, [sessionId, session.scenario_id]);

    // 전체 통계 계산
    const totalSteps = stepAnalysisResult.rows.length;
    const answeredSteps = stepAnalysisResult.rows.filter(row => row.score !== null).length;
    const totalScore = stepAnalysisResult.rows.reduce((sum, row) => sum + (row.score || 0), 0);
    const avgResponseTime = stepAnalysisResult.rows
      .filter(row => row.response_time !== null)
      .reduce((sum, row) => sum + row.response_time, 0) / answeredSteps || 0;

    // 단계별 성취도 분석
    const stepPerformance = stepAnalysisResult.rows.map(row => {
      const isAnswered = row.score !== null;
      const isCorrect = row.score >= 60; // 60점 이상을 정답으로 간주
      const timeEfficiency = row.time_limit && row.response_time ? 
        (row.response_time / row.time_limit) * 100 : null;

      return {
        stepId: row.step_id,
        stepOrder: row.step_order,
        stage: row.stage,
        stepTitle: row.step_title,
        stepType: row.step_type,
        timeLimit: row.time_limit,
        isAnswered,
        userResponse: row.user_response,
        selectedAction: row.selected_action_text,
        isCorrect: row.selected_action_correct,
        score: row.score || 0,
        responseTime: row.response_time,
        timeEfficiency: timeEfficiency ? Math.round(timeEfficiency) : null,
        submittedAt: row.submitted_at,
        performance: {
          excellent: row.score >= 90,
          good: row.score >= 70 && row.score < 90,
          fair: row.score >= 60 && row.score < 70,
          poor: row.score < 60
        }
      };
    });

    // 단계별 통계
    const stageStats = {};
    stepPerformance.forEach(step => {
      if (!stageStats[step.stage]) {
        stageStats[step.stage] = {
          totalSteps: 0,
          answeredSteps: 0,
          totalScore: 0,
          avgScore: 0,
          avgResponseTime: 0
        };
      }
      
      stageStats[step.stage].totalSteps++;
      if (step.isAnswered) {
        stageStats[step.stage].answeredSteps++;
        stageStats[step.stage].totalScore += step.score;
        stageStats[step.stage].avgResponseTime += step.responseTime || 0;
      }
    });

    // 평균 계산
    Object.keys(stageStats).forEach(stage => {
      const stats = stageStats[stage];
      stats.avgScore = stats.answeredSteps > 0 ? 
        Math.round((stats.totalScore / stats.answeredSteps) * 100) / 100 : 0;
      stats.avgResponseTime = stats.answeredSteps > 0 ? 
        Math.round(stats.avgResponseTime / stats.answeredSteps) : 0;
    });

    logger.info('훈련 결과 상세 분석 조회', { sessionId, userId });

    res.json({
      success: true,
      data: {
        session: {
          id: session.id,
          scenarioId: session.scenario_id,
          scenarioTitle: session.scenario_title,
          difficulty: session.difficulty,
          status: session.status,
          startedAt: session.started_at,
          completedAt: session.completed_at,
          totalScore: session.total_score,
          completionPercentage: session.completion_percentage
        },
        summary: {
          totalSteps,
          answeredSteps,
          unansweredSteps: totalSteps - answeredSteps,
          totalScore,
          avgScore: answeredSteps > 0 ? Math.round((totalScore / answeredSteps) * 100) / 100 : 0,
          avgResponseTime: Math.round(avgResponseTime),
          completionRate: Math.round((answeredSteps / totalSteps) * 100)
        },
        stageStats,
        stepPerformance
      }
    });
  } catch (error) {
    logger.error('훈련 결과 상세 분석 조회 오류', { error: error.message, sessionId: req.params.sessionId, userId: req.user.id });
    res.status(500).json({
      success: false,
      message: '훈련 결과 분석 조회 중 오류가 발생했습니다.'
    });
  }
};

// 훈련 결과 비교 분석 (여러 세션 비교)
export const compareTrainingResults = async (req, res) => {
  try {
    const { sessionIds } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(sessionIds) || sessionIds.length < 2) {
      return res.status(400).json({
        success: false,
        message: '비교할 세션 ID를 최소 2개 이상 제공해주세요.'
      });
    }

    // 세션들 조회
    const sessionsResult = await query(`
      SELECT 
        ts.id,
        ts.scenario_id,
        s.title as scenario_title,
        ts.status,
        ts.started_at,
        ts.completed_at,
        ts.total_score,
        ts.completion_percentage
      FROM training_sessions ts
      JOIN scenarios s ON ts.scenario_id = s.id
      WHERE ts.id = ANY($1) AND ts.user_id = $2 AND ts.status = 'completed'
    `, [sessionIds, userId]);

    if (sessionsResult.rows.length !== sessionIds.length) {
      return res.status(400).json({
        success: false,
        message: '일부 세션을 찾을 수 없거나 완료되지 않은 세션이 있습니다.'
      });
    }

    // 각 세션의 단계별 성능 비교
    const comparisonData = await Promise.all(
      sessionsResult.rows.map(async (session) => {
        const stepResults = await query(`
          SELECT 
            ss.step_order,
            ss.title as step_title,
            ss.stage,
            tr.score,
            tr.response_time
          FROM scenario_steps ss
          LEFT JOIN training_responses tr ON ss.id = tr.step_id AND tr.session_id = $1
          WHERE ss.scenario_id = $2
          ORDER BY ss.step_order
        `, [session.id, session.scenario_id]);

        return {
          sessionId: session.id,
          scenarioTitle: session.scenario_title,
          startedAt: session.started_at,
          completedAt: session.completed_at,
          totalScore: session.total_score,
          completionPercentage: session.completion_percentage,
          steps: stepResults.rows.map(step => ({
            stepOrder: step.step_order,
            stepTitle: step.step_title,
            stage: step.stage,
            score: step.score || 0,
            responseTime: step.response_time || 0
          }))
        };
      })
    );

    // 통계 계산
    const stats = {
      avgScores: comparisonData.map(session => ({
        sessionId: session.sessionId,
        avgScore: session.steps.reduce((sum, step) => sum + step.score, 0) / session.steps.length
      })),
      avgResponseTimes: comparisonData.map(session => ({
        sessionId: session.sessionId,
        avgResponseTime: session.steps.reduce((sum, step) => sum + step.responseTime, 0) / session.steps.length
      })),
      improvement: comparisonData.length >= 2 ? {
        scoreImprovement: comparisonData[comparisonData.length - 1].totalScore - comparisonData[0].totalScore,
        timeImprovement: comparisonData[0].steps.reduce((sum, step) => sum + step.responseTime, 0) - 
                        comparisonData[comparisonData.length - 1].steps.reduce((sum, step) => sum + step.responseTime, 0)
      } : null
    };

    logger.info('훈련 결과 비교 분석 조회', { sessionIds, userId });

    res.json({
      success: true,
      data: {
        sessions: comparisonData,
        stats
      }
    });
  } catch (error) {
    logger.error('훈련 결과 비교 분석 조회 오류', { error: error.message, userId: req.user.id });
    res.status(500).json({
      success: false,
      message: '훈련 결과 비교 분석 중 오류가 발생했습니다.'
    });
  }
};

// 훈련 결과 리포트 생성
export const generateTrainingReport = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    // 세션 정보 조회
    const sessionResult = await query(`
      SELECT 
        ts.*,
        s.title as scenario_title,
        s.difficulty,
        s.description as scenario_description,
        u.username,
        e.name as employee_name,
        e.position,
        c.name as company_name,
        d.name as department_name,
        t.name as team_name
      FROM training_sessions ts
      JOIN scenarios s ON ts.scenario_id = s.id
      JOIN users u ON ts.user_id = u.id
      JOIN employees e ON u.employee_id = e.id
      JOIN teams t ON e.team_id = t.id
      JOIN departments d ON t.department_id = d.id
      JOIN companies c ON d.company_id = c.id
      WHERE ts.id = $1 AND ts.user_id = $2
    `, [sessionId, userId]);

    if (sessionResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '훈련 세션을 찾을 수 없습니다.'
      });
    }

    const session = sessionResult.rows[0];

    // 단계별 결과 조회
    const stepResults = await query(`
      SELECT 
        ss.step_order,
        ss.stage,
        ss.title as step_title,
        ss.step_type,
        tr.score,
        tr.response_time,
        tr.user_response,
        sa.action_text as selected_action_text,
        sa.is_correct
      FROM scenario_steps ss
      LEFT JOIN training_responses tr ON ss.id = tr.step_id AND tr.session_id = $1
      LEFT JOIN scenario_actions sa ON tr.selected_action_id = sa.id
      WHERE ss.scenario_id = $2
      ORDER BY ss.step_order
    `, [sessionId, session.scenario_id]);

    // 리포트 생성
    const report = {
      sessionInfo: {
        sessionId: session.id,
        scenarioTitle: session.scenario_title,
        difficulty: session.difficulty,
        status: session.status,
        startedAt: session.started_at,
        completedAt: session.completed_at,
        totalScore: session.total_score,
        completionPercentage: session.completion_percentage
      },
      userInfo: {
        username: session.username,
        employeeName: session.employee_name,
        position: session.position,
        company: session.company_name,
        department: session.department_name,
        team: session.team_name
      },
      results: stepResults.rows.map(step => ({
        stepOrder: step.step_order,
        stage: step.stage,
        stepTitle: step.step_title,
        stepType: step.step_type,
        score: step.score || 0,
        responseTime: step.response_time || 0,
        userResponse: step.user_response,
        selectedAction: step.selected_action_text,
        isCorrect: step.is_correct,
        performance: step.score >= 80 ? '우수' : 
                    step.score >= 60 ? '양호' : 
                    step.score > 0 ? '미흡' : '미응답'
      })),
      summary: {
        totalSteps: stepResults.rows.length,
        answeredSteps: stepResults.rows.filter(step => step.score !== null).length,
        avgScore: stepResults.rows.filter(step => step.score !== null)
          .reduce((sum, step) => sum + step.score, 0) / 
          stepResults.rows.filter(step => step.score !== null).length || 0,
        avgResponseTime: stepResults.rows.filter(step => step.response_time !== null)
          .reduce((sum, step) => sum + step.response_time, 0) / 
          stepResults.rows.filter(step => step.response_time !== null).length || 0
      },
      generatedAt: new Date().toISOString()
    };

    logger.info('훈련 결과 리포트 생성', { sessionId, userId });

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    logger.error('훈련 결과 리포트 생성 오류', { error: error.message, sessionId: req.params.sessionId, userId: req.user.id });
    res.status(500).json({
      success: false,
      message: '훈련 결과 리포트 생성 중 오류가 발생했습니다.'
    });
  }
};
