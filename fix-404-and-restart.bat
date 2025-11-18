@echo off
chcp 65001 >nul
echo 🔧 main.jsx 404 오류 해결 후 서버 재시작
echo =========================================
echo.

cd /d "C:\Users\com\Desktop\SHE 디지털트윈"

echo 📂 현재 위치: %cd%
echo.

echo 📋 파일 구조 확인:
if exist "src\main.jsx" (echo ✅ src\main.jsx 존재) else (echo ❌ src\main.jsx 없음)
if exist "src\App.jsx" (echo ✅ src\App.jsx 존재) else (echo ❌ src\App.jsx 없음)
if exist "src\index.css" (echo ✅ src\index.css 존재) else (echo ❌ src\index.css 없음)
if exist "index.html" (echo ✅ index.html 존재) else (echo ❌ index.html 없음)
echo.

echo 🔄 기존 프로세스 종료...
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo 🧹 Vite 캐시 정리...
if exist "node_modules\.vite" rmdir /s /q "node_modules\.vite" >nul 2>&1

echo.
echo 🚀 서버 재시작...
echo 📱 브라우저에서 표시되는 주소로 접속하세요
echo ⏹️ 서버를 중지하려면 Ctrl+C 누르세요
echo.

npm run dev

pause
