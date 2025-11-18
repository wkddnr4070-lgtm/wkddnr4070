// 데이터베이스 초기화 스크립트 (간소화 버전)
import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'

console.log('🚀 데이터베이스 초기화 시작...')

const dbPath = path.resolve(process.cwd(), '../data/gas_training.db')
console.log('📂 데이터베이스 경로:', dbPath)

// 데이터 디렉토리 생성
const dataDir = path.dirname(dbPath)
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
  console.log('📁 데이터 디렉토리 생성됨')
}

const db = new Database(dbPath)

// 1. 기본 테이블 생성
console.log('📋 기본 테이블 생성 중...')

db.exec(`
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
`)

console.log('✅ 테이블 생성 완료')

// 2. 초기 데이터 삽입
console.log('📝 초기 데이터 삽입 중...')

// 회사 데이터
const companies = [
  'SK E&S',
  '영남에너지서비스(구미)', 
  '영남에너지서비스(포항)',
  '전남도시가스',
  '강원도시가스'
]

const insertCompany = db.prepare('INSERT OR IGNORE INTO companies (name) VALUES (?)')
companies.forEach(company => insertCompany.run(company))

console.log(`   ✅ 회사 데이터: ${companies.length}개`)

// 테스트 사용자 데이터
const insertDepartment = db.prepare('INSERT OR IGNORE INTO departments (company_id, name) VALUES (?, ?)')
const insertTeam = db.prepare('INSERT OR IGNORE INTO teams (department_id, name) VALUES (?, ?)')
const insertEmployee = db.prepare('INSERT OR IGNORE INTO employees (team_id, name, position) VALUES (?, ?, ?)')
const insertUser = db.prepare('INSERT OR IGNORE INTO users (employee_id, username, password_hash) VALUES (?, ?, ?)')

// 기본 사용자 계정 생성 (dnrdl4070)
const companyId = 1 // SK E&S
const departmentId = insertDepartment.run(companyId, '개발팀').lastInsertRowid
const teamId = insertTeam.run(departmentId, '백엔드 개발반').lastInsertRowid
const employeeId = insertEmployee.run(teamId, 'dnrdl4070', '개발자').lastInsertRowid
const userId = insertUser.run(employeeId, 'dnrdl4070', 'hashed_password_@wlsghks12').lastInsertRowid

console.log(`   ✅ 기본 사용자 계정: dnrdl4070`)

// 테니 시나리오 데이터
const insertScenario = db.prepare(`
  INSERT OR IGNORE INTO scenarios 
  (title, description, difficulty, estimated_time, categories) 
  VALUES (?, ?, ?, ?, ?)
`)

const scenarios = [
  ['도시가스 누출 사고 대응', '매우 심각한 상황의 가스레벨높음 훈련입니다.', '심화', 30, '응급상황,가스레벨높음'],
  ['배관 폭발 사고 대응', '매우 심각한 상황의 사람부상 훈련입니다.', '심화', 30, '응급상황,사람부상'],
  ['공급 중단 사고 대응', '일반적인 상황의 공급중단 훈련입니다.', '기초', 25, '일반상황,공급중단']
]

scenarios.forEach(scenario => insertScenario.run(...scenario))

console.log(`   ✅ 시나리오 데이터: ${scenarios.length}개`)

// 3. 최종 확인
console.log('\n📊 데이터베이스 초기화 완료!')

const tables = db.prepare(`
  SELECT name FROM sqlite_master 
  WHERE type='table' AND name NOT LIKE 'sqlite_%'
  ORDER BY name
`).all()

console.log('📋 생성된 테이블:')
tables.forEach(table => console.log(`   - ${table.name}`))

const counts = {
  companies: db.prepare('SELECT COUNT(*) as count FROM companies').get().count,
  departments: db.prepare('SELECT COUNT(*) as count FROM departments').get().count,
  teams: db.prepare('SELECT COUNT(*) as count FROM teams').get().count,
  employees: db.prepare('SELECT COUNT(*) as count FROM employees').get().count,
  users: db.prepare('SELECT COUNT(*) as count FROM users').get().count,
  scenarios: db.prepare('SELECT COUNT(*) as count FROM scenarios').get().count
}

console.log('\n📈 데이터 레코드 수:')
Object.entries(counts).forEach(([table, count]) => {
  console.log(`   - ${table}: ${count}개`)
})

// 로그인 테스트
const testUser = db.prepare('SELECT * FROM users WHERE username = ?').get('dnrdl4070')
if (testUser) {
  console.log('\n👤 로그인 테스트 사용자:')
  console.log(`   사용자명: ${testUser.username}`)
  console.log(`   직원 ID: ${testUser.employee_id}`)
  console.log(`   활성 여부: ${testUser.is_active ? '활성' : '비활성'}`)
}

db.close()
console.log('\n🎉 데이터베이스 초기화 완료!')
console.log('💾 데이터베이스 파일 저장됨:', dbPath)
