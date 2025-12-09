@echo off
REM Vercel 배포 가이드
chcp 65001 >nul

echo ========================================
echo   Vercel 배포 가이드
echo ========================================
echo.
echo ✅ GitHub 푸시 완료!
echo 브랜치: production-clean
echo.
echo ========================================
echo   Vercel 배포 단계
echo ========================================
echo.
echo [1/6] Vercel 대시보드 접속
echo ----------------------------------------
echo 1. 브라우저에서 다음 주소로 이동:
echo    https://vercel.com/dashboard
echo.
echo 2. GitHub 계정으로 로그인 (필요시)
echo.
pause

echo.
echo [2/6] 새 프로젝트 생성 또는 기존 프로젝트 선택
echo ----------------------------------------
echo 방법 A: 새 프로젝트 생성 (권장)
echo   1. "Add New Project" 또는 "새 프로젝트" 클릭
echo   2. GitHub 저장소 목록에서 "wkddnr4070-lgtm/wkddnr4070" 선택
echo.
echo 방법 B: 기존 프로젝트 사용
echo   1. 기존 프로젝트 선택
echo   2. Settings → Git → Production Branch 변경
echo.
pause

echo.
echo [3/6] 프로젝트 설정
echo ----------------------------------------
echo Framework Preset: Vite (자동 감지됨)
echo Root Directory: ./ (기본값)
echo Build Command: npm run build (자동)
echo Output Directory: dist (자동)
echo.
echo Production Branch: production-clean
echo.
pause

echo.
echo [4/6] 환경 변수 설정 (중요!)
echo ----------------------------------------
echo Vercel 대시보드에서:
echo Settings → Environment Variables
echo.
echo 다음 변수들을 추가하세요:
echo.
echo [필수 변수]
echo ----------------------------------------
echo 이름: OPENAI_KEY
echo 값: sk-... (실제 OpenAI API 키)
echo 환경: Production, Preview, Development 모두 선택
echo.
echo 이름: AI_FEEDBACK_ENABLED
echo 값: true
echo 환경: Production, Preview, Development 모두 선택
echo.
echo 이름: AI_MIN_SCORE
echo 값: 100
echo 환경: Production, Preview, Development 모두 선택
echo.
echo 이름: VITE_AI_FEEDBACK_ENABLED
echo 값: true
echo 환경: Production, Preview, Development 모두 선택
echo.
echo [선택적 변수]
echo ----------------------------------------
echo 이름: VITE_API_URL
echo 값: https://your-app.vercel.app/api
echo (배포 후 자동 생성된 URL로 업데이트)
echo.
pause

echo.
echo [5/6] 배포 실행
echo ----------------------------------------
echo 1. "Deploy" 버튼 클릭
echo 2. 배포 진행 상황 확인
echo 3. 빌드 로그 확인
echo.
pause

echo.
echo [6/6] 배포 확인
echo ----------------------------------------
echo 배포가 완료되면:
echo.
echo 1. Vercel이 제공하는 URL 확인 (예: https://your-app.vercel.app)
echo 2. 브라우저에서 URL 접속 테스트
echo 3. 다음 기능 확인:
echo    - 홈페이지 로딩
echo    - 로그인 화면 표시
echo    - 대시보드 접근
echo    - 훈련 시작 기능
echo.
echo ========================================
echo   문제 해결
echo ========================================
echo.
echo 빌드 실패 시:
echo 1. 빌드 로그 확인
echo 2. 환경 변수 설정 확인
echo 3. package.json 의존성 확인
echo.
echo 배포 후 오류 발생 시:
echo 1. Vercel Function 로그 확인
echo 2. 브라우저 콘솔 확인
echo 3. API 엔드포인트 테스트
echo.
pause

echo.
echo ========================================
echo   추가 리소스
echo ========================================
echo.
echo 상세 가이드: VERCEL_DEPLOYMENT.md
echo 환경 변수 설정: README_AI_SETUP.md
echo.
echo Vercel 대시보드로 이동하시겠습니까?
set /p open="브라우저 열기? (Y/N): "
if /i "%open%"=="Y" (
    start https://vercel.com/dashboard
    echo.
    echo 브라우저가 열렸습니다.
    echo 위 단계를 따라 진행하세요.
)
echo.
pause

