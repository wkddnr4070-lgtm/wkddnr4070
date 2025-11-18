@echo off
echo ========================================
echo SHE 디지털트윈 ngrok 설정 (수정됨)
echo ========================================
echo.

echo 1. ngrok 설정 초기화...
ngrok config reset >nul 2>&1
echo ✅ 설정 초기화 완료
echo.

echo 2. ngrok 계정이 필요합니다.
echo.
echo 계정 생성 방법:
echo 1. https://ngrok.com 에서 무료 계정 생성
echo 2. 로그인 후 대시보드에서 "Your Authtoken" 복사
echo 3. 아래에 입력하세요
echo.

:input_token
set /p authtoken="인증 토큰을 입력하세요: "

if "%authtoken%"=="" (
    echo ❌ 인증 토큰이 입력되지 않았습니다.
    echo 다시 입력해주세요.
    goto input_token
)

echo.
echo 3. 인증 토큰 설정 중...
ngrok config add-authtoken %authtoken%

if %errorlevel% neq 0 (
    echo ❌ 인증 토큰 설정에 실패했습니다.
    echo 토큰을 다시 확인해주세요.
    pause
    exit /b 1
)

echo ✅ 인증 토큰 설정 완료
echo.

echo 4. 설정 확인...
ngrok config check
if %errorlevel% neq 0 (
    echo ❌ 설정 확인에 실패했습니다.
    pause
    exit /b 1
)

echo ✅ ngrok 설정 완료
echo.

echo 5. 서버 상태 확인...
netstat -an | findstr ":3000\|:3001" >nul
if %errorlevel% neq 0 (
    echo ❌ 서버가 실행되지 않았습니다.
    echo 서버를 시작하는 중...
    start "SHE Frontend" cmd /k "npm run dev"
    echo 서버 시작 중... 15초 대기
    timeout /t 15 /nobreak >nul
    
    netstat -an | findstr ":3001" >nul
    if %errorlevel% neq 0 (
        echo ❌ 서버 시작에 실패했습니다.
        echo 수동으로 서버를 시작해주세요: npm start
        pause
        exit /b 1
    )
)

echo ✅ 서버 실행 중
echo.

echo 6. ngrok 터널 시작...
echo.
echo ========================================
echo ngrok 터널을 시작합니다
echo ========================================
echo.
echo 생성된 URL을 다른 사람에게 공유하세요!
echo.
echo 로그인 정보:
echo    사용자명: dnrdl4070
echo    비밀번호: @wlsghks12
echo.

echo 터널을 시작하려면 아무 키나 누르세요...
pause

start "SHE ngrok Tunnel" cmd /k "ngrok http 3001"

echo.
echo ========================================
echo 설정 완료!
echo ========================================
echo.
echo 다음 단계:
echo 1. 새로 열린 CMD 창에서 ngrok URL 확인
echo 2. 'Forwarding' 줄의 https:// 주소 복사
echo 3. 이 주소를 다른 사람에게 공유
echo.
echo 예시:
echo   https://abc123.ngrok.io
echo.
echo 주의사항:
echo - ngrok 무료 버전은 세션당 8시간 제한
echo - URL은 매번 변경됩니다
echo - 서버가 실행 중이어야 합니다
echo.
pause
