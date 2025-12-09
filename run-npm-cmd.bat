@echo off
REM npm 명령어 실행 도우미 (CMD 사용)
chcp 65001 >nul
setlocal enabledelayedexpansion

REM 프로젝트 디렉토리로 이동
cd /d "%~dp0"

echo ========================================
echo   npm 명령어 실행 도우미
echo ========================================
echo 현재 디렉토리: %CD%
echo.

:menu
echo.
echo 선택하세요:
echo   1. 빌드 테스트 (npm run build)
echo   2. 개발 서버 시작 (npm run dev)
echo   3. 프로덕션 미리보기 (npm run preview)
echo   4. 의존성 설치 (npm install)
echo   5. npm 버전 확인
echo   6. 종료
echo.
set /p choice="선택 (1-6): "

if "%choice%"=="1" goto build
if "%choice%"=="2" goto dev
if "%choice%"=="3" goto preview
if "%choice%"=="4" goto install
if "%choice%"=="5" goto version
if "%choice%"=="6" goto end
goto menu

:build
echo.
echo [빌드 테스트 시작...]
npm run build
if errorlevel 1 (
    echo.
    echo ❌ 빌드 실패!
) else (
    echo.
    echo ✅ 빌드 성공!
)
pause
goto menu

:dev
echo.
echo [개발 서버 시작...]
echo 서버를 중지하려면 Ctrl+C를 누르세요.
npm run dev
goto menu

:preview
echo.
echo [프로덕션 미리보기 시작...]
echo 서버를 중지하려면 Ctrl+C를 누르세요.
npm run preview
goto menu

:install
echo.
echo [의존성 설치 중...]
npm install
echo.
echo ✅ 설치 완료!
pause
goto menu

:version
echo.
echo [npm 버전 확인]
npm --version
node --version
pause
goto menu

:end
echo.
echo 종료합니다.
pause
exit /b 0


