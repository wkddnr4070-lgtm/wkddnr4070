@echo off
title 자동 시작 설정 확인
color 0A

echo ========================================
echo 기존 자동 시작 설정 확인
echo ========================================
echo.

echo [1] Windows 작업 스케줄러 확인...
schtasks /query | findstr /i "SHE"
schtasks /query | findstr /i "frontend"
schtasks /query | findstr /i "backend"
schtasks /query | findstr /i "node"

echo.
echo [2] PM2 프로세스 확인...
pm2 list 2>nul
if %errorlevel% == 0 (
    echo ✅ PM2가 설치되어 있습니다.
    pm2 status
) else (
    echo ❌ PM2가 설치되지 않았습니다.
)

echo.
echo [3] Windows 서비스 확인...
sc query | findstr /i "SHE"
sc query | findstr /i "node"

echo.
echo [4] 시작 프로그램 확인...
echo 시작 프로그램 폴더 내용:
dir "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup" /b

echo.
echo [5] 레지스트리 시작 프로그램 확인...
reg query "HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run" 2>nul | findstr /i "SHE"
reg query "HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run" 2>nul | findstr /i "node"

echo.
echo ========================================
echo 확인 완료
echo ========================================
echo.
echo 위에서 발견된 항목들이 자동 시작을 담당하고 있을 수 있습니다.
echo.

pause

