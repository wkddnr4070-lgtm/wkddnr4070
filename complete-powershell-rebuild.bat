@echo off
echo ========================================
echo PowerShell 완전 재구축 시작
echo ========================================

:: 관리자 권한 확인
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo 이 스크립트는 관리자 권한이 필요합니다.
    echo 우클릭하여 "관리자 권한으로 실행"을 선택해주세요.
    pause
    exit /b 1
)

echo [1단계] 모든 PowerShell 프로세스 강제 종료
taskkill /F /IM powershell.exe 2>nul
taskkill /F /IM pwsh.exe 2>nul
taskkill /F /IM powershell_ise.exe 2>nul
timeout /t 3 /nobreak >nul

echo [2단계] PowerShell 관련 임시 파일 완전 삭제
for /d %%i in ("%TEMP%\ps-*") do rmdir /s /q "%%i" 2>nul
del /q "%TEMP%\ps-*" 2>nul
for /d %%i in ("%LOCALAPPDATA%\Temp\ps-*") do rmdir /s /q "%%i" 2>nul
del /q "%LOCALAPPDATA%\Temp\ps-*" 2>nul

echo [3단계] PowerShell 사용자 프로필 백업 및 삭제
if exist "%USERPROFILE%\Documents\WindowsPowerShell" (
    echo 기존 PowerShell 프로필 백업 중...
    if not exist "%USERPROFILE%\Documents\PowerShell_Backup" mkdir "%USERPROFILE%\Documents\PowerShell_Backup"
    xcopy "%USERPROFILE%\Documents\WindowsPowerShell" "%USERPROFILE%\Documents\PowerShell_Backup\" /E /I /Y 2>nul
    rmdir /s /q "%USERPROFILE%\Documents\WindowsPowerShell" 2>nul
)

if exist "%USERPROFILE%\Documents\PowerShell" (
    if not exist "%USERPROFILE%\Documents\PowerShell_Backup" mkdir "%USERPROFILE%\Documents\PowerShell_Backup"
    xcopy "%USERPROFILE%\Documents\PowerShell" "%USERPROFILE%\Documents\PowerShell_Backup\" /E /I /Y 2>nul
    rmdir /s /q "%USERPROFILE%\Documents\PowerShell" 2>nul
)

echo [4단계] PowerShell 레지스트리 설정 초기화
reg delete "HKCU\Software\Microsoft\PowerShell\1\ShellIds\Microsoft.PowerShell" /f 2>nul
reg delete "HKLM\SOFTWARE\Microsoft\PowerShell\1\ShellIds\Microsoft.PowerShell" /f 2>nul

echo [5단계] PowerShell 실행 정책 설정
reg add "HKCU\Software\Microsoft\PowerShell\1\ShellIds\Microsoft.PowerShell" /v ExecutionPolicy /t REG_SZ /d RemoteSigned /f
reg add "HKLM\SOFTWARE\Microsoft\PowerShell\1\ShellIds\Microsoft.PowerShell" /v ExecutionPolicy /t REG_SZ /d RemoteSigned /f

echo [6단계] 새로운 PowerShell 프로필 디렉토리 생성
mkdir "%USERPROFILE%\Documents\WindowsPowerShell" 2>nul
mkdir "%USERPROFILE%\Documents\PowerShell" 2>nul

echo [7단계] 새로운 PowerShell 프로필 생성
echo # 새로운 PowerShell 프로필 - 자동 생성됨 > "%USERPROFILE%\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1"
echo # 기본 설정 >> "%USERPROFILE%\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1"
echo $ErrorActionPreference = "SilentlyContinue" >> "%USERPROFILE%\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1"
echo Set-Location "C:\Users\com\Desktop\SHE 디지털트윈" >> "%USERPROFILE%\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1"
echo Write-Host "PowerShell 환경이 정상적으로 로드되었습니다." -ForegroundColor Green >> "%USERPROFILE%\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1"

echo [8단계] PowerShell 모듈 캐시 정리
if exist "%USERPROFILE%\AppData\Local\Microsoft\Windows\PowerShell" (
    rmdir /s /q "%USERPROFILE%\AppData\Local\Microsoft\Windows\PowerShell" 2>nul
)

echo [9단계] PowerShell 테스트
echo PowerShell 테스트 중...
powershell -NoProfile -Command "Write-Host 'PowerShell 기본 테스트 성공!' -ForegroundColor Green"

if %errorlevel% neq 0 (
    echo PowerShell 기본 테스트 실패!
    echo Windows PowerShell을 재설치해야 할 수 있습니다.
    pause
    exit /b 1
)

echo [10단계] 프로필과 함께 PowerShell 테스트
powershell -Command "Write-Host 'PowerShell 프로필 테스트 성공!' -ForegroundColor Cyan; Get-Location"

echo.
echo ========================================
echo PowerShell 재구축 완료!
echo ========================================
echo.
echo 이제 다음 명령어로 서버를 시작할 수 있습니다:
echo powershell -Command "cd 'C:\Users\com\Desktop\SHE 디지털트윈'; npm run dev"
echo.
pause
