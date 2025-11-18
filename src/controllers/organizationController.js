// 회사/부서/팀 관리 컨트롤러
import { query } from '../config/database.js';
import logger from '../config/logger.js';

// 회사 목록 조회
export const getCompanies = async (req, res) => {
  try {
    const result = await query(
      'SELECT id, name, created_at FROM companies ORDER BY name'
    );

    logger.info('회사 목록 조회', { count: result.rows.length });

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('회사 목록 조회 오류', { error: error.message });
    res.status(500).json({
      success: false,
      message: '회사 목록 조회 중 오류가 발생했습니다.'
    });
  }
};

// 특정 회사의 부서 목록 조회
export const getDepartments = async (req, res) => {
  try {
    const { companyId } = req.params;

    const result = await query(
      'SELECT id, name, created_at FROM departments WHERE company_id = $1 ORDER BY name',
      [companyId]
    );

    logger.info('부서 목록 조회', { companyId, count: result.rows.length });

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('부서 목록 조회 오류', { error: error.message, companyId: req.params.companyId });
    res.status(500).json({
      success: false,
      message: '부서 목록 조회 중 오류가 발생했습니다.'
    });
  }
};

// 특정 부서의 팀 목록 조회
export const getTeams = async (req, res) => {
  try {
    const { departmentId } = req.params;

    const result = await query(
      'SELECT id, name, created_at FROM teams WHERE department_id = $1 ORDER BY name',
      [departmentId]
    );

    logger.info('팀 목록 조회', { departmentId, count: result.rows.length });

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('팀 목록 조회 오류', { error: error.message, departmentId: req.params.departmentId });
    res.status(500).json({
      success: false,
      message: '팀 목록 조회 중 오류가 발생했습니다.'
    });
  }
};

// 특정 팀의 직원 목록 조회
export const getEmployees = async (req, res) => {
  try {
    const { teamId } = req.params;

    const result = await query(
      'SELECT id, name, position, contact, created_at FROM employees WHERE team_id = $1 ORDER BY name',
      [teamId]
    );

    logger.info('직원 목록 조회', { teamId, count: result.rows.length });

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('직원 목록 조회 오류', { error: error.message, teamId: req.params.teamId });
    res.status(500).json({
      success: false,
      message: '직원 목록 조회 중 오류가 발생했습니다.'
    });
  }
};

// 전체 조직도 조회 (계층 구조)
export const getOrganizationStructure = async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        c.id as company_id,
        c.name as company_name,
        d.id as department_id,
        d.name as department_name,
        t.id as team_id,
        t.name as team_name,
        e.id as employee_id,
        e.name as employee_name,
        e.position as employee_position
      FROM companies c
      LEFT JOIN departments d ON c.id = d.company_id
      LEFT JOIN teams t ON d.id = t.department_id
      LEFT JOIN employees e ON t.id = e.team_id
      ORDER BY c.name, d.name, t.name, e.name
    `);

    // 계층 구조로 변환
    const structure = {};
    
    result.rows.forEach(row => {
      if (!structure[row.company_id]) {
        structure[row.company_id] = {
          id: row.company_id,
          name: row.company_name,
          departments: {}
        };
      }

      if (row.department_id && !structure[row.company_id].departments[row.department_id]) {
        structure[row.company_id].departments[row.department_id] = {
          id: row.department_id,
          name: row.department_name,
          teams: {}
        };
      }

      if (row.team_id && !structure[row.company_id].departments[row.department_id].teams[row.team_id]) {
        structure[row.company_id].departments[row.department_id].teams[row.team_id] = {
          id: row.team_id,
          name: row.team_name,
          employees: []
        };
      }

      if (row.employee_id) {
        structure[row.company_id].departments[row.department_id].teams[row.team_id].employees.push({
          id: row.employee_id,
          name: row.employee_name,
          position: row.employee_position
        });
      }
    });

    // 배열로 변환
    const companies = Object.values(structure).map(company => ({
      ...company,
      departments: Object.values(company.departments).map(dept => ({
        ...dept,
        teams: Object.values(dept.teams)
      }))
    }));

    logger.info('전체 조직도 조회', { companiesCount: companies.length });

    res.json({
      success: true,
      data: companies
    });
  } catch (error) {
    logger.error('전체 조직도 조회 오류', { error: error.message });
    res.status(500).json({
      success: false,
      message: '전체 조직도 조회 중 오류가 발생했습니다.'
    });
  }
};

// 사용자의 조직 정보 조회
export const getUserOrganization = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await query(`
      SELECT 
        c.id as company_id,
        c.name as company_name,
        d.id as department_id,
        d.name as department_name,
        t.id as team_id,
        t.name as team_name,
        e.id as employee_id,
        e.name as employee_name,
        e.position as employee_position
      FROM users u
      JOIN employees e ON u.employee_id = e.id
      JOIN teams t ON e.team_id = t.id
      JOIN departments d ON t.department_id = d.id
      JOIN companies c ON d.company_id = c.id
      WHERE u.id = $1
    `, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '사용자의 조직 정보를 찾을 수 없습니다.'
      });
    }

    const userOrg = result.rows[0];

    logger.info('사용자 조직 정보 조회', { userId, companyId: userOrg.company_id });

    res.json({
      success: true,
      data: {
        company: {
          id: userOrg.company_id,
          name: userOrg.company_name
        },
        department: {
          id: userOrg.department_id,
          name: userOrg.department_name
        },
        team: {
          id: userOrg.team_id,
          name: userOrg.team_name
        },
        employee: {
          id: userOrg.employee_id,
          name: userOrg.employee_name,
          position: userOrg.employee_position
        }
      }
    });
  } catch (error) {
    logger.error('사용자 조직 정보 조회 오류', { error: error.message, userId: req.user.id });
    res.status(500).json({
      success: false,
      message: '사용자 조직 정보 조회 중 오류가 발생했습니다.'
    });
  }
};
