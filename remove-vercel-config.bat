@echo off
REM vercel.json 제거 및 자동 감지 시도
chcp 65001 >nul
setlocal enabledelayedexpansion

cd /d "%~dp0"

echo ========================================
echo   vercel.json 제거 및 자동 감지 시도
echo ========================================
echo.
echo 현재 접근: vercel.json을 완전히 제거하고
echo Vercel의 자동 감지 기능 사용
echo.

echo [1/4] 현재 vercel.json 백업...
if exist vercel.json (
    copy vercel.json vercel.json.backup
    echo ✅ vercel.json을 vercel.json.backup으로 백업했습니다.
) else (
    echo ❌ vercel.json 파일이 없습니다.
)
echo.

echo [2/4] vercel.json 제거...
if exist vercel.json (
    del vercel.json
    echo ✅ vercel.json 파일을 삭제했습니다.
) else (
    echo vercel.json 파일이 이미 없습니다.
)
echo.

echo [3/4] package.json 확인...
if exist package.json (
    echo package.json 내용 (scripts 부분):
    findstr -i "scripts" -A 10 package.json
    echo.
) else (
    echo ❌ package.json 파일이 없습니다.
)
pause

echo [4/4] Git 커밋 및 푸시...
git add .
git commit -m "remove: vercel.json 제거 - Vercel 자동 감지 사용"
if errorlevel 1 (
    echo ⚠️  커밋 실패 또는 변경사항 없음
) else (
    echo ✅ 커밋 완료
)
echo.

echo 현재 브랜치에서 푸시...
for /f "tokens=*" %%b in ('git branch --show-current 2^>nul') do set current_branch=%%b
if "!current_branch!"=="" set current_branch=production
echo 푸시할 브랜치: !current_branch!

git push origin !current_branch!
if errorlevel 1 (
    echo ⚠️  푸시 실패. upstream 설정을 시도합니다...
    git push -u origin !current_branch!
    if errorlevel 1 (
        echo ❌ 푸시 실패
        pause
        exit /b 1
    )
)
echo ✅ 푸시 완료
echo.

echo ========================================
echo   Vercel 자동 감지 배포
echo ========================================
echo.
echo vercel.json이 제거되었으므로:
echo - Vercel이 프로젝트를 자동으로 감지합니다
echo - Vite 프로젝트로 인식되어야 합니다
echo - api/ai-feedback.js는 자동으로 Node.js Function으로 처리됩니다
echo.
echo 예상 결과:
echo - Function Runtime 오류가 사라져야 합니다
echo - Build가 성공해야 합니다
echo.
echo 1-3분 후 배포 상태를 확인하세요:
echo https://vercel.com/jangwookkims-projects/she-safety-hub-2026/deployments
echo.
set /p open="Vercel 배포 페이지를 브라우저에서 열까요? (Y/N): "
if /i "%open%"=="Y" (
    start https://vercel.com/jangwookkims-projects/she-safety-hub-2026/deployments
    echo 브라우저가 열렸습니다.
)
echo.
echo 참고: 만약 여전히 문제가 발생한다면
echo vercel.json.backup 파일을 사용해 복원할 수 있습니다.
echo.
pause
