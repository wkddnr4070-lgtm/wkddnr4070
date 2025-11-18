import pkg from 'pg'
const { Pool } = pkg
import config from './index.js'
import logger from './logger.js'

// PostgreSQL 연결 풀 설정
const dbConfig = {
  host: config.database.host,
  port: config.database.port,
  database: config.database.name,
  user: config.database.user,
  password: config.database.password,
  max: 20, // 최대 연결 수
  idleTimeoutMillis: 30000, // 유휴 연결 타임아웃
  connectionTimeoutMillis: 2000, // 연결 타임아웃
}

// 데이터베이스 클래스
class Database {
  constructor() {
    this.pool = null
    this.isConnected = false
  }

  // 연결 생성
  async connect() {
    try {
      if (!this.pool) {
        this.pool = new Pool(dbConfig)
        
        // 연결 테스트
        const client = await this.pool.connect()
        await client.query('SELECT NOW()')
        client.release()
        
        this.isConnected = true
        logger.info('데이터베이스 연결 성공', {
          host: config.database.host,
          port: config.database.port,
          database: config.database.name
        })
        
        console.log('✅ PostgreSQL 데이터베이스 연결 성공!')
        console.log(`📊 호스트: ${config.database.host}:${config.database.port}`)
        console.log(`🗄️ 데이터베이스: ${config.database.name}`)
      }
      return this.pool
    } catch (error) {
      this.isConnected = false
      logger.error('데이터베이스 연결 실패', {
        error: error.message,
        config: {
          host: config.database.host,
          port: config.database.port,
          database: config.database.name,
          user: config.database.user
        }
      })
      
      console.log('❌ PostgreSQL 데이터베이스 연결 실패:')
      console.log(`   호스트: ${config.database.host}:${config.database.port}`)
      console.log(`   데이터베이스: ${config.database.name}`)
      console.log(`   사용자: ${config.database.user}`)
      console.log(`   오류: ${error.message}`)
      
      throw error
    }
  }

  // 쿼리 실행 (단일)
  async query(text, params = []) {
    try {
      const pool = await this.connect()
      const result = await pool.query(text, params)
      return result
    } catch (error) {
      logger.error('데이터베이스 쿼리 오류', {
        query: text,
        params,
        error: error.message
      })
      throw error
    }
  }

  // 트랜잭션 실행
  async transaction(callback) {
    const pool = await this.connect()
    const client = await pool.connect()
    
    try {
      await client.query('BEGIN')
      const result = await callback(client)
      await client.query('COMMIT')
      return result
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  // 연결 해제
  async disconnect() {
    if (this.pool) {
      await this.pool.end()
      this.pool = null
      this.isConnected = false
      logger.info('데이터베이스 연결 해제')
      console.log('🔌 데이터베이스 연결 해제됨')
    }
  }

  // 연결 상태 확인
  async healthCheck() {
    try {
      if (!this.pool) {
        await this.connect()
      }
      
      const result = await this.query('SELECT NOW() as current_time')
      return {
        status: 'healthy',
        timestamp: result.rows[0].current_time,
        connected: true
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        connected: false
      }
    }
  }
}

// 싱글톤 인스턴스 생성
const database = new Database()

// 전역 연결 관리
process.on('SIGINT', async () => {
  console.log('\n🔄 서버 종료 중... 데이터베이스 연결 해제')
  await database.disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('\n🔄 서버 종료 중... 데이터베이스 연결 해제')
  await database.disconnect()
  process.exit(0)
})

export default database
