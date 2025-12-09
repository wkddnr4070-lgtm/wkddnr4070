# 🔧 터미널 명령 실행 문제 해결

## 문제 상황
PowerShell 스크립트 실행 시 인코딩 오류 발생

## 해결 방법

### 방법 1: CMD(명령 프롬프트) 사용 (권장)

PowerShell 대신 **CMD(명령 프롬프트)**를 사용하세요.

1. **명령 프롬프트 열기**:
   - `Win + R` → `cmd` 입력 → Enter
   - 또는 시작 메뉴에서 "명령 프롬프트" 검색

2. **프로젝트 디렉토리로 이동**:
   ```cmd
   cd "C:\Users\com\Desktop\SHE 디지털트윈"
   ```

3. **명령어 실행**:
   ```cmd
   git status
   npm run build
   ```

### 방법 2: 제공된 배치 파일 사용

다음 배치 파일들을 사용하세요 (CMD에서 정상 작동):

#### Git 명령어 실행
```cmd
run-git-cmd.bat
```
- Git 상태 확인
- 커밋 및 푸시
- 원격 저장소 관리

#### npm 명령어 실행
```cmd
run-npm-cmd.bat
```
- 빌드 테스트
- 개발 서버 시작
- 의존성 설치

### 방법 3: PowerShell 실행 정책 수정 (선택사항)

PowerShell을 계속 사용하려면:

1. **관리자 권한으로 PowerShell 열기**
2. **실행 정책 확인**:
   ```powershell
   Get-ExecutionPolicy
   ```
3. **실행 정책 변경**:
   ```powershell
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

## 📋 제공된 도구

### 1. `run-git-cmd.bat`
- Git 상태 확인
- 변경사항 커밋
- 원격 저장소 관리
- GitHub 푸시

### 2. `run-npm-cmd.bat`
- 빌드 테스트
- 개발 서버 실행
- 의존성 관리

### 3. `check-git-status.bat`
- Git 저장소 확인
- 상태 점검

### 4. `quick-deploy.bat`
- 전체 배포 프로세스 자동화

## ✅ 권장 사용 방법

**가장 안정적인 방법**: CMD + 배치 파일

1. 명령 프롬프트(cmd) 열기
2. 프로젝트 폴더로 이동
3. 필요한 배치 파일 실행:
   ```cmd
   run-git-cmd.bat      # Git 작업
   run-npm-cmd.bat      # npm 작업
   quick-deploy.bat     # 전체 배포
   ```

## 🔍 문제 해결

### Git 명령어가 작동하지 않는 경우
- Git이 설치되어 있는지 확인: `git --version`
- PATH 환경 변수에 Git이 포함되어 있는지 확인

### npm 명령어가 작동하지 않는 경우
- Node.js가 설치되어 있는지 확인: `node --version`
- npm이 설치되어 있는지 확인: `npm --version`

### 배치 파일이 실행되지 않는 경우
- 파일을 더블클릭하여 실행
- 또는 명령 프롬프트에서 파일명 입력하여 실행

---

**이제 CMD를 사용하여 모든 명령어를 실행할 수 있습니다!**


