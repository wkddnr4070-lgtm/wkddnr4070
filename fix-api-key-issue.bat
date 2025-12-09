@echo off
REM API 키 제거 및 커밋 히스토리 수정 스크립트
chcp 65001 >nul
setlocal enabledelayedexpansion

cd /d "%~dp0"

echo ========================================
echo   API 키 보안 문제 해결
echo ========================================
echo.

echo [1/5] 현재 vercel.json 확인...
type vercel.json | findstr /i "OPENAI openai sk-"
if errorlevel 1 (
    echo ✅ 현재 vercel.json에 API 키가 없습니다.
) else (
    echo ⚠️  vercel.json에 API 키가 발견되었습니다.
)
echo.

echo [2/5] Git 히스토리에서 API 키 검색...
git log --all --full-history --source -- vercel.json | findstr /i "OPENAI openai sk-"
if errorlevel 1 (
    echo ✅ Git 히스토리에서 직접 검색 불가 (정상)
) else (
    echo ⚠️  Git 히스토리에 API 키가 있을 수 있습니다.
)
echo.

echo [3/5] 이전 커밋 취소 및 새 커밋 생성...
echo.
echo 현재 커밋을 취소하고 API 키를 제거한 후 다시 커밋합니다.
echo.
pause

REM 현재 HEAD를 한 커밋 전으로 되돌림 (커밋만 취소, 파일 변경사항은 유지)
git reset --soft HEAD~1
if errorlevel 1 (
    echo ⚠️  커밋 취소 실패. 계속 진행합니다...
)
echo.

echo [4/5] vercel.json에서 API 키 제거 확인...
REM vercel.json 파일을 다시 확인하고 필요시 수정
echo 현재 vercel.json 내용:
type vercel.json
echo.
echo API 키가 있다면 수동으로 제거해주세요.
pause
echo.

echo [5/5] 새 커밋 생성...
git add vercel.json
git commit -m "보안: API 키 제거 및 환경 변수로 이동"
echo.
echo ✅ 완료!
echo.
echo 다음 단계:
echo 1. vercel.json에 API 키가 없다는 것을 확인
echo 2. GitHub에 푸시 시도
echo 3. 여전히 오류가 발생하면 Git 히스토리 수정 필요
echo.
pause

