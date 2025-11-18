// 초기 데이터 시딩 스크립트 - 도시가스 회사 조직도 및 시나리오 데이터
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dbManager from '../src/database/index.js'
import logger from '../config/logger.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 시딩 데이터
const seedData = {
  // 시나리오 데이터
  scenarios: [
    {
      title: 'OO동 OOO아파트 인근 도시가스 중압배관 파손',
      description: '평일 09:35 발생한 도시가스 중압배관 파손 사고로 인한 긴급 대응 훈련입니다.',
      difficulty: 'high',
      estimated_duration: 45,
      steps: [
        {
          step_order: 1,
          stage: 'I',
          title: '초기 보고 접수',
          description: '관제센터에서 가스 누출 신고를 접수했습니다. 현장 상황을 파악하고 필요한 조치를 결정해야 합니다.',
          step_type: 'multiple_choice',
          time_limit: 300,
          actions: [
            { action_text: '즉시 현장 출동팀 파견', is_correct: true, points: 10 },
            { action_text: '추가 정보 수집 후 판단', is_correct: false, projects: 5 },
            { action_text: '상급자에게 먼저 보고', is_correct: false, points: 3 },
            { action_text: '신고자에게 재확인 요청', is_correct: false, points: 2 }
          ]
        },
        {
          step_order: 2,
          stage: 'I',
          title: '안전 확보 조치',
          description: '현장 팀이 도착하여 안전 장비를 착용하고 현장 상황을 점검합니다. 주민들의 안전이 최우선입니다.',
          step_type: 'multiple_choice',
          time_limit: 180,
          actions: [
            { action_text: '안전 장비 착용 후 근접 점검', is_correct: true, points: 8 },
            { action_text: '원거리에서 가스농도 측정', is_correct: false, points: 6 },
            { action_text: '지켜보기만 하기', is_correct: false, points: 1 },
            { action_text: '즉시 차단 작업 시작', is_correct: false, points: 3 }
          ]
        },
        {
          step_order: 3,
          stage: 'II',
          title: '주변 주민 피난 방송',
          description: '가스 누출 위험이 확인되었습니다. 주변 주민들에게 대피 방송을 해야 합니다.',
          step_type: 'multiple_choice',
          time_limit: 120,
          actions: [
            { action_text: '즉시 주민 대피 방송 실시', is_correct: true, points: 15 },
            { action_text: '추가 확인 후 방송 검토', is_correct: false, points: 8 },
            { action_text: '상급 승인 후 방송', is_correct: false, points: 5 },
            { action_text: '방송하지 않고 현장 작업', is_correct: false, points: 1 }
          ]
        }
      ]
    },
    {
      title: '화학물질 누출 사고 대응',
      description: '공장 내 화학물질 누출 사고에 대한 초기 대응 및 안전 확보 훈련입니다.',
      difficulty: 'medium',
      estimated_duration: 30,
      steps: [
        {
          step_order: 1,
          stage: 'I',
          title: '화학물질 식별',
          description: '누출된 화학물질의 종류와 위험성을 파악하고 적절한 대응방법을 결정해야 합니다.',
          step_type: 'multiple_choice',
          time_limit: 240,
          actions: [
            { action_text: 'MSDS(Material Safety Data Sheet) 확인', is_correct: true, points: 10 },
            { action_text: '직접 접촉하여 확인', is_correct: false, points: 2 },
            { action_text: '경험에 의한 판단', is_correct: false, points: 5 },
            { action_text: '전문가에게 문의', is_correct: true, points: 8 }
          ]
        }
      ]
    }
  ],
  
  // 역할 데이터
  roles: [
    {
      name: '관제운영반장',
      description: '비상상황 총괄 지휘 및 조정',
      responsibilities: ['비상상황 총괄 지휘', '유관기관 협조', '상위 보고', '의사결정'],
      required_skills: ['상황 판단', '지시 전파', '의사결정', '리더십']
    },
    {
      name: '현장출동반',
      description: '현장 안전 확보 및 초기 대응',
      responsibilities: ['현장 안전 확보', '초기 대응', '상황 보고', '차단 작업'],
      required_skills: ['현장 진단', '안전 조치', '차단 기술', '보고서 작성']
    },
    {
      name: '안전관리반',
      description: '안전 관리 및 점검',
      responsibilities: ['안전 관리', '점검', '보고', '위험 평가'],
      required_skills: ['안전 점검', '위험 평가', '보고서 작성', '안전 기준']
    },
    {
      name: '고객서비스반',
      description: '고객 응대 및 안내',
      responsibilities: ['고객 응대', '안내', '상담', '민원 처리'],
      required_skills: ['고객 응대', '커뮤니케이션', '상황 안내', '갈등 해결']
    },
    {
      name: '기술반',
      description: '기술적 문제 해결',
      responsibilities: ['기술적 문제 해결', '장비 점검', '복구 작업', '기술 지원'],
      required_skills: ['기술 진단', '장비 조작', '복구 기술', '시스템 분석']
    },
    {
      name: '홍보반',
      description: '홍보 및 대외 소통',
      responsibilities: ['홍보', '대외 소통', '보도자료 작성', '언론 대응'],
      required_skills: ['홍보 기획', '커뮤니케이션', '문서 작성', '위기 관리']
    }
  ]
}

// 초기 데이터 삽입 함수
async function seedDatabase() {
  try {
    console.log('🌸 초기 데이터 시딩 시작..., ')
    
    const database = await dbManager.initialize()
    const isSQLite = database.clientType === 'sqlite'
    
    // 1. 역할 데이터 삽입
    console.log('\n📋 역할 데이터 삽입 중...')
    for (const role of seedData.roles) {
      if (isSQLite) {
        await database.query(`
          INSERT INTO roles (name, description, responsibilities, required_skills) 
          VALUES (?, ?, ?, ?)
          ON CONFLICT(name) DO NOTHING
        `, [
          role.name,
          role.description,
          JSON.stringify(role.responsibilities),
          JSON.stringify(role.required_skills)
        ])
      } else {
        await database.query(`
          INSERT INTO roles (name, description, responsibilities, required_skills) 
          VALUES ($1, $2, $3, $4)
          ON CONFLICT(name) DO NOTHING
        `, [
          role.name,
          role.description,
          JSON.stringify(role.responsibilities),
          JSON.stringify(role.required_skills)
        ])
      }
    }
    console.log(`   ✅ ${seedData.roles.length}개 역할 생성 완료`)

    // 2. 시나리오 데이터 삽입
    console.log('\n🎯 시나리오 데이터 삽입 중...')
    for (const scenario of seedData.scenarios) {
      let scenarioId
      
      // 시나리오 삽입
      if (isSQLite) {
        const result = await database.query(`
          INSERT INTO scenarios (title, description, difficulty, estimated_duration) 
          VALUES (?, ?, ?, ?)
        `, [
          scenario.title,
          scenario.description,
          scenario.difficulty,
          scenario.estimated_duration
        ])
        scenarioId = result.lastInsertRowid
      } else {
        const result = await database.query(`
          INSERT INTO scenarios (title, description, difficulty, estimated_duration) 
          VALUES ($1, $2, $3, $4) RETURNING id
        `, [
          scenario.title,
          scenario.description,
          scenario.difficulty,
          scenario.estimated_duration
        ])
        scenarioId = result.rows[0].id
      }

      console.log(`   📋 시나리오: ${scenario.title} (ID: ${scenarioId})`)

      // 시나리오 단계 삽입
      for (const step of scenario.steps) {
        let stepId
        
        if (isSQLite) {
          const result = await database.query(`
            INSERT INTO scenario_steps (scenario_id, step_order, stage, title, description, step_type, time_limit) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `, [
            scenarioId,
            step.step_order,
            step.stage,
            step.title,
            step.description,
            step.step_type,
            step.time_limit
          ])
          stepId = result.lastInsertRowid
        } else {
          const result = await database.query(`
            INSERT INTO scenario_steps (scenario_id, step_order, stage, title, description, step_type, time_limit) 
            VALUES ($1, $2, $3**, $4, $5, $6, $7) RETURNING id
          `, [
            scenarioId,
            step.step_order,
            step.stage,
            step.title,
            step.description,
            step.step_type,
            step.time_limit
          ])
          stepId = result.rows[0].id
        }

        console.log(`     🔸 단계: ${step.title} (${step.stage})`)

        // 액션 옵션 삽입
        if (step.actions) {
          for (const action of step.actions) {
            if (isSQLite) {
              await database.query(`
                INSERT INTO scenario_actions (step_id, action_text, is_correct, points) 
                VALUES (?, ?, ?, ?)
              `, [
                stepId,
                action.action_text,
                action.is_correct,
                action.points
              ])
            } else {
              await database.query(`
                INSERT INTO scenario_actions (step_id, action_text, is_correct, points) 
                VALUES ($1, $2, $3, $4)
              `, [
                stepId,
                action.action_text,
                action.is_correct,
                action.points
              ])
            }
          }
        }
      }
    }
    console.log(`   ✅ ${seedData.scenarios.length}개 시나리오 생성 완료`)

    // 3. 테스트 사용자 계정 생성 (기본 로그인용)
    console.log('\n👤 테스트 사용자 계정 생성 중...')
    
    const bcrypt = await import('bcryptjs')
    const passwordHash = await bcrypt.hash('password123', 12)
    
    // 기본 회사 생성
    let companyId = 1
    if (isSQLite) {
      const result = await database.query('SELECT id FROM companies WHERE name = "테스트 회사"')
      if (!result.rows?.length) {
        companyId = await database.query('INSERT INTO companies (name) VALUES (?)', ['테스트 회사']).lastInsertRowid
      } else {
        companyId = result.rows[0].id
      }
    } else {
      const result = await database.query('SELECT * FROM companies WHERE name = $1', ['테스트 회사']])
      if (!result.rows.length) {
        const companyResult = await database.query('INSERT INTO companies (name) VALUES ($1) RETURNING id', ['테스트 회사'])
        companyId = companyResult.rows[0].id
      } else {
        companyId = result.rows[0].id
      }
    }

    // 기본 조직 구조 생성
    let userId = null
    if (isSQLite) {
      // 부서, 팀, 직원, 사용자 순서로 생성
      const departmentId = await database.query(
        'INSERT OR IGNORE INTO departments (company_id, name) VALUES (?, ?)',
        [companyId, '안전관리팀']
      ).lastInsertRowid || 1

      const teamId = await database.query(
        'INSERT OR IGNORE INTO teams (department_id, name) VALUES (?, ?)',
        [departmentId, '현장대응반']
      ).lastInsertRowid || 1

      const employeeId = await database.query(
        'INSERT OR IGNORE INTO employees (team_id, name, position) VALUES (?, ?, ?)',
        [teamId, 'dnrdl4070', '팀장']
      ).lastInsertRowid || 1

      userId = await database.query(
        'INSERT OR IGNORE INTO users (employee_id, username, password_hash) VALUES (?, ?, ?)',
        [employeeId, 'dnrdl4070', passwordHash]
      ).lastInsertRowid || 1
    } else {
      // PostgreSQL 방식
      const departmentResult = await database.query(
        'INSERT INTO departments (company_id, name) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING id',
        [companyId, '안전관리팀']
      )
      const departmentId = departmentResult.rows[0]?.id || 
        (await database.query('SELECT id FROM departments WHERE name = $1', ['안전관리팀'])).rows[0].id

      const teamResult = await database.query(
        'INSERT INTO teams (department_id, name) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING id',
        [departmentId, '현장대응반']
      )
      const teamId = teamResult.rows[0]?.id || 
        (await database.query('SELECT id FROM teams WHERE name = $1', ['현장대응반'])).rows[0].id

      const employeeResult = await database.query(
        'INSERT INTO employees (team_id, name, position) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING RETURNING id',
        [teamId, 'dnrdl4070', '팀장']
      )
      const employeeId = employeeResult.rows[0]?.id || 
        (await database.query('SELECT id FROM employees WHERE name = $1', ['dnrdl4070'])).rows[0].id

      userId = (await database.query(
        'INSERT INTO users (employee_id, username, password_hash) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING RETURNING id',
        [employeeId, 'dnrdl4070', passwordHash]
      )).rows[0]?.id || 
      (await database.query('SELECT id FROM users WHERE username = $1', ['dnrdl4070'])).rows[0].id
    }
    
    console.log(`   ✅ 테스트 사용자 생성: dnrdl4070 (ID: ${userId})`)
    console.log(`   🔐 비밀번호: password123`)

    console.log('\n🎉 초기 데이터 시딩 완료!')
    
    // 최종 통계 출력
    const stats = {}
    if (isSQLite) {
      stats.roles = (await database.query('SELECT COUNT(*) as count FROM roles')).rows[0].count
      stats.scenarios = (await database.query('SELECT COUNT(*) as count FROM scenarios')).rows[0].count
      stats.steps = (await database.query('SELECT COUNT(*) as count FROM scenario_steps')).rows[0].count
      stats.actions = (await database.query('SELECT COUNT(*) as count FROM scenario_actions')).rows[0].count
      stats.companies = (await database.query('SELECT COUNT(*) as count FROM companies')).rows[0].count
      stats.users = (await database.query('SELECT COUNT(*) as count FROM users')).rows[0].count
    } else {
      stats.roles = (await database.query('SELECT COUNT(*) as count FROM roles')).rows[0].count
      stats.scenarios = (await database.query('SELECT COUNT(*) as count FROM scenarios')).rows[0].count
      stats.steps = (await database.query('SELECT COUNT(*) as count FROM scenario_steps')).rows[0].count
      stats.actions = (await database.query('SELECT COUNT(*) as count FROM scenario_actions')).rows[0].count
      stats.companies = (await database.query('SELECT COUNT(*) as count FROM companies')).rows[0].count
      stats.users = (await database.query('SELECT COUNT(*) as count FROM users')).rows[0].count
    }

    console.log('\n📊 최종 데이터 통계:')
    Object.entries(stats).forEach(([table, count]) => {
      console.log(`   - ${table}: ${count}개`)
    })

    return {
      success: true,
      stats,
      testUser: {
        username: 'dnrdl4070',
        password: 'password123'
      }
    }
    
  } catch (error) {
    console.error('\n🔥 데이터 시딩 실패:', error.message)
    logger.error('데이터 시딩 오류', { error: error.message })
    throw error
  }
}

// 직접 실행된 경우 시딩 수행
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().then(result => {
    if (result.success) {
      console.log('\n✅ 데이터 시딩 성공 완료!')
      console.log('🚀 백엔드 서버를 시작할 준비가 되었습니다.')
      process.exit(0)
    }
  }).catch(error => {
    console.log('\n❌ 데이터 시딩 실패!')
    process.exit(1)
  })
}

export default seedDatabase
