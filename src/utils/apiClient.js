// API 통신을 위한 설정 파일
const getBaseURL = () => {
  // 환경 변수 우선 사용
  if (import.meta.env.VITE_API_URL) {
    console.log('🔧 VITE_API_URL 환경 변수 사용:', import.meta.env.VITE_API_URL)
    return import.meta.env.VITE_API_URL
  }
  
  // 환경별 기본 설정
  const API_CONFIG = {
    // 개발 환경
    development: {
      baseURL: 'http://localhost:3001/api',
      timeout: 10000
    },
    // 프로덕션 환경
    production: {
      baseURL: '/api', // 같은 도메인의 /api 사용
      timeout: 10000
    }
  }
  
  const config = API_CONFIG[import.meta.env.MODE] || API_CONFIG.development
  console.log('🔧 API 설정:', { mode: import.meta.env.MODE, baseURL: config.baseURL })
  return config.baseURL
}

const config = {
  baseURL: getBaseURL(),
  timeout: 10000
}

console.log('🔧 최종 API 설정:', config)

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
    try {
      const headers = {
        'Content-Type': 'application/json'
      }
      
      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`
      }
      
      return headers
    } catch (error) {
      console.error('❌ getHeaders 오류:', error)
      return {
        'Content-Type': 'application/json'
      }
    }
  }

  // HTTP 요청 메서드
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    
    // AbortController를 사용한 타임아웃 구현
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)
    
    // 안전한 헤더 처리
    const headers = this.getHeaders() || {}
    
    const config = {
      headers,
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