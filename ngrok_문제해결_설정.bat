@echo off
chcp 65001 >nul
echo ========================================
echo SHE 디지털트윈 ngrok 설정 (문제 해결)
echo ========================================
echo.

echo ngrok 설정 파일 문제를 해결합니다...
echo.

echo 1. 기존 설정 파일 삭제...
if exist "%USERPROFILE%\AppData\Local\ngrok\ngrok.yml" (
    del "%USERPROFILE%\AppData\Local\ngrok\ngrok.yml"
    echo    기존 설정 파일 삭제됨
) else (
    echo    설정 파일이 없음
)
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
echo 3. 새로운 설정 파일 생성...
echo authtoken: %authtoken% > "%USERPROFILE%\AppData\Local\ngrok\ngrok.yml"
echo update_channel: stable >> "%USERPROFILE%\AppData\Local\ngrok\ngrok.yml"
echo.

echo 4. 설정 확인...
ngrok config check
if %errorlevel% neq 0 (
    echo ❌ 설정 확인에 실패했습니다.
    echo 수동으로 설정해보겠습니다.
) else (
    echo ✅ ngrok 설정 완료
)
echo.

echo 5. 서버 상태 확인...
netstat -an | findstr ":3000" >nul
if %errorlevel% neq 0 (
    echo ❌ 서버가 실행되지 않았습니다.
    echo 먼저 서버를 시작해주세요: npm run dev
    pause
    exit /b 1
)

echo ✅ 서버 실행 중 (포트 3000)
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

echo ngrok 터널 시작 중...
start "SHE ngrok Tunnel" cmd /k "ngrok http 8080"

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
