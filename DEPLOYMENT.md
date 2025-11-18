# 도시가스 비상대응 모의훈련 플랫폼 - 백엔드 배포 가이드

## 🔒 프라이빗 API 운영 설정

### 1. 로컬 개발 환경 설정

#### 1.1 PostgreSQL 설치 및 설정
```bash
# PostgreSQL 설치 (Windows)
# https://www.postgresql.org/download/windows/ 에서 다운로드

# 데이터베이스 생성
createdb gas_training_platform

# 환경 변수 설정
cp env.development .env
# .env 파일을 편집하여 실제 값 입력
```

#### 1.2 데이터베이스 스키마 생성
```bash
cd backend
npm run migrate
```

#### 1.3 개발 서버 실행
```bash
npm run dev
```

### 2. 프로덕션 환경 설정

#### 2.1 환경 변수 설정
```bash
# 프로덕션 환경 변수 복사
cp env.production .env

# 필수 환경 변수 설정
DB_PASSWORD=your_secure_password
JWT_SECRET=your_super_secure_jwt_secret_key
SESSION_SECRET=your_session_secret_key
ENCRYPTION_KEY=your_32_character_encryption_key
```

#### 2.2 Docker를 사용한 배포
```bash
# Docker Compose로 전체 스택 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f api

# 헬스 체크
curl http://localhost/health
```

#### 2.3 수동 배포
```bash
# 의존성 설치
npm ci --only=production

# 데이터베이스 마이그레이션
npm run migrate

# 서버 시작
npm start
```

### 3. 보안 설정

#### 3.1 IP 화이트리스트 설정
`src/middleware/security.js`에서 `ALLOWED_IPS` 배열에 허용할 IP 주소 추가:
```javascript
const ALLOWED_IPS = [
  '127.0.0.1',
  '::1',
  'localhost',
  '192.168.1.100',  // 내부 네트워크 IP
  '10.0.0.50'       // 추가 허용 IP
];
```

#### 3.2 API 키 인증 활성화
환경 변수에 API 키 설정:
```bash
API_KEY=your_secure_api_key_here
```

#### 3.3 SSL 인증서 설정 (선택사항)
```bash
# SSL 인증서 파일을 ssl/ 디렉토리에 배치
mkdir ssl
cp your-cert.pem ssl/cert.pem
cp your-key.pem ssl/key.pem

# nginx.conf에서 HTTPS 서버 설정 주석 해제
```

### 4. 모니터링 및 로깅

#### 4.1 로그 확인
```bash
# 실시간 로그 확인
tail -f logs/app.log

# Docker 환경에서 로그 확인
docker-compose logs -f api
```

#### 4.2 헬스 체크
```bash
# API 헬스 체크
curl http://localhost:3001/health

# 스크립트로 헬스 체크
npm run health
```

#### 4.3 성능 모니터링
- 메모리 사용량: `/health` 엔드포인트에서 확인
- 데이터베이스 연결 상태: 헬스 체크에서 확인
- 요청 빈도: 로그에서 Rate Limit 확인

### 5. 백업 및 복구

#### 5.1 데이터베이스 백업
```bash
# PostgreSQL 백업
pg_dump gas_training_platform > backup_$(date +%Y%m%d_%H%M%S).sql

# Docker 환경에서 백업
docker-compose exec postgres pg_dump -U postgres gas_training_platform > backup.sql
```

#### 5.2 로그 파일 관리
```bash
# 로그 로테이션 설정 (logrotate 사용)
# /etc/logrotate.d/gas-training
/path/to/backend/logs/app.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 644 nodejs nodejs
}
```

### 6. 트러블슈팅

#### 6.1 일반적인 문제들
- **데이터베이스 연결 실패**: 환경 변수 확인, PostgreSQL 서비스 상태 확인
- **포트 충돌**: 다른 서비스가 3001 포트 사용 중인지 확인
- **권한 오류**: 로그 디렉토리 권한 확인

#### 6.2 로그 분석
```bash
# 에러 로그만 확인
grep "ERROR" logs/app.log

# 특정 시간대 로그 확인
grep "2024-01-01" logs/app.log
```

### 7. API 엔드포인트

#### 7.1 인증 API
- `POST /api/v1/auth/login` - 로그인
- `GET /api/v1/auth/profile` - 프로필 조회
- `POST /api/v1/auth/logout` - 로그아웃

#### 7.2 시스템 API
- `GET /` - API 정보
- `GET /health` - 헬스 체크

### 8. 보안 체크리스트

- [ ] 강력한 비밀번호 설정
- [ ] JWT 시크릿 키 보안
- [ ] IP 화이트리스트 설정
- [ ] Rate Limiting 활성화
- [ ] HTTPS 설정 (프로덕션)
- [ ] 정기적인 보안 업데이트
- [ ] 로그 모니터링
- [ ] 백업 정책 수립

### 9. 성능 최적화

#### 9.1 데이터베이스 최적화
- 인덱스 최적화
- 연결 풀 설정 조정
- 쿼리 성능 모니터링

#### 9.2 애플리케이션 최적화
- 메모리 사용량 모니터링
- 응답 시간 최적화
- 캐싱 전략 수립

---

## 📞 지원

문제가 발생하거나 추가 도움이 필요한 경우:
1. 로그 파일 확인
2. 헬스 체크 실행
3. 환경 변수 검증
4. 네트워크 연결 상태 확인
