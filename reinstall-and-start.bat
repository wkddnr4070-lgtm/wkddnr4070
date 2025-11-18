@echo off
chcp 65001 >nul
echo 🔄 의존성 재설치 및 서버 재시작
echo ================================
echo.

cd /d "C:\Users\com\Desktop\SHE 디지털트윈"

echo 🧹 기존 설치 정리...
if exist "node_modules" (
    echo node_modules 폴더 삭제 중...
    rmdir /s /q "node_modules"
)

if exist "package-lock.json" (
    echo package-lock.json 삭제 중...
    del "package-lock.json"
)

echo.
echo 📦 의존성 새로 설치...
npm install

echo.
echo 🚀 서버 시작...
npm run dev

pause
