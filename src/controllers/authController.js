// 사용자 인증 컨트롤러
import bcrypt from 'bcryptjs';
import { query } from '../config/database.js';
import { generateToken } from '../middleware/auth.js';

// 사용자 로그인
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 입력 검증
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: '사용자명과 비밀번호를 입력해주세요.'
      });
    }

    // 사용자 조회
    const userResult = await query(
      `SELECT u.id, u.username, u.password_hash, u.email, u.is_active,
              e.name, e.position, e.contact,
              c.name as company_name, d.name as department_name, t.name as team_name
       FROM users u
       JOIN employees e ON u.employee_id = e.id
       JOIN teams t ON e.team_id = t.id
       JOIN departments d ON t.department_id = d.id
       JOIN companies c ON d.company_id = c.id
       WHERE u.username = $1`,
      [username]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: '잘못된 사용자명 또는 비밀번호입니다.'
      });
    }

    const user = userResult.rows[0];

    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: '비활성화된 계정입니다.'
      });
    }

    // 비밀번호 확인
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: '잘못된 사용자명 또는 비밀번호입니다.'
      });
    }

    // 사용자 역할 조회
    const roleResult = await query(
      `SELECT r.name, r.description, r.responsibilities, r.required_skills
       FROM roles r
       JOIN role_assignments ra ON r.id = ra.role_id
       WHERE ra.user_id = $1`,
      [user.id]
    );

    // JWT 토큰 생성
    const token = generateToken(user.id);

    // 로그인 시간 업데이트
    await query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // 응답 데이터 구성
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      position: user.position,
      contact: user.contact,
      company: user.company_name,
      department: user.department_name,
      team: user.team_name,
      roles: roleResult.rows
    };

    res.json({
      success: true,
      message: '로그인 성공',
      data: {
        user: userData,
        token: token
      }
    });

  } catch (error) {
    console.error('로그인 오류:', error);
    res.status(500).json({
      success: false,
      message: '로그인 중 오류가 발생했습니다.'
    });
  }
};

// 사용자 프로필 조회
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const userResult = await query(
      `SELECT u.id, u.username, u.email,
              e.name, e.position, e.contact,
              c.name as company_name, d.name as department_name, t.name as team_name
       FROM users u
       JOIN employees e ON u.employee_id = e.id
       JOIN teams t ON e.team_id = t.id
       JOIN departments d ON t.department_id = d.id
       JOIN companies c ON d.company_id = c.id
       WHERE u.id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '사용자를 찾을 수 없습니다.'
      });
    }

    const user = userResult.rows[0];

    // 사용자 역할 조회
    const roleResult = await query(
      `SELECT r.name, r.description, r.responsibilities, r.required_skills
       FROM roles r
       JOIN role_assignments ra ON r.id = ra.role_id
       WHERE ra.user_id = $1`,
      [userId]
    );

    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      position: user.position,
      contact: user.contact,
      company: user.company_name,
      department: user.department_name,
      team: user.team_name,
      roles: roleResult.rows
    };

    res.json({
      success: true,
      data: userData
    });

  } catch (error) {
    console.error('프로필 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '프로필 조회 중 오류가 발생했습니다.'
    });
  }
};

// 사용자 로그아웃
export const logout = async (req, res) => {
  try {
    // 클라이언트에서 토큰을 삭제하도록 안내
    res.json({
      success: true,
      message: '로그아웃 성공'
    });
  } catch (error) {
    console.error('로그아웃 오류:', error);
    res.status(500).json({
      success: false,
      message: '로그아웃 중 오류가 발생했습니다.'
    });
  }
};
