import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Clock, AlertTriangle, CheckCircle, X, Play, Pause, RotateCcw,
  Users, User, MapPin, Thermometer, Wind, Eye, Award,
  ArrowLeft, ArrowRight, Flag, Lightbulb
} from 'lucide-react'
import { useAppContext } from '../App'
import { detailedScenarios, roleActionGuides, evaluationCriteria, feedbackTemplates, scenarioSpecificFeedback } from '../data/trainingScenarios'
import EmergencyMap from './EmergencyMap'
import useLocalStorage from '../hooks/useLocalStorage'
import useErrorHandler from '../hooks/useErrorHandler'
import ErrorMessage from './ErrorMessage'
import aiService from '../services/aiService'

const AdvancedTrainingEngine = () => {
  const { scenarioId } = useParams()
  const navigate = useNavigate()
  const { userProfile, completeTraining, roleAssignments, companyOrganizations } = useAppContext()

  // 에러 처리 훅 사용
  const { error, showError, showSuccess, showWarning, showInfo, hideError, handleError } = useErrorHandler()

  // 훈련 상태 관리 (로컬 스토리지 사용 - Navbar와 동기화)
  const [currentPhase, setCurrentPhase, clearCurrentPhase] = useLocalStorage('training_phase', 'briefing')
  const [currentStep, setCurrentStep, clearCurrentStep] = useLocalStorage('training_step', 0)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [stepStartTime, setStepStartTime] = useState(0)

  // 사용자 행동 추적 (로컬 스토리지 사용)
  const [selectedActions, setSelectedActions, clearSelectedActions] = useLocalStorage('training_actions', [])
  const [userChoices, setUserChoices, clearUserChoices] = useLocalStorage('training_choices', {})
  const [stepTimes, setStepTimes, clearStepTimes] = useLocalStorage('training_times', {})
  const [stepScores, setStepScores, clearStepScores] = useLocalStorage('training_scores', {})
  const [showRoleGuide, setShowRoleGuide] = useState(false)

  // 서술형 답변 상태 (로컬 스토리지 사용)
  const [descriptiveAnswers, setDescriptiveAnswers, clearDescriptiveAnswers] = useLocalStorage('training_descriptive', {})
  
  // 단순 점수 계산을 위한 제거 (단일 선택만 사용)

  // AI 피드백 상태
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false)
  const [feedbackData, setFeedbackData] = useState(null)

  // 훈련 중 페이지 이동 경고 상태
  const [showExitWarning, setShowExitWarning] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState(null)

  // 남은 시간 상태 추가 (다른 상태들보다 먼저 선언)
  const [timeRemaining, setTimeRemaining] = useState(300) // 5분 기본값

  // localStorage 정리 함수
  const clearAllTrainingData = () => {
    clearCurrentPhase()
    clearCurrentStep()
    clearSelectedActions()
    clearUserChoices()
    clearStepTimes()
    clearStepScores()
    clearDescriptiveAnswers()
    // AI 피드백 관련 상태 초기화
    setFeedbackData(null)
    setIsGeneratingFeedback(false)
  }

  // 훈련 중 페이지 이동 감지 및 경고
  const handleNavigation = useCallback((path) => {
    // 훈련 중이 아닌 경우 바로 이동
    if (currentPhase !== 'training' || !isRunning) {
      navigate(path)
      return
    }

    // 훈련 중인 경우 경고 표시
    setPendingNavigation(path)
    setShowExitWarning(true)
  }, [currentPhase, isRunning, navigate])

  // 훈련 종료 확인
  const confirmExitTraining = useCallback(() => {
    console.log('훈련 종료 확인됨 - 모든 데이터 초기화')
    clearAllTrainingData()
    setIsRunning(false)
    setIsPaused(false)
    setTimeElapsed(0)
    setTimeRemaining(300)
    setShowExitWarning(false)

    if (pendingNavigation) {
      navigate(pendingNavigation)
      setPendingNavigation(null)
    }
  }, [clearAllTrainingData, navigate, pendingNavigation])

  // 훈련 종료 취소
  const cancelExitTraining = useCallback(() => {
    setShowExitWarning(false)
    setPendingNavigation(null)
  }, [])

  // 브라우저 뒤로가기/새로고침 감지
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (currentPhase === 'training' && isRunning) {
        console.log('브라우저 새로고침/닫기 감지 - 훈련 중')
        e.preventDefault()
        e.returnValue = '⚠️ 훈련이 진행 중입니다!\n\n정말 페이지를 떠나시겠습니까?\n훈련 진행 상황은 저장되지 않습니다.'
        return e.returnValue
      }
    }

    const handlePopState = (e) => {
      if (currentPhase === 'training' && isRunning) {
        console.log('브라우저 뒤로가기 감지 - 훈련 중')
        e.preventDefault()
        setShowExitWarning(true)
        setPendingNavigation('/')
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [currentPhase, isRunning])

  // 훈련 시작 시 상태 로깅
  useEffect(() => {
    if (currentPhase === 'training' && isRunning) {
      console.log('🚀 훈련 시작됨 - 페이지 이동 경고 활성화')
      console.log('현재 상태:', {
        currentPhase,
        isRunning,
        currentStep,
        timeRemaining
      })
    }
  }, [currentPhase, isRunning, currentStep, timeRemaining])
  const [showDescriptiveModal, setShowDescriptiveModal] = useState(false)
  const [currentDescriptiveAction, setCurrentDescriptiveAction] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // 실시간 정보
  const [realTimeData, setRealTimeData] = useState({})
  const [alertLevel, setAlertLevel] = useState('normal') // normal, warning, critical

  const timerRef = useRef(null)

  // 시나리오 데이터 로딩 및 검증
  const scenario = useMemo(() => {
    if (!scenarioId) {
      console.error('시나리오 ID가 없습니다')
      return null
    }
    
    const parsedId = parseInt(scenarioId)
    if (isNaN(parsedId)) {
      console.error('유효하지 않은 시나리오 ID:', scenarioId)
      return null
    }
    
    const foundScenario = detailedScenarios[parsedId]
    if (!foundScenario) {
      console.error('시나리오를 찾을 수 없습니다. ID:', parsedId, '사용 가능한 ID:', Object.keys(detailedScenarios))
      return null
    }
    
    console.log('시나리오 로드 성공:', foundScenario.title, 'ID:', parsedId)
    return foundScenario
  }, [scenarioId])

  // 사용자의 실제 배정된 역할 찾기
  const getUserAssignedRole = () => {
    if (!userProfile || !companyOrganizations) return '관제운영반장'

    // 사용자 정보로 직원 ID 생성
    const userCompany = userProfile.company
    const userDepartment = userProfile.department
    const userName = userProfile.name

    if (!companyOrganizations[userCompany]) return '관제운영반장'

    // 해당 회사에서 사용자 찾기 (3단계 및 4단계 구조 지원)
    const companyData = companyOrganizations[userCompany]

    const searchEmployees = (data, path = []) => {
      for (const key in data) {
        const value = data[key]

        if (Array.isArray(value)) {
          // 직원 배열을 찾음
          const foundEmployee = value.find(emp => emp.includes(userName))
          if (foundEmployee) {
            const employeeId = `${userCompany}-${path.join('-')}-${key}-${userName}`
            return roleAssignments[employeeId] || '관제운영반장'
          }
        } else if (typeof value === 'object' && value !== null) {
          // 더 깊이 들어가서 검색
          const result = searchEmployees(value, [...path, key])
          if (result) return result
        }
      }
      return null
    }

    return searchEmployees(companyData) || '관제운영반장'
  }

  const userRole = getUserAssignedRole()

  // 디버깅을 위한 로그
  console.log('AdvancedTrainingEngine - userProfile:', userProfile)
  console.log('AdvancedTrainingEngine - roleAssignments:', roleAssignments)
  console.log('AdvancedTrainingEngine - userRole:', userRole)
  console.log('AdvancedTrainingEngine - available roles:', roleActionGuides ? Object.keys(roleActionGuides) : 'roleActionGuides is undefined')
  console.log('🔍 컴포넌트 렌더링 - currentPhase:', currentPhase, typeof currentPhase)

  const roleGuide = roleActionGuides?.[userRole] || roleActionGuides?.['관제운영반장'] || {
    responsibilities: ['기본적인 업무 수행'],
    keyActions: ['상황 파악', '보고'],
    criticalActions: ['긴급 상황 보고'],
    correctActions: ['상황 파악', '보고'],
    feedback: '기본적인 대응을 수행했습니다.'
  }

  // 타이머 관리 - 남은 시간 감소
  useEffect(() => {
    console.log('타이머 useEffect 실행:', { isRunning, isPaused, currentPhase, timeRemaining })

    if (isRunning && !isPaused && currentPhase === 'training') {
      console.log('타이머 시작됨')
      timerRef.current = setInterval(() => {
        setTimeElapsed(prev => prev + 1)
        setTimeRemaining(prev => {
          const newTime = Math.max(0, prev - 1)
          console.log('타이머 업데이트:', prev, '->', newTime)
          // 시간이 0이 되면 자동으로 훈련 종료
          if (newTime === 0) {
            console.log('시간 종료!')
            setIsRunning(false)
            setCurrentPhase('evaluation')
            showWarning('시간 종료', '제한 시간이 종료되어 훈련이 자동으로 완료되었습니다.')
          }
          return newTime
        })
      }, 1000)
    } else {
      console.log('타이머 중지됨')
      clearInterval(timerRef.current)
    }

    return () => {
      console.log('타이머 정리')
      clearInterval(timerRef.current)
    }
  }, [isRunning, isPaused, currentPhase, showWarning])

  // 시나리오 시작
  const startTraining = useCallback(() => {
    if (!scenario) {
      showError('시나리오 오류', '시나리오를 찾을 수 없습니다. 대시보드로 돌아가주세요.')
      navigate('/')
      return
    }
    
    console.log('훈련 시작 함수 호출됨')
    setIsLoading(true)
    setTimeout(() => {
      console.log('🚀 훈련 상태 설정 시작')
      const duration = scenario.duration ? scenario.duration * 60 : 1800
      console.log('⏰ 타이머 시작:', duration, '초 (', scenario.duration, '분)')

      setCurrentPhase('training')
      setCurrentStep(0)
      setTimeElapsed(0)
      setTimeRemaining(duration)
      setSelectedActions([])
      setStepScores({})

      console.log('✅ 훈련 상태 설정 완료 - localStorage 확인:')
      console.log('training_phase:', localStorage.getItem('training_phase'))
      console.log('training_step:', localStorage.getItem('training_step'))
      setStepTimes({})
      setUserChoices({})
      setDescriptiveAnswers({})
      setStepStartTime(Date.now())

      // 마지막에 실행 상태 설정
      setTimeout(() => {
        console.log('훈련 실행 상태 활성화')
        setIsRunning(true)
        setIsLoading(false)
      }, 100)
    }, 800) // 훈련 시작 로딩
  }, [scenario, setCurrentPhase, setCurrentStep, setTimeElapsed, setTimeRemaining, setSelectedActions, setStepScores, setStepTimes, setUserChoices, setDescriptiveAnswers])

  // 훈련 일시정지/재개
  const togglePause = useCallback(() => {
    setIsPaused(!isPaused)
  }, [isPaused])

  // 훈련 초기화
  const resetTraining = useCallback(() => {
    setCurrentPhase('briefing')
    setIsRunning(false)
    setIsPaused(false)
    setCurrentStep(0)
    setTimeElapsed(0)
    setSelectedActions([])
    setStepScores({})
    setStepTimes({})
    setUserChoices({})
    setDescriptiveAnswers({})
    setMultipleSelections({})
    setMultiQuestionAnswers({})
    setRoleMatchingAnswers({})
    setRealTimeData({})
    setAlertLevel('normal')
  }, [])

  // 각 절차별 객관식 선택지 생성 함수
  const getMultipleChoiceOptions = (procedureName) => {
    const options = {
      'EMS 1차 분석': [
        { text: '가스 누출 농도 측정 및 위험도 평가', isCorrect: true },
        { text: '주변 건물 구조 분석', isCorrect: false },
        { text: '교통 상황 확인', isCorrect: false },
        { text: '날씨 정보 수집', isCorrect: false }
      ],
      '비상발령': [
        { text: '상황실 비상 1단계 발령', isCorrect: true },
        { text: '직원 휴게실 비상발령', isCorrect: false },
        { text: '고객센터 비상발령', isCorrect: false },
        { text: '회계팀 비상발령', isCorrect: false }
      ],
      '1차 밸브 출동지시': [
        { text: '가스 공급 차단을 위한 밸브 조작팀 출동', isCorrect: true },
        { text: '배관 수리팀 출동', isCorrect: false },
        { text: '고객 상담팀 출동', isCorrect: false },
        { text: '안전 점검팀 출동', isCorrect: false }
      ],
      '유관기관통보': [
        { text: '119, 112, 지자체에 가스 누출 사고 통보', isCorrect: true },
        { text: '전기회사에 통보', isCorrect: false },
        { text: '상하수도사업소에 통보', isCorrect: false },
        { text: '우체국에 통보', isCorrect: false }
      ],
      '최초 도착': [
        { text: '현장 도착 후 안전구역 설정', isCorrect: true },
        { text: '현장 도착 후 주차장 확인', isCorrect: false },
        { text: '현장 도착 후 건물 입구 확인', isCorrect: false },
        { text: '현장 도착 후 주변 상점 확인', isCorrect: false }
      ],
      '위치파악': [
        { text: '정확한 가스 누출 지점 및 배관 위치 확인', isCorrect: true },
        { text: '주변 건물 위치 확인', isCorrect: false },
        { text: '주차장 위치 확인', isCorrect: false },
        { text: '상점 위치 확인', isCorrect: false }
      ],
      '1차 밸브 차단': [
        { text: '누출 지점 상류 밸브 차단', isCorrect: true },
        { text: '누출 지점 하류 밸브 차단', isCorrect: false },
        { text: '주변 건물 밸브 차단', isCorrect: false },
        { text: '상점 밸브 차단', isCorrect: false }
      ],
      'EMS 2차 분석': [
        { text: '밸브 차단 후 잔류 가스 농도 재측정', isCorrect: true },
        { text: '주변 공기질 측정', isCorrect: false },
        { text: '온도 측정', isCorrect: false },
        { text: '습도 측정', isCorrect: false }
      ],
      '수요가 복구처 확인': [
        { text: '영향받은 고객 세대 및 복구 우선순위 확인', isCorrect: true },
        { text: '주변 상점 확인', isCorrect: false },
        { text: '주차장 확인', isCorrect: false },
        { text: '건물 관리사무소 확인', isCorrect: false }
      ],
      '2차 밸브 차단': [
        { text: '영향 범위 확대 방지를 위한 추가 밸브 차단', isCorrect: true },
        { text: '주변 건물 밸브 차단', isCorrect: false },
        { text: '상점 밸브 차단', isCorrect: false },
        { text: '주차장 밸브 차단', isCorrect: false }
      ],
      // 단계 II 절차들
      '현장지원반 구성': [
        { text: '복구작업을 위한 현장지원반 구성 및 배치', isCorrect: true },
        { text: '홍보팀 구성', isCorrect: false },
        { text: '고객상담팀 구성', isCorrect: false },
        { text: '회계팀 구성', isCorrect: false }
      ],
      '1차 보도자료 배포': [
        { text: '가스 공급중단 및 복구 예상시간 안내 보도자료 배포', isCorrect: true },
        { text: '가스 요금 인상 보도자료 배포', isCorrect: false },
        { text: '신규 고객 모집 보도자료 배포', isCorrect: false },
        { text: '회사 이벤트 보도자료 배포', isCorrect: false }
      ],
      '수요가 밸브차단': [
        { text: '영향받은 수요가 밸브 차단 및 안전 확보', isCorrect: true },
        { text: '주변 상점 밸브 차단', isCorrect: false },
        { text: '주차장 밸브 차단', isCorrect: false },
        { text: '건물 관리사무소 밸브 차단', isCorrect: false }
      ],
      '1차 홍보 (공급중단)': [
        { text: '고객에게 가스 공급중단 상황 및 대응방안 홍보', isCorrect: true },
        { text: '신규 상품 홍보', isCorrect: false },
        { text: '할인 이벤트 홍보', isCorrect: false },
        { text: '회사 소식 홍보', isCorrect: false }
      ],
      '수요조사 착수': [
        { text: '영향받은 고객 세대 및 피해 규모 정확한 조사', isCorrect: true },
        { text: '주변 상점 조사', isCorrect: false },
        { text: '주차장 조사', isCorrect: false },
        { text: '건물 관리사무소 조사', isCorrect: false }
      ],
      '협력팀 도착': [
        { text: '복구작업을 위한 협력업체 및 전문팀 현장 도착', isCorrect: true },
        { text: '홍보팀 도착', isCorrect: false },
        { text: '고객상담팀 도착', isCorrect: false },
        { text: '회계팀 도착', isCorrect: false }
      ],
      '터파기': [
        { text: '배관 접근을 위한 터파기 작업 및 안전 확보', isCorrect: true },
        { text: '건물 터파기', isCorrect: false },
        { text: '주차장 터파기', isCorrect: false },
        { text: '상점 터파기', isCorrect: false }
      ],
      '복구방법 결정': [
        { text: '배관 손상 정도에 따른 최적 복구방법 결정', isCorrect: true },
        { text: '건물 복구방법 결정', isCorrect: false },
        { text: '주차장 복구방법 결정', isCorrect: false },
        { text: '상점 복구방법 결정', isCorrect: false }
      ],
      '복구자재 요청': [
        { text: '복구작업에 필요한 배관 및 자재 요청', isCorrect: true },
        { text: '건물 자재 요청', isCorrect: false },
        { text: '주차장 자재 요청', isCorrect: false },
        { text: '상점 자재 요청', isCorrect: false }
      ],
      '복구자재 확보': [
        { text: '복구작업용 배관 및 자재 확보 및 현장 배치', isCorrect: true },
        { text: '건물 자재 확보', isCorrect: false },
        { text: '주차장 자재 확보', isCorrect: false },
        { text: '상점 자재 확보', isCorrect: false }
      ],
      // 단계 III 절차들
      '2차 홍보 (복구홍보)': [
        { text: '복구작업 진행상황 및 완료 예상시간 고객 홍보', isCorrect: true },
        { text: '신규 상품 홍보', isCorrect: false },
        { text: '할인 이벤트 홍보', isCorrect: false },
        { text: '회사 소식 홍보', isCorrect: false }
      ],
      '2차 보도자료 배포': [
        { text: '복구작업 진행상황 및 완료 예상시간 보도자료 배포', isCorrect: true },
        { text: '가스 요금 인상 보도자료 배포', isCorrect: false },
        { text: '신규 고객 모집 보도자료 배포', isCorrect: false },
        { text: '회사 이벤트 보도자료 배포', isCorrect: false }
      ],
      '복구작업': [
        { text: '손상된 배관 교체 및 연결 작업', isCorrect: true },
        { text: '건물 복구작업', isCorrect: false },
        { text: '주차장 복구작업', isCorrect: false },
        { text: '상점 복구작업', isCorrect: false }
      ],
      '최종검사': [
        { text: '복구된 배관의 안전성 및 누출 여부 최종 검사', isCorrect: true },
        { text: '건물 안전성 검사', isCorrect: false },
        { text: '주차장 안전성 검사', isCorrect: false },
        { text: '상점 안전성 검사', isCorrect: false }
      ],
      '1차 밸브 오픈': [
        { text: '복구 완료 후 1차 밸브 개방 및 가스 공급 재개', isCorrect: true },
        { text: '건물 밸브 오픈', isCorrect: false },
        { text: '주차장 밸브 오픈', isCorrect: false },
        { text: '상점 밸브 오픈', isCorrect: false }
      ],
      '퍼지 완료': [
        { text: '배관 내 잔류 공기 제거 및 가스 순환 확보', isCorrect: true },
        { text: '건물 내 공기 제거', isCorrect: false },
        { text: '주차장 내 공기 제거', isCorrect: false },
        { text: '상점 내 공기 제거', isCorrect: false }
      ],
      '3차 밸브 오픈': [
        { text: '퍼지 완료 후 3차 밸브 개방 및 정상 공급 확인', isCorrect: true },
        { text: '건물 3차 밸브 오픈', isCorrect: false },
        { text: '주차장 3차 밸브 오픈', isCorrect: false },
        { text: '상점 3차 밸브 오픈', isCorrect: false }
      ],
      '3차 보도자료 배포': [
        { text: '가스 공급 재개 완료 및 정상화 보도자료 배포', isCorrect: true },
        { text: '가스 요금 인상 보도자료 배포', isCorrect: false },
        { text: '신규 고객 모집 보도자료 배포', isCorrect: false },
        { text: '회사 이벤트 보도자료 배포', isCorrect: false }
      ],
      '2차 밸브 오픈': [
        { text: '정상 공급 확인 후 2차 밸브 개방 및 완전 복구', isCorrect: true },
        { text: '건물 2차 밸브 오픈', isCorrect: false },
        { text: '주차장 2차 밸브 오픈', isCorrect: false },
        { text: '상점 2차 밸브 오픈', isCorrect: false }
      ],
      '세대점검': [
        { text: '영향받은 고객 세대 가스 사용 정상화 점검', isCorrect: true },
        { text: '주변 상점 점검', isCorrect: false },
        { text: '주차장 점검', isCorrect: false },
        { text: '건물 관리사무소 점검', isCorrect: false }
      ],
      '상황종료': [
        { text: '모든 복구작업 완료 및 비상상황 정상화 선언', isCorrect: true },
        { text: '건물 상황종료', isCorrect: false },
        { text: '주차장 상황종료', isCorrect: false },
        { text: '상점 상황종료', isCorrect: false }
      ]
    }

    return options[procedureName] || [
      { text: '적절한 대응 조치', isCorrect: true },
      { text: '부적절한 조치 1', isCorrect: false },
      { text: '부적절한 조치 2', isCorrect: false },
      { text: '부적절한 조치 3', isCorrect: false }
    ]
  }

  // 행동 선택 처리
  const handleActionSelect = (action, actionType = 'basic') => {
    console.log('handleActionSelect 호출됨:', { action, actionType, currentStep })

    // 시나리오 확인
    if (!scenario || !scenario.timeline) {
      showError('시나리오 오류', '시나리오 데이터를 찾을 수 없습니다.')
      return
    }

    // '상황 접수' 선택 시 서술형 문제 표시
    if (action === '상황 접수') {
      setCurrentDescriptiveAction(action)
      setShowDescriptiveModal(true)
      return
    }

    const currentStepData = scenario.timeline[currentStep] || {
      id: currentStep + 1,
      time: `${Math.floor(currentStep / 4) + 9}:${(currentStep % 4) * 15}`,
      title: `단계 ${currentStep + 1}`,
      situation: '훈련 진행 중',
      realTimeInfo: {
        gasConcentration: '정상',
        repairProgress: '진행 중',
        workSafety: '양호',
        customerImpact: '영향 없음'
      },
      roleBasedActions: {
        [userRole]: {
          correctActions: ['적절한 대응 조치'],
          timeLimit: 300,
          criticalActions: ['적절한 대응 조치'],
          tips: '상황에 맞는 적절한 조치를 선택하세요.'
        }
      }
    }

    // 하드코딩된 역할별 액션 (fallback) - 복사본 3
    const hardcodedRoleActions3 = {
      '관제운영반장': {
        correctActions: [
          '상황 파악 및 판단',
          '현장출동반 지시',
          '유관기관 통보',
          '상위 보고',
          '지시 전파',
          '의사결정'
        ],
        criticalActions: ['상황 파악 및 판단', '현장출동반 지시'],
        timeLimit: 300
      },
      '현장출동반': {
        correctActions: [
          '안전장비 착용',
          '현장 출동',
          '가스 농도 측정',
          '안전 구역 설정',
          '밸브 차단',
          '상황 보고'
        ],
        criticalActions: ['안전장비 착용', '현장 출동'],
        timeLimit: 300
      },
      '안전관리반': {
        correctActions: [
          '대피 계획 수립',
          '대피 방송',
          '안전 구역 설정',
          '응급처치',
          '대피 완료 확인',
          '안전 점검'
        ],
        criticalActions: ['대피 계획 수립', '대피 방송'],
        timeLimit: 300
      },
      '고객서비스반': {
        correctActions: [
          '고객 안전 확인',
          '상황 안내',
          '문의 대응',
          '복구 일정 공지',
          '불만 처리',
          '서비스 복구'
        ],
        criticalActions: ['고객 안전 확인', '상황 안내'],
        timeLimit: 300
      },
      '기술반': {
        correctActions: [
          '원인 조사',
          '복구 계획 수립',
          '자재 확보',
          '작업 감독',
          '품질 검사',
          '완료 확인'
        ],
        criticalActions: ['원인 조사', '복구 계획 수립'],
        timeLimit: 300
      },
      '홍보반': {
        correctActions: [
          '보도자료 작성',
          '언론 브리핑',
          'SNS 공지',
          '정보 공개',
          '언론 대응',
          '신뢰 관리'
        ],
        criticalActions: ['보도자료 작성', '언론 브리핑'],
        timeLimit: 300
      }
    }

    const roleActions = currentStepData?.roleBasedActions?.[userRole] || roleActionGuides?.[userRole] || hardcodedRoleActions3?.[userRole]

    // 역할이 정의되지 않은 경우 기본 역할 가이드 사용
    const defaultRoleActions = {
      correctActions: ['상황 파악', '상황 보고', '안전 확인'],
      criticalActions: ['상황 파악', '안전 확인'],
      timeLimit: 300
    }

    const finalRoleActions = roleActions || defaultRoleActions

    const stepTime = Math.floor((Date.now() - stepStartTime) / 1000)
    
    // teamDiscussion 타입 문제의 정답 여부 확인
    let isCorrect = false
    if (currentStepData.teamDiscussion) {
      // multiple_choice 또는 negative_choice 타입
      if (currentStepData.teamDiscussion.correctAnswer) {
        isCorrect = action === currentStepData.teamDiscussion.correctAnswer
      }
      // 모든 문제를 단일 선택으로 처리
    } else {
      // 기존 roleBasedActions 방식
      isCorrect = finalRoleActions.correctActions?.includes(action) || false
    }
    
    const isCritical = finalRoleActions.criticalActions?.includes(action) || false

    // 현재 단계에서 이미 선택된 행동이 있다면 제거
    const currentStepActions = selectedActions.filter(a => a.step !== currentStep)

    // 새로운 행동 추가
    const newAction = {
      step: currentStep,
      action: action,
      isCorrect: isCorrect,
      isCritical: isCritical,
      timeSpent: stepTime,
      timestamp: new Date().toISOString()
    }

    setSelectedActions([...currentStepActions, newAction])

    // 사용자 선택 기록
    setUserChoices(prev => ({
      ...prev,
      [currentStep]: [newAction]
    }))
    
    // 점수 설정 (정답이면 100점, 오답이면 0점)
    const stepScore = isCorrect ? 100 : 0
    setStepScores(prev => ({
      ...prev,
      [currentStep]: stepScore
    }))
    
    // 단계별 시간 기록
    setStepTimes(prev => ({
      ...prev,
      [currentStep]: stepTime
    }))

    // 실시간 피드백
    if (isCorrect && isCritical) {
      setAlertLevel('normal')
    } else if (!isCorrect) {
      setAlertLevel('warning')
    }

    // 치명적 실수 처리
    if (!isCorrect && isCritical) {
      setAlertLevel('critical')
    }
  }

  // 서술형 답변 처리
  const handleDescriptiveAction = (action) => {
    if (action === '상황 접수') {
      setCurrentDescriptiveAction(action)
      setShowDescriptiveModal(true)
    } else {
      // 일반적인 행동 선택 처리
      handleActionSelect(action)
    }
  }

  // 서술형 답변 제출
  const handleDescriptiveSubmit = (answer) => {
    if (!answer.trim()) return

    console.log('서술형 답변 제출:', answer)

    const stepTime = Math.floor((Date.now() - stepStartTime) / 1000)

    // 상황 접수 채점 로직 (5단계 등급 시스템)
    const score = evaluateSituationReport(answer)
    console.log('채점 결과:', score)

    // 점수별 등급 결정
    let grade = '누락'
    if (score >= 80) grade = '정확'
    else if (score >= 60) grade = '우수'
    else if (score >= 40) grade = '보통'
    else if (score >= 20) grade = '미흡'

    const newAction = {
      step: currentStep,
      action: '상황 접수', // 고정값으로 설정
      isCorrect: score >= 60, // 60점 이상이면 정답으로 인정 (우수 이상)
      isCritical: true,
      timeSpent: stepTime,
      timestamp: new Date().toISOString(),
      descriptiveAnswer: answer,
      descriptiveScore: score,
      descriptiveGrade: grade
    }

    console.log('새로운 액션:', newAction)

    // 현재 단계에서 이미 선택된 행동이 있다면 제거
    const currentStepActions = selectedActions.filter(a => a.step !== currentStep)
    setSelectedActions([...currentStepActions, newAction])

    // 사용자 선택 기록
    setUserChoices(prev => ({
      ...prev,
      [currentStep]: [newAction]
    }))

    // 단계별 시간 및 점수 기록
    setStepTimes(prev => ({
      ...prev,
      [currentStep]: stepTime
    }))

    setStepScores(prev => ({
      ...prev,
      [currentStep]: score
    }))

    console.log('선택된 액션 업데이트됨')

    // 서술형 답변 저장
    setDescriptiveAnswers(prev => ({
      ...prev,
      [`${currentStep}_상황접수`]: answer
    }))

    // 답변 제출 후 텍스트 영역 초기화
    const textarea = document.getElementById(`situationAnswer_${currentStep}`)
    if (textarea) {
      textarea.value = ''
    }

    // 실시간 피드백 (등급별 색상)
    if (score >= 80) {
      setAlertLevel('normal') // 정확 - 녹색
    } else if (score >= 60) {
      setAlertLevel('normal') // 우수 - 녹색
    } else if (score >= 40) {
      setAlertLevel('warning') // 보통 - 노란색
    } else {
      setAlertLevel('critical') // 미흡/누락 - 빨간색
    }

    console.log('서술형 답변 처리 완료')
  }

  // 상황 접수 답변 채점 함수 (5단계 등급 시스템)
  const evaluateSituationReport = (answer) => {
    let totalScore = 0
    const answerLower = answer.toLowerCase()

    // 1️⃣ 사고위치 파악 (20점 만점)
    const locationKeywords = {
      정확: [
        '아파트', '단지', '동', '호', '지번', '번지', '주소', '도로명', '랜드마크',
        '정문', '후문', '입구', '출입구', '주차장', '쓰레기장', '자전거보관소',
        '관리사무소', '상가', '화단', '통로', '인도', '보도', '도로변',
        '구체적', '명확', '정확', '상세', '사진', '전송', '보고'
      ],
      우수: [
        '근처', '주변', '인근', '방향', '쪽', '대략', '추정', '진술', '제보',
        '말에따라', '기준', '접근', '이동', '감지', '이상', '징후'
      ],
      보통: [
        '앞', '뒤', '옆', '근방', '추정', '대충', '모름', '확실하지않음',
        '확인안됨', '분석전', '나중에', '한바퀴', '기억안남'
      ],
      미흡: [
        '잘모르겠음', '못찾음', '깜빡했음', '추정만', '도착전', '좌표확인못함',
        '지도없이', '물어보는걸', '출동했는데', '정확히못찾음'
      ]
    }

    const locationScore = evaluateCategory(answerLower, locationKeywords, '사고위치')
    totalScore += locationScore

    // 2️⃣ 가스배관 손상 및 누출 정도 (20점 만점)
    const damageKeywords = {
      정확: [
        '파손', '손상', '균열', '쉿소리', '흰기체', '분출', '기포', '연기',
        '이음부', '빠져있음', '김이올라옴', '압력계', '수치', 'ppm', '탐지기',
        '센서', '급등', '절반이하', '직접손상', '확정', '목격', '관찰'
      ],
      우수: [
        '냄새심함', '압력낮음', '반응', '추정', '이상음향', '뜨거움', '흔들림',
        '소리와냄새', '가능성높음', '정밀확인전'
      ],
      보통: [
        '냄새만', '기체안보임', '센서작동여부', '확신없음', '눈으로만', '대충',
        '위험하다고느껴', '기계없어서', '단서없음', '시각적확인만'
      ],
      미흡: [
        '바빠서확인못함', '판단근거없음', '의심만', '추정만', '기계안가져와서',
        '눈으로보이지않아서', '판단유보', '다른팀이오면', '확인못했음'
      ]
    }

    const damageScore = evaluateCategory(answerLower, damageKeywords, '가스배관손상')
    totalScore += damageScore

    // 3️⃣ 신고자 신원확보 (20점 만점)
    const reporterKeywords = {
      정확: [
        '이름', '성명', '전화번호', '연락처', '주소', '동호수', '거주자',
        '확보', '확인', '메모', '녹취', '기록', '등록', '명함', '수기기록',
        '동의받고', '신원정보', '전화번호부', '재확인', '사진과함께'
      ],
      우수: [
        '중하나만', '일부확보', '물어봤으나', '안받음', '기억안남', '말로만',
        '기록은안함', '성만기억', '근무처만', '아는얼굴'
      ],
      보통: [
        '봤지만정보는', '확보못함', '기억안남', '적지는못함', '성명미확보',
        '감사인사만', '지인이라', '대신신고', '정보없음', '못들음', '애매해서',
        '시도는했지만실패'
      ],
      미흡: [
        '바빠서', '묻지못했음', '종이가없어', '저장못함', '생각못했음',
        '경황이없어', '눈치보느라', '전달만듣고', '본적없음', '얼굴만대충',
        '질문은안함', '후순위로둠', '나중에물어보려다잊음'
      ]
    }

    const reporterScore = evaluateCategory(answerLower, reporterKeywords, '신고자신원')
    totalScore += reporterScore

    // 4️⃣ 화기 사용금지 및 통제 요청 (20점 만점)
    const controlKeywords = {
      정확: [
        '화기사용금지', '절대금지', '통제선', '접근제한', '반경', '출입제한',
        '안내표지', '경광등', '순찰요청', '체계화', '위험반경', '현장점검',
        '외부인력통제', '드론촬영', '확산방지', '충전소임시중지', '기구사용중단',
        '경찰', '소방서', '요청완료', '설치완료'
      ],
      우수: [
        '직접말로', '위험경고', '일부에', '구두로만', '요청만했고', '직접통제는못함',
        '방송대신', '구두로전달', '플래카드없이', '말로만알림'
      ],
      보통: [
        '정식절차는생략', '반응없음', '1~2곳에만', '다른조치에집중', '소방차만오면',
        '반응미흡', '줄만쳐놓고', '통제안함', '방송이나표지판은없음', '혼란스러웠음',
        '주민에게만말하고'
      ],
      미흡: [
        '아무런요청못함', '경찰이하는줄알았음', '경고하지못하고', '말안했음',
        '설명못하고', '바빠서통제생각못했음', '나중에하려다잊음', '오기전까지',
        '우선순위에서밀림', '맡기지않아서안함'
      ]
    }

    const controlScore = evaluateCategory(answerLower, controlKeywords, '화기통제')
    totalScore += controlScore

    // 5️⃣ 피해현황 확인 (20점 만점)
    const damageStatusKeywords = {
      정확: [
        '기침호소', '병원이송', '유리파손', '균열', '인명피해없음', '물적피해',
        '차량건물피해', '임시폐쇄', '대피현황', '휴교조치', '영업중지',
        '질식가능성', '전기배선손상', '피해보고서', '사진포함', '상황공유완료',
        '확인완료', '조치확인'
      ],
      우수: [
        '피해는보이지않으나', '불안호소', '손상여부모름', '육안확인', '없어보임',
        '어지럼증호소', '혼란상태', '간접피해우려', '운영중단없음', '진입지연',
        '정밀조사는추후'
      ],
      보통: [
        '본것같진않음', '확인못했지만', '문제없어보임', '직접확인은못함',
        '조사전', '눈에띄는피해는없었음', '불안해하긴했음', '증언만있음',
        '점검은안했음', '도착전이라판단못함', '정보없음'
      ],
      미흡: [
        '신경못썼어요', '확인은안했습니다', '안봤고다른업무만', '생각못했어요',
        '현장에만집중', '필요성인지못함', '나중에하면된다고', '안하고복구부터',
        '담당아니라고', '바빠서생략'
      ]
    }

    const damageStatusScore = evaluateCategory(answerLower, damageStatusKeywords, '피해현황')
    totalScore += damageStatusScore

    return Math.min(totalScore, 100) // 최대 100점
  }

  // 각 카테고리별 점수 평가 함수
  const evaluateCategory = (answerLower, keywords, categoryName) => {
    let maxScore = 0
    let matchedLevel = '누락'

    // 각 등급별로 키워드 매칭 확인
    Object.entries(keywords).forEach(([level, words]) => {
      const matchedWords = words.filter(word => answerLower.includes(word))
      if (matchedWords.length > 0) {
        const levelScores = { 정확: 20, 우수: 15, 보통: 10, 미흡: 5, 누락: 0 }
        if (levelScores[level] > maxScore) {
          maxScore = levelScores[level]
          matchedLevel = level
        }
      }
    })

    // 디버깅을 위한 로그
    console.log(`${categoryName} 평가: ${matchedLevel} (${maxScore}점)`)

    return maxScore
  }

  // 다음 단계로 진행
  const proceedToNextStep = () => {
    console.log('proceedToNextStep 호출됨')
    console.log('현재 단계:', currentStep)
    console.log('선택된 행동들:', selectedActions)

    // 현재 단계에서 선택된 행동이 있는지 확인
    const currentStepActions = selectedActions.filter(a => a.step === currentStep)
    const currentStepChoices = userChoices[currentStep] || []
    console.log('현재 단계의 행동들:', currentStepActions)
    console.log('현재 단계 행동 개수:', currentStepActions.length)
    console.log('현재 단계 선택들:', currentStepChoices)

    // 17번째 단계(인덱스 16)부터는 답안 제출 여부와 관계없이 진행 가능
    const isOptionalStep = currentStep >= 16 // 3차 홍보,보도자료 배포 단계부터

    // 답안이 제출되지 않았으면 경고 (17번째 단계 이전만)
    if (!isOptionalStep && currentStepActions.length === 0 && currentStepChoices.length === 0) {
      console.log('선택지가 없음 - showWarning 호출')
      console.log('showWarning 함수:', showWarning)
      // 선택지가 없으면 경고 메시지 표시
      showWarning('선택 필요', '이 단계의 선택지를 먼저 선택해주세요.')
      console.log('showWarning 호출 완료')
      return
    }

    // 현재 단계의 점수 계산 (다음 단계로 넘어가기 전에)
    if (stepScores[currentStep] === undefined) {
      // 점수가 없으면 계산
      const totalSteps = scenario.timeline?.length || 23
      const pointsPerStep = 100 / totalSteps
      
      // 현재 단계의 정답 여부 확인
      let stepScore = 0
      
      // 17번째 단계(인덱스 16)부터는 답안이 없어도 기본 점수 부여
      if (isOptionalStep && currentStepChoices.length === 0 && currentStepActions.length === 0) {
        // 선택형 단계에서 답안이 없으면 기본 점수 부여 (예: 60점)
        stepScore = 60
      } else if (currentStepChoices.length > 0) {
        // 선택한 답변의 정답 여부 확인
        const allCorrect = currentStepChoices.every(choice => choice.isCorrect === true)
        const hasCorrect = currentStepChoices.some(choice => choice.isCorrect === true)
        
        // 모든 선택을 100점 또는 0점으로 계산
        stepScore = currentStepChoices.every(choice => choice.isCorrect === true) ? 100 : 0
      } else if (currentStepActions.length > 0) {
        // 행동 기반 점수 계산 (100점 또는 0점)
        const allCorrect = currentStepActions.every(a => a.isCorrect === true)
        stepScore = allCorrect ? 100 : 0
      }
      
      // 단계 점수 저장
      setStepScores(prev => ({
        ...prev,
        [currentStep]: stepScore
      }))
      
      console.log('단계 점수 계산:', { currentStep, stepScore, pointsPerStep, isOptionalStep })
    }

    const currentStepData = scenario.timeline[currentStep] || {
      id: currentStep + 1,
      time: `${Math.floor(currentStep / 4) + 9}:${(currentStep % 4) * 15}`,
      title: `단계 ${currentStep + 1}`,
      situation: '훈련 진행 중',
      realTimeInfo: {
        gasConcentration: '정상',
        repairProgress: '진행 중',
        workSafety: '양호',
        customerImpact: '영향 없음'
      },
      roleBasedActions: {
        [userRole]: {
          correctActions: ['적절한 대응 조치'],
          timeLimit: 300,
          criticalActions: ['적절한 대응 조치'],
          tips: '상황에 맞는 적절한 조치를 선택하세요.'
        }
      }
    }

    // 하드코딩된 역할별 액션 (fallback) - 복사본
    const hardcodedRoleActions2 = {
      '관제운영반장': {
        correctActions: [
          '상황 파악 및 판단',
          '현장출동반 지시',
          '유관기관 통보',
          '상위 보고',
          '지시 전파',
          '의사결정'
        ],
        criticalActions: ['상황 파악 및 판단', '현장출동반 지시'],
        timeLimit: 300
      },
      '현장출동반': {
        correctActions: [
          '안전장비 착용',
          '현장 출동',
          '가스 농도 측정',
          '안전 구역 설정',
          '밸브 차단',
          '상황 보고'
        ],
        criticalActions: ['안전장비 착용', '현장 출동'],
        timeLimit: 300
      },
      '안전관리반': {
        correctActions: [
          '대피 계획 수립',
          '대피 방송',
          '안전 구역 설정',
          '응급처치',
          '대피 완료 확인',
          '안전 점검'
        ],
        criticalActions: ['대피 계획 수립', '대피 방송'],
        timeLimit: 300
      },
      '고객서비스반': {
        correctActions: [
          '고객 안전 확인',
          '상황 안내',
          '문의 대응',
          '복구 일정 공지',
          '불만 처리',
          '서비스 복구'
        ],
        criticalActions: ['고객 안전 확인', '상황 안내'],
        timeLimit: 300
      },
      '기술반': {
        correctActions: [
          '원인 조사',
          '복구 계획 수립',
          '자재 확보',
          '작업 감독',
          '품질 검사',
          '완료 확인'
        ],
        criticalActions: ['원인 조사', '복구 계획 수립'],
        timeLimit: 300
      },
      '홍보반': {
        correctActions: [
          '보도자료 작성',
          '언론 브리핑',
          'SNS 공지',
          '정보 공개',
          '언론 대응',
          '신뢰 관리'
        ],
        criticalActions: ['보도자료 작성', '언론 브리핑'],
        timeLimit: 300
      }
    }

    const roleActions = currentStepData?.roleBasedActions?.[userRole] || roleActionGuides?.[userRole] || hardcodedRoleActions2?.[userRole]

    // 단계별 시간 기록만 수행 (점수는 이미 위에서 계산됨)
    const stepTime = Math.floor((Date.now() - stepStartTime) / 1000)
    console.log(`단계 ${currentStep} 시간 기록 - 시간: ${stepTime}초`)

    setStepTimes(prev => ({
      ...prev,
      [currentStep]: stepTime
    }))

    // 점수는 이미 위에서 100점/0점으로 계산되었으므로 여기서는 덮어쓰지 않음

    // 실시간 데이터 업데이트 (시나리오 데이터가 있을 때만)
    if (currentStepData?.realTimeInfo) {
      setRealTimeData(currentStepData.realTimeInfo)
    }

    // 총 단계 수 확인 (23단계)
    const totalSteps = scenario.timeline?.length || 23
    const lastStepIndex = totalSteps - 1 // 마지막 단계 인덱스 (22)

    // 마지막 단계(23번째, 인덱스 22)에서 다음 단계 버튼을 누르면 바로 훈련 종료
    if (currentStep >= lastStepIndex) {
      // 훈련 완료 - 바로 evaluation 단계로 전환
      console.log('🎯 23단계 완료 - 훈련 종료 및 평가 화면으로 전환')
      console.log('현재 currentStep:', currentStep, '마지막 단계 인덱스:', lastStepIndex)
      
      // 최종 점수 계산 (100점 기준)
      const totalSteps = scenario.timeline?.length || 23
      const pointsPerStep = 100 / totalSteps
      const completedSteps = Object.keys(stepScores)
      
      console.log('점수 계산 정보:', { totalSteps, pointsPerStep, completedSteps, stepScores })
      
      const finalScore = completedSteps.length > 0
        ? completedSteps.reduce((sum, stepIndex) => {
            const stepScore = stepScores[parseInt(stepIndex)] || 0
            const contribution = (stepScore / 100) * pointsPerStep
            return sum + contribution
          }, 0)
        : 0

      console.log('최종 점수:', finalScore)

      // 피드백 생성
      const feedback = generateDetailedFeedback(Math.round(finalScore * 10) / 10, selectedActions)

      // 훈련 완료 데이터 저장
      const trainingData = {
        scenarioId: parseInt(scenarioId),
        scenarioTitle: scenario.title,
        participant: userProfile?.name || 'Unknown',
        role: userRole,
        score: Math.round(finalScore * 10) / 10,
        timeSpent: formatTime(timeElapsed),
        actions: selectedActions,
        stepScores,
        feedback: feedback.message,
        detailedFeedback: feedback,
        completedAt: new Date().toISOString()
      }

      console.log('훈련 데이터 저장:', trainingData)
      completeTraining(trainingData)

      // 훈련 완료 후 evaluation 단계로 전환
      console.log('🔄 Phase 변경 시작 - 현재 phase:', currentPhase)
      setIsRunning(false)
      setIsPaused(false)
      
      // 상태 업데이트
      console.log('🎯 setCurrentPhase("evaluation") 호출')
      setCurrentPhase('evaluation')
      
      // ✅ AI 피드백 생성 호출 추가!
      console.log('🤖 AI 피드백 생성 호출 시작')
      generateAIFeedback(trainingData)
      
      console.log('✅ Phase 변경 완료')
      
      return // 함수 종료
    }
    
    // 다음 단계로 진행
    setCurrentStep(currentStep + 1)
    setStepStartTime(Date.now())
  }

  // 리포트 다운로드 함수
  const downloadReport = () => {
    const scoreValues = Object.values(stepScores)
    const finalScore = scoreValues.length > 0 ? Math.round(scoreValues.reduce((sum, score) => sum + score, 0) / scoreValues.length) : 0
    const feedback = generateDetailedFeedback(finalScore, selectedActions)

    // 리포트 데이터 구성
    const reportData = {
      participant: userProfile?.name || 'Unknown',
      company: userProfile?.company || 'Unknown',
      department: userProfile?.department || 'Unknown',
      position: userProfile?.position || 'Unknown',
      role: userRole,
      scenario: scenario.title,
      scenarioType: scenario.type,
      difficulty: scenario.difficulty,
      completedAt: new Date().toLocaleString('ko-KR'),
      duration: formatTime(timeElapsed),
      finalScore: finalScore,
      grade: finalScore >= 80 ? '우수' : finalScore >= 60 ? '양호' : finalScore >= 40 ? '보통' : '미흡',
      stepScores: stepScores,
      selectedActions: selectedActions,
      feedback: feedback,
      stepTimes: stepTimes,
      descriptiveAnswers: descriptiveAnswers
    }

    // HTML 리포트 생성
    const htmlReport = generateHTMLReport(reportData)

    // 파일 다운로드
    const blob = new Blob([htmlReport], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `훈련리포트_${userProfile?.name}_${scenario.title}_${new Date().toISOString().split('T')[0]}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    showSuccess('리포트 다운로드', '훈련 리포트가 성공적으로 다운로드되었습니다.')
  }

  // HTML 리포트 생성 함수
  const generateHTMLReport = (data) => {
    return `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>훈련 리포트 - ${data.scenario}</title>
    <style>
        body { font-family: 'Malgun Gothic', sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; border-bottom: 3px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
        .title { font-size: 28px; font-weight: bold; color: #1f2937; margin-bottom: 10px; }
        .subtitle { font-size: 16px; color: #6b7280; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
        .info-card { background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6; }
        .info-label { font-weight: bold; color: #374151; margin-bottom: 5px; }
        .info-value { color: #6b7280; }
        .score-section { text-align: center; margin: 30px 0; }
        .score-circle { display: inline-block; width: 120px; height: 120px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        .grade { font-size: 18px; font-weight: bold; color: #059669; }
        .section { margin: 30px 0; }
        .section-title { font-size: 20px; font-weight: bold; color: #1f2937; margin-bottom: 15px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
        .action-item { background: #f9fafb; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #10b981; }
        .action-step { font-weight: bold; color: #374151; margin-bottom: 5px; }
        .action-text { color: #6b7280; margin-bottom: 5px; }
        .action-score { font-weight: bold; color: #059669; }
        .feedback-section { background: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; }
        .feedback-title { font-weight: bold; color: #92400e; margin-bottom: 10px; }
        .feedback-text { color: #78350f; line-height: 1.6; }
        .improvements { background: #fef2f2; padding: 20px; border-radius: 8px; border-left: 4px solid #ef4444; }
        .improvements-title { font-weight: bold; color: #991b1b; margin-bottom: 10px; }
        .improvements-list { color: #7f1d1d; }
        .improvements-list li { margin: 5px 0; }
        .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
        @media print { body { background: white; } .container { box-shadow: none; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="title">🏆 SHE 디지털트윈 훈련 리포트</div>
            <div class="subtitle">${data.scenario}</div>
        </div>

        <div class="info-grid">
            <div class="info-card">
                <div class="info-label">👤 참가자</div>
                <div class="info-value">${data.participant}</div>
            </div>
            <div class="info-card">
                <div class="info-label">🏢 회사</div>
                <div class="info-value">${data.company}</div>
            </div>
            <div class="info-card">
                <div class="info-label">📋 부서</div>
                <div class="info-value">${data.department}</div>
            </div>
            <div class="info-card">
                <div class="info-label">💼 직책</div>
                <div class="info-value">${data.position}</div>
            </div>
            <div class="info-card">
                <div class="info-label">🎭 역할</div>
                <div class="info-value">${data.role}</div>
            </div>
            <div class="info-card">
                <div class="info-label">📅 완료일시</div>
                <div class="info-value">${data.completedAt}</div>
            </div>
        </div>

        <div class="score-section">
            <div class="score-circle">${data.finalScore}점</div>
            <div class="grade">등급: ${data.grade}</div>
        </div>

        <div class="section">
            <div class="section-title">📊 훈련 정보</div>
            <div class="info-grid">
                <div class="info-card">
                    <div class="info-label">⏱️ 소요 시간</div>
                    <div class="info-value">${data.duration}</div>
                </div>
                <div class="info-card">
                    <div class="info-label">📈 시나리오 유형</div>
                    <div class="info-value">${data.scenarioType}</div>
                </div>
                <div class="info-card">
                    <div class="info-label">🎯 난이도</div>
                    <div class="info-value">${data.difficulty}</div>
                </div>
                <div class="info-card">
                    <div class="info-label">📝 수행 행동 수</div>
                    <div class="info-value">${data.selectedActions.length}개</div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">📋 수행 행동 내역</div>
            ${data.selectedActions.map((action, index) => `
                <div class="action-item">
                    <div class="action-step">단계 ${action.step + 1}: ${action.action}</div>
                    <div class="action-text">${action.descriptiveAnswer || '선택된 행동'}</div>
                    <div class="action-score">점수: ${action.score || '--'}점</div>
                </div>
            `).join('')}
        </div>

        <div class="section">
            <div class="section-title">💬 피드백</div>
            <div class="feedback-section">
                <div class="feedback-title">📝 종합 평가</div>
                <div class="feedback-text">${data.feedback.message}</div>
            </div>
            
            ${data.feedback.improvements && data.feedback.improvements.length > 0 ? `
                <div class="improvements">
                    <div class="improvements-title">🔧 개선 사항</div>
                    <ul class="improvements-list">
                        ${data.feedback.improvements.map(improvement => `<li>${improvement}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>

        <div class="footer">
            <p>이 리포트는 SHE 디지털트윈 시스템에서 자동 생성되었습니다.</p>
            <p>생성일시: ${new Date().toLocaleString('ko-KR')}</p>
        </div>
    </div>
</body>
</html>
    `
  }

  // 훈련 세션 완료
  const completeTrainingSession = useCallback(async () => {
    console.log('훈련 세션 완료 함수 호출됨')
    console.log('현재 phase:', currentPhase)
    console.log('현재 step:', currentStep)

    // 최종 점수 계산 (100점 기준)
    const totalSteps = scenario.timeline?.length || 23
    const pointsPerStep = 100 / totalSteps
    const completedSteps = Object.keys(stepScores)
    
    const finalScore = completedSteps.length > 0
      ? completedSteps.reduce((sum, stepIndex) => {
          const stepScore = stepScores[parseInt(stepIndex)] || 0
          const contribution = (stepScore / 100) * pointsPerStep
          return sum + contribution
        }, 0)
      : 0

    console.log('최종 점수 계산:', finalScore)

    // 훈련 완료 데이터 준비
    const trainingData = {
      scenarioId: parseInt(scenarioId),
      scenarioTitle: scenario.title,
      participant: userProfile?.name || 'Unknown',
      role: userRole,
      score: Math.round(finalScore * 10) / 10,
      timeSpent: formatTime(timeElapsed),
      actions: selectedActions,
      stepScores,
      totalSteps,
      completedAt: new Date().toISOString()
    }

    // 훈련 완료 후 evaluation 단계로 전환
    console.log('훈련 완료 - evaluation 단계로 전환 시작')
    setIsRunning(false)
    setIsPaused(false)
    setCurrentPhase('evaluation')
    
    // AI 피드백 생성 시작 (비동기)
    generateAIFeedback(trainingData)
    
    // 기본 훈련 데이터 저장
    completeTraining(trainingData)
    
    console.log('✅ Phase 변경 완료')
  }, [scenario, stepScores, selectedActions, userProfile, userRole, timeElapsed, scenarioId, completeTraining, currentPhase, setCurrentPhase])

  // AI 피드백 생성 함수
  const generateAIFeedback = useCallback(async (trainingData) => {
    console.log('🚀 AI 피드백 생성 함수 시작')
    console.log('📊 훈련 데이터:', trainingData)
    console.log('🔧 AI 서비스 존재:', !!aiService)
    
    setIsGeneratingFeedback(true)
    console.log('⏳ 피드백 생성 상태 설정: true')
    
    try {
      console.log('📡 aiService.generateTrainingFeedback 호출 중...')
      const feedback = await aiService.generateTrainingFeedback(trainingData)
      console.log('✅ AI 피드백 생성 성공:', feedback)
      console.log('🎯 AI 생성 여부:', feedback?.aiGenerated)
      
      setFeedbackData(feedback)
      console.log('💾 피드백 데이터 저장 완료')
    } catch (error) {
      console.error('💥 AI 피드백 생성 중 오류 발생:', error)
      console.error('🔍 오류 메시지:', error.message)
      
      // OpenAI API 할당량 초과 등의 경우 사용자에게 알림
      if (error.message && (
        error.message.includes('429') || 
        error.message.includes('insufficient_quota') ||
        error.message.includes('quota')
      )) {
        console.warn('⚠️ OpenAI API 할당량 초과 - 기본 피드백 사용')
        showWarning('OpenAI API 할당량 초과', 'OpenAI API 할당량이 초과되어 기본 피드백을 제공합니다.')
      }
      
      // 기본 피드백으로 대체
      console.log('🔄 기본 피드백으로 전환 중...')
      const fallbackFeedback = generateDetailedFeedback(trainingData.score, trainingData.actions)
      console.log('📋 기본 피드백 생성:', fallbackFeedback)
      setFeedbackData(fallbackFeedback)
    } finally {
      console.log('⏹️ 피드백 생성 상태 설정: false')
      setIsGeneratingFeedback(false)
      console.log('✅ AI 피드백 생성 프로세스 완료')
    }
  }, [])

  // 상세 피드백 생성
  const generateDetailedFeedback = (score, actions) => {
    let template
    if (score >= 90) template = feedbackTemplates.excellent
    else if (score >= 80) template = feedbackTemplates.good
    else if (score >= 70) template = feedbackTemplates.average
    else if (score >= 60) template = feedbackTemplates.poor
    else template = feedbackTemplates.fail

    const scenarioFeedback = scenarioSpecificFeedback[scenario.type] || {}

    // 하드코딩된 역할별 액션 (fallback)
    const hardcodedRoleActions3 = {
      '관제운영반장': {
        correctActions: [
          '상황 파악 및 판단',
          '현장출동반 지시',
          '유관기관 통보',
          '상위 보고',
          '지시 전파',
          '의사결정'
        ],
        criticalActions: ['상황 파악 및 판단', '현장출동반 지시'],
        timeLimit: 300
      },
      '현장출동반': {
        correctActions: [
          '안전장비 착용',
          '현장 출동',
          '가스 농도 측정',
          '안전 구역 설정',
          '밸브 차단',
          '상황 보고'
        ],
        criticalActions: ['안전장비 착용', '현장 출동'],
        timeLimit: 300
      },
      '안전관리반': {
        correctActions: [
          '대피 계획 수립',
          '대피 방송',
          '안전 구역 설정',
          '응급처치',
          '대피 완료 확인',
          '안전 점검'
        ],
        criticalActions: ['대피 계획 수립', '대피 방송'],
        timeLimit: 300
      },
      '고객서비스반': {
        correctActions: [
          '고객 안전 확인',
          '상황 안내',
          '문의 대응',
          '복구 일정 공지',
          '불만 처리',
          '서비스 복구'
        ],
        criticalActions: ['고객 안전 확인', '상황 안내'],
        timeLimit: 300
      },
      '기술반': {
        correctActions: [
          '원인 조사',
          '복구 계획 수립',
          '자재 확보',
          '작업 감독',
          '품질 검사',
          '완료 확인'
        ],
        criticalActions: ['원인 조사', '복구 계획 수립'],
        timeLimit: 300
      },
      '관제운영반': {
        correctActions: [
          '상황 파악 및 판단',
          '현장출동반 지시',
          '유관기관 통보',
          '상위 보고',
          '지시 전파',
          '의사결정'
        ],
        criticalActions: ['상황 파악 및 판단', '현장출동반 지시'],
        timeLimit: 300
      },
      '상황반': {
        correctActions: [
          '신고 접수',
          '사고 개요 파악',
          '상황 보고',
          '정보 전달'
        ],
        criticalActions: ['신고 접수', '사고 개요 파악'],
        timeLimit: 300
      },
      '홍보반': {
        correctActions: [
          '보도자료 작성',
          '언론 브리핑',
          '고객 안내',
          '상황 공지'
        ],
        criticalActions: ['보도자료 작성', '언론 브리핑'],
        timeLimit: 300
      }
    }

    // 개인화된 피드백 생성
    const criticalActionsMissed = []
    const excellentActions = []
    const improvementAreas = []
    const lowScoreSteps = [] // 낮은 점수를 받은 단계들

    // 단계별 점수 분석
    Object.keys(stepScores).forEach(stepIndex => {
      const stepScore = stepScores[parseInt(stepIndex)]
      const step = scenario.timeline[parseInt(stepIndex)]
      if (step && stepScore < 60) {
        lowScoreSteps.push({
          stepTitle: step.title || `단계 ${parseInt(stepIndex) + 1}`,
          score: stepScore,
          stepIndex: parseInt(stepIndex)
        })
      }
    })

    scenario.timeline.forEach((step, index) => {
      const roleActions = step.roleBasedActions?.[userRole] || roleActionGuides?.[userRole] || hardcodedRoleActions3?.[userRole]
      if (!roleActions) return

      const stepActions = actions.filter(a => a.step === index)
      const stepScore = stepScores[index] || 0

      // 필수 조치 누락 확인
      roleActions.criticalActions?.forEach(criticalAction => {
        const performed = stepActions.some(a => a.action === criticalAction && a.isCorrect)
        if (!performed) {
          criticalActionsMissed.push(`${step.title}: ${criticalAction}`)
        }
      })

      // 우수한 대응 확인
      stepActions.forEach(action => {
        if (action.isCorrect && action.isCritical) {
          excellentActions.push(`${step.title}: ${action.action}`)
        }
      })

      // 낮은 점수 단계의 개선 사항 추가
      if (stepScore < 60 && step.teamDiscussion) {
        improvementAreas.push(`${step.title} 단계에서 정확한 답변 선택이 필요합니다.`)
      }
    })

    // 미흡한 단계에 대한 구체적인 피드백 추가
    if (lowScoreSteps.length > 0) {
      lowScoreSteps.forEach(({ stepTitle, score }) => {
        improvementAreas.push(`${stepTitle} 단계에서 ${Math.round(score)}점을 받았습니다. 해당 단계의 절차를 다시 확인하세요.`)
      })
    }

    return {
      ...template,
      score,
      timeSpent: formatTime(timeElapsed),
      criticalActionsMissed,
      excellentActions,
      scenarioSpecificTips: scenarioFeedback.expertTips || [],
      commonMistakes: scenarioFeedback.commonMistakes || [],
      personalizedImprovement: improvementAreas
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!scenario) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-warning-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">시나리오를 찾을 수 없습니다</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
          >
            대시보드로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  // 브리핑 화면
  console.log('🔍 브리핑 화면 조건 확인:', currentPhase === 'briefing')
  if (currentPhase === 'briefing') {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              대시보드로 돌아가기
            </button>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${scenario.severity === 'high' ? 'bg-danger-50 text-danger-600' :
              scenario.severity === 'medium' ? 'bg-warning-50 text-warning-600' :
                'bg-success-50 text-success-600'
              }`}>
              {scenario.severity === 'high' ? '높음' :
                scenario.severity === 'medium' ? '중간' : '낮음'}
            </div>
          </div>

          {/* 시나리오 정보 */}
          <div className="text-center mb-8">
            <AlertTriangle className="h-16 w-16 text-warning-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{scenario.title}</h1>
            <p className="text-lg text-gray-600 mb-6">{scenario.description}</p>
          </div>

          {/* 초기 상황 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 초기 상황</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm"><strong>시간:</strong> {scenario.initialSituation.time}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm"><strong>위치:</strong> {scenario.initialSituation.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Thermometer className="h-4 w-4 text-gray-500" />
                  <span className="text-sm"><strong>날씨:</strong> {scenario.initialSituation.weather}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm"><strong>신고자:</strong> {scenario.initialSituation.reportedBy}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-warning-50 border border-warning-200 rounded-lg">
                <p className="text-sm text-warning-800">
                  <strong>신고 내용:</strong> {scenario.initialSituation.initialReport}
                </p>
              </div>
            </div>

            <div className="bg-danger-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-danger-900 mb-4">⚠️ 위험 요소</h3>
              <ul className="space-y-2">
                {scenario.initialSituation.riskFactors.map((risk, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-danger-800">
                    <AlertTriangle className="h-3 w-3" />
                    {risk}
                  </li>
                ))}
              </ul>
            </div>
          </div>


          {/* 상황 지도 */}
          <div className="mb-8">
            <EmergencyMap
              scenario={scenario}
              currentStep={0}
              userActions={[]}
            />
          </div>

          {/* 훈련 시작 */}
          <div className="text-center">
            <div className="mb-4">
              <p className="text-gray-600 mb-2">예상 훈련 시간: {scenario.timeline.length * 5}분</p>
              <p className="text-sm text-gray-500">
                실제 비상상황이라고 가정하고 신속하고 정확하게 대응해주세요.
              </p>
            </div>

            <button
              onClick={startTraining}
              disabled={isLoading}
              className={`px-8 py-3 rounded-lg transition-colors flex items-center gap-2 mx-auto text-lg font-medium ${isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-danger-600 text-white hover:bg-danger-700'
                }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  훈련 준비 중...
                </>
              ) : (
                <>
                  <Play className="h-5 w-5" />
                  비상 훈련 시작
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 훈련 진행 화면
  console.log('🔍 훈련 화면 조건 확인:', currentPhase === 'training')
  if (currentPhase === 'training') {
    const currentStepData = scenario.timeline[currentStep] || {
      id: currentStep + 1,
      time: `${Math.floor(currentStep / 4) + 9}:${(currentStep % 4) * 15}`,
      title: `단계 ${currentStep + 1}`,
      situation: '훈련 진행 중',
      realTimeInfo: {
        gasConcentration: '정상',
        repairProgress: '진행 중',
        workSafety: '양호',
        customerImpact: '영향 없음'
      },
      roleBasedActions: {
        [userRole]: {
          correctActions: ['적절한 대응 조치'],
          timeLimit: 300,
          criticalActions: ['적절한 대응 조치'],
          tips: '상황에 맞는 적절한 조치를 선택하세요.'
        }
      }
    }

    // 하드코딩된 역할별 액션 (fallback)
    const hardcodedRoleActions = {
      '관제운영반장': {
        correctActions: [
          '상황 파악 및 판단',
          '현장출동반 지시',
          '유관기관 통보',
          '상위 보고',
          '지시 전파',
          '의사결정'
        ],
        criticalActions: ['상황 파악 및 판단', '현장출동반 지시'],
        timeLimit: 300
      },
      '현장출동반': {
        correctActions: [
          '안전장비 착용',
          '현장 출동',
          '가스 농도 측정',
          '안전 구역 설정',
          '밸브 차단',
          '상황 보고'
        ],
        criticalActions: ['안전장비 착용', '현장 출동'],
        timeLimit: 300
      },
      '안전관리반': {
        correctActions: [
          '대피 계획 수립',
          '대피 방송',
          '안전 구역 설정',
          '응급처치',
          '대피 완료 확인',
          '안전 점검'
        ],
        criticalActions: ['대피 계획 수립', '대피 방송'],
        timeLimit: 300
      },
      '고객서비스반': {
        correctActions: [
          '고객 안전 확인',
          '상황 안내',
          '문의 대응',
          '복구 일정 공지',
          '불만 처리',
          '서비스 복구'
        ],
        criticalActions: ['고객 안전 확인', '상황 안내'],
        timeLimit: 300
      },
      '기술반': {
        correctActions: [
          '원인 조사',
          '복구 계획 수립',
          '자재 확보',
          '작업 감독',
          '품질 검사',
          '완료 확인'
        ],
        criticalActions: ['원인 조사', '복구 계획 수립'],
        timeLimit: 300
      },
      '홍보반': {
        correctActions: [
          '보도자료 작성',
          '언론 브리핑',
          'SNS 공지',
          '정보 공개',
          '언론 대응',
          '신뢰 관리'
        ],
        criticalActions: ['보도자료 작성', '언론 브리핑'],
        timeLimit: 300
      }
    }

    const roleActions = currentStepData?.roleBasedActions?.[userRole] || roleActionGuides?.[userRole] || hardcodedRoleActions?.[userRole]

    // currentStepData가 없는 경우 처리
    if (!currentStepData) {
      return (
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 text-warning-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              훈련 단계 데이터를 찾을 수 없습니다
            </h2>
            <p className="text-gray-600 mb-4">
              현재 단계: {currentStep}, 전체 단계: {scenario.timeline.length}
            </p>
            <button
              onClick={() => setCurrentPhase('briefing')}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
            >
              브리핑으로 돌아가기
            </button>
          </div>
        </div>
      )
    }

    // 역할이 정의되지 않은 경우 기본 역할 가이드 사용
    const defaultRoleActions = {
      title: `${userRole} 역할 수행`,
      description: '현재 상황에 맞는 적절한 대응을 수행하세요.',
      timeLimit: 300,
      actions: [
        { id: 'situation_assessment', text: '상황 파악', points: 10 },
        { id: 'report', text: '상황 보고', points: 15 },
        { id: 'safety_check', text: '안전 확인', points: 20 }
      ],
      criticalActions: ['상황 파악', '안전 확인'],
      feedback: '기본적인 대응을 수행했습니다.'
    }

    const finalRoleActions = roleActions || defaultRoleActions

    const timeLeft = Math.max(0, finalRoleActions.timeLimit - timeElapsed)
    const isTimeWarning = timeLeft <= finalRoleActions.timeLimit * 0.2
    const isTimeCritical = timeLeft <= 10

    return (
      <div className="max-w-6xl mx-auto p-6">
        {/* 상단 제어판 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">

              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-bold ${timeRemaining <= 60 ? 'bg-red-100 text-red-800 border-2 border-red-300' :
                timeRemaining <= 120 ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300' :
                  'bg-green-100 text-green-800 border-2 border-green-300'
                }`}>
                <Clock className="h-5 w-5" />
                <span className="min-w-[60px]">
                  {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                </span>
              </div>

            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={togglePause}
                className="flex items-center gap-2 px-3 py-2 bg-warning-100 text-warning-700 rounded-lg hover:bg-warning-200"
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                {isPaused ? '재개' : '일시정지'}
              </button>


              <button
                onClick={resetTraining}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                <RotateCcw className="h-4 w-4" />
                다시시작
              </button>
            </div>
          </div>
        </div>

        {/* 현재 상황 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 space-y-6">
            {/* 상황 지도 */}
            <EmergencyMap
              scenario={scenario}
              currentStep={currentStep}
              userActions={selectedActions}
            />

            {/* 상황 설명 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-full ${alertLevel === 'critical' ? 'bg-danger-100' :
                  alertLevel === 'warning' ? 'bg-warning-100' :
                    'bg-success-100'
                  }`}>
                  <AlertTriangle className={`h-5 w-5 ${alertLevel === 'critical' ? 'text-danger-600' :
                    alertLevel === 'warning' ? 'text-warning-600' :
                      'text-success-600'
                    }`} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{currentStepData.title}</h2>
                  <p className="text-sm text-gray-500">{currentStepData.time}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-gray-900 mb-2">🚨 현재 상황</h3>
                <p className="text-gray-700">{currentStepData.situation}</p>
              </div>

              {/* 사고 상황 접수 단계 - 초기 상황 정보 표시 */}
              {currentStep === 0 && scenario.initialSituation && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-yellow-900 mb-3">📋 사고 상황 정보</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-yellow-800">발생 시간:</span>
                      <span className="ml-2 text-yellow-900">
                        {scenario.initialSituation.date || ''} {scenario.initialSituation.time}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-yellow-800">발생 장소:</span>
                      <span className="ml-2 text-yellow-900">{scenario.initialSituation.location}</span>
                    </div>
                    <div>
                      <span className="font-medium text-yellow-800">날씨:</span>
                      <span className="ml-2 text-yellow-900">{scenario.initialSituation.weather}</span>
                    </div>
                    <div>
                      <span className="font-medium text-yellow-800">신고자:</span>
                      <span className="ml-2 text-yellow-900">
                        {scenario.initialSituation.reportedBy}
                        {scenario.initialSituation.reporterPhone && ` (${scenario.initialSituation.reporterPhone})`}
                      </span>
                    </div>
                    <div className="md:col-span-2">
                      <span className="font-medium text-yellow-800">신고 내용:</span>
                      <p className="mt-1 text-yellow-900">{scenario.initialSituation.initialReport}</p>
                    </div>
                    <div className="md:col-span-2">
                      <span className="font-medium text-yellow-800">위험 요인:</span>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {scenario.initialSituation.riskFactors.map((factor, idx) => (
                          <span key={idx} className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                            {factor}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 팀 토의 질문 (담당조직 및 주요 행동인원 표시) */}
              {currentStepData.teamDiscussion && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  {/* 담당조직 및 주요 행동인원 표시 */}
                  <div className="flex items-center gap-4 mb-4 pb-3 border-b border-blue-300">
                    {currentStepData.teamDiscussion.responsibleOrganization && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-700" />
                        <span className="text-sm font-medium text-blue-900">
                          담당조직: {currentStepData.teamDiscussion.responsibleOrganization}
                        </span>
                      </div>
                    )}
                    {currentStepData.teamDiscussion.responsiblePersonnel && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-700" />
                        <span className="text-sm font-medium text-blue-900">
                          주요 행동인원: {currentStepData.teamDiscussion.responsiblePersonnel}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* 팀 토의 질문 */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-blue-900 mb-2">👥 팀 토의 질문</h4>
                    <p className="text-blue-800 mb-2 font-medium">{currentStepData.teamDiscussion.question}</p>
                    {currentStepData.teamDiscussion.description && (
                      <p className="text-blue-700 text-sm mb-4">{currentStepData.teamDiscussion.description}</p>
                    )}
                    
                    {/* 서술형 답변 입력 */}
                    {currentStepData.teamDiscussion.inputType === 'descriptive' && currentStepData.teamDiscussion.requiredFields && (
                      <div className="space-y-4">
                        {currentStepData.teamDiscussion.requiredFields.map((field, fieldIndex) => {
                          const fieldAnswer = descriptiveAnswers[`${currentStep}_${field.id}`] || ''
                          const isFieldAnswered = fieldAnswer.trim().length > 0
                          
                          return (
                            <div key={field.id} className="bg-white rounded-lg p-4 border border-blue-200">
                              <label className="block text-sm font-medium text-blue-900 mb-2">
                                {fieldIndex + 1}. {field.label}
                                <span className="text-red-500 ml-1">*</span>
                              </label>
                              <textarea
                                id={`teamDiscussion_${currentStep}_${field.id}`}
                                rows={3}
                                value={fieldAnswer}
                                onChange={(e) => {
                                  setDescriptiveAnswers(prev => ({
                                    ...prev,
                                    [`${currentStep}_${field.id}`]: e.target.value
                                  }))
                                }}
                                placeholder={field.placeholder}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                disabled={isPaused}
                              />
                              {isFieldAnswered && (
                                <div className="mt-2 flex items-center gap-2 text-xs text-green-600">
                                  <CheckCircle className="h-3 w-3" />
                                  <span>답변이 입력되었습니다.</span>
                                </div>
                              )}
                            </div>
                          )
                        })}
                        
                        {/* 제출 버튼 */}
                        <button
                          onClick={() => {
                            // 모든 필수 필드 확인
                            const allFieldsAnswered = currentStepData.teamDiscussion.requiredFields.every(field => {
                              const answer = descriptiveAnswers[`${currentStep}_${field.id}`] || ''
                              return answer.trim().length > 0
                            })
                            
                            if (!allFieldsAnswered) {
                              showWarning('입력 필요', '모든 항목을 입력해주세요.')
                              return
                            }
                            
                            // 모든 답변을 하나의 액션으로 저장
                            const allAnswers = currentStepData.teamDiscussion.requiredFields.map(field => {
                              const answer = descriptiveAnswers[`${currentStep}_${field.id}`] || ''
                              return `${field.label}: ${answer}`
                            }).join('\n')
                            
                            // 서술형 답변 제출
                            const stepTime = Math.floor((Date.now() - stepStartTime) / 1000)
                            
                            // 답변 평가 (키워드 기반 평가)
                            let score = 0
                            const totalFields = currentStepData.teamDiscussion.requiredFields.length
                            const pointsPerField = 100 / totalFields
                            
                            // 각 필드별로 정확도 확인
                            currentStepData.teamDiscussion.requiredFields.forEach((field) => {
                              const fieldAnswer = descriptiveAnswers[`${currentStep}_${field.id}`] || ''
                              const answerLower = fieldAnswer.toLowerCase().trim()
                              
                              if (field.id === 'datetime') {
                                // 사고 발생 시간: 일/시/분 형식 확인
                                // 날짜, 시, 분이 모두 포함되어 있는지 확인
                                const hasDate = /일|년|월/.test(answerLower) || /\d{4}년|\d{1,2}월|\d{1,2}일/.test(fieldAnswer)
                                const hasTime = /시|분/.test(answerLower) || /\d{1,2}시|\d{1,2}분/.test(fieldAnswer)
                                
                                if (hasDate && hasTime && answerLower.length > 5) {
                                  score += pointsPerField
                                } else if (hasDate || hasTime) {
                                  score += pointsPerField * 0.5 // 부분 점수
                                }
                              } else if (field.id === 'reporter') {
                                // 신고자: 이름은 홍길동, 전화번호는 010-1234-5678
                                const hasName = answerLower.includes('홍길동')
                                const hasPhone = /010-1234-5678|01012345678/.test(fieldAnswer.replace(/\s/g, ''))
                                
                                if (hasName && hasPhone) {
                                  score += pointsPerField
                                } else if (hasName || hasPhone) {
                                  score += pointsPerField * 0.5 // 부분 점수
                                }
                              } else if (field.id === 'scale') {
                                // 사고의 규모: 신고 내용의 키워드들이 들어가면 인정
                                const initialSituation = scenario.initialSituation
                                const scaleKeywords = initialSituation?.scaleKeywords || [
                                  '무단굴착', '굴착', '가스 냄새', '배관 파손', '중압배관', '누출', '의심'
                                ]
                                
                                // 키워드 매칭 개수 확인
                                let matchedKeywords = 0
                                scaleKeywords.forEach(keyword => {
                                  if (answerLower.includes(keyword.toLowerCase())) {
                                    matchedKeywords++
                                  }
                                })
                                
                                // 키워드가 2개 이상 포함되면 만점, 1개면 부분 점수
                                if (matchedKeywords >= 2) {
                                  score += pointsPerField
                                } else if (matchedKeywords === 1) {
                                  score += pointsPerField * 0.6
                                } else if (answerLower.length > 10) {
                                  // 키워드는 없지만 내용이 있으면 최소 점수
                                  score += pointsPerField * 0.3
                                }
                              } else if (field.id === 'location') {
                                // 사고 발생 장소: 기본적으로 내용이 있으면 점수 부여
                                if (answerLower.length > 5) {
                                  score += pointsPerField
                                }
                              } else {
                                // 기타 필드: 내용이 있으면 점수 부여
                                if (answerLower.length > 5) {
                                  score += pointsPerField
                                }
                              }
                            })
                            
                            const newAction = {
                              step: currentStep,
                              action: currentStepData.teamDiscussion.question,
                              isCorrect: score >= 60,
                              isCritical: true,
                              timeSpent: stepTime,
                              timestamp: new Date().toISOString(),
                              descriptiveAnswer: allAnswers,
                              descriptiveScore: score,
                              descriptiveGrade: score >= 80 ? '정확' : score >= 60 ? '우수' : score >= 40 ? '보통' : '미흡'
                            }
                            
                            // 현재 단계에서 이미 선택된 행동이 있다면 제거
                            const currentStepActions = selectedActions.filter(a => a.step !== currentStep)
                            setSelectedActions([...currentStepActions, newAction])
                            
                            // 사용자 선택 기록
                            setUserChoices(prev => ({
                              ...prev,
                              [currentStep]: [newAction]
                            }))
                            
                            // 단계별 시간 및 점수 기록
                            setStepTimes(prev => ({
                              ...prev,
                              [currentStep]: stepTime
                            }))
                            
                            setStepScores(prev => ({
                              ...prev,
                              [currentStep]: score
                            }))
                            
                            showSuccess('답변 제출 완료', '모든 항목이 제출되었습니다.')
                          }}
                          disabled={isPaused}
                          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                          답변 제출
                        </button>
                      </div>
                    )}
                    
                    {/* 객관식 선택지 (기존 방식) */}
                    {currentStepData.teamDiscussion.inputType === 'multiple_choice' && currentStepData.teamDiscussion.options && (
                      <div className="space-y-2">
                        {currentStepData.teamDiscussion.options.map((option, index) => {
                          const isSelected = userChoices[currentStep]?.some(choice => choice.action === option)
                          const isCorrect = option === currentStepData.teamDiscussion.correctAnswer
                          const isSubmitted = stepScores[currentStep] !== undefined // 답안 제출 여부 확인
                          
                          return (
                            <button
                              key={index}
                              onClick={() => handleActionSelect(option)}
                              disabled={isSelected || isPaused}
                              className={`w-full text-left p-3 rounded-lg border transition-all text-sm ${
                                isSelected && isSubmitted
                                  ? isCorrect
                                    ? 'bg-green-100 border-green-300 text-green-800'
                                    : 'bg-red-100 border-red-300 text-red-800'
                                  : isSelected
                                    ? 'bg-blue-100 border-blue-300 text-blue-800'
                                    : 'bg-white border-blue-200 text-blue-900 hover:bg-blue-100'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                                <span>{option}</span>
                                {isSelected && isSubmitted && (
                                  <span className="ml-auto text-xs">
                                    {isCorrect ? '✓' : '✗'}
                                  </span>
                                )}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    )}

                    {/* 부정형 선택지 (negative_choice - 올바르지 않은 것은?) */}
                    {currentStepData.teamDiscussion.inputType === 'negative_choice' && currentStepData.teamDiscussion.options && (
                      <div className="space-y-2">
                        {currentStepData.teamDiscussion.options.map((option, index) => {
                          const isSelected = userChoices[currentStep]?.some(choice => choice.action === option)
                          const isCorrect = option === currentStepData.teamDiscussion.correctAnswer
                          const isSubmitted = stepScores[currentStep] !== undefined // 답안 제출 여부 확인
                          
                          return (
                            <button
                              key={index}
                              onClick={() => handleActionSelect(option)}
                              disabled={isSelected || isPaused}
                              className={`w-full text-left p-3 rounded-lg border transition-all text-sm ${
                                isSelected && isSubmitted
                                  ? isCorrect
                                    ? 'bg-green-100 border-green-300 text-green-800'
                                    : 'bg-red-100 border-red-300 text-red-800'
                                  : isSelected
                                    ? 'bg-blue-100 border-blue-300 text-blue-800'
                                    : 'bg-white border-blue-200 text-blue-900 hover:bg-blue-100'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                                <span>{option}</span>
                                {isSelected && isSubmitted && (
                                  <span className="ml-auto text-xs">
                                    {isCorrect ? '✓' : '✗'}
                                  </span>
                                )}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    )}

                    {/* multiple_select는 더 이상 사용하지 않음 - 모든 문제를 단일 선택으로 통일 */}

                    {/* role_matching은 더 이상 사용하지 않음 - 모든 문제를 단일 선택으로 통일 */}

                    {/* multi_question은 더 이상 사용하지 않음 - 모든 문제를 단일 선택으로 통일 */}
                    
                    {/* 정답 설명 (서술형 제출 후 표시) */}
                    {currentStepData.teamDiscussion.explanation && userChoices[currentStep]?.some(choice => 
                      choice.descriptiveAnswer
                    ) && (
                      <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
                        <p className="text-sm text-blue-800">
                          <strong>💡 참고사항:</strong> {currentStepData.teamDiscussion.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 실시간 정보 */}
              {realTimeData && Object.keys(realTimeData).length > 0 && (
                <div className="bg-warning-50 border border-warning-200 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-warning-900 mb-3">📊 실시간 정보</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(realTimeData).map(([key, value]) => (
                      <div key={key} className="text-sm">
                        <span className="font-medium text-warning-800">
                          {key === 'gasConcentration' ? '가스 농도' :
                            key === 'windDirection' ? '바람 방향' :
                              key === 'affectedArea' ? '영향 범위' :
                                key === 'presentPeople' ? '현장 인원' :
                                  key === 'evacuationStatus' ? '대피 현황' :
                                    key === 'emergencyServices' ? '긴급서비스' :
                                      key}:
                        </span>
                        <span className="text-warning-700 ml-2">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 다음 단계 버튼 - 모든 단계에서 표시 */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={proceedToNextStep}
                  disabled={(() => {
                    // 17번째 단계(인덱스 16)부터는 답안 없이도 진행 가능
                    const isOptionalStep = currentStep >= 16
                    if (isOptionalStep) return isPaused
                    // 17번째 단계 이전은 답안이 있어야 진행 가능
                    return isPaused || (!userChoices[currentStep] || userChoices[currentStep].length === 0)
                  })()}
                  className="flex items-center gap-2 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  다음 단계
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">

            {/* 진행 상황 */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-medium text-gray-900 mb-3">📈 진행 상황</h3>
              <div className="space-y-4">
                {/* 시나리오 단계별 진행 상황 */}
                <div>
                  <div className="text-sm font-semibold text-gray-800 mb-2 bg-blue-50 px-2 py-1 rounded">
                    훈련 단계
                  </div>
                  <div className="space-y-1 ml-2">
                    {scenario.timeline && scenario.timeline.map((step, index) => {
                      // 단계 완료 여부 확인 (답안 제출 여부)
                      const stepChoices = userChoices[index] || []
                      const stepScore = stepScores[index]
                      const isSubmitted = stepScore !== undefined // 답안 제출 여부
                      const isCompleted = isSubmitted // 답안 제출 후에만 완료로 간주
                      
                      // 정답 여부 판단 (답안 제출 후에만)
                      let isCorrect = false
                      
                      if (isSubmitted && stepScore !== undefined) {
                        // 점수가 있으면 60점 이상이면 정답
                        isCorrect = stepScore >= 60
                      } else if (isSubmitted && stepChoices.length > 0) {
                        // 점수가 없으면 선택한 답변의 isCorrect 속성 확인
                        if (stepChoices.length === 1) {
                          // 단일 선택인 경우
                          isCorrect = stepChoices[0].isCorrect === true
                        } else {
                          // 복수 선택인 경우 - 모든 선택이 정답이어야 함
                          const allCorrect = stepChoices.every(choice => choice.isCorrect === true)
                          const hasAnyCorrect = stepChoices.some(choice => choice.isCorrect === true)
                          isCorrect = allCorrect && hasAnyCorrect
                        }
                      }
                      
                      // 색상 결정: 정답(초록), 오답(빨강), 미완료(회색)
                      // 답안 제출 후에만 색상 변경
                      let circleColor = 'bg-gray-300'
                      let textColor = 'text-gray-400'
                      let showIcon = false
                      let iconType = null // 'check' or 'x'
                      
                      if (isCompleted && isSubmitted) {
                        if (isCorrect) {
                          circleColor = 'bg-green-500'
                          textColor = 'text-green-600'
                          showIcon = true
                          iconType = 'check'
                        } else {
                          circleColor = 'bg-red-500'
                          textColor = 'text-red-600'
                          showIcon = true
                          iconType = 'x'
                        }
                      }
                      
                      return (
                        <div key={step.id || index}>
                          <div className={`flex items-center justify-between text-xs ${textColor}`}>
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full flex items-center justify-center ${circleColor}`}>
                                {showIcon && iconType === 'check' && <CheckCircle className="h-2 w-2 text-white" />}
                                {showIcon && iconType === 'x' && <X className="h-2 w-2 text-white" />}
                              </div>
                              <span className="font-medium">{step.title || `단계 ${index + 1}`}</span>
                            </div>
                            <div className="flex gap-2 items-center">
                              {stepTimes[index] !== undefined && (
                                <div className="bg-gradient-to-br from-slate-50 to-slate-200 text-slate-800 px-1.5 py-0.5 rounded-md shadow-sm border border-slate-300 hover:shadow-md transition-all duration-200">
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs">⏱️</span>
                                    <span className="text-xs font-semibold">{stepTimes[index]}초</span>
                                  </div>
                                </div>
                              )}
                              {stepScore !== undefined && (
                                <div className={`px-1.5 py-0.5 rounded-md shadow-sm border transition-all duration-200 ${
                                  stepScore === 100 
                                    ? 'bg-gradient-to-br from-green-50 to-green-200 text-green-800 border-green-300' 
                                    : 'bg-gradient-to-br from-red-50 to-red-200 text-red-800 border-red-300'
                                }`}>
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs">{stepScore === 100 ? '✅' : '❌'}</span>
                                    <span className="text-xs font-semibold">{stepScore}점</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* 실시간 점수 */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-medium text-gray-900 mb-3">🏆 현재 점수</h3>
              <div className="text-center p-4 bg-primary-50 rounded-lg">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {(() => {
                    const totalSteps = scenario.timeline?.length || 23
                    const pointsPerStep = 100 / totalSteps
                    const completedSteps = Object.keys(stepScores)
                    if (completedSteps.length === 0) return '0.0'
                    
                    // 각 단계의 점수를 100/총단계수로 환산하여 합산
                    const totalScore = completedSteps.reduce((sum, stepIndex) => {
                      const stepScore = stepScores[parseInt(stepIndex)] || 0
                      // 단계 점수(0-100)를 총점 기여도로 환산
                      const contribution = (stepScore / 100) * pointsPerStep
                      return sum + contribution
                    }, 0)
                    
                    return Math.round(totalScore * 10) / 10 // 소수점 첫째자리까지
                  })()}점
                </div>
                <div className="text-sm text-primary-700 font-medium">총점 (100점 만점)</div>
                <div className="text-xs text-gray-600 mt-1">
                  완료 단계: {Object.keys(stepScores).length}개 / {scenario.timeline?.length || 23}개
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 평가 화면
  console.log('🔍 렌더링 시 currentPhase 확인:', currentPhase, currentPhase === 'evaluation')
  if (currentPhase === 'evaluation') {
    console.log('✅ 평가 화면 렌더링 시작')
    // 총점 100점 기준으로 계산 (각 단계당 100/23점)
    const totalSteps = scenario.timeline?.length || 23
    const pointsPerStep = 100 / totalSteps
    const completedSteps = Object.keys(stepScores)
    
    const finalScore = completedSteps.length > 0
      ? completedSteps.reduce((sum, stepIndex) => {
          const stepScore = stepScores[parseInt(stepIndex)] || 0
          const contribution = (stepScore / 100) * pointsPerStep
          return sum + contribution
        }, 0)
      : 0
    
    // AI 피드백이 있으면 사용, 없으면 기본 피드백 사용
    const feedback = feedbackData || generateDetailedFeedback(finalScore, selectedActions)

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* 결과 헤더 */}
          <div className="text-center mb-8">
            <Award className="h-16 w-16 text-warning-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">훈련 완료!</h1>
            <p className="text-lg text-gray-600">{scenario.title}</p>
          </div>

          {/* 점수 및 기본 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-primary-50 rounded-lg">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {Math.round(finalScore * 10) / 10}점
              </div>
              <div className="text-sm text-primary-700">최종 점수 (100점 만점)</div>
            </div>

            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {formatTime(timeElapsed)}
              </div>
              <div className="text-sm text-blue-700 font-medium">총 소요 시간</div>
              <div className="text-xs text-gray-600 mt-1">
                현재 단계: {currentStep + 1}
              </div>
            </div>

            <div className="text-center p-6 bg-success-50 rounded-lg">
              <div className="text-3xl font-bold text-success-600 mb-2">
                {selectedActions.filter(a => a.isCorrect).length}
              </div>
              <div className="text-sm text-success-700">올바른 조치</div>
            </div>
          </div>

          {/* AI 피드백 로딩 */}
          {isGeneratingFeedback && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <div>
                  <h3 className="font-medium text-blue-900">🤖 AI 피드백 생성 중...</h3>
                  <p className="text-sm text-blue-700">훈련 결과를 분석하여 개인화된 피드백을 생성하고 있습니다.</p>
                </div>
              </div>
            </div>
          )}

          {/* AI 서비스 상태 표시 */}
          {feedback.aiGenerated && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-purple-600">🤖</span>
                <span className="text-sm font-medium text-purple-800">
                  AI 기반 개인화된 피드백이 생성되었습니다
                </span>
              </div>
            </div>
          )}

          {/* 상세 피드백 */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{feedback.title}</h2>
              <p className="text-gray-700 mb-4">{feedback.message}</p>

              {/* AI 강점 분석 */}
              {feedback.strengths?.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium text-success-900 mb-2">💪 강점</h3>
                  <ul className="text-sm text-success-800 space-y-1">
                    {feedback.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {feedback.excellentActions?.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium text-success-900 mb-2">✅ 우수한 대응</h3>
                  <ul className="text-sm text-success-800 space-y-1">
                    {feedback.excellentActions.map((action, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {feedback.criticalActionsMissed?.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium text-danger-900 mb-2">❌ 놓친 필수 조치</h3>
                  <ul className="text-sm text-danger-800 space-y-1">
                    {feedback.criticalActionsMissed.map((action, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <X className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {feedback.personalizedImprovement?.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium text-warning-900 mb-2">⚠️ 미흡했던 사항</h3>
                  <ul className="text-sm text-warning-800 space-y-1">
                    {feedback.personalizedImprovement.map((improvement, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0 text-warning-600" />
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {feedback.improvements?.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium text-primary-900 mb-2">💡 개선 사항</h3>
                  <ul className="text-sm text-primary-800 space-y-1">
                    {feedback.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Award className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {feedback.commonMistakes?.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium text-danger-900 mb-2">❌ 자주 발생하는 실수</h3>
                  <ul className="text-sm text-danger-800 space-y-1">
                    {feedback.commonMistakes.map((mistake, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <X className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        {mistake}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* AI 구체적 피드백 */}
              {feedback.specificFeedback?.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium text-blue-900 mb-3">🎯 세부 피드백</h3>
                  <div className="space-y-3">
                    {feedback.specificFeedback.map((item, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-blue-200">
                        <h4 className="font-medium text-blue-800 mb-1">{item.category}</h4>
                        <p className="text-sm text-blue-700">{item.feedback}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI 개선 영역 */}
              {feedback.improvementAreas?.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium text-warning-900 mb-2">⚠️ 개선 영역</h3>
                  <ul className="text-sm text-warning-800 space-y-1">
                    {feedback.improvementAreas.map((area, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0 text-warning-600" />
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* AI 행동 계획 */}
              {feedback.actionPlan?.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium text-indigo-900 mb-2">📋 개선 행동 계획</h3>
                  <ul className="text-sm text-indigo-800 space-y-1">
                    {feedback.actionPlan.map((plan, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-indigo-600" />
                        {plan}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 다음 훈련 권장사항 */}
              {feedback.nextTrainingRecommendations?.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium text-purple-900 mb-2">🎓 다음 훈련 권장사항</h3>
                  <ul className="text-sm text-purple-800 space-y-1">
                    {feedback.nextTrainingRecommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 mt-0.5 flex-shrink-0 text-purple-600" />
                        {recommendation}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {feedback.scenarioSpecificTips?.length > 0 && (
                <div>
                  <h3 className="font-medium text-primary-900 mb-2">🎯 전문가 팁</h3>
                  <ul className="text-sm text-primary-800 space-y-1">
                    {feedback.scenarioSpecificTips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Eye className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* 서술형 답변 평가 결과 */}
            {selectedActions.some(action => action.descriptiveAnswer) && (
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="font-medium text-blue-900 mb-3">📝 서술형 답변 평가 결과</h3>
                {selectedActions
                  .filter(action => action.descriptiveAnswer)
                  .map((action, index) => (
                    <div key={index} className="mb-4">
                      <div className="bg-white rounded-lg p-4 border border-blue-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-blue-900">상황 접수 답변</h4>
                          <div className="flex items-center gap-2">
                            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${action.descriptiveScore >= 80 ? 'bg-green-100 text-green-800' :
                              action.descriptiveScore >= 60 ? 'bg-blue-100 text-blue-800' :
                                action.descriptiveScore >= 40 ? 'bg-yellow-100 text-yellow-800' :
                                  action.descriptiveScore >= 20 ? 'bg-orange-100 text-orange-800' :
                                    'bg-red-100 text-red-800'
                              }`}>
                              {action.descriptiveScore}점
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded border">
                          {action.descriptiveAnswer}
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <div className="text-center p-2 bg-blue-50 rounded">
                            <div className="text-sm font-bold text-blue-600">{action.timeSpent}초</div>
                            <div className="text-xs text-blue-700">소요 시간</div>
                          </div>
                          <div className="text-center p-2 bg-primary-50 rounded">
                            <div className="text-sm font-bold text-primary-600">{action.score || '--'}점</div>
                            <div className="text-xs text-primary-700">획득 점수</div>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500 text-center">
                          제출: {new Date(action.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* 다음 단계 */}
            <div className="bg-primary-50 rounded-lg p-6">
              <h3 className="font-medium text-primary-900 mb-3">🚀 다음 단계</h3>
              <ul className="text-sm text-primary-800 space-y-2 mb-4">
                {feedback.nextSteps?.map((step, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    {step}
                  </li>
                )) || []}
              </ul>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-4 justify-center mt-8">
            <button
              onClick={() => navigate('/')}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              대시보드로 돌아가기
            </button>

            <button
              onClick={resetTraining}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              다시 훈련하기
            </button>

            <button
              onClick={downloadReport}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              📄 리포트 다운로드
            </button>

            <button
              onClick={() => navigate('/training-management')}
              className="bg-success-600 text-white px-6 py-3 rounded-lg hover:bg-success-700 transition-colors"
            >
              훈련 결과 보기
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 테스트용 빨간색 박스 */}
      <div style={{
        position: 'fixed',
        top: '0px',
        left: '0px',
        width: '100%',
        height: '50px',
        backgroundColor: 'red',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        fontSize: '20px',
        fontWeight: 'bold'
      }}>
        🚨 테스트: AdvancedTrainingEngine이 렌더링되었습니다! 🚨
      </div>

      {/* 에러 메시지 표시 */}
      <ErrorMessage
        type={error.type}
        title={error.title}
        message={error.message}
        show={error.show}
        onClose={hideError}
      />

      {/* 에러 상태 디버깅 */}
      {/* {console.log('에러 상태:', error)} */}
      {/* {console.log('에러 show 상태:', error.show)} */}
      {/* {console.log('에러 type:', error.type)} */}
      {/* {console.log('에러 title:', error.title)} */}
      {/* {console.log('에러 message:', error.message)} */}

      {/* 강제로 표시되는 메시지 (항상 표시) */}
      <div style={{
        position: 'fixed',
        top: '50px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        backgroundColor: '#fef3c7',
        border: '2px solid #f59e0b',
        borderRadius: '8px',
        padding: '20px',
        maxWidth: '500px',
        width: '90%',
        boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ fontSize: '24px' }}>⚠️</div>
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#92400e',
              margin: '0 0 8px 0'
            }}>
              강제 표시 메시지
            </h3>
            <p style={{
              fontSize: '16px',
              color: '#a16207',
              margin: '0'
            }}>
              이 메시지가 보이나요? (항상 표시)
            </p>
          </div>
        </div>
      </div>

      {/* 간단한 테스트 버튼 */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => {
            console.log('경고 메시지 테스트!')
            showWarning('입력 필요', '답변을 입력해주세요.')
          }}
          className="px-4 py-2 bg-yellow-500 text-white text-sm rounded-lg font-bold shadow-lg hover:bg-yellow-600"
        >
          경고 테스트
        </button>
      </div>

      {/* 서술형 답변 모달 */}
      {showDescriptiveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">📝 서술형 답변</h3>
              <button
                onClick={() => {
                  setShowDescriptiveModal(false)
                  setCurrentDescriptiveAction('')
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">질문: {currentDescriptiveAction}</h4>
              <p className="text-sm text-gray-600 mb-4">
                "사고 내용을 정확히 파악하였는가"
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h5 className="font-medium text-blue-900 mb-2">📋 평가 기준</h5>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• 사고위치 파악</li>
                  <li>• 가스배관 손상 및 누출 정도</li>
                  <li>• 신고자의 신원확보 (성명/전화번호)</li>
                  <li>• 가스폭발에 대비하여 화기 사용금지 및 주변 통제 요청 여부</li>
                  <li>• 피해현황 확인</li>
                </ul>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                답변 작성
              </label>
              <textarea
                id="descriptiveAnswer"
                rows={6}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="사고 상황을 상세히 서술해주세요..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDescriptiveModal(false)
                  setCurrentDescriptiveAction('')
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                취소
              </button>
              <button
                onClick={() => {
                  const answer = document.getElementById('descriptiveAnswer').value
                  if (answer.trim()) {
                    handleDescriptiveSubmit(answer.trim())
                  } else {
                    showWarning('입력 필요', '답변을 입력해주세요.')
                  }
                }}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                제출
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 기존 컴포넌트 내용 */}
      {currentPhase === 'briefing' && (
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{scenario.title}</h1>
            <p className="text-lg text-gray-600">{scenario.description}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">📋 시나리오 개요</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">시나리오 유형:</span>
                    <span className="font-medium">{scenario.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">예상 소요시간:</span>
                    <span className="font-medium">{scenario.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">난이도:</span>
                    <span className="font-medium">{scenario.difficulty}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">🎯 학습 목표</h2>
                <ul className="space-y-2">
                  {scenario.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-success-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">⚠️ 초기 상황</h2>
                <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
                  <p className="text-warning-800">{scenario.initialSituation}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={startTraining}
              className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors text-lg font-medium"
            >
              비상 훈련 시작
            </button>
          </div>
        </div>
      )}

      {currentPhase === 'training' && (
        <div className="max-w-6xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">

              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={togglePause}
                  className="flex items-center gap-2 px-3 py-2 bg-warning-100 text-warning-700 rounded-lg hover:bg-warning-200"
                >
                  {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  {isPaused ? '재개' : '일시정지'}
                </button>


                <button
                  onClick={resetTraining}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  <RotateCcw className="h-4 w-4" />
                  다시시작
                </button>
              </div>
            </div>

            {/* 최상단 서술형 답변 작성란 */}
            <div className="mb-8 bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6">
              <h2 className="text-xl font-bold text-yellow-900 mb-4">🚨 서술형 답변 작성란 (최상단)</h2>
              <p className="text-sm text-yellow-800 mb-4">"사고 내용을 정확히 파악하였는가"</p>
              <textarea
                id="topAnswer"
                rows={5}
                className="w-full border-2 border-yellow-400 rounded-lg p-4 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm"
                placeholder="사고 상황을 상세히 서술해주세요..."
              />
              <button
                onClick={() => {
                  const answer = document.getElementById('topAnswer').value
                  if (answer.trim()) {
                    handleDescriptiveSubmit(answer.trim())
                  } else {
                    showWarning('입력 필요', '답변을 입력해주세요.')
                  }
                }}
                className="mt-4 px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm font-medium"
              >
                답변 제출
              </button>
            </div>

            {/* 현재 상황 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2 space-y-6">
                {/* 상황 설명 */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-full ${alertLevel === 'critical' ? 'bg-danger-100' :
                      alertLevel === 'warning' ? 'bg-warning-100' :
                        'bg-success-100'
                      }`}>
                      <AlertTriangle className={`h-5 w-5 ${alertLevel === 'critical' ? 'text-danger-600' :
                        alertLevel === 'warning' ? 'text-warning-600' :
                          'text-success-600'
                        }`} />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{currentStepData.title}</h2>
                      <p className="text-sm text-gray-500">{currentStepData.time}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-medium text-gray-900 mb-2">🚨 현재 상황</h3>
                    <p className="text-gray-700">{currentStepData.situation}</p>
                  </div>

                  {/* 임시 테스트 - 답변 작성란 */}
                  <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-medium text-red-900 mb-2">🧪 테스트 - 답변 작성란 (항상 표시)</h4>
                    <p className="text-sm text-red-700 mb-2">이 박스가 보이면 React가 정상 작동 중입니다.</p>
                    <textarea
                      id="testAnswer"
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                      placeholder="테스트 답변을 입력해주세요..."
                    />
                    <button
                      onClick={() => {
                        const answer = document.getElementById('testAnswer').value
                        showInfo('테스트 답변', `입력된 답변: ${answer}`)
                      }}
                      className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                    >
                      테스트 제출
                    </button>
                  </div>

                  {/* 실제 서술형 답변 */}
                  <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-2">📝 실제 서술형 답변</h4>
                    <p className="text-sm text-green-700 mb-3">"사고 내용을 정확히 파악하였는가"</p>
                    <textarea
                      id="realAnswer"
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                      placeholder="사고 상황을 상세히 서술해주세요..."
                    />
                    <button
                      onClick={() => {
                        const answer = document.getElementById('realAnswer').value
                        if (answer.trim()) {
                          handleDescriptiveSubmit(answer.trim())
                        } else {
                          showWarning('입력 필요', '답변을 입력해주세요.')
                        }
                      }}
                      className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                    >
                      답변 제출
                    </button>
                  </div>

                  {/* 행동 선택 */}
                  <div>


                    <div className="mt-6 flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        선택한 조치: {(userChoices[currentStep] || []).length}개
                      </div>

                      <button
                        onClick={proceedToNextStep}
                        disabled={isPaused}
                        className="flex items-center gap-2 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        다음 단계
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentPhase === 'evaluation' && (
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center mb-8">
              <Award className="h-16 w-16 text-warning-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">훈련 완료!</h1>
              <p className="text-lg text-gray-600">{scenario.title}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-primary-50 rounded-lg">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {Math.round(stepScores.reduce((a, b) => a + b, 0) / stepScores.length)}점
                </div>
                <div className="text-sm text-primary-700">최종 점수</div>
              </div>
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {formatTime(timeElapsed)}
                </div>
                <div className="text-sm text-blue-700 font-medium">총 소요 시간</div>
                <div className="text-xs text-gray-600 mt-1">
                  완료된 훈련
                </div>
              </div>
              <div className="text-center p-6 bg-warning-50 rounded-lg">
                <div className="text-3xl font-bold text-warning-600 mb-2">
                  {selectedActions.length}
                </div>
                <div className="text-sm text-warning-700">수행한 행동</div>
              </div>
            </div>

            {/* 액션 버튼들 */}
            <div className="flex flex-wrap gap-4 justify-center mt-8">
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
              >
                대시보드로 돌아가기
              </button>

              <button
                onClick={resetTraining}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
              >
                다시 훈련하기
              </button>

              <button
                onClick={downloadReport}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                📄 리포트 다운로드
              </button>

              <button
                onClick={() => navigate('/training-management')}
                className="bg-success-600 text-white px-6 py-3 rounded-lg hover:bg-success-700 transition-colors"
              >
                훈련 결과 보기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 훈련 종료 경고 모달 */}
      {showExitWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
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
                className="px-4 py-2 bg-danger-600 text-white rounded-lg hover:bg-danger-700 transition-colors"
              >
                예, 훈련 종료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default React.memo(AdvancedTrainingEngine)
