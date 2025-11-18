import express from 'express'
import OrganizationController from '../controllers/organizationController.js'

const router = express.Router()

// 회사 목록 조회
router.get('/companies', OrganizationController.getCompanies)

// 부서 목록 조회
router.get('/departments', OrganizationController.getDepartments)

// 팀 목록 조회  
router.get('/teams', OrganizationController.getTeams)

// 직원 목록 조회
router.get('/employees', OrganizationController.getEmployees)

// 조직도 조회
router.get('/chart', OrganizationController.getOrganizationChart)

// 사용자 조직 정보 조회
router.get('/user', OrganizationController.getUserOrganization)

export default router
