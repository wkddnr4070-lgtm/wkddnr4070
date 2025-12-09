# ✅ Vercel 배포 체크리스트

## 현재 상태

✅ GitHub 푸시 완료
- 브랜치: `production-clean`
- 저장소: `wkddnr4070-lgtm/wkddnr4070`

## 배포 단계

### 1단계: Vercel 대시보드 접속

1. 브라우저에서 이동: https://vercel.com/dashboard
2. GitHub 계정으로 로그인 (필요시)

### 2단계: 프로젝트 생성 또는 선택

#### 새 프로젝트 생성 (권장)

1. **"Add New Project"** 또는 **"새 프로젝트"** 클릭
2. GitHub 저장소 목록에서 **`wkddnr4070-lgtm/wkddnr4070`** 선택
3. **"Import"** 클릭

#### 기존 프로젝트 사용

1. 기존 프로젝트 선택
2. **Settings** → **Git** → **Production Branch** 변경
3. `production-clean` 선택

### 3단계: 프로젝트 설정

다음 설정이 자동으로 감지됩니다:

- **Framework Preset**: `Vite` ✅
- **Root Directory**: `./` ✅
- **Build Command**: `npm run build` ✅
- **Output Directory**: `dist` ✅

**중요**: **Production Branch**를 `production-clean`으로 설정하세요!

### 4단계: 환경 변수 설정 (필수!)

**Settings** → **Environment Variables**로 이동하여 다음 변수들을 추가:

#### 필수 환경 변수

| 이름 | 값 | 환경 |
|------|-----|------|
| `OPENAI_KEY` | `sk-...` (실제 OpenAI API 키) | Production, Preview, Development 모두 |
| `AI_FEEDBACK_ENABLED` | `true` | Production, Preview, Development 모두 |
| `AI_MIN_SCORE` | `100` | Production, Preview, Development 모두 |
| `VITE_AI_FEEDBACK_ENABLED` | `true` | Production, Preview, Development 모두 |

#### 선택적 환경 변수

| 이름 | 값 | 환경 |
|------|-----|------|
| `VITE_API_URL` | `https://your-app.vercel.app/api` | Production, Preview, Development 모두 |

**주의**: 
- 각 변수를 추가할 때 **모든 환경(Production, Preview, Development)**에 체크하세요
- `OPENAI_KEY`는 실제 OpenAI API 키로 교체하세요
- `VITE_API_URL`은 배포 후 자동 생성된 URL로 업데이트하세요

### 5단계: 배포 실행

1. **"Deploy"** 버튼 클릭
2. 배포 진행 상황 확인
3. 빌드 로그 확인 (오류 발생 시)

### 6단계: 배포 확인

배포가 완료되면:

1. ✅ Vercel이 제공하는 URL 확인 (예: `https://your-app.vercel.app`)
2. ✅ 브라우저에서 URL 접속 테스트
3. ✅ 다음 기능 확인:
   - 홈페이지 로딩
   - 로그인 화면 표시
   - 대시보드 접근
   - 훈련 시작 기능
   - AI 피드백 생성 (훈련 완료 후)

## 문제 해결

### 빌드 실패

1. **빌드 로그 확인**
   - Vercel 대시보드 → Deployments → 해당 배포 → Build Logs
   - 오류 메시지 확인

2. **환경 변수 확인**
   - Settings → Environment Variables
   - 모든 필수 변수가 설정되었는지 확인

3. **의존성 확인**
   - 로컬에서 `npm install` 실행
   - `package.json` 확인

### 배포 후 오류

1. **Vercel Function 로그 확인**
   - Functions 탭 → `api/ai-feedback.js` 로그 확인

2. **브라우저 콘솔 확인**
   - F12 → Console 탭
   - 오류 메시지 확인

3. **API 엔드포인트 테스트**
   - `https://your-app.vercel.app/api/ai-feedback` 접속 테스트

### 환경 변수 오류

- `OPENAI_KEY`가 설정되지 않으면 AI 피드백이 작동하지 않습니다
- 기본 피드백으로 자동 전환됩니다 (정상 동작)

## 배포 후 업데이트

코드를 수정한 후:

1. **변경사항 커밋 및 푸시**
   ```cmd
   git add .
   git commit -m "업데이트 내용"
   git push origin production-clean
   ```

2. **Vercel 자동 배포**
   - GitHub에 푸시하면 Vercel이 자동으로 재배포합니다

## 추가 리소스

- **상세 가이드**: `VERCEL_DEPLOYMENT.md`
- **환경 변수 설정**: `README_AI_SETUP.md`
- **배포 스크립트**: `vercel-deploy-guide.bat`

---

**지금 `vercel-deploy-guide.bat`를 실행하거나 Vercel 대시보드로 이동하여 배포를 시작하세요!**

