import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Play, Users, AlertTriangle, Clock, CheckCircle, BarChart3, MapPin, Eye, Settings } from 'lucide-react'
import { useAppContext } from '../App'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import { detailedScenarios } from '../data/trainingScenarios'
import apiClient from '../utils/apiClient'
// import SystemTest from './SystemTest' // 11/27 이전 상태로 복구를 위해 제거

const Dashboard = () => {
  const { scenarios, setScenarios, trainingHistory, setTrainingHistory } = useAppContext()
  // const [showSystemTest, setShowSystemTest] = useState(false) // 11/27 이전 상태로 복구를 위해 제거
  const [backendData, setBackendData] = useState({ scenarios: [], training: [] })
  const [isLoading, setIsLoading] = useState(true)
  
  // 시나리오 데이터 초기화 (11/27 이전 상태 복구)
  useEffect(() => {
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
    
    // 기본 시나리오 설정
    if (defaultScenarios.length > 0) {
      setScenarios(defaultScenarios)
      console.log('✅ 기본 시나리오 데이터 설정 완료:', defaultScenarios)
    }
    
    // 백엔드 데이터 로드 시도 (있으면 덮어쓰기) - 11/27 이전 상태에서는 비활성화
    const loadBackendData = async () => {
      try {
        setIsLoading(true)
        console.log('🔄 백엔드 연결 비활성화 - 로컬 데이터 사용')
        
        // 백엔드 연결 비활성화 - 11/27 이전 상태로 복구
        // const scenarioResponse = await apiClient.get('/scenarios')
        // console.log('📊 시나리오 데이터:', scenarioResponse)
        
        // 백엔드 API 호출 비활성화 - 11/27 이전 상태로 복구
        // const trainingResponse = await apiClient.get('/training')
        // console.log('📈 훈련 데이터:', trainingResponse)
        
        setBackendData({
          scenarios: [],
          training: []
        })
        
        // 로컬 데이터만 사용 (11/27 이전 상태)
        console.log('✅ 로컬 데이터 사용 - 백엔드 연결 불필요')
        
        console.log('✅ 백엔드 데이터 로드 완료')
      } catch (error) {
        console.log('⚠️ 백엔드 연결 비활성화 상태:', error.message)
        setBackendData({ scenarios: [], training: [] })
      } finally {
        setIsLoading(false)
      }
    }
    
    // 11/27 이전 상태로 복구 - 백엔드 호출 비활성화
    // loadBackendData()
    setIsLoading(false) // 로딩 즉시 해제
  }, [setScenarios, setTrainingHistory])

  // 최근 활동 (훈련 이력에서 생성)
  const recentActivities = trainingHistory
    .slice(-10) // 최근 10개
    .reverse() // 최신 순으로 정렬
    .map(history => ({
      id: history.id,
      user: history.participant,
      action: `${history.scenarioTitle} 완료`,
      time: formatDistanceToNow(new Date(history.completedAt), { 
        addSuffix: true, 
        locale: ko 
      }),
      score: history.score
    }))

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'high': return 'text-danger-600 bg-danger-50'
      case 'medium': return 'text-warning-600 bg-warning-50'
      case 'low': return 'text-success-600 bg-success-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 'high': return '고급'
      case 'medium': return '중급'
      case 'low': return '초급'
      default: return '미설정'
    }
  }

  return (
    <div className="space-y-8">
      {/* 헤더 섹션 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">도시가스 비상대응 모의훈련 대시보드</h1>
            <p className="text-gray-600">시나리오 기반 도시가스 비상대응 훈련을 시작하세요</p>
          </div>
          {/* 시스템 점검 버튼 - 11/27 이전 상태로 복구를 위해 제거
          <button
            onClick={() => setShowSystemTest(!showSystemTest)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              showSystemTest 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Settings className="w-4 h-4" />
            {showSystemTest ? '시스템 점검 숨기기' : '시스템 점검'}
          </button>
          */}
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-primary-50 rounded-lg">
              <Play className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">진행 가능한 시나리오</p>
              <p className="text-2xl font-bold text-gray-900">{scenarios.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-success-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">완료된 훈련</p>
              <p className="text-2xl font-bold text-gray-900">{trainingHistory.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-warning-50 rounded-lg">
              <Users className="h-6 w-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">참여 인원</p>
              <p className="text-2xl font-bold text-gray-900">65명</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-danger-50 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-danger-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">평균 점수</p>
              <p className="text-2xl font-bold text-gray-900">
                {trainingHistory.length > 0 
                  ? Math.round(trainingHistory.reduce((sum, h) => sum + h.score, 0) / trainingHistory.length * 10) / 10
                  : 0
                }점
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 시나리오 목록 */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">훈련 시나리오</h2>
              <Link to="/roles" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                역할 관리 →
              </Link>
            </div>
            
            <div className="space-y-6">
              {scenarios.map((scenario) => {
                const detailedScenario = detailedScenarios[scenario.id]
                return (
                  <div key={scenario.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    {/* 메인 헤더 */}
                    <div className="p-6 bg-white">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${
                            scenario.difficulty === 'high' ? 'bg-danger-100' :
                            scenario.difficulty === 'medium' ? 'bg-warning-100' :
                            'bg-success-100'
                          }`}>
                            <AlertTriangle className={`h-5 w-5 ${
                              scenario.difficulty === 'high' ? 'text-danger-600' :
                              scenario.difficulty === 'medium' ? 'text-warning-600' :
                              'text-success-600'
                            }`} />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{scenario.title}</h3>
                            <div className="flex items-center gap-4 mt-1">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(scenario.difficulty)}`}>
                                {getDifficultyText(scenario.difficulty)}
                              </span>
                              {detailedScenario && (
                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                                  {detailedScenario.type === 'gas_leak' ? '가스누출' :
                                   detailedScenario.type === 'chemical_leak' ? '화학누출' :
                                   detailedScenario.type === 'fire' ? '화재' : '기타'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Link
                            to={`/training/advanced/${scenario.id}`}
                            className="bg-danger-600 text-white px-6 py-3 rounded-lg hover:bg-danger-700 transition-colors flex items-center gap-2 font-medium"
                          >
                            <Play className="h-5 w-5" />
                            비상훈련 시작
                          </Link>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{scenario.description}</p>
                      
                      {/* 상세 정보 */}
                      {detailedScenario && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span className="text-gray-700">
                                <strong>위치:</strong> {detailedScenario.initialSituation.location}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span className="text-gray-700">
                                <strong>발생시간:</strong> {detailedScenario.initialSituation.time}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-gray-500" />
                              <span className="text-gray-700">
                                <strong>신고자:</strong> {detailedScenario.initialSituation.reportedBy}
                              </span>
                            </div>
                          </div>
                          
                          <div className="mt-3 p-3 bg-warning-50 border border-warning-200 rounded-md">
                            <div className="flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 text-warning-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <div className="font-medium text-warning-800 text-sm">초기 신고 내용</div>
                                <div className="text-warning-700 text-sm">{detailedScenario.initialSituation.initialReport}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* 통계 정보 */}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>예상 시간: {detailedScenario ? `${detailedScenario.timeline.length * 5}분` : scenario.estimatedTime}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{scenario.uniqueParticipants || 0}명 참여</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            <span>{scenario.completedCount || 0}회 완료</span>
                          </div>
                          {detailedScenario && (
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              <span>{detailedScenario.timeline.length}단계 훈련</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* 최근 활동 */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">최근 활동</h2>
              <div className="flex gap-4">
                <Link to="/training-management" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  훈련 관리 →
                </Link>
                <Link to="/evaluation" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  평가 리포트 →
                </Link>
              </div>
            </div>
            
            <div className="space-y-4">
              {recentActivities.length > 0 ? recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-full">
                    <BarChart3 className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-500">{activity.time}</p>
                      {activity.score && (
                        <span className="text-xs font-medium text-primary-600">{activity.score}점</span>
                      )}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">아직 완료된 훈련이 없습니다</p>
                  <p className="text-gray-400 text-xs">훈련을 시작해보세요!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 시스템 점검 - 11/27 이전 상태로 복구를 위해 제거
      {showSystemTest && (
        <div className="mt-8">
          <SystemTest />
        </div>
      )}
      */}
    </div>
  )
}

export default Dashboard
