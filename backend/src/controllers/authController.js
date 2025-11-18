import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dbManager from '../database/index.js'
import config from '../config/index.js'
import logger from '../config/logger.js'

// 인증 관련 컨트롤러
export default {
  // 회원가입
  register: async (req, res) => {
    try {
      const { username, password, name, position, company, department, team } = req.body
      
      // 필수 필드 검증
      if (!username || !password || !name) {
        return res.status(400).json({
          success: false,
          message: '필수 필드가 누락되었습니다 (username, password, name)'
        })
      }

      // 비밀번호 강도 검증
      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message: '비밀번호는 최소 8자 이상이어야 합니다'
        })
      }

      const database = await dbManager.getDatabase()

      // 중복 사용자 검사
      let existingUser = null
      if (database.clientType === 'sqlite') {
        const result = database.query(
          'SELECT id FROM users WHERE username = ?',
          [username]
        )
        existingUser = result.rows?.[0]
      } else {
        const result = await database.query(
          'SELECT id FROM users WHERE username = $1',
          [username]
        )
        existingUser = result.rows[0]
      }

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: '이미 존재하는 사용자명입니다'
        })
      }

      // 비밀번호 해싱
      const saltRounds = 12
      const passwordHash = await bcrypt.hash(password, saltRounds)

      // 조직 구조 생성 (회사 → 부서 → 팀 → 직원 → 사용자)
      let userId = null
      
      if (database.clientType === 'sqlite') {
        // SQLite 방식
        const companyId = database.query(
          'INSERT INTO companies (name) VALUES (?) RETURNING id',
          [company || '기본 회사']
        ).lastInsertRowid

        const departmentId = database.query(
          'INSERT INTO departments (company_id, name) VALUES (?, ?) RETURNING id',
          [companyId || 1, department || '기본 부서']
        ).lastInsertRowid

        const teamId = database.query(
          'INSERT INTO teams (department_id, name) VALUES (?, ?) RETURNING id',
          [departmentId || 1, team || '기본 팀']
        ).lastInsertRowid

        const employeeId = database.query(
          'INSERT INTO employees (team_id, name, position) VALUES (?, ?, ?) RETURNING id',
          [teamId || 1, name, position || '직원']
        ).lastInsertRowid

        userId = database.query(
          'INSERT INTO users (employee_id, username, password_hash) VALUES (?, ?, ?) RETURNING id',
          [employeeId, username, passwordHash]
        ).lastInsertRowid
      } else {
        // PostgreSQL 방식
        const companyResult = await database.query(
          'INSERT INTO companies (name) VALUES ($1) RETURNING id',
          [company || '기본 회사']
        )
        const companyId = companyResult.rows[0].id

        const departmentResult = await database.query(
          'INSERT INTO departments (company_id, name) VALUES ($1, $2) RETURNING id',
          [companyId, department || '기본 부서']
        )
        const departmentId = departmentResult.rows[0].id

        const teamResult = await database.query(
          'INSERT INTO teams (department_id, name) VALUES ($1, $2) RETURNING id',
          [departmentId, team || '기본 팀']
        )
        const teamId = teamResult.rows[0].id

        const employeeResult = await database.query(
          'INSERT INTO employees (team_id, name, position) VALUES ($1, $2, $3) RETURNING id',
          [teamId, name, position || '직원']
        )
        const employeeId = employeeResult.rows[0].id

        const userResult = await database.query(
          'INSERT INTO users (employee_id, username, password_hash) VALUES ($1, $2, $3) RETURNING id',
          [employeeId, username, passwordHash]
        )
        userId = userResult.rows[0].id
      }

      logger.info('새 사용자 등록됨', { username, userId })
      
      res.status(201).json({
        success: true,
        message: '회원가입 완료',
        data: {
          userId,
          username,
          name,
          position: position || '직원',
          company: company || '기본 회사'
        }
      })
    } catch (error) {
      logger.error('회원가입 실패', { error: error.message })
      res.status(500).json({
        success: false,
        message: '회원가입 실패',
        error: process.env.NODE_ENV === 'development' ? error.message : '서버 오류'
      })
    }
  },

  // 로그인
  login: async (req, res) => {
    try {
      const { username, password } = req.body
      
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: '사용자명과 비밀번호를 입력해주세요'
        })
      }

      const database = await dbManager.getDatabase()

      // 사용자 정보 조회
      let user = null
      let organization = null

      if (database.clientType === 'sqlite') {
        const result = database.query(`
          SELECT u.id, u.username, u.password_hash, u.last_login,
                 e.name, e.position,
                 t.name as team_name,
                 d.name as department_name, 
                 c.name as company_name
          FROM users u
          JOIN employees e ON u.employee_id = e.id
          JOIN teams t ON e.team_id = t.id
          JOIN departments d ON t.department_id = d.id
          JOIN companies c ON d.company_id = c.id
          WHERE u.username = ? AND u.is_active = true
        `, [username])
        
        user = result.rows?.[0]
        organization = result.rows?.[0]
      } else {
        const result = await database.query(`
          SELECT u.id, u.username, u.password_hash, u.last_login,
                 e.name, e.position,
                 t.name as team_name,
                 d.name as department_name, 
                 c.name as company_name
          FROM users u
          JOIN employees e ON u.employee_id = e.id
          JOIN teams t ON e.team_id = t.id
          JOIN departments d ON t.department_id = d.id
          JOIN companies c ON d.company_id = c.id
          WHERE u.username = $1 AND u.is_active = true
        `, [username])
        
        user = result.rows[0]
        organization = result.rows[0]
      }

      if (!user) {
        logger.warn('로그인 시도 - 존재하지 않는 사용자', { username })
        return res.status(401).json({
          success: false,
          message: '로그인 실패: 잘못된 자격증명'
        })
      }

      // 비밀번호 검증
      const isValidPassword = await bcrypt.compare(password, user.password_hash)
      if (!isValidPassword) {
        logger.warn('로그인 시도 - 잘못된 비밀번호', { username })
        return res.status(401).json({
          success: false,
          message: '로그인 실패: 잘못된 자격증명'
        })
      }

      // JWT 토큰 생성
      const tokenPayload = {
        userId: user.id,
        username: user.username,
        company: organization.company_name,
        department: organization.department_name,
        team: organization.team_name,
        position: organization.position
      }

      const token = jwt.sign(tokenPayload, config.auth.jwtSecret, {
        expiresIn: config.auth.jwtExpiresIn
      })

      // 마지막 로그인 시간 업데이트
      const now = new Date().toISOString()
      if (database.clientType === 'sqlite') {
        database.query(
          'UPDATE users SET last_login = ? WHERE id = ?',
          [now, user.id]
        )
      } else {
        await database.query(
          'UPDATE users SET last_login = $1 WHERE id = $2',
          [now, user.id]
        )
      }

      logger.info('로그인 성공', { 
        username, 
        userId: user.id,
        company: organization.company_name 
      })

      res.json({
        success: true,
        message: '로그인 성공',
        data: {
          token,
          user: {
            id: user.id,
            username: user.username,
            name: user.name,
            position: organization.position,
            company: organization.company_name,
            department: organization.department_name,
            team: organization.team_name
          }
        }
      })
    } catch (error) {
      logger.error('로그인 오류', { error: error.message })
      res.status(500).json({
        success: false,
        message: '로그인 오류',
        error: process.env.NODE_ENV === 'development' ? error.message : '서버 오류'
      })
    }
  },

  // 프로필 조회
  getProfile: async (req, res) => {
    try {
      res.json({
        success: true,
        message: '프로필 조회 API (구현 예정)',
        data: {
          user: {
            id: 1,
            name: 'testuser',
            company: '테스트 회사',
            department: '개발팀',
            position: '개발자'
          }
        }
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '프로필 조회 오류',
        error: error.message
      })
    }
  },

  // 로그아웃
  logout: async (req, res) => {
    try {
      res.json({
        success: true,
        message: '로그아웃 성공'
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '로그아웃 오류',
        error: error.message
      })
    }
  },

  // 토큰 갱신
  refreshToken: async (req, res) => {
    try {
      res.json({
        success: true,
        message: '토큰 갱신 API (구현 예정)',
        data: {
          token: 'refreshed-mock-token-' + Date.now()
        }
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '토큰 갱신 오류',
        error: error.message
      })
    }
  }
}
