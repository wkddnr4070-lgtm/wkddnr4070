@echo off
title 실행 중인 서버 확인
color 0A

echo ========================================
echo 현재 실행 중인 서버 프로세스 확인
echo ========================================
echo.

echo [1] Node.js 프로세스 확인...
echo.
tasklist | findstr /i "node.exe"
if %errorlevel% == 0 (
    echo ✅ Node.js 프로세스가 실행 중입니다!
) else (
    echo ❌ Node.js 프로세스가 실행되지 않고 있습니다.
)

echo.
echo [2] 포트 3000 사용 현황 확인...
netstat -ano | findstr ":3000"
if %errorlevel% == 0 (
    echo ✅ 포트 3000이 사용 중입니다! (프론트엔드 서버 실행 중)
) else (
    echo ❌ 포트 3000이 비어있습니다.
)

echo.
echo [3] 포트 3001 사용 현황 확인...
netstat -ano | findstr ":3001"
if %errorlevel% == 0 (
    echo ✅ 포트 3001이 사용 중입니다! (백엔드 서버 실행 중)
) else (
    echo ❌ 포트 3001이 비어있습니다.
)

echo.
echo [4] 브라우저에서 접속 테스트...
echo 프론트엔드 접속 테스트 중...
start http://localhost:3000

timeout /t 3 /nobreak

echo 백엔드 접속 테스트 중...
start http://localhost:3001

echo.
echo ========================================
echo 확인 결과
echo ========================================
echo.
echo 만약 브라우저에서 사이트가 열린다면:
echo ✅ 서버가 이미 백그라운드에서 실행 중입니다!
echo.
echo 만약 "연결할 수 없음" 오류가 나온다면:
echo ❌ 서버를 새로 시작해야 합니다.
echo.

pause

