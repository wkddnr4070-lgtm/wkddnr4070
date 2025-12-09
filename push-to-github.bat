@echo off
REM GitHub 푸시 스크립트 (API 키 제거 후)
chcp 65001 >nul
setlocal enabledelayedexpansion

cd /d "%~dp0"

echo ========================================
echo   GitHub 푸시 실행
echo ========================================
echo.

echo [1/3] 현재 브랜치 확인...
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
        echo 2. GitHub에서 제공한 링크로 일시 허용 필요
        echo 3. 인증 문제
        echo.
        echo 해결 방법:
        echo - GitHub 오류 메시지의 링크를 사용하여 일시 허용
        echo - 또는 Git 히스토리를 완전히 수정
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
echo 3. GitHub 저장소 연결
echo 4. 환경 변수 설정:
echo    - OPENAI_KEY=sk-... (실제 OpenAI API 키)
echo    - AI_FEEDBACK_ENABLED=true
echo    - AI_MIN_SCORE=100
echo    - VITE_AI_FEEDBACK_ENABLED=true
echo 5. 배포 시작
echo.
pause

