@echo off
title SHE 디지털트윈 서버 관리자
color 0A

echo ========================================
echo SHE 디지털트윈 플랫폼 서버 시작
echo ========================================
echo.
echo 🚀 서버를 시작합니다...
echo.
echo ⚠️  중요: 서버가 실행되는 동안 이 창들을 닫지 마세요!
echo    창을 닫으면 서버가 종료됩니다.
echo.

cd /d "%~dp0"

echo 📁 현재 디렉토리: %CD%
echo.

echo 🌐 프론트엔드 서버 시작 중... (포트 3000)
start "🌐 프론트엔드 서버 - 이 창을 닫지 마세요!" cmd /k "title 프론트엔드 서버 (포트 3000) - 닫지 마세요! && echo. && echo ========================================== && echo 프론트엔드 서버가 실행 중입니다 && echo 브라우저에서 http://localhost:3000 접속 가능 && echo ========================================== && echo. && npm run dev"

timeout /t 5 /nobreak

echo 🔧 백엔드 서버 시작 중... (포트 3001)
start "🔧 백엔드 서버 - 이 창을 닫지 마세요!" cmd /k "title 백엔드 서버 (포트 3001) - 닫지 마세요! && echo. && echo ========================================== && echo 백엔드 서버가 실행 중입니다 && echo API 엔드포인트: http://localhost:3001 && echo ========================================== && echo. && cd backend && npm start"

echo.
echo ✅ 서버 시작 완료!
echo.
echo 🌐 프론트엔드: http://localhost:3000
echo 🔧 백엔드 API: http://localhost:3001
echo.
echo ========================================
echo 서버 사용 안내
echo ========================================
echo.
echo ✅ 서버 접속: 브라우저에서 http://localhost:3000
echo ⚠️  서버 유지: 열린 CMD 창들을 닫지 마세요
echo 🛑 서버 중지: 각 서버 창에서 Ctrl+C 누르기
echo 🔄 서버 재시작: 이 배치 파일을 다시 실행
echo.

timeout /t 10 /nobreak

echo 10초 후 브라우저를 자동으로 엽니다...
start http://localhost:3000

echo.
echo 서버가 정상적으로 시작되었습니다!
echo 이 창은 닫아도 됩니다. (서버 창들은 닫지 마세요)
echo.
pause

