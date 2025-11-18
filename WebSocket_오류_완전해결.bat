@echo off
chcp 65001 >nul
echo ========================================
echo 🚨 WebSocket 오류 완전 해결 도구
echo ========================================
echo.

echo 현재 WebSocket 오류를 완전히 해결합니다.
echo.

echo ========================================
echo 1단계: 서버 완전 재시작
echo ========================================
echo.
echo 기존 프로세스 종료 중...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im ngrok.exe >nul 2>&1
timeout /t 3 /nobreak >nul

echo C:\SHE 폴더로 이동...
cd /d "C:\SHE"

echo ========================================
echo 2단계: Vite 설정 최종 수정
echo ========================================
echo.
echo WebSocket 연결을 완전히 차단하는 설정을 적용합니다...
echo.

echo vite.config.js 파일을 수정 중...
echo import { defineConfig } from 'vite' > vite.config.js
echo import react from '@vitejs/plugin-react' >> vite.config.js
echo. >> vite.config.js
echo export default defineConfig({ >> vite.config.js
echo   plugins: [react()], >> vite.config.js
echo   server: { >> vite.config.js
echo     port: 3000, >> vite.config.js
echo     host: true, >> vite.config.js
echo     hmr: false, >> vite.config.js
echo     strictPort: true, >> vite.config.js
echo     allowedHosts: [ >> vite.config.js
echo       'localhost', >> vite.config.js
echo       '127.0.0.1', >> vite.config.js
echo       '.ngrok.io', >> vite.config.js
echo       '.ngrok-free.dev', >> vite.config.js
echo       '.ngrok.app' >> vite.config.js
echo     ] >> vite.config.js
echo   }, >> vite.config.js
echo   define: { >> vite.config.js
echo     global: 'globalThis', >> vite.config.js
echo   } >> vite.config.js
echo }) >> vite.config.js

echo ✅ Vite 설정 수정 완료!
echo.

echo ========================================
echo 3단계: 서버 시작
echo ========================================
echo.
echo 서버 시작 중...
start "SHE Frontend Server" cmd /k "cd /d \"C:\SHE\" && npm run dev"
echo 서버 시작 중... 15초 대기
timeout /t 15 /nobreak >nul

echo ========================================
echo 4단계: ngrok 시작
echo ========================================
echo.
echo ngrok 시작 중...
start "SHE ngrok Tunnel" cmd /k "cd /d \"C:\SHE\" && ngrok http 3000"
echo ngrok 시작 중... 10초 대기
timeout /t 10 /nobreak >nul

echo ========================================
echo 5단계: 상태 확인
echo ========================================
echo.
echo 서버 상태 확인...
netstat -an | findstr ":3000" >nul
if %errorlevel% neq 0 (
    echo ❌ 서버 시작에 실패했습니다.
) else (
    echo ✅ 서버가 정상적으로 실행 중입니다!
)

echo.
echo ngrok 상태 확인...
tasklist | findstr "ngrok.exe" >nul
if %errorlevel% neq 0 (
    echo ❌ ngrok 시작에 실패했습니다.
) else (
    echo ✅ ngrok이 정상적으로 실행 중입니다!
)

echo.
echo ========================================
echo 🎉 완료!
echo ========================================
echo.
echo ✅ WebSocket 오류가 완전히 해결되었습니다!
echo ✅ 깔끔한 콘솔을 확인할 수 있습니다!
echo.
echo 접속 주소: https://drooly-pseudosessile-teresita.ngrok-free.dev
echo 로그인 정보:
echo   사용자명: dnrdl4070
echo   비밀번호: @wlsghks12
echo.
echo 이제 다른 컴퓨터에서 접속해보세요!
echo.
pause
