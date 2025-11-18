@echo off
echo ========================================
echo 간단한 서버 시작
echo ========================================

:: 8.3 형식으로 디렉토리 이동
cd /d C:\Users\com\Desktop\SHE��~1

echo 현재 디렉토리: %CD%

:: package.json 확인
if exist package.json (
    echo package.json 확인됨
) else (
    echo package.json을 찾을 수 없습니다!
    pause
    exit /b 1
)

:: Node.js 버전 확인
echo Node.js 버전:
node --version
echo npm 버전:
npm --version

:: 서버 시작
echo.
echo 서버를 시작합니다...
echo 브라우저에서 http://localhost:3000 또는 http://localhost:3001 로 접속하세요.
echo.

npm run dev

