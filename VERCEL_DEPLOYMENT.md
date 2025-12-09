# 🚀 Vercel 배포 가이드

## 📋 배포 전 체크리스트

### 1. 필수 준비사항
- [ ] GitHub 계정 및 저장소 생성
- [ ] Vercel 계정 생성 (https://vercel.com)
- [ ] OpenAI API 키 준비
- [ ] 프로젝트 코드가 GitHub에 업로드됨

### 2. 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수를 설정해야 합니다:

#### 필수 환경 변수
```
OPENAI_KEY=your_openai_api_key_here
AI_FEEDBACK_ENABLED=true
AI_MIN_SCORE=100
VITE_AI_FEEDBACK_ENABLED=true
```

#### 선택적 환경 변수
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🔧 배포 단계

### 1단계: GitHub에 코드 업로드

```bash
# Git 초기화 (아직 안 했다면)
git init

# 원격 저장소 추가
git remote add origin https://github.com/your-username/your-repo.git

# 파일 추가 및 커밋
git add .
git commit -m "Initial commit for Vercel deployment"

# GitHub에 푸시
git push -u origin main
```

### 2단계: Vercel 프로젝트 생성

1. **Vercel 대시보드 접속**: https://vercel.com/dashboard
2. **"Add New Project" 클릭**
3. **GitHub 저장소 선택**
4. **프로젝트 설정**:
   - Framework Preset: `Vite`
   - Root Directory: `./` (기본값)
   - Build Command: `npm run build` (자동 감지)
   - Output Directory: `dist` (자동 감지)

### 3단계: 환경 변수 설정

Vercel 프로젝트 설정에서:

1. **Settings → Environment Variables** 이동
2. 다음 변수들 추가:

```
OPENAI_KEY=sk-... (OpenAI API 키)
AI_FEEDBACK_ENABLED=true
AI_MIN_SCORE=100
VITE_AI_FEEDBACK_ENABLED=true
```

**중요**: 
- `OPENAI_KEY`는 Production, Preview, Development 모두에 설정
- 다른 변수들도 필요에 따라 설정

### 4단계: 배포 실행

1. **"Deploy" 버튼 클릭**
2. 배포 진행 상황 확인
3. 배포 완료 후 제공되는 URL 확인

## 📝 배포 후 확인사항

### 1. 기본 기능 테스트
- [ ] 홈페이지 로딩 확인
- [ ] 로그인 기능 확인
- [ ] 대시보드 표시 확인

### 2. AI 피드백 기능 테스트
- [ ] 훈련 완료 후 AI 피드백 생성 확인
- [ ] OpenAI API 호출 성공 확인
- [ ] 할당량 초과 시 재시도 로직 확인

### 3. API 엔드포인트 확인
```bash
# AI 피드백 API 테스트
curl -X POST https://your-app.vercel.app/api/ai-feedback \
  -H "Content-Type: application/json" \
  -d '{"trainingData": {"score": 75, "scenarioTitle": "테스트"}}'
```

## 🔍 트러블슈팅

### 문제 1: OpenAI API 호출 실패
**증상**: 429 오류 또는 할당량 초과

**해결 방법**:
1. OpenAI 계정의 결제 정보 확인
2. API 키 유효성 확인
3. 할당량 확인: https://platform.openai.com/usage
4. 재시도 로직이 자동으로 작동하는지 확인

### 문제 2: 빌드 실패
**증상**: Vercel 빌드 중 오류 발생

**해결 방법**:
1. 로컬에서 `npm run build` 테스트
2. `package.json`의 의존성 확인
3. Node.js 버전 확인 (Vercel 설정에서 18.x 이상)

### 문제 3: 환경 변수 미적용
**증상**: 환경 변수가 제대로 읽히지 않음

**해결 방법**:
1. Vercel 대시보드에서 환경 변수 재확인
2. 변수명 앞에 `VITE_` 접두사 확인 (프론트엔드용)
3. 배포 재실행

## 📊 모니터링

### Vercel 대시보드에서 확인 가능한 정보
- 배포 상태 및 로그
- 함수 실행 시간 및 오류
- 트래픽 통계
- 환경 변수 상태

### 로그 확인 방법
1. Vercel 대시보드 → 프로젝트 선택
2. **Functions** 탭에서 `api/ai-feedback.js` 선택
3. 실행 로그 확인

## 🔄 자동 배포 설정

### GitHub 연동 시 자동 배포
- `main` 브랜치에 푸시하면 자동 배포
- Pull Request 생성 시 Preview 배포
- 배포 알림은 Vercel 대시보드에서 확인

### 수동 배포
```bash
# Vercel CLI 사용
npm i -g vercel
vercel login
vercel --prod
```

## 💡 최적화 팁

1. **이미지 최적화**: Vercel이 자동으로 최적화
2. **캐싱**: 정적 파일은 자동 캐싱
3. **CDN**: 전 세계 CDN 자동 적용
4. **함수 타임아웃**: `vercel.json`에서 설정 (현재 30초)

## 📞 지원

문제 발생 시:
1. Vercel 대시보드 로그 확인
2. GitHub Issues 확인
3. Vercel 문서 참조: https://vercel.com/docs

---

**마지막 업데이트**: 2025-01-28
**버전**: 1.0


