@echo off
chcp 65001 >nul
echo ========================================
echo 🚀 초보자를 위한 ngrok 설정 (초간단)
echo ========================================
echo.

echo 이 프로그램은 다른 사람이 인터넷에서
echo 우리 사이트에 접속할 수 있게 해줍니다.
echo.

echo 📋 준비물:
echo - ngrok 계정 (무료)
echo - 인터넷 연결
echo - 이메일 주소
echo.

echo 🎯 목표: 전 세계 어디서든 접속 가능하게 만들기
echo.

echo ========================================
echo 1단계: ngrok 계정 만들기
echo ========================================
echo.
echo 1. 웹브라우저에서 https://ngrok.com 접속
echo 2. "Sign up" 버튼 클릭
echo 3. 이메일과 비밀번호 입력
echo 4. 계정 생성 완료
echo.
echo 완료되면 아무 키나 누르세요...
pause

echo.
echo ========================================
echo 2단계: 인증 토큰 받기
echo ========================================
echo.
echo 1. ngrok.com에서 로그인
echo 2. 대시보드에서 "Your Authtoken" 찾기
echo 3. 긴 글자 복사 (예: 2abc123def456...)
echo.
echo 복사한 토큰을 아래에 붙여넣으세요:
echo.

:input_token
set /p authtoken="인증 토큰: "

if "%authtoken%"=="" (
    echo ❌ 토큰이 입력되지 않았습니다.
    echo 다시 입력해주세요.
    goto input_token
)

echo.
echo ✅ 토큰 입력 완료!
echo.

echo ========================================
echo 3단계: 서버 시작하기
echo ========================================
echo.
echo 올바른 폴더로 이동 중...
cd /d "C:\Users\com\Desktop\SHE 디지털트윈"
echo 현재 위치: %CD%
echo.
echo 서버를 시작하는 중...
start "SHE Frontend Server" cmd /k "cd /d \"C:\Users\com\Desktop\SHE 디지털트윈\" && npm run dev"
echo 서버 시작 중... 15초 대기
timeout /t 15 /nobreak >nul

echo 서버 상태 확인 중...
netstat -an | findstr ":3000" >nul
if %errorlevel% neq 0 (
    echo ❌ 서버 시작에 실패했습니다.
    echo 수동으로 서버를 시작해주세요.
    pause
    exit /b 1
)

echo ✅ 서버 시작 완료!
echo.

echo ========================================
echo 4단계: ngrok 터널 생성
echo ========================================
echo.
echo ngrok 설정 파일 생성 중...
echo authtoken: %authtoken% > "%USERPROFILE%\AppData\Local\ngrok\ngrok.yml"
echo update_channel: stable >> "%USERPROFILE%\AppData\Local\ngrok\ngrok.yml"

echo ngrok 터널을 시작합니다...
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
start "SHE ngrok Tunnel" cmd /k "cd /d \"C:\Users\com\Desktop\SHE 디지털트윈\" && ngrok http 3000"

echo.
echo ========================================
echo 🎉 설정 완료!
echo ========================================
echo.
echo 다음 단계:
echo 1. 새로 열린 창에서 ngrok URL 확인
echo 2. "Forwarding" 줄의 https:// 주소 복사
echo 3. 이 주소를 다른 사람에게 공유
echo.
echo 예시:
echo   https://abc123.ngrok.io
echo.
echo 📱 공유할 정보:
echo   접속 주소: https://abc123.ngrok.io
echo   사용자명: dnrdl4070
echo   비밀번호: @wlsghks12
echo.
echo ⚠️ 주의사항:
echo - ngrok 무료 버전은 세션당 8시간 제한
echo - URL은 매번 변경됩니다
echo - 서버가 실행 중이어야 합니다
echo.
echo 🆘 문제가 생기면:
echo - "ngrok_8012_해결.bat" 실행
echo - "서버_시작.bat" 실행
echo.
pause
