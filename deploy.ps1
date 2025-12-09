# Vercel 배포 스크립트
# PowerShell 실행 정책 설정 필요: Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

Write-Host "🚀 Vercel 배포 준비 시작..." -ForegroundColor Cyan

# 1. 로컬 빌드 테스트
Write-Host "`n📦 1단계: 로컬 빌드 테스트..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 빌드 실패! 오류를 확인하세요." -ForegroundColor Red
    exit 1
}
Write-Host "✅ 빌드 성공!" -ForegroundColor Green

# 2. Git 상태 확인
Write-Host "`n📋 2단계: Git 상태 확인..." -ForegroundColor Yellow
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "⚠️  커밋되지 않은 변경사항이 있습니다:" -ForegroundColor Yellow
    Write-Host $gitStatus
    $response = Read-Host "계속하시겠습니까? (y/n)"
    if ($response -ne "y") {
        exit 0
    }
} else {
    Write-Host "✅ 모든 변경사항이 커밋되었습니다." -ForegroundColor Green
}

# 3. Git 원격 저장소 확인
Write-Host "`n🔗 3단계: Git 원격 저장소 확인..." -ForegroundColor Yellow
$remoteUrl = git remote get-url origin 2>$null
if ($remoteUrl) {
    Write-Host "✅ 원격 저장소: $remoteUrl" -ForegroundColor Green
} else {
    Write-Host "⚠️  원격 저장소가 설정되지 않았습니다." -ForegroundColor Yellow
    Write-Host "다음 명령어로 원격 저장소를 추가하세요:" -ForegroundColor Yellow
    Write-Host "git remote add origin https://github.com/your-username/your-repo.git" -ForegroundColor Cyan
    exit 1
}

# 4. Vercel CLI 확인
Write-Host "`n🔧 4단계: Vercel CLI 확인..." -ForegroundColor Yellow
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelInstalled) {
    Write-Host "⚠️  Vercel CLI가 설치되지 않았습니다." -ForegroundColor Yellow
    Write-Host "설치 중..." -ForegroundColor Yellow
    npm install -g vercel
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Vercel CLI 설치 실패!" -ForegroundColor Red
        exit 1
    }
}
Write-Host "✅ Vercel CLI 준비 완료!" -ForegroundColor Green

# 5. 배포 옵션 선택
Write-Host "`n📤 5단계: 배포 옵션 선택..." -ForegroundColor Yellow
Write-Host "1. Vercel 대시보드를 통한 배포 (권장)"
Write-Host "2. Vercel CLI를 통한 배포"
$choice = Read-Host "선택 (1 또는 2)"

if ($choice -eq "2") {
    Write-Host "`n🚀 Vercel CLI로 배포 시작..." -ForegroundColor Cyan
    vercel --prod
} else {
    Write-Host "`n📝 다음 단계를 진행하세요:" -ForegroundColor Cyan
    Write-Host "1. https://vercel.com/dashboard 접속" -ForegroundColor Yellow
    Write-Host "2. 'Add New Project' 클릭" -ForegroundColor Yellow
    Write-Host "3. GitHub 저장소 선택" -ForegroundColor Yellow
    Write-Host "4. 환경 변수 설정 (VERCEL_DEPLOYMENT.md 참고)" -ForegroundColor Yellow
    Write-Host "5. 'Deploy' 버튼 클릭" -ForegroundColor Yellow
}

Write-Host "`n✅ 배포 준비 완료!" -ForegroundColor Green


