@echo off
echo ========================================
echo 깨끗한 서버 시작 (PowerShell 우회)
echo ========================================

:: 프로젝트 디렉토리로 이동
cd /d "C:\Users\com\Desktop\SHE 디지털트윈"
echo 현재 디렉토리: %CD%

:: 기존 Node 프로세스 종료
echo.
echo [1단계] 기존 Node.js 프로세스 종료
taskkill /F /IM node.exe 2>nul
taskkill /F /IM npm.cmd 2>nul
timeout /t 2 /nobreak >nul

:: package.json 존재 확인
echo.
echo [2단계] 프로젝트 파일 확인
if not exist "package.json" (
    echo 오류: package.json 파일을 찾을 수 없습니다!
    echo 현재 디렉토리: %CD%
    dir
    pause
    exit /b 1
)
echo package.json 파일 확인됨

:: Node.js 및 npm 버전 확인
echo.
echo [3단계] Node.js 환경 확인
node --version
npm --version

:: 의존성 설치 확인
echo.
echo [4단계] 의존성 확인
if not exist "node_modules" (
    echo node_modules가 없습니다. 의존성을 설치합니다...
    npm install
    if errorlevel 1 (
        echo npm install 실패!
        pause
        exit /b 1
    )
) else (
    echo node_modules 확인됨
)

:: 서버 시작
echo.
echo [5단계] 개발 서버 시작
echo.
echo 서버가 시작되면 다음 주소로 접속하세요:
echo - http://localhost:3000
echo - http://localhost:3001
echo.
echo 서버를 중지하려면 Ctrl+C를 누르세요.
echo ========================================
echo.

:: npm run dev 실행
npm run dev

echo.
echo 서버가 종료되었습니다.
pause
