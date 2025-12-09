@echo off
REM Git 명령어 실행 도우미 (CMD 사용)
chcp 65001 >nul
setlocal enabledelayedexpansion

REM 프로젝트 디렉토리로 이동
cd /d "%~dp0"

echo ========================================
echo   Git 명령어 실행 도우미
echo ========================================
echo 현재 디렉토리: %CD%
echo.

:menu
echo.
echo 선택하세요:
echo   1. Git 상태 확인 (git status)
echo   2. 변경사항 추가 (git add .)
echo   3. 커밋 (git commit)
echo   4. 원격 저장소 확인 (git remote -v)
echo   5. 원격 저장소 추가
echo   6. GitHub에 푸시 (git push)
echo   7. 모든 변경사항 커밋 및 푸시
echo   8. 종료
echo.
set /p choice="선택 (1-8): "

if "%choice%"=="1" goto status
if "%choice%"=="2" goto add
if "%choice%"=="3" goto commit
if "%choice%"=="4" goto remote
if "%choice%"=="5" goto add_remote
if "%choice%"=="6" goto push
if "%choice%"=="7" goto all
if "%choice%"=="8" goto end
goto menu

:status
echo.
echo [Git 상태 확인]
git status
goto menu

:add
echo.
echo [변경사항 추가]
git add .
echo ✅ 변경사항 추가 완료
goto menu

:commit
echo.
echo [커밋]
set /p msg="커밋 메시지를 입력하세요: "
if "%msg%"=="" set msg=배포 준비 완료
git commit -m "%msg%"
echo ✅ 커밋 완료
goto menu

:remote
echo.
echo [원격 저장소 확인]
git remote -v
if errorlevel 1 (
    echo ⚠️  원격 저장소가 설정되지 않았습니다.
)
goto menu

:add_remote
echo.
echo [원격 저장소 추가]
set /p repo="GitHub 저장소 URL을 입력하세요: "
if not "%repo%"=="" (
    git remote add origin "%repo%"
    echo ✅ 원격 저장소 추가 완료
) else (
    echo ❌ URL이 입력되지 않았습니다.
)
goto menu

:push
echo.
echo [GitHub에 푸시]
for /f "tokens=2" %%b in ('git branch --show-current 2^>nul') do set current_branch=%%b
if "%current_branch%"=="" set current_branch=production
set /p branch="브랜치 이름 (기본: %current_branch%): "
if "%branch%"=="" set branch=%current_branch%
git push origin %branch%
if errorlevel 1 (
    echo ⚠️  푸시 실패. 다음 명령어를 시도합니다:
    git push -u origin %branch%
)
goto menu

:all
echo.
echo [모든 변경사항 커밋 및 푸시]
echo.
for /f "tokens=2" %%b in ('git branch --show-current 2^>nul') do set current_branch=%%b
if "%current_branch%"=="" set current_branch=production
echo 현재 브랜치: %current_branch%
echo.
echo 1. 변경사항 추가 중...
git add .
echo.
echo 2. 커밋 중...
set /p msg="커밋 메시지 (기본: 11/27 이전 상태 복구 및 배포 준비 완료): "
if "%msg%"=="" set msg=11/27 이전 상태 복구 및 배포 준비 완료
git commit -m "%msg%"
echo.
echo 3. 푸시 중...
set /p branch="브랜치 이름 (기본: %current_branch%): "
if "%branch%"=="" set branch=%current_branch%
git push origin %branch%
if errorlevel 1 (
    echo ⚠️  푸시 실패. upstream 설정을 시도합니다...
    git push -u origin %branch%
)
echo.
echo ✅ 완료!
goto menu

:end
echo.
echo 종료합니다.
pause
exit /b 0


