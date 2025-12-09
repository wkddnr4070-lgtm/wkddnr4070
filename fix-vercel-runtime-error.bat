@echo off
REM Vercel Runtime 오류 해결
chcp 65001 >nul
setlocal enabledelayedexpansion

cd /d "%~dp0"

echo ========================================
echo   Vercel Runtime 오류 해결
echo ========================================
echo.
echo 오류: Function Runtimes must have a valid version
echo.
echo 원인: vercel.json의 런타임 설정 오류
echo 해결: "@vercel/node" → "nodejs18.x"로 변경
echo.
echo ✅ vercel.json 파일이 수정되었습니다.
echo.

echo [1/3] 변경사항 확인...
echo vercel.json 내용:
type vercel.json
echo.
pause

echo.
echo [2/3] Git에 변경사항 커밋 및 푸시...
git add vercel.json
git commit -m "fix: vercel.json runtime 설정 수정 - nodejs18.x로 변경"
if errorlevel 1 (
    echo ⚠️  커밋 실패 또는 변경사항 없음
) else (
    echo ✅ 커밋 완료
)
echo.

echo GitHub에 푸시 중...
for /f "tokens=*" %%b in ('git branch --show-current 2^>nul') do set current_branch=%%b
if "!current_branch!"=="" set current_branch=production-clean

git push origin !current_branch!
if errorlevel 1 (
    echo ⚠️  푸시 실패. upstream 설정을 시도합니다...
    git push -u origin !current_branch!
    if errorlevel 1 (
        echo ❌ 푸시 실패
        pause
        exit /b 1
    )
)
echo ✅ 푸시 완료
echo.

echo [3/3] Vercel 자동 재배포 대기...
echo GitHub에 푸시하면 Vercel이 자동으로 재배포합니다.
echo.
echo 1-3분 후 다음 URL에서 배포 상태 확인:
echo https://vercel.com/jangwookkims-projects/she-safety-hub-2026/deployments
echo.
echo 배포가 완료되면 사이트 접속:
echo https://she-safety-hub-2026.vercel.app
echo.
set /p open="Vercel 배포 페이지를 브라우저에서 열까요? (Y/N): "
if /i "%open%"=="Y" (
    start https://vercel.com/jangwookkims-projects/she-safety-hub-2026/deployments
    echo.
    echo 브라우저가 열렸습니다.
    echo 배포 상태를 확인하세요.
)
echo.
pause
