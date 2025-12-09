@echo off
REM production 브랜치 상태 확인 및 수정
chcp 65001 >nul
setlocal enabledelayedexpansion

cd /d "%~dp0"

echo ========================================
echo   production 브랜치 상태 확인 및 수정
echo ========================================
echo.

echo [1/5] 현재 브랜치 확인...
for /f "tokens=*" %%b in ('git branch --show-current 2^>nul') do set current_branch=%%b
if "!current_branch!"=="" set current_branch=unknown
echo 현재 브랜치: !current_branch!
echo.

echo [2/5] production 브랜치로 전환...
git checkout production
if errorlevel 1 (
    echo ❌ production 브랜치로 전환 실패
    pause
    exit /b 1
) else (
    echo ✅ production 브랜치로 전환 완료
)
echo.

echo [3/5] 현재 production 브랜치의 vercel.json 확인...
if exist vercel.json (
    echo 현재 vercel.json 내용:
    echo ----------------------------------------
    type vercel.json
    echo ----------------------------------------
    echo.
) else (
    echo ❌ vercel.json 파일이 없습니다!
    echo.
)
pause

echo [4/5] vercel.json 직접 수정...
echo 올바른 vercel.json 내용을 생성합니다...
(
echo {
echo   "functions": {
echo     "api/ai-feedback.js": {
echo       "runtime": "nodejs18.x",
echo       "maxDuration": 30
echo     }
echo   },
echo   "build": {
echo     "env": {
echo       "VITE_AI_FEEDBACK_ENABLED": "true"
echo     }
echo   },
echo   "headers": [
echo     {
echo       "source": "/api/\(.*\)",
echo       "headers": [
echo         {
echo           "key": "Access-Control-Allow-Origin",
echo           "value": "*"
echo         },
echo         {
echo           "key": "Access-Control-Allow-Methods",
echo           "value": "GET, POST, PUT, DELETE, OPTIONS"
echo         },
echo         {
echo           "key": "Access-Control-Allow-Headers",
echo           "value": "Content-Type, Authorization"
echo         }
echo       ]
echo     }
echo   ]
echo }
) > vercel.json

echo ✅ vercel.json 수정 완료
echo.
echo 수정된 vercel.json 내용:
echo ----------------------------------------
type vercel.json
echo ----------------------------------------
echo.
pause

echo [5/5] 커밋 및 푸시...
git add vercel.json
git commit -m "fix: vercel.json runtime을 nodejs18.x로 수정 (직접 생성)"
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
echo   완료
echo ========================================
echo.
echo 1-3분 후 Vercel 배포 상태를 확인하세요:
echo https://vercel.com/jangwookkims-projects/she-safety-hub-2026/deployments
echo.
echo 예상 결과:
echo - 빌드 성공
echo - Runtime 오류 해결
echo - 사이트 접속 가능: https://she-safety-hub-2026.vercel.app
echo.
set /p open="Vercel 배포 페이지를 브라우저에서 열까요? (Y/N): "
if /i "%open%"=="Y" (
    start https://vercel.com/jangwookkims-projects/she-safety-hub-2026/deployments
    echo.
    echo 브라우저가 열렸습니다.
)
echo.
pause
