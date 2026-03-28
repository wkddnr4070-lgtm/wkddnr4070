# GitHub Desktop 설정 가이드 (현재 화면 기준)

아래는 질문 주신 **GitHub Desktop 시작 화면**에서 바로 따라하는 순서입니다.

## 0) 현재 화면에서 해야 할 선택

왼쪽 목록에 아래 저장소가 이미 보이면:
- `wkddnr4070-lgtm/smart-construction-management-system`

👉 이 저장소를 클릭한 뒤, 하단 파란 버튼 **Clone wkddnr4070-lgtm/smart-construction-management-system** 를 누르세요.

## 1) Clone 경로 선택

1. "Local path"(저장 경로)를 선택
   - 예: `C:\Users\<사용자명>\Documents\GitHub\smart-construction-management-system`
2. **Clone** 클릭

## 2) 복제 완료 후 코드 보기

1. 메뉴에서 **Repository → Open in Explorer** 클릭
2. 폴더 안에서 아래 파일이 보여야 정상
   - `README.md`
   - `START_SMART_POC.bat`
   - `사이트_실행_가이드.md`
   - `파일_경로_정리.md`
   - `smart-construction-poc` 폴더

## 3) 실행 방법 (Windows 가장 쉬운 방법)

1. `START_SMART_POC.bat` 더블클릭
2. 터미널 창에서 `Local: http://localhost:3000` 문구 확인
3. 브라우저에서 `http://localhost:3000` 접속

## 4) 만약 버튼이 안 보이거나 실패하면

- 오른쪽에서 **Clone a repository from the Internet...** 클릭
- URL에 아래 입력
  - `https://github.com/wkddnr4070-lgtm/smart-construction-management-system.git`
- Clone 진행

## 5) 꼭 기억할 점

- GitHub 웹페이지(PR 화면)는 코드 확인 화면이고 실행 화면이 아님
- 실행은 내 PC에 Clone된 폴더에서 해야 함
