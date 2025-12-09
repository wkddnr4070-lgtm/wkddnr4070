@echo off
REM Vercel 프로젝트 설정 가이드
chcp 65001 >nul

echo ========================================
echo   Vercel 프로젝트 설정 가이드
echo ========================================
echo.
echo ✅ 프로젝트가 이미 배포되어 있습니다!
echo 프로젝트: she-safety-hub-2026
echo 브랜치: production-clean
echo.
echo ========================================
echo   다음 단계
echo ========================================
echo.
echo [1/4] 프로젝트 상세 페이지로 이동
echo ----------------------------------------
echo 1. Vercel 대시보드에서 "she-safety-hub-2026" 프로젝트 카드 클릭
echo 2. 또는 다음 URL로 직접 이동:
echo    https://vercel.com/jangwookkims-projects/she-safety-hub-2026
echo.
pause

echo.
echo [2/4] 환경 변수 설정 확인 및 추가
echo ----------------------------------------
echo 프로젝트 상세 페이지에서:
echo.
echo 1. 상단 메뉴에서 "Settings" 클릭
echo 2. 왼쪽 사이드바에서 "Environment Variables" 클릭
echo 3. 다음 변수들이 설정되어 있는지 확인:
echo.
echo    [필수 변수]
echo    - OPENAI_KEY = sk-... (실제 OpenAI API 키)
echo    - AI_FEEDBACK_ENABLED = true
echo    - AI_MIN_SCORE = 100
echo    - VITE_AI_FEEDBACK_ENABLED = true
echo.
echo 4. 변수가 없다면 "Add New" 버튼으로 추가
echo 5. 각 변수를 추가할 때 모든 환경에 체크:
echo    ☑ Production
echo    ☑ Preview  
echo    ☑ Development
echo.
pause

echo.
echo [3/4] 배포 상태 확인
echo ----------------------------------------
echo 프로젝트 상세 페이지에서:
echo.
echo 1. "Deployments" 탭 클릭
echo 2. 최신 배포 상태 확인:
echo    - ✅ 성공 (초록색) = 정상
echo    - ⚠️  실패 (빨간색) = 빌드 로그 확인 필요
echo 3. 배포 URL 확인 (예: https://she-safety-hub-2026.vercel.app)
echo.
pause

echo.
echo [4/4] 배포된 사이트 테스트
echo ----------------------------------------
echo 1. 배포 URL로 접속:
echo    https://she-safety-hub-2026.vercel.app
echo.
echo 2. 다음 기능 테스트:
echo    ✅ 홈페이지 로딩 확인
echo    ✅ 로그인 화면 표시 확인
echo    ✅ 회사/조직 선택 기능 확인
echo    ✅ 대시보드 접근 확인
echo    ✅ 훈련 시작 기능 확인
echo    ✅ AI 피드백 생성 확인 (훈련 완료 후)
echo.
echo 3. 문제가 있다면:
echo    - 브라우저 콘솔 확인 (F12)
echo    - Vercel Function 로그 확인
echo    - 환경 변수 설정 재확인
echo.
pause

echo.
echo ========================================
echo   추가 설정 (선택사항)
echo ========================================
echo.
echo [프로덕션 브랜치 변경]
echo ----------------------------------------
echo 현재 브랜치가 production-clean인지 확인:
echo Settings → Git → Production Branch
echo.
echo [도메인 설정]
echo ----------------------------------------
echo 커스텀 도메인을 사용하려면:
echo Settings → Domains → Add Domain
echo.
echo [환경 변수 업데이트]
echo ----------------------------------------
echo 배포 후 VITE_API_URL을 업데이트:
echo VITE_API_URL = https://she-safety-hub-2026.vercel.app/api
echo.
pause

echo.
echo ========================================
echo   빠른 링크
echo ========================================
echo.
echo 프로젝트 설정: https://vercel.com/jangwookkims-projects/she-safety-hub-2026/settings
echo 배포 목록: https://vercel.com/jangwookkims-projects/she-safety-hub-2026/deployments
echo 환경 변수: https://vercel.com/jangwookkims-projects/she-safety-hub-2026/settings/environment-variables
echo.
echo 배포된 사이트: https://she-safety-hub-2026.vercel.app
echo.
set /p open="배포된 사이트를 브라우저에서 열까요? (Y/N): "
if /i "%open%"=="Y" (
    start https://she-safety-hub-2026.vercel.app
    echo.
    echo 브라우저가 열렸습니다.
)
echo.
pause

