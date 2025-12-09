@echo off

echo =========================================== 
echo   Vercel 배포 상태 확인
echo ===========================================
echo.

echo vercel.json이 제거되었습니다.
echo GitHub에 푸시가 완료되었습니다.
echo.
echo 이제 Vercel에서 자동으로 재배포를 시작했습니다.
echo.
echo 배포 상태를 확인하세요:
echo https://vercel.com/jangwookkims-projects/she-safety-hub-2026/deployments
echo.
echo 예상 결과:
echo - Function Runtime 오류가 사라져야 함
echo - Build가 성공해야 함 
echo - 사이트 접속이 가능해야 함
echo.
set /p open="Vercel 배포 페이지를 브라우저에서 열까요? (Y/N): "
if /i "%open%"=="Y" (
    start https://vercel.com/jangwookkims-projects/she-safety-hub-2026/deployments
    echo 브라우저가 열렸습니다.
)
echo.
echo 배포가 완료되면 사이트에 접속해보세요:
echo https://she-safety-hub-2026.vercel.app
echo.
pause

