// Node.js로 직접 서버 시작하는 스크립트
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 SHE 디지털트윈 플랫폼 서버 시작');
console.log('=====================================');

// 현재 디렉토리 확인
console.log('📁 현재 디렉토리:', __dirname);

// 프론트엔드 서버 시작
console.log('\n🌐 프론트엔드 서버 시작 중...');
const frontend = spawn('npm', ['run', 'dev'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
});

frontend.on('error', (error) => {
    console.error('❌ 프론트엔드 서버 시작 실패:', error.message);
});

// 3초 후 백엔드 서버 시작
setTimeout(() => {
    console.log('\n🔧 백엔드 서버 시작 중...');
    const backend = spawn('npm', ['start'], {
        cwd: path.join(__dirname, 'backend'),
        stdio: 'inherit',
        shell: true
    });

    backend.on('error', (error) => {
        console.error('❌ 백엔드 서버 시작 실패:', error.message);
    });
}, 3000);

console.log('\n✅ 서버 시작 명령 실행됨');
console.log('🌐 프론트엔드: http://localhost:3000');
console.log('🔧 백엔드: http://localhost:3001');
console.log('\n서버를 중지하려면 Ctrl+C를 누르세요.');

