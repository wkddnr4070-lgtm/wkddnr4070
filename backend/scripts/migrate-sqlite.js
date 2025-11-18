// SQLite 데이터베이스 마이그레이션 스크립트
import database from '../src/config/database-sqlite.js'

const migrate = async () => {
  try {
    console.log('🚀 SQLite 데이터베이스 마이그레이션 시작...')
    
    // 데이터베이스 연결
    await database.connect()
    
    // 테이블 생성
    const tableCount = await database.createTables()
    
    // 초기 데이터 삽입 (현재 설정된 로그인 계정)
    console.log('\n📝 초기 데이터 삽입 중...')
    
    // 회사 데이터
    const companyId = database.query(
      'INSERT OR IGNORE INTO companies (name) VALUES (?)', 
      ['테스트 회사']
    ).lastInsertRowid
    
    // 부서 데이터
    const departmentId = database.query(
      'INSERT OR IGNORE INTO departments (company_id, name) VALUES (?, ?)', 
      [companyId || 1, '개발팀']
    ).lastInsertRowid
    
    // 팀 데이터
    const teamId = database.query(
      'INSERT OR IGNORE INTO teams (department_id, name) VALUES (?, ?)', 
      [departmentId || 1, '백엔드 개발반']
    ).lastInsertRowid
    
    // 직원 데이터
    const employeeId = database.query(
      'INSERT OR IGNORE INTO employees (team_id, name, position) VALUES (?, ?, ?)', 
      [teamId || 1, 'dnrdl4070', '개발자']
    ).lastInsertRowid
    
    // 사용자 계정 데이터
    const userId = database.query(
      'INSERT OR IGNORE INTO users (employee_id, username, password_hash) VALUES (?, ?, ?)', 
      [employeeId || 1, 'dnrdl4070', 'hashed_password_test']
    ).lastInsertRowid
    
    console.log(`   ✅ 기본 사용자 계정 생성: dnrdl4070`)
    console.log(`   ✅ 조직 구조 생성: 회사 > 부서 > 팀 > 직원`)
    
    // 테스트 시나리오 데이터
    const scenarioId = database.query(`
      INSERT OR IGNORE INTO scenarios 
      (title, description, difficulty, estimated_time, categories) 
      VALUES (?, ?, ?, ?, ?)
    `, [
      '도시가스 누출 사고 대응 훈련', 
      '매우 심각한 상황의 가스레벨높음 훈련입니다.', 
      '심화', 
      30, 
      '응급상황,가스레벨높음'
    ]).lastInsertRowid
    
    console.log(`   ✅ 테스트 시나리오 생성: ${scenarioId}`)
    
    // 최종 확인
    const finalTablesResult = database.query(`
      SELECT name 
      FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name
    `)
    
    console.log('\n📊 최종 생성된 테이블:')
    finalTablesResult.rows.forEach(row => {
      console.log(`   - ${row.name}`)
    })
    
    const dataCounts = {
      companies: database.query('SELECT COUNT(*) as count FROM companies').rows[0].count,
      departments: database.query('SELECT COUNT(*) as count FROM departments').rows[0].count,
      teams: database.query('SELECT COUNT(*) as count FROM teams').rows[0].count,
      employees: database.query('SELECT COUNT(*) as count FROM employees').rows[0].count,
      users: database.query('SELECT COUNT(*) as count FROM users').rows[0].count,
      scenarios: database.query('SELECT COUNT(*) as count FROM scenarios').rows[0].count
    }
    
    console.log('\n📈 초기 데이터 레코드 수:')
    Object.entries(dataCounts).forEach(([table, count]) => {
      console.log(`   - ${table}: ${count}개`)
    })
    
    console.log(`\n🎉 SQLite 마이그레이션 완료!`)
    console.log(`   📊 테이블: ${finalTablesResult.rows.length}개`)
    console.log(`   👤 사용자: ${dataCounts.users}명`)
    console.log(`   📚 시나리오: ${dataCounts.scenarios}개`)
    
    return {
      success: true,
      tablesCreated: finalTablesResult.rows.length,
      dataCounts,
      tables: finalTablesResult.rows.map(row => row.name)
    }
    
  } catch (error) {
    console.error('\n🔥 SQLite 마이그레이션 실패:', error.message)
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
      console.log('\n✅ SQLite 마이그레이션 성공 완료!')
      process.exit(0)
    } else {
      console.log('\n❌ SQLite 마이그레이션 실패!')
      process.exit(1)
    }
  })
}

export default migrate

