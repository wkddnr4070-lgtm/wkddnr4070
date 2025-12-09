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
    
    // AbortController를 사용한 타임아웃 구현
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)
    
    const config = {
      headers: this.getHeaders(),
      signal: controller.signal,
      ...options
    }

    try {
      console.log(`🌐 API 요청: ${options.method || 'GET'} ${url}`)
      
      const response = await fetch(url, config)
      clearTimeout(timeoutId)
      
      // 응답 본문 파싱 시도
      let data
      try {
        const text = await response.text()
        if (text) {
          data = JSON.parse(text)
        } else {
          data = {}
        }
      } catch (parseError) {
        console.warn(`⚠️ JSON 파싱 실패: ${url}`, parseError)
        data = { message: `서버 오류 (${response.status})` }
      }

      if (!response.ok) {
        const errorMessage = data.message || data.error || `HTTP ${response.status}`
        const error = new Error(errorMessage)
        error.status = response.status
        error.data = data
        throw error
      }

      console.log(`✅ API 응답: ${url}`, data)
      return data
    } catch (error) {
      clearTimeout(timeoutId)
      
      // AbortError는 타임아웃을 의미
      if (error.name === 'AbortError') {
        console.log(`⏱️ API 요청 타임아웃: ${url} (${this.timeout}ms)`)
        const timeoutError = new Error(`요청 시간 초과 (${this.timeout}ms)`)
        timeoutError.name = 'TimeoutError'
        throw timeoutError
      }
      
      // 백엔드 서버가 없는 환경에서는 조용히 처리
      if (error.message.includes('CONNECTION_REFUSED') || error.message.includes('Failed to fetch')) {
        console.log(`🔌 백엔드 서버 연결 실패: ${url}`)
      } else {
        // 상태 코드가 있는 경우 포함하여 로그
        const statusInfo = error.status ? ` (${error.status})` : ''
        console.error(`❌ API 오류${statusInfo}: ${url}`, error.message)
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
