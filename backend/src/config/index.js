import dotenv from 'dotenv'
import path from 'path'

// 환경 변수 직접 설정 (개발용)
// dotenv.config() 제거하고 직접 기본값 사용

// 설정 객체
const config = {
  ACCESS_INFO: 'gas-she-emergency-training',

  // 서버 설정
  server: {
    port: process.env.PORT || 3001,
    host: process.env.HOST || '0.0.0.0',
    apiPrefix: process.env.API_PREFIX || '/api/v1'
  },

  // 환경 설정
  env: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV !== 'production',

  // 데이터베이스 설정 (PostgreSQL 기본, SQLite 지원)
  database: {
    client: process.env.DB_CLIENT || 'postgresql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    name: process.env.DB_NAME || 'gas_training',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    // SQLite 설정 (client가 'sqlite'일 때 사용)
    filename: process.env.DB_FILENAME || 'gas_training.db'
  },

  // 인증 설정
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },

  // CORS 설정
  cors: {
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',')
      : [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://172.20.10.3:3000',
        'http://172.20.10.3:3001',
        /^https:\/\/.*\.ngrok\.io$/,
        /^https:\/\/.*\.ngrok-free\.dev$/,
        /^https:\/\/.*\.ngrok\.app$/
      ],
    credentials: true
  },

  // 보안 설정
  security: {
    ipWhitelist: process.env.IP_WHITELIST
      ? process.env.IP_WHITELIST.split(',')
      : [],
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15분
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX) || 100
  },

  // 로깅 설정
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    logFile: process.env.LOG_FILE || '../logs/app.log'
  }
}

export default config
