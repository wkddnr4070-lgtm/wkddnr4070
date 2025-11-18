@echo off
chcp 65001 >nul
echo ========================================
echo 🚨 접속 문제 진단 및 해결 도구
echo ========================================
echo.

echo 현재 상태를 확인하는 중...
echo.

echo ========================================
echo 1단계: 서버 상태 확인
echo ========================================
echo.
tasklist | findstr "node.exe" >nul
if %errorlevel% neq 0 (
    echo ❌ Node.js 서버가 실행되지 않았습니다.
    echo.
    echo 해결 방법:
    echo 1. 새 CMD 창 열기
    echo 2. cd /d "C:\Users\com\Desktop\SHE 디지털트윈"
    echo 3. npm run dev
) else (
    echo ✅ Node.js 서버가 실행 중입니다.
)

echo.
echo ========================================
echo 2단계: 포트 상태 확인
echo ========================================
echo.
netstat -an | findstr ":3000" >nul
if %errorlevel% neq 0 (
    echo ❌ 포트 3000이 사용되지 않고 있습니다.
) else (
    echo ✅ 포트 3000이 사용 중입니다.
)

echo.
echo ========================================
echo 3단계: ngrok 상태 확인
echo ========================================
echo.
tasklist | findstr "ngrok.exe" >nul
if %errorlevel% neq 0 (
    echo ❌ ngrok이 실행되지 않았습니다.
    echo.
    echo 해결 방법:
    echo 1. 새 CMD 창 열기
    echo 2. ngrok http 3000
) else (
    echo ✅ ngrok이 실행 중입니다.
)

echo.
echo ========================================
echo 4단계: 로컬 접속 테스트
echo ========================================
echo.
echo 로컬 접속 테스트 중...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3000' -TimeoutSec 5; Write-Host '✅ 로컬 접속 성공!' } catch { Write-Host '❌ 로컬 접속 실패: ' $_.Exception.Message }"

echo.
echo ========================================
echo 5단계: ngrok 접속 테스트
echo ========================================
echo.
echo ngrok 접속 테스트 중...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'https://drooly-pseudosessile-teresita.ngrok-free.dev' -TimeoutSec 10; Write-Host '✅ ngrok 접속 성공!' } catch { Write-Host '❌ ngrok 접속 실패: ' $_.Exception.Message }"

echo.
echo ========================================
echo 6단계: 자동 해결 시도
echo ========================================
echo.
echo 서버를 재시작합니다...
echo.

echo 기존 Node.js 프로세스 종료 중...
taskkill /f /im node.exe >nul 2>&1
timeout /t 3 /nobreak >nul

echo 서버 재시작 중...
start "SHE Frontend Server" cmd /k "cd /d \"C:\Users\com\Desktop\SHE 디지털트윈\" && npm run dev"
echo 서버 시작 중... 15초 대기
timeout /t 15 /nobreak >nul

echo 서버 상태 재확인...
netstat -an | findstr ":3000" >nul
if %errorlevel% neq 0 (
    echo ❌ 서버 재시작에 실패했습니다.
    echo.
    echo 수동 해결 방법:
    echo 1. 새 CMD 창 열기
    echo 2. cd /d "C:\Users\com\Desktop\SHE 디지털트윈"
    echo 3. npm run dev
    echo 4. 서버 시작 확인
) else (
    echo ✅ 서버가 성공적으로 재시작되었습니다!
    echo.
    echo 브라우저에서 테스트:
    echo - 로컬: http://localhost:3000
    echo - 공용: https://drooly-pseudosessile-teresita.ngrok-free.dev
)

echo.
echo ========================================
echo 🎯 최종 해결 방법
echo ========================================
echo.
echo 1. 서버 재시작:
echo    서버_시작.bat 실행
echo.
echo 2. ngrok 재시작:
echo    ngrok http 3000
echo.
echo 3. 접속 테스트:
echo    http://localhost:3000
echo    https://drooly-pseudosessile-teresita.ngrok-free.dev
echo.
echo 로그인 정보:
echo   사용자명: dnrdl4070
echo   비밀번호: @wlsghks12
echo.
pause
