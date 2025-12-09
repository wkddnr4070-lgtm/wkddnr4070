@echo off
REM 배포된 사이트 테스트 가이드
chcp 65001 >nul

echo ========================================
echo   배포된 사이트 테스트
echo ========================================
echo.
echo ✅ 환경 변수 설정 완료!
echo.
echo 배포된 사이트 URL:
echo https://she-safety-hub-2026.vercel.app
echo.
echo ========================================
echo   테스트 단계
echo ========================================
echo.
echo [1/5] 사이트 접속
echo ----------------------------------------
echo 브라우저에서 다음 URL로 접속하세요:
echo https://she-safety-hub-2026.vercel.app
echo.
set /p open="지금 브라우저에서 사이트를 열까요? (Y/N): "
if /i "%open%"=="Y" (
    start https://she-safety-hub-2026.vercel.app
    echo.
    echo 브라우저가 열렸습니다.
    echo.
    echo 잠시 후 다음 단계로 진행하세요.
    timeout /t 3 /nobreak >nul
)
echo.

echo [2/5] 홈페이지 로딩 확인
echo ----------------------------------------
echo 사이트가 정상적으로 로드되는지 확인하세요:
echo.
echo ✅ 정상: 화면이 나타나고 로딩이 완료됨
echo ❌ 문제: 빈 화면 또는 오류 메시지
echo.
set /p home_ok="홈페이지가 정상적으로 로드되나요? (Y/N): "

if /i "%home_ok%"=="N" (
    echo.
    echo ⚠️  문제 발생!
    echo.
    echo 해결 방법:
    echo 1. 브라우저 콘솔 확인 (F12 → Console 탭)
    echo 2. 오류 메시지 확인
    echo 3. Vercel 배포 로그 확인
    echo.
    pause
    exit /b 1
)
echo.

echo [3/5] 로그인 화면 확인
echo ----------------------------------------
echo 로그인 화면이 나타나는지 확인하세요:
echo.
echo 확인 사항:
echo - 회사 선택 드롭다운이 보이나요?
echo - 조직 선택 트리가 보이나요?
echo - 이름/전화번호 입력 필드가 보이나요?
echo.
set /p login_ok="로그인 화면이 정상적으로 보이나요? (Y/N): "

if /i "%login_ok%"=="N" (
    echo.
    echo ⚠️  로그인 화면에 문제가 있습니다.
    echo 브라우저 콘솔 (F12)에서 오류를 확인하세요.
    echo.
    pause
)
echo.

echo [4/5] 로그인 테스트
echo ----------------------------------------
echo 실제로 로그인을 시도해보세요:
echo.
echo 1. 회사 선택 (예: SK E^&S)
echo 2. 조직 선택 (대표이사 → 실 → 조직)
echo 3. 이름 입력
echo 4. 전화번호 입력
echo 5. 로그인 버튼 클릭
echo.
set /p login_test="로그인이 정상적으로 작동하나요? (Y/N): "

if /i "%login_test%"=="N" (
    echo.
    echo ⚠️  로그인에 문제가 있습니다.
    echo 브라우저 콘솔 (F12)에서 오류를 확인하세요.
    echo.
    pause
)
echo.

echo [5/5] 대시보드 및 훈련 기능 확인
echo ----------------------------------------
echo 로그인 후 다음을 확인하세요:
echo.
echo 1. 대시보드가 표시되나요?
echo 2. 훈련 시나리오 목록이 보이나요?
echo 3. "비상훈련 시작" 버튼이 작동하나요?
echo 4. 훈련을 시작할 수 있나요?
echo.
set /p dashboard_ok="대시보드와 훈련 기능이 정상적으로 작동하나요? (Y/N): "

if /i "%dashboard_ok%"=="N" (
    echo.
    echo ⚠️  기능에 문제가 있습니다.
    echo 브라우저 콘솔 (F12)에서 오류를 확인하세요.
    echo.
    pause
)
echo.

echo ========================================
echo   테스트 결과 요약
echo ========================================
echo.
if /i "%home_ok%"=="Y" (
    echo ✅ 홈페이지 로딩: 정상
) else (
    echo ❌ 홈페이지 로딩: 문제 있음
)

if /i "%login_ok%"=="Y" (
    echo ✅ 로그인 화면: 정상
) else (
    echo ❌ 로그인 화면: 문제 있음
)

if /i "%login_test%"=="Y" (
    echo ✅ 로그인 기능: 정상
) else (
    echo ❌ 로그인 기능: 문제 있음
)

if /i "%dashboard_ok%"=="Y" (
    echo ✅ 대시보드/훈련: 정상
) else (
    echo ❌ 대시보드/훈련: 문제 있음
)
echo.

echo ========================================
echo   다음 단계
echo ========================================
echo.
echo 모든 테스트가 통과했다면:
echo ✅ 배포 완료! 사이트가 정상적으로 작동합니다.
echo.
echo 추가 작업:
echo 1. 훈련 완료 후 AI 피드백 생성 테스트
echo 2. 다양한 시나리오 테스트
echo 3. 모바일 반응형 확인
echo.
echo 문제가 있다면:
echo 1. 브라우저 콘솔 확인 (F12 → Console)
echo 2. Vercel 배포 로그 확인
echo 3. 환경 변수 재확인
echo.
pause

