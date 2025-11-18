// 인증 관련 라우트
import express from 'express';
import { login, getProfile, logout } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import { body } from 'express-validator';

const router = express.Router();

// 로그인
router.post('/login', [
  body('username').notEmpty().withMessage('사용자명을 입력해주세요.'),
  body('password').isLength({ min: 6 }).withMessage('비밀번호는 최소 6자 이상이어야 합니다.')
], login);

// 프로필 조회 (인증 필요)
router.get('/profile', authenticateToken, getProfile);

// 로그아웃
router.post('/logout', authenticateToken, logout);

export default router;
