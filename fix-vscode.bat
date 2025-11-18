@echo off
chcp 65001
echo 🔧 VS Code 디렉토리 문제 해결 중...
echo.
echo 1️⃣ 현재 실행 중인 VS Code 종료...
taskkill /f /im Code.exe 2>nul
timeout /t 2 /nobreak >nul

echo 2️⃣ 프로젝트 폴더로 이동...
cd /d "C:\Users\com\Desktop\SHE 디지털트윈"
echo 📂 현재 위치: %cd%

echo 3️⃣ VS Code를 올바른 방법으로 실행...
if exist "C:\Users\%USERNAME%\AppData\Local\Programs\Microsoft VS Code\Code.exe" (
    "C:\Users\%USERNAME%\AppData\Local\Programs\Microsoft VS Code\Code.exe" .
    echo ✅ VS Code 실행됨 (사용자 설치)
) else if exist "C:\Program Files\Microsoft VS Code\Code.exe" (
    "C:\Program Files\Microsoft VS Code\Code.exe" .
    echo ✅ VS Code 실행됨 (시스템 설치)
) else (
    echo ❌ VS Code 실행 파일을 찾을 수 없습니다.
    echo 💡 수동으로 VS Code를 실행하고 다음 폴더를 열어주세요:
    echo    C:\Users\com\Desktop\SHE 디지털트윈
)

echo.
echo 4️⃣ 브라우저에서 다음 주소로 접속하세요:
echo    🌐 http://localhost:3000
echo.
pause
