@echo off
echo ========================================
echo Windows 시작 프로그램 등록
echo ========================================
echo.

echo SHE Digital Twin 서버를 Windows 시작 프로그램에 등록합니다.
echo.

echo 시작 프로그램 폴더에 바로가기 생성 중...
set "startupFolder=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "batchFile=C:\Users\com\Desktop\SHE 디지털트윈\SHE_서버_자동시작.bat"

echo [InternetShortcut] > "%startupFolder%\SHE Digital Twin.url"
echo URL=file:///%batchFile% >> "%startupFolder%\SHE Digital Twin.url"
echo IconFile=%batchFile% >> "%startupFolder%\SHE Digital Twin.url"
echo IconIndex=0 >> "%startupFolder%\SHE Digital Twin.url"

echo ✅ 시작 프로그램 등록 완료!
echo.
echo 이제 컴퓨터를 재시작하면 자동으로 서버가 시작됩니다.
echo.
echo 등록된 위치: %startupFolder%
echo 실행 파일: %batchFile%
echo.
pause

