// 보안 강화 미들웨어
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import config from '../config/index.js';
import logger from '../config/logger.js';

// IP 화이트리스트 (프라이빗 API용)
const ALLOWED_IPS = [
  '127.0.0.1',
  '::1',
  'localhost',
  // 필요시 추가 IP 주소들
];

// IP 검증 미들웨어
export const ipWhitelist = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
  
  // 개발 환경에서는 모든 IP 허용
  if (config.isDevelopment) {
    return next();
  }

  // 프로덕션 환경에서는 화이트리스트 확인
  if (ALLOWED_IPS.includes(clientIP)) {
    logger.debug(`허용된 IP에서 접근: ${clientIP}`);
    next();
  } else {
    logger.warn(`차단된 IP에서 접근 시도: ${clientIP}`);
    res.status(403).json({
      success: false,
      message: '접근이 허용되지 않은 IP 주소입니다.'
    });
  }
};

// API 키 인증 미들웨어 (선택사항)
export const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  // 개발 환경에서는 API 키 검증 생략
  if (config.isDevelopment) {
    return next();
  }

  // 프로덕션 환경에서 API 키 검증
  if (!apiKey) {
    logger.warn('API 키가 제공되지 않음', { ip: req.ip });
    return res.status(401).json({
      success: false,
      message: 'API 키가 필요합니다.'
    });
  }

  // 실제 API 키 검증 로직 (환경 변수에서 관리)
  const validApiKey = process.env.API_KEY;
  if (apiKey !== validApiKey) {
    logger.warn('유효하지 않은 API 키', { ip: req.ip, providedKey: apiKey });
    return res.status(401).json({
      success: false,
      message: '유효하지 않은 API 키입니다.'
    });
  }

  next();
};

// 요청 크기 제한
export const requestSizeLimit = (req, res, next) => {
  const contentLength = parseInt(req.get('content-length') || '0');
  const maxSize = config.upload.maxFileSize;

  if (contentLength > maxSize) {
    logger.warn('요청 크기 초과', { 
      contentLength, 
      maxSize, 
      ip: req.ip 
    });
    return res.status(413).json({
      success: false,
      message: '요청 크기가 너무 큽니다.'
    });
  }

  next();
};

// 요청 빈도 제한 (환경별 다른 설정)
export const createRateLimit = () => {
  return rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    message: {
      success: false,
      message: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn('Rate limit 초과', { 
        ip: req.ip, 
        userAgent: req.get('User-Agent') 
      });
      res.status(429).json({
        success: false,
        message: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.'
      });
    }
  });
};

// 로그인 시도 제한
export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 5, // 최대 5번 시도
  message: {
    success: false,
    message: '로그인 시도가 너무 많습니다. 15분 후 다시 시도해주세요.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('로그인 Rate limit 초과', { 
      ip: req.ip,
      username: req.body.username 
    });
    res.status(429).json({
      success: false,
      message: '로그인 시도가 너무 많습니다. 15분 후 다시 시도해주세요.'
    });
  }
});

// Helmet 보안 설정
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: "same-origin" }
});

// 요청 로깅 미들웨어
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.logRequest(req, res, duration);
  });
  
  next();
};

// 에러 로깅 미들웨어
export const errorLogger = (error, req, res, next) => {
  logger.error('서버 오류', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  next(error);
};
