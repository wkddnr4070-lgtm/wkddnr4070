@echo off
REM 네트워크 연결 문제 해결 스크립트
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo   네트워크 연결 문제 해결
echo ========================================
echo.

echo [1/5] 인터넷 연결 확인...
ping -n 1 8.8.8.8 >nul 2>&1
if errorlevel 1 (
    echo ❌ 인터넷 연결이 없습니다.
    echo 네트워크 케이블 및 Wi-Fi 연결을 확인하세요.
    pause
    exit /b 1
) else (
    echo ✅ 인터넷 연결 정상
)
echo.

echo [2/5] DNS 서버 확인...
ping -n 1 github.com >nul 2>&1
if errorlevel 1 (
    echo ❌ github.com에 접근할 수 없습니다.
    echo DNS 문제일 수 있습니다.
    echo.
    echo 해결 방법:
    echo 1. DNS 서버를 Google DNS로 변경:
    echo    - 네트워크 설정 → 어댑터 옵션 변경
    echo    - IPv4 속성 → 다음 DNS 서버 사용:
    echo      기본: 8.8.8.8
    echo      대체: 8.8.4.4
    echo.
    echo 2. 또는 hosts 파일에 GitHub IP 추가 (임시)
    echo.
    pause
) else (
    echo ✅ github.com 접근 가능
)
echo.

echo [3/5] GitHub 연결 테스트...
nslookup github.com >nul 2>&1
if errorlevel 1 (
    echo ⚠️  DNS 해석 실패
) else (
    echo ✅ DNS 해석 성공
)
echo.

echo [4/5] Git 원격 저장소 확인...
cd /d "%~dp0"
git remote -v
echo.

echo [5/5] 해결 방법 제시...
echo.
echo ========================================
echo   해결 방법
echo ========================================
echo.
echo 방법 1: DNS 서버 변경 (권장)
echo ----------------------------------------
echo 1. 제어판 → 네트워크 및 공유 센터
echo 2. 어댑터 설정 변경
echo 3. 활성 네트워크 어댑터 우클릭 → 속성
echo 4. "인터넷 프로토콜 버전 4(TCP/IPv4)" 선택 → 속성
echo 5. "다음 DNS 서버 주소 사용" 선택
echo 6. 기본 DNS 서버: 8.8.8.8
echo 7. 대체 DNS 서버: 8.8.4.4
echo 8. 확인 → 네트워크 재연결
echo.
echo 방법 2: hosts 파일 수정 (임시)
echo ----------------------------------------
echo 1. 관리자 권한으로 메모장 실행
echo 2. C:\Windows\System32\drivers\etc\hosts 파일 열기
echo 3. 다음 줄 추가:
echo    140.82.112.3 github.com
echo    140.82.112.4 github.com
echo 4. 저장
echo.
echo 방법 3: VPN 사용
echo ----------------------------------------
echo VPN을 사용하여 GitHub에 접근
echo.
echo 방법 4: 다른 네트워크에서 시도
echo ----------------------------------------
echo 모바일 핫스팟 또는 다른 네트워크 사용
echo.
pause

