@echo off
chcp 65001 >nul
echo 🚀 Vercel 배포 준비 시작...
echo.

echo 📦 1단계: 로컬 빌드 테스트...
call npm run build
if errorlevel 1 (
    echo ❌ 빌드 실패! 오류를 확인하세요.
    pause
    exit /b 1
)
echo ✅ 빌드 성공!
echo.

echo 📋 2단계: Git 상태 확인...
git status --porcelain >nul 2>&1
if errorlevel 1 (
    echo ✅ Git 저장소 확인 완료
) else (
    echo ⚠️  커밋되지 않은 변경사항이 있을 수 있습니다.
    echo git status 명령어로 확인하세요.
)
echo.

echo 🔗 3단계: Git 원격 저장소 확인...
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo ⚠️  원격 저장소가 설정되지 않았습니다.
    echo 다음 명령어로 원격 저장소를 추가하세요:
    echo git remote add origin https://github.com/your-username/your-repo.git
    pause
    exit /b 1
) else (
    echo ✅ 원격 저장소 설정 확인 완료
)
echo.

echo 🔧 4단계: Vercel CLI 확인...
where vercel >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Vercel CLI가 설치되지 않았습니다.
    echo 설치 중...
    call npm install -g vercel
    if errorlevel 1 (
        echo ❌ Vercel CLI 설치 실패!
        pause
        exit /b 1
    )
)
echo ✅ Vercel CLI 준비 완료!
echo.

echo 📝 배포 방법:
echo.
echo 방법 1: Vercel 대시보드 사용 (권장)
echo   1. https://vercel.com/dashboard 접속
echo   2. 'Add New Project' 클릭
echo   3. GitHub 저장소 선택
echo   4. 환경 변수 설정 (VERCEL_DEPLOYMENT.md 참고)
echo   5. 'Deploy' 버튼 클릭
echo.
echo 방법 2: Vercel CLI 사용
echo   vercel --prod
echo.

echo ✅ 배포 준비 완료!
pause


