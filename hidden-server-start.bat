@echo off
title 숨겨진 창으로 서버 시작
color 0A

echo ========================================
echo 백그라운드에서 서버 시작
echo ========================================
echo.
echo 서버가 숨겨진 창에서 실행됩니다.
echo 작업 관리자에서만 확인 가능합니다.
echo.

cd /d "%~dp0"

echo [1/2] 프론트엔드 서버 백그라운드 시작...
start /min "" cmd /c "title 프론트엔드-서버-숨김 && npm run dev"

timeout /t 3 /nobreak

echo [2/2] 백엔드 서버 백그라운드 시작...
start /min "" cmd /c "title 백엔드-서버-숨김 && cd backend && npm start"

echo.
echo ========================================
echo 백그라운드 서버 관리
echo ========================================
echo.
echo 📊 서버 확인: 작업 관리자에서 "node.exe" 프로세스 찾기
echo 🛑 서버 중지: 작업 관리자에서 "node.exe" 프로세스 종료
echo 🔍 창 찾기: 작업표시줄에서 최소화된 창 확인
echo.

echo ✅ 백그라운드 서버 시작 완료!
echo.
echo 🌐 프론트엔드: http://localhost:3000
echo 🔧 백엔드: http://localhost:3001
echo.
echo 서버가 백그라운드에서 실행 중입니다.
echo 이 창을 닫아도 서버는 계속 실행됩니다.
echo.

timeout /t 5 /nobreak
start http://localhost:3000

echo 브라우저가 열렸습니다. 이 창을 닫아도 됩니다.
pause

