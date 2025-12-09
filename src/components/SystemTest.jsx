import React, { useState, useEffect } from 'react'
import { testSupabaseConnection } from '../config/supabase'
import aiService from '../services/aiService'
import { CheckCircle, AlertTriangle, Loader, Database, Bot } from 'lucide-react'

const SystemTest = () => {
  const [tests, setTests] = useState({
    supabase: { status: 'pending', message: '테스트 대기 중...' },
    aiService: { status: 'pending', message: '테스트 대기 중...' },
    environment: { status: 'pending', message: '환경변수 확인 중...' }
  })

  const updateTest = (testName, status, message) => {
    setTests(prev => ({
      ...prev,
      [testName]: { status, message }
    }))
  }

  // 환경변수 테스트
  const testEnvironment = () => {
    console.log('🔍 환경변수 테스트 시작...')
    
    const requiredVars = {
      'VITE_SUPABASE_URL': import.meta.env.VITE_SUPABASE_URL,
      'VITE_SUPABASE_ANON_KEY': import.meta.env.VITE_SUPABASE_ANON_KEY,
      'VITE_AI_FEEDBACK_ENABLED': import.meta.env.VITE_AI_FEEDBACK_ENABLED,
      'VITE_OPENAI_KEY_DEV': import.meta.env.VITE_OPENAI_KEY_DEV
    }
    
    const missing = []
    const present = []
    
    Object.entries(requiredVars).forEach(([key, value]) => {
      if (value) {
        present.push(key)
      } else {
        missing.push(key)
      }
    })
    
    if (missing.length === 0) {
      updateTest('environment', 'success', `모든 환경변수 설정됨 (${present.length}개)`)
    } else {
      updateTest('environment', 'error', `누락된 환경변수: ${missing.join(', ')}`)
    }
    
    console.log('✅ 설정된 환경변수:', present)
    console.log('❌ 누락된 환경변수:', missing)
  }

  // Supabase 연결 테스트
  const runSupabaseTest = async () => {
    updateTest('supabase', 'loading', '연결 테스트 중...')
    
    try {
      const isConnected = await testSupabaseConnection()
      if (isConnected) {
        updateTest('supabase', 'success', 'Supabase 연결 성공')
      } else {
        updateTest('supabase', 'error', 'Supabase 연결 실패')
      }
    } catch (error) {
      updateTest('supabase', 'error', `연결 오류: ${error.message}`)
    }
  }

  // AI 서비스 테스트
  const runAITest = async () => {
    updateTest('aiService', 'loading', 'AI 서비스 테스트 중...')
    
    try {
      if (!aiService.isConfigured()) {
        updateTest('aiService', 'warning', 'AI 서비스 설정되지 않음 (환경변수 확인 필요)')
        return
      }

      // 테스트용 훈련 데이터
      const testData = {
        scenarioTitle: '테스트 시나리오',
        participant: '테스트 사용자',
        role: '안전관리자',
        score: 75,
        timeSpent: '5분 30초',
        stepScores: { 0: 100, 1: 50, 2: 100 },
        actions: [
          { step: 1, action: '초기 상황 파악', isCorrect: true },
          { step: 2, action: '대피 명령', isCorrect: false },
          { step: 3, action: '신고 조치', isCorrect: true }
        ],
        totalSteps: 3
      }

      const feedback = await aiService.generateTrainingFeedback(testData)
      
      if (feedback && feedback.message) {
        updateTest('aiService', 'success', 'AI 피드백 생성 성공')
      } else {
        updateTest('aiService', 'warning', '기본 피드백 사용 (AI 호출 제한)')
      }
    } catch (error) {
      updateTest('aiService', 'error', `AI 서비스 오류: ${error.message}`)
    }
  }

  // 컴포넌트 마운트 시 모든 테스트 실행
  useEffect(() => {
    const runAllTests = async () => {
      testEnvironment()
      await runSupabaseTest()
      await runAITest()
    }
    
    runAllTests()
  }, [])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-600" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case 'loading':
        return <Loader className="w-5 h-5 text-blue-600 animate-spin" />
      default:
        return <div className="w-5 h-5 bg-gray-300 rounded-full" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      case 'loading':
        return 'bg-blue-50 border-blue-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          🔧 시스템 상태 점검
        </h2>

        <div className="space-y-4">
          {/* 환경변수 테스트 */}
          <div className={`p-4 rounded-lg border-2 ${getStatusColor(tests.environment.status)}`}>
            <div className="flex items-center gap-3 mb-2">
              {getStatusIcon(tests.environment.status)}
              <h3 className="font-semibold text-lg">환경변수 설정</h3>
            </div>
            <p className="text-gray-700">{tests.environment.message}</p>
          </div>

          {/* Supabase 연결 테스트 */}
          <div className={`p-4 rounded-lg border-2 ${getStatusColor(tests.supabase.status)}`}>
            <div className="flex items-center gap-3 mb-2">
              {getStatusIcon(tests.supabase.status)}
              <Database className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-lg">Supabase 데이터베이스</h3>
            </div>
            <p className="text-gray-700">{tests.supabase.message}</p>
          </div>

          {/* AI 서비스 테스트 */}
          <div className={`p-4 rounded-lg border-2 ${getStatusColor(tests.aiService.status)}`}>
            <div className="flex items-center gap-3 mb-2">
              {getStatusIcon(tests.aiService.status)}
              <Bot className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-lg">AI 피드백 시스템</h3>
            </div>
            <p className="text-gray-700">{tests.aiService.message}</p>
          </div>
        </div>

        {/* 재테스트 버튼 */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={testEnvironment}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            환경변수 재확인
          </button>
          <button
            onClick={runSupabaseTest}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Supabase 재테스트
          </button>
          <button
            onClick={runAITest}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            AI 서비스 재테스트
          </button>
        </div>

        {/* 전체 상태 요약 */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">시스템 상태 요약</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="font-medium">환경설정</div>
              <div className={`${tests.environment.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {tests.environment.status === 'success' ? '✅ 정상' : '❌ 오류'}
              </div>
            </div>
            <div className="text-center">
              <div className="font-medium">데이터베이스</div>
              <div className={`${tests.supabase.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {tests.supabase.status === 'success' ? '✅ 연결됨' : '❌ 연결안됨'}
              </div>
            </div>
            <div className="text-center">
              <div className="font-medium">AI 서비스</div>
              <div className={`${tests.aiService.status === 'success' ? 'text-green-600' : tests.aiService.status === 'warning' ? 'text-yellow-600' : 'text-red-600'}`}>
                {tests.aiService.status === 'success' ? '✅ 작동중' : tests.aiService.status === 'warning' ? '⚠️ 제한적' : '❌ 오류'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemTest
