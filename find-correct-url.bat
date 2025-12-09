@echo off

echo ===========================================
echo   올바른 배포 URL 찾기
echo ===========================================
echo.

echo 배포는 성공했지만 URL이 맞지 않는 상황입니다.
echo.
echo 해결 방법:
echo.
echo [1단계] Vercel 배포 페이지에서 올바른 URL 찾기
echo ----------------------------------------
echo 1. 다음 페이지로 이동:
echo    https://vercel.com/jangwookkims-projects/she-safety-hub-2026/deployments
echo.
echo 2. 가장 최근의 성공한 배포(초록색) 클릭
echo.
echo 3. 배포 상세 페이지에서 "Visit" 버튼 클릭
echo    또는 배포 URL 확인 (예: https://she-safety-hub-2026-xxxxx.vercel.app)
echo.
pause

echo [2단계] 프로젝트 메인 페이지에서 URL 확인
echo ----------------------------------------
echo 1. 다음 페이지로 이동:
echo    https://vercel.com/jangwookkims-projects/she-safety-hub-2026
echo.
echo 2. 프로젝트 메인 페이지 상단에 표시된 URL 확인
echo.
echo 3. "Visit" 버튼 클릭하여 사이트 접속
echo.
pause

echo [3단계] Production Branch 설정 확인
echo ----------------------------------------
echo 1. 프로젝트 설정으로 이동:
echo    https://vercel.com/jangwookkims-projects/she-safety-hub-2026/settings/git
echo.
echo 2. "Production Branch" 확인:
echo    - 현재: production
echo    - 필요시 변경: production-clean
echo.
echo 3. 변경 후 자동 재배포됨
echo.
pause

echo ===========================================
echo   빠른 링크
echo ===========================================
echo.
echo Vercel 프로젝트: https://vercel.com/jangwookkims-projects/she-safety-hub-2026
echo 배포 목록: https://vercel.com/jangwookkims-projects/she-safety-hub-2026/deployments
echo Git 설정: https://vercel.com/jangwookkims-projects/she-safety-hub-2026/settings/git
echo.
set /p open="Vercel 프로젝트 페이지를 브라우저에서 열까요? (Y/N): "
if /i "%open%"=="Y" (
    start https://vercel.com/jangwookkims-projects/she-safety-hub-2026
    echo.
    echo 브라우저가 열렸습니다.
    echo 프로젝트 페이지에서 올바른 URL을 확인하세요.
)
echo.
pause

