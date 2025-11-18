// 로깅 시스템
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 로그 레벨 정의
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

// 로그 색상 정의
const COLORS = {
  ERROR: '\x1b[31m', // 빨간색
  WARN: '\x1b[33m',  // 노란색
  INFO: '\x1b[36m',  // 청록색
  DEBUG: '\x1b[37m', // 흰색
  RESET: '\x1b[0m'   // 리셋
};

class Logger {
  constructor() {
    this.logLevel = LOG_LEVELS[config.logging.level.toUpperCase()] || LOG_LEVELS.INFO;
    this.logFile = path.join(__dirname, '..', '..', config.logging.file);
    
    // 로그 디렉토리 생성
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  // 로그 메시지 포맷팅
  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${level}: ${message}${metaStr}`;
  }

  // 콘솔에 로그 출력
  logToConsole(level, message, meta = {}) {
    if (LOG_LEVELS[level] <= this.logLevel) {
      const formattedMessage = this.formatMessage(level, message, meta);
      const color = COLORS[level] || COLORS.RESET;
      console.log(`${color}${formattedMessage}${COLORS.RESET}`);
    }
  }

  // 파일에 로그 출력
  logToFile(level, message, meta = {}) {
    if (LOG_LEVELS[level] <= this.logLevel) {
      const formattedMessage = this.formatMessage(level, message, meta);
      fs.appendFileSync(this.logFile, formattedMessage + '\n');
    }
  }

  // 로그 출력 (콘솔 + 파일)
  log(level, message, meta = {}) {
    this.logToConsole(level, message, meta);
    this.logToFile(level, message, meta);
  }

  // 각 레벨별 로그 메서드
  error(message, meta = {}) {
    this.log('ERROR', message, meta);
  }

  warn(message, meta = {}) {
    this.log('WARN', message, meta);
  }

  info(message, meta = {}) {
    this.log('INFO', message, meta);
  }

  debug(message, meta = {}) {
    this.log('DEBUG', message, meta);
  }

  // HTTP 요청 로깅
  logRequest(req, res, responseTime) {
    const meta = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      responseTime: `${responseTime}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress
    };

    if (res.statusCode >= 400) {
      this.error(`HTTP ${req.method} ${req.url}`, meta);
    } else {
      this.info(`HTTP ${req.method} ${req.url}`, meta);
    }
  }

  // 데이터베이스 쿼리 로깅
  logQuery(query, params, duration) {
    this.debug('Database Query', {
      query: query.substring(0, 200) + (query.length > 200 ? '...' : ''),
      params: params,
      duration: `${duration}ms`
    });
  }

  // 인증 관련 로깅
  logAuth(action, userId, success, meta = {}) {
    const level = success ? 'INFO' : 'WARN';
    this.log(level, `Auth ${action}`, {
      userId,
      success,
      ...meta
    });
  }
}

// 싱글톤 인스턴스 생성
const logger = new Logger();

export default logger;
