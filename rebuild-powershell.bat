@echo off
chcp 65001 >nul
echo ========================================
echo PowerShell 완전 재구축
echo ========================================

:: 관리자 권한 확인
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo 관리자 권한이 필요합니다. 관리자로 다시 실행해주세요.
    pause
    exit /b 1
)

echo [1단계] PowerShell 프로세스 종료
taskkill /F /IM powershell.exe 2>nul
taskkill /F /IM pwsh.exe 2>nul
timeout /t 2 /nobreak >nul

echo [2단계] PowerShell 임시 파일 정리
del /q "%TEMP%\ps-*" 2>nul
del /q "%LOCALAPPDATA%\Temp\ps-*" 2>nul

echo [3단계] PowerShell 모듈 캐시 정리
if exist "%USERPROFILE%\Documents\WindowsPowerShell" (
    rmdir /s /q "%USERPROFILE%\Documents\WindowsPowerShell" 2>nul
)
if exist "%USERPROFILE%\Documents\PowerShell" (
    rmdir /s /q "%USERPROFILE%\Documents\PowerShell" 2>nul
)

echo [4단계] PowerShell 실행 정책 초기화
reg delete "HKCU\Software\Microsoft\PowerShell\1\ShellIds\Microsoft.PowerShell" /f 2>nul
reg add "HKCU\Software\Microsoft\PowerShell\1\ShellIds\Microsoft.PowerShell" /v ExecutionPolicy /t REG_SZ /d RemoteSigned /f

echo [5단계] 새로운 PowerShell 프로필 생성
mkdir "%USERPROFILE%\Documents\WindowsPowerShell" 2>nul
echo # 새로운 PowerShell 프로필 > "%USERPROFILE%\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1"
echo Set-Location "C:\Users\com\Desktop\SHE 디지털트윈" >> "%USERPROFILE%\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1"

echo [6단계] PowerShell 테스트
powershell -Command "Write-Host 'PowerShell 재구축 완료!' -ForegroundColor Green; Get-Location"

echo.
echo ========================================
echo PowerShell 재구축 완료!
echo ========================================
pause

