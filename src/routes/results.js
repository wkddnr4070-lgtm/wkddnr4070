// 결과 저장 및 조회 라우트
import express from 'express';
import { 
  getUserTrainingStats,
  getTrainingAnalysis,
  compareTrainingResults,
  generateTrainingReport
} from '../controllers/resultController.js';
import { authenticateToken } from '../middleware/auth.js';
import { body, param } from 'express-validator';

const router = express.Router();

// 모든 결과 관련 라우트는 인증 필요
router.use(authenticateToken);

// 사용자의 훈련 결과 통계 조회
router.get('/stats', getUserTrainingStats);

// 훈련 결과 상세 분석
router.get('/analysis/:sessionId', [
  param('sessionId').isInt({ min: 1 }).withMessage('세션 ID는 양의 정수여야 합니다.')
], getTrainingAnalysis);

// 훈련 결과 비교 분석
router.post('/compare', [
  body('sessionIds').isArray({ min: 2 }).withMessage('비교할 세션 ID를 최소 2개 이상 제공해주세요.'),
  body('sessionIds.*').isInt({ min: 1 }).withMessage('세션 ID는 양의 정수여야 합니다.')
], compareTrainingResults);

// 훈련 결과 리포트 생성
router.get('/report/:sessionId', [
  param('sessionId').isInt({ min: 1 }).withMessage('세션 ID는 양의 정수여야 합니다.')
], generateTrainingReport);

export default router;
