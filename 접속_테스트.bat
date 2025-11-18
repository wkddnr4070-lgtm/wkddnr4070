@echo off
echo ========================================
echo SHE 디지털트윈 접속 테스트 도구
echo ========================================
echo.

echo 1. 현재 IP 주소:
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr "IPv4"') do (
    set ip=%%a
    set ip=!ip: =!
    echo    !ip!
)
echo.

echo 2. 서버 포트 상태 확인:
echo    포트 3000 (프론트엔드):
netstat -an | findstr ":3000"
if %errorlevel% neq 0 (
    echo    ❌ 포트 3000이 열려있지 않습니다!
    echo    해결방법: npm start 실행
) else (
    echo    ✅ 포트 3000이 열려있습니다
)
echo.

echo    포트 3001 (백엔드):
netstat -an | findstr ":3001"
if %errorlevel% neq 0 (
    echo    ❌ 포트 3001이 열려있지 않습니다!
    echo    해결방법: cd backend && npm start 실행
) else (
    echo    ✅ 포트 3001이 열려있습니다
)
echo.

echo 3. 방화벽 규칙 확인:
echo    프론트엔드 규칙:
netsh advfirewall firewall show rule name="SHE-Frontend-3000" 2>nul
if %errorlevel% neq 0 (
    echo    ❌ 방화벽 규칙이 없습니다!
    echo    해결방법: 관리자 권한으로 방화벽 설정
) else (
    echo    ✅ 방화벽 규칙이 있습니다
)
echo.

echo 4. 로컬 접속 테스트:
echo    http://localhost:3000 접속 테스트 중...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3000' -TimeoutSec 5; Write-Host '✅ 로컬 접속 성공!' } catch { Write-Host '❌ 로컬 접속 실패!' }"
echo.

echo ========================================
echo 접속 정보
echo ========================================
echo.
echo 다른 사람이 접속할 주소:
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr "IPv4"') do (
    set ip=%%a
    set ip=!ip: =!
    echo    http://!ip!:3000
)
echo.
echo 로그인 정보:
echo    사용자명: dnrdl4070
echo    비밀번호: @wlsghks12
echo.
echo ========================================
echo 문제 해결 체크리스트
echo ========================================
echo.
echo ✅ 서버가 실행 중인가?
echo ✅ 방화벽이 포트를 차단하지 않는가?
echo ✅ 같은 Wi-Fi 네트워크에 연결되어 있는가?
echo ✅ 브라우저 캐시를 클리어했는가?
echo.
echo 문제가 계속되면 '접속_문제_해결_가이드.md' 파일을 참고하세요.
echo.
pause
