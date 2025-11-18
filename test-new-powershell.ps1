# PowerShell 7+ 전용 서버 시작 스크립트
Write-Host "🚀 SHE 디지털트윈 플랫폼 - PowerShell 재설치 후 테스트" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Cyan

# PowerShell 버전 확인
Write-Host "📋 PowerShell 버전 정보:" -ForegroundColor Yellow
$PSVersionTable.PSVersion
Write-Host ""

# 현재 위치 확인
Write-Host "📂 현재 디렉토리:" -ForegroundColor Yellow
Get-Location
Write-Host ""

# 프로젝트 폴더로 이동
$ProjectPath = "C:\Users\com\Desktop\SHE 디지털트윈"
Write-Host "📁 프로젝트 폴더로 이동: $ProjectPath" -ForegroundColor Yellow

if (Test-Path $ProjectPath) {
    Set-Location $ProjectPath
    Write-Host "✅ 프로젝트 폴더 이동 성공" -ForegroundColor Green
} else {
    Write-Host "❌ 프로젝트 폴더를 찾을 수 없습니다!" -ForegroundColor Red
    Read-Host "아무 키나 누르세요..."
    exit
}

# package.json 확인
Write-Host "📋 package.json 파일 확인..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    Write-Host "✅ package.json 파일 존재" -ForegroundColor Green
    
    # package.json 내용 일부 표시
    $packageContent = Get-Content "package.json" | ConvertFrom-Json
    Write-Host "📦 프로젝트명: $($packageContent.name)" -ForegroundColor Cyan
    Write-Host "🏷️ 버전: $($packageContent.version)" -ForegroundColor Cyan
} else {
    Write-Host "❌ package.json 파일이 없습니다!" -ForegroundColor Red
    Read-Host "아무 키나 누르세요..."
    exit
}

# Node.js 확인
Write-Host "🟢 Node.js 확인..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js 버전: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js가 설치되지 않았습니다!" -ForegroundColor Red
    Read-Host "아무 키나 누르세요..."
    exit
}

# npm 확인
Write-Host "📦 npm 확인..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✅ npm 버전: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm이 설치되지 않았습니다!" -ForegroundColor Red
    Read-Host "아무 키나 누르세요..."
    exit
}

Write-Host ""
Write-Host "🚀 서버를 시작합니다..." -ForegroundColor Green
Write-Host "🌐 브라우저에서 http://localhost:3000 접속하세요" -ForegroundColor Magenta
Write-Host "⏹️ 서버를 중지하려면 Ctrl+C를 누르세요" -ForegroundColor Yellow
Write-Host ""

# 서버 시작
npm run dev
