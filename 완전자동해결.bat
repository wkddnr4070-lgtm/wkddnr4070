@echo off
chcp 65001 >nul
title SHE 훈련 사이트 - 완전 자동 해결
echo ========================================
echo SHE 디지털트윈 훈련 플랫폼 - 완전 자동 해결
echo ========================================
echo.

echo 1. 기존 프로세스 정리...
taskkill /f /im ngrok.exe >nul 2>&1
taskkill /f /im node.exe >nul 2>&1
timeout /t 3 /nobreak >nul

echo 2. 서버 시작...
cd /d "C:\Users\com\Desktop\SHE 디지털트윈"
start "SHE 서버" cmd /k "npm run dev"
echo 서버 시작 중... 15초 대기
timeout /t 15 /nobreak >nul

echo 3. 새로운 ngrok 터널 생성...
start "SHE ngrok" cmd /k "ngrok http 8080 --region=ap"
echo ngrok 시작 중... 10초 대기
timeout /t 10 /nobreak >nul

echo 4. 접속 정보 확인...
echo.
echo ========================================
echo 🎉 SHE 훈련 사이트 접속 정보
echo ========================================
echo.
echo 📱 사이트 명칭: SHE 디지털트윈 훈련 플랫폼
echo.
echo 🌐 접속 방법:
echo    방법 1: 로컬 네트워크 접속
echo    URL: http://172.20.10.3:3000
echo.
echo    방법 2: 외부 접속 (ngrok)
echo    새로운 ngrok URL을 확인하려면:
echo    ngrok 창에서 "Forwarding" 라인을 확인하세요
echo.
echo 👤 로그인 정보:
echo    사용자명: dnrdl4070
echo    비밀번호: @wlsghks12
echo.
echo ========================================
echo ✅ 완료! 이제 접속해보세요!
echo ========================================
echo.
pause

