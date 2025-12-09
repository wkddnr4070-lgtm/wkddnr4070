@echo off
REM 새로운 Vercel 프로젝트 생성 가이드
chcp 65001 >nul

echo ========================================
echo   새로운 Vercel 프로젝트 생성 가이드
echo ========================================
echo.
echo 현재 프로젝트에서 계속 오류가 발생하므로
echo 새로운 Vercel 프로젝트를 생성하는 방법을 안내합니다.
echo.

echo ========================================
echo   단계별 안내
echo ========================================
echo.

echo [1단계] Vercel 대시보드 접속
echo ----------------------------------------
echo 1. 브라우저에서 다음 주소로 이동:
echo    https://vercel.com/dashboard
echo.
echo 2. GitHub 계정으로 로그인
echo.
pause

echo [2단계] 새 프로젝트 생성
echo ----------------------------------------
echo 1. "Add New Project" 버튼 클릭
echo.
echo 2. GitHub 저장소 검색:
echo    - Repository: wkddnr4070-lgtm/wkddnr4070
echo    - Branch: production-clean 또는 production
echo.
echo 3. "Import" 버튼 클릭
echo.
pause

echo [3단계] 프로젝트 설정 (중요!)
echo ----------------------------------------
echo Framework Preset: Vite (자동 감지)
echo Root Directory: ./
echo Build Command: npm run build
echo Output Directory: dist
echo.
echo ⚠️ vercel.json 설정은 건드리지 마세요!
echo   (자동 감지 사용)
echo.
pause

echo [4단계] 환경 변수 설정
echo ----------------------------------------
echo 다음 환경 변수들을 설정하세요:
echo.
echo OPENAI_KEY=sk-... (실제 OpenAI API 키)
echo AI_FEEDBACK_ENABLED=true
echo AI_MIN_SCORE=100
echo VITE_AI_FEEDBACK_ENABLED=true
echo.
echo 각 변수를 Production, Preview, Development 모두에 설정
echo.
pause

echo [5단계] 배포 실행
echo ----------------------------------------
echo 1. "Deploy" 버튼 클릭
echo 2. 배포 진행 상황 모니터링
echo 3. Build Logs에서 오류 확인
echo.
echo 예상 결과:
echo - Function Runtime 오류가 발생하지 않아야 함
echo - api/ai-feedback.js가 자동으로 Node.js Function으로 처리됨
echo - Build 성공
echo.
pause

echo [6단계] 기존 프로젝트 정리 (선택사항)
echo ----------------------------------------
echo 새 프로젝트가 정상 작동하면:
echo.
echo 1. 기존 프로젝트 삭제:
echo    https://vercel.com/jangwookkims-projects/she-safety-hub-2026/settings/advanced
echo.
echo 2. 또는 기존 프로젝트를 backup용으로 유지
echo.
pause

echo ========================================
echo   빠른 링크
echo ========================================
echo.
echo Vercel 대시보드: https://vercel.com/dashboard
echo 새 프로젝트 생성: https://vercel.com/new
echo GitHub 저장소: https://github.com/wkddnr4070-lgtm/wkddnr4070
echo.
set /p open="Vercel 대시보드를 브라우저에서 열까요? (Y/N): "
if /i "%open%"=="Y" (
    start https://vercel.com/new
    echo.
    echo 새 프로젝트 생성 페이지가 열렸습니다.
    echo 위 단계를 따라 진행하세요.
)
echo.
echo ========================================
echo   참고 사항
echo ========================================
echo.
echo - vercel.json 없이도 Vercel은 Vite 프로젝트를 자동 감지합니다
echo - api/ 폴더의 파일들은 자동으로 Function으로 처리됩니다
echo - 환경 변수만 올바르게 설정하면 정상 작동합니다
echo.
pause
