@echo off
chcp 65001 >nul
title SHE 훈련 사이트 - ngrok 토큰 갱신
echo ========================================
echo SHE 디지털트윈 훈련 플랫폼 - ngrok 토큰 갱신
echo ========================================
echo.

echo 현재 ngrok 상태 확인...
tasklist | findstr "ngrok.exe" >nul
if %errorlevel% neq 0 (
    echo ❌ ngrok이 실행되지 않았습니다.
    echo.
    echo 해결 방법:
    echo 1. ngrok 웹사이트에서 새로운 토큰 받기
    echo    https://dashboard.ngrok.com/get-started/your-authtoken
    echo.
    echo 2. 새로운 토큰 입력:
    echo    ngrok config add-authtoken YOUR_NEW_TOKEN
    echo.
    echo 3. ngrok 재시작:
    echo    ngrok http 3000
    echo.
    pause
    exit /b 1
)

echo ✅ ngrok이 실행 중입니다.
echo.

echo ========================================
echo 🔄 토큰 갱신 방법
echo ========================================
echo.

echo ngrok 무료 버전은 8시간마다 토큰이 바뀝니다.
echo 토큰이 만료되면 다음 단계를 따라주세요:
echo.

echo 1. ngrok 웹사이트 접속:
echo    https://dashboard.ngrok.com/get-started/your-authtoken
echo.

echo 2. 새로운 토큰 복사
echo.

echo 3. 이 스크립트 실행:
echo    ngrok_토큰_갱신.bat
echo.

echo 4. 또는 수동으로 명령어 입력:
echo    ngrok config add-authtoken YOUR_NEW_TOKEN
echo    ngrok http 3000
echo.

echo ========================================
echo 🚀 자동 토큰 갱신 (고급)
echo ========================================
echo.

echo 새로운 토큰을 입력하세요:
set /p NEW_TOKEN="새로운 토큰: "

if "%NEW_TOKEN%"=="" (
    echo ❌ 토큰이 입력되지 않았습니다.
    pause
    exit /b 1
)

echo.
echo 기존 ngrok 종료...
taskkill /f /im ngrok.exe >nul 2>&1
timeout /t 3 /nobreak >nul

echo 새로운 토큰 설정...
ngrok config add-authtoken %NEW_TOKEN%

echo ngrok 재시작...
start "SHE ngrok" cmd /k "ngrok http 3000"

echo.
echo ========================================
echo ✅ 토큰 갱신 완료!
echo ========================================
echo.
echo 새로운 터널 URL을 확인하려면:
echo 1. ngrok 창에서 "Forwarding" 라인 확인
echo 2. 또는 http://localhost:4040 접속
echo.
pause

