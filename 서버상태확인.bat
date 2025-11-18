@echo off
title SHE Server Status Check
echo ========================================
echo SHE Digital Twin - Server Status Check
echo ========================================
echo.

echo 🔍 현재 서버 상태를 확인합니다...
echo.

echo 1. 포트 8080 상태 확인...
netstat -an | findstr :8080
if %errorlevel% == 0 (
    echo ✅ 포트 8080에서 서비스가 실행 중입니다.
) else (
    echo ❌ 포트 8080에서 서비스가 실행되지 않습니다.
)
echo.

echo 2. 포트 3000 상태 확인...
netstat -an | findstr :3000
if %errorlevel% == 0 (
    echo ⚠️  포트 3000에서도 서비스가 실행 중입니다.
) else (
    echo ✅ 포트 3000은 사용되지 않습니다.
)
echo.

echo 3. ngrok 프로세스 확인...
tasklist | findstr ngrok
if %errorlevel% == 0 (
    echo ✅ ngrok이 실행 중입니다.
) else (
    echo ❌ ngrok이 실행되지 않습니다.
)
echo.

echo 4. Node.js 프로세스 확인...
tasklist | findstr node
if %errorlevel% == 0 (
    echo ✅ Node.js 프로세스가 실행 중입니다.
) else (
    echo ❌ Node.js 프로세스가 실행되지 않습니다.
)
echo.

echo ========================================
echo 📋 권장 사항:
echo ========================================
echo.
echo 🎯 올바른 서버 시작 방법:
echo    1. "올바른_빠른시작.bat" 실행
echo    2. 또는 수동으로:
echo       - npm run dev (포트 8080)
echo       - ngrok http 8080
echo.
echo ⚠️  주의사항:
echo    - 포트 3000이 아닌 포트 8080을 사용해야 합니다
echo    - vite.config.js에서 port: 8080으로 설정됨
echo.
pause
