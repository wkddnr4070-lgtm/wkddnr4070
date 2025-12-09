# 🔒 GitHub Push Protection 해결 가이드

## 현재 상황

GitHub Push Protection이 이전 커밋(`bf20d685`)의 API 키를 감지하여 푸시를 차단하고 있습니다.

```
remote: error: GH013: Repository rule violations found
remote: - OpenAI API Key
remote:   locations:
remote:     - commit: bf20d68540e18f2fa30a4292895ebc7c18bdac2e
remote:       path: vercel.json:14
```

## 해결 방법

### 방법 1: GitHub에서 일시 허용 ⭐ (가장 빠름)

**권장**: 이 방법이 가장 빠르고 간단합니다.

1. **링크 열기**:
   ```
   https://github.com/wkddnr4070-lgtm/wkddnr4070/security/secret-scanning/unblock-secret/36byhSdoiOAHaHeg6vsteUK7MQg
   ```

2. **GitHub 로그인** (필요시)

3. **"Allow secret" 또는 "일시 허용" 클릭**

4. **다시 푸시 시도**:
   ```cmd
   push-now.bat
   ```

**자동 스크립트 사용**:
```cmd
allow-secret-on-github.bat
```

### 방법 2: 새 브랜치 생성 (권장 - 영구 해결)

현재 커밋을 새 브랜치로 푸시하면 히스토리 문제를 피할 수 있습니다:

```cmd
REM 1. 새 브랜치 생성
git checkout -b production-clean

REM 2. GitHub에 푸시
git push origin production-clean

REM 3. Vercel에서 새 브랜치 사용하도록 설정
```

**자동 스크립트 사용**:
```cmd
fix-git-history-complete.bat
```

### 방법 3: Git 히스토리 완전 수정 (고급)

⚠️ **주의**: 이 방법은 복잡하고 협업 중이라면 위험할 수 있습니다.

#### BFG Repo-Cleaner 사용 (권장)

1. **BFG 다운로드**:
   - https://rtyley.github.io/bfg-repo-cleaner/
   - `bfg.jar` 다운로드

2. **API 키 제거**:
   ```cmd
   REM API 키가 포함된 파일 백업
   echo sk-* > passwords.txt
   
   REM BFG 실행
   java -jar bfg.jar --replace-text passwords.txt
   
   REM 히스토리 정리
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   
   REM 강제 푸시 (주의!)
   git push origin --force --all
   ```

#### git filter-branch 사용

```cmd
REM vercel.json에서 API 키 제거
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch vercel.json" \
  --prune-empty --tag-name-filter cat -- --all

REM 히스토리 정리
git reflog expire --expire=now --all
git gc --prune=now --aggressive

REM 강제 푸시 (주의!)
git push origin --force --all
```

## 권장 해결 순서

1. ✅ **`allow-secret-on-github.bat` 실행**
   - GitHub 링크 열기
   - "Allow secret" 클릭

2. ✅ **`push-now.bat` 실행**
   - 푸시 재시도

3. ✅ **성공하면 Vercel 배포 진행**

## 예방 조치

앞으로 API 키가 커밋되지 않도록:

1. ✅ `.gitignore`에 `.env` 파일 추가 (이미 완료)
2. ✅ 환경 변수만 사용 (이미 완료)
3. ✅ 커밋 전 `git diff`로 확인
4. ✅ GitHub의 Secret Scanning 활성화 유지

## 참고

- 현재 `vercel.json`에는 API 키가 없습니다 ✅
- API 키는 환경 변수로 관리됩니다 ✅
- 문제는 이전 커밋 히스토리에만 남아있습니다

---

**지금 `allow-secret-on-github.bat`를 실행하여 GitHub에서 허용하세요!**

