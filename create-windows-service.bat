@echo off
title Windows 서비스로 서버 등록
color 0A

echo ========================================
echo Windows 작업 스케줄러로 서버 등록
echo ========================================
echo.
echo 이 방법은 컴퓨터 부팅시 자동으로 서버를 시작합니다.
echo.

cd /d "%~dp0"

echo [1/3] 서버 시작 스크립트 생성...

echo @echo off > start-frontend-service.bat
echo cd /d "%~dp0" >> start-frontend-service.bat
echo npm run dev >> start-frontend-service.bat

echo @echo off > start-backend-service.bat
echo cd /d "%~dp0\backend" >> start-backend-service.bat
echo npm start >> start-backend-service.bat

echo.
echo [2/3] 작업 스케줄러에 등록...
echo.
echo 관리자 권한이 필요합니다...

schtasks /create /tn "SHE-Frontend-Server" /tr "%CD%\start-frontend-service.bat" /sc onstart /ru "SYSTEM" /f
schtasks /create /tn "SHE-Backend-Server" /tr "%CD%\start-backend-service.bat" /sc onstart /ru "SYSTEM" /f

echo.
echo [3/3] 서비스 즉시 시작...
schtasks /run /tn "SHE-Frontend-Server"
schtasks /run /tn "SHE-Backend-Server"

echo.
echo ========================================
echo Windows 서비스 관리 명령어
echo ========================================
echo.
echo 📊 서비스 상태 확인:   schtasks /query /tn "SHE-Frontend-Server"
echo 🚀 서비스 시작:       schtasks /run /tn "SHE-Frontend-Server"
echo 🛑 서비스 중지:       schtasks /end /tn "SHE-Frontend-Server"
echo 🗑️  서비스 삭제:       schtasks /delete /tn "SHE-Frontend-Server" /f
echo.

echo ✅ Windows 서비스 등록 완료!
echo.
echo 이제 컴퓨터를 재부팅해도 서버가 자동으로 시작됩니다.
echo.

pause

