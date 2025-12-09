@echo off
REM Vercel 환경 변수 설정 초보자 가이드
chcp 65001 >nul

echo ========================================
echo   Vercel 환경 변수 설정 가이드
echo ========================================
echo.
echo 현재 Vercel의 Environment Variables 페이지에 있습니다.
echo.
echo ========================================
echo   단계별 안내
echo ========================================
echo.
echo [1단계] 기존 변수 확인
echo ----------------------------------------
echo 화면 아래쪽의 "Existing Environment Variables List"에서
echo 다음 변수들이 있는지 확인하세요:
echo.
echo   1. OPENAI_KEY
echo   2. AI_FEEDBACK_ENABLED
echo   3. AI_MIN_SCORE
echo   4. VITE_AI_FEEDBACK_ENABLED (이것이 중요!)
echo.
pause

echo.
echo [2단계] VITE_AI_FEEDBACK_ENABLED 확인
echo ----------------------------------------
echo 화면 아래쪽 목록에서 "VITE_AI_FEEDBACK_ENABLED"를 찾으세요.
echo.
set /p has_var="VITE_AI_FEEDBACK_ENABLED가 목록에 있나요? (Y/N): "

if /i "%has_var%"=="N" (
    echo.
    echo [3단계] 새 변수 추가하기
    echo ----------------------------------------
    echo 화면 위쪽의 "Add New Variable Input Fields"를 사용하세요:
    echo.
    echo Step 1: Key 필드에 입력
    echo   VITE_AI_FEEDBACK_ENABLED
    echo.
    echo Step 2: Value 필드에 입력
    echo   true
    echo.
    echo Step 3: Environments 확인
    echo   "All Environments"로 설정되어 있는지 확인
    echo.
    echo Step 4: 저장
    echo   오른쪽의 검은색 "Save" 버튼 클릭
    echo.
    pause
) else (
    echo.
    echo ✅ 좋습니다! 변수가 이미 있네요.
    echo.
    echo [3단계] 값 확인하기
    echo ----------------------------------------
    echo VITE_AI_FEEDBACK_ENABLED 변수의 값이 "true"인지 확인하세요:
    echo.
    echo 1. 변수 오른쪽의 눈 아이콘 👁️ 클릭
    echo 2. 값이 "true"인지 확인
    echo 3. "true"가 아니면 수정 필요:
    echo    - 변수 오른쪽 끝의 점 3개 (⋯) 클릭
    echo    - Edit 선택
    echo    - Value를 "true"로 변경
    echo    - Save 클릭
    echo.
    pause
)

echo.
echo [4단계] OPENAI_KEY 확인 (중요!)
echo ----------------------------------------
echo OPENAI_KEY가 실제 OpenAI API 키인지 확인하세요:
echo.
echo 1. OPENAI_KEY 변수 찾기
echo 2. 오른쪽의 눈 아이콘 👁️ 클릭하여 값 확인
echo 3. 값이 "sk-"로 시작하는 긴 문자열인지 확인
echo 4. 만약 잘못된 값이면:
echo    - 점 3개 (⋯) 클릭 → Edit 선택
echo    - 올바른 API 키 입력
echo    - Save 클릭
echo.
pause

echo.
echo [5단계] 최종 확인
echo ----------------------------------------
echo 다음 변수들이 모두 설정되어 있는지 확인:
echo.
echo   ✅ OPENAI_KEY = sk-... (실제 API 키)
echo   ✅ AI_FEEDBACK_ENABLED = true
echo   ✅ AI_MIN_SCORE = 100
echo   ✅ VITE_AI_FEEDBACK_ENABLED = true
echo.
echo 모든 변수가 올바르게 설정되었나요?
set /p all_set="모두 설정되었나요? (Y/N): "

if /i "%all_set%"=="Y" (
    echo.
    echo ✅ 완료! 환경 변수 설정이 끝났습니다.
    echo.
    echo [다음 단계] 배포된 사이트 테스트
    echo ----------------------------------------
    echo 1. 브라우저에서 다음 URL로 접속:
    echo    https://she-safety-hub-2026.vercel.app
    echo.
    echo 2. 다음 기능 테스트:
    echo    - 홈페이지 로딩 확인
    echo    - 로그인 화면 표시 확인
    echo    - 대시보드 접근 확인
    echo    - 훈련 시작 기능 확인
    echo.
    set /p open="배포된 사이트를 브라우저에서 열까요? (Y/N): "
    if /i "%open%"=="Y" (
        start https://she-safety-hub-2026.vercel.app
        echo.
        echo 브라우저가 열렸습니다.
    )
) else (
    echo.
    echo ⚠️  누락된 변수가 있습니다.
    echo 위 단계를 다시 확인하세요.
    echo.
    echo 상세 가이드: VERCEL_ENV_SETUP_GUIDE.md
)
echo.
pause

