# PowerShell 환경 테스트 스크립트
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "PowerShell 환경 테스트" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 기본 정보 확인
Write-Host "PowerShell 버전: $($PSVersionTable.PSVersion)" -ForegroundColor Green
Write-Host "실행 정책: $(Get-ExecutionPolicy)" -ForegroundColor Green
Write-Host "현재 디렉토리: $(Get-Location)" -ForegroundColor Green

# 기본 명령어 테스트
Write-Host "`n[테스트 1] 기본 명령어" -ForegroundColor Yellow
try {
    $testVar = "테스트 성공"
    Write-Host "변수 할당: $testVar" -ForegroundColor Green
} catch {
    Write-Host "변수 할당 실패: $($_.Exception.Message)" -ForegroundColor Red
}

# 파일 시스템 접근 테스트
Write-Host "`n[테스트 2] 파일 시스템 접근" -ForegroundColor Yellow
try {
    $currentPath = Get-Location
    Write-Host "현재 경로 읽기 성공: $currentPath" -ForegroundColor Green
} catch {
    Write-Host "파일 시스템 접근 실패: $($_.Exception.Message)" -ForegroundColor Red
}

# npm 명령어 테스트
Write-Host "`n[테스트 3] npm 명령어" -ForegroundColor Yellow
try {
    $npmVersion = npm --version 2>$null
    if ($npmVersion) {
        Write-Host "npm 버전: $npmVersion" -ForegroundColor Green
    } else {
        Write-Host "npm을 찾을 수 없습니다" -ForegroundColor Red
    }
} catch {
    Write-Host "npm 테스트 실패: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "테스트 완료!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
