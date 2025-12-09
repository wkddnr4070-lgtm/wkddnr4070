@echo off
REM vercel.json 직접 수정 (production 브랜치)
chcp 65001 >nul
setlocal enabledelayedexpansion

cd /d "%~dp0"

echo ========================================
echo   vercel.json 직접 수정
echo ========================================
echo.

echo [1/3] 올바른 vercel.json 생성...
echo {> vercel.json
echo   "functions": {>> vercel.json
echo     "api/ai-feedback.js": {>> vercel.json
echo       "runtime": "nodejs18.x",>> vercel.json
echo       "maxDuration": 30>> vercel.json
echo     }>> vercel.json
echo   },>> vercel.json
echo   "build": {>> vercel.json
echo     "env": {>> vercel.json
echo       "VITE_AI_FEEDBACK_ENABLED": "true">> vercel.json
echo     }>> vercel.json
echo   },>> vercel.json
echo   "headers": [>> vercel.json
echo     {>> vercel.json
echo       "source": "/api/(.*)",>> vercel.json
echo       "headers": [>> vercel.json
echo         {>> vercel.json
echo           "key": "Access-Control-Allow-Origin",>> vercel.json
echo           "value": "*">> vercel.json
echo         },>> vercel.json
echo         {>> vercel.json
echo           "key": "Access-Control-Allow-Methods",>> vercel.json
echo           "value": "GET, POST, PUT, DELETE, OPTIONS">> vercel.json
echo         },>> vercel.json
echo         {>> vercel.json
echo           "key": "Access-Control-Allow-Headers",>> vercel.json
echo           "value": "Content-Type, Authorization">> vercel.json
echo         }>> vercel.json
echo       ]>> vercel.json
echo     }>> vercel.json
echo   ]>> vercel.json
echo }>> vercel.json

echo ✅ vercel.json 생성 완료
echo.

echo [2/3] 생성된 vercel.json 내용 확인:
echo ----------------------------------------
type vercel.json
echo ----------------------------------------
echo.
pause

echo [3/3] Git 커밋 및 푸시...
git add vercel.json
git commit -m "fix: vercel.json runtime을 nodejs18.x로 직접 수정"
if errorlevel 1 (
    echo ⚠️  커밋 실패 또는 변경사항 없음
    echo 이미 올바른 상태일 수 있습니다.
) else (
    echo ✅ 커밋 완료
)
echo.

echo 현재 브랜치에서 푸시...
for /f "tokens=*" %%b in ('git branch --show-current 2^>nul') do set current_branch=%%b
if "!current_branch!"=="" set current_branch=main
echo 푸시할 브랜치: !current_branch!

git push origin !current_branch!
if errorlevel 1 (
    echo ⚠️  푸시 실패. upstream 설정을 시도합니다...
    git push -u origin !current_branch!
    if errorlevel 1 (
        echo ❌ 푸시 실패
        echo 네트워크 또는 인증 문제일 수 있습니다.
        pause
        exit /b 1
    )
)
echo ✅ 푸시 완료
echo.

echo ========================================
echo   완료 및 다음 단계
echo ========================================
echo.
echo 1. GitHub 푸시 완료 ✅
echo 2. Vercel 자동 재배포 시작됨 ⏳
echo 3. 1-3분 후 배포 상태 확인 필요
echo.
echo 배포 상태 확인:
echo https://vercel.com/jangwookkims-projects/she-safety-hub-2026/deployments
echo.
echo 배포 완료 후 사이트 접속:
echo https://she-safety-hub-2026.vercel.app
echo.
set /p open="Vercel 배포 페이지를 브라우저에서 열까요? (Y/N): "
if /i "%open%"=="Y" (
    start https://vercel.com/jangwookkims-projects/she-safety-hub-2026/deployments
    echo.
    echo 브라우저가 열렸습니다.
    echo 배포 상태를 모니터링하세요.
)
echo.
pause
