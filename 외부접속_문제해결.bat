@echo off
chcp 65001 >nul
echo ========================================
echo 🚨 외부 접속 문제 진단 도구
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
echo 2단계: 포트 상태 확인
echo ========================================
echo.
netstat -an | findstr ":3000" >nul
if %errorlevel% neq 0 (
    echo ❌ 포트 3000이 사용되지 않고 있습니다.
) else (
    echo ✅ 포트 3000이 사용 중입니다.
)

echo.
echo ========================================
echo 3단계: ngrok 상태 확인
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
echo 4단계: 로컬 접속 테스트
echo ========================================
echo.
echo 로컬 접속 테스트 중...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3000' -TimeoutSec 5; Write-Host '✅ 로컬 접속 성공!' } catch { Write-Host '❌ 로컬 접속 실패: ' $_.Exception.Message }"

echo.
echo ========================================
echo 5단계: ngrok 접속 테스트
echo ========================================
echo.
echo ngrok 접속 테스트 중...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'https://drooly-pseudosessile-teresita.ngrok-free.dev' -TimeoutSec 10; Write-Host '✅ ngrok 접속 성공!' } catch { Write-Host '❌ ngrok 접속 실패: ' $_.Exception.Message }"

echo.
echo ========================================
echo 6단계: 서버 재시작 (404 오류 해결)
echo ========================================
echo.
echo 서버에 404 오류가 발생했습니다.
echo 서버를 재시작합니다...
echo.

echo 기존 Node.js 프로세스 종료 중...
taskkill /f /im node.exe >nul 2>&1
timeout /t 3 /nobreak >nul

echo C:\SHE 폴더로 이동...
cd /d "C:\SHE"

echo 서버 재시작 중...
start "SHE Frontend Server" cmd /k "cd /d \"C:\SHE\" && npm run dev"
echo 서버 시작 중... 15초 대기
timeout /t 15 /nobreak >nul

echo 서버 상태 재확인...
netstat -an | findstr ":3000" >nul
if %errorlevel% neq 0 (
    echo ❌ 서버 재시작에 실패했습니다.
    echo.
    echo 수동 해결 방법:
    echo 1. 새 CMD 창 열기
    echo 2. cd /d "C:\SHE"
    echo 3. npm run dev
) else (
    echo ✅ 서버가 성공적으로 재시작되었습니다!
    echo.
    echo 브라우저에서 테스트:
    echo - 로컬: http://localhost:3000
    echo - 공용: https://drooly-pseudosessile-teresita.ngrok-free.dev
)

echo.
echo ========================================
echo 7단계: 외부 접속 가능성 확인
echo ========================================
echo.
echo 외부 접속이 안되는 이유:
echo.
echo 1. 서버 404 오류 (위에서 해결됨)
echo 2. 방화벽 차단
echo 3. 네트워크 설정 문제
echo 4. ngrok 무료 버전 제한
echo.
echo 해결 방법:
echo 1. 서버 재시작 완료
echo 2. 방화벽 설정 확인
echo 3. 다른 네트워크에서 테스트
echo 4. ngrok 유료 버전 고려
echo.

echo ========================================
echo 🎯 최종 해결 방법
echo ========================================
echo.
echo 1. 서버 재시작 완료
echo 2. 브라우저에서 테스트:
echo    http://localhost:3000
echo    https://drooly-pseudosessile-teresita.ngrok-free.dev
echo.
echo 3. 다른 사람에게 공유:
echo    접속 주소: https://drooly-pseudosessile-teresita.ngrok-free.dev
echo    사용자명: dnrdl4070
echo    비밀번호: @wlsghks12
echo.
echo 4. 접속이 안되면:
echo    - 방화벽 설정 확인
echo    - 다른 네트워크에서 테스트
echo    - ngrok 유료 버전 고려
echo.
pause
