@echo off

echo ===========================================
echo   API URL 설정 및 수정
echo ===========================================
echo.

echo apiClient.js 파일이 수정되었습니다.
echo 이제 환경 변수 VITE_API_URL을 설정해야 합니다.
echo.

echo [1/3] Git 커밋 및 푸시...
cd /d "%~dp0"

git add src/utils/apiClient.js
git commit -m "fix: apiClient.js API URL 설정 수정 - 환경 변수 우선 사용"
if errorlevel 1 (
    echo 커밋 실패 또는 변경사항 없음
) else (
    echo ✅ 커밋 완료
)

git push origin production
if errorlevel 1 (
    echo 푸시 실패
    pause
    exit /b 1
) else (
    echo ✅ 푸시 완료
)
echo.

echo [2/3] Vercel 환경 변수 설정 필요
echo ----------------------------------------
echo 다음 페이지에서 환경 변수를 설정하세요:
echo https://vercel.com/jangwookkims-projects/she-safety-hub-2026/settings/environment-variables
echo.
echo 추가할 환경 변수:
echo 이름: VITE_API_URL
echo 값: /api
echo 환경: Production, Preview, Development 모두 선택
echo.
echo 참고: 상대 경로 /api를 사용하면 
echo 현재 도메인의 /api 엔드포인트를 자동으로 사용합니다.
echo.
pause

echo [3/3] 자동 재배포 대기
echo ----------------------------------------
echo GitHub 푸시가 완료되었으므로 Vercel에서 자동으로 재배포됩니다.
echo.
echo 환경 변수 설정 후 1-3분 대기하세요.
echo.
echo 배포 상태 확인:
echo https://vercel.com/jangwookkims-projects/she-safety-hub-2026/deployments
echo.
set /p open="Vercel 환경 변수 페이지를 열까요? (Y/N): "
if /i "%open%"=="Y" (
    start https://vercel.com/jangwookkims-projects/she-safety-hub-2026/settings/environment-variables
    echo 브라우저가 열렸습니다.
)
echo.
pause

