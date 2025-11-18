// 통합 데이터베이스 연결 관리자
import config from '../config/index.js'
import logger from '../config/logger.js'

// PostgreSQL 데이터베이스 임포트
import PostgreSQLDatabase from '../config/database.js'

// SQLite 데이터베이스 임포트
import SQLiteDatabase from '../config/database-sqlite.js'

class DatabaseManager {
  constructor() {
    this.database = null
    this.clientType = config.database.client
  }

  // 데이터베이스 클라이언트 초기화
  async initialize() {
    try {
      if (this.clientType === 'sqlite') {
        this.database = SQLiteDatabase
        logger.info('SQLite 데이터베이스 클라이언트 선택됨')
      } else {
        this.database = PostgreSQLDatabase
        logger.info('PostgreSQL 데이터베이스 클라이언트 선택됨')
      }

      // 데이터베이스 연결 테스트
      await this.database.connect()
      
      logger.info('데이터베이스 연결 초기화 완료', {
        client: this.clientType,
        connected: this.database.isConnected
      })

      return this.database
    } catch (error) {
      logger.error('데이터베이스 초기화 실패', {
        client: this.clientType,
        error: error.message
      })
      throw error
    }
  }

  // 실제 데이터베이스 인스턴스 반환
  getDatabase() {
    if (!this.database) {
      throw new Error('데이터베이스가 초기화되지 않았습니다. initialize()를 먼저 호출하세요.')
    }
    return this.database
  }

  // 헬스 체크
  async healthCheck() {
    try {
      if (!this.database) {
        await this.initialize()
      }
      return await this.database.healthCheck()
    } catch (error) {
      logger.error('데이터베이스 헬스 체크 실패', { error: error.message })
      return {
        status: 'unhealthy',
        error: error.message,
        connected: false
      }
    }
  }

  // 연결 해제
  async disconnect() {
    if (this.database && this.database.disconnect) {
      await this.database.disconnect()
      logger.info('데이터베이스 연결 해제 완료')
    }
  }
}

// 싱글톤 인스턴스
const dbManager = new DatabaseManager()

export default dbManager
