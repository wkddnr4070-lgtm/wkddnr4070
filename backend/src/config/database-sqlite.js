import Database from 'better-sqlite3'
import config from './index.js'
import logger from './logger.js'
import fs from 'fs'
import path from 'path'

class SQLiteDatabase {
  constructor() {
    this.db = null
    this.isConnected = false
    this.dbPath = path.resolve(process.cwd(), '../data/gas_training.db')
  }

  // 데이터베이스 연결
  async connect() {
    try {
      if (!this.db) {
        // 데이터 디렉토리 생성
        const dataDir = path.dirname(this.dbPath)
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true })
        }

        // SQLite 데이터베이스 연결
        this.db = new Database(this.dbPath)
        
        // 프래그마 설정 (WAL 모드로 성능 최적화)
        this.db.pragma('journal_mode = WAL')
        this.db.pragma('foreign_keys = ON')
        
        this.isConnected = true
        
        logger.info('SQLite 데이터베이스 연결 성공', {
          path: this.dbPath
        })
        
        console.log('✅ SQLite 데이터베이스 연결 성공!')
        console.log(`📂 데이터베이스 파일: ${this.dbPath}`)
      }
      return this.db
    } catch (error) {
      this.isConnected = false
      logger.error('SQLite 데이터베이스 연결 실패', {
        error: error.message,
        path: this.dbPath
      })
      
      console.log('❌ SQLite 데이터베이스 연결 실패:')
      console.log(`   경로: ${this.dbPath}`)
      console.log(`   오류: ${error.message}`)
      
      throw error
    }
  }

  // 쿼리 실행 (단일)
  query(sql, params = []) {
    try {
      if (!this.db) {
        this.connect()
      }
      
      if (sql.trim().toUpperCase().startsWith('SELECT')) {
        const stmt = this.db.prepare(sql)
        return { rows: stmt.all(params) }
      } else {
        const stmt = this.db.prepare(sql)
        const result = stmt.run(params)
        return { 
          rowCount: result.changes, 
          lastInsertRowid: result.lastInsertRowid 
        }
      }
    } catch (error) {
      logger.error('SQLite 쿼리 오류', {
        query: sql,
        params,
        error: error.message
      })
      throw error
    }
  }

  // 트랜잭션 실행
  async transaction(callback) {
    try {
      if (!this.db) {
        console.log('데이터베이스 연결 없음, 연결 시도 중...')
        await this.connect()
      }
      
      const transaction = this.db.transaction(callback)
      return transaction()
    } catch (error) {
      logger.error('SQLite 트랜잭션 오류', {
        error: error.message
      })
      throw error
    }
  }

  // 연결 해제
  async disconnect() {
    try {
      if (this.db) {
        this.db.close()
        this.db = null
        this.isConnected = false
        logger.info('SQLite 데이터베이스 연결 해제')
        console.log('🔌 SQLite 데이터베이스 연결 해제됨')
      }
    } catch (error) {
      logger.error('SQLite 연결 해제 오류', {
        error: error.message
      })
    }
  }

  // 연결 상태 확인
  async healthCheck() {
    try {
      if (!this.db) {
        await this.connect()
      }
      
      const result = this.query('SELECT datetime("now") as current_time')
      return {
        status: 'healthy',
        timestamp: result.rows[0].current_time,
        connected: true,
        type: 'SQLite'
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        connected: false,
        type: 'SQLite'
      }
    }
  }

  // 테이블 생성
  async createTables() {
    const createTablesSQL = `
      -- 회사 테이블
      CREATE TABLE IF NOT EXISTS companies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- 부서 테이블
      CREATE TABLE IF NOT EXISTS departments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
        UNIQUE(company_id, name)
      );

      -- 팀 테이블
      CREATE TABLE IF NOT EXISTS teams (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        department_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
        UNIQUE(department_id, name)
      );

      -- 직원 테이블
      CREATE TABLE IF NOT EXISTS employees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        team_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        position TEXT NOT NULL,
        contact TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
      );

      -- 사용자 테이블
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id INTEGER UNIQUE,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        email TEXT,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
      );

      -- 시나리오 테이블
      CREATE TABLE IF NOT EXISTS scenarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        difficulty TEXT,
        estimated_time INTEGER,
        categories TEXT,
        timeline TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- 훈련 세션 테이블
      CREATE TABLE IF NOT EXISTS training_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        scenario_id INTEGER NOT NULL,
        status TEXT DEFAULT 'active',
        score INTEGER DEFAULT 0,
        duration INTEGER DEFAULT 0,
        started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        completed_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (scenario_id) REFERENCES scenarios(id)
      );

      -- 훈련 응답 테이블
      CREATE TABLE IF NOT EXISTS training_responses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id INTEGER NOT NULL,
        step_id INTEGER NOT NULL,
        response_data TEXT,
        score INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES training_sessions(id) ON DELETE CASCADE
      );
    `

    try {
      console.log('📋 데이터베이스 테이블 생성 중...')
      
      // 각 테이블별로 생성
      const statements = createTablesSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && stmt.toUpperCase().startsWith('CREATE'))

      for (let i = 0; i < statements.length; i++) {
        this.query(statements[i])
        console.log(`   ✅ 테이블 ${i + 1}/${statements.length} 생성 완료`)
      }

      // 테이블 확인
      const tablesResult = this.query(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name NOT LIKE 'sqlite_%'
        ORDER BY name
      `)

      console.log('\n📊 생성된 테이블:')
      tablesResult.rows.forEach(row => {
        console.log(`   - ${row.name}`)
      })

      logger.info('SQLite 테이블 생성 완료', {
        tableCount: tablesResult.rows.length
      })

      return tablesResult.rows.length
    } catch (error) {
      logger.error('SQLite 테이블 생성 오류', {
        error: error.message
      })
      throw error
    }
  }
}

// 싱글톤 인스턴스 생성
const sqliteDatabase = new SQLiteDatabase()

// 전역 연결 관리
process.on('SIGINT', async () => {
  console.log('\n🔄 서버 종료 중... SQLite 데이터베이스 연결 해제')
  await sqliteDatabase.disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('\n🔄 서버 종료 중... SQLite 데이터베이스 연결 해제')
  await sqliteDatabase.disconnect()
  process.exit(0)
})

export default sqliteDatabase
