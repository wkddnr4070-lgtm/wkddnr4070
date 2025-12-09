@echo off
REM 변경사항 커밋 및 푸시 자동화 스크립트
chcp 65001 >nul
setlocal enabledelayedexpansion

REM 프로젝트 디렉토리로 이동
cd /d "%~dp0"

echo ========================================
echo   변경사항 커밋 및 푸시
echo ========================================
echo 현재 브랜치: 
git branch --show-current
echo.

echo [1/4] 변경사항 추가 중...
git add .
if errorlevel 1 (
    echo ❌ git add 실패
    pause
    exit /b 1
)
echo ✅ 변경사항 추가 완료
echo.

echo [2/4] 커밋 메시지 설정...
set commit_msg=11/27 이전 상태 복구 및 배포 준비 완료
echo 커밋 메시지: %commit_msg%
echo.
echo 다른 메시지를 사용하려면 Ctrl+C로 취소하고 수동으로 실행하세요.
timeout /t 3 /nobreak >nul
echo.

echo [3/4] 커밋 중...
git commit -m "%commit_msg%"
if errorlevel 1 (
    echo ⚠️  커밋 실패 또는 변경사항 없음
) else (
    echo ✅ 커밋 완료
)
echo.

echo [4/4] 원격 저장소 확인...
git remote -v
if errorlevel 1 (
    echo.
    echo ❌ 원격 저장소가 설정되지 않았습니다.
    echo.
    set /p repo="GitHub 저장소 URL을 입력하세요 (예: https://github.com/username/repo.git): "
    if not "!repo!"=="" (
        git remote add origin "!repo!"
        echo ✅ 원격 저장소 추가 완료
    ) else (
        echo ❌ URL이 입력되지 않았습니다.
        pause
        exit /b 1
    )
)
echo.

echo [5/5] GitHub에 푸시 중...
set current_branch=
for /f "tokens=2" %%b in ('git branch --show-current') do set current_branch=%%b
if "!current_branch!"=="" set current_branch=production

echo 현재 브랜치: !current_branch!
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
        echo 1. GitHub 인증이 필요합니다
        echo 2. 원격 저장소 URL이 잘못되었습니다
        echo 3. 네트워크 연결 문제
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
echo 4. 환경 변수 설정 (VITE_API_URL, OPENAI_API_KEY 등)
echo 5. 배포 시작
echo.
pause

