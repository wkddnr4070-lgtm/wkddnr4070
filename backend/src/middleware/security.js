import rateLimit from 'express-rate-limit'
import helmet from 'helmet'

// 기본 보안 헤더
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    }
  },
  crossOriginEmbedderPolicy: false
})

// 요청 로거
export const requestLogger = (req, res, next) => {
  const startTime = Date.now()
  
  res.on('finish', () => {
    const duration = Date.now() - startTime
    const logMessage = `${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`
    
    if (res.statusCode >= 400) {
      console.warn(logMessage)
    } else {
      console.log(logMessage)
    }
  })
  
  next()
}

// 오류 로거
export const errorLogger = (err, req, res, next) => {
  console.error(`Error ${err.status || 500}: ${err.message}`)
  if (err.stack) {
    console.error(err.stack)
  }
  next(err)
}

// 일반적인 Rate Limiting
export const createRateLimit = () => {
  return rateLimit({
    windowMs: 15 * 60 * 1000, // 15분
    max: 100, // 최대 100 요청
    message: {
      success: false,
      message: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.'
    },
    standardHeaders: true,
    legacyHeaders: false
  })
}

// 로그인 전용 Rate Limiting (더 엄격)
export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 5, // 최대 5회 로그인 시도
  message: {
    success: false,
    message: '로그인 시도가 너무 많습니다. 15분 후 다시 시도해주세요.'
  },
  skipSuccessfulRequests: true // 성공한 요청은 카운트에서 제외
})

// IP 화이트리스트 미들웨어
export const ipWhitelist = (whitelist = []) => {
  if (whitelist.length === 0) {
    return (req, res, next) => next() // 화이트리스트가 없으면 통과
  }
  
  return (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress
    
    if (whitelist.includes(clientIP)) {
      next()
    } else {
      res.status(403).json({
        success: false,
        message: '접근이 거부되었습니다.'
      })
    }
  }
}

export default {
  securityHeaders,
  requestLogger,
  errorLogger,
  createRateLimit,
  loginRateLimit,
  ipWhitelist
}
