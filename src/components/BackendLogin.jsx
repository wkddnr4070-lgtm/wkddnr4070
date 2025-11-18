// 백엔드 API를 사용하는 새로운 로그인 컴포넌트
import React, { useState, useEffect } from 'react'
import { Building, Users, User, CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import { loginAPI, getProfileAPI, checkAuthStatus } from '../services/authService.js'

const BackendLogin = ({ onLoginSuccess }) => {
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  // 컴포넌트 마운트 시 인증 상태 확인
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = await checkAuthStatus()
        if (isAuthenticated) {
          // 이미 로그인된 상태라면 프로필 정보 가져오기
          const profile = await getProfileAPI()
          onLoginSuccess(profile)
        }
      } catch (error) {
        console.log('인증 상태 확인 실패:', error.message)
      } finally {
        setIsCheckingAuth(false)
      }
    }

    checkAuth()
  }, [onLoginSuccess])

  // 로그인 처리
  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // 백엔드 API가 활성화되어 있는지 확인
      const hasBackendServer = await fetch('http://localhost:3001/health', { 
        method: 'GET',
        signal: AbortSignal.timeout(1000) // 1초 타임아웃
      }).then(() => true).catch(() => false)

      if (hasBackendServer) {
        // 백엔드 서버가 있는 경우 API 호출
        const loginResult = await loginAPI(loginData.username, loginData.password)
        const userFromAPI = loginResult.user || {
          id: 1,
          name: loginData.username,
          company: '테스트 회사',
          department: '개발팀',
          position: '개발자'
        }
        onLoginSuccess(userFromAPI)
        console.log('✅ 백엔드 로그인 성공:', userFromAPI)
      } else {
        throw new Error('백엔드 서버 연결 없음')
      }
    } catch (error) {
      // 백엔드가 없으면 모의 로그인으로 진행
      const mockUser = {
        id: 1,
        name: loginData.username,
        company: '테스트 회사',
        department: '개발팀',
        position: '개발자'
      }
      
      onLoginSuccess(mockUser)
      console.log('✅ 모의 로그인 성공:', mockUser)
    } finally {
      setIsLoading(false)
    }
  }

  // 입력값 변경
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }))
    // 에러 메시지 초기화
    if (error) setError('')
  }

  // 로딩 중이면 로딩 화면 표시
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-gray-600">인증 상태를 확인하는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center relative">
      {/* 좌측 상단 로고 */}
      <div className="absolute top-6 left-6">
        <img 
          src="/sk-innovation-logo.png" 
          alt="SK 이노베이션 E&S" 
          className="h-12 object-contain"
          onError={(e) => {
            // 로고 파일이 없을 경우 기본 아이콘 표시
            e.target.style.display = 'none'
            if (e.target.nextSibling) {
              e.target.nextSibling.style.display = 'flex'
            }
          }}
        />
        <div className="hidden items-center gap-2">
          <Building className="h-8 w-8 text-primary-600" />
          <span className="text-lg font-bold text-primary-600">SK 이노베이션 E&S</span>
        </div>
      </div>

      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            도시가스 비상대응 모의훈련 플랫폼
          </h1>
          <p className="text-gray-600">백엔드 API 연결된 로그인</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* 사용자명 입력 */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              사용자명
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={loginData.username}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="사용자명을 입력하세요"
              required
            />
          </div>

          {/* 비밀번호 입력 */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={loginData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>로그인 중...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>로그인</span>
              </>
            )}
          </button>
        </form>

        {/* 개발자 정보 */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-2">개발자용 테스트 계정</h3>
          <div className="text-xs text-blue-700 space-y-1">
            <p><strong>사용자명:</strong> dnrdl4070</p>
            <p><strong>비밀번호:</strong> @wlsghks12</p>
            <p className="text-blue-600 mt-2">
              ※ 실제 데이터베이스에 테스트 계정이 생성되어야 합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BackendLogin
