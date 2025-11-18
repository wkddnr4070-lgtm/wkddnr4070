// 환경별 설정 관리
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 환경별 설정 파일 로드
const env = process.env.NODE_ENV || 'development';
const envFile = `.env.${env}`;

dotenv.config({ path: path.join(__dirname, '..', envFile) });
dotenv.config(); // 기본 .env 파일도 로드

// 설정 객체
const config = {
  // 환경 설정
  env: env,
  isDevelopment: env === 'development',
  isProduction: env === 'production',
  isTest: env === 'test',

  // 서버 설정
  server: {
    port: parseInt(process.env.PORT) || 3001,
    host: process.env.HOST || 'localhost',
    apiPrefix: process.env.API_PREFIX || '/api/v1'
  },

  // 데이터베이스 설정
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    name: process.env.DB_NAME || 'gas_training_platform',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    ssl: env === 'production' ? { rejectUnauthorized: false } : false
  },

  // JWT 설정
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },

  // CORS 설정
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true
  },

  // Rate Limiting 설정
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
  },

  // 로깅 설정
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log'
  },

  // 보안 설정
  security: {
    sessionSecret: process.env.SESSION_SECRET || 'fallback-session-secret',
    encryptionKey: process.env.ENCRYPTION_KEY || 'fallback-encryption-key-32-chars'
  },

  // 파일 업로드 설정
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
    path: process.env.UPLOAD_PATH || 'uploads/'
  },

  // 이메일 설정
  email: {
    smtp: {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    from: process.env.SMTP_FROM || 'noreply@gas-training.local'
  },

  // 모니터링 설정
  monitoring: {
    enabled: process.env.ENABLE_METRICS === 'true',
    port: parseInt(process.env.METRICS_PORT) || 9090
  },

  // SSL 설정 (프로덕션)
  ssl: {
    certPath: process.env.SSL_CERT_PATH,
    keyPath: process.env.SSL_KEY_PATH
  }
};

// 설정 검증
const validateConfig = () => {
  const required = [
    'JWT_SECRET',
    'DB_PASSWORD'
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ 필수 환경 변수가 설정되지 않았습니다:', missing.join(', '));
    if (config.isProduction) {
      process.exit(1);
    } else {
      console.warn('⚠️ 개발 환경에서는 기본값을 사용합니다.');
    }
  }
};

// 설정 출력 (개발 환경에서만)
if (config.isDevelopment) {
  console.log('🔧 환경 설정:');
  console.log(`   환경: ${config.env}`);
  console.log(`   서버: ${config.server.host}:${config.server.port}`);
  console.log(`   데이터베이스: ${config.database.host}:${config.database.port}/${config.database.name}`);
  console.log(`   API 접두사: ${config.server.apiPrefix}`);
}

validateConfig();

export default config;
