@echo off
chcp 65001
echo 🔍 서버 디버깅 시작...
echo.

cd /d "C:\Users\com\Desktop\SHE 디지털트윈"
echo 📂 현재 위치: %cd%
echo.

echo 📋 package.json 확인...
if exist package.json (
    echo ✅ package.json 존재
    type package.json | findstr "scripts" -A 5
) else (
    echo ❌ package.json 없음
)
echo.

echo 📦 node_modules 확인...
if exist node_modules (
    echo ✅ node_modules 존재
) else (
    echo ❌ node_modules 없음 - npm install 필요
    npm install
)
echo.

echo 🚀 서버 시작 시도...
npm run dev

pause
