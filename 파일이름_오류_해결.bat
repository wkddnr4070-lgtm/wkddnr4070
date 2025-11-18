@echo off
chcp 65001 >nul
echo ========================================
echo 🔍 파일 이름 오류 해결 도구
echo ========================================
echo.

echo 문제: "파일 이름, 디렉터리 이름 또는 볼륨 레이블 구문이 잘못되었습니다."
echo 원인: 한글 경로나 특수문자 문제
echo.

echo ========================================
echo 1단계: 현재 상태 확인
echo ========================================
echo.
echo 현재 위치: %CD%
echo.

echo ========================================
echo 2단계: ngrok 상태 확인
echo ========================================
echo.
tasklist | findstr "ngrok.exe" >nul
if %errorlevel% neq 0 (
    echo ❌ ngrok이 실행되지 않았습니다.
) else (
    echo ✅ ngrok이 실행 중입니다.
)

echo.
echo ========================================
echo 3단계: 서버 상태 확인
echo ========================================
echo.
netstat -an | findstr ":3000" >nul
if %errorlevel% neq 0 (
    echo ❌ 서버가 실행되지 않았습니다.
) else (
    echo ✅ 서버가 실행 중입니다.
)

echo.
echo ========================================
echo 4단계: 터널 정보 확인
echo ========================================
echo.
echo ngrok 터널 정보를 가져오는 중...
curl -s http://localhost:4040/api/tunnels > tunnel_info.json 2>nul

if exist tunnel_info.json (
    echo ✅ 터널 정보를 가져왔습니다.
    echo.
    echo 터널 URL:
    findstr "public_url" tunnel_info.json
    echo.
    del tunnel_info.json
) else (
    echo ❌ 터널 정보를 가져올 수 없습니다.
)

echo.
echo ========================================
echo 5단계: 해결 방법
echo ========================================
echo.
echo 파일 이름 오류 해결:
echo 1. 한글 경로 사용 금지
echo 2. 특수문자 사용 금지
echo 3. 공백 사용 금지
echo.
echo 추천 해결책:
echo 1. 프로젝트를 C:\SHE\ 로 이동
echo 2. 또는 영문 경로 사용
echo.
echo 현재 터널 URL: https://drooly-pseudosessile-teresita.ngrok-free.dev
echo 로그인 정보:
echo   사용자명: dnrdl4070
echo   비밀번호: @wlsghks12
echo.
pause
