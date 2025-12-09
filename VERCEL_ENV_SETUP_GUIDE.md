# 📝 Vercel 환경 변수 설정 가이드 (초보자용)

## 현재 상태 확인

화면을 보면 이미 일부 환경 변수가 설정되어 있습니다:
- ✅ `VITE_SUPABASE_URL`
- ✅ `VITE_SUPABASE_ANON_KEY`
- ✅ `OPENAI_KEY`
- ✅ `AI_FEEDBACK_ENABLED`
- ✅ `AI_MIN_SCORE`

## 필요한 환경 변수 확인

다음 변수들이 모두 있는지 확인하세요:

### 필수 변수 목록

1. ✅ `OPENAI_KEY` - 이미 있음
2. ✅ `AI_FEEDBACK_ENABLED` - 이미 있음
3. ✅ `AI_MIN_SCORE` - 이미 있음
4. ❓ `VITE_AI_FEEDBACK_ENABLED` - 확인 필요

## 단계별 설정 방법

### 1단계: 누락된 변수 확인

화면 아래쪽의 **"Existing Environment Variables List"** (기존 환경 변수 목록)에서:
- `VITE_AI_FEEDBACK_ENABLED`가 있는지 확인하세요
- 없다면 추가해야 합니다

### 2단계: 새 변수 추가하기

화면 위쪽의 **"Add New Variable Input Fields"** (새 변수 추가 필드)를 사용하세요:

#### Step 1: Key 입력
1. **"Key"** 필드에 변수 이름 입력:
   ```
   VITE_AI_FEEDBACK_ENABLED
   ```
   - 대소문자를 정확히 입력하세요
   - 언더스코어(_)도 정확히 입력하세요

#### Step 2: Value 입력
2. **"Value"** 필드에 값 입력:
   ```
   true
   ```
   - 소문자로 `true` 입력

#### Step 3: 환경 범위 확인
3. **"Environments"** 드롭다운 확인:
   - **"All Environments"**로 설정되어 있는지 확인
   - 다른 값이면 클릭해서 "All Environments" 선택

#### Step 4: 저장
4. 화면 오른쪽의 **"Save"** 버튼 클릭
   - 검은색 버튼입니다
   - 클릭하면 변수가 저장됩니다

### 3단계: 기존 변수 값 확인 및 수정

#### 값 확인하기
1. 기존 변수 목록에서 확인하고 싶은 변수 찾기
2. 변수 오른쪽에 있는 **눈 아이콘** 👁️ 클릭
   - 클릭하면 값이 보입니다
   - 다시 클릭하면 숨겨집니다

#### 값 수정하기
1. 수정하고 싶은 변수의 **오른쪽 끝에 있는 점 3개** (⋯) 클릭
2. **"Edit"** 또는 **"수정"** 선택
3. Value 필드에서 값 수정
4. **"Save"** 버튼 클릭

### 4단계: OPENAI_KEY 확인 (중요!)

`OPENAI_KEY`의 값이 실제 OpenAI API 키인지 확인하세요:

1. `OPENAI_KEY` 변수 찾기
2. 오른쪽의 **눈 아이콘** 👁️ 클릭하여 값 확인
3. 값이 `sk-`로 시작하는 실제 API 키인지 확인
4. 만약 더미 값이나 잘못된 값이면:
   - 점 3개 (⋯) 클릭 → Edit 선택
   - 올바른 API 키 입력
   - Save 클릭

## 전체 체크리스트

다음 변수들이 모두 설정되어 있는지 확인하세요:

| 변수 이름 | 값 | 확인 방법 |
|----------|-----|----------|
| `OPENAI_KEY` | `sk-...` (실제 API 키) | 눈 아이콘으로 값 확인 |
| `AI_FEEDBACK_ENABLED` | `true` | 눈 아이콘으로 값 확인 |
| `AI_MIN_SCORE` | `100` | 눈 아이콘으로 값 확인 |
| `VITE_AI_FEEDBACK_ENABLED` | `true` | 목록에 있는지 확인, 없으면 추가 |

## 주의사항

### ⚠️ 중요한 점들

1. **대소문자 정확히 입력**
   - `VITE_AI_FEEDBACK_ENABLED` (O)
   - `vite_ai_feedback_enabled` (X)

2. **모든 환경에 적용**
   - "Environments"는 **"All Environments"**로 설정
   - Production, Preview, Development 모두에 적용됩니다

3. **저장 버튼 클릭**
   - 변수를 추가/수정한 후 반드시 **"Save"** 버튼 클릭
   - 저장하지 않으면 변경사항이 적용되지 않습니다

4. **OPENAI_KEY 보안**
   - `OPENAI_KEY`는 실제 OpenAI API 키여야 합니다
   - `sk-`로 시작하는 긴 문자열입니다
   - 잘못된 키면 AI 피드백이 작동하지 않습니다

## 문제 해결

### 변수를 추가했는데 목록에 안 보여요
- **"Save"** 버튼을 클릭했는지 확인
- 페이지를 새로고침 (F5)
- 다시 확인

### 값이 제대로 저장되었는지 확인하고 싶어요
- 변수 오른쪽의 **눈 아이콘** 👁️ 클릭
- 값이 보이면 정상입니다

### 여러 변수를 한 번에 추가하고 싶어요
- 첫 번째 변수 입력 후
- **"Add Another"** 버튼 클릭
- 새로운 Key/Value 필드가 나타납니다
- 여러 변수를 입력한 후 마지막에 **"Save"** 클릭

## 다음 단계

환경 변수 설정이 완료되면:

1. ✅ 모든 변수가 설정되었는지 확인
2. ✅ `OPENAI_KEY`가 올바른지 확인
3. ✅ **"Save"** 버튼 클릭 (변경사항이 있다면)
4. ✅ 배포된 사이트 테스트: https://she-safety-hub-2026.vercel.app

---

**지금 화면에서 `VITE_AI_FEEDBACK_ENABLED` 변수가 있는지 확인하고, 없으면 추가하세요!**

