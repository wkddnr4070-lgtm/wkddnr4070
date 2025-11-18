// 메인 애플리케이션 파일
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

// 설정 및 미들웨어 임포트
import config from './config/index.js';
import logger from './config/logger.js';
import dbManager from './database/index.js';

// 데이터베이스 초기화
dbManager.initialize().catch(error => {
  logger.error('데이터베이스 초기화 실패', { error: error.message });
  console.error('❌ 데이터베이스 연결 실패:', error.message);
  process.exit(1);
});
import {
  securityHeaders,
  requestLogger,
  errorLogger,
  createRateLimit,
  loginRateLimit
} from './middleware/security.js';

// 라우트 임포트
import authRoutes from './routes/auth.js';
import organizationRoutes from './routes/organization.js';
import scenarioRoutes from './routes/scenarios.js';
import trainingRoutes from './routes/training.js';
import resultRoutes from './routes/results.js';

const app = express();

// 보안 미들웨어
app.use(securityHeaders);

// CORS 설정
app.use(cors(config.cors));

// 요청 로깅
app.use(morgan('combined'));
app.use(requestLogger);

// Rate Limiting
app.use(config.server.apiPrefix, createRateLimit());

// JSON 파싱
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 기본 라우트
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '도시가스 비상대응 모의훈련 플랫폼 API',
    version: '1.0.0',
    environment: config.env,
    timestamp: new Date().toISOString(),
    private: true
  });
});

// 헬스 체크 엔드포인트
app.get('/health', async (req, res) => {
  try {
    const dbHealth = await dbManager.healthCheck();
    res.status(dbHealth.status === 'healthy' ? 200 : 503).json({
      status: dbHealth.status,
      database: dbHealth,
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (error) {
    logger.error('헬스 체크 오류', { error: error.message });
    res.status(503).json({
      status: 'unhealthy',
      error: 'Health check failed',
      timestamp: new Date().toISOString()
    });
  }
});

// API 라우트
app.use(`${config.server.apiPrefix}/auth`, loginRateLimit, authRoutes);
app.use(`${config.server.apiPrefix}/organization`, organizationRoutes);
app.use(`${config.server.apiPrefix}/scenarios`, scenarioRoutes);
app.use(`${config.server.apiPrefix}/training`, trainingRoutes);
app.use(`${config.server.apiPrefix}/results`, resultRoutes);

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '요청한 리소스를 찾을 수 없습니다.',
    path: req.originalUrl
  });
});

// 에러 핸들러
app.use(errorLogger);
app.use((error, req, res, next) => {
  logger.error('서버 오류', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });

  res.status(error.status || 500).json({
    success: false,
    message: error.message || '서버 내부 오류가 발생했습니다.',
    ...(config.isDevelopment && { stack: error.stack })
  });
});

// 서버 시작
const server = app.listen(config.server.port, config.server.host, () => {
  logger.info('서버 시작', {
    port: config.server.port,
    host: config.server.host,
    environment: config.env,
    apiPrefix: config.server.apiPrefix
  });

  console.log(`🚀 서버가 포트 ${config.server.port}에서 실행 중입니다.`);
  console.log(`📡 API 엔드포인트: http://${config.server.host}:${config.server.port}${config.server.apiPrefix}`);
  console.log(`🌍 환경: ${config.env}`);
  console.log(`🔒 프라이빗 API 모드`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM 신호 수신, 서버 종료 중...');
  server.close(() => {
    logger.info('서버가 정상적으로 종료되었습니다.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT 신호 수신, 서버 종료 중...');
  server.close(() => {
    logger.info('서버가 정상적으로 종료되었습니다.');
    process.exit(0);
  });
});

export default app;
