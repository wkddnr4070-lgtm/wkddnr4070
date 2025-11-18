# 🔐 ngrok 인증 설정 가이드

## 📋 단계별 설정 방법

### 1단계: ngrok 계정 생성
1. **웹사이트 접속**: https://ngrok.com
2. **"Sign up" 클릭**
3. **이메일과 비밀번호 입력**
4. **계정 생성 완료**

### 2단계: 인증 토큰 확인
1. **로그인 후 대시보드 접속**
2. **"Getting Started" 섹션 찾기**
3. **"Your Authtoken" 복사**
   - 예시: `2abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567890`

### 3단계: 로컬에 인증 토큰 설정
```cmd
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

### 4단계: 설정 확인
```cmd
ngrok config check
```

## 🚀 사용 방법

### 인증 완료 후 터널 생성
```cmd
# 프론트엔드용 터널 (포트 3001)
ngrok http 3001
```

### 백엔드용 터널 (별도 터미널에서)
```cmd
# 백엔드용 터널 (포트 3001)
ngrok http 3001
```

## 📱 공용 URL 확인

ngrok 실행 후 다음과 같은 화면이 나타납니다:

```
ngrok                                                                                                                                                                                                                                                        

Session Status                online                                                                                                                                                                                                                          
Account                       your-email@example.com (Plan: Free)                                                                                                                                                                                              
Version                       3.24.0                                                                                                                                                                                                                           
Region                        United States (us)                                                                                                                                                                                                               
Latency                       45ms                                                                                                                                                                                                                              
Web Interface                 http://127.0.0.1:4040                                                                                                                                                                                                            
Forwarding                    https://abc123.ngrok.io -> http://localhost:3001                                                                                                                  
Forwarding                    https://def456.ngrok.io -> http://localhost:3001                                                                                                                  

Connections                   ttl     opn     rt1     rt5     p50     p90                                                                                                                                                                                      
                              0       0       0.00    0.00    0.00    0.00                                                                                                                                                                                     
```

**중요**: `Forwarding` 줄의 `https://` 주소를 복사해서 다른 사람에게 공유하세요!

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
ngrok http 3001 --region=us
```

### 연결 실패 시
- 방화벽 설정 확인
- 로컬 서버가 실행 중인지 확인
- 인터넷 연결 상태 확인
