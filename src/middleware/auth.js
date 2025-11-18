// JWT 인증 미들웨어
import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';

// JWT 토큰 검증 미들웨어
export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: '액세스 토큰이 필요합니다.' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 사용자 정보 확인
    const userResult = await query(
      'SELECT id, username, email, is_active FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: '유효하지 않은 토큰입니다.' 
      });
    }

    const user = userResult.rows[0];
    
    if (!user.is_active) {
      return res.status(401).json({ 
        success: false, 
        message: '비활성화된 계정입니다.' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('JWT 검증 오류:', error);
    return res.status(403).json({ 
      success: false, 
      message: '유효하지 않은 토큰입니다.' 
    });
  }
};

// 관리자 권한 확인 미들웨어
export const requireAdmin = async (req, res, next) => {
  try {
    const roleResult = await query(
      'SELECT r.name FROM roles r JOIN role_assignments ra ON r.id = ra.role_id WHERE ra.user_id = $1 AND r.name = $2',
      [req.user.id, '관제운영반장']
    );

    if (roleResult.rows.length === 0) {
      return res.status(403).json({ 
        success: false, 
        message: '관리자 권한이 필요합니다.' 
      });
    }

    next();
  } catch (error) {
    console.error('권한 확인 오류:', error);
    return res.status(500).json({ 
      success: false, 
      message: '권한 확인 중 오류가 발생했습니다.' 
    });
  }
};

// JWT 토큰 생성 함수
export const generateToken = (userId) => {
  return jwt.sign(
    { userId }, 
    process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};
