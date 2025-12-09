@echo off
chcp 65001 >nul
echo PowerShell 오류 해결 도구
echo ========================================
echo.

echo [1/3] PowerShell 실행 정책 확인...
powershell -Command "Get-ExecutionPolicy" >nul 2>&1
if errorlevel 1 (
    echo PowerShell 실행 정책을 확인할 수 없습니다.
) else (
    echo PowerShell 실행 정책 확인 완료
)
echo.

echo [2/3] CMD를 사용한 Git 명령어 테스트...
cd /d "%~dp0"
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git이 설치되지 않았거나 PATH에 없습니다.
) else (
    echo ✅ Git 사용 가능
    git --version
)
echo.

echo [3/3] npm 명령어 테스트...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm이 설치되지 않았거나 PATH에 없습니다.
) else (
    echo ✅ npm 사용 가능
    npm --version
)
echo.

echo ========================================
echo 해결 방법:
echo 1. CMD(명령 프롬프트)를 사용하세요
echo 2. 배치 파일(.bat)은 CMD에서 정상 작동합니다
echo 3. PowerShell 대신 CMD를 사용하는 스크립트를 제공합니다
echo ========================================
echo.
pause
