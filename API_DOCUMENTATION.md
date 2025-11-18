# 도시가스 비상대응 모의훈련 플랫폼 API 문서

## 🔒 프라이빗 API 엔드포인트

### 기본 정보
- **Base URL**: `http://localhost:3001/api/v1`
- **인증**: JWT Bearer Token
- **Content-Type**: `application/json`

---

## 🔐 인증 API (`/auth`)

### POST `/auth/login`
사용자 로그인

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "로그인 성공",
  "data": {
    "user": {
      "id": 1,
      "username": "user123",
      "name": "홍길동",
      "position": "과장",
      "company": "SK E&S",
      "department": "안전관리부",
      "team": "안전관리팀",
      "roles": [...]
    },
    "token": "jwt_token_here"
  }
}
```

### GET `/auth/profile`
사용자 프로필 조회

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "user123",
    "name": "홍길동",
    "position": "과장",
    "company": "SK E&S",
    "department": "안전관리부",
    "team": "안전관리팀",
    "roles": [...]
  }
}
```

### POST `/auth/logout`
사용자 로그아웃

**Headers:** `Authorization: Bearer <token>`

---

## 🏢 조직 관리 API (`/organization`)

### GET `/organization/companies`
회사 목록 조회

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "SK E&S",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### GET `/organization/companies/:companyId/departments`
특정 회사의 부서 목록 조회

### GET `/organization/departments/:departmentId/teams`
특정 부서의 팀 목록 조회

### GET `/organization/teams/:teamId/employees`
특정 팀의 직원 목록 조회

### GET `/organization/structure`
전체 조직도 조회 (계층 구조)

### GET `/organization/user`
사용자의 조직 정보 조회

---

## 📋 시나리오 관리 API (`/scenarios`)

### GET `/scenarios`
시나리오 목록 조회

**Query Parameters:**
- `page`: 페이지 번호 (기본값: 1)
- `limit`: 페이지당 항목 수 (기본값: 10)
- `difficulty`: 난이도 (low, medium, high)
- `isActive`: 활성 상태 (true, false)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "가스 누출 사고 대응",
      "description": "가스 배관 누출 사고 시나리오",
      "difficulty": "medium",
      "estimated_duration": 30,
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

### GET `/scenarios/:scenarioId`
특정 시나리오 상세 조회

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "가스 누출 사고 대응",
    "description": "가스 배관 누출 사고 시나리오",
    "difficulty": "medium",
    "estimated_duration": 30,
    "steps": [
      {
        "id": 1,
        "step_order": 1,
        "stage": "I",
        "title": "상황 접수",
        "description": "사고 신고 접수 및 초기 대응",
        "step_type": "descriptive",
        "time_limit": 300,
        "actions": []
      }
    ]
  }
}
```

### GET `/scenarios/:scenarioId/stats`
시나리오 통계 조회

### POST `/scenarios` (관리자만)
시나리오 생성

### PUT `/scenarios/:scenarioId` (관리자만)
시나리오 수정

### DELETE `/scenarios/:scenarioId` (관리자만)
시나리오 삭제

---

## 🎯 훈련 세션 관리 API (`/training`)

### POST `/training/start`
훈련 세션 시작

**Request Body:**
```json
{
  "scenarioId": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "훈련 세션이 시작되었습니다.",
  "data": {
    "sessionId": 1,
    "scenarioId": 1,
    "scenarioTitle": "가스 누출 사고 대응",
    "estimatedDuration": 30,
    "startedAt": "2024-01-01T00:00:00Z"
  }
}
```

### POST `/training/response`
훈련 응답 제출

**Request Body:**
```json
{
  "sessionId": 1,
  "stepId": 1,
  "userResponse": "사고 위치를 파악하고 신고자 신원을 확인했습니다.",
  "selectedActionId": 1,
  "responseTime": 120
}
```

### POST `/training/complete`
훈련 세션 완료

**Request Body:**
```json
{
  "sessionId": 1
}
```

### POST `/training/abandon`
훈련 세션 중단

### GET `/training/sessions`
사용자의 훈련 세션 목록 조회

**Query Parameters:**
- `page`: 페이지 번호
- `limit`: 페이지당 항목 수
- `status`: 세션 상태 (in_progress, completed, abandoned)

### GET `/training/sessions/:sessionId`
특정 훈련 세션 상세 조회

---

## 📊 결과 저장 및 조회 API (`/results`)

### GET `/results/stats`
사용자의 훈련 결과 통계 조회

**Response:**
```json
{
  "success": true,
  "data": {
    "overall": {
      "totalSessions": 10,
      "completedSessions": 8,
      "avgScore": 85.5,
      "avgCompletionRate": 92.3,
      "bestScore": 95,
      "worstScore": 65
    },
    "byScenario": [...],
    "recentSessions": [...],
    "stepAnalysis": [...]
  }
}
```

### GET `/results/analysis/:sessionId`
훈련 결과 상세 분석

### POST `/results/compare`
훈련 결과 비교 분석

**Request Body:**
```json
{
  "sessionIds": [1, 2, 3]
}
```

### GET `/results/report/:sessionId`
훈련 결과 리포트 생성

---

## 🔧 시스템 API

### GET `/`
API 기본 정보

**Response:**
```json
{
  "success": true,
  "message": "도시가스 비상대응 모의훈련 플랫폼 API",
  "version": "1.0.0",
  "environment": "development",
  "timestamp": "2024-01-01T00:00:00Z",
  "private": true
}
```

### GET `/health`
헬스 체크

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z",
  "environment": "development",
  "version": "1.0.0",
  "uptime": 3600,
  "responseTime": "5ms",
  "database": {
    "status": "healthy",
    "timestamp": "2024-01-01T00:00:00Z",
    "version": "PostgreSQL 15.0"
  },
  "memory": {
    "rss": "50 MB",
    "heapTotal": "20 MB",
    "heapUsed": "15 MB",
    "external": "5 MB"
  }
}
```

---

## 🚨 에러 응답 형식

모든 API는 다음과 같은 에러 응답 형식을 사용합니다:

```json
{
  "success": false,
  "message": "에러 메시지",
  "error": "상세 에러 정보 (개발 환경에서만)"
}
```

### 주요 HTTP 상태 코드
- `200`: 성공
- `201`: 생성 성공
- `400`: 잘못된 요청
- `401`: 인증 실패
- `403`: 권한 없음
- `404`: 리소스 없음
- `429`: 요청 한도 초과
- `500`: 서버 오류

---

## 🔒 보안 고려사항

1. **인증**: 모든 API는 JWT 토큰 인증 필요
2. **Rate Limiting**: 요청 빈도 제한 적용
3. **IP 화이트리스트**: 허용된 IP에서만 접근 가능
4. **입력 검증**: 모든 입력 데이터 검증
5. **로깅**: 모든 요청과 응답 로깅
6. **HTTPS**: 프로덕션 환경에서 SSL/TLS 사용 권장

---

## 📝 사용 예시

### 1. 로그인 및 토큰 획득
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "user123", "password": "password123"}'
```

### 2. 시나리오 목록 조회
```bash
curl -X GET http://localhost:3001/api/v1/scenarios \
  -H "Authorization: Bearer <token>"
```

### 3. 훈련 세션 시작
```bash
curl -X POST http://localhost:3001/api/v1/training/start \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"scenarioId": 1}'
```

### 4. 응답 제출
```bash
curl -X POST http://localhost:3001/api/v1/training/response \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": 1,
    "stepId": 1,
    "userResponse": "사고 위치를 파악했습니다.",
    "responseTime": 120
  }'
```

---

## 🛠️ 개발 및 배포

### 로컬 개발 환경 실행
```bash
cd backend
npm run dev
```

### 프로덕션 배포
```bash
# Docker 사용
docker-compose up -d

# 수동 배포
npm ci --only=production
npm start
```

### 데이터베이스 마이그레이션
```bash
npm run migrate
```

### 헬스 체크
```bash
npm run health
```
