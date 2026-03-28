# GitHub에서 바로 실행하는 방법 (로컬 저장 없이)

질문: **"파일이 내 컴퓨터에 없는데, GitHub에서 실행할 수 있나요?"**

답: **네, 가능합니다.**
다만 GitHub PR 화면 자체에서 바로 실행되는 것은 아니고, 아래 방식 중 하나를 써야 합니다.

---

## 방법 1) GitHub Codespaces (추천)

1. GitHub 저장소 메인 페이지로 이동
2. 초록색 **Code** 버튼 클릭
3. **Codespaces** 탭 선택
4. **Create codespace on main** 클릭
5. Codespace 터미널에서 아래 실행
   ```bash
   npm run poc:start
   ```
6. 포트 3000이 뜨면 **Open in Browser** 클릭

접속 주소 예시(코드스페이스가 자동 생성):
- `https://<codespace-url>-3000.app.github.dev`

---

## 방법 2) Vercel로 배포 (설치 없이 URL 공유)

1. https://vercel.com 접속 후 GitHub 계정 로그인
2. **Add New Project** → 현재 저장소 선택
3. Root Directory를 `smart-construction-poc`로 설정
4. Deploy 클릭
5. 배포 완료 후 생성된 URL로 접속

예시:
- `https://smart-construction-poc-xxxx.vercel.app`

---

## 주의

- GitHub의 **코드/PR 화면은 실행 화면이 아님**
- 실행하려면 Codespaces 또는 배포(Vercel)가 필요
