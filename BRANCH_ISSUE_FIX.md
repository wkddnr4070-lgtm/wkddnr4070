# 🔄 브랜치 문제 해결 가이드

## 현재 문제

Vercel 빌드 로그에서 여전히 같은 오류가 발생하고 있습니다:

```
Cloning github.com/wkddnr4070-lgtm/wkddnr4070 (Branch: production, Commit: d450df6)
Error: Function Runtimes must have a valid version, for example `now-php@1.0.0`.
```

### 문제 원인

- **Vercel이 `production` 브랜치에서 빌드 중**
- **수정된 `vercel.json`은 `production-clean` 브랜치에만 있음**
- **`production` 브랜치에는 아직 수정사항이 반영되지 않음**

## 해결 방법

### 방법 1: Vercel 프로젝트 설정 변경 ⭐ (권장)

Vercel 대시보드에서 Production Branch를 `production-clean`으로 변경하는 방법입니다.

#### 단계별 안내

1. **Vercel 프로젝트 설정으로 이동**:
   ```
   https://vercel.com/jangwookkims-projects/she-safety-hub-2026/settings
   ```

2. **왼쪽 사이드바에서 "Git" 클릭**

3. **"Production Branch" 섹션 찾기**:
   - 현재: `production`
   - 변경: `production-clean`

4. **드롭다운에서 `production-clean` 선택**

5. **"Save" 또는 "저장" 버튼 클릭**

6. **자동 재배포 시작됨**

#### 자동 스크립트 사용

```cmd
fix-vercel-branch-settings.bat
```

### 방법 2: production 브랜치에 수정사항 적용

`production` 브랜치에도 수정된 `vercel.json`을 적용하는 방법입니다.

#### 자동 스크립트 사용

```cmd
fix-branch-issue.bat
```

#### 수동 실행

```cmd
cd "C:\Users\com\Desktop\SHE 디지털트윈"

REM production 브랜치로 전환
git checkout production

REM production-clean의 vercel.json 가져오기
git show production-clean:vercel.json > vercel.json

REM 커밋 및 푸시
git add vercel.json
git commit -m "fix: vercel.json runtime 설정 수정 - nodejs18.x로 변경"
git push origin production
```

## 권장 해결 순서

### 1단계: 방법 1 시도 (Vercel 설정 변경)

1. `fix-vercel-branch-settings.bat` 실행
2. Option 1 선택
3. Vercel 대시보드에서 Production Branch를 `production-clean`으로 변경
4. 자동 재배포 확인

### 2단계: 방법 1이 안 되면 방법 2 시도

1. `fix-branch-issue.bat` 실행
2. `production` 브랜치에 수정사항 적용
3. GitHub에 푸시
4. Vercel 자동 재배포 확인

## 예상 결과

### 성공한 경우

```
Running build in Washington, D.C., USA (East) – iad1
Build machine configuration: 2 cores, 8 GB
Cloning github.com/wkddnr4070-lgtm/wkddnr4070 (Branch: production-clean, Commit: xxxxxx)
Cloning completed: 596.000ms
Running "vercel build"
Vercel CLI 49.1.2
✅ Build completed successfully
```

### 배포 완료 후

- ✅ 사이트 접속 가능: `https://she-safety-hub-2026.vercel.app`
- ✅ Runtime 오류 해결됨
- ✅ Function이 정상 작동함

## 문제 해결

### Vercel 설정을 찾을 수 없는 경우

1. **프로젝트 대시보드로 이동**:
   ```
   https://vercel.com/jangwookkims-projects/she-safety-hub-2026
   ```

2. **상단 메뉴에서 "Settings" 탭 클릭**

3. **왼쪽 사이드바에서 "Git" 클릭**

### Git 브랜치 전환이 안 되는 경우

```cmd
REM 현재 변경사항 저장
git stash

REM production 브랜치로 전환
git checkout production

REM 필요시 변경사항 복원
git stash pop
```

### 여전히 오류가 발생하는 경우

1. **캐시 삭제**: Vercel에서 Build Cache 삭제 후 재배포
2. **프로젝트 재연결**: Vercel과 GitHub 저장소 재연결
3. **새 프로젝트 생성**: 새로운 Vercel 프로젝트로 배포

## 빠른 링크

- **Vercel Git 설정**: https://vercel.com/jangwookkims-projects/she-safety-hub-2026/settings/git
- **배포 상태**: https://vercel.com/jangwookkims-projects/she-safety-hub-2026/deployments
- **프로젝트 대시보드**: https://vercel.com/jangwookkims-projects/she-safety-hub-2026

---

**권장: `fix-vercel-branch-settings.bat`를 실행하여 Vercel 설정을 변경하세요!**
