# 🚀 ngrok 공용 접속 설정 (간단 버전)

## 📋 현재 상황
- ✅ 서버 실행 중: `http://localhost:3000`
- ✅ 네트워크 접속 가능: `http://172.20.10.3:3000`
- ❌ ngrok 설정 필요

## 🔧 설정 방법

### 1단계: ngrok 계정 생성
1. **웹사이트 접속**: https://ngrok.com
2. **"Sign up" 클릭**
3. **이메일과 비밀번호 입력**
4. **계정 생성 완료**

### 2단계: 인증 토큰 확인
1. **로그인 후 대시보드 접속**
2. **"Your Authtoken" 복사**
   - 예시: `2abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567890`

### 3단계: 로컬에 인증 토큰 설정
```cmd
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

### 4단계: 터널 생성
```cmd
ngrok http 3000
```

## 🎯 예상 결과

ngrok 실행 후 다음과 같은 화면이 나타납니다:

```
ngrok

Session Status                online
Account                       your-email@example.com (Plan: Free)
Version                       3.24.0
Region                        United States (us)
Latency                       45ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok.io -> http://localhost:3000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

**중요**: `Forwarding` 줄의 `https://abc123.ngrok.io` 주소를 복사해서 다른 사람에게 공유하세요!

## 📱 공유할 정보

### 접속 주소
```
https://abc123.ngrok.io
```

### 로그인 정보
- 사용자명: `dnrdl4070`
- 비밀번호: `@wlsghks12`

## ⚠️ 주의사항

### 무료 계정 제한
- 세션당 최대 8시간
- URL이 매번 변경됨
- 동시 터널 1개만 가능

### 보안
- HTTPS로 암호화됨
- ngrok 서버를 통해 트래픽 전달
- 로컬 서버는 안전함

## 🔧 문제 해결

### 인증 오류 시
```cmd
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

### 포트 충돌 시
```cmd
ngrok http 3000 --region=us
```

### 연결 실패 시
- 방화벽 설정 확인
- 로컬 서버가 실행 중인지 확인
- 인터넷 연결 상태 확인
