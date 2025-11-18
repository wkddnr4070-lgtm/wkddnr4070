import React, { useState } from 'react'
import { useAppContext } from '../App'
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Calendar, 
  User, 
  Building, 
  Clock, 
  Award,
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'
import { ko } from 'date-fns/locale'

const TrainingManagement = () => {
  const { trainingHistory, scenarios } = useAppContext()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedScenario, setSelectedScenario] = useState('all')
  const [selectedPeriod, setSelectedPeriod] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')
  const [expandedDetails, setExpandedDetails] = useState({})
  const [isSearching, setIsSearching] = useState(false)

  // 검색 실행 함수
  const handleSearch = () => {
    setIsSearching(true)
    // 검색 애니메이션을 위한 짧은 지연
    setTimeout(() => {
      setIsSearching(false)
    }, 500)
  }

  // 필터링된 훈련 이력
  const filteredHistory = trainingHistory.filter(history => {
    const matchesSearch = 
      history.participant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      history.scenarioTitle.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesScenario = 
      selectedScenario === 'all' || history.scenarioId.toString() === selectedScenario
    
    const matchesPeriod = (() => {
      if (selectedPeriod === 'all') return true
      const historyDate = new Date(history.completedAt)
      const now = new Date()
      
      switch (selectedPeriod) {
        case 'today':
          return historyDate.toDateString() === now.toDateString()
        case 'week':
          return (now - historyDate) <= 7 * 24 * 60 * 60 * 1000
        case 'month':
          return (now - historyDate) <= 30 * 24 * 60 * 60 * 1000
        default:
          return true
      }
    })()
    
    return matchesSearch && matchesScenario && matchesPeriod
  })

  // 정렬
  const sortedHistory = [...filteredHistory].sort((a, b) => {
    let comparison = 0
    
    switch (sortBy) {
      case 'date':
        comparison = new Date(a.completedAt) - new Date(b.completedAt)
        break
      case 'participant':
        comparison = a.participant.localeCompare(b.participant)
        break
      case 'score':
        comparison = a.score - b.score
        break
      case 'scenario':
        comparison = a.scenarioTitle.localeCompare(b.scenarioTitle)
        break
      default:
        comparison = 0
    }
    
    return sortOrder === 'desc' ? -comparison : comparison
  })

  const toggleDetails = (historyId) => {
    setExpandedDetails(prev => ({
      ...prev,
      [historyId]: !prev[historyId]
    }))
  }

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-success-600 bg-success-50'
    if (score >= 80) return 'text-warning-600 bg-warning-50'
    if (score >= 70) return 'text-orange-600 bg-orange-50'
    return 'text-danger-600 bg-danger-50'
  }

  const exportToCSV = () => {
    const headers = ['날짜', '참여자', '시나리오', '점수', '소요시간', '피드백']
    const csvContent = [
      headers.join(','),
      ...sortedHistory.map(history => [
        format(new Date(history.completedAt), 'yyyy-MM-dd HH:mm'),
        history.participant,
        `"${history.scenarioTitle}"`,
        history.score,
        history.timeSpent,
        `"${history.feedback || ''}"`
      ].join(','))
    ].join('\n')

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `훈련결과_${format(new Date(), 'yyyy-MM-dd')}.csv`
    link.click()
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">훈련 관리</h1>
            <p className="text-gray-600 mt-1">
              총 {trainingHistory.length}건의 훈련이 완료되었습니다
            </p>
          </div>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            CSV 내보내기
          </button>
        </div>
      </div>

      {/* 통계 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-primary-50 rounded-lg">
              <User className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">총 참여자</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(trainingHistory.map(h => h.participant)).size}명
              </p>
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
              <p className="text-2xl font-bold text-gray-900">
                {trainingHistory.length > 0 
                  ? Math.round(trainingHistory.reduce((sum, h) => sum + h.score, 0) / trainingHistory.length * 10) / 10
                  : 0
                }점
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-warning-50 rounded-lg">
              <Clock className="h-6 w-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">완료율</p>
              <p className="text-2xl font-bold text-gray-900">
                {scenarios.length > 0 
                  ? Math.round((trainingHistory.length / (scenarios.length * new Set(trainingHistory.map(h => h.participant)).size)) * 100)
                  : 0
                }%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-danger-50 rounded-lg">
              <FileText className="h-6 w-6 text-danger-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">총 훈련 수</p>
              <p className="text-2xl font-bold text-gray-900">{trainingHistory.length}건</p>
            </div>
          </div>
        </div>
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* 검색 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="참여자 또는 시나리오 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-md transition-colors ${
                isSearching 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
              }`}
            >
              <Search className={`h-4 w-4 ${isSearching ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* 시나리오 필터 */}
          <select
            value={selectedScenario}
            onChange={(e) => setSelectedScenario(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">모든 시나리오</option>
            {scenarios.map(scenario => (
              <option key={scenario.id} value={scenario.id.toString()}>
                {scenario.title.length > 20 ? scenario.title.substring(0, 20) + '...' : scenario.title}
              </option>
            ))}
          </select>

          {/* 기간 필터 */}
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">전체 기간</option>
            <option value="today">오늘</option>
            <option value="week">최근 1주일</option>
            <option value="month">최근 1개월</option>
          </select>

          {/* 정렬 기준 */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="date">날짜순</option>
            <option value="participant">참여자순</option>
            <option value="score">점수순</option>
            <option value="scenario">시나리오순</option>
          </select>

          {/* 정렬 방향 */}
          <button
            onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
            className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {sortOrder === 'desc' ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
            {sortOrder === 'desc' ? '내림차순' : '오름차순'}
          </button>
        </div>
      </div>

      {/* 훈련 이력 목록 */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              훈련 이력 ({sortedHistory.length}건)
            </h2>
            {searchTerm && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Search className="h-4 w-4" />
                <span>"{searchTerm}" 검색 결과</span>
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  초기화
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {sortedHistory.length > 0 ? (
            sortedHistory.map((history) => (
              <div key={history.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {history.participant}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(history.score)}`}>
                        {history.score}점
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(history.completedAt), { 
                          addSuffix: true, 
                          locale: ko 
                        })}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-2">{history.scenarioTitle}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(history.completedAt), 'yyyy년 MM월 dd일 HH:mm')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        소요시간: {history.timeSpent}
                      </div>
                      {history.actions && (
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          조치 수: {history.actions.length}개
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => toggleDetails(history.id)}
                    className="flex items-center gap-2 px-3 py-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    {expandedDetails[history.id] ? '접기' : '상세보기'}
                  </button>
                </div>

                {/* 상세 정보 */}
                {expandedDetails[history.id] && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* 훈련 조치 내역 */}
                      {history.actions && history.actions.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">수행한 조치</h4>
                          <div className="space-y-2">
                            {history.actions.map((action, index) => (
                              <div key={index} className="bg-gray-50 rounded-lg p-3">
                                <div className="flex justify-between items-start mb-1">
                                  <span className="text-sm font-medium text-gray-700">
                                    단계 {action.step + 1}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {action.timestamp}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600">{action.action}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  수행자: {action.user}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 피드백 및 평가 */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">평가 및 피드백</h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-medium text-gray-700">최종 점수</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(history.score)}`}>
                              {history.score}점
                            </span>
                          </div>
                          
                          {history.feedback && (
                            <div>
                              <span className="text-sm font-medium text-gray-700 block mb-2">
                                상세 피드백
                              </span>
                              <p className="text-sm text-gray-600 leading-relaxed">
                                {history.feedback}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-gray-900 font-medium mb-2">훈련 이력이 없습니다</h3>
              <p className="text-gray-500">
                {searchTerm || selectedScenario !== 'all' || selectedPeriod !== 'all'
                  ? '검색 조건에 맞는 훈련 이력이 없습니다'
                  : '아직 완료된 훈련이 없습니다'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TrainingManagement
