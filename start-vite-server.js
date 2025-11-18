const { spawn } = require('child_process');
const path = require('path');

console.log('========================================');
console.log('Vite 개발 서버 시작');
console.log('========================================');
console.log('현재 디렉토리:', __dirname);

// npm run dev 실행
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const child = spawn(npm, ['run', 'dev'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

child.on('error', (error) => {
  console.error('서버 시작 실패:', error.message);
});

child.on('exit', (code) => {
  console.log(`서버가 종료되었습니다. 종료 코드: ${code}`);
});

