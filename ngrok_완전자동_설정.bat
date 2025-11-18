@echo off
echo ========================================
echo SHE 디지털트윈 ngrok 공용 접속 설정
echo ========================================
echo.

echo 1. ngrok 설치 확인...
ngrok version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ngrok이 설치되지 않았습니다.
    echo https://ngrok.com/download 에서 다운로드하세요.
    pause
    exit /b 1
) else (
    echo ✅ ngrok 설치 확인됨
)
echo.

echo 2. ngrok 인증 확인...
ngrok config check >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ngrok 인증이 필요합니다.
    echo.
    echo 인증 방법:
    echo 1. https://ngrok.com 에서 무료 계정 생성
    echo 2. 대시보드에서 인증 토큰 복사
    echo 3. 아래에 입력하세요
    echo.
    set /p authtoken="인증 토큰: "
    if "%authtoken%"=="" (
        echo ❌ 인증 토큰이 입력되지 않았습니다.
        pause
        exit /b 1
    )
    ngrok config add-authtoken %authtoken%
    if %errorlevel% neq 0 (
        echo ❌ 인증 토큰 설정 실패
        pause
        exit /b 1
    )
    echo ✅ 인증 완료
) else (
    echo ✅ ngrok 인증 완료
)
echo.

echo 3. 서버 상태 확인...
netstat -an | findstr ":3001" >nul
if %errorlevel% neq 0 (
    echo ❌ 프론트엔드 서버가 실행되지 않았습니다.
    echo 서버를 시작하는 중...
    start "SHE Frontend" cmd /k "npm start"
    echo 서버 시작 중... 10초 대기
    timeout /t 10 /nobreak >nul
) else (
    echo ✅ 프론트엔드 서버 실행 중
)
echo.

echo 4. ngrok 터널 시작...
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
echo 문제가 있으면 'ngrok_인증_가이드.md' 파일을 참고하세요.
echo.
pause
