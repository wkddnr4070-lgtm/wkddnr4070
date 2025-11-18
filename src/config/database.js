// 데이터베이스 연결 설정
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// 데이터베이스 연결 풀 생성
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'gas_training_platform',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  max: 20, // 최대 연결 수
  idleTimeoutMillis: 30000, // 유휴 연결 타임아웃
  connectionTimeoutMillis: 2000, // 연결 타임아웃
});

// 연결 테스트
pool.on('connect', () => {
  console.log('✅ 데이터베이스에 연결되었습니다.');
});

pool.on('error', (err) => {
  console.error('❌ 데이터베이스 연결 오류:', err);
});

// 쿼리 실행 함수
export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('📊 쿼리 실행 시간:', duration + 'ms');
    return res;
  } catch (error) {
    console.error('❌ 쿼리 실행 오류:', error);
    throw error;
  }
};

// 트랜잭션 실행 함수
export const getClient = async () => {
  return await pool.connect();
};

export default pool;
