@echo off
REM SHE 디지털트윈 플랫폼 배포 도우미 (CMD 사용)
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo   SHE 디지털트윈 플랫폼 배포 도우미
echo ========================================
echo.

REM 현재 스크립트가 있는 디렉토리로 이동
cd /d "%~dp0"

echo 현재 작업 디렉토리: %CD%
echo.

echo [1/5] 로컬 빌드 테스트 시작...
call npm run build
if errorlevel 1 (
    echo.
    echo ❌ 빌드 실패!
    echo 오류를 확인하고 수정한 후 다시 시도하세요.
    pause
    exit /b 1
)
echo ✅ 빌드 성공!
echo.

echo [2/5] Git 상태 확인...
git status --short >nul 2>&1
if errorlevel 0 (
    echo ⚠️  커밋되지 않은 변경사항이 있습니다.
    echo.
    set /p commit="변경사항을 커밋하시겠습니까? (y/n): "
    if /i "%commit%"=="y" (
        git add .
        set /p msg="커밋 메시지를 입력하세요 (기본: 배포 준비 완료): "
        if "!msg!"=="" set msg=배포 준비 완료
        git commit -m "%msg%"
        echo ✅ 커밋 완료!
    )
)
echo.

echo [3/5] Git 원격 저장소 확인...
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo ⚠️  원격 저장소가 설정되지 않았습니다.
    echo.
    echo GitHub 저장소 URL을 입력하세요:
    echo 예: https://github.com/username/repo.git
    set /p repo="저장소 URL: "
    if not "!repo!"=="" (
        git remote add origin "!repo!"
        echo ✅ 원격 저장소 추가 완료!
    ) else (
        echo ⚠️  원격 저장소를 나중에 추가하세요.
    )
) else (
    for /f "tokens=*" %%i in ('git remote get-url origin') do set remote=%%i
    echo ✅ 원격 저장소: !remote!
)
echo.

echo [4/5] GitHub 푸시 준비...
set /p push="GitHub에 푸시하시겠습니까? (y/n): "
if /i "%push%"=="y" (
    git push origin main 2>nul
    if errorlevel 1 (
        git push -u origin main
    )
    echo ✅ 푸시 완료!
)
echo.

echo [5/5] 배포 안내
echo ========================================
echo 다음 단계를 진행하세요:
echo.
echo 1. Vercel 대시보드 접속:
echo    https://vercel.com/dashboard
echo.
echo 2. "Add New Project" 클릭
echo.
echo 3. GitHub 저장소 선택
echo.
echo 4. 환경 변수 설정 (중요!):
echo    OPENAI_KEY=your_openai_api_key
echo    AI_FEEDBACK_ENABLED=true
echo    AI_MIN_SCORE=100
echo    VITE_AI_FEEDBACK_ENABLED=true
echo.
echo 5. "Deploy" 버튼 클릭
echo.
echo 자세한 내용은 DEPLOY_NOW.md 파일을 참고하세요.
echo ========================================
echo.
pause

