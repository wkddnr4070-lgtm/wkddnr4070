@echo off
REM Git 히스토리에서 API 키 제거 스크립트
chcp 65001 >nul
setlocal enabledelayedexpansion

cd /d "%~dp0"

echo ========================================
echo   Git 히스토리에서 API 키 제거
echo ========================================
echo.
echo ⚠️  주의: 이 스크립트는 Git 히스토리를 수정합니다.
echo.
echo 현재 상황:
echo - GitHub가 이전 커밋에서 API 키를 감지했습니다
echo - 현재 vercel.json에는 API 키가 없습니다
echo - 하지만 Git 히스토리에는 남아있습니다
echo.
echo 해결 방법:
echo 1. 최근 커밋을 취소하고 새로 커밋
echo 2. 또는 Git 히스토리에서 API 키 제거
echo.
pause

echo.
echo [1/4] 현재 커밋 확인...
git log --oneline -3
echo.

echo [2/4] 최근 커밋 취소 (파일 변경사항은 유지)...
git reset --soft HEAD~1
if errorlevel 1 (
    echo ⚠️  커밋 취소 실패. 계속 진행합니다...
) else (
    echo ✅ 커밋 취소 완료
)
echo.

echo [3/4] vercel.json 확인...
type vercel.json
echo.
echo API 키가 포함되어 있지 않은지 확인하세요.
pause
echo.

echo [4/4] 새 커밋 생성 (API 키 없이)...
git add vercel.json
git commit -m "보안: API 키 제거 - 환경 변수로 이동"
echo.
echo ✅ 새 커밋 생성 완료
echo.
echo 다음 단계:
echo 1. GitHub에 푸시 시도
echo 2. 여전히 오류가 발생하면 다른 방법 시도
echo.
pause

