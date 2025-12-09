@echo off

echo ===========================================
echo   배포 완료 후 최종 테스트
echo ===========================================
echo.

echo 환경 변수 VITE_API_URL을 설정했다면
echo 재배포가 완료된 후 사이트를 테스트하세요.
echo.

echo 테스트할 URL:
echo 1. https://she-safety-hub-2026-git-production-jangwookkims-projects.vercel.app
echo 2. https://she-safety-hub-2026-pvqjj14i7-jangwookkims-projects.vercel.app
echo.

echo 확인사항:
echo - Headers 오류가 사라졌나요?
echo - 로그인 화면이 정상적으로 표시되나요?
echo - 회사 선택이 작동하나요?
echo - 조직 선택이 작동하나요?
echo.

echo 배포 상태 확인:
echo https://vercel.com/jangwookkims-projects/she-safety-hub-2026/deployments
echo.

set /p open1="첫 번째 사이트를 열까요? (Y/N): "
if /i "%open1%"=="Y" (
    start https://she-safety-hub-2026-git-production-jangwookkims-projects.vercel.app
    echo 첫 번째 사이트가 열렸습니다.
)
echo.

set /p open2="두 번째 사이트를 열까요? (Y/N): "  
if /i "%open2%"=="Y" (
    start https://she-safety-hub-2026-pvqjj14i7-jangwookkims-projects.vercel.app
    echo 두 번째 사이트가 열렸습니다.
)
echo.

pause

