@echo off
cd /d "%~dp0"

echo ===========================================
echo   현재 상태 확인
echo ===========================================
echo.

echo 현재 디렉토리:
echo %CD%
echo.

echo vercel.json 파일 존재 여부:
if exist vercel.json (
    echo 있음 - 내용:
    type vercel.json
) else (
    echo 없음 (정상 - 자동 감지 사용)
)
echo.

echo Git 상태:
git status
echo.

echo 현재 브랜치:
git branch --show-current
echo.

echo ===========================================
echo 다음 단계:
echo 1. Vercel 배포 상태 확인:
echo    https://vercel.com/jangwookkims-projects/she-safety-hub-2026/deployments
echo.
echo 2. 배포 완료 후 사이트 접속:
echo    https://she-safety-hub-2026.vercel.app
echo ===========================================
echo.
pause
