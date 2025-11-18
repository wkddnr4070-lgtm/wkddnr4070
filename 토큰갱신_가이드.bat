@echo off
chcp 65001 >nul
title ngrok 토큰 갱신 가이드
echo ========================================
echo ngrok 토큰 갱신 가이드
echo ========================================
echo.

echo ngrok 무료 버전은 8시간마다 토큰이 바뀝니다.
echo 토큰이 만료되면 다음 단계를 따라주세요:
echo.

echo ========================================
echo 📱 단계별 토큰 갱신 방법
echo ========================================
echo.

echo 1. ngrok 웹사이트 접속:
echo    https://dashboard.ngrok.com/get-started/your-authtoken
echo.

echo 2. 로그인 후 새로운 토큰 복사
echo.

echo 3. 명령어 실행:
echo    ngrok config add-authtoken YOUR_NEW_TOKEN
echo.

echo 4. ngrok 재시작:
echo    ngrok http 3000
echo.

echo ========================================
echo 🚀 자동화된 방법
echo ========================================
echo.

echo 더 간단하게 하려면:
echo 1. ngrok_토큰_갱신.bat 실행
echo 2. 새로운 토큰 입력
echo 3. 자동으로 갱신 완료
echo.

echo ========================================
echo 📋 현재 상태
echo ========================================
echo.

echo 현재 ngrok 상태:
tasklist | findstr "ngrok.exe" >nul
if %errorlevel% equ 0 (
    echo ✅ ngrok 실행 중
    echo.
    echo 현재 터널 URL 확인:
    echo http://localhost:4040
) else (
    echo ❌ ngrok 실행되지 않음
    echo.
    echo 토큰 갱신이 필요할 수 있습니다.
)

echo.
pause

