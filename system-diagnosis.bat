@echo off
echo ========================================
echo 시스템 환경 진단 스크립트
echo ========================================

echo.
echo 1. 운영체제 정보:
systeminfo | findstr /B /C:"OS Name" /C:"OS Version"

echo.
echo 2. PowerShell 버전:
powershell -Command "$PSVersionTable.PSVersion"

echo.
echo 3. Node.js 설치 확인:
where node
node --version

echo.
echo 4. npm 설치 확인:
where npm
npm --version

echo.
echo 5. 현재 디렉토리:
echo %CD%

echo.
echo 6. 프로젝트 파일 확인:
if exist package.json (
    echo ✓ package.json 존재
) else (
    echo ✗ package.json 없음
)

if exist backend\package.json (
    echo ✓ backend\package.json 존재
) else (
    echo ✗ backend\package.json 없음
)

if exist src\App.jsx (
    echo ✓ src\App.jsx 존재
) else (
    echo ✗ src\App.jsx 없음
)

if exist backend\src\app.js (
    echo ✓ backend\src\app.js 존재
) else (
    echo ✗ backend\src\app.js 없음
)

echo.
echo 7. 포트 사용 현황:
echo 포트 3000:
netstat -ano | findstr ":3000"
echo 포트 3001:
netstat -ano | findstr ":3001"

echo.
echo 8. 프로세스 확인:
tasklist | findstr /i "node"

echo.
echo ========================================
echo 진단 완료!
echo ========================================

pause

