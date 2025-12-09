@echo off
chcp 65001 >nul
echo ========================================
echo   Git 상태 확인 도우미
echo ========================================
echo.

REM 프로젝트 디렉토리로 이동
cd /d "%~dp0"

echo 현재 디렉토리: %CD%
echo.

echo [1/4] Git 저장소 확인...
if exist ".git" (
    echo ✅ Git 저장소가 존재합니다.
) else (
    echo ⚠️  Git 저장소가 없습니다.
    echo.
    set /p init="Git 저장소를 초기화하시겠습니까? (y/n): "
    if /i "%init%"=="y" (
        git init
        echo ✅ Git 저장소 초기화 완료!
    )
)
echo.

echo [2/4] Git 상태 확인...
git status
echo.

echo [3/4] 원격 저장소 확인...
git remote -v >nul 2>&1
if errorlevel 1 (
    echo ⚠️  원격 저장소가 설정되지 않았습니다.
    echo.
    echo GitHub 저장소 URL을 입력하세요:
    echo 예: https://github.com/username/repo.git
    set /p repo="저장소 URL: "
    if not "%repo%"=="" (
        git remote add origin "%repo%"
        echo ✅ 원격 저장소 추가 완료!
    )
) else (
    echo ✅ 원격 저장소:
    git remote -v
)
echo.

echo [4/4] 다음 단계 안내
echo ========================================
echo.
echo 변경사항이 있다면:
echo   1. git add .
echo   2. git commit -m "배포 준비 완료"
echo   3. git push origin main
echo.
echo 원격 저장소가 없다면:
echo   1. GitHub에서 새 저장소 생성
echo   2. git remote add origin [저장소URL]
echo   3. git push -u origin main
echo.
echo ========================================
echo.
pause


