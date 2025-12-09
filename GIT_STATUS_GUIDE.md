# 📋 Git 상태 확인 및 커밋 가이드

## Step 2: Git 상태 확인

명령 프롬프트(cmd)를 열고 다음 명령어들을 순서대로 실행하세요:

### 1. 프로젝트 디렉토리로 이동
```cmd
cd "C:\Users\com\Desktop\SHE 디지털트윈"
```

### 2. Git 상태 확인
```cmd
git status
```

**예상 결과:**
- 변경된 파일 목록이 표시됩니다
- 또는 "nothing to commit, working tree clean" 메시지가 나올 수 있습니다

### 3. Git 저장소 초기화 확인
만약 "not a git repository" 오류가 나오면:
```cmd
git init
```

### 4. 변경사항이 있다면 커밋
```cmd
git add .
git commit -m "배포 준비 완료 - Vercel 배포 (2025-01-28)"
```

### 5. 원격 저장소 확인
```cmd
git remote -v
```

**원격 저장소가 없다면:**
```cmd
git remote add origin https://github.com/your-username/your-repo.git
```
(실제 GitHub 저장소 URL로 변경하세요)

### 6. GitHub에 푸시
```cmd
git push -u origin main
```

또는 브랜치가 `master`인 경우:
```cmd
git push -u origin master
```

## 🔍 Git 상태별 대응 방법

### 케이스 1: Git 저장소가 없는 경우
```cmd
git init
git add .
git commit -m "Initial commit - 배포 준비"
```

### 케이스 2: 원격 저장소가 없는 경우
1. GitHub에서 새 저장소 생성
2. 저장소 URL 복사
3. 다음 명령어 실행:
```cmd
git remote add origin https://github.com/your-username/your-repo.git
git branch -M main
git push -u origin main
```

### 케이스 3: 이미 커밋된 상태인 경우
```cmd
git status
```
"nothing to commit"이면 바로 푸시 가능:
```cmd
git push origin main
```

## ⚠️ 주의사항

1. **`.env` 파일은 커밋하지 마세요**
   - `.gitignore`에 이미 포함되어 있어야 합니다
   - 확인: `git status`에서 `.env`가 나타나지 않아야 합니다

2. **민감한 정보 확인**
   - API 키, 비밀번호 등이 코드에 하드코딩되어 있지 않은지 확인

3. **빌드 결과물**
   - `dist` 폴더는 `.gitignore`에 포함되어 있어야 합니다

## 📝 다음 단계

Git 상태 확인 및 푸시가 완료되면:

1. Vercel 대시보드 접속: https://vercel.com/dashboard
2. "Add New Project" 클릭
3. GitHub 저장소 선택
4. 환경 변수 설정
5. 배포 실행

---

**진행 중 문제가 있으면 알려주세요!**


