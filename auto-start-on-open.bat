@echo off
title SHE 디지털트윈 - IDE 자동 시작 설정
color 0A

echo ========================================
echo SHE 디지털트윈 플랫폼 자동 시작 설정
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] 프로젝트 파일 확인...
if exist package.json (
    echo ✅ 프론트엔드 package.json 확인
) else (
    echo ❌ 프론트엔드 package.json 없음
    pause
    exit /b 1
)

if exist backend\package.json (
    echo ✅ 백엔드 package.json 확인
) else (
    echo ❌ 백엔드 package.json 없음
    pause
    exit /b 1
)

echo.
echo [2/3] IDE 설정 파일 확인...
if exist .vscode\tasks.json (
    echo ✅ VS Code Tasks 설정 완료
) else (
    echo ❌ VS Code Tasks 설정 없음
)

if exist start-platform.js (
    echo ✅ 자동 시작 스크립트 확인
) else (
    echo ❌ 자동 시작 스크립트 없음
)

echo.
echo [3/3] 자동 시작 테스트...
echo 자동 시작 스크립트를 실행합니다...
echo.

node start-platform.js

echo.
echo ========================================
echo IDE 자동 시작 설정 완료!
echo ========================================
echo.
echo 🎯 사용 방법:
echo 1. Cursor/VS Code에서 이 폴더를 열면 자동으로 서버가 시작됩니다
echo 2. 또는 F5 키를 눌러서 수동으로 시작할 수 있습니다
echo 3. Ctrl+Shift+P → "Tasks: Run Task" → "🚀 전체 서버 시작"
echo.
echo 🌐 프론트엔드: http://localhost:3000
echo 🔧 백엔드: http://localhost:3001
echo.

pause

