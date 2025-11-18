// API 통신을 위한 설정 파일
const API_CONFIG = {
  // 개발 환경
  development: {
    baseURL: 'http://localhost:3001/api/v1',
    timeout: 10000
  },
  // 프로덕션 환경
  production: {
    baseURL: 'https://your-domain.com/api/v1',
    timeout: 10000
  }
}

// 현재 환경에 따른 설정 선택
const config = API_CONFIG[import.meta.env.MODE] || API_CONFIG.development

// API 클라이언트 클래스
class ApiClient {
  constructor() {
    this.baseURL = config.baseURL
    this.timeout = config.timeout
    this.token = localStorage.getItem('authToken')
  }

  // 토큰 설정
  setToken(token) {
    this.token = token
    if (token) {
      localStorage.setItem('authToken', token)
    } else {
      localStorage.removeItem('authToken')
    }
  }

  // 기본 요청 헤더
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    }
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }
    
    return headers
  }

  // HTTP 요청 메서드
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: this.getHeaders(),
      timeout: this.timeout,
      ...options
    }

    try {
      console.log(`🌐 API 요청: ${options.method || 'GET'} ${url}`)
      
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`)
      }

      console.log(`✅ API 응답: ${url}`, data)
      return data
    } catch (error) {
      // 백엔드 서버가 없는 환경에서는 조용히 처리
      if (error.message.includes('CONNECTION_REFUSED') || error.message.includes('Failed to fetch')) {
        console.log(`🔌 백엔드 서버 연결 실패: ${url}`)
      } else {
        console.error(`❌ API 오류: ${url}`, error)
      }
      throw error
    }
  }

  // GET 요청
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' })
  }

  // POST 요청
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  // PUT 요청
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  // DELETE 요청
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' })
  }
}

// API 클라이언트 인스턴스 생성
const apiClient = new ApiClient()

export default apiClient
