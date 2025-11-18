import express from 'express'
import TrainingController from '../controllers/trainingController.js'

// 미들웨어 import (필요시)
// import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// 훈련 세션 시작
router.post('/start', TrainingController.startTrainingSession)

// 훈련 응답 제출
router.post('/response', TrainingController.submitTrainingResponse)

// 훈련 세션 완료
router.post('/complete', TrainingController.completeTrainingSession)

// 훈련 세션 목록 조회
router.get('/', TrainingController.getTrainingSessions)

// 특정 훈련 세션 조회
router.get('/:id', TrainingController.getTrainingSessionById)

export default router
