# 🔧 Vercel Runtime 오류 해결

## 오류 메시지

```
Error: Function Runtimes must have a valid version, for example `now-php@1.0.0`.
```

## 원인

`vercel.json` 파일에서 Function Runtime 설정이 잘못되었습니다.

### 문제가 된 설정

```json
{
  "functions": {
    "api/ai-feedback.js": {
      "runtime": "@vercel/node",  // ❌ 잘못된 런타임 설정
      "maxDuration": 30
    }
  }
}
```

## 해결 방법

### 수정된 설정

```json
{
  "functions": {
    "api/ai-feedback.js": {
      "runtime": "nodejs18.x",  // ✅ 올바른 런타임 설정
      "maxDuration": 30
    }
  }
}
```

## 변경 사항

- **이전**: `"runtime": "@vercel/node"`
- **수정**: `"runtime": "nodejs18.x"`

## 적용 방법

### 방법 1: 자동 수정 스크립트 사용 (권장)

`fix-vercel-runtime-error.bat` 파일을 실행하세요:

```cmd
fix-vercel-runtime-error.bat
```

이 스크립트가 자동으로:
1. ✅ `vercel.json` 파일 수정
2. ✅ Git 커밋 및 푸시
3. ✅ Vercel 자동 재배포 트리거

### 방법 2: 수동 수정

1. **vercel.json 파일 열기**

2. **runtime 설정 수정**:
   ```json
   {
     "functions": {
       "api/ai-feedback.js": {
         "runtime": "nodejs18.x",
         "maxDuration": 30
       }
     }
   }
   ```

3. **Git 커밋 및 푸시**:
   ```cmd
   git add vercel.json
   git commit -m "fix: vercel.json runtime 설정 수정"
   git push origin production-clean
   ```

## Vercel에서 지원하는 Runtime 버전

### Node.js
- `nodejs18.x` ✅ (권장)
- `nodejs16.x`
- `nodejs14.x`

### 기타
- `python3.9`
- `go1.x`
- `edge` (Edge Runtime)

## 배포 확인

### 1단계: Git 푸시 완료 확인

```cmd
git push origin production-clean
```

성공 메시지:
```
✅ 푸시 완료
```

### 2단계: Vercel 자동 재배포 확인

1. **배포 페이지 접속**:
   ```
   https://vercel.com/jangwookkims-projects/she-safety-hub-2026/deployments
   ```

2. **새 배포 확인**:
   - 새로운 배포가 시작되었는지 확인
   - 배포 상태: Building → Success

3. **빌드 로그 확인**:
   - Runtime 오류가 해결되었는지 확인
   - Build 완료 메시지 확인

### 3단계: 사이트 접속 테스트

배포가 완료되면:

```
https://she-safety-hub-2026.vercel.app
```

## 예상 빌드 로그

수정 후 예상되는 빌드 로그:

```
Running build in Washington, D.C., USA (East) – iad1
Build machine configuration: 2 cores, 8 GB
Cloning github.com/wkddnr4070-lgtm/wkddnr4070 (Branch: production-clean, Commit: xxxxxx)
Cloning completed: 596.000ms
Running "vercel build"
Vercel CLI 49.1.2
✅ Build completed successfully
```

## 문제 해결

### 여전히 빌드가 실패하는 경우

1. **다른 오류 확인**:
   - Build Logs에서 새로운 오류 메시지 확인
   - 의존성 설치 오류
   - 환경 변수 오류

2. **프로젝트 설정 확인**:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **로컬 빌드 테스트**:
   ```cmd
   npm run build
   ```

### 배포는 성공했지만 사이트가 작동하지 않는 경우

1. **환경 변수 확인**:
   - Settings → Environment Variables
   - 모든 필수 변수가 설정되었는지 확인

2. **브라우저 콘솔 확인**:
   - F12 → Console 탭
   - JavaScript 오류 확인

3. **Vercel Function 로그 확인**:
   - Functions 탭 → `api/ai-feedback.js` 로그 확인

## 타임라인

1. ✅ `vercel.json` 수정 완료
2. ⏳ Git 푸시 (1분)
3. ⏳ Vercel 자동 재배포 (2-3분)
4. ✅ 사이트 접속 가능

---

**지금 `fix-vercel-runtime-error.bat`를 실행하여 문제를 해결하세요!**
