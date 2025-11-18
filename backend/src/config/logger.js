import winston from 'winston'
import path from 'path'

// 로그 포맷 정의
const logFormat = winston.format.printf(({ level, message, timestamp, ...meta }) => {
  const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
  return `${timestamp} [${level.toUpperCase()}]: ${message} ${metaStr}`
})

// 로거 설정
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    logFormat
  ),
  transports: [
    // 콘솔 출력
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    
    // 파일 출력 (개발 환경에서 제외할 수 있음)
    new winston.transports.File({
      filename: path.resolve(process.cwd(), '../logs/app.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
})

// 개발 환경에서는 더 자세한 로그 출력
if (process.env.NODE_ENV === 'development') {
  logger.add(new winston.transports.File({
    filename: path.resolve(process.cwd(), '../logs/debug.log'),
    level: 'debug'
  }))
}

export default logger
