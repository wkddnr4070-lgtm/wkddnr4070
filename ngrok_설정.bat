@echo off
echo ========================================
echo SHE 디지털트윈 ngrok 공용 접속 설정
echo ========================================
echo.

echo 1. ngrok 설치 확인...
where ngrok >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ngrok이 설치되지 않았습니다.
    echo.
    echo 설치 방법:
    echo 1. https://ngrok.com/download 에서 다운로드
    echo 2. 압축 해제 후 ngrok.exe를 시스템 PATH에 추가
    echo 3. 또는 이 폴더에 ngrok.exe 복사
    echo.
    pause
    exit /b 1
) else (
    echo ✅ ngrok이 설치되어 있습니다.
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
    echo 3. 다음 명령어 실행:
    echo    ngrok config add-authtoken YOUR_AUTH_TOKEN
    echo.
    pause
    exit /b 1
) else (
    echo ✅ ngrok 인증 완료
)
echo.

echo 3. 서버 상태 확인...
netstat -an | findstr ":3001" >nul
if %errorlevel% neq 0 (
    echo ❌ 프론트엔드 서버가 실행되지 않았습니다.
    echo.
    echo 해결방법:
    echo 1. 새 CMD 창에서 'npm start' 실행
    echo 2. 서버 시작 후 이 스크립트 다시 실행
    echo.
    pause
    exit /b 1
) else (
    echo ✅ 프론트엔드 서버 실행 중 (포트 3001)
)
echo.

netstat -an | findstr ":3001" >nul
if %errorlevel% neq 0 (
    echo ❌ 백엔드 서버가 실행되지 않았습니다.
    echo.
    echo 해결방법:
    echo 1. 새 CMD 창에서 'cd backend && npm start' 실행
    echo 2. 서버 시작 후 이 스크립트 다시 실행
    echo.
    pause
    exit /b 1
) else (
    echo ✅ 백엔드 서버 실행 중 (포트 3001)
)
echo.

echo 4. ngrok 터널 시작...
echo.
echo 프론트엔드용 터널을 시작합니다...
echo 백엔드용 터널은 별도 CMD 창에서 실행하세요:
echo    ngrok http 3001
echo.
echo ========================================
echo ngrok 터널 시작 중...
echo ========================================
echo.

start "SHE Frontend Tunnel" cmd /k "ngrok http 3001"

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
