// 데이터베이스 마이그레이션 스크립트
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query } from '../src/config/database.js';
import config from '../src/config/index.js';
import logger from '../src/config/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 마이그레이션 실행
const runMigration = async () => {
  try {
    logger.info('데이터베이스 마이그레이션 시작');
    
    // 스키마 파일 읽기
    const schemaPath = path.join(__dirname, '..', 'database_schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // 스키마 실행
    await query(schema);
    
    logger.info('데이터베이스 마이그레이션 완료');
    console.log('✅ 데이터베이스 스키마가 성공적으로 생성되었습니다.');
    
  } catch (error) {
    logger.error('마이그레이션 오류', { error: error.message });
    console.error('❌ 마이그레이션 중 오류 발생:', error.message);
    process.exit(1);
  }
};

// 연결 테스트
const testConnection = async () => {
  try {
    await query('SELECT NOW()');
    logger.info('데이터베이스 연결 테스트 성공');
    console.log('✅ 데이터베이스 연결이 정상입니다.');
    return true;
  } catch (error) {
    logger.error('데이터베이스 연결 테스트 실패', { error: error.message });
    console.error('❌ 데이터베이스 연결 실패:', error.message);
    return false;
  }
};

// 메인 실행
const main = async () => {
  console.log('🔧 데이터베이스 마이그레이션 도구');
  console.log(`환경: ${config.env}`);
  console.log(`데이터베이스: ${config.database.host}:${config.database.port}/${config.database.name}`);
  
  // 연결 테스트
  const isConnected = await testConnection();
  if (!isConnected) {
    process.exit(1);
  }
  
  // 마이그레이션 실행
  await runMigration();
  
  process.exit(0);
};

main();
