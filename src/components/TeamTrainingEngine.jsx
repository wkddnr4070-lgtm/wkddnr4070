import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Clock, AlertTriangle, CheckCircle, X, Play, Pause, RotateCcw, 
  Users, MapPin, Thermometer, Wind, Eye, Lightbulb, Award,
  ArrowLeft, ArrowRight, Flag, UserCheck, MessageSquare, Target
} from 'lucide-react'
import { useAppContext } from '../App'
import { teamScenarios, teamEvaluationCriteria, teamFeedbackTemplates } from '../data/teamTrainingScenarios'

const TeamTrainingEngine = () => {
  const { teamId } = useParams()
  const navigate = useNavigate()
  const { userProfile, completeTraining } = useAppContext()
  
  // 팀 정보 (로컬 스토리지에서 가져오기)
  const [team, setTeam] = useState(null)
  const [scenario, setScenario] = useState(null)
  
  // 훈련 상태
  const [currentPhase, setCurrentPhase] = useState('briefing') // briefing, training, evaluation
  const [currentProcedure, setCurrentProcedure] = useState('A')
  const [currentStep, setCurrentStep] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [stepStartTime, setStepStartTime] = useState(Date.now())
  
  // 팀원별 상태
  const [teamMemberStatus, setTeamMemberStatus] = useState({})
  const [completedProcedures, setCompletedProcedures] = useState({})
  const [teamScore, setTeamScore] = useState(100)
  const [teamFeedback, setTeamFeedback] = useState('')
  
  // 타이머 참조
  const timerRef = useRef(null)
  
  // 팀 정보 로드
  useEffect(() => {
    const teams = JSON.parse(localStorage.getItem('teams') || '[]')
    const foundTeam = teams.find(t => t.id === teamId)
    
    if (!foundTeam) {
      navigate('/team-management')
      return
    }
    
    setTeam(foundTeam)
    setScenario(teamScenarios[foundTeam.scenarioType])
    
    // 팀원 상태 초기화
    const initialStatus = {}
    foundTeam.members.forEach(member => {
      initialStatus[member] = {
        role: 'member',
        completedSteps: [],
        currentAction: null,
        isActive: false
      }
    })
    setTeamMemberStatus(initialStatus)
  }, [teamId, navigate])
  
  // 타이머 관리
  useEffect(() => {
    if (isRunning && !isPaused) {
      timerRef.current = setInterval(() => {
        setTimeElapsed(prev => prev + 1)
      }, 1000)
    } else {
      clearInterval(timerRef.current)
    }
    
    return () => clearInterval(timerRef.current)
  }, [isRunning, isPaused])
  
  // 시간 포맷팅
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  // 훈련 시작
  const startTraining = useCallback(() => {
    setIsRunning(true)
    setCurrentPhase('training')
    setStepStartTime(Date.now())
    setTimeElapsed(0)
  }, [])
  
  // 절차 완료 처리
  const completeProcedure = useCallback((procedureId, stepId, memberName) => {
    const step = scenario.procedures[procedureId]?.steps.find(s => s.id === stepId)
    if (!step) return
    
    // 개인 점수 업데이트
    setTeamMemberStatus(prev => ({
      ...prev,
      [memberName]: {
        ...prev[memberName],
        completedSteps: [...(prev[memberName].completedSteps || []), stepId]
      }
    }))
    
    // 팀 점수 업데이트
    if (!completedProcedures[stepId]) {
      setCompletedProcedures(prev => ({ ...prev, [stepId]: true }))
    } else {
      // 이미 완료된 절차라면 감점
      setTeamScore(prev => Math.max(0, prev - step.penalty))
    }
  }, [scenario, completedProcedures])
  
  // 다음 절차로 이동
  const proceedToNextProcedure = useCallback(() => {
    const procedures = Object.keys(scenario.procedures)
    const currentIndex = procedures.indexOf(currentProcedure)
    
    if (currentIndex < procedures.length - 1) {
      setCurrentProcedure(procedures[currentIndex + 1])
      setCurrentStep(0)
      setStepStartTime(Date.now())
    } else {
      // 모든 절차 완료
      completeTeamTraining()
    }
  }, [currentProcedure, scenario])
  
  // 팀 훈련 완료
  const completeTeamTraining = useCallback(() => {
    setIsRunning(false)
    setCurrentPhase('evaluation')
    
    // 최종 점수 계산
    const finalScore = Math.max(0, teamScore)
    
    // 피드백 생성
    let feedbackTemplate
    if (finalScore >= 95) feedbackTemplate = teamFeedbackTemplates.excellent
    else if (finalScore >= 85) feedbackTemplate = teamFeedbackTemplates.good
    else if (finalScore >= 70) feedbackTemplate = teamFeedbackTemplates.average
    else if (finalScore >= 60) feedbackTemplate = teamFeedbackTemplates.poor
    else feedbackTemplate = teamFeedbackTemplates.fail
    
    setTeamFeedback(feedbackTemplate)
    
    // 훈련 완료 데이터 저장
    const trainingData = {
      teamId: teamId,
      teamName: team.name,
      scenarioType: team.scenarioType,
      participants: team.members,
      score: finalScore,
      timeSpent: formatTime(timeElapsed),
      completedProcedures: completedProcedures,
      feedback: feedbackTemplate,
      completedAt: new Date().toISOString()
    }
    
    // 팀 훈련 이력 저장
    const teamTrainingHistory = JSON.parse(localStorage.getItem('teamTrainingHistory') || '[]')
    teamTrainingHistory.push(trainingData)
    localStorage.setItem('teamTrainingHistory', JSON.stringify(teamTrainingHistory))
  }, [teamId, team, teamScore, timeElapsed, completedProcedures])
  
  // 훈련 일시정지/재개
  const togglePause = useCallback(() => {
    setIsPaused(!isPaused)
  }, [isPaused])
  
  // 훈련 리셋
  const resetTraining = useCallback(() => {
    setIsRunning(false)
    setIsPaused(false)
    setCurrentPhase('briefing')
    setCurrentProcedure('A')
    setCurrentStep(0)
    setTimeElapsed(0)
    setCompletedProcedures({})
    setTeamScore(100)
    setTeamFeedback('')
  }, [])
  
  if (!team || !scenario) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 mb-4">팀 정보를 불러오는 중...</div>
        </div>
      </div>
    )
  }
  
  const currentProcedureData = scenario.procedures[currentProcedure]
  const currentStepData = currentProcedureData?.steps[currentStep]
  
  // 브리핑 화면
  if (currentPhase === 'briefing') {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <Users className="h-16 w-16 text-primary-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{scenario.title}</h1>
            <p className="text-lg text-gray-600">{scenario.description}</p>
          </div>
          
          {/* 팀 정보 */}
          <div className="bg-primary-50 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-primary-900 mb-4">팀 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-primary-800 mb-2">팀명</h4>
                <p className="text-primary-700">{team.name}</p>
              </div>
              <div>
                <h4 className="font-medium text-primary-800 mb-2">팀장</h4>
                <p className="text-primary-700">{team.leader}</p>
              </div>
              <div>
                <h4 className="font-medium text-primary-800 mb-2">팀원 수</h4>
                <p className="text-primary-700">{team.members.length}명</p>
              </div>
              <div>
                <h4 className="font-medium text-primary-800 mb-2">예상 시간</h4>
                <p className="text-primary-700">{scenario.duration}분</p>
              </div>
            </div>
          </div>
          
          {/* 절차 개요 */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">훈련 절차 개요</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(scenario.procedures).map(([key, procedure]) => (
                <div key={key} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">{procedure.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{procedure.description}</p>
                  <div className="text-xs text-gray-500">
                    {procedure.steps.length}개 단계
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* 팀원 역할 */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">팀원 역할</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(scenario.teamRoles).map(([key, role]) => (
                <div key={key} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">{role.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{role.description}</p>
                  <div className="text-xs text-gray-500">
                    주요 책임: {role.responsibilities.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* 훈련 시작 */}
          <div className="text-center">
            <div className="mb-4">
              <p className="text-gray-600 mb-2">팀 단위 협업을 통한 체계적인 훈련</p>
              <p className="text-sm text-gray-500">
                각 절차를 순서대로 완료하며 팀워크를 발휘해주세요.
              </p>
            </div>
            
            <button
              onClick={startTraining}
              className="px-8 py-3 bg-danger-600 text-white rounded-lg hover:bg-danger-700 transition-colors flex items-center gap-2 mx-auto text-lg font-medium"
            >
              <Play className="h-5 w-5" />
              팀 훈련 시작
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  // 훈련 진행 화면
  if (currentPhase === 'training') {
    return (
      <div className="max-w-6xl mx-auto p-6">
        {/* 상단 제어판 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <span className="text-lg font-medium">{formatTime(timeElapsed)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-gray-500" />
                <span className="text-lg font-medium">{currentProcedureData.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-gray-500" />
                <span className="text-lg font-medium">{teamScore}점</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={togglePause}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                {isPaused ? '재개' : '일시정지'}
              </button>
              <button
                onClick={resetTraining}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                리셋
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 절차 체크리스트 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                절차별 체크리스트 - {currentProcedureData.name}
              </h3>
              <p className="text-gray-600 mb-6">{currentProcedureData.description}</p>
              
              <div className="space-y-3">
                {currentProcedureData.steps.map((step, index) => {
                  const isCompleted = completedProcedures[step.id]
                  const isCurrent = index === currentStep
                  
                  return (
                    <div
                      key={step.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isCompleted
                          ? 'bg-success-50 border-success-200'
                          : isCurrent
                          ? 'bg-primary-50 border-primary-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            isCompleted
                              ? 'bg-success-500 text-white'
                              : isCurrent
                              ? 'bg-primary-500 text-white'
                              : 'bg-gray-300 text-gray-600'
                          }`}>
                            {isCompleted ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <span className="text-sm font-medium">{index + 1}</span>
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{step.name}</h4>
                            <p className="text-sm text-gray-600">{step.description}</p>
                          </div>
                        </div>
                        
                        {isCurrent && !isCompleted && (
                          <button
                            onClick={() => completeProcedure(currentProcedure, step.id, userProfile?.name || 'Unknown')}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                          >
                            완료
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
              
              <div className="mt-6 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  완료된 절차: {Object.keys(completedProcedures).length}개 / {currentProcedureData.steps.length}개
                </div>
                <button
                  onClick={proceedToNextProcedure}
                  className="flex items-center gap-2 bg-success-600 text-white px-6 py-2 rounded-lg hover:bg-success-700 transition-colors"
                >
                  다음 절차
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* 팀원 상태 */}
          <div className="space-y-6">
            {/* 진행 상황 */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-medium text-gray-900 mb-3">📈 진행 상황</h3>
              <div className="space-y-4">
                {/* 단계 I. 비상발령 ~ 밸브차단 */}
                <div>
                  <div className="text-sm font-semibold text-gray-800 mb-2 bg-blue-50 px-2 py-1 rounded">
                    단계 I. 비상발령 ~ 밸브차단
                  </div>
                  <div className="space-y-1 ml-2">
                    {[
                      { main: '현장출동지시', sub: ['상황 접수'] },
                      { main: 'EMS 1차 분석', sub: [] },
                      { main: '비상발령', sub: [] },
                      { main: '1차 밸브 출동지시', sub: [] },
                      { main: '유관기관통보', sub: [] },
                      { main: '최초 도착', sub: [] },
                      { main: '위치파악', sub: [] },
                      { main: '1차 밸브 차단', sub: [] },
                      { main: 'EMS 2차 분석', sub: [] },
                      { main: '수요가 복구처 확인', sub: [] },
                      { main: '2차 밸브 차단', sub: [] }
                    ].map((item, index) => (
                      <div key={index}>
                        <div className={`flex items-center gap-2 text-xs ${
                          index <= Math.min(currentStep, 10) ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          <div className={`w-3 h-3 rounded-full flex items-center justify-center ${
                            index <= Math.min(currentStep, 10) ? 'bg-green-500' : 'bg-gray-300'
                          }`}>
                            {index <= Math.min(currentStep, 10) && <CheckCircle className="h-2 w-2 text-white" />}
                          </div>
                          {item.main}
                        </div>
                        {item.sub.length > 0 && (
                          <div className="ml-5 mt-1 space-y-1">
                            {item.sub.map((subItem, subIndex) => (
                              <div key={subIndex} className={`flex items-center gap-2 text-xs ${
                                index <= Math.min(currentStep, 10) ? 'text-blue-600' : 'text-gray-400'
                              }`}>
                                <span className="text-gray-400">-</span>
                                <div className={`w-2 h-2 rounded-full ${
                                  index <= Math.min(currentStep, 10) ? 'bg-blue-400' : 'bg-gray-300'
                                }`}></div>
                                {subItem}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 단계 II. 공급중단 홍보 ~ 복구방법 결정 */}
                <div>
                  <div className="text-sm font-semibold text-gray-800 mb-2 bg-yellow-50 px-2 py-1 rounded">
                    단계 II. 공급중단 홍보 ~ 복구방법 결정
                  </div>
                  <div className="space-y-1 ml-2">
                    {[
                      '현장지원반 구성', '1차 보도자료 배포', '수요가 밸브차단', '1차 홍보 (공급중단)', '수요조사 착수',
                      '협력팀 도착', '터파기', '복구방법 결정', '복구자재 요청', '복구자재 확보'
                    ].map((item, index) => (
                      <div key={index} className={`flex items-center gap-2 text-xs ${
                        index + 11 <= Math.min(currentStep, 20) ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        <div className={`w-3 h-3 rounded-full flex items-center justify-center ${
                          index + 11 <= Math.min(currentStep, 20) ? 'bg-green-500' : 'bg-gray-300'
                        }`}>
                          {index + 11 <= Math.min(currentStep, 20) && <CheckCircle className="h-2 w-2 text-white" />}
                        </div>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 단계 III. 배관복구 ~ 공급재개 및 상황종료 */}
                <div>
                  <div className="text-sm font-semibold text-gray-800 mb-2 bg-green-50 px-2 py-1 rounded">
                    단계 III. 배관복구 ~ 공급재개 및 상황종료
                  </div>
                  <div className="space-y-1 ml-2">
                    {[
                      '2차 홍보 (복구홍보)', '2차 보도자료 배포', '복구작업', '최종검사', '1차 밸브 오픈',
                      '퍼지 완료', '3차 밸브 오픈', '3차 보도자료 배포', '2차 밸브 오픈', '세대점검', '상황종료'
                    ].map((item, index) => (
                      <div key={index} className={`flex items-center gap-2 text-xs ${
                        index + 21 <= currentStep ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        <div className={`w-3 h-3 rounded-full flex items-center justify-center ${
                          index + 21 <= currentStep ? 'bg-green-500' : 'bg-gray-300'
                        }`}>
                          {index + 21 <= currentStep && <CheckCircle className="h-2 w-2 text-white" />}
                        </div>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 팀원 현황 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">팀원 현황</h3>
              <div className="space-y-3">
                {team.members.map(member => (
                  <div key={member} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {member.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{member}</div>
                        {member === team.leader && (
                          <div className="text-xs text-yellow-600">팀장</div>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {teamMemberStatus[member]?.completedSteps?.length || 0}개 완료
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 팀 점수 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">팀 점수</h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">{teamScore}</div>
                <div className="text-sm text-gray-600">현재 점수</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  // 평가 화면
  if (currentPhase === 'evaluation') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* 결과 헤더 */}
          <div className="text-center mb-8">
            <Award className="h-16 w-16 text-warning-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">팀 훈련 완료!</h1>
            <p className="text-lg text-gray-600">{scenario.title}</p>
          </div>
          
          {/* 점수 및 기본 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-primary-50 rounded-lg">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {teamScore}점
              </div>
              <div className="text-sm text-primary-700">팀 점수</div>
            </div>
            <div className="text-center p-6 bg-success-50 rounded-lg">
              <div className="text-3xl font-bold text-success-600 mb-2">
                {formatTime(timeElapsed)}
              </div>
              <div className="text-sm text-success-700">소요 시간</div>
            </div>
            <div className="text-center p-6 bg-warning-50 rounded-lg">
              <div className="text-3xl font-bold text-warning-600 mb-2">
                {Object.keys(completedProcedures).length}
              </div>
              <div className="text-sm text-warning-700">완료 절차</div>
            </div>
          </div>
          
          {/* 피드백 */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{teamFeedback.title}</h3>
            <p className="text-gray-700 mb-4">{teamFeedback.message}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">우수한 점</h4>
                <ul className="space-y-1">
                  {teamFeedback.strengths.map((strength, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-success-500" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">개선점</h4>
                <ul className="space-y-1">
                  {teamFeedback.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <Lightbulb className="h-4 w-4 text-warning-500" />
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          {/* 액션 버튼 */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/team-management')}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              팀 관리로 돌아가기
            </button>
            <button
              onClick={resetTraining}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              다시 훈련하기
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  return null
}

export default TeamTrainingEngine
