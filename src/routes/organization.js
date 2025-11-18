// 조직 관리 라우트
import express from 'express';
import { 
  getCompanies, 
  getDepartments, 
  getTeams, 
  getEmployees, 
  getOrganizationStructure,
  getUserOrganization 
} from '../controllers/organizationController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// 모든 조직 관련 라우트는 인증 필요
router.use(authenticateToken);

// 회사 목록 조회
router.get('/companies', getCompanies);

// 특정 회사의 부서 목록 조회
router.get('/companies/:companyId/departments', getDepartments);

// 특정 부서의 팀 목록 조회
router.get('/departments/:departmentId/teams', getTeams);

// 특정 팀의 직원 목록 조회
router.get('/teams/:teamId/employees', getEmployees);

// 전체 조직도 조회 (계층 구조)
router.get('/structure', getOrganizationStructure);

// 사용자의 조직 정보 조회
router.get('/user', getUserOrganization);

export default router;
