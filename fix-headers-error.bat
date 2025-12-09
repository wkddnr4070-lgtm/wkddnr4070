@echo off

echo ===========================================
echo   Headers 오류 해결
echo ===========================================
echo.

echo 콘솔 오류: Cannot read properties of undefined (reading 'headers')
echo.
echo 이 오류는 보통 다음 원인으로 발생합니다:
echo 1. API 클라이언트 설정 문제
echo 2. 환경 변수 누락
echo 3. 빌드 설정 문제
echo.

echo [1단계] Vercel 환경 변수 확인 필요
echo ----------------------------------------
echo 다음 페이지로 이동하여 환경 변수를 확인하세요:
echo https://vercel.com/jangwookkims-projects/she-safety-hub-2026/settings/environment-variables
echo.
echo 필요한 환경 변수:
echo - VITE_API_URL (중요!)
echo - VITE_AI_FEEDBACK_ENABLED
echo - OPENAI_KEY
echo - AI_FEEDBACK_ENABLED
echo - AI_MIN_SCORE
echo.
pause

echo [2단계] VITE_API_URL 추가/수정
echo ----------------------------------------
echo VITE_API_URL이 없거나 잘못 설정되었을 가능성이 높습니다.
echo.
echo 올바른 설정:
echo 이름: VITE_API_URL
echo 값: https://she-safety-hub-2026-git-production-jangwookkims-projects.vercel.app/api
echo 환경: Production, Preview, Development 모두 선택
echo.
echo 또는 다른 배포 URL을 사용한다면:
echo 값: https://she-safety-hub-2026-pvqjj14i7-jangwookkims-projects.vercel.app/api
echo.
pause

echo [3단계] 로컬 빌드 테스트
echo ----------------------------------------
echo 로컬에서 빌드를 테스트해보세요:
echo.
echo npm run build
echo npm run preview
echo.
echo 로컬에서도 같은 오류가 발생하는지 확인하세요.
echo.
pause

echo ===========================================
echo   해결 순서
echo ===========================================
echo.
echo 1. Vercel 환경 변수 페이지로 이동
echo 2. VITE_API_URL 변수 확인/추가
echo 3. 값: https://배포된URL/api
echo 4. 모든 환경에 적용
echo 5. 저장 후 자동 재배포 대기
echo.
set /p open="Vercel 환경 변수 페이지를 열까요? (Y/N): "
if /i "%open%"=="Y" (
    start https://vercel.com/jangwookkims-projects/she-safety-hub-2026/settings/environment-variables
    echo 브라우저가 열렸습니다.
)
echo.
pause

