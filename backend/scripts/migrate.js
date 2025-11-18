// 데이터베이스 마이그레이션 스크립트
import fs from 'fs'
import path from 'path'
import database from '../src/config/database.js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// SQL 스키마 파일 읽기
const loadSchemaFile = () => {
  try {
    // 프로젝트 루트의 database_schema.sql 파일 읽기
    const schemaPath = path.resolve(__dirname, '../../database_schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')
    return schema
  } catch (error) {
    console.error('❌ SQL 스키마 파일을 읽을 수 없습니다:', error.message)
    return null
  }
}

// 데이터베이스 테이블 생성
const migrate = async () => {
  try {
    console.log('🚀 데이터베이스 마이그레이션 시작...')
    
    // 데이터베이스 연결
    await database.connect()
    
    // SQL 파일 읽기
    const schema = loadSchemaFile()
    if (!schema) {
      throw new Error('SQL 스키마 파일을 찾을 수 없습니다.')
    }
    
    console.log('📋 SQL 스키마 파일 로드 완료')
    
    // 스키마 실행 (분할 실행)
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
    
    console.log(`🔨 ${statements.length}개의 SQL 문장 실행 중...`)
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement.length > 0) {
        try {
          await database.query(statement)
          console.log(`   ✅ ${i + 1}/${statements.length} 실행 완료`)
        } catch (error) {
          // 테이블이 이미 존재하는 경우 무시
          if (error.message.includes('already exists')) {
            console.log(`   ⚠️ 테이블이 이미 존재: ${statement.split('TABLE')[1]?.split('(')[0]?.trim() || 'unknown'}`)
          } else {
            throw error
          }
        }
      } else {
        console.log(`   ⚠️ 빈 문장 건너뜀`)
      }
    }
    
    // 테이블 목록 확인
    const tablesResult = await database.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `)
    
    console.log('\n📊 생성된 테이블:')
    tablesResult.rows.forEach(row => {
      console.log(`   - ${row.table_name}`)
    })
    
    console.log(`\n🎉 마이그레이션 완료! 총 ${tablesResult.rows.length}개의 테이블 생성됨`)
    
    return {
      success: true,
      tablesCreated: tablesResult.rows.length,
      tables: tablesResult.rows.map(row => row.table_name)
    }
    
  } catch (error) {
    console.error('\n🔥 마이그레이션 실패:', error.message)
    console.error('상세 오류:', error)
    
    return {
      success: false,
      error: error.message
    }
  } finally {
    await database.disconnect()
  }
}

// 직접 실행된 경우 마이그레이션 수행
if (import.meta.url === `file://${process.argv[1]}`) {
  migrate().then(result => {
    if (result.success) {
      console.log('\n✅ 마이그레이션 성공 완료!')
      process.exit(0)
    } else {
      console.log('\n❌ 마이그레이션 실패!')
      process.exit(1)
    }
  })
}

export default migrate
