@echo off
chcp 65001 >nul
echo 🔍 React 앱 빈 페이지 문제 해결
echo ================================
echo.

cd /d "C:\Users\com\Desktop\SHE 디지털트윈"
echo 📂 현재 위치: %cd%
echo.

echo 📋 핵심 파일들 확인:
echo.
if exist "index.html" (
    echo ✅ index.html 존재
    echo 📄 index.html 내용:
    type index.html | findstr -n "root\|main\|script"
) else (
    echo ❌ index.html 없음 - 이것이 문제입니다!
)
echo.

if exist "main.jsx" (
    echo ✅ main.jsx 존재
    echo 📄 main.jsx 첫 10줄:
    powershell -Command "Get-Content 'main.jsx' | Select-Object -First 10"
) else (
    echo ❌ main.jsx 없음
)
echo.

if exist "src\App.jsx" (
    echo ✅ src\App.jsx 존재
    echo 📄 App.jsx 첫 10줄:
    powershell -Command "Get-Content 'src\App.jsx' | Select-Object -First 10"
) else (
    echo ❌ src\App.jsx 없음
)
echo.

echo 📦 package.json 스크립트 확인:
type package.json | findstr -A 5 -B 2 "scripts"
echo.

echo 🔍 node_modules 확인:
if exist "node_modules\react" (echo ✅ React 설치됨) else (echo ❌ React 미설치)
if exist "node_modules\vite" (echo ✅ Vite 설치됨) else (echo ❌ Vite 미설치)
echo.

echo 🧹 캐시 정리 후 재시작...
echo 기존 프로세스 종료...
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo 캐시 삭제...
if exist "node_modules\.vite" rmdir /s /q "node_modules\.vite" >nul 2>&1
if exist "dist" rmdir /s /q "dist" >nul 2>&1

echo.
echo 🚀 개발 서버를 다시 시작합니다...
echo 📱 브라우저에서 표시되는 주소로 접속하세요
echo ⏹️ 서버를 중지하려면 Ctrl+C 누르세요
echo.

npm run dev

pause
