@echo off
title SHE Digital Twin - Correct Quick Start
echo ========================================
echo SHE Digital Twin - Correct Quick Start
echo ========================================
echo.

echo 🚀 서버를 시작합니다...
echo.

cd /d "C:\Users\com\Desktop\SHE 디지털트윈"

echo 1. 프론트엔드 서버 시작 (포트 8080)...
start "SHE Frontend Server" cmd /k "npm run dev"
echo 서버 시작 중... 15초 대기
timeout /t 15 /nobreak >nul

echo 2. ngrok 터널 시작 (포트 8080 터널링)...
start "SHE ngrok Tunnel" cmd /k "ngrok http 8080"
echo ngrok 시작 중... 10초 대기
timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo 🎉 서버 시작 완료!
echo ========================================
echo.
echo 📍 로컬 접속 주소: http://localhost:8080
echo 🌐 네트워크 접속 주소: http://172.20.10.3:8080
echo.
echo 📱 외부 접속을 위해서는 ngrok 터널 URL을 확인하세요:
echo    - ngrok 창에서 "Forwarding" URL 확인
echo    - 예: https://xxxxx.ngrok-free.dev
echo.
echo 🔑 로그인 정보:
echo    사용자명: dnrdl4070
echo    비밀번호: @wlsghks12
echo.
echo ⚠️  중요: 포트 8080을 사용합니다 (기존 3000이 아님)
echo.
echo 이 창은 닫아도 됩니다.
echo.
pause
