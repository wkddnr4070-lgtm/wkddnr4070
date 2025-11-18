@echo off
chcp 65001 >nul
title SHE 훈련 사이트 - 완전 자동 해결
echo ========================================
echo SHE 디지털트윈 훈련 플랫폼 - 완전 자동 해결
echo ========================================
echo.

echo 현재 상황:
echo ✅ 서버: 정상 작동 (http://localhost:3000)
echo ⚠️  ngrok: 접속 불가
echo 🔄 LocalTunnel: 시작 중...
echo.

echo ========================================
echo 🚀 다중 터널링 서비스 시작
echo ========================================
echo.

echo 1. 기존 터널링 서비스 정리...
taskkill /f /im ngrok.exe >nul 2>&1
taskkill /f /im node.exe >nul 2>&1
timeout /t 3 /nobreak >nul

echo 2. 서버 재시작...
cd /d "C:\Users\com\Desktop\SHE 디지털트윈"
start "SHE 서버" cmd /k "npm run dev"
echo 서버 시작 중... 15초 대기
timeout /t 15 /nobreak >nul

echo 3. LocalTunnel 시작...
start "SHE LocalTunnel" cmd /k "lt --port 3000 --subdomain she-training"
echo LocalTunnel 시작 중... 10초 대기
timeout /t 10 /nobreak >nul

echo 4. ngrok 재시작...
start "SHE ngrok" cmd /k "ngrok http 3000 --region=ap"
echo ngrok 시작 중... 10초 대기
timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo 📱 접속 정보
echo ========================================
echo.

echo 사이트 명칭: SHE 디지털트윈 훈련 플랫폼
echo 로그인: dnrdl4070 / @wlsghks12
echo.

echo 🌐 접속 방법:
echo.
echo 1. 로컬 네트워크 (같은 와이파이):
echo    http://172.20.10.3:3000
echo.
echo 2. LocalTunnel (외부 접속):
echo    https://she-training.loca.lt
echo    (LocalTunnel 창에서 확인)
echo.
echo 3. ngrok (외부 접속):
echo    https://drooly-pseudosessile-teresita.ngrok-free.dev
echo    (ngrok 창에서 확인)
echo.

echo ========================================
echo ✅ 완료!
echo ========================================
echo.
echo 이제 여러 방법으로 접속할 수 있습니다!
echo LocalTunnel이 가장 안정적일 것입니다.
echo.
pause

