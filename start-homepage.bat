@echo off
echo ========================================
echo SHE 디지털트윈 홈페이지 시작
echo ========================================

:: 프로젝트 디렉토리로 이동
cd /d "C:\Users\com\Desktop\SHE 디지털트윈"

:: 기존 Node 프로세스 종료
echo [1단계] 기존 서버 프로세스 종료 중...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

:: 의존성 확인
echo [2단계] 의존성 확인 중...
if not exist "node_modules" (
    echo 의존성을 설치합니다...
    npm install
)

:: 서버 시작
echo [3단계] 개발 서버 시작 중...
echo.
echo 서버가 시작되면 다음 주소로 접속하세요:
echo http://localhost:3000
echo 또는
echo http://localhost:3001
echo.
echo 서버를 중지하려면 Ctrl+C를 누르세요.
echo ========================================
echo.

npm run dev

pause
