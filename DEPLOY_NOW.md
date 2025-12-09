# 🚀 지금 바로 배포하기

## ⚡ 빠른 배포 가이드

### Step 1: 로컬 빌드 테스트

명령 프롬프트(cmd)를 열고 다음 명령어 실행:

```cmd
cd "C:\Users\com\Desktop\SHE 디지털트윈"
npm run build
```

빌드가 성공하면 `dist` 폴더가 생성됩니다.

### Step 2: Git 상태 확인 및 커밋

```cmd
git status
```

변경사항이 있다면:

```cmd
git add .
git commit -m "배포 준비 완료 - Vercel 배포 (2025-01-28)"
```

### Step 3: GitHub에 푸시

원격 저장소가 설정되어 있다면:

```cmd
git push origin main
```

원격 저장소가 없다면:

```cmd
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

### Step 4: Vercel 배포

#### 방법 1: Vercel 대시보드 사용 (권장)

1. **Vercel 접속**: https://vercel.com/dashboard
2. **"Add New Project" 클릭**
3. **GitHub 저장소 선택** (또는 Import)
4. **프로젝트 설정**:
   - Framework Preset: `Vite` (자동 감지됨)
   - Root Directory: `./`
   - Build Command: `npm run build` (자동)
   - Output Directory: `dist` (자동)
5. **환경 변수 설정** (중요!):
   - Settings → Environment Variables
   - 다음 변수들 추가:
     ```
     OPENAI_KEY=sk-... (실제 OpenAI API 키)
     AI_FEEDBACK_ENABLED=true
     AI_MIN_SCORE=100
     VITE_AI_FEEDBACK_ENABLED=true
     ```
   - 각 변수를 Production, Preview, Development에 모두 설정
6. **"Deploy" 버튼 클릭**

#### 방법 2: Vercel CLI 사용

```cmd
npm install -g vercel
vercel login
vercel --prod
```

### Step 5: 배포 확인

배포가 완료되면 Vercel이 제공하는 URL로 접속하여 확인:

- ✅ 홈페이지 로딩 확인
- ✅ 로그인 기능 테스트
- ✅ 대시보드 표시 확인
- ✅ 훈련 시작 기능 테스트

## 🔍 문제 해결

### 빌드 오류 발생 시

1. **의존성 재설치**:
   ```cmd
   npm install
   ```

2. **Node.js 버전 확인**:
   ```cmd
   node --version
   ```
   (18.x 이상 필요)

3. **오류 로그 확인**:
   빌드 오류 메시지를 확인하고 수정

### Git 오류 발생 시

1. **Git 초기화** (처음인 경우):
   ```cmd
   git init
   ```

2. **원격 저장소 확인**:
   ```cmd
   git remote -v
   ```

### Vercel 배포 오류 시

1. **빌드 로그 확인**: Vercel 대시보드 → Deployments → 로그 확인
2. **환경 변수 확인**: Settings → Environment Variables
3. **함수 로그 확인**: Functions 탭에서 `api/ai-feedback.js` 로그 확인

## 📝 체크리스트

배포 전:
- [ ] 로컬 빌드 성공 (`npm run build`)
- [ ] 모든 변경사항 커밋 완료
- [ ] GitHub에 푸시 완료
- [ ] Vercel 계정 준비 완료
- [ ] OpenAI API 키 준비 완료

배포 중:
- [ ] Vercel 프로젝트 생성 완료
- [ ] 환경 변수 설정 완료
- [ ] 배포 실행 완료

배포 후:
- [ ] 배포 URL 접속 확인
- [ ] 기본 기능 테스트 완료
- [ ] AI 피드백 기능 테스트 완료

## 🎯 다음 단계

배포가 완료되면:

1. 배포 URL을 팀원들과 공유
2. 기능 테스트 진행
3. 피드백 수집 및 개선

---

**시작하기**: 명령 프롬프트를 열고 `npm run build` 실행!


