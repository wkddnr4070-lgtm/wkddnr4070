@echo off
chcp 65001 >nul
echo 🔄 다른 포트로 서버 시작
echo ==========================
echo.

cd /d "C:\Users\com\Desktop\SHE 디지털트윈"

echo 🚀 포트 3001에서 서버를 시작합니다...
echo 📱 브라우저에서 http://localhost:3001 접속하세요
echo.

npx vite --port 3001 --host 0.0.0.0

pause
