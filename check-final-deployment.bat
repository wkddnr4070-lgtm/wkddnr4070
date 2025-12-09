@echo off
chcp 65001 >nul

echo ===========================================
echo   최종 배포 상태 확인
echo ===========================================
echo.

echo vercel.json runtime 오류를 수정했습니다.
echo 새 배포가 성공하는지 확인하세요.
echo.

echo 1. Vercel 배포 페이지 열기
set /p open1="Vercel 배포 페이지를 열까요? (Y/N): "
if /i "%open1%"=="Y" (
    start https://vercel.com/jangwookkims-projects/she-safety-hub-2026/deployments
    echo 배포 페이지가 열렸습니다.
    echo.
    echo 확인사항:
    echo - 새 배포가 초록색 "Ready" 상태인지 확인
    echo - 빌드 로그에 "Build completed successfully" 표시 확인
    echo.
)

echo 2. 사이트 테스트
set /p open2="배포 성공 후 사이트를 열까요? (Y/N): "
if /i "%open2%"=="Y" (
    start https://she-safety-hub-2026.vercel.app
    echo 사이트가 열렸습니다.
    echo.
    echo 확인사항:
    echo - Headers 오류가 사라졌나요?
    echo - 로그인 화면이 정상적으로 표시되나요?
    echo - 회사/조직 선택이 작동하나요?
    echo.
)

echo 3. 브라우저 콘솔 확인 (F12)
echo 다음 로그가 표시되는지 확인하세요:
echo - "🔧 VITE_API_URL 환경 변수 사용: /api"
echo - "🔧 API 설정: {mode: 'production', baseURL: '/api'}"
echo - "🔧 최종 API 설정: {baseURL: '/api', timeout: 10000}"
echo.

pause
