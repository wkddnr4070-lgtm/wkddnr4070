// 인증 관련 API 함수들
import apiClient from '../utils/apiClient.js'

// 로그인 API
export const loginAPI = async (username, password) => {
  try {
    const response = await apiClient.post('/auth/login', {
      username,
      password
    })
    
    if (response.success && response.data.token) {
      // 토큰 저장
      apiClient.setToken(response.data.token)
    }
    
    return response.data
  } catch (error) {
    // 백엔드 서버가 없는 환경에서는 오류를 조용히 처리
    if (error.message.includes('CONNECTION_REFUSED') || error.message.includes('Failed to fetch')) {
      console.log('🔌 백엔드 서버가 없습니다. 모의 로그인으로 진행합니다.')
    } else {
      console.error('로그인 오류:', error)
    }
    throw error
  }
}

// 프로필 조회 API
export const getProfileAPI = async () => {
  try {
    const response = await apiClient.get('/auth/profile')
    return response.data
  } catch (error) {
    console.error('프로필 조회 오류:', error)
    throw error
  }
}

// 로그아웃 API
export const logoutAPI = async () => {
  try {
    await apiClient.post('/auth/logout')
    // 토큰 제거
    apiClient.setToken(null)
    return true
  } catch (error) {
    console.error('로그아웃 오류:', error)
    // 오류가 발생해도 토큰은 제거
    apiClient.setToken(null)
    return true
  }
}

// 토큰 유효성 검사
export const validateToken = () => {
  const token = localStorage.getItem('authToken')
  if (!token) {
    return false
  }
  
  try {
    // JWT 토큰의 만료 시간 확인 (간단한 방법)
    const payload = JSON.parse(atob(token.split('.')[1]))
    const currentTime = Date.now() / 1000
    
    if (payload.exp && payload.exp < currentTime) {
      // 토큰 만료
      apiClient.setToken(null)
      return false
    }
    
    return true
  } catch (error) {
    console.error('토큰 검증 오류:', error)
    apiClient.setToken(null)
    return false
  }
}

// 인증 상태 확인
export const checkAuthStatus = async () => {
  if (!validateToken()) {
    return false
  }
  
  try {
    await getProfileAPI()
    return true
  } catch (error) {
    console.error('인증 상태 확인 오류:', error)
    return false
  }
}
