@echo off
REM 브랜치 문제 해결
chcp 65001 >nul
setlocal enabledelayedexpansion

cd /d "%~dp0"

echo ========================================
echo   브랜치 문제 해결
echo ========================================
echo.
echo 문제: Vercel이 'production' 브랜치에서 빌드 중
echo 해결: 수정된 vercel.json을 production 브랜치에도 적용
echo.

echo [1/4] 현재 브랜치 확인...
for /f "tokens=*" %%b in ('git branch --show-current 2^>nul') do set current_branch=%%b
if "!current_branch!"=="" set current_branch=production
echo 현재 브랜치: !current_branch!
echo.

echo [2/4] production 브랜치로 전환...
git checkout production
if errorlevel 1 (
    echo ⚠️  production 브랜치로 전환 실패
    echo production 브랜치가 없을 수 있습니다.
    pause
    exit /b 1
) else (
    echo ✅ production 브랜치로 전환 완료
)
echo.

echo [3/4] production-clean의 vercel.json을 가져오기...
git show production-clean:vercel.json > vercel.json.temp
if errorlevel 1 (
    echo ⚠️  production-clean 브랜치의 vercel.json 가져오기 실패
    echo 수동으로 vercel.json을 수정해야 합니다.
    del vercel.json.temp 2>nul
    pause
    exit /b 1
) else (
    move vercel.json.temp vercel.json
    echo ✅ vercel.json 업데이트 완료
)
echo.

echo 수정된 vercel.json 내용:
type vercel.json
echo.
pause

echo [4/4] production 브랜치에 커밋 및 푸시...
git add vercel.json
git commit -m "fix: vercel.json runtime 설정 수정 - nodejs18.x로 변경 (from production-clean)"
if errorlevel 1 (
    echo ⚠️  커밋 실패 또는 변경사항 없음
) else (
    echo ✅ 커밋 완료
)
echo.

echo GitHub에 푸시 중...
git push origin production
if errorlevel 1 (
    echo ⚠️  푸시 실패. upstream 설정을 시도합니다...
    git push -u origin production
    if errorlevel 1 (
        echo ❌ 푸시 실패
        pause
        exit /b 1
    )
)
echo ✅ 푸시 완료
echo.

echo ========================================
echo   Vercel 자동 재배포 시작
echo ========================================
echo.
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
