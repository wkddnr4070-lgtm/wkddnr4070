# 🚀 Vercel 배포 체크리스트

## ✅ 배포 전 확인사항

### 1. 코드 준비
- [x] `vercel.json` 설정 완료
- [x] `api/ai-feedback.js` Vercel Function 준비 완료
- [x] `.gitignore` 설정 완료
- [ ] 로컬 빌드 테스트 완료 (`npm run build`)
- [ ] 모든 기능 정상 작동 확인

### 2. GitHub 저장소
- [ ] Git 저장소 초기화 확인
- [ ] GitHub 원격 저장소 연결 확인
- [ ] 모든 변경사항 커밋 및 푸시 완료

### 3. Vercel 계정 및 프로젝트
- [ ] Vercel 계정 생성 완료
- [ ] GitHub와 Vercel 연동 완료
- [ ] 새 프로젝트 생성 또는 기존 프로젝트 확인

### 4. 환경 변수 설정
다음 환경 변수들을 Vercel 대시보드에서 설정:

#### 필수 환경 변수
```
OPENAI_KEY=sk-... (OpenAI API 키)
AI_FEEDBACK_ENABLED=true
AI_MIN_SCORE=100
VITE_AI_FEEDBACK_ENABLED=true
```

#### 선택적 환경 변수
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=https://your-app.vercel.app/api
```

**설정 위치**: Vercel 대시보드 → 프로젝트 → Settings → Environment Variables

### 5. 배포 실행
- [ ] Vercel에서 "Deploy" 버튼 클릭 또는 자동 배포 확인
- [ ] 빌드 로그 확인
- [ ] 배포 성공 확인

### 6. 배포 후 테스트
- [ ] 홈페이지 접속 확인
- [ ] 로그인 기능 테스트
- [ ] 대시보드 표시 확인
- [ ] 훈련 시작 기능 테스트
- [ ] AI 피드백 생성 테스트
- [ ] API 엔드포인트 테스트

## 📝 배포 진행 단계

### Step 1: 로컬 빌드 테스트
```bash
npm run build
```
빌드가 성공적으로 완료되는지 확인

### Step 2: Git 커밋 및 푸시
```bash
git add .
git commit -m "배포 준비 완료 - Vercel 배포"
git push origin main
```

### Step 3: Vercel 배포
1. Vercel 대시보드 접속: https://vercel.com/dashboard
2. 프로젝트 선택 또는 새 프로젝트 생성
3. GitHub 저장소 연결
4. 환경 변수 설정
5. 배포 실행

### Step 4: 배포 확인
- 배포 URL 확인
- 기능 테스트
- 로그 확인

## 🔍 문제 해결

### 빌드 실패 시
1. 로컬에서 `npm run build` 실행하여 오류 확인
2. `package.json` 의존성 확인
3. Node.js 버전 확인 (18.x 이상 필요)

### 환경 변수 오류 시
1. Vercel 대시보드에서 환경 변수 재확인
2. 변수명 철자 확인
3. Production/Preview/Development 모두 설정 확인

### API 호출 실패 시
1. Vercel Functions 로그 확인
2. OpenAI API 키 유효성 확인
3. 네트워크 연결 확인

---

**마지막 업데이트**: 2025-01-28


