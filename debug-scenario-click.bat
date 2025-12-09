@echo off
chcp 65001 >nul

echo ===========================================
echo   시나리오 클릭 문제 진단 도구
echo ===========================================
echo.

echo 조직관리 404 오류는 해결되었습니다.
echo 이제 시나리오 클릭 문제를 진단합니다.
echo.

echo 🔍 브라우저에서 다음을 확인해주세요:
echo.
echo 1. 브라우저 콘솔 오류 확인 (F12)
echo    - F12 키를 누르고 Console 탭으로 이동
echo    - 빨간색 오류 메시지가 있는지 확인
echo    - 특히 React Router, Link 관련 오류 확인
echo.

echo 2. 네트워크 탭 확인 (F12)
echo    - Network 탭에서 실패한 요청이 있는지 확인
echo    - API 호출 실패나 404 오류 확인
echo.

echo 3. 시나리오 버튼 상태 확인
echo    - "비상훈련 시작" 버튼이 보이는지 확인
echo    - 버튼에 마우스 올릴 때 색상이 변하는지 확인
echo    - 버튼 클릭 시 아무 반응이 없는지 확인
echo.

echo 4. URL 변화 확인
echo    - 버튼 클릭 시 주소창 URL이 변하는지 확인
echo    - /training/advanced/숫자 형태로 변하는지 확인
echo.

set /p open_site="사이트를 열어 확인하시겠습니까? (Y/N): "
if /i "%open_site%"=="Y" (
    start https://she-safety-hub-2026.vercel.app
    echo.
    echo 사이트가 열렸습니다. 위의 4가지를 확인 후
    echo 발견한 오류 메시지나 현상을 알려주세요.
)
echo.

set /p open_console="브라우저 개발자 도구 사용법을 보시겠습니까? (Y/N): "
if /i "%open_console%"=="Y" (
    echo.
    echo 📖 개발자 도구 사용법:
    echo.
    echo 1. 사이트에서 F12 키 누르기
    echo 2. Console 탭 클릭
    echo 3. 빨간색 오류 메시지 확인
    echo 4. Network 탭으로 전환
    echo 5. 시나리오 버튼 클릭해보기
    echo 6. 실패한 요청이나 404 오류 확인
    echo.
)

pause
