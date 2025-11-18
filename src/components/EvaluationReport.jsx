import React, { useState } from 'react'
import { BarChart3, Download, Calendar, Users, Clock, TrendingUp, TrendingDown, Award } from 'lucide-react'
import { useAppContext } from '../App'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'

const EvaluationReport = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedScenario, setSelectedScenario] = useState('all')
  const { scenarios, trainingHistory } = useAppContext()

  // 실제 데이터 기반 통계 계산
  const totalTrainings = trainingHistory.length
  const averageScore = totalTrainings > 0 
    ? Math.round(trainingHistory.reduce((sum, h) => sum + h.score, 0) / totalTrainings * 10) / 10 
    : 0
  const uniqueParticipants = new Set(trainingHistory.map(h => h.participant)).size

  // 시나리오별 통계
  const scenarioStats = scenarios.map(scenario => {
    const scenarioHistory = trainingHistory.filter(h => h.scenarioId === scenario.id)
    const completions = scenarioHistory.length
    const avgScore = completions > 0 
      ? Math.round(scenarioHistory.reduce((sum, h) => sum + h.score, 0) / completions * 10) / 10 
      : 0
    
    return {
      name: scenario.title.split(' ')[0] + ' ' + scenario.title.split(' ')[1], // 축약된 이름
      completions,
      averageScore: avgScore,
      averageTime: '35-45분', // 예상 시간
      trend: 'up' // 기본값
    }
  })

  const evaluationData = {
    overall: {
      totalTrainings,
      averageScore,
      completionRate: 100, // 완료된 훈련은 모두 100%
      totalParticipants: uniqueParticipants
    },
    scenarios: scenarioStats,
    recentEvaluations: trainingHistory
      .slice(-10)
      .reverse()
      .map(history => ({
        id: history.id,
        participant: history.participant,
        scenario: history.scenarioTitle,
        score: history.score,
        completedAt: new Date(history.completedAt).toLocaleString('ko-KR'),
        timeSpent: history.timeSpent,
        feedback: history.feedback
      })),
    departmentStats: [
      { name: '안전관리팀', participants: 15, averageScore: averageScore || 85, trainings: Math.floor(totalTrainings * 0.4) },
      { name: '경영지원팀', participants: 12, averageScore: averageScore || 87, trainings: Math.floor(totalTrainings * 0.3) },
      { name: '고객서비스팀', participants: 10, averageScore: averageScore || 89, trainings: Math.floor(totalTrainings * 0.2) },
      { name: 'RM팀', participants: 8, averageScore: averageScore || 88, trainings: Math.floor(totalTrainings * 0.1) }
    ]
  }

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-success-600 bg-success-50'
    if (score >= 80) return 'text-warning-600 bg-warning-50'
    return 'text-danger-600 bg-danger-50'
  }

  const getScoreGrade = (score) => {
    if (score >= 95) return 'S'
    if (score >= 90) return 'A'
    if (score >= 80) return 'B'
    if (score >= 70) return 'C'
    return 'D'
  }

  const handleExportReport = () => {
    // 실제 구현에서는 PDF 생성 또는 Excel 다운로드 기능
    alert('리포트가 다운로드됩니다.')
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* 헤더 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">평가 및 리포트</h1>
            <p className="text-gray-600">훈련 성과와 개인별/부서별 평가 결과를 확인하세요</p>
          </div>
          
          <div className="flex items-center gap-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="week">최근 1주</option>
              <option value="month">최근 1개월</option>
              <option value="quarter">최근 3개월</option>
            </select>
            
            <button
              onClick={handleExportReport}
              className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              리포트 다운로드
            </button>
          </div>
        </div>
      </div>

      {/* 전체 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-primary-50 rounded-lg">
              <BarChart3 className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">총 훈련 횟수</p>
              <p className="text-2xl font-bold text-gray-900">{evaluationData.overall.totalTrainings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-success-50 rounded-lg">
              <Award className="h-6 w-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">평균 점수</p>
              <p className="text-2xl font-bold text-gray-900">{evaluationData.overall.averageScore}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-warning-50 rounded-lg">
              <Users className="h-6 w-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">총 참여자</p>
              <p className="text-2xl font-bold text-gray-900">{evaluationData.overall.totalParticipants}명</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-danger-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-danger-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">완료율</p>
              <p className="text-2xl font-bold text-gray-900">{evaluationData.overall.completionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 시나리오별 성과 */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">시나리오별 성과</h2>
            
            <div className="space-y-4">
              {evaluationData.scenarios.map((scenario, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">{scenario.name}</h3>
                    <div className="flex items-center gap-2">
                      {scenario.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-success-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-danger-600" />
                      )}
                      <span className={`text-sm ${scenario.trend === 'up' ? 'text-success-600' : 'text-danger-600'}`}>
                        {scenario.trend === 'up' ? '상승' : '하락'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-lg font-bold text-gray-900">{scenario.completions}</p>
                      <p className="text-sm text-gray-600">완료 횟수</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-900">{scenario.averageScore}</p>
                      <p className="text-sm text-gray-600">평균 점수</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-900">{scenario.averageTime}</p>
                      <p className="text-sm text-gray-600">평균 소요시간</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 최근 평가 결과 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">최근 평가 결과</h2>
            
            <div className="space-y-4">
              {evaluationData.recentEvaluations.map((evaluation) => (
                <div key={evaluation.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="font-medium text-primary-600">
                          {evaluation.participant[0]}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{evaluation.participant}</h3>
                        <p className="text-sm text-gray-600">{evaluation.scenario}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(evaluation.score)}`}>
                        {getScoreGrade(evaluation.score)}등급 ({evaluation.score}점)
                      </span>
                      <div className="text-right">
                        <p className="text-sm text-gray-900">{evaluation.timeSpent}</p>
                        <p className="text-xs text-gray-500">{evaluation.completedAt}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded p-3">
                    <p className="text-sm text-gray-700">{evaluation.feedback}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 부서별 통계 */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">부서별 통계</h2>
            
            <div className="space-y-4">
              {evaluationData.departmentStats.map((dept, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">{dept.name}</h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">참여자</span>
                      <span className="font-medium">{dept.participants}명</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">평균 점수</span>
                      <span className="font-medium">{dept.averageScore}점</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">훈련 횟수</span>
                      <span className="font-medium">{dept.trainings}회</span>
                    </div>
                  </div>
                  
                  {/* 점수 프로그레스 바 */}
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${dept.averageScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 개선 권장사항 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">개선 권장사항</h2>
            
            <div className="space-y-3">
              <div className="bg-warning-50 border border-warning-200 rounded-lg p-3">
                <h4 className="font-medium text-warning-800 mb-1">화재 대응 훈련</h4>
                <p className="text-sm text-warning-700">평균 점수가 하락했습니다. 추가 교육이 필요합니다.</p>
              </div>
              
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
                <h4 className="font-medium text-primary-800 mb-1">지역관리팀</h4>
                <p className="text-sm text-primary-700">다른 부서 대비 점수가 낮습니다. 집중 훈련을 권장합니다.</p>
              </div>
              
              <div className="bg-success-50 border border-success-200 rounded-lg p-3">
                <h4 className="font-medium text-success-800 mb-1">안전관리팀</h4>
                <p className="text-sm text-success-700">우수한 성과를 보이고 있습니다. 지속적인 관리가 필요합니다.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EvaluationReport
