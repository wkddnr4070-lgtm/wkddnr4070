@echo off
echo ========================================
echo 간단한 테스트 스크립트
echo ========================================
echo.
echo 현재 시간: %date% %time%
echo 현재 디렉토리: %CD%
echo.
echo Node.js 버전:
node --version
echo.
echo npm 버전:
npm --version
echo.
echo 파일 목록:
dir /b *.json
echo.
echo ========================================
echo 테스트 완료! 아무 키나 누르세요...
echo ========================================
pause

