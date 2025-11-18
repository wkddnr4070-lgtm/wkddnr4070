// JWT 인증 미들웨어
import jwt from 'jsonwebtoken'
import config from '../config/index.js'
import logger from '../config/logger.js'

const authenticateToken = (req, res, next) => {
  try {
    // Authorization 헤더에서 토큰 추출
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message�: '액세스 토큰이 필요합니다'
      })
    }

    // 토큰 검증
    jwt.verify(token, config.auth.jwtSecret, (error并 decoded) => {
      if (error) {
        logger.warn('토큰 검증 실패', { 
          token: token.substring(0, 20) + '...',
          error: error.message 
        })
        
        if (error.name === 'TokenExpiredError') {
          return res.status(401).json({
            success: false,
            message: '토큰이 만료되었습니다'
          })
        } else if (error.name === 'JsonWebTokenError') {
          return res.status(401).json({
            success: false,
            message: '유효하지 않은 토큰입니다'
          })
        } else {
          return res.status(401).json({
            success: false,
            message: '토큰 검증 실패'
          })
        }
      }

      // 디코딩된 토큰 정보를 요청 객체에 추가
      req.user = decoded
      next()
    })
  } catch (error) {
    logger.error('인증 미들웨어 오류', { error: error.message })
    res.status(500).json({
      success: false,
      message: '서버 오류'
    })
  }
}

// 선택적 인증 (토큰이 없어도 허용하되, 있으면 검증)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    // 토큰이 없으면 사용자 정보 없이 진행
    req.user = null
    return next()
  }

  // 토큰이 있으면 검증
  jwt.verify(token, config.auth.jwtSecret, (error, decoded) => {
    if (error) {
      // 토큰이 유효하지 않아도 진행 (선택적)
      req.user = null
    } else {
      req.user = decoded
    }
    next()
  })
}

// 특정 역할 권한 확인
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '인증이 필요합니다'
      })
    }

    // 역할 확인 로직 (현재는 간단히 position으로 확인)
    const userRole = req.user.position?.toLowerCase()
    const requiredRoles = roles.map(role => role.toLowerCase())

    if (!requiredRoles.includes(userRole)) {
      logger.warn('권한 부족', { 
        userId: req.user.userId, 
        userRole, 
        requiredRoles 
      })
      
      return res.status(403).json({
        success: false,
        message: '해당 기능에 대한 권한이 없습니다'
      })
    }

    next()
  }
}

// 회사별 접근 제한
const requireCompany = (...companies) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '인증이 필요합니다'
      })
    }

    const userCompany = req.user.company
    const allowedCompanies = companies

    if (!allowedCompanies.includes(userCompany)) {
      logger.warn('회사 접근 제한', { 
        userId: req.user.userId, 
        userCompany, 
        allowedCompanies 
      })
      
      return res.status(403).json({
        success: false,
        message: '해당 회사의 데이터에 접근할 권한이 없습니다'
      })
    }

    next()
  }
}

export { authenticateToken, optionalAuth, requireRole, requireCompany }
