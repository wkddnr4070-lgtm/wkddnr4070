@echo off
title SHE 디지털트윈 플랫폼 서버 시작
chcp 65001 >nul
color 0A

echo.
echo ██████╗ ██╗  ██╗███████╗    ██████╗ ██╗ ██████╗ ██╗████████╗ █████╗ ██╗     
echo ██╔════╝ ██║  ██║██╔════╝    ██╔══██╗██║██╔════╝ ██║╚══██╔══╝██╔══██╗██║     
echo ███████╗ ███████║█████╗      ██║  ██║██║██║  ███╗██║   ██║   ███████║██║     
echo ╚════██║ ██╔══██║██╔══╝      ██║  ██║██║██║   ██║██║   ██║   ██╔══██║██║     
echo ███████║ ██║  ██║███████╗    ██████╔╝██║╚██████╔╝██║   ██║   ██║  ██║███████╗
echo ╚══════╝ ╚═╝  ╚═╝╚══════╝    ╚═════╝ ╚═╝ ╚═════╝ ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝
echo.
echo                        트 윈   플 랫 폼
echo.

REM 현재 스크립트 위치로 이동
cd /d "%~dp0"

echo [1단계] 현재 위치 확인
echo 📂 현재 디렉토리: %cd%
echo.

echo [2단계] 필수 파일 확인
if not exist "package.json" (
    echo ❌ package.json 파일이 없습니다!
    echo 💡 올바른 프로젝트 폴더에서 실행해주세요.
    pause
    exit /b 1
)
echo ✅ package.json 확인됨

if not exist "vite.config.js" (
    echo ❌ vite.config.js 파일이 없습니다!
    echo 💡 Vite 프로젝트가 아닙니다.
    pause
    exit /b 1
)
echo ✅ vite.config.js 확인됨
echo.

echo [3단계] Node.js 환경 확인
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js가 설치되지 않았습니다!
    echo 💡 https://nodejs.org 에서 Node.js를 다운로드하여 설치해주세요.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version 2^>nul') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION% 확인됨

where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm이 설치되지 않았습니다!
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version 2^>nul') do set NPM_VERSION=%%i
echo ✅ npm %NPM_VERSION% 확인됨
echo.

echo [4단계] 의존성 확인 및 설치
if not exist "node_modules" (
    echo ⚠️  node_modules 폴더가 없습니다.
    echo 🔄 의존성을 설치합니다...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ npm install 실패!
        pause
        exit /b 1
    )
    echo ✅ 의존성 설치 완료
) else (
    echo ✅ node_modules 폴더 확인됨
)
echo.

echo [5단계] 포트 3000 확인
netstat -ano | findstr :3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  포트 3000이 이미 사용 중입니다.
    echo 🔄 기존 프로세스를 종료합니다...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
        taskkill /f /pid %%a >nul 2>&1
    )
    timeout /t 2 /nobreak >nul
    echo ✅ 포트 3000 정리 완료
) else (
    echo ✅ 포트 3000 사용 가능
)
echo.

echo [6단계] 개발 서버 시작
echo 🚀 Vite 개발 서버를 시작합니다...
echo.
echo 📱 서버가 시작되면 브라우저에서 다음 주소로 접속하세요:
echo    🌐 http://localhost:3000
echo.
echo ⏹️  서버를 중지하려면 이 창에서 Ctrl+C를 누르세요.
echo.

REM 서버 시작
npm run dev

echo.
echo 🔄 서버가 종료되었습니다.
echo.
pause
