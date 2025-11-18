// 헬스 체크 스크립트
import { query } from '../src/config/database.js';
import config from '../src/config/index.js';
import logger from '../src/config/logger.js';

// 데이터베이스 헬스 체크
const checkDatabase = async () => {
  try {
    const result = await query('SELECT NOW() as current_time, version() as db_version');
    return {
      status: 'healthy',
      timestamp: result.rows[0].current_time,
      version: result.rows[0].db_version
    };
  } catch (error) {
    logger.error('데이터베이스 헬스 체크 실패', { error: error.message });
    return {
      status: 'unhealthy',
      error: error.message
    };
  }
};

// 메모리 사용량 체크
const checkMemory = () => {
  const usage = process.memoryUsage();
  return {
    rss: Math.round(usage.rss / 1024 / 1024) + ' MB',
    heapTotal: Math.round(usage.heapTotal / 1024 / 1024) + ' MB',
    heapUsed: Math.round(usage.heapUsed / 1024 / 1024) + ' MB',
    external: Math.round(usage.external / 1024 / 1024) + ' MB'
  };
};

// 전체 헬스 체크
const healthCheck = async () => {
  const startTime = Date.now();
  
  const dbHealth = await checkDatabase();
  const memoryUsage = checkMemory();
  
  const responseTime = Date.now() - startTime;
  
  const health = {
    status: dbHealth.status === 'healthy' ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    environment: config.env,
    version: '1.0.0',
    uptime: process.uptime(),
    responseTime: `${responseTime}ms`,
    database: dbHealth,
    memory: memoryUsage
  };
  
  return health;
};

// CLI 실행
if (import.meta.url === `file://${process.argv[1]}`) {
  healthCheck().then(result => {
    console.log('🏥 헬스 체크 결과:');
    console.log(JSON.stringify(result, null, 2));
    
    if (result.status === 'healthy') {
      process.exit(0);
    } else {
      process.exit(1);
    }
  }).catch(error => {
    console.error('❌ 헬스 체크 오류:', error.message);
    process.exit(1);
  });
}

export default healthCheck;
