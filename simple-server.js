const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  console.log(`요청: ${req.method} ${req.url}`);
  
  // 기본 HTML 응답
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
  });
  
  const html = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🚀 SHE 플랫폼 연결 성공!</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                min-height: 100vh;
            }
            .container {
                background: rgba(255, 255, 255, 0.1);
                padding: 30px;
                border-radius: 15px;
                backdrop-filter: blur(10px);
                text-align: center;
            }
            .success {
                background: #4CAF50;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                font-size: 18px;
                font-weight: bold;
            }
            .info {
                background: rgba(255, 255, 255, 0.1);
                padding: 15px;
                border-radius: 8px;
                margin: 20px 0;
                text-align: left;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🎉 연결 성공!</h1>
            <div class="success">
                ✅ Node.js HTTP 서버가 정상 작동합니다!
            </div>
            
            <div class="info">
                <h3>📊 서버 정보:</h3>
                <ul>
                    <li><strong>포트:</strong> 5173</li>
                    <li><strong>시간:</strong> ${new Date().toLocaleString('ko-KR')}</li>
                    <li><strong>상태:</strong> 연결됨</li>
                </ul>
            </div>

            <div class="info">
                <h3>🎯 다음 단계:</h3>
                <ol>
                    <li>✅ 기본 서버 연결 확인</li>
                    <li>🔄 React 앱 문제 해결</li>
                    <li>🚀 전체 플랫폼 복구</li>
                </ol>
            </div>

            <p style="margin-top: 30px; font-size: 14px; opacity: 0.8;">
                SHE 디지털트윈 플랫폼 © 2024
            </p>
        </div>
    </body>
    </html>
  `;
  
  res.end(html);
});

const PORT = 5173;
const HOST = 'localhost';

server.listen(PORT, HOST, () => {
  console.log(`🚀 서버가 시작되었습니다!`);
  console.log(`📍 접속 주소: http://${HOST}:${PORT}`);
  console.log(`⏰ 시작 시간: ${new Date().toLocaleString('ko-KR')}`);
  console.log(`📊 상태: 대기 중...`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`❌ 포트 ${PORT}가 이미 사용 중입니다.`);
    console.log(`🔄 다른 포트로 시도해보세요.`);
  } else {
    console.log(`❌ 서버 오류: ${err.message}`);
  }
});

server.on('connection', (socket) => {
  console.log(`🔗 새로운 연결: ${socket.remoteAddress}:${socket.remotePort}`);
});

console.log('서버를 시작하는 중...');
