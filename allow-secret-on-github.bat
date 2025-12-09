@echo off
REM GitHub에서 API 키 일시 허용 안내 스크립트
chcp 65001 >nul

echo ========================================
echo   GitHub Push Protection 해제
echo ========================================
echo.
echo GitHub가 이전 커밋의 API 키를 감지하여 푸시를 차단했습니다.
echo.
echo 해결 방법:
echo.
echo 방법 1: GitHub에서 일시 허용 (빠른 해결) ⭐ 권장
echo ----------------------------------------
echo 1. 아래 링크를 브라우저에서 열기:
echo.
echo    https://github.com/wkddnr4070-lgtm/wkddnr4070/security/secret-scanning/unblock-secret/36byhSdoiOAHaHeg6vsteUK7MQg
echo.
echo 2. GitHub 로그인 (필요시)
echo 3. "Allow secret" 또는 "일시 허용" 버튼 클릭
echo 4. 확인 후 이 스크립트를 다시 실행하거나 push-now.bat 실행
echo.
echo 방법 2: Git 히스토리 완전 수정 (영구 해결)
echo ----------------------------------------
echo 이전 커밋에서 API 키를 완전히 제거하려면:
echo 1. Git 히스토리 수정 (복잡함)
echo 2. Force push 필요 (주의 필요)
echo.
echo ========================================
echo.
echo 지금 GitHub 링크를 열어서 허용하시겠습니까?
echo.
set /p open="브라우저에서 링크 열기? (Y/N): "
if /i "%open%"=="Y" (
    start https://github.com/wkddnr4070-lgtm/wkddnr4070/security/secret-scanning/unblock-secret/36byhSdoiOAHaHeg6vsteUK7MQg
    echo.
    echo 브라우저가 열렸습니다.
    echo "Allow secret" 버튼을 클릭한 후 Enter를 누르세요.
    pause
    echo.
    echo 이제 푸시를 다시 시도하세요:
    echo push-now.bat
) else (
    echo.
    echo 수동으로 링크를 열어주세요:
    echo https://github.com/wkddnr4070-lgtm/wkddnr4070/security/secret-scanning/unblock-secret/36byhSdoiOAHaHeg6vsteUK7MQg
)
echo.
pause

