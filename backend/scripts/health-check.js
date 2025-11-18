// 데이터베이스 헬스 체크 스크립트
import database from '../src/config/database-sqlite.js'

const healthCheck = async () => {
  try {
    console.log('🔍 데이터베이스 헬스 체크 시작...')
    
    // 연결 상태 확인
    const dbHealth = await database.healthCheck()
    
    if (dbHealth.status === 'healthy') {
      console.log('✅ 데이터베이스 상태: 정상')
      console.log(`📊 연결 시간: ${dbHealth.timestamp}`)
      
      // 기본 테이블 존재 확인 (SQLite)
      const tablesResult = database.query(`
        SELECT name as table_name 
        FROM sqlite_master 
        WHERE type='table' AND name NOT LIKE 'sqlite_%'
      `)
      
      console.log('📋 등록된 테이블:')
      tablesResult.rows.forEach(row => {
        console.log(`   - ${row.table_name}`)
      })
      
      return {
        status: 'healthy',
        database: dbHealth,
        tables: tablesResult.rows.length,
        timestamp: new Date().toISOString()
      }
    } else {
      console.log('❌ 데이터베이스 상태: 비정상')
      console.log(`   오류: ${dbHealth.error}`)
      
      return {
        status: 'unhealthy',
        database: dbHealth,
        timestamp: new Date().toISOString()
      }
    }
  } catch (error) {
    console.error('🔥 헬스 체크 실패:', error.message)
    
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    }
  } finally {
    await database.disconnect()
  }
}

// 직접 실행된 경우 헬스 체크 수행
if (import.meta.url === `file://${process.argv[1]}`) {
  healthCheck().then(result => {
    console.log('\n📊 최종 결과:', result.status)
    process.exit(result.status === 'healthy' ? 0 : 1)
  })
}

export default healthCheck
