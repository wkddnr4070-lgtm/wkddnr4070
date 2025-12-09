import express from 'express'
import AuthController from '../controllers/authController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// 회원가입
router.post('/register', AuthController.register)

// 로그인
router.post('/login', AuthController.login)

// 프로필 조회 (인증 필요)
router.get('/profile', authenticateToken, AuthController.getProfile)

// 로그아웃
router.post('/logout', AuthController.logout)

// 토큰 갱신
router.post('/refresh', AuthController.refreshToken)

export default router
