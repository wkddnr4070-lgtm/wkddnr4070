import { spawnSync, spawn } from 'node:child_process';

const pocDir = 'smart-construction-poc';

console.log('🚀 Smart 공사관리 PoC 자동 실행을 시작합니다.');
console.log('1) 의존성 설치 확인 중...');

const install = spawnSync('npm', ['--prefix', pocDir, 'install'], {
  stdio: 'inherit',
  shell: true
});

if (install.status !== 0) {
  console.error('❌ 의존성 설치에 실패했습니다. 로그를 확인해 주세요.');
  process.exit(install.status ?? 1);
}

console.log('\n2) 개발 서버를 시작합니다...');
console.log('접속 주소:');
console.log('- http://localhost:3000');
console.log('- http://localhost:3000/status');
console.log('- http://localhost:3000/plans');
console.log('- http://localhost:3000/submissions');
console.log('- http://localhost:3000/access');

const dev = spawn('npm', ['--prefix', pocDir, 'run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

dev.on('exit', (code) => {
  process.exit(code ?? 0);
});
