@echo off
echo ========================================
echo SHE 디지털트윈 서버 시작 도구 (수정됨)
echo ========================================
echo.

echo 올바른 프로젝트 폴더로 이동 중...
cd /d "C:\Users\com\Desktop\SHE 디지털트윈"

echo.
echo 서버를 시작합니다...
echo.

echo 1. 프론트엔드 서버 시작 중...
start "SHE Frontend Server" cmd /k "npm run dev"
echo    프론트엔드 서버 시작됨 (포트 3000 또는 3001)
echo.

echo 2. 5초 대기 중...
timeout /t 5 /nobreak >nul

echo 3. 백엔드 서버 시작 중...
start "SHE Backend Server" cmd /k "cd backend && npm start"
echo    백엔드 서버 시작됨 (포트 3001)
echo.

echo 4. 서버 상태 확인 중...
timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo 서버 시작 완료!
echo ========================================
echo.
echo 접속 주소:
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr "IPv4"') do (
    set ip=%%a
    set ip=!ip: =!
    echo    로컬: http://localhost:3000 또는 http://localhost:3001
    echo    네트워크: http://!ip!:3000 또는 http://!ip!:3001
)
echo.
echo 로그인 정보:
echo    사용자명: dnrdl4070
echo    비밀번호: @wlsghks12
echo.
echo 서버를 중지하려면 각 CMD 창에서 Ctrl+C를 누르세요.
echo.
pause
