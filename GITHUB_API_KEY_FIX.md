# 🔒 GitHub API 키 보안 문제 해결

## 문제 상황

GitHub Push Protection이 이전 커밋에서 OpenAI API 키를 감지하여 푸시를 차단했습니다.

```
remote: error: GH013: Repository rule violations found for refs/heads/production.
remote: - Push cannot contain secrets
remote: - OpenAI API Key
remote:   locations:
remote:     - commit: bf20d68540e18f2fa30a4292895ebc7c18bdac2e
remote:       path: vercel.json:14
```

## 해결 방법

### 방법 1: 최근 커밋 취소 및 재커밋 (권장)

이전 커밋을 취소하고 API 키 없이 새로 커밋합니다:

```cmd
REM 1. 최근 커밋 취소 (파일 변경사항은 유지)
git reset --soft HEAD~1

REM 2. vercel.json 확인 (API 키가 없어야 함)
type vercel.json

REM 3. 새 커밋 생성
git add vercel.json
git commit -m "보안: API 키 제거 - 환경 변수로 이동"

REM 4. 푸시 시도
git push origin production
```

**자동 스크립트 사용:**
```cmd
remove-api-key-from-history.bat
```

### 방법 2: GitHub에서 직접 허용 (임시 해결)

GitHub가 제공하는 링크를 사용하여 일시적으로 허용:

1. GitHub 오류 메시지의 링크 클릭:
   ```
   https://github.com/wkddnr4070-lgtm/wkddnr4070/security/secret-scanning/unblock-secret/36byhSdoiOAHaHeg6vsteUK7MQg
   ```

2. "Allow secret" 클릭 (권장하지 않음 - 보안 위험)

⚠️ **주의**: 이 방법은 보안상 권장하지 않습니다. API 키를 제거하는 것이 올바른 방법입니다.

### 방법 3: Git 히스토리 완전 수정 (고급)

Git 히스토리에서 API 키를 완전히 제거하려면:

```cmd
REM BFG Repo-Cleaner 사용 (권장)
REM 또는 git filter-branch 사용

REM 1. BFG 다운로드: https://rtyley.github.io/bfg-repo-cleaner/
REM 2. API 키 제거
java -jar bfg.jar --replace-text passwords.txt

REM 3. 히스토리 강제 푸시 (주의!)
git push origin --force --all
```

⚠️ **주의**: Force push는 협업 중인 경우 위험할 수 있습니다.

## 현재 상태 확인

현재 `vercel.json` 파일에는 API 키가 없습니다. API 키는 환경 변수로 관리되어야 합니다:

### 올바른 설정

**vercel.json** (API 키 없음):
```json
{
  "functions": {
    "api/ai-feedback.js": {
      "runtime": "@vercel/node",
      "maxDuration": 30
    }
  }
}
```

**환경 변수** (Vercel 대시보드에서 설정):
```
OPENAI_KEY=sk-... (실제 키는 여기에만 저장)
AI_FEEDBACK_ENABLED=true
AI_MIN_SCORE=100
```

## 권장 해결 순서

1. ✅ **`remove-api-key-from-history.bat` 실행**
   - 최근 커밋 취소
   - 새 커밋 생성

2. ✅ **GitHub에 푸시 시도**
   ```cmd
   git push origin production
   ```

3. ✅ **여전히 오류가 발생하면**
   - GitHub에서 제공한 링크로 일시 허용
   - 또는 Git 히스토리 완전 수정 (방법 3)

## 예방 조치

앞으로 API 키가 커밋되지 않도록:

1. ✅ `.gitignore`에 `.env` 파일 추가 (이미 추가됨)
2. ✅ 환경 변수만 사용
3. ✅ 커밋 전 `git diff`로 확인
4. ✅ GitHub의 Secret Scanning 활성화 유지

---

**지금 `remove-api-key-from-history.bat`를 실행하세요!**

