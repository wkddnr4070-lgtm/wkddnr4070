@echo off
echo ========================================
echo 서버 재시작 중...
echo ========================================

cd /d "C:\Users\com\Desktop\SHE 디지털트윈"

echo.
echo [1단계] 기존 Node 프로세스 종료...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo [2단계] 서버 시작 중...
echo.
start "SHE Digital Twin Server" cmd /k "npm run dev"

echo.
echo ========================================
echo 서버가 시작되었습니다!
echo 브라우저에서 http://localhost:3001 접속
echo ========================================
echo.
pause

