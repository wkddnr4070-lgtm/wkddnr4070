@echo off
chcp 65001 >nul 2>&1
echo ========================================
echo 강제 서버 시작
echo ========================================

:: 모든 Node 프로세스 종료
echo [1단계] 기존 프로세스 정리
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM npm.cmd >nul 2>&1
timeout /t 2 /nobreak >nul

:: 직접 경로 이동
echo [2단계] 프로젝트 디렉토리로 이동
cd /d C:\Users\com\Desktop
for /d %%i in (SHE*) do cd "%%i"
echo 현재 디렉토리: %CD%

:: package.json 확인
if not exist package.json (
    echo 오류: package.json을 찾을 수 없습니다!
    pause
    exit /b 1
)

:: 의존성 확인
echo [3단계] 의존성 확인
if not exist node_modules (
    echo node_modules가 없습니다. 설치 중...
    call npm install
)

:: Vite 직접 실행
echo [4단계] Vite 서버 직접 실행
echo.
echo 서버를 시작합니다...
echo 접속 주소: http://localhost:3000
echo.

:: Vite를 직접 실행
call npx vite --host 0.0.0.0 --port 3000

pause

