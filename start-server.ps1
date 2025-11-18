Write-Host "🚀 SHE 디지털트윈 플랫폼 서버 시작..." -ForegroundColor Green
Set-Location "C:\Users\com\Desktop\SHE 디지털트윈"
Write-Host "📂 현재 위치: $(Get-Location)" -ForegroundColor Cyan

if (Test-Path "package.json") {
    Write-Host "✅ package.json 파일 확인됨" -ForegroundColor Green
} else {
    Write-Host "❌ package.json 파일이 없습니다!" -ForegroundColor Red
    Read-Host "아무 키나 누르세요..."
    exit
}

if (Test-Path "node_modules") {
    Write-Host "✅ node_modules 폴더 확인됨" -ForegroundColor Green
} else {
    Write-Host "⚠️ node_modules 폴더가 없습니다. npm install을 실행합니다..." -ForegroundColor Yellow
    npm install
}

Write-Host "🌐 서버 시작 후 브라우저에서 http://localhost:3000 접속하세요" -ForegroundColor Magenta
Write-Host "⏹️ 서버를 중지하려면 Ctrl+C를 누르세요" -ForegroundColor Yellow
Write-Host ""

npm run dev
