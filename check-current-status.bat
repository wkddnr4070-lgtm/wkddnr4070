@echo off
chcp 65001 >nul

echo ===========================================
echo   현재 상태 전체 점검
echo ===========================================
echo.

echo 🔍 1. Vercel 배포 상태 확인
set /p check_vercel="Vercel 배포 페이지를 열까요? (Y/N): "
if /i "%check_vercel%"=="Y" (
    start https://vercel.com/jangwookkims-projects/she-safety-hub-2026/deployments
    echo 배포 페이지가 열렸습니다.
    echo.
    echo 확인사항:
    echo - 최신 배포가 초록색 "Ready" 상태인가요?
    echo - 빌드 시간이 최근인가요?
    echo - 에러가 있다면 어떤 에러인가요?
    echo.
)

echo 🌐 2. 사이트 접속 테스트
set /p check_site="사이트를 열까요? (Y/N): "
if /i "%check_site%"=="Y" (
    start https://she-safety-hub-2026.vercel.app
    echo 사이트가 열렸습니다.
    echo.
    echo 확인사항:
    echo - 로그인 화면이 정상적으로 보이나요?
    echo - 회사 선택이 작동하나요?
    echo - 조직 선택이 작동하나요?
    echo - 로그인 후 대시보드가 보이나요?
    echo - 시나리오 목록이 보이나요?
    echo - "비상훈련 시작" 버튼이 클릭되나요?
    echo.
)

echo 🔧 3. 브라우저 콘솔 확인
echo F12를 누르고 Console 탭에서 확인하세요:
echo - 빨간색 오류 메시지가 있나요?
echo - 어떤 오류 메시지가 나타나나요?
echo.

echo 📋 현재까지 해결한 문제들:
echo ✅ vercel.json runtime 오류 해결
echo ✅ 빌드 문제 해결 (불필요한 컴포넌트 제거)
echo ✅ 조직관리 404 오류 해결
echo ✅ 무한 API 호출 문제 해결
echo ✅ 백엔드 API 의존성 제거
echo.

echo 🎯 예상 결과:
echo - 깨끗한 콘솔 (오류 없음)
echo - 시나리오 클릭 시 훈련 페이지로 이동
echo - 모든 기능 정상 작동
echo.

pause
echo.
echo 위의 확인 결과를 알려주세요:
echo 1. Vercel 배포 상태는 어떤가요?
echo 2. 사이트 접속은 되나요?
echo 3. 어떤 문제가 여전히 발생하고 있나요?
echo 4. 브라우저 콘솔에 오류가 있나요?
