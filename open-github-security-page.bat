@echo off
REM GitHub 보안 스캔 페이지 열기
chcp 65001 >nul

echo ========================================
echo   GitHub 보안 스캔 페이지 열기
echo ========================================
echo.
echo GitHub 대시보드가 아닌 보안 스캔 페이지로 이동해야 합니다.
echo.
echo [1/3] 브라우저에서 보안 페이지 열기...
start https://github.com/wkddnr4070-lgtm/wkddnr4070/security/secret-scanning/unblock-secret/36byhSdoiOAHaHeg6vsteUK7MQg
echo.
echo 브라우저가 열렸습니다.
echo.
echo [2/3] 페이지에서 찾을 내용:
echo ----------------------------------------
echo 1. "OpenAI API Key" 또는 "Secret detected" 메시지
echo 2. "Allow secret" 또는 "일시 허용" 버튼
echo 3. 또는 "Unblock secret" 버튼
echo.
echo [3/3] 버튼을 클릭한 후...
echo ----------------------------------------
echo 1. 확인 메시지가 표시됩니다
echo 2. 이 창으로 돌아와서 Enter를 누르세요
echo 3. 자동으로 푸시를 시도합니다
echo.
pause

echo.
echo [푸시 시도 중...]
cd /d "%~dp0"

REM 현재 브랜치 확인
for /f "tokens=*" %%b in ('git branch --show-current 2^>nul') do set current_branch=%%b
if "%current_branch%"=="" set current_branch=production

echo 현재 브랜치: %current_branch%
echo.

git push origin %current_branch%
if errorlevel 1 (
    echo.
    echo ⚠️  푸시 실패. upstream 설정을 시도합니다...
    git push -u origin %current_branch%
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
echo 4. 브랜치 선택: %current_branch%
echo 5. 환경 변수 설정:
echo    - OPENAI_KEY=sk-... (실제 OpenAI API 키)
echo    - AI_FEEDBACK_ENABLED=true
echo    - AI_MIN_SCORE=100
echo    - VITE_AI_FEEDBACK_ENABLED=true
echo 6. 배포 시작
echo.
pause

