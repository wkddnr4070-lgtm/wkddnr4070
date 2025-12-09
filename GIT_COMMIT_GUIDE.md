# 📝 Git 커밋 및 푸시 가이드

## 현재 상태

✅ Git 상태 확인 완료
- 브랜치: `production`
- 수정된 파일: 25개
- 새로 추가된 파일: 20개

## 다음 단계

### 방법 1: 자동 스크립트 사용 (권장)

`commit-and-push.bat` 파일을 실행하세요:

```cmd
commit-and-push.bat
```

이 스크립트가 자동으로:
1. ✅ 모든 변경사항 추가 (`git add .`)
2. ✅ 커밋 생성 (메시지: "11/27 이전 상태 복구 및 배포 준비 완료")
3. ✅ 원격 저장소 확인
4. ✅ GitHub에 푸시

### 방법 2: 수동 실행

명령 프롬프트(cmd)에서:

```cmd
cd "C:\Users\com\Desktop\SHE 디지털트윈"

REM 1. 모든 변경사항 추가
git add .

REM 2. 커밋
git commit -m "11/27 이전 상태 복구 및 배포 준비 완료"

REM 3. 푸시 (production 브랜치)
git push origin production
```

### 방법 3: run-git-cmd.bat 사용

```cmd
run-git-cmd.bat
```

메뉴에서:
- **7번 선택**: 모든 변경사항 커밋 및 푸시

## 변경사항 요약

### 수정된 파일 (25개)
- 설정 파일: `.gitignore`, `package.json`, `vite.config.js`, `tailwind.config.js`
- 백엔드: `backend/src/**/*.js`
- 프론트엔드: `src/App.jsx`, `src/components/*.jsx`
- API: `api/ai-feedback.js`
- 문서: `README_AI_SETUP.md`, `vercel.json`

### 새로 추가된 파일 (20개)
- 배포 관련: `DEPLOYMENT_STATUS.md`, `VERCEL_DEPLOYMENT.md`, `quick-deploy.bat` 등
- 컴포넌트: `src/components/LoginPage.jsx`, `src/components/OrganizationManagement.jsx` 등
- 유틸리티: `run-git-cmd.bat`, `run-npm-cmd.bat` 등

## 주의사항

### 원격 저장소가 없는 경우

GitHub 저장소가 아직 연결되지 않았다면:

1. **GitHub에서 새 저장소 생성**
   - https://github.com/new
   - 저장소 이름 입력 (예: `she-digital-twin`)
   - Public 또는 Private 선택
   - "Create repository" 클릭

2. **원격 저장소 추가**
   ```cmd
   git remote add origin https://github.com/your-username/your-repo.git
   ```

3. **푸시**
   ```cmd
   git push -u origin production
   ```

### 인증 문제

GitHub에 푸시할 때 인증이 필요할 수 있습니다:

1. **Personal Access Token 사용** (권장)
   - GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - "Generate new token" 클릭
   - 권한: `repo` 선택
   - 생성된 토큰을 비밀번호 대신 사용

2. **Git Credential Manager 사용**
   ```cmd
   git config --global credential.helper manager-core
   ```

## 다음 단계 (푸시 완료 후)

1. ✅ **GitHub 푸시 완료 확인**
   - GitHub 저장소 페이지에서 변경사항 확인

2. ✅ **Vercel 배포 준비**
   - `VERCEL_DEPLOYMENT.md` 참고
   - Vercel 대시보드에서 프로젝트 연결
   - 환경 변수 설정

3. ✅ **배포 실행**
   - Vercel에서 자동 배포 또는 수동 배포

---

**지금 `commit-and-push.bat`를 실행하여 변경사항을 커밋하고 푸시하세요!**

