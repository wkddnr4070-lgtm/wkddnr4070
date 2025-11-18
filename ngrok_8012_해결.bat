@echo off
echo ========================================
echo ngrok ERR_NGROK_8012 오류 해결 도구
echo ========================================
echo.

echo 1. 서버 상태 확인...
netstat -an | findstr ":3000" >nul
if %errorlevel% neq 0 (
    echo ❌ 서버가 실행되지 않았습니다.
    echo.
    echo 서버를 시작하는 중...
    start "SHE Frontend Server" cmd /k "npm run dev"
    echo 서버 시작 중... 15초 대기
    timeout /t 15 /nobreak >nul
    
    netstat -an | findstr ":3000" >nul
    if %errorlevel% neq 0 (
        echo ❌ 서버 시작에 실패했습니다.
        echo 수동으로 서버를 시작해주세요: npm run dev
        pause
        exit /b 1
    )
    echo ✅ 서버 시작 완료
) else (
    echo ✅ 서버 실행 중
)
echo.

echo 2. 로컬 접속 테스트...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3000' -TimeoutSec 5; Write-Host '✅ 로컬 접속 성공!' } catch { Write-Host '❌ 로컬 접속 실패!' }"
echo.

echo 3. ngrok 상태 확인...
tasklist | findstr "ngrok.exe" >nul
if %errorlevel% neq 0 (
    echo ❌ ngrok이 실행되지 않았습니다.
    echo.
    echo ngrok을 시작하려면:
    echo 1. 새 CMD 창에서 'ngrok http 3000' 실행
    echo 2. 또는 'ngrok_문제해결_설정.bat' 실행
) else (
    echo ✅ ngrok 실행 중
)
echo.

echo ========================================
echo 해결 방법
echo ========================================
echo.
echo 1. 서버가 실행 중인지 확인
echo 2. http://localhost:3000 접속 테스트
echo 3. ngrok 터널 재시작
echo.
echo 자동 해결:
echo - 서버 시작: 서버_시작.bat
echo - ngrok 설정: ngrok_문제해결_설정.bat
echo.
pause
