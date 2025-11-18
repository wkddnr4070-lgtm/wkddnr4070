import express from 'express'
import ScenarioController from '../controllers/scenarioController.js'

const router = express.Router()

// 시나리오 생성
router.post('/', ScenarioController.createScenario)

// 시나리오 목록 조회
router.get('/', ScenarioController.getScenarios)

// 특정 시나리오 조회
router.get('/:id', ScenarioController.getScenarioById)

// 시나리오 수정
router.put('/:id', ScenarioController.updateScenario)

// 시나리오 삭제
router.delete('/:id', ScenarioController.deleteScenario)

// 시나리오 통계 조회
router.get('/:id/stats', ScenarioController.getScenarioStats)

export default router
