// 간단한 데이터베이스 테스트
import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'

console.log('🔍 데이터베이스 테스트 시작...')

const dbPath = path.resolve(process.cwd(), '../data/gas_training.db')
console.log('📂 데이터베이스 경로:', dbPath)

// 데이터 디렉토리 생성
const dataDir = path.dirname(dbPath)
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
  console.log('📁 데이터 디렉토리 생성됨:', dataDir)
}

try {
  // 데이터베이스 연결
  const db = new Database(dbPath)
  console.log('✅ SQLite 데이터베이스 연결 성공!')

  // 테스트 테이블 생성
  db.exec(`
    CREATE TABLE IF NOT EXISTS companies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
  console.log('✅ 테이블 생성 완료')

  // 테스트 데이터 삽입
  const insertCompany = db.prepare('INSERT OR IGNORE INTO companies (name) VALUES (?)')
  insertCompany.run('테스트 회사')
  console.log('✅ 테스트 데이터 삽입 완료')

  // 데이터 확인
  const companies = db.prepare('SELECT * FROM companies').all()
  console.log('📊 회사 목록:', companies)

  // 테이블 목록 확인
  const tables = db.prepare(`
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name NOT LIKE 'sqlite_%'
  `).all()
  console.log('📋 생성된 테이블:', tables.map(t => t.name))

  db.close()
  console.log('🔌 데이터베이스 연결 해제')
  console.log('🎉 테스트 완료!')

} catch (error) {
  console.error('❌ 테스트 실패:', error.message)
}

