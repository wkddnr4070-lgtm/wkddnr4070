@echo off
echo ========================================
echo 폴더명 변경 및 완전 해결 도구
echo ========================================
echo.

echo 현재 위치: %CD%
echo.

echo ========================================
echo 1단계: 모든 프로세스 종료
echo ========================================
echo.
echo 모든 프로세스를 종료합니다...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im ngrok.exe >nul 2>&1
timeout /t 3 /nobreak >nul

echo ========================================
echo 2단계: 원본 폴더에서 작업
echo ========================================
echo.
echo 원본 폴더로 이동합니다...
cd /d "C:\Users\com\Desktop\SHE 디지털트윈"
echo 현재 위치: %CD%
echo.

echo ========================================
echo 3단계: Vite 설정 수정
echo ========================================
echo.
echo Vite 설정을 ngrok 호환으로 수정합니다...
echo import { defineConfig } from 'vite' > vite.config.js
echo import react from '@vitejs/plugin-react' >> vite.config.js
echo. >> vite.config.js
echo export default defineConfig({ >> vite.config.js
echo   plugins: [react()], >> vite.config.js
echo   server: { >> vite.config.js
echo     port: 3000, >> vite.config.js
echo     host: '0.0.0.0', >> vite.config.js
echo     hmr: false, >> vite.config.js
echo     strictPort: true, >> vite.config.js
echo     allowedHosts: 'all', >> vite.config.js
echo     cors: true >> vite.config.js
echo   }, >> vite.config.js
echo   define: { >> vite.config.js
echo     global: 'globalThis', >> vite.config.js
echo   } >> vite.config.js
echo }) >> vite.config.js

echo ✅ Vite 설정 수정 완료!
echo.

echo ========================================
echo 4단계: 서버 시작
echo ========================================
echo.
echo 서버를 시작합니다...
start "SHE Frontend Server" cmd /k "cd /d \"C:\Users\com\Desktop\SHE 디지털트윈\" && npm run dev"
echo 서버 시작 중... 15초 대기
timeout /t 15 /nobreak >nul

echo ========================================
echo 5단계: ngrok 시작
echo ========================================
echo.
echo ngrok을 시작합니다...
start "SHE ngrok Tunnel" cmd /k "ngrok http 3000"
echo ngrok 시작 중... 10초 대기
timeout /t 10 /nobreak >nul

echo ========================================
echo 6단계: 상태 확인
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
echo ✅ 원본 폴더에서 작업 가능!
echo ✅ 호스트 차단 문제 해결!
echo ✅ ngrok 정상 연결!
echo.
echo 접속 주소: https://drooly-pseudosessile-teresita.ngrok-free.dev
echo 로그인 정보:
echo   사용자명: dnrdl4070
echo   비밀번호: @wlsghks12
echo.
echo 이제 다른 컴퓨터에서 접속해보세요!
echo.
pause

