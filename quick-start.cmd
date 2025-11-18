@echo off
title SHE 디지털트윈 서버 시작
color 0A

echo.
echo  ███████╗██╗  ██╗███████╗    ██████╗ ██╗ ██████╗ ██╗████████╗ █████╗ ██╗     
echo  ██╔════╝██║  ██║██╔════╝    ██╔══██╗██║██╔════╝ ██║╚══██╔══╝██╔══██╗██║     
echo  ███████╗███████║█████╗      ██║  ██║██║██║  ███╗██║   ██║   ███████║██║     
echo  ╚════██║██╔══██║██╔══╝      ██║  ██║██║██║   ██║██║   ██║   ██╔══██║██║     
echo  ███████║██║  ██║███████╗    ██████╔╝██║╚██████╔╝██║   ██║   ██║  ██║███████╗
echo  ╚══════╝╚═╝  ╚═╝╚══════╝    ╚═════╝ ╚═╝ ╚═════╝ ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝
echo.
echo                          디지털 트윈 플랫폼 서버 시작
echo.

cd /d "%~dp0"

echo [1/4] 현재 위치 확인...
echo 📁 %CD%

echo.
echo [2/4] Node.js 환경 확인...
node --version 2>nul && (
    echo ✅ Node.js 설치됨
) || (
    echo ❌ Node.js가 설치되지 않았습니다!
    echo    https://nodejs.org 에서 다운로드하세요.
    pause
    exit /b 1
)

npm --version 2>nul && (
    echo ✅ npm 설치됨
) || (
    echo ❌ npm이 설치되지 않았습니다!
    pause
    exit /b 1
)

echo.
echo [3/4] 프로젝트 파일 확인...
if exist package.json (
    echo ✅ 프론트엔드 package.json 발견
) else (
    echo ❌ package.json 파일이 없습니다!
    echo    현재 디렉토리: %CD%
    dir
    pause
    exit /b 1
)

if exist backend\package.json (
    echo ✅ 백엔드 package.json 발견
) else (
    echo ❌ backend\package.json 파일이 없습니다!
    pause
    exit /b 1
)

echo.
echo [4/4] 서버 시작...
echo.
echo 🚀 프론트엔드 서버 시작 중... (포트 3000)
start "프론트엔드 서버" cmd /k "title 프론트엔드 서버 && echo 프론트엔드 서버 시작 중... && npm run dev"

timeout /t 3 /nobreak >nul

echo 🔧 백엔드 서버 시작 중... (포트 3001)  
start "백엔드 서버" cmd /k "title 백엔드 서버 && echo 백엔드 서버 시작 중... && cd backend && npm start"

echo.
echo ✅ 서버 시작 완료!
echo.
echo 🌐 프론트엔드: http://localhost:3000
echo 🔧 백엔드 API: http://localhost:3001
echo.
echo 브라우저에서 http://localhost:3000 에 접속하세요!
echo.

timeout /t 5 /nobreak >nul
echo 5초 후 브라우저를 자동으로 엽니다...
start http://localhost:3000

echo.
echo 서버를 중지하려면 각 서버 창에서 Ctrl+C를 누르세요.
echo.
pause

