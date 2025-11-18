import express from 'express'
import ResultController from '../controllers/resultController.js'

const router = express.Router()

// 사용자 훈련 통계 조회
router.get('/stats', ResultController.getUserTrainingStats)

// 세션별 결과 조회
router.get('/:sessionId', ResultController.getSessionResults)

// 세션간 비교 분석
router.get('/compare/:sessionId1/:sessionId2', ResultController.compareSessions)

// 리포트 생성
router.get('/report/:sessionId', ResultController.generateReport)

export default router
