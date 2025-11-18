@echo off
echo ========================================
echo PowerShell 환경 진단
echo ========================================

echo [진단 1] PowerShell 프로세스 확인
tasklist | findstr powershell
echo.

echo [진단 2] PowerShell 실행 정책 확인
powershell -NoProfile -Command "Get-ExecutionPolicy -List"
echo.

echo [진단 3] PowerShell 버전 확인
powershell -NoProfile -Command "$PSVersionTable"
echo.

echo [진단 4] PowerShell 프로필 위치 확인
echo 사용자 프로필 디렉토리:
dir "%USERPROFILE%\Documents\WindowsPowerShell" 2>nul
echo.
dir "%USERPROFILE%\Documents\PowerShell" 2>nul
echo.

echo [진단 5] 임시 파일 확인
echo PowerShell 임시 파일:
dir "%TEMP%\ps-*" 2>nul
echo.

echo [진단 6] 기본 PowerShell 명령 테스트
echo 기본 명령 테스트 중...
powershell -NoProfile -Command "Write-Host 'PowerShell 기본 기능 정상' -ForegroundColor Green; 1+1"

echo.
echo [진단 7] 프로젝트 디렉토리 접근 테스트
powershell -NoProfile -Command "cd 'C:\Users\com\Desktop\SHE 디지털트윈'; Write-Host '디렉토리 접근 성공' -ForegroundColor Green; Get-Location"

echo.
echo ========================================
echo 진단 완료
echo ========================================
pause

