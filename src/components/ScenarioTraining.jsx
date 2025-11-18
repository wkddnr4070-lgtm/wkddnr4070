import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Clock, Users, AlertTriangle, CheckCircle, ArrowLeft, Send } from 'lucide-react'
import { useAppContext } from '../App'

const ScenarioTraining = () => {
  const { scenarioId } = useParams()
  const navigate = useNavigate()
  const { scenarios, completeTraining, trainingHistory, userProfile } = useAppContext()
  const [currentStep, setCurrentStep] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [userActions, setUserActions] = useState([])
  const [selectedAction, setSelectedAction] = useState('')
  const [isCompleted, setIsCompleted] = useState(false)
  const [participantName, setParticipantName] = useState(userProfile?.name || '')
  const [hasStarted, setHasStarted] = useState(false)

  // 현재 시나리오 찾기
  const scenario = scenarios.find(s => s.id === parseInt(scenarioId)) || {
    id: parseInt(scenarioId),
    title: 'OO동 OOO아파트 인근 도시가스 중압배관 파손',
    description: '평일 09:35 발생한 도시가스 배관 파손 사고 대응 훈련'
  }

  const scenarioDetails = {
    location: 'OO동 OOO아파트 인근',
    time: '09:35 (평일)',
    weather: '맑음, 기온 15°C, 바람 2m/s',
    severity: 'high'
  }

  const timeline = [
    {
      time: '09:35',
      event: '도시가스 중압배관 파손 신고 접수',
      description: '인근 주민으로부터 가스 냄새 및 배관 손상 신고가 접수되었습니다.',
      role: '관제센터',
      status: 'completed'
    },
    {
      time: '09:40',
      event: '현장 점검 여부 결정',
      description: '현장 상황을 파악하고 즉시 점검팀 파견 여부를 결정해야 합니다.',
      role: '관제운영팀',
      status: 'current',
      options: [
        '즉시 점검팀 파견',
        '추가 정보 수집 후 판단',
        '원격 모니터링으로 1차 확인'
      ]
    },
    {
      time: '09:45',
      event: '주민 대피 방송 판단',
      description: '가스 누출 규모를 고려한 주민 대피 방송 실시 여부를 결정합니다.',
      role: '지역관리팀/안전관리팀',
      status: 'pending'
    },
    {
      time: '09:50',
      event: '언론 대응 결정',
      description: '사고 규모와 영향을 고려한 언론 대응 방안을 수립합니다.',
      role: '홍보실/경영진',
      status: 'pending'
    }
  ]

  const roles = [
    { name: '김철수', role: '관제운영팀장', status: 'active', avatar: '👨‍💼' },
    { name: '이영희', role: '안전관리팀원', status: 'active', avatar: '👩‍💼' },
    { name: '박민수', role: '지역관리팀장', status: 'active', avatar: '👨‍🔧' },
    { name: '정하나', role: '홍보실 대리', status: 'standby', avatar: '👩‍💻' }
  ]

  useEffect(() => {
    let timer
    if (hasStarted && !isCompleted) {
      timer = setInterval(() => {
        setElapsedTime(prev => prev + 1)
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [hasStarted, isCompleted])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleActionSelect = (action) => {
    setSelectedAction(action)
  }

  const handleStartTraining = () => {
    setHasStarted(true)
  }

  const handleSubmitAction = () => {
    if (!selectedAction) return

    const newAction = {
      step: currentStep,
      action: selectedAction,
      timestamp: formatTime(elapsedTime),
      user: participantName
    }

    setUserActions([...userActions, newAction])
    setSelectedAction('')

    if (currentStep < timeline.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // 훈련 완료 처리
      const score = Math.floor(Math.random() * 30) + 70 // 70-100점 랜덤 점수
      const trainingData = {
        scenarioId: parseInt(scenarioId),
        scenarioTitle: scenario.title,
        participant: participantName,
        score: score,
        timeSpent: formatTime(elapsedTime),
        actions: userActions,
        feedback: generateFeedback(score)
      }
      
      completeTraining(trainingData)
      setIsCompleted(true)
    }
  }

  const generateFeedback = (score) => {
    if (score >= 90) return '뛰어난 대응 능력을 보여주었습니다. 신속하고 정확한 판단이 인상적이었습니다.'
    if (score >= 80) return '전반적으로 우수한 대응이었습니다. 일부 절차에서 개선 여지가 있습니다.'
    if (score >= 70) return '기본적인 대응 절차는 잘 이해하고 있으나, 신속성과 정확성 향상이 필요합니다.'
    return '추가 교육과 훈련이 필요합니다. 기본 절차를 다시 검토해주세요.'
  }

  const currentTimelineItem = timeline[currentStep]

  // 훈련 시작 전 화면
  if (!hasStarted) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center mb-6">
            <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              대시보드로 돌아가기
            </Link>
          </div>
          
          <div className="text-center mb-8">
            <AlertTriangle className="h-16 w-16 text-warning-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{scenario.title}</h1>
            <p className="text-gray-600 mb-6">{scenario.description}</p>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900">위치:</span>
                  <p className="text-gray-600">{scenarioDetails.location}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">시간:</span>
                  <p className="text-gray-600">{scenarioDetails.time}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">날씨:</span>
                  <p className="text-gray-600">{scenarioDetails.weather}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-md mx-auto">
            <div className="bg-primary-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-primary-900 mb-2">참여자 정보</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-primary-700">이름:</span>
                  <span className="font-medium text-primary-900">{userProfile?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-700">부서:</span>
                  <span className="font-medium text-primary-900">{userProfile?.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-700">직급:</span>
                  <span className="font-medium text-primary-900">{userProfile?.position}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleStartTraining}
              className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              훈련 시작하기
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (isCompleted) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <CheckCircle className="h-16 w-16 text-success-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">훈련 완료!</h1>
          <p className="text-gray-600 mb-6">모든 시나리오 단계를 성공적으로 완료했습니다.</p>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">훈련 결과</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary-600">{formatTime(elapsedTime)}</p>
                <p className="text-sm text-gray-600">소요 시간</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-success-600">{userActions.length + 1}</p>
                <p className="text-sm text-gray-600">완료된 조치</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-warning-600">
                  {trainingHistory.length > 0 ? trainingHistory[trainingHistory.length - 1].score : 85}점
                </p>
                <p className="text-sm text-gray-600">평가 점수</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Link
              to="/"
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              대시보드로 돌아가기
            </Link>
            <Link
              to="/evaluation"
              className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              상세 리포트 보기
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* 헤더 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-2" />
            대시보드로 돌아가기
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              {formatTime(elapsedTime)}
            </div>
            <div className="text-sm text-gray-600">
              진행률: {Math.round(((currentStep + 1) / timeline.length) * 100)}%
            </div>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{scenario.title}</h1>
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <span>📍 {scenario.location}</span>
          <span>🕘 {scenario.time}</span>
          <span>🌤️ {scenario.weather}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 메인 콘텐츠 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 현재 단계 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-danger-50 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-danger-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{currentTimelineItem?.event}</h2>
                <p className="text-sm text-gray-600">담당: {currentTimelineItem?.role}</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">{currentTimelineItem?.description}</p>

            {currentTimelineItem?.options && (
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">선택 가능한 조치:</h3>
                <div className="space-y-2">
                  {currentTimelineItem.options.map((option, index) => (
                    <label key={index} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="action"
                        value={option}
                        checked={selectedAction === option}
                        onChange={() => handleActionSelect(option)}
                        className="mr-3"
                      />
                      <span className="text-gray-900">{option}</span>
                    </label>
                  ))}
                </div>
                
                <button
                  onClick={handleSubmitAction}
                  disabled={!selectedAction}
                  className="flex items-center gap-2 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                  조치 실행
                </button>
              </div>
            )}
          </div>

          {/* 타임라인 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">시나리오 타임라인</h2>
            <div className="space-y-4">
              {timeline.map((item, index) => (
                <div key={index} className={`flex items-start gap-4 ${index === currentStep ? 'bg-primary-50 p-4 rounded-lg' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    item.status === 'completed' ? 'bg-success-600 text-white' :
                    item.status === 'current' ? 'bg-primary-600 text-white' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{item.time}</span>
                      <span className="text-sm text-gray-600">- {item.role}</span>
                    </div>
                    <h3 className="font-medium text-gray-900">{item.event}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 사이드바 */}
        <div className="space-y-6">
          {/* 참여자 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">참여자</h2>
            <div className="space-y-3">
              {roles.map((person, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-2xl">{person.avatar}</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{person.name}</p>
                    <p className="text-sm text-gray-600">{person.role}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    person.status === 'active' ? 'bg-success-50 text-success-600' : 'bg-gray-50 text-gray-600'
                  }`}>
                    {person.status === 'active' ? '활성' : '대기'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 이전 조치 */}
          {userActions.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">완료된 조치</h2>
              <div className="space-y-3">
                {userActions.map((action, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{action.user}</span>
                      <span className="text-xs text-gray-500">{action.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-700">{action.action}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ScenarioTraining
