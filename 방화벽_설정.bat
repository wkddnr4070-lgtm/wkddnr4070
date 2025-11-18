@echo off
echo ========================================
echo SHE 디지털트윈 방화벽 설정 도우미
echo ========================================
echo.

echo 현재 IP 주소 확인 중...
ipconfig | findstr "IPv4"
echo.

echo 방화벽 규칙 추가 중...
echo 포트 3000 (프론트엔드) 허용...
netsh advfirewall firewall add rule name="SHE-Frontend-3000" dir=in action=allow protocol=TCP localport=3000

echo 포트 3001 (백엔드) 허용...
netsh advfirewall firewall add rule name="SHE-Backend-3001" dir=in action=allow protocol=TCP localport=3001

echo.
echo ========================================
echo 방화벽 설정 완료!
echo ========================================
echo.
echo 이제 다른 컴퓨터에서 다음 주소로 접속할 수 있습니다:
echo http://[현재IP]:3000
echo.
echo 현재 IP 주소:
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr "IPv4"') do echo %%a
echo.
echo 로그인 정보:
echo 사용자명: dnrdl4070
echo 비밀번호: @wlsghks12
echo.
pause
