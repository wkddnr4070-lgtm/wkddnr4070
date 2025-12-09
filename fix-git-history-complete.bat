@echo off
REM Git 히스토리에서 API 키 완전 제거 (고급)
chcp 65001 >nul
setlocal enabledelayedexpansion

cd /d "%~dp0"

echo ========================================
echo   Git 히스토리에서 API 키 완전 제거
echo ========================================
echo.
echo ⚠️  주의: 이 작업은 Git 히스토리를 수정합니다.
echo ⚠️  협업 중이라면 팀원과 상의하세요.
echo.
echo 현재 문제:
echo - 커밋 bf20d685에 API 키가 포함되어 있음
echo - GitHub Push Protection이 차단함
echo.
echo 해결 방법:
echo 1. 해당 커밋을 찾아서 수정
echo 2. 또는 새 브랜치 생성 후 푸시
echo.
pause

echo.
echo [방법 1] 새 브랜치 생성 (권장)
echo ----------------------------------------
echo 현재 커밋을 새 브랜치로 푸시하면 히스토리 문제를 피할 수 있습니다.
echo.
set /p create_branch="새 브랜치를 생성하시겠습니까? (Y/N): "
if /i "!create_branch!"=="Y" (
    set /p branch_name="브랜치 이름 (기본: production-clean): "
    if "!branch_name!"=="" set branch_name=production-clean
    
    echo.
    echo 새 브랜치 생성: !branch_name!
    git checkout -b !branch_name!
    
    echo.
    echo GitHub에 푸시 중...
    git push origin !branch_name!
    if errorlevel 1 (
        git push -u origin !branch_name!
    )
    
    echo.
    echo ✅ 새 브랜치로 푸시 완료!
    echo.
    echo 다음 단계:
    echo 1. GitHub에서 !branch_name! 브랜치 확인
    echo 2. Vercel에서 이 브랜치를 사용하도록 설정
    echo.
    pause
    exit /b 0
)

echo.
echo [방법 2] Git 히스토리 수정 (고급)
echo ----------------------------------------
echo 이 방법은 복잡하고 위험할 수 있습니다.
echo.
echo 대신 방법 1(새 브랜치)을 사용하는 것을 권장합니다.
echo.
pause

