// 백그라운드에서 서버를 실행하는 Node.js 스크립트
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 SHE 디지털트윈 백그라운드 서버 시작');
console.log('=====================================');

// 프로세스를 백그라운드에서 실행하는 함수
function startBackgroundProcess(command, args, options, name) {
    const process = spawn(command, args, {
        ...options,
        detached: true,  // 부모 프로세스와 분리
        stdio: 'ignore'  // 입출력 무시 (백그라운드)
    });

    // 부모 프로세스와 완전히 분리
    process.unref();

    console.log(`✅ ${name} 백그라운드에서 시작됨 (PID: ${process.pid})`);
    return process;
}

// 프론트엔드 서버 백그라운드 시작
console.log('🌐 프론트엔드 서버 백그라운드 시작...');
const frontend = startBackgroundProcess('npm', ['run', 'dev'], {
    cwd: __dirname
}, '프론트엔드 서버');

// 3초 후 백엔드 서버 시작
setTimeout(() => {
    console.log('🔧 백엔드 서버 백그라운드 시작...');
    const backend = startBackgroundProcess('npm', ['start'], {
        cwd: path.join(__dirname, 'backend')
    }, '백엔드 서버');
}, 3000);

console.log('\n========================================');
console.log('백그라운드 서버 시작 완료!');
console.log('========================================');
console.log('🌐 프론트엔드: http://localhost:3000');
console.log('🔧 백엔드: http://localhost:3001');
console.log('\n📊 서버 상태 확인: 작업 관리자에서 "node.exe" 프로세스');
console.log('🛑 서버 중지: 작업 관리자에서 "node.exe" 프로세스 종료');
console.log('\n이 스크립트를 종료해도 서버는 계속 실행됩니다.');

// 5초 후 브라우저 열기
setTimeout(() => {
    console.log('\n🌐 브라우저를 엽니다...');
    require('child_process').exec('start http://localhost:3000');
}, 5000);

// 10초 후 이 스크립트 종료
setTimeout(() => {
    console.log('\n✅ 백그라운드 서버 설정 완료. 스크립트를 종료합니다.');
    process.exit(0);
}, 10000);

