@echo off
chcp 65001 >nul
title SHE 훈련 사이트 - 무료 터널링 대안
echo ========================================
echo SHE 디지털트윈 훈련 플랫폼 - 무료 대안
echo ========================================
echo.

echo ngrok 대신 사용할 수 있는 무료 터널링 서비스들:
echo.
echo 1. Cloudflare Tunnel (무료)
echo    - 가장 안정적이고 빠름
echo    - 설정이 조금 복잡함
echo.
echo 2. LocalTunnel (무료)
echo    - 간단한 설정
echo    - 가끔 불안정할 수 있음
echo.
echo 3. Serveo (무료)
echo    - SSH 기반
echo    - 매우 간단함
echo.
echo ========================================
echo 🚀 LocalTunnel로 즉시 테스트
echo ========================================
echo.

echo LocalTunnel 설치 및 실행...
npm install -g localtunnel
echo.
echo 터널 생성 중...
lt --port 3000 --subdomain she-training
echo.
echo ========================================
echo 📱 접속 정보
echo ========================================
echo.
echo 새로운 터널 URL이 생성됩니다.
echo 예시: https://she-training.loca.lt
echo.
echo 로그인 정보:
echo   사용자명: dnrdl4070
echo   비밀번호: @wlsghks12
echo.
pause

