@echo off
echo ========================================
echo PowerShell 환경 복구 중...
echo ========================================

echo [1단계] PowerShell 실행 정책 확인 및 수정
powershell -Command "Get-ExecutionPolicy"
powershell -Command "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force"

echo.
echo [2단계] PowerShell 프로필 백업 및 초기화
if exist "%USERPROFILE%\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1" (
    echo 기존 프로필 백업 중...
    copy "%USERPROFILE%\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1" "%USERPROFILE%\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1.backup"
    del "%USERPROFILE%\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1"
)

echo.
echo [3단계] PowerShell 모듈 캐시 정리
powershell -Command "Remove-Module * -Force -ErrorAction SilentlyContinue"

echo.
echo [4단계] 임시 파일 정리
del /q "%TEMP%\ps-script-*" 2>nul
del /q "%TEMP%\ps-state-*" 2>nul

echo.
echo [5단계] PowerShell 테스트
powershell -Command "Write-Host 'PowerShell 테스트 성공!' -ForegroundColor Green"

echo.
echo ========================================
echo PowerShell 환경 복구 완료!
echo ========================================
pause
