@echo off
echo ========================================
echo SHE 디지털트윈 공용 접속 설정
echo ========================================
echo.

echo 현재 상황:
echo - 프론트엔드: http://localhost:3001 (포트 변경됨)
echo - 백엔드: 포트 3001에서 실행 중
echo.

echo 공용 접속 방법 선택:
echo.
echo 1. ngrok 사용 (추천)
echo    - 무료, 간단, HTTPS 지원
echo    - URL이 매번 변경됨
echo.
echo 2. 모바일 핫스팟 사용
echo    - 즉시 사용 가능
echo    - 모바일 데이터 사용
echo.
echo 3. 클라우드 배포 (Vercel + Railway)
echo    - 완전 무료, 고정 URL
echo    - 설정이 복잡함
echo.

set /p choice="선택하세요 (1-3): "

if "%choice%"=="1" (
    echo.
    echo ngrok 설정을 시작합니다...
    call ngrok_설정.bat
) else if "%choice%"=="2" (
    echo.
    echo ========================================
    echo 모바일 핫스팟 사용 방법
    echo ========================================
    echo.
    echo 1. 모바일에서 핫스팟 켜기
    echo 2. 컴퓨터를 핫스팟에 연결
    echo 3. 다른 사람들도 같은 핫스팟에 연결
    echo 4. 현재 IP 주소 확인:
    for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr "IPv4"') do (
        set ip=%%a
        set ip=!ip: =!
        echo    http://!ip!:3001
    )
    echo.
    echo 로그인 정보:
    echo    사용자명: dnrdl4070
    echo    비밀번호: @wlsghks12
    echo.
    pause
) else if "%choice%"=="3" (
    echo.
    echo ========================================
    echo 클라우드 배포 가이드
    echo ========================================
    echo.
    echo 상세한 가이드는 '공용_접속_가이드.md' 파일을 참고하세요.
    echo.
    echo 간단한 단계:
    echo 1. GitHub에 코드 업로드
    echo 2. Vercel에서 프론트엔드 배포
    echo 3. Railway에서 백엔드 배포
    echo 4. 환경 변수 설정
    echo.
    pause
) else (
    echo 잘못된 선택입니다.
    pause
)
