// AI 기반 훈련 피드백 생성 서비스 (환경별 조건부 처리)
class AIService {
  constructor() {
    // 개발/배포 환경 구분
    this.isDevelopment = import.meta.env.DEV
    this.enabled = import.meta.env.VITE_AI_FEEDBACK_ENABLED !== 'false'
    
    // 개발 환경: 직접 OpenAI 호출, 배포 환경: Vercel Functions 사용
    if (this.isDevelopment) {
      this.apiKey = import.meta.env.VITE_OPENAI_KEY_DEV // 개발용 키 (임시)
      this.baseURL = 'https://api.openai.com/v1/chat/completions'
      this.useVercelFunctions = false
    } else {
      this.baseURL = import.meta.env.VITE_API_URL || 'https://your-app.vercel.app/api'
      this.useVercelFunctions = true
    }
  }

  // API 서비스 유효성 검사
  isConfigured() {
    if (this.isDevelopment) {
      return this.enabled && this.apiKey
    } else {
      return this.enabled
    }
  }

  // 훈련 데이터를 기반으로 AI 피드백 생성 (환경별 조건부 처리)
  async generateTrainingFeedback(trainingData) {
    console.log('🤖 AI 피드백 생성 시작')
    console.log('🌍 환경:', this.isDevelopment ? '개발' : '배포')
    console.log('🔧 Vercel Functions 사용:', this.useVercelFunctions)
    console.log('📊 훈련 점수:', trainingData.score)
    
    if (!this.isConfigured()) {
      console.warn('❌ AI 서비스가 설정되지 않았습니다. 기본 피드백을 사용합니다.')
      return this.getFallbackFeedback(trainingData)
    }

    if (this.useVercelFunctions) {
      // 배포 환경: Vercel Functions 사용
      return this.callVercelFunctions(trainingData)
    } else {
      // 개발 환경: 직접 OpenAI API 호출
      return this.callOpenAIDirect(trainingData)
    }
  }

  // Vercel Functions를 통한 AI 피드백 생성 (배포 환경)
  async callVercelFunctions(trainingData) {
    console.log('🚀 Vercel Functions API 호출 시작...')

    try {
      const response = await fetch(`${this.baseURL}/ai-feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          trainingData
        })
      })

      console.log('📡 Vercel API 응답 상태:', response.status, response.statusText)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Vercel API 오류 응답:', errorText)
        throw new Error(`Vercel API 요청 실패: ${response.status} ${response.statusText} - ${errorText}`)
      }

      const feedback = await response.json()
      console.log('✅ Vercel Functions에서 피드백 수신 성공')
      console.log('🎯 AI 생성 여부:', feedback.aiGenerated)
      
      return feedback
      
    } catch (error) {
      console.error('💥 Vercel Functions 호출 실패:', error)
      console.log('🔄 기본 피드백으로 전환')
      return this.getFallbackFeedback(trainingData)
    }
  }

  // OpenAI API 직접 호출 (개발 환경)
  async callOpenAIDirect(trainingData) {
    console.log('🚀 OpenAI API 직접 호출 시작...')

    // 비용 절약: 설정된 점수 이상이면 기본 피드백 사용
    const maxScoreForAI = parseInt(import.meta.env.VITE_AI_MIN_SCORE || '100')
    console.log('🎯 AI 사용 최대 점수:', maxScoreForAI)
    
    if (trainingData.score > maxScoreForAI) {
      console.log(`✅ 높은 점수(${trainingData.score}점)로 인해 기본 피드백 사용 (비용 절약)`)
      return this.getFallbackFeedback(trainingData)
    }

    try {
      const prompt = this.createFeedbackPrompt(trainingData)
      
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `당신은 도시가스 비상대응 훈련 전문가입니다. 
              훈련생의 성과를 분석하고 개인화된 피드백을 제공하는 것이 목표입니다.
              응답은 반드시 JSON 형식으로 제공해주세요.`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
          response_format: { type: "json_object" }
        })
      })

      console.log('📡 OpenAI API 응답 상태:', response.status, response.statusText)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ OpenAI API 오류 응답:', errorText)
        throw new Error(`OpenAI API 요청 실패: ${response.status} ${response.statusText} - ${errorText}`)
      }

      const data = await response.json()
      console.log('✅ OpenAI API 응답 성공')
      console.log('📊 사용된 모델:', data.model)
      console.log('🔢 사용된 토큰:', data.usage)
      
      const aiResponse = JSON.parse(data.choices[0].message.content)
      const formattedFeedback = this.formatAIFeedback(aiResponse, trainingData)
      
      return formattedFeedback
      
    } catch (error) {
      console.error('💥 OpenAI API 직접 호출 실패:', error)
      console.log('🔄 기본 피드백으로 전환')
      return this.getFallbackFeedback(trainingData)
    }
  }

  // AI용 프롬프트 생성 (개발 환경에서 사용)
  createFeedbackPrompt(trainingData) {
    const {
      scenarioTitle,
      participant,
      role,
      score,
      timeSpent,
      stepScores,
      actions,
      totalSteps
    } = trainingData

    return `다음 도시가스 비상대응 훈련 결과를 분석하고 개인화된 피드백을 제공해주세요:

**훈련 정보:**
- 시나리오: ${scenarioTitle || '도시가스 비상대응 훈련'}
- 참가자: ${participant || 'Unknown'}
- 역할: ${role || 'Unknown'}
- 최종 점수: ${score || 0}점 (100점 만점)
- 소요 시간: ${timeSpent || 'N/A'}
- 총 단계수: ${totalSteps || 23}

다음 JSON 형식으로 응답해주세요:
{
  "overallAssessment": "전반적인 성과 평가 (2-3문장)",
  "strengths": ["강점 1", "강점 2", "강점 3"],
  "improvementAreas": ["개선점 1", "개선점 2", "개선점 3"],
  "specificFeedback": [
    {
      "category": "의사결정",
      "feedback": "구체적인 피드백"
    },
    {
      "category": "대응시간",
      "feedback": "구체적인 피드백"
    }
  ],
  "actionPlan": ["행동계획 1", "행동계획 2"],
  "nextTrainingRecommendations": ["다음 훈련 권장사항 1", "다음 훈련 권장사항 2"]
}`
  }

  // AI 응답을 시스템 형식에 맞게 변환 (개발 환경에서 사용)
  formatAIFeedback(aiResponse, trainingData) {
    const { score } = trainingData
    
    let title, message, level
    if (score >= 90) {
      title = '🏆 우수한 성과!'
      message = '뛰어난 비상대응 능력을 보여주셨습니다.'
      level = 'excellent'
    } else if (score >= 80) {
      title = '✅ 양호한 성과'
      message = '전반적으로 좋은 대응 능력을 보여주셨습니다.'
      level = 'good'
    } else if (score >= 70) {
      title = '📊 보통 성과'
      message = '기본적인 대응 절차는 이해하고 있으나 개선이 필요합니다.'
      level = 'average'
    } else if (score >= 60) {
      title = '⚡ 개선 필요'
      message = '비상대응 절차에 대한 추가 학습이 필요합니다.'
      level = 'poor'
    } else {
      title = '📚 재훈련 권장'
      message = '기본 절차부터 다시 학습하시기 바랍니다.'
      level = 'fail'
    }

    return {
      title,
      message: aiResponse.overallAssessment || message,
      score,
      level,
      timeSpent: trainingData.timeSpent,
      
      // AI 생성 피드백
      aiGenerated: true,
      strengths: aiResponse.strengths || [],
      improvementAreas: aiResponse.improvementAreas || [],
      specificFeedback: aiResponse.specificFeedback || [],
      actionPlan: aiResponse.actionPlan || [],
      nextTrainingRecommendations: aiResponse.nextTrainingRecommendations || [],
      
      // 기존 시스템과 호환성
      criticalActionsMissed: (trainingData.actions || []).filter(a => !a.isCorrect).map(a => a.action),
      excellentActions: (trainingData.actions || []).filter(a => a.isCorrect && a.isCritical).map(a => a.action),
      personalizedImprovement: aiResponse.improvementAreas || [],
      scenarioSpecificTips: aiResponse.nextTrainingRecommendations || [],
      commonMistakes: [
        '초기 상황 판단 시 세부사항 놓침',
        '보고 체계 미준수',
        '안전 절차 생략',
        '협조 기관과의 소통 부족'
      ]
    }
  }


  // 기본 피드백 (AI 사용 불가능 시)
  getFallbackFeedback(trainingData) {
    const { score, timeSpent } = trainingData
    
    let title, message, level
    if (score >= 90) {
      title = '🏆 우수한 성과!'
      message = '모든 비상대응 절차를 정확히 수행하셨습니다. 뛰어난 위기관리 능력을 보여주셨습니다.'
      level = 'excellent'
    } else if (score >= 80) {
      title = '✅ 양호한 성과'
      message = '대부분의 상황에서 적절한 대응을 하셨습니다. 몇 가지 세부사항만 보완하면 완벽합니다.'
      level = 'good'
    } else if (score >= 70) {
      title = '📊 보통 성과'
      message = '기본적인 대응 절차는 이해하고 있으나, 일부 중요한 단계에서 개선이 필요합니다.'
      level = 'average'
    } else if (score >= 60) {
      title = '⚡ 개선 필요'
      message = '비상대응 절차에 대한 이해도를 높이고 반복 훈련이 필요합니다.'
      level = 'poor'
    } else {
      title = '📚 재훈련 권장'
      message = '기본 절차부터 차근차근 다시 학습하시기 바랍니다.'
      level = 'fail'
    }

    return {
      title,
      message,
      score,
      level,
      timeSpent,
      aiGenerated: false,
      
      // 기본 피드백
      strengths: this.getBasicStrengths(trainingData),
      improvementAreas: this.getBasicImprovements(trainingData),
      specificFeedback: this.getBasicSpecificFeedback(trainingData),
      actionPlan: this.getBasicActionPlan(trainingData),
      nextTrainingRecommendations: this.getBasicRecommendations(trainingData),
      
      // 기존 시스템과 호환성
      criticalActionsMissed: trainingData.actions?.filter(a => !a.isCorrect).map(a => a.action) || [],
      excellentActions: trainingData.actions?.filter(a => a.isCorrect && a.isCritical).map(a => a.action) || [],
      personalizedImprovement: this.getBasicImprovements(trainingData),
      scenarioSpecificTips: this.getBasicRecommendations(trainingData),
      commonMistakes: [
        '초기 상황 판단 시 세부사항 놓침',
        '보고 체계 미준수',
        '안전 절차 생략',
        '협조 기관과의 소통 부족'
      ]
    }
  }

  // 기본 강점 분석
  getBasicStrengths(trainingData) {
    const { score, stepScores } = trainingData
    const strengths = []
    
    if (score >= 80) strengths.push('전반적으로 우수한 비상대응 능력')
    if (score >= 70) strengths.push('기본적인 절차 이해도 양호')
    
    const perfectSteps = Object.values(stepScores).filter(s => s === 100).length
    if (perfectSteps > 5) strengths.push('다수 단계에서 완벽한 대응')
    
    if (strengths.length === 0) strengths.push('훈련 참여 의지')
    
    return strengths
  }

  // 기본 개선사항 분석
  getBasicImprovements(trainingData) {
    const { score, stepScores } = trainingData
    const improvements = []
    
    if (score < 60) improvements.push('기본 비상대응 절차 학습 필요')
    if (score < 80) improvements.push('상황 판단 능력 향상 필요')
    
    const failedSteps = Object.values(stepScores).filter(s => s < 60).length
    if (failedSteps > 3) improvements.push('단계별 세부 절차 숙지 필요')
    
    return improvements
  }

  // 기본 구체적 피드백
  getBasicSpecificFeedback(trainingData) {
    const { score } = trainingData
    
    return [
      {
        category: '의사결정',
        feedback: score >= 70 ? '적절한 의사결정을 하셨습니다.' : '신속하고 정확한 의사결정 능력 향상이 필요합니다.'
      },
      {
        category: '절차준수',
        feedback: score >= 70 ? '대부분의 절차를 올바르게 따랐습니다.' : '표준 비상대응 절차를 정확히 숙지하시기 바랍니다.'
      },
      {
        category: '대응속도',
        feedback: '적절한 대응 속도를 유지하셨습니다.'
      }
    ]
  }

  // 기본 행동계획
  getBasicActionPlan(trainingData) {
    const { score } = trainingData
    const plans = []
    
    if (score < 70) plans.push('비상대응 매뉴얼 정독 및 숙지')
    if (score < 80) plans.push('단계별 절차 반복 학습')
    plans.push('정기적인 모의훈련 참여')
    
    return plans
  }

  // 기본 다음 훈련 권장사항
  getBasicRecommendations(trainingData) {
    const { score } = trainingData
    const recommendations = []
    
    if (score < 60) recommendations.push('기본 절차 중심의 훈련')
    if (score < 80) recommendations.push('상황별 대응 방법 훈련')
    recommendations.push('팀워크 향상 훈련')
    
    return recommendations
  }

}

// 싱글톤 인스턴스 생성
const aiService = new AIService()

export default aiService
