@echo off
REM GitHub 푸시 실행 (네트워크 연결 확인 후)
chcp 65001 >nul
setlocal enabledelayedexpansion

cd /d "%~dp0"

echo ========================================
echo   GitHub 푸시 실행
echo ========================================
echo.

echo [1/3] 현재 상태 확인...
for /f "tokens=2" %%b in ('git branch --show-current 2^>nul') do set current_branch=%%b
if "!current_branch!"=="" set current_branch=production
echo 현재 브랜치: !current_branch!
echo.

echo [2/3] 최근 커밋 확인...
git log --oneline -3
echo.

echo [3/3] GitHub에 푸시 중...
git push origin !current_branch!
if errorlevel 1 (
    echo.
    echo ⚠️  푸시 실패. upstream 설정을 시도합니다...
    git push -u origin !current_branch!
    if errorlevel 1 (
        echo.
        echo ❌ 푸시 실패
        echo.
        echo 가능한 원인:
        echo 1. GitHub Push Protection이 여전히 활성화됨
        echo 2. 인증 문제 (Personal Access Token 필요)
        echo 3. 권한 문제
        echo.
        echo 해결 방법:
        echo 1. GitHub에서 제공한 링크로 API 키 일시 허용:
        echo    https://github.com/wkddnr4070-lgtm/wkddnr4070/security/secret-scanning/unblock-secret/36byhSdoiOAHaHeg6vsteUK7MQg
        echo.
        echo 2. 또는 Personal Access Token 사용:
        echo    - GitHub → Settings → Developer settings → Personal access tokens
        echo    - 새 토큰 생성 (repo 권한)
        echo    - Git Credential Manager에 저장
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
echo 4. 환경 변수 설정:
echo    - OPENAI_KEY=sk-... (실제 OpenAI API 키)
echo    - AI_FEEDBACK_ENABLED=true
echo    - AI_MIN_SCORE=100
echo    - VITE_AI_FEEDBACK_ENABLED=true
echo 5. 배포 시작
echo.
echo 자세한 내용은 VERCEL_DEPLOYMENT.md 참고
echo.
pause

