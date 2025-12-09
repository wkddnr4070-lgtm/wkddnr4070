# 🌐 네트워크 연결 문제 해결 가이드

## 현재 문제

```
fatal: unable to access 'https://github.com/wkddnr4070-lgtm/wkddnr4070.git/': 
Could not resolve host: github.com
```

이것은 **DNS 해석 문제**입니다. GitHub Push Protection 문제가 아닙니다.

## 해결 방법

### 방법 1: DNS 서버 변경 (권장)

1. **제어판 열기**
   - `Win + R` → `control` 입력 → Enter

2. **네트워크 설정으로 이동**
   - 네트워크 및 공유 센터 → 어댑터 설정 변경

3. **활성 네트워크 어댑터 선택**
   - Wi-Fi 또는 이더넷 어댑터 우클릭 → 속성

4. **IPv4 속성 변경**
   - "인터넷 프로토콜 버전 4(TCP/IPv4)" 선택 → 속성
   - "다음 DNS 서버 주소 사용" 선택
   - 기본 DNS 서버: `8.8.8.8`
   - 대체 DNS 서버: `8.8.4.4`
   - 확인 클릭

5. **네트워크 재연결**
   - Wi-Fi: 연결 끊기 → 다시 연결
   - 이더넷: 케이블 뽑았다가 다시 연결

6. **연결 테스트**
   ```cmd
   ping github.com
   ```

### 방법 2: hosts 파일 수정 (임시 해결)

1. **관리자 권한으로 메모장 실행**
   - 시작 메뉴 → 메모장 우클릭 → 관리자 권한으로 실행

2. **hosts 파일 열기**
   - 파일 → 열기
   - 경로: `C:\Windows\System32\drivers\etc\hosts`
   - 파일 형식: "모든 파일" 선택

3. **다음 줄 추가**
   ```
   140.82.112.3 github.com
   140.82.112.4 github.com
   ```

4. **저장**
   - 파일 → 저장

5. **연결 테스트**
   ```cmd
   ping github.com
   ```

### 방법 3: VPN 사용

GitHub 접근이 차단된 네트워크 환경이라면 VPN을 사용하세요.

### 방법 4: 다른 네트워크에서 시도

- 모바일 핫스팟 사용
- 다른 Wi-Fi 네트워크 사용
- 다른 위치에서 시도

## 진단 도구

### 연결 테스트 스크립트 실행

```cmd
test-github-connection.bat
```

이 스크립트가 다음을 테스트합니다:
- 인터넷 연결
- DNS 해석
- GitHub 접근
- Git 원격 저장소 연결

### 수동 테스트

명령 프롬프트에서:

```cmd
REM 1. 인터넷 연결 확인
ping 8.8.8.8

REM 2. DNS 해석 확인
nslookup github.com

REM 3. GitHub 접근 확인
ping github.com

REM 4. Git 연결 확인
git ls-remote --heads origin
```

## 네트워크 문제 해결 후

연결이 정상화되면:

```cmd
REM GitHub에 푸시
git push origin production
```

또는:

```cmd
push-to-github.bat
```

## 추가 문제 해결

### 방화벽 문제

Windows 방화벽이 Git을 차단할 수 있습니다:

1. 제어판 → Windows Defender 방화벽
2. 고급 설정 → 아웃바운드 규칙
3. 새 규칙 → 프로그램 → Git 경로 선택
4. 연결 허용

### 프록시 설정

회사 네트워크나 프록시를 사용하는 경우:

```cmd
REM Git 프록시 설정 (필요시)
git config --global http.proxy http://proxy-server:port
git config --global https.proxy https://proxy-server:port

REM 프록시 제거 (필요시)
git config --global --unset http.proxy
git config --global --unset https.proxy
```

---

**먼저 `test-github-connection.bat`를 실행하여 문제를 진단하세요!**

