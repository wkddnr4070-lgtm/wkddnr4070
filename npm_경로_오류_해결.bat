@echo off
chcp 65001 >nul
echo ========================================
echo 🚨 npm 경로 오류 해결 도구
echo ========================================
echo.

echo 문제: npm이 잘못된 폴더에서 실행됨
echo 해결: 올바른 프로젝트 폴더로 이동
echo.

echo ========================================
echo 1단계: 올바른 폴더로 이동
echo ========================================
echo.
echo 현재 위치: %CD%
echo.
echo 올바른 폴더로 이동 중...
cd /d "C:\Users\com\Desktop\SHE 디지털트윈"
echo.
echo 이동 완료: %CD%
echo.

echo ========================================
echo 2단계: 프로젝트 파일 확인
echo ========================================
echo.
if exist "package.json" (
    echo ✅ package.json 파일 발견!
) else (
    echo ❌ package.json 파일을 찾을 수 없습니다.
    echo 올바른 폴더인지 확인해주세요.
    pause
    exit /b 1
)

if exist "src" (
    echo ✅ src 폴더 발견!
) else (
    echo ❌ src 폴더를 찾을 수 없습니다.
    pause
    exit /b 1
)

echo ✅ 모든 파일이 정상적으로 있습니다!
echo.

echo ========================================
echo 3단계: 서버 시작
echo ========================================
echo.
echo 서버를 시작합니다...
echo.
start "SHE Frontend Server" cmd /k "cd /d \"C:\Users\com\Desktop\SHE 디지털트윈\" && npm run dev"
echo.
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
    echo 수동으로 서버를 시작해주세요:
    echo 1. 새 CMD 창 열기
    echo 2. cd /d "C:\Users\com\Desktop\SHE 디지털트윈"
    echo 3. npm run dev
    echo.
    pause
    exit /b 1
) else (
    echo ✅ 서버가 정상적으로 실행 중입니다!
    echo.
    echo 브라우저에서 http://localhost:3000 접속 테스트
)

echo.
echo ========================================
echo 🎉 해결 완료!
echo ========================================
echo.
echo 이제 다시 ngrok 설정을 진행하세요:
echo 1. "초보자_ngrok_설정.bat" 실행
echo 2. 인증 토큰 입력
echo 3. 완료!
echo.
pause
