@echo off
chcp 65001 >nul
echo ========================================
echo 🚀 영문 경로용 서버 시작 도구
echo ========================================
echo.

echo 이 도구는 C:\SHE\ 폴더에서 서버를 시작합니다.
echo (한글 경로 오류 해결용)
echo.

echo ========================================
echo 1단계: 경로 확인
echo ========================================
echo.
if not exist "C:\SHE" (
    echo ❌ C:\SHE 폴더가 존재하지 않습니다.
    echo.
    echo 먼저 "파일이름_오류_완전해결.bat"를 실행하세요.
    echo.
    pause
    exit /b 1
)

echo ✅ C:\SHE 폴더 확인 완료
echo.

echo ========================================
echo 2단계: 프로젝트 파일 확인
echo ========================================
echo.
cd /d "C:\SHE"
echo 현재 위치: %CD%
echo.

if exist "package.json" (
    echo ✅ package.json 확인 완료
) else (
    echo ❌ package.json을 찾을 수 없습니다.
    echo 프로젝트 파일이 제대로 복사되지 않았습니다.
    pause
    exit /b 1
)

echo.
echo ========================================
echo 3단계: 서버 시작
echo ========================================
echo.
echo 기존 Node.js 프로세스 종료 중...
taskkill /f /im node.exe >nul 2>&1
timeout /t 3 /nobreak >nul

echo 서버 시작 중...
start "SHE Frontend Server" cmd /k "cd /d \"C:\SHE\" && npm run dev"
echo 서버 시작 중... 15초 대기
timeout /t 15 /nobreak >nul

echo ========================================
echo 4단계: 서버 상태 확인
echo ========================================
echo.
netstat -an | findstr ":3000" >nul
if %errorlevel% neq 0 (
    echo ❌ 서버 시작에 실패했습니다.
    echo.
    echo 수동 해결:
    echo 1. 새 CMD 창 열기
    echo 2. cd /d "C:\SHE"
    echo 3. npm run dev
) else (
    echo ✅ 서버가 성공적으로 시작되었습니다!
    echo.
    echo 브라우저에서 테스트: http://localhost:3000
)

echo.
echo ========================================
echo 5단계: ngrok 시작 (선택사항)
echo ========================================
echo.
set /p start_ngrok="ngrok도 시작하시겠습니까? (y/n): "

if /i "%start_ngrok%"=="y" (
    echo ngrok 시작 중...
    start "SHE ngrok Tunnel" cmd /k "cd /d \"C:\SHE\" && ngrok http 3000"
    echo.
    echo ngrok이 시작되었습니다.
    echo 새 창에서 공용 URL을 확인하세요.
) else (
    echo ngrok을 시작하지 않습니다.
)

echo.
echo ========================================
echo 🎉 완료!
echo ========================================
echo.
echo 📁 작업 위치: C:\SHE\
echo 🌐 로컬 접속: http://localhost:3000
echo.
echo 로그인 정보:
echo   사용자명: dnrdl4070
echo   비밀번호: @wlsghks12
echo.
echo ⚠️ 앞으로는 C:\SHE\ 폴더에서 작업하세요!
echo.
pause
