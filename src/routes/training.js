// 훈련 세션 관리 라우트
import express from 'express';
import { 
  startTrainingSession,
  submitTrainingResponse,
  completeTrainingSession,
  abandonTrainingSession,
  getUserTrainingSessions,
  getTrainingSession
} from '../controllers/trainingController.js';
import { authenticateToken } from '../middleware/auth.js';
import { body, param, query } from 'express-validator';

const router = express.Router();

// 모든 훈련 관련 라우트는 인증 필요
router.use(authenticateToken);

// 훈련 세션 시작
router.post('/start', [
  body('scenarioId').isInt({ min: 1 }).withMessage('시나리오 ID는 양의 정수여야 합니다.')
], startTrainingSession);

// 훈련 응답 제출
router.post('/response', [
  body('sessionId').isInt({ min: 1 }).withMessage('세션 ID는 양의 정수여야 합니다.'),
  body('stepId').isInt({ min: 1 }).withMessage('단계 ID는 양의 정수여야 합니다.'),
  body('userResponse').optional().isString().withMessage('사용자 응답은 문자열이어야 합니다.'),
  body('selectedActionId').optional().isInt({ min: 1 }).withMessage('선택된 액션 ID는 양의 정수여야 합니다.'),
  body('responseTime').optional().isInt({ min: 0 }).withMessage('응답 시간은 0 이상의 정수여야 합니다.')
], submitTrainingResponse);

// 훈련 세션 완료
router.post('/complete', [
  body('sessionId').isInt({ min: 1 }).withMessage('세션 ID는 양의 정수여야 합니다.')
], completeTrainingSession);

// 훈련 세션 중단
router.post('/abandon', [
  body('sessionId').isInt({ min: 1 }).withMessage('세션 ID는 양의 정수여야 합니다.')
], abandonTrainingSession);

// 사용자의 훈련 세션 목록 조회
router.get('/sessions', [
  query('page').optional().isInt({ min: 1 }).withMessage('페이지는 1 이상의 정수여야 합니다.'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('제한은 1-100 사이의 정수여야 합니다.'),
  query('status').optional().isIn(['in_progress', 'completed', 'abandoned']).withMessage('상태는 in_progress, completed, abandoned 중 하나여야 합니다.')
], getUserTrainingSessions);

// 특정 훈련 세션 상세 조회
router.get('/sessions/:sessionId', [
  param('sessionId').isInt({ min: 1 }).withMessage('세션 ID는 양의 정수여야 합니다.')
], getTrainingSession);

export default router;
