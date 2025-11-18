@echo off
echo 🔍 VS Code 설치 확인 중...
where code
if %errorlevel% == 0 (
    echo ✅ VS Code가 설치되어 있습니다!
    echo 🚀 현재 프로젝트 폴더에서 VS Code를 실행합니다...
    cd /d "C:\Users\com\Desktop\SHE 디지털트윈"
    code .
) else (
    echo ❌ VS Code가 PATH에 등록되지 않았습니다.
    echo 💡 VS Code를 수동으로 실행하고 폴더를 열어주세요.
    echo 📂 폴더 경로: C:\Users\com\Desktop\SHE 디지털트윈
)
pause
