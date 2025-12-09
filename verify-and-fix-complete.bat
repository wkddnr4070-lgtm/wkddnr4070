@echo off
REM 완전한 진단 및 수정
chcp 65001 >nul
setlocal enabledelayedexpansion

cd /d "%~dp0"

echo ========================================
echo   완전한 진단 및 수정
echo ========================================
echo.

echo [1/6] Git 상태 확인...
git status
echo.
echo 현재 브랜치:
git branch --show-current
echo.

echo [2/6] 현재 vercel.json 내용 확인...
if exist vercel.json (
    echo vercel.json 파일 존재함
    echo 파일 크기: 
    for %%f in (vercel.json) do echo %%~zf bytes
    echo.
    echo 내용:
    echo ========================================
    type vercel.json
    echo ========================================
    echo.
) else (
    echo ❌ vercel.json 파일이 없습니다!
)
pause

echo [3/6] api/ai-feedback.js 파일 확인...
if exist api\ai-feedback.js (
    echo ✅ api/ai-feedback.js 파일 존재함
    echo 파일 크기:
    for %%f in (api\ai-feedback.js) do echo %%~zf bytes
    echo.
    echo 파일 첫 10줄:
    echo ========================================
    for /f "tokens=*" %%i in ('type api\ai-feedback.js ^| findstr /n "^" ^| head -n 10') do echo %%i
    echo ========================================
) else (
    echo ❌ api/ai-feedback.js 파일이 없습니다!
    echo 이것이 문제의 원인일 수 있습니다.
)
echo.
pause

echo [4/6] 올바른 vercel.json 재생성...
echo 기존 파일 백업...
if exist vercel.json (
    copy vercel.json vercel.json.backup
    echo ✅ 백업 완료: vercel.json.backup
)
echo.

echo 새로운 vercel.json 생성...
echo {> vercel.json
echo   "functions": {>> vercel.json
echo     "api/ai-feedback.js": {>> vercel.json
echo       "runtime": "nodejs18.x",>> vercel.json
echo       "maxDuration": 30>> vercel.json
echo     }>> vercel.json
echo   }>> vercel.json
echo }>> vercel.json

echo ✅ 최소 구성으로 vercel.json 재생성 완료
echo.
echo 생성된 내용:
echo ========================================
type vercel.json
echo ========================================
echo.
pause

echo [5/6] JSON 유효성 검사...
echo vercel.json이 유효한 JSON인지 확인 중...
powershell -Command "try { Get-Content 'vercel.json' | ConvertFrom-Json; Write-Host '✅ JSON 형식 유효' } catch { Write-Host '❌ JSON 형식 오류: ' $_.Exception.Message }"
echo.
pause

echo [6/6] Git 커밋 및 푸시...
git add vercel.json
if exist api\ai-feedback.js (
    git add api\ai-feedback.js
    echo ✅ api/ai-feedback.js도 함께 커밋
)

git commit -m "fix: vercel.json을 최소 구성으로 재생성 - runtime 오류 해결"
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
echo   배포 모니터링
echo ========================================
echo.
echo Vercel이 새로운 배포를 시작합니다...
echo.
echo 배포 상태 확인:
echo https://vercel.com/jangwookkims-projects/she-safety-hub-2026/deployments
echo.
echo 예상 결과:
echo - 더 이상 Function Runtime 오류가 발생하지 않아야 함
echo - Build가 성공해야 함
echo - 사이트 접속이 가능해야 함
echo.
set /p open="Vercel 배포 페이지를 브라우저에서 열까요? (Y/N): "
if /i "%open%"=="Y" (
    start https://vercel.com/jangwookkims-projects/she-safety-hub-2026/deployments
    echo 브라우저가 열렸습니다.
)
echo.
echo 배포가 완료되면 다음 단계로 진행하세요:
echo 1. 사이트 접속 테스트: https://she-safety-hub-2026.vercel.app
echo 2. 로그인 기능 테스트
echo 3. 훈련 기능 테스트
echo.
pause
