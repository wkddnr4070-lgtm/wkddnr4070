@echo off
REM 404 오류 해결 가이드
chcp 65001 >nul

echo ========================================
echo   404 오류 해결 가이드
echo ========================================
echo.
echo 오류 메시지: DEPLOYMENT_NOT_FOUND
echo.
echo 이 오류는 배포를 찾을 수 없다는 의미입니다.
echo.
echo ========================================
echo   원인 확인 및 해결
echo ========================================
echo.
echo [1/4] Vercel 배포 상태 확인
echo ----------------------------------------
echo 1. Vercel 대시보드로 이동:
echo    https://vercel.com/jangwookkims-projects/she-safety-hub-2026
echo.
echo 2. "Deployments" 탭 클릭
echo.
echo 3. 최신 배포 상태 확인:
echo    ✅ 성공 (초록색) = 배포 완료, URL 확인 필요
echo    ⚠️  실패 (빨간색) = 빌드 실패, 로그 확인 필요
echo    ⏳ 진행 중 (노란색) = 배포 중, 잠시 대기
echo.
pause

echo.
echo [2/4] 배포가 실패한 경우
echo ----------------------------------------
echo 배포가 실패했다면:
echo.
echo 1. 실패한 배포 클릭
echo 2. "Build Logs" 또는 "빌드 로그" 확인
echo 3. 오류 메시지 확인
echo.
echo 일반적인 오류:
echo - 빌드 실패: package.json 문제 또는 의존성 오류
echo - 환경 변수 오류: 필수 변수 누락
echo - 빌드 타임아웃: 빌드 시간 초과
echo.
pause

echo.
echo [3/4] 올바른 URL 확인
echo ----------------------------------------
echo Vercel 대시보드에서:
echo.
echo 1. 프로젝트 상세 페이지로 이동
echo 2. "Deployments" 탭 클릭
echo 3. 성공한 배포 찾기
echo 4. 배포 카드에서 URL 확인:
echo    예: https://she-safety-hub-2026-xxxxx.vercel.app
echo    또는: https://she-safety-hub-2026.vercel.app
echo.
echo 5. 올바른 URL로 접속 시도
echo.
pause

echo.
echo [4/4] 수동 재배포
echo ----------------------------------------
echo 배포가 실패했거나 없다면:
echo.
echo 1. Vercel 대시보드 → 프로젝트 상세 페이지
echo 2. "Deployments" 탭 클릭
echo 3. "Redeploy" 또는 "재배포" 버튼 클릭
echo 4. 또는 "Deploy" 버튼 클릭
echo 5. 배포 완료까지 대기 (1-3분)
echo 6. 새 URL로 접속 시도
echo.
pause

echo.
echo ========================================
echo   빠른 해결 방법
echo ========================================
echo.
echo 방법 1: Vercel 대시보드에서 재배포
echo ----------------------------------------
echo 1. https://vercel.com/jangwookkims-projects/she-safety-hub-2026
echo 2. Deployments 탭 → 최신 배포 확인
echo 3. 실패했다면 "Redeploy" 클릭
echo 4. 성공했다면 올바른 URL 확인
echo.
echo 방법 2: GitHub에서 재배포 트리거
echo ----------------------------------------
echo GitHub에 작은 변경사항을 푸시하면 자동 재배포됩니다:
echo.
echo   git commit --allow-empty -m "재배포 트리거"
echo   git push origin production-clean
echo.
echo 방법 3: 프로젝트 설정 확인
echo ----------------------------------------
echo Settings → Build and Deployment 확인:
echo - Build Command: npm run build
echo - Output Directory: dist
echo - Install Command: npm install
echo.
pause

echo.
echo ========================================
echo   다음 단계
echo ========================================
echo.
echo 1. Vercel 대시보드에서 배포 상태 확인
echo 2. 실패했다면 빌드 로그 확인
echo 3. 성공했다면 올바른 URL 확인
echo 4. 재배포 필요 시 "Redeploy" 클릭
echo.
set /p open="Vercel 대시보드를 브라우저에서 열까요? (Y/N): "
if /i "%open%"=="Y" (
    start https://vercel.com/jangwookkims-projects/she-safety-hub-2026/deployments
    echo.
    echo 브라우저가 열렸습니다.
    echo 배포 상태를 확인하세요.
)
echo.
pause

