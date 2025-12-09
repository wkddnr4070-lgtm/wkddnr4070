@echo off
REM GitHub 연결 테스트 스크립트
chcp 65001 >nul

echo ========================================
echo   GitHub 연결 테스트
echo ========================================
echo.

echo [테스트 1] 인터넷 연결 확인...
ping -n 2 8.8.8.8
if errorlevel 1 (
    echo ❌ 인터넷 연결 실패
) else (
    echo ✅ 인터넷 연결 성공
)
echo.

echo [테스트 2] GitHub DNS 해석...
nslookup github.com
echo.

echo [테스트 3] GitHub 웹사이트 접근 테스트...
ping -n 2 github.com
if errorlevel 1 (
    echo ❌ GitHub 접근 실패
) else (
    echo ✅ GitHub 접근 성공
)
echo.

echo [테스트 4] Git 원격 저장소 연결 테스트...
cd /d "%~dp0"
git ls-remote --heads origin 2>&1
if errorlevel 1 (
    echo ❌ Git 원격 저장소 연결 실패
    echo 네트워크 문제일 수 있습니다.
) else (
    echo ✅ Git 원격 저장소 연결 성공
)
echo.

pause

