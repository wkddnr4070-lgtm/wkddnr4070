@echo off
cd /d "%~dp0"

echo ===========================================
echo   간단한 배포 수정
echo ===========================================
echo.

echo 1. vercel.json 파일 상태 확인...
if exist vercel.json (
    echo vercel.json 파일이 존재합니다.
    del vercel.json
    echo vercel.json 파일을 삭제했습니다.
) else (
    echo vercel.json 파일이 없습니다. (정상)
)
echo.

echo 2. Git 상태 확인...
git status
echo.

echo 3. 변경사항 커밋...
git add .
git commit -m "vercel.json 제거 - 자동 감지 사용"
echo.

echo 4. GitHub에 푸시...
git push origin production
echo.

echo ===========================================
echo 완료! 
echo 1-3분 후 Vercel 배포 상태를 확인하세요:
echo https://vercel.com/jangwookkims-projects/she-safety-hub-2026/deployments
echo ===========================================
echo.
echo 아무 키나 누르면 종료됩니다...
pause >nul
