@echo off
chcp 65001 >nul
echo ========================================
echo 긴급 서버 시작 (PowerShell 우회)
echo ========================================

:: 프로젝트 디렉토리로 이동 (8.3 형식 사용)
cd /d "C:\Users\com\Desktop"
cd "SHE*"
echo 현재 디렉토리: %CD%

:: package.json 확인
if not exist "package.json" (
    echo 오류: package.json을 찾을 수 없습니다!
    dir
    pause
    exit /b 1
)

echo package.json 확인됨

:: 기존 프로세스 종료
echo.
echo [1단계] 기존 프로세스 종료
taskkill /F /IM node.exe 2>nul
taskkill /F /IM npm.cmd 2>nul
timeout /t 2 /nobreak >nul

:: Node.js 버전 확인
echo.
echo [2단계] Node.js 환경 확인
node --version
npm --version

:: 의존성 확인
echo.
echo [3단계] 의존성 확인
if not exist "node_modules" (
    echo node_modules 설치 중...
    npm install
)

:: 서버 시작
echo.
echo [4단계] 서버 시작
echo.
echo 서버 시작 중... 잠시만 기다려주세요.
echo 브라우저에서 다음 주소로 접속하세요:
echo - http://localhost:3000
echo - http://localhost:3001
echo.

start "SHE Digital Twin" npm run dev

echo 서버가 백그라운드에서 시작되었습니다.
echo 브라우저를 열어 위 주소로 접속해보세요.
echo.
pause
