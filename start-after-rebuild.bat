@echo off
echo ========================================
echo PowerShell 재구축 후 서버 시작
echo ========================================

:: PowerShell 재구축 실행
echo [1단계] PowerShell 재구축 실행
call complete-powershell-rebuild.bat

if %errorlevel% neq 0 (
    echo PowerShell 재구축 실패!
    pause
    exit /b 1
)

echo.
echo [2단계] 재구축된 PowerShell로 서버 시작 테스트
timeout /t 3 /nobreak >nul

:: 새로운 PowerShell로 서버 시작
echo PowerShell을 사용하여 서버를 시작합니다...
powershell -NoExit -Command "cd 'C:\Users\com\Desktop\SHE 디지털트윈'; Write-Host '프로젝트 디렉토리로 이동 완료' -ForegroundColor Green; Write-Host '서버를 시작합니다...' -ForegroundColor Yellow; npm run dev"

pause

