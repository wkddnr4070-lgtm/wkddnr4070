@echo off
echo ========================================
echo SHE 디지털트윈 네트워크 상태 확인
echo ========================================
echo.

echo 1. 현재 IP 주소:
ipconfig | findstr "IPv4"
echo.

echo 2. 네트워크 연결 상태:
ping -n 1 8.8.8.8
echo.

echo 3. 포트 사용 상태 확인:
echo 포트 3000 상태:
netstat -an | findstr ":3000"
echo.
echo 포트 3001 상태:
netstat -an | findstr ":3001"
echo.

echo 4. 방화벽 규칙 확인:
echo 프론트엔드 규칙:
netsh advfirewall firewall show rule name="SHE-Frontend-3000"
echo.
echo 백엔드 규칙:
netsh advfirewall firewall show rule name="SHE-Backend-3001"
echo.

echo ========================================
echo 접속 정보
echo ========================================
echo.
echo 다른 컴퓨터에서 접속할 주소:
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr "IPv4"') do (
    set ip=%%a
    set ip=!ip: =!
    echo http://!ip!:3000
)
echo.
echo 로그인 정보:
echo 사용자명: dnrdl4070
echo 비밀번호: @wlsghks12
echo.
echo 주의사항:
echo - 같은 Wi-Fi 네트워크에 연결되어 있어야 합니다
echo - 서버가 실행 중이어야 합니다
echo - 방화벽이 포트를 차단하지 않아야 합니다
echo.
pause
