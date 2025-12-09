@echo off
REM GitHub 허용 후 다음 단계 안내
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo   GitHub Push Protection 해제 후 단계
echo ========================================
echo.

echo [확인] GitHub에서 "Allow secret" 버튼을 클릭하셨나요?
echo.
set /p confirmed="클릭 완료했나요? (Y/N): "

if /i "%confirmed%"=="Y" (
    echo.
    echo ✅ 좋습니다! 이제 푸시를 다시 시도합니다.
    echo.
    echo [다음 단계] GitHub에 푸시...
    cd /d "%~dp0"
    
    for /f "tokens=2" %%b in ('git branch --show-current 2^>nul') do set current_branch=%%b
    if "%current_branch%"=="" set current_branch=production
    
    echo 현재 브랜치: %current_branch%
    git push origin %current_branch%
    if errorlevel 1 (
        echo.
        echo ⚠️  푸시 실패. upstream 설정을 시도합니다...
        git push -u origin !current_branch!
        if errorlevel 1 (
            echo.
            echo ❌ 푸시 실패
            echo.
            echo 가능한 원인:
            echo 1. GitHub에서 "Allow secret"을 클릭하지 않았을 수 있습니다
            echo 2. 페이지를 새로고침하고 다시 시도하세요
            echo 3. 다른 브라우저나 시크릿 모드에서 시도해보세요
            echo.
            pause
            exit /b 1
        )
    )
    
    echo.
    echo ✅ 푸시 완료!
    echo.
    echo ========================================
    echo   다음 단계: Vercel 배포
    echo ========================================
    echo.
    echo 1. Vercel 대시보드로 이동: https://vercel.com/dashboard
    echo 2. 프로젝트 선택 또는 새 프로젝트 생성
    echo 3. GitHub 저장소 연결: wkddnr4070-lgtm/wkddnr4070
    echo 4. 브랜치 선택: production
    echo 5. 환경 변수 설정:
    echo    - OPENAI_KEY=sk-... (실제 OpenAI API 키)
    echo    - AI_FEEDBACK_ENABLED=true
    echo    - AI_MIN_SCORE=100
    echo    - VITE_AI_FEEDBACK_ENABLED=true
    echo 6. 배포 시작
    echo.
    echo 자세한 내용은 VERCEL_DEPLOYMENT.md 참고
    echo.
    
) else (
    echo.
    echo ⚠️  GitHub에서 "Allow secret" 버튼을 클릭해야 합니다.
    echo.
    echo 다음 단계:
    echo 1. GitHub 페이지에서 "Allow secret" 또는 "일시 허용" 버튼 찾기
    echo 2. 버튼 클릭
    echo 3. 확인
    echo 4. 이 스크립트를 다시 실행
    echo.
    echo 링크가 닫혔다면 다시 열기:
    echo https://github.com/wkddnr4070-lgtm/wkddnr4070/security/secret-scanning/unblock-secret/36byhSdoiOAHaHeg6vsteUK7MQg
    echo.
)

pause

