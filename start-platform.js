#!/usr/bin/env node

/**
 * SHE 디지털트윈 플랫폼 자동 시작 스크립트
 * IDE에서 프로젝트를 열 때 자동으로 서버들을 시작합니다.
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 SHE 디지털트윈 플랫폼 자동 시작');
console.log('=====================================');

// 프로젝트 루트 디렉토리 확인
const projectRoot = __dirname;
console.log(`📁 프로젝트 루트: ${projectRoot}`);

// package.json 파일 존재 확인
const frontendPackageJson = path.join(projectRoot, 'package.json');
const backendPackageJson = path.join(projectRoot, 'backend', 'package.json');

if (!fs.existsSync(frontendPackageJson)) {
    console.error('❌ 프론트엔드 package.json을 찾을 수 없습니다.');
    process.exit(1);
}

if (!fs.existsSync(backendPackageJson)) {
    console.error('❌ 백엔드 package.json을 찾을 수 없습니다.');
    process.exit(1);
}

console.log('✅ 프로젝트 파일 확인 완료');

// 서버 시작 함수
function startServer(name, command, args, options = {}) {
    console.log(`\n🔄 ${name} 시작 중...`);

    const serverProcess = spawn(command, args, {
        cwd: options.cwd || projectRoot,
        stdio: 'pipe',
        shell: true,
        detached: false
    });

    serverProcess.stdout.on('data', (data) => {
        console.log(`[${name}] ${data.toString().trim()}`);
    });

    serverProcess.stderr.on('data', (data) => {
        console.error(`[${name} ERROR] ${data.toString().trim()}`);
    });

    serverProcess.on('close', (code) => {
        console.log(`[${name}] 프로세스 종료됨 (코드: ${code})`);
    });

    serverProcess.on('error', (error) => {
        console.error(`[${name}] 시작 실패:`, error.message);
    });

    return serverProcess;
}

// 프론트엔드 서버 시작
console.log('\n🌐 프론트엔드 서버 시작...');
const frontendServer = startServer(
    '프론트엔드',
    'npm',
    ['run', 'dev'],
    { cwd: projectRoot }
);

// 3초 후 백엔드 서버 시작
setTimeout(() => {
    console.log('\n🔧 백엔드 서버 시작...');
    const backendServer = startServer(
        '백엔드',
        'npm',
        ['start'],
        { cwd: path.join(projectRoot, 'backend') }
    );
}, 3000);

// 5초 후 브라우저 열기
setTimeout(() => {
    console.log('\n🌐 브라우저 열기...');
    const { exec } = require('child_process');
    exec('start http://localhost:3000', (error) => {
        if (error) {
            console.error('브라우저 열기 실패:', error.message);
        } else {
            console.log('✅ 브라우저가 열렸습니다!');
        }
    });
}, 5000);

console.log('\n========================================');
console.log('✅ 서버 시작 완료!');
console.log('========================================');
console.log('🌐 프론트엔드: http://localhost:3000');
console.log('🔧 백엔드: http://localhost:3001');
console.log('\n서버를 중지하려면 Ctrl+C를 누르세요.');
console.log('========================================');

// 프로세스 종료 시 정리
process.on('SIGINT', () => {
    console.log('\n🛑 서버 종료 중...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 서버 종료 중...');
    process.exit(0);
});

