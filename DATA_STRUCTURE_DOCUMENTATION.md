# 🗂️ SHE 디지털 훈련 플랫폼 데이터 구조 문서

## 📋 개요
이 문서는 프론트엔드와 백엔드 간의 데이터 구조 및 API 통신 방식을 명확히 정의합니다.

## 🏗️ 데이터베이스 구조 (PostgreSQL)

### 1. 조직 구조 (Hierarchy)
```
📊 Organizations
├── Companies (회사)
│   ├── Departments (부서) 
│   │   └── Teams (팀/반)
│   │       └── Employees (직원)
```

### 2. 핵심 테이블

#### 🏢 Companies (회사)
| Field | Type | Description |
|-------|------|-------------|
| id | SERIAL PRIMARY KEY | 회사 ID |
| name | VARCHAR(100) | 회사명 |
| created_at | TIMESTAMP | 생성일시 |
| updated_at | TIMESTAMP | 수정일시 |

#### 🏬 Departments (부서)
| Field | Type | Description |
|-------|------|-------------|
| id | SERIAL PRIMARY KEY | 부서 ID |
| company_id | INTEGER FK | 회사 ID |
| name | VARCHAR(100) | 부서명 |

#### 👥 Teams (팀/반)
| Field | Type | Description |
|-------|------|-------------|
| id | SERIAL PRIMARY KEY | 팀 ID |
| department_id | INTEGER FK | 부서 ID |
| name | VARCHAR(100) | 팀명 |

#### 👤 Employees (직원)
| Field | Type | Description |
|-------|------|-------------|
| id | SERIAL PRIMARY KEY | 직원 ID |
| team_id | INTEGER FK | 팀 ID |
| name | VARCHAR(50) | 직원명 |
| position | VARCHAR(50) | 직급/포지션 |

## 🎮 프론트엔드 데이터 구조

### 1. 사용자 프로필 (UserProfile)
```javascript
const userProfile = {
  id: 1,
  name: "dnrdl4070",           // 사용자명
  company: "SK E&S",          // 회사명
  department: "경영지원실",     // 부서명
  position: "개발자",          // 직급
  teamId: 1,                  // 팀 ID
  employeeId: 1               // 직원 ID
}
```

### 2. 훈련 시나리오 (Training Scenarios)
```javascript
const scenario = {
  id: 1,
  title: "도시가스 누출 사고 대응",
  description: "매우 심각 상황 훈련",
  difficulty: "심화",
  estimatedTime: 30,
  categories: ["응급상황", "가스레벨높음"]
}
```

### 3. 훈련 진행 상태 (Training Progress)
```javascript
const trainingProgress = {
  scenarioId: 1,
  currentStep: 0,
  currentPhase: "briefing",    // briefing | training | evaluation
  selectedActions: [],        // 선택된 액션들
  stepScores: {},            // 단계별 점수
  stepTimes: {},             // 단계별 소요시간
  startTime: Date.now(),
  completedSteps: []
}
```

### 4. 조직 구조 데이터 (Company Organizations)
```javascript
const companyOrganizations = {
  'SK E&S': {
    '경영지원실': {
      '인사팀': ['김민수 (팀장)', '이영희 (차장)', ...],
      '재무팀': ['장호영 (팀장)', '신미경 (차장)', ...]
    },
    '재무전략실': {
      '재무관리팀': ['임성호 (팀장)', ...]
    }
  }
}
```

## 🔄 API 통신 구조

### 1. 인증 API
```
POST /api/v1/auth/login
Request: { username: string, password: string }
Response: { user: UserProfile, token: string }

GET /api/v1/auth/profile  
Response: { user: UserProfile }

POST /api/v1/auth/logout
Response: { success: boolean }
```

### 2. 조직 관리 API
```
GET /api/v1/organization/companies
Response: { companies: Company[] }

GET /api/v1/organization/departments?company_id=1
Response: { departments: Department[] }

GET /api/v1/organization/employees?team_id=1
Response: { employees: Employee[] }
```

### 3. 훈련 관리 API
```
GET /api/v1/scenarios
Response: { scenarios: Scenario[] }

POST /api/v1/training/start
Request: { scenarioId: number }
Response: { sessionId: string }

POST /api/v1/training/response
Request: { sessionId: string, stepId: number, response: any }
Response: { success: boolean, score: number }

POST /api/v1/training/complete
Request: { sessionId: string, results: TrainingResults }
Response: { success: boolean, summary: TrainingSummary }
```

## 📊 데이터 흐름도

```
[프론트엔드] ←→ [API Gateway] ←→ [백엔드 서버] ←→ [PostgreSQL]
     ↓                ↓               ↓              ↓
  사용자 인터페이스   라우팅/인증     비즈니스 로직   데이터 저장
  상태 관리          미들웨어        컨트롤러       쿼리 처리
  AJAX 호출          로깅           검증/변환       관계형 데이터
```

## 🔗 프론트엔드-백엔드 연동 점

### 현재 상태
- ✅ 백엔드 서버 실행 중 (포트 3001)
- ✅ 프론트엔드 서버 실행 중 (포트 3000)
- ✅ 기본 API 엔드포인트 작동
- ✅ 로그인 API 테스트 완료

### 다음 구현할 것
- 🔄 데이터베이스 연결
- 🔄 실제 훈련 데이터 저장
- 🔄 결과 분석 및 리포트
- 🔄 사용자 관리 시스템

## 🎯 개발 우선순위

1. **데이터베이스 연결** (현재 단계)
2. **실제 사용자 인증 시스템**
3. **훈련 세션 저장/조회**
4. **결과 분석 및 리포트**
5. **관리자 기능**

---
**마지막 업데이트**: 2025-01-28
**문서 버전**: 1.0
