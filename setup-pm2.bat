@echo off
title PM2 설치 및 서버 백그라운드 실행
color 0A

echo ========================================
echo PM2 프로세스 매니저 설치 및 설정
echo ========================================
echo.
echo PM2는 Node.js 애플리케이션을 백그라운드에서
echo 자동으로 관리해주는 도구입니다.
echo.

cd /d "%~dp0"

echo [1/4] PM2 전역 설치 중...
npm install -g pm2

echo.
echo [2/4] PM2 설치 확인...
pm2 --version

echo.
echo [3/4] 기존 PM2 프로세스 정리...
pm2 delete all 2>nul

echo.
echo [4/4] 서버 백그라운드 실행...

echo 🌐 프론트엔드 서버 시작...
pm2 start npm --name "frontend" -- run dev

echo.
echo 🔧 백엔드 서버 시작...
pm2 start npm --name "backend" --cwd "./backend" -- start

echo.
echo ========================================
echo PM2 서버 관리 명령어
echo ========================================
echo.
echo 📊 서버 상태 확인:     pm2 status
echo 📋 서버 로그 보기:     pm2 logs
echo 🔄 서버 재시작:       pm2 restart all
echo 🛑 서버 중지:         pm2 stop all
echo 🗑️  서버 삭제:         pm2 delete all
echo 💾 설정 저장:         pm2 save
echo 🚀 부팅시 자동시작:   pm2 startup
echo.

echo ✅ 백그라운드 서버 시작 완료!
echo.
echo 🌐 프론트엔드: http://localhost:3000
echo 🔧 백엔드: http://localhost:3001
echo.
echo 이제 이 창을 닫아도 서버가 계속 실행됩니다!
echo.

timeout /t 5 /nobreak
start http://localhost:3000

pause

