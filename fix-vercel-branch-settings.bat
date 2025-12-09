@echo off
REM Vercel 프로젝트 브랜치 설정 변경 가이드
chcp 65001 >nul

echo ========================================
echo   Vercel 프로젝트 브랜치 설정 변경
echo ========================================
echo.
echo 현재 문제:
echo - Vercel이 'production' 브랜치에서 빌드 중
echo - 수정된 vercel.json은 'production-clean' 브랜치에 있음
echo.
echo 해결 방법:
echo Option 1: Vercel 설정에서 Production Branch 변경
echo Option 2: production 브랜치에도 수정사항 적용
echo.

echo ========================================
echo   Option 1: Vercel 설정 변경 (권장)
echo ========================================
echo.
echo 1. Vercel 대시보드로 이동
echo 2. Settings 탭 클릭
echo 3. Git 섹션 찾기
echo 4. Production Branch를 'production-clean'으로 변경
echo 5. Save 클릭
echo.
set /p option1="Option 1을 선택하시겠습니까? (Y/N): "

if /i "%option1%"=="Y" (
    echo.
    echo [단계별 안내]
    echo.
    echo 1단계: Vercel 프로젝트 설정으로 이동
    echo https://vercel.com/jangwookkims-projects/she-safety-hub-2026/settings
    echo.
    echo 2단계: 왼쪽 사이드바에서 "Git" 클릭
    echo.
    echo 3단계: "Production Branch" 찾기
    echo 현재: production
    echo 변경: production-clean
    echo.
    echo 4단계: "Save" 또는 "저장" 버튼 클릭
    echo.
    echo 5단계: 자동 재배포 시작됨
    echo.
    set /p open_settings="Vercel 프로젝트 설정을 브라우저에서 열까요? (Y/N): "
    if /i "!open_settings!"=="Y" (
        start https://vercel.com/jangwookkims-projects/she-safety-hub-2026/settings/git
        echo.
        echo 브라우저가 열렸습니다.
        echo Production Branch를 'production-clean'으로 변경하세요.
    )
    echo.
    pause
    exit /b 0
)

echo.
echo ========================================
echo   Option 2: production 브랜치 업데이트
echo ========================================
echo.
echo production 브랜치에도 수정된 vercel.json을 적용합니다.
echo.
set /p option2="Option 2를 선택하시겠습니까? (Y/N): "

if /i "%option2%"=="Y" (
    call fix-branch-issue.bat
) else (
    echo.
    echo 선택하지 않았습니다.
    echo Option 1 (Vercel 설정 변경)을 권장합니다.
)
echo.
pause
