@echo off
chcp 65001 >nul
echo ========================================
echo 🚨 파일 이름 오류 완전 해결 도구
echo ========================================
echo.

echo 문제: "파일 이름, 디렉터리 이름 또는 볼륨 레이블 구문이 잘못되었습니다."
echo 원인: 한글 경로 "SHE 디지털트윈" 사용
echo 해결: 영문 경로로 프로젝트 이동
echo.

echo ========================================
echo 1단계: 현재 상태 확인
echo ========================================
echo.
echo 현재 위치: %CD%
echo.
echo 한글 경로가 문제의 원인입니다.
echo.

echo ========================================
echo 2단계: 영문 경로로 프로젝트 복사
echo ========================================
echo.
echo C:\SHE\ 폴더로 프로젝트를 복사합니다...
echo.

if not exist "C:\SHE" (
    echo C:\SHE 폴더 생성 중...
    mkdir "C:\SHE"
)

echo 프로젝트 파일 복사 중...
xcopy "C:\Users\com\Desktop\SHE 디지털트윈\*" "C:\SHE\" /E /I /H /Y /Q

if %errorlevel% neq 0 (
    echo ❌ 파일 복사에 실패했습니다.
    echo.
    echo 수동 복사 방법:
    echo 1. 파일 탐색기에서 "C:\Users\com\Desktop\SHE 디지털트윈" 폴더 열기
    echo 2. 모든 파일 선택 (Ctrl+A)
    echo 3. 복사 (Ctrl+C)
    echo 4. C:\SHE 폴더 생성
    echo 5. 붙여넣기 (Ctrl+V)
    echo.
    pause
    exit /b 1
)

echo ✅ 파일 복사 완료!
echo.

echo ========================================
echo 3단계: 새 위치에서 서버 시작
echo ========================================
echo.
echo C:\SHE 폴더로 이동...
cd /d "C:\SHE"
echo 현재 위치: %CD%
echo.

echo 프로젝트 파일 확인...
if exist "package.json" (
    echo ✅ package.json 발견!
) else (
    echo ❌ package.json을 찾을 수 없습니다.
    echo 복사가 제대로 되지 않았습니다.
    pause
    exit /b 1
)

echo.
echo 서버 시작 중...
start "SHE Frontend Server (영문경로)" cmd /k "cd /d \"C:\SHE\" && npm run dev"
echo 서버 시작 중... 15초 대기
timeout /t 15 /nobreak >nul

echo ========================================
echo 4단계: 서버 상태 확인
echo ========================================
echo.
netstat -an | findstr ":3000" >nul
if %errorlevel% neq 0 (
    echo ❌ 서버 시작에 실패했습니다.
    echo.
    echo 수동 해결:
    echo 1. 새 CMD 창 열기
    echo 2. cd /d "C:\SHE"
    echo 3. npm run dev
) else (
    echo ✅ 서버가 성공적으로 시작되었습니다!
    echo.
    echo 브라우저에서 테스트: http://localhost:3000
)

echo.
echo ========================================
echo 5단계: ngrok 설정
echo ========================================
echo.
echo ngrok을 새 위치에서 시작합니다...
echo.
echo ngrok 터널 시작 중...
start "SHE ngrok Tunnel (영문경로)" cmd /k "cd /d \"C:\SHE\" && ngrok http 3000"

echo.
echo ========================================
echo 🎉 해결 완료!
echo ========================================
echo.
echo ✅ 프로젝트가 영문 경로로 이동되었습니다.
echo ✅ 파일 이름 오류가 해결되었습니다.
echo ✅ 서버가 새 위치에서 실행됩니다.
echo.
echo 📁 새 프로젝트 위치: C:\SHE\
echo 🌐 로컬 접속: http://localhost:3000
echo 🌍 공용 접속: ngrok URL (새 창에서 확인)
echo.
echo 로그인 정보:
echo   사용자명: dnrdl4070
echo   비밀번호: @wlsghks12
echo.
echo ⚠️ 주의사항:
echo - 앞으로는 C:\SHE\ 폴더에서 작업하세요
echo - 기존 한글 경로 폴더는 삭제해도 됩니다
echo - 모든 배치 파일도 C:\SHE\ 폴더에서 실행하세요
echo.
pause
