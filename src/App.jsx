import React, { createContext, useContext, useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import LoginPage from './components/LoginPage'
import Register from './components/Register'
import BackendLogin from './components/BackendLogin'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import OrganizationManagement from './components/OrganizationManagement'
import ScenarioTraining from './components/ScenarioTraining'
import AdvancedTrainingEngine from './components/AdvancedTrainingEngine'
import TeamManagement from './components/TeamManagement'
import TeamTrainingEngine from './components/TeamTrainingEngine'
import UserProfile from './components/UserProfile'
import TrainingManagement from './components/TrainingManagement'
import EvaluationReport from './components/EvaluationReport'
import RoleAssignment from './components/RoleAssignment'
import EmergencyMap from './components/EmergencyMap'
import apiClient from './utils/apiClient'
import { detailedScenarios } from './data/trainingScenarios'

// Context 생성
const AppContext = createContext()

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }
  return context
}

function App() {
  // 상태 관리
  const [scenarios, setScenarios] = useState([])
  const [trainingHistory, setTrainingHistory] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [companyOrganizations, setCompanyOrganizations] = useState({})
  const [roleAssignments, setRoleAssignments] = useState({})

  // 인증 상태 확인 및 초기화
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('authToken')
        if (token) {
          apiClient.setToken(token)
          // 토큰이 있으면 인증된 것으로 간주 (프로필 조회는 선택적)
          setIsAuthenticated(true)
          
          // 프로필 조회 시도 (apiClient의 타임아웃 사용)
          try {
            const response = await apiClient.get('/auth/profile')
            if (response && response.success && response.data && response.data.user) {
              setCurrentUser(response.data.user)
              localStorage.setItem('currentUser', JSON.stringify(response.data.user))
              console.log('✅ 인증 상태 복구:', response.data.user)
            }
          } catch (error) {
            // 프로필 조회 실패해도 토큰이 있으면 인증 상태 유지
            console.log('⚠️ 프로필 조회 실패, 토큰 기반 인증 유지:', error.message)
            // 로컬 스토리지에서 사용자 정보 복구 시도
            const savedUser = localStorage.getItem('currentUser')
            if (savedUser) {
              try {
                setCurrentUser(JSON.parse(savedUser))
              } catch (e) {
                console.warn('사용자 정보 파싱 실패')
              }
            }
          }
        } else {
          // 토큰이 없으면 비인증 상태로 설정
          setIsAuthenticated(false)
          console.log('ℹ️ 토큰 없음, 비인증 상태')
        }
      } catch (error) {
        console.error('인증 초기화 오류:', error)
        // 오류 발생 시에도 로딩 해제
        setIsAuthenticated(false)
      } finally {
        // 항상 로딩 해제
        setIsLoading(false)
        console.log('✅ 인증 초기화 완료, 로딩 해제')
      }
    }

    initializeAuth()
  }, [])

  // 기본 시나리오 데이터 설정 (11/27 이전 상태 복구)
  const setDefaultScenarios = () => {
    // detailedScenarios에서 직접 시나리오 목록 생성
    const defaultScenarios = Object.keys(detailedScenarios).map(id => {
      const scenario = detailedScenarios[parseInt(id)]
      return {
        id: parseInt(id),
        title: scenario.title,
        description: scenario.description,
        duration: scenario.duration,
        difficulty: scenario.severity === 'high' ? 'high' : scenario.severity === 'medium' ? 'medium' : 'low',
        status: 'active',
        type: scenario.type,
        estimatedTime: scenario.duration
      }
    })
    
    if (defaultScenarios.length > 0) {
      setScenarios(defaultScenarios)
      console.log('✅ 기본 시나리오 데이터 설정 완료 (11/27 이전 상태):', defaultScenarios)
    }
  }

  // 백엔드 데이터 로드 (인증된 경우에만)
  useEffect(() => {
    // 기본 시나리오 먼저 설정 (11/27 이전 상태)
    setDefaultScenarios()
    
    if (isAuthenticated && currentUser) {
      loadBackendData()
    }
    // 비인증 상태에서는 기본 데이터 유지 (이미 설정됨)

    // 훈련 히스토리 로컬 스토리지에서 로드
    const savedHistory = localStorage.getItem('trainingHistory')
    if (savedHistory) {
      try {
        setTrainingHistory(JSON.parse(savedHistory))
      } catch (error) {
        console.error('훈련 히스토리 로드 실패:', error)
      }
    }
  }, [isAuthenticated, currentUser])

  // 조직 데이터 로드 (11/27 이전 상태 복구)
  useEffect(() => {
    // 기본 조직 데이터 즉시 설정 (11/27 이전 구조)
    setDefaultOrganizationData()
    
    // 백엔드에서 조직 데이터 로드 시도 (있으면 덮어쓰기)
    loadOrganizationData()
  }, [])
  
  const loadOrganizationData = async () => {
    try {
      // 백엔드에서 조직 데이터 로드 시도
      const response = await apiClient.get('/organization/companies')
      if (response.success && response.data && response.data.length > 0) {
        // 백엔드 API 응답을 companyOrganizations 구조로 변환
        // TODO: 실제 API 응답 구조에 맞게 변환 로직 구현
        // 현재는 기본 데이터 유지
      }
    } catch (error) {
      console.log('조직 데이터 로드 실패, 기본 구조 사용:', error.message)
      // 기본 조직 구조는 이미 설정됨
    }
  }
  
  // 기본 조직 데이터 설정 (11/27 이전 구조: 대표이사 → 실 → 조직)
  const setDefaultOrganizationData = () => {
    const defaultOrgs = {
      'SK E&S': {
        '대표이사': {
          '경영지원실': {
            '인사팀': ['김민수 (팀장)', '이영희 (차장)', '박철수 (과장)', '최지은 (대리)'],
            '재무팀': ['장호영 (팀장)', '신미경 (차장)', '오성민 (과장)'],
            '총무팀': ['윤태진 (팀장)', '한소희 (차장)']
          },
          '재무전략실': {
            '재무관리팀': ['임성호 (팀장)', '정다은 (차장)', '강민준 (과장)'],
            '투자기획팀': ['조현우 (팀장)', '배수진 (차장)']
          },
          '사업운영실': {
            '운영관리팀': ['송지훈 (팀장)', '이수빈 (차장)', '김도현 (과장)'],
            '고객서비스팀': ['홍길동 (팀장)', '김영수 (차장)', '이미영 (과장)']
          }
        }
      },
      '코원에너지서비스': {
        '대표이사': {
          '경영지원실': {
            '인사팀': ['박민수 (팀장)', '최영희 (차장)'],
            '재무팀': ['이호영 (팀장)', '김미경 (차장)']
          },
          '사업운영실': {
            '운영관리팀': ['정지훈 (팀장)', '박수빈 (차장)']
          }
        }
      },
      '충청에너지서비스': {
        '대표이사': {
          '경영지원실': {
            '인사팀': ['강민수 (팀장)', '윤영희 (차장)'],
            '재무팀': ['임호영 (팀장)', '한미경 (차장)']
          }
        }
      },
      '부산도시가스': {
        '대표이사': {
          '경영지원실': {
            '인사팀': ['조민수 (팀장)', '송영희 (차장)'],
            '재무팀': ['배호영 (팀장)', '홍미경 (차장)']
          }
        }
      },
      '영남에너지서비스(구미)': {
        '대표이사': {
          '경영지원실': {
            '인사팀': ['오민수 (팀장)', '윤영희 (차장)']
          }
        }
      },
      '영남에너지서비스(포항)': {
        '대표이사': {
          '경영지원실': {
            '인사팀': ['신민수 (팀장)', '강영희 (차장)']
          }
        }
      },
      '전북에너지서비스': {
        '대표이사': {
          '경영지원실': {
            '인사팀': ['유민수 (팀장)', '임영희 (차장)']
          }
        }
      },
      '전남도시가스': {
        '대표이사': {
          '경영지원실': {
            '인사팀': ['서민수 (팀장)', '조영희 (차장)']
          }
        }
      },
      '강원도시가스': {
        '대표이사': {
          '경영지원실': {
            '인사팀': ['문민수 (팀장)', '양영희 (차장)']
          }
        }
      }
    }
    setCompanyOrganizations(defaultOrgs)
    console.log('✅ 기본 조직 데이터 설정 완료')
  }
  
  // 백엔드 데이터 로드 함수
  const loadBackendData = async () => {
    try {
      console.log('🔄 백엔드 데이터 로딩 중...')
      
      // 시나리오 데이터 가져오기
      const scenarioResponse = await apiClient.get('/scenarios')
      if (scenarioResponse.success && scenarioResponse.data?.length > 0) {
        setScenarios(scenarioResponse.data.map(scenario => ({
          id: scenario.id,
          title: scenario.title,
          description: scenario.description,
          duration: scenario.duration,
          difficulty: scenario.difficulty,
          status: scenario.status
        })))
        console.log('✅ 백엔드 시나리오 데이터 로드 완료')
      } else {
        // 백엔드 데이터가 없으면 기본 시나리오 유지 (11/27 이전 상태)
        console.log('⚠️ 백엔드 시나리오 데이터 없음, 기본 데이터 유지')
        setDefaultScenarios()
      }

      // 훈련 기록 데이터 가져오기
      const trainingResponse = await apiClient.get('/training')
      if (trainingResponse.success && trainingResponse.data?.length > 0) {
        setTrainingHistory(trainingResponse.data)
        console.log('✅ 백엔드 훈련 기록 데이터 로드 완료')
      }
      
      console.log('✅ 백엔드 데이터 로드 완료')
    } catch (error) {
      console.log('⚠️ 백엔드 연결 실패, 기본 데이터 유지:', error.message)
      // 백엔드 연결 실패 시 기본 시나리오 유지 (11/27 이전 상태)
      setDefaultScenarios()
    }
  }

  // Context value
  const contextValue = {
    scenarios,
    setScenarios,
    trainingHistory,
    setTrainingHistory,
    currentUser,
    setCurrentUser,
    notifications,
    setNotifications,
    isAuthenticated,
    setIsAuthenticated,
    isLoading,
    
    // 인증 관련 함수들
    login: (userData, token) => {
      setCurrentUser(userData)
      setIsAuthenticated(true)
      localStorage.setItem('authToken', token)
      localStorage.setItem('currentUser', JSON.stringify(userData))
      apiClient.setToken(token)
      loadBackendData() // 로그인 성공 시 백엔드 데이터 로드
      console.log('✅ 로그인 완료:', userData)
    },
    
    logout: () => {
      setCurrentUser(null)
      setIsAuthenticated(false)
      localStorage.removeItem('authToken')
      localStorage.removeItem('currentUser')
      apiClient.setToken(null)
      setScenarios([]) // 로그아웃 시 데이터 클리어
      console.log('🔐 로그아웃 완료')
    },
    
    // 유틸리티 함수들
    addTrainingHistory: (historyItem) => {
      const newHistory = [...trainingHistory, historyItem]
      setTrainingHistory(newHistory)
      localStorage.setItem('trainingHistory', JSON.stringify(newHistory))
    },
    
    addNotification: (notification) => {
      const newNotification = {
        id: Date.now(),
        timestamp: new Date(),
        ...notification
      }
      setNotifications(prev => [newNotification, ...prev])
    },

    // 훈련 완료 함수
    completeTraining: (trainingData) => {
      const completedTraining = {
        id: `training-${Date.now()}`,
        completedAt: new Date().toISOString(),
        ...trainingData
      }
      const newHistory = [...trainingHistory, completedTraining]
      setTrainingHistory(newHistory)
      localStorage.setItem('trainingHistory', JSON.stringify(newHistory))
      return completedTraining
    },

    // 사용자 프로필
    userProfile: currentUser,
    
    // 조직 데이터
    companyOrganizations,
    setCompanyOrganizations,
    
    // 역할 배정
    roleAssignments,
    setRoleAssignments
  }

  // 로딩 화면
  if (isLoading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">시스템을 초기화하는 중...</p>
          </div>
        </div>
      </ThemeProvider>
    )
  }

  // 보호된 라우트 컴포넌트
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />
    }
    return children
  }

  // 공개 라우트 컴포넌트 (로그인된 사용자는 대시보드로)
  const PublicRoute = ({ children }) => {
    if (isAuthenticated) {
      return <Navigate to="/" replace />
    }
    return children
  }

  // BackendLogin 래퍼 컴포넌트 (App.jsx의 login 함수 사용)
  const BackendLoginWrapper = () => {
    const handleLoginSuccess = (userData) => {
      // BackendLogin에서 받은 사용자 데이터를 App.jsx의 login 함수로 전달
      const token = localStorage.getItem('authToken') || 'mock-token-' + Date.now()
      contextValue.login(userData, token)
    }
    
    return <BackendLogin onLoginSuccess={handleLoginSuccess} />
  }

  return (
    <ThemeProvider>
      <AppContext.Provider value={contextValue}>
        <Router>
          <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
            {/* 인증된 사용자에게만 Navbar 표시 */}
            {isAuthenticated && <Navbar />}
            
            <main className={isAuthenticated ? "pt-16" : ""}>
              <Routes>
                {/* 로그인 페이지 (공개) - LoginPage 사용 (11/26~27 버전 기준) */}
                <Route 
                  path="/login" 
                  element={
                    <PublicRoute>
                      <LoginPage />
                    </PublicRoute>
                  } 
                />
                
                {/* 회원가입 페이지 (공개) */}
                <Route 
                  path="/register" 
                  element={
                    <PublicRoute>
                      <Register />
                    </PublicRoute>
                  } 
                />
                
                {/* 보호된 라우트들 */}
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/training/scenario/:scenarioId" 
                  element={
                    <ProtectedRoute>
                      <ScenarioTraining />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/training/advanced/:scenarioId" 
                  element={
                    <ProtectedRoute>
                      <AdvancedTrainingEngine />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/organization" 
                  element={
                    <ProtectedRoute>
                      <OrganizationManagement />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/team" 
                  element={
                    <ProtectedRoute>
                      <TeamManagement />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/team/training/:scenarioId" 
                  element={
                    <ProtectedRoute>
                      <TeamTrainingEngine />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/role-assignment" 
                  element={
                    <ProtectedRoute>
                      <RoleAssignment />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/admin/training" 
                  element={
                    <ProtectedRoute>
                      <TrainingManagement />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/admin/login" 
                  element={
                    <ProtectedRoute>
                      <BackendLogin />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <UserProfile />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/evaluation/:trainingId" 
                  element={
                    <ProtectedRoute>
                      <EvaluationReport />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/map" 
                  element={
                    <ProtectedRoute>
                      <EmergencyMap />
                    </ProtectedRoute>
                  } 
                />
                
                {/* 404 및 기타 라우트 */}
                <Route 
                  path="*" 
                  element={
                    isAuthenticated ? (
                      <div className="flex items-center justify-center min-h-[60vh]">
                        <div className="text-center">
                          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
                          <p className="text-xl text-gray-600 dark:text-gray-300">페이지를 찾을 수 없습니다.</p>
                        </div>
                      </div>
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  } 
                />
              </Routes>
            </main>
          </div>
        </Router>
      </AppContext.Provider>
    </ThemeProvider>
  )
}

export default App