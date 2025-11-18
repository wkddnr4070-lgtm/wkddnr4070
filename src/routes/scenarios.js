// 시나리오 관리 라우트
import express from 'express';
import { 
  getScenarios, 
  getScenario, 
  createScenario, 
  updateScenario, 
  deleteScenario,
  getScenarioStats 
} from '../controllers/scenarioController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { body, param, query } from 'express-validator';

const router = express.Router();

// 모든 시나리오 관련 라우트는 인증 필요
router.use(authenticateToken);

// 시나리오 목록 조회
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('페이지는 1 이상의 정수여야 합니다.'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('제한은 1-100 사이의 정수여야 합니다.'),
  query('difficulty').optional().isIn(['low', 'medium', 'high']).withMessage('난이도는 low, medium, high 중 하나여야 합니다.'),
  query('isActive').optional().isBoolean().withMessage('활성 상태는 boolean 값이어야 합니다.')
], getScenarios);

// 특정 시나리오 상세 조회
router.get('/:scenarioId', [
  param('scenarioId').isInt({ min: 1 }).withMessage('시나리오 ID는 양의 정수여야 합니다.')
], getScenario);

// 시나리오 통계 조회
router.get('/:scenarioId/stats', [
  param('scenarioId').isInt({ min: 1 }).withMessage('시나리오 ID는 양의 정수여야 합니다.')
], getScenarioStats);

// 시나리오 생성 (관리자만)
router.post('/', requireAdmin, [
  body('title').notEmpty().withMessage('제목을 입력해주세요.'),
  body('description').optional().isString().withMessage('설명은 문자열이어야 합니다.'),
  body('difficulty').isIn(['low', 'medium', 'high']).withMessage('난이도는 low, medium, high 중 하나여야 합니다.'),
  body('estimatedDuration').optional().isInt({ min: 1 }).withMessage('예상 소요시간은 양의 정수여야 합니다.'),
  body('steps').isArray({ min: 1 }).withMessage('단계는 최소 1개 이상이어야 합니다.'),
  body('steps.*.stepOrder').isInt({ min: 1 }).withMessage('단계 순서는 양의 정수여야 합니다.'),
  body('steps.*.stage').optional().isString().withMessage('단계는 문자열이어야 합니다.'),
  body('steps.*.title').notEmpty().withMessage('단계 제목을 입력해주세요.'),
  body('steps.*.description').optional().isString().withMessage('단계 설명은 문자열이어야 합니다.'),
  body('steps.*.stepType').isIn(['descriptive', 'multiple_choice']).withMessage('단계 타입은 descriptive 또는 multiple_choice여야 합니다.'),
  body('steps.*.timeLimit').optional().isInt({ min: 1 }).withMessage('시간 제한은 양의 정수여야 합니다.'),
  body('steps.*.actions').isArray({ min: 1 }).withMessage('액션은 최소 1개 이상이어야 합니다.'),
  body('steps.*.actions.*.actionText').notEmpty().withMessage('액션 텍스트를 입력해주세요.'),
  body('steps.*.actions.*.isCorrect').isBoolean().withMessage('정답 여부는 boolean 값이어야 합니다.'),
  body('steps.*.actions.*.points').optional().isInt({ min: 0 }).withMessage('점수는 0 이상의 정수여야 합니다.'),
  body('steps.*.actions.*.actionOrder').optional().isInt({ min: 1 }).withMessage('액션 순서는 양의 정수여야 합니다.')
], createScenario);

// 시나리오 수정 (관리자만)
router.put('/:scenarioId', requireAdmin, [
  param('scenarioId').isInt({ min: 1 }).withMessage('시나리오 ID는 양의 정수여야 합니다.'),
  body('title').optional().notEmpty().withMessage('제목을 입력해주세요.'),
  body('description').optional().isString().withMessage('설명은 문자열이어야 합니다.'),
  body('difficulty').optional().isIn(['low', 'medium', 'high']).withMessage('난이도는 low, medium, high 중 하나여야 합니다.'),
  body('estimatedDuration').optional().isInt({ min: 1 }).withMessage('예상 소요시간은 양의 정수여야 합니다.'),
  body('isActive').optional().isBoolean().withMessage('활성 상태는 boolean 값이어야 합니다.')
], updateScenario);

// 시나리오 삭제 (관리자만)
router.delete('/:scenarioId', requireAdmin, [
  param('scenarioId').isInt({ min: 1 }).withMessage('시나리오 ID는 양의 정수여야 합니다.')
], deleteScenario);

export default router;
