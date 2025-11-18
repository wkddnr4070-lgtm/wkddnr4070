@echo off
echo ========================================
echo ngrok 인증 설정 도우미
echo ========================================
echo.

echo ngrok 계정이 필요합니다.
echo.
echo 1. https://ngrok.com 에서 무료 계정 생성
echo 2. 대시보드에서 인증 토큰 복사
echo 3. 아래에 인증 토큰 입력
echo.

set /p authtoken="인증 토큰을 입력하세요: "

if "%authtoken%"=="" (
    echo ❌ 인증 토큰이 입력되지 않았습니다.
    echo.
    echo 인증 토큰을 얻는 방법:
    echo 1. https://ngrok.com 에서 계정 생성
    echo 2. 로그인 후 대시보드에서 "Your Authtoken" 복사
    echo 3. 이 스크립트를 다시 실행
    echo.
    pause
    exit /b 1
)

echo.
echo 인증 토큰을 설정하는 중...
ngrok config add-authtoken %authtoken%

if %errorlevel% equ 0 (
    echo ✅ 인증 토큰 설정 완료!
    echo.
    echo 설정 확인 중...
    ngrok config check
    
    if %errorlevel% equ 0 (
        echo ✅ ngrok 설정이 완료되었습니다!
        echo.
        echo 다음 단계:
        echo 1. 서버가 실행 중인지 확인
        echo 2. ngrok 터널 시작:
        echo    ngrok http 3001
        echo 3. 생성된 https:// URL을 다른 사람에게 공유
        echo.
    ) else (
        echo ❌ 설정 확인에 실패했습니다.
        echo 인증 토큰을 다시 확인해주세요.
    )
) else (
    echo ❌ 인증 토큰 설정에 실패했습니다.
    echo 인증 토큰을 다시 확인해주세요.
)

echo.
pause
