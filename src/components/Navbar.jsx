import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, Users, ClipboardCheck, BarChart3, User, LogOut, ChevronDown, FileText, UserCheck } from 'lucide-react'
import { useAppContext } from '../App'

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { userProfile, resetProfile } = useAppContext()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const [pendingPath, setPendingPath] = useState(null)

  // 훈련 중인지 확인 (더 강력한 감지)
  const isTrainingActive = () => {
    console.log('🔍 isTrainingActive 함수 호출됨')

    const trainingPhase = localStorage.getItem('training_phase')
    const trainingStep = localStorage.getItem('training_step')

    console.log('📋 localStorage 원본 값들:', {
      trainingPhase,
      trainingStep,
      typeOfPhase: typeof trainingPhase,
      typeOfStep: typeof trainingStep
    })

    // 다양한 형태의 문자열 정리
    let cleanPhase = trainingPhase
    if (cleanPhase) {
      // 따옴표 제거
      cleanPhase = cleanPhase.replace(/"/g, '')
      // 공백 제거
      cleanPhase = cleanPhase.trim()
    }

    // 훈련 중인지 확인하는 여러 조건
    const isPhaseTraining = cleanPhase === 'training'
    const hasValidStep = parseInt(trainingStep) >= 0
    const hasTrainingData = localStorage.getItem('training_actions') || localStorage.getItem('training_choices')

    // 훈련 중으로 판단하는 조건들
    const isActive = isPhaseTraining && hasValidStep

    console.log('🔍 Navbar - 강화된 훈련 상태 확인:', {
      originalPhase: trainingPhase,
      cleanPhase: cleanPhase,
      trainingStep,
      isPhaseTraining,
      hasValidStep,
      hasTrainingData: !!hasTrainingData,
      isActive,
      allLocalStorage: {
        training_phase: localStorage.getItem('training_phase'),
        training_step: localStorage.getItem('training_step'),
        training_actions: localStorage.getItem('training_actions'),
        training_choices: localStorage.getItem('training_choices')
      }
    })

    console.log('✅ 최종 결과:', isActive)
    return isActive
  }

  // 훈련 중 페이지 이동 처리
  const handleNavClick = (path, e) => {
    console.log('🖱️ Navbar - handleNavClick 함수 시작')
    console.log('🖱️ Navbar - 메뉴 클릭됨:', { path, event: e })

    // 이벤트 기본 동작 확인
    console.log('🖱️ 이벤트 기본 동작:', e.defaultPrevented)

    const trainingActive = isTrainingActive()
    console.log('📊 Navbar - 훈련 활성 상태:', trainingActive)

    if (trainingActive) {
      console.log('⚠️ 훈련 중이므로 preventDefault 실행')
      e.preventDefault()
      console.log('⚠️ Navbar - 훈련 중이므로 커스텀 모달 표시')

      // 커스텀 모달 표시
      setPendingPath(path)
      setShowExitConfirm(true)
    } else {
      console.log('➡️ Navbar - 훈련 중이 아니므로 바로 이동')
      navigate(path)
    }
  }

  // 훈련 종료 확인
  const confirmExitTraining = () => {
    console.log('✅ 사용자가 훈련 종료를 확인함')
    // 훈련 데이터 초기화
    localStorage.removeItem('training_phase')
    localStorage.removeItem('training_step')
    localStorage.removeItem('training_actions')
    localStorage.removeItem('training_choices')
    localStorage.removeItem('training_times')
    localStorage.removeItem('training_scores')
    localStorage.removeItem('training_descriptive')
    console.log('✅ localStorage 정리 완료, 페이지 이동 시작')

    setShowExitConfirm(false)
    navigate(pendingPath)
    setPendingPath(null)
  }

  // 훈련 종료 취소
  const cancelExitTraining = () => {
    console.log('❌ 사용자가 훈련 종료를 취소함')
    setShowExitConfirm(false)
    setPendingPath(null)
  }

  const navItems = [
    { path: '/', name: '대시보드', icon: Home },
    { path: '/roles', name: '역할 관리', icon: Users },
    { path: '/team-management', name: '팀 관리', icon: UserCheck },
    { path: '/training-management', name: '훈련 관리', icon: FileText },
    { path: '/evaluation', name: '평가 리포트', icon: BarChart3 },
  ]

  const handleLogout = () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      resetProfile()
    }
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <ClipboardCheck className="h-8 w-8 text-primary-600 mr-3" />
            <h1 className="text-xl font-bold text-gray-900">도시가스 비상대응 모의훈련 플랫폼</h1>
          </div>

          <div className="flex items-center space-x-8">
            {/* 네비게이션 메뉴 */}
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path

              return (
                <button
                  key={item.path}
                  onClick={(e) => handleNavClick(item.path, e)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.name}
                </button>
              )
            })}

            {/* 사용자 메뉴 */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors"
              >
                <User className="h-4 w-4" />
                <span>{userProfile?.name}</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-100">
                    <p className="font-medium text-gray-900">{userProfile?.name}</p>
                    <p className="text-sm text-gray-600">{userProfile?.department} • {userProfile?.position}</p>
                    <p className="text-xs text-gray-500">{userProfile?.company}</p>
                  </div>

                  <div className="p-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      로그아웃
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 메뉴 외부 클릭 시 닫기 */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}

      {/* 훈련 종료 확인 모달 */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">⚠️ 훈련 종료 확인</h3>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-2 font-medium">
                현재 훈련이 진행 중입니다!
              </p>
              <p className="text-gray-600 text-sm mb-3">
                페이지를 떠나면 훈련 진행 상황이 저장되지 않고 처음부터 다시 시작됩니다.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 font-medium text-center">
                  정말 훈련을 종료하시겠습니까?
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelExitTraining}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                아니오, 계속 훈련
              </button>
              <button
                onClick={confirmExitTraining}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                예, 훈련 종료
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
