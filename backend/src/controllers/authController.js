import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dbManager from '../database/index.js'
import config from '../config/index.js'
import logger from '../config/logger.js'

// 인증 관련 컨트롤러
export default {
  // 회원가입 (엔터프라이즈 - 회사, 부서, 팀, 사번, 연락처 포함)
  register: async (req, res) => {
    try {
      const {
        username,
        password,
        email,
        name,
        employeeId,
        position,
        contact,
        company,
        department,
        team
      } = req.body

      console.log('📝 회원가입 요청:', { username, email, name, employeeId, company, department, team })

      // 입력 검증
      if (!username || !password || !email || !name || !employeeId || !position || !contact) {
        return res.status(400).json({
          success: false,
          message: '필수 입력 항목을 모두 입력해주세요'
        })
      }

      if (!company || !department || !team) {
        return res.status(400).json({
          success: false,
          message: '회사, 부서, 팀을 모두 선택해주세요'
        })
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: '비밀번호는 최소 6자 이상이어야 합니다'
        })
      }

      const database = dbManager.getDatabase()
      console.log('🗄️ 데이터베이스 타입:', database.clientType)

      // 트랜잭션 시작
      await database.transaction(async (trx) => {
        // 1. 회사 확인 및 생성 (없으면 생성)
        let companyId = company
        if (typeof company === 'string' && isNaN(company)) {
          // 회사명으로 전달된 경우 ID 조회 또는 생성
          const companyResult = await trx.query(
            database.clientType === 'sqlite'
              ? 'SELECT id FROM companies WHERE name = ?'
              : 'SELECT id FROM companies WHERE name = $1',
            [company]
          )
          
          if (companyResult.rows && companyResult.rows.length > 0) {
            companyId = companyResult.rows[0].id
          } else {
            // 새 회사 생성
            const newCompany = await trx.query(
              database.clientType === 'sqlite'
                ? 'INSERT INTO companies (name) VALUES (?) RETURNING id'
                : 'INSERT INTO companies (name) VALUES ($1) RETURNING id',
              [company]
            )
            companyId = newCompany.rows[0].id
          }
        }

        // 2. 부서 확인 및 생성
        let departmentId = department
        if (typeof department === 'string' && isNaN(department)) {
          const deptResult = await trx.query(
            database.clientType === 'sqlite'
              ? 'SELECT id FROM departments WHERE company_id = ? AND name = ?'
              : 'SELECT id FROM departments WHERE company_id = $1 AND name = $2',
            [companyId, department]
          )
          
          if (deptResult.rows && deptResult.rows.length > 0) {
            departmentId = deptResult.rows[0].id
          } else {
            const newDept = await trx.query(
              database.clientType === 'sqlite'
                ? 'INSERT INTO departments (company_id, name) VALUES (?, ?) RETURNING id'
                : 'INSERT INTO departments (company_id, name) VALUES ($1, $2) RETURNING id',
              [companyId, department]
            )
            departmentId = newDept.rows[0].id
          }
        }

        // 3. 팀 확인 및 생성
        let teamId = team
        if (typeof team === 'string' && isNaN(team)) {
          const teamResult = await trx.query(
            database.clientType === 'sqlite'
              ? 'SELECT id FROM teams WHERE department_id = ? AND name = ?'
              : 'SELECT id FROM teams WHERE department_id = $1 AND name = $2',
            [departmentId, team]
          )
          
          if (teamResult.rows && teamResult.rows.length > 0) {
            teamId = teamResult.rows[0].id
          } else {
            const newTeam = await trx.query(
              database.clientType === 'sqlite'
                ? 'INSERT INTO teams (department_id, name) VALUES (?, ?) RETURNING id'
                : 'INSERT INTO teams (department_id, name) VALUES ($1, $2) RETURNING id',
              [departmentId, team]
            )
            teamId = newTeam.rows[0].id
          }
        }

        // 4. 사용자명 중복 확인
        const existingUser = await trx.query(
          database.clientType === 'sqlite'
            ? 'SELECT id FROM users WHERE username = ?'
            : 'SELECT id FROM users WHERE username = $1',
          [username]
        )

        if (existingUser.rows && existingUser.rows.length > 0) {
          throw new Error('이미 사용 중인 사용자명입니다')
        }

        // 5. 직원 생성
        const employeeResult = await trx.query(
          database.clientType === 'sqlite'
            ? 'INSERT INTO employees (team_id, name, position, contact) VALUES (?, ?, ?, ?) RETURNING id'
            : 'INSERT INTO employees (team_id, name, position, contact) VALUES ($1, $2, $3, $4) RETURNING id',
          [teamId, name, position, contact]
        )
        const employeeId = employeeResult.rows[0].id

        // 6. 비밀번호 해시
        const passwordHash = await bcrypt.hash(password, 10)

        // 7. 사용자 계정 생성
        const userResult = await trx.query(
          database.clientType === 'sqlite'
            ? 'INSERT INTO users (employee_id, username, password_hash, email) VALUES (?, ?, ?, ?) RETURNING id, username, email'
            : 'INSERT INTO users (employee_id, username, password_hash, email) VALUES ($1, $2, $3, $4) RETURNING id, username, email',
          [employeeId, username, passwordHash, email]
        )
        const userId = userResult.rows[0].id

        // 8. 조직 정보 조회
        const orgResult = await trx.query(
          database.clientType === 'sqlite'
            ? `SELECT c.name as company_name, d.name as department_name, t.name as team_name
               FROM users u
               JOIN employees e ON u.employee_id = e.id
               JOIN teams t ON e.team_id = t.id
               JOIN departments d ON t.department_id = d.id
               JOIN companies c ON d.company_id = c.id
               WHERE u.id = ?`
            : `SELECT c.name as company_name, d.name as department_name, t.name as team_name
               FROM users u
               JOIN employees e ON u.employee_id = e.id
               JOIN teams t ON e.team_id = t.id
               JOIN departments d ON t.department_id = d.id
               JOIN companies c ON d.company_id = c.id
               WHERE u.id = $1`,
          [userId]
        )

        const organization = orgResult.rows[0]

        return res.json({
          success: true,
          message: '회원가입이 완료되었습니다',
          data: {
            user: {
              id: userId,
              username: userResult.rows[0].username,
              email: userResult.rows[0].email,
              name,
              employeeId,
              position,
              contact,
              company: organization.company_name,
              department: organization.department_name,
              team: organization.team_name
            }
          }
        })
      })
    } catch (error) {
      console.error('💥 회원가입 오류:', error)
      logger.error('회원가입 오류', { error: error.message })
      
      if (error.message.includes('UNIQUE constraint') || error.message.includes('중복')) {
        return res.status(409).json({
          success: false,
          message: '이미 사용 중인 사용자명입니다'
        })
      }

      res.status(500).json({
        success: false,
        message: '회원가입 중 오류가 발생했습니다',
        error: process.env.NODE_ENV === 'development' ? error.message : '서버 오류'
      })
    }
  },

  // 로그인
  login: async (req, res) => {
    try {
      const { username, password } = req.body
      
      console.log('🔐 로그인 요청:', { username, passwordLength: password?.length })
      
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: '사용자명과 비밀번호를 입력해주세요'
        })
      }

      // 임시 하드코딩된 관리자 계정 (데이터베이스 문제 우회)
      if (username === 'admin' && password === 'admin123') {
        console.log('✅ 하드코딩 관리자 계정 로그인')
        
        const tokenPayload = {
          userId: 1,
          username: 'admin',
          company: 'SHE Safety Hub',
          department: '안전관리부',
          team: '비상대응팀',
          position: '관리자'
        }

        const token = jwt.sign(tokenPayload, config.auth.jwtSecret, {
          expiresIn: config.auth.jwtExpiresIn
        })

        return res.json({
          success: true,
          message: '로그인 성공',
          data: {
            token,
            user: {
              id: 1,
              username: 'admin',
              name: '시스템 관리자',
              position: '관리자',
              company: 'SHE Safety Hub',
              department: '안전관리부',
              team: '비상대응팀'
            }
          }
        })
      }

      const database = dbManager.getDatabase()
      console.log('🗄️ 데이터베이스 타입:', database.clientType)

      // 사용자 정보 조회
      let user = null
      let organization = null

      try {
        if (database.clientType === 'sqlite') {
          console.log('📊 SQLite 사용자 조회 시작...')
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
            WHERE u.username = ? AND u.is_active = 1
          `, [username])
          
          console.log('📊 SQLite 조회 결과:', result)
          user = result.rows?.[0]
          organization = result.rows?.[0]
        } else {
          console.log('🐘 PostgreSQL 사용자 조회 시작...')
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
      } catch (dbError) {
        console.error('🚫 데이터베이스 조회 오류:', dbError.message)
        // 데이터베이스 오류 시 하드코딩 계정 확인
        if (username === 'admin' && password === 'admin123') {
          console.log('🔄 DB 오류로 인한 하드코딩 계정 사용')
          const tokenPayload = {
            userId: 1,
            username: 'admin',
            company: 'SHE Safety Hub',
            department: '안전관리부',
            team: '비상대응팀',
            position: '관리자'
          }

          const token = jwt.sign(tokenPayload, config.auth.jwtSecret, {
            expiresIn: config.auth.jwtExpiresIn
          })

          return res.json({
            success: true,
            message: '로그인 성공 (임시 계정)',
            data: {
              token,
              user: {
                id: 1,
                username: 'admin',
                name: '시스템 관리자',
                position: '관리자',
                company: 'SHE Safety Hub',
                department: '안전관리부',
                team: '비상대응팀'
              }
            }
          })
        }
      }

      console.log('👤 사용자 조회 결과:', user ? '사용자 발견' : '사용자 없음')

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
      console.error('💥 로그인 오류:', error.message, error.stack)
      logger.error('로그인 오류', { error: error.message })
      res.status(500).json({
        success: false,
        message: '로그인 오류',
        error: process.env.NODE_ENV === 'development' ? error.message : '서버 오류'
      })
    }
  },

  // 프로필 조회 (인증 미들웨어를 통해 req.user 사용)
  getProfile: async (req, res) => {
    try {
      if (!req.user || !req.user.userId) {
        return res.status(401).json({
          success: false,
          message: '인증이 필요합니다'
        })
      }

      const database = dbManager.getDatabase()
      const userId = req.user.userId

      // 데이터베이스에서 사용자 정보 조회
      const result = await database.query(
        database.clientType === 'sqlite'
          ? `SELECT u.id, u.username, u.email, e.name, e.position, e.contact,
                    c.name as company_name, d.name as department_name, t.name as team_name
             FROM users u
             JOIN employees e ON u.employee_id = e.id
             JOIN teams t ON e.team_id = t.id
             JOIN departments d ON t.department_id = d.id
             JOIN companies c ON d.company_id = c.id
             WHERE u.id = ?`
          : `SELECT u.id, u.username, u.email, e.name, e.position, e.contact,
                    c.name as company_name, d.name as department_name, t.name as team_name
             FROM users u
             JOIN employees e ON u.employee_id = e.id
             JOIN teams t ON e.team_id = t.id
             JOIN departments d ON t.department_id = d.id
             JOIN companies c ON d.company_id = c.id
             WHERE u.id = $1`,
        [userId]
      )

      if (!result.rows || result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: '사용자를 찾을 수 없습니다'
        })
      }

      const userData = result.rows[0]

      return res.json({
        success: true,
        data: {
          user: {
            id: userData.id,
            username: userData.username,
            email: userData.email,
            name: userData.name,
            position: userData.position,
            contact: userData.contact,
            company: userData.company_name,
            department: userData.department_name,
            team: userData.team_name
          }
        }
      })
    } catch (error) {
      console.error('프로필 조회 오류:', error)
      logger.error('프로필 조회 오류', { error: error.message, userId: req.user?.userId })
      res.status(500).json({
        success: false,
        message: '프로필 조회 오류',
        error: process.env.NODE_ENV === 'development' ? error.message : '서버 오류'
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
