@echo off
chcp 65001 >nul
echo ========================================
echo 🔍 하얀 화면 문제 진단 및 해결
echo ========================================
echo.

echo 현재 상태를 확인하는 중...
echo.

echo ========================================
echo 1단계: 서버 상태 확인
echo ========================================
echo.
tasklist | findstr "node.exe" >nul
if %errorlevel% neq 0 (
    echo ❌ Node.js 서버가 실행되지 않았습니다.
    echo.
    echo 해결 방법:
    echo 1. C:\SHE 폴더로 이동
    echo 2. npm run dev 실행
) else (
    echo ✅ Node.js 서버가 실행 중입니다.
)

echo.
echo ========================================
echo 2단계: ngrok 상태 확인
echo ========================================
echo.
tasklist | findstr "ngrok.exe" >nul
if %errorlevel% neq 0 (
    echo ❌ ngrok이 실행되지 않았습니다.
    echo.
    echo 해결 방법:
    echo 1. C:\SHE 폴더로 이동
    echo 2. ngrok http 3000 실행
) else (
    echo ✅ ngrok이 실행 중입니다.
)

echo.
echo ========================================
echo 3단계: 접속 테스트
echo ========================================
echo.
echo 로컬 접속 테스트 중...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3000' -TimeoutSec 5; Write-Host '✅ 로컬 접속 성공! 상태코드:' $response.StatusCode } catch { Write-Host '❌ 로컬 접속 실패: ' $_.Exception.Message }"

echo.
echo ngrok 접속 테스트 중...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'https://drooly-pseudosessile-teresita.ngrok-free.dev' -TimeoutSec 10; Write-Host '✅ ngrok 접속 성공! 상태코드:' $response.StatusCode } catch { Write-Host '❌ ngrok 접속 실패: ' $_.Exception.Message }"

echo.
echo ========================================
echo 4단계: 하얀 화면 문제 해결
echo ========================================
echo.
echo 하얀 화면이 나타나는 이유:
echo.
echo 1. React 앱이 로드되지 않음
echo 2. JavaScript 오류 발생
echo 3. CSS 파일 로드 실패
echo 4. 네트워크 속도 문제
echo.
echo 해결 방법:
echo.
echo A. 브라우저 캐시 삭제:
echo    - Ctrl + Shift + R (강제 새로고침)
echo    - 또는 Ctrl + F5
echo.
echo B. 개발자 도구 확인:
echo    - F12 키 눌러서 개발자 도구 열기
echo    - Console 탭에서 오류 확인
echo    - Network 탭에서 파일 로딩 확인
echo.
echo C. 다른 브라우저 테스트:
echo    - Chrome, Edge, Firefox 등
echo.
echo D. 네트워크 속도 확인:
echo    - 인터넷 연결 상태 확인
echo    - 다른 사이트 접속 테스트
echo.

echo ========================================
echo 5단계: 서버 재시작 (필요시)
echo ========================================
echo.
set /p restart_server="서버를 재시작하시겠습니까? (y/n): "

if /i "%restart_server%"=="y" (
    echo 서버 재시작 중...
    echo.
    
    echo 기존 프로세스 종료 중...
    taskkill /f /im node.exe >nul 2>&1
    taskkill /f /im ngrok.exe >nul 2>&1
    timeout /t 3 /nobreak >nul
    
    echo C:\SHE 폴더로 이동...
    cd /d "C:\SHE"
    
    echo 서버 시작 중...
    start "SHE Frontend Server" cmd /k "cd /d \"C:\SHE\" && npm run dev"
    echo 서버 시작 중... 15초 대기
    timeout /t 15 /nobreak >nul
    
    echo ngrok 시작 중...
    start "SHE ngrok Tunnel" cmd /k "cd /d \"C:\SHE\" && ngrok http 3000"
    echo ngrok 시작 중... 10초 대기
    timeout /t 10 /nobreak >nul
    
    echo ✅ 서버와 ngrok이 재시작되었습니다!
) else (
    echo 서버 재시작을 건너뜁니다.
)

echo.
echo ========================================
echo 🎯 최종 해결 방법
echo ========================================
echo.
echo 1. 브라우저에서 강제 새로고침:
echo    Ctrl + Shift + R
echo.
echo 2. 개발자 도구로 오류 확인:
echo    F12 → Console 탭
echo.
echo 3. 다른 브라우저로 테스트:
echo    Chrome, Edge, Firefox 등
echo.
echo 4. 접속 주소:
echo    https://drooly-pseudosessile-teresita.ngrok-free.dev
echo.
echo 5. 로그인 정보:
echo    사용자명: dnrdl4070
echo    비밀번호: @wlsghks12
echo.
echo 6. 여전히 문제가 있으면:
echo    - 네트워크 속도 확인
echo    - 방화벽 설정 확인
echo    - 다른 네트워크에서 테스트
echo.
pause
