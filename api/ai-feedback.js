// Vercel Functions - AI 피드백 생성 API
// 프론트엔드에서 OpenAI API 키가 노출되지 않도록 보안 강화

export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  // OPTIONS 요청 처리 (CORS preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // POST 요청만 허용
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    console.log('🤖 Vercel Function - AI 피드백 생성 시작')
    
    // 환경변수에서 OpenAI API 키 가져오기 (서버에서만 접근 가능)
    const openaiApiKey = process.env.OPENAI_API_KEY
    const aiEnabled = process.env.AI_FEEDBACK_ENABLED === 'true'
    const maxScoreForAI = parseInt(process.env.AI_MIN_SCORE || '100')

    console.log('🔑 API 키 존재:', !!openaiApiKey)
    console.log('⚙️ AI 활성화:', aiEnabled)

    if (!openaiApiKey || !aiEnabled) {
      console.warn('❌ AI 서비스가 설정되지 않았습니다. 기본 피드백을 사용합니다.')
      return res.status(200).json(generateFallbackFeedback(req.body))
    }

    const { trainingData } = req.body
    
    if (!trainingData) {
      return res.status(400).json({ error: 'Training data is required' })
    }

    console.log('📊 훈련 점수:', trainingData.score)
    console.log('🎯 AI 사용 최대 점수:', maxScoreForAI)

    // 점수가 높으면 기본 피드백 사용 (비용 절약)
    if (trainingData.score > maxScoreForAI) {
      console.log(`✅ 높은 점수(${trainingData.score}점)로 인해 기본 피드백 사용 (비용 절약)`)
      return res.status(200).json(generateFallbackFeedback(trainingData))
    }

    console.log(`🤖 점수(${trainingData.score}점)가 ${maxScoreForAI}점 이하이므로 AI 피드백 생성`)
    console.log('🚀 OpenAI API 호출 시작...')

    // OpenAI API 호출
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
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
            content: createFeedbackPrompt(trainingData)
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: "json_object" }
      })
    })

    console.log('📡 API 응답 상태:', response.status, response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ API 오류 응답:', errorText)
      throw new Error(`AI API 요청 실패: ${response.status} ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()
    console.log('✅ API 응답 성공 - OpenAI에서 직접 받은 데이터')
    console.log('📊 사용된 모델:', data.model)
    console.log('🔢 사용된 토큰:', data.usage)
    console.log('⏰ API 호출 시간:', new Date().toISOString())

    const aiResponse = JSON.parse(data.choices[0].message.content)
    console.log('🎯 ChatGPT가 실제로 생성한 피드백 수신 완료')

    const formattedFeedback = formatAIFeedback(aiResponse, trainingData)
    console.log('📋 최종 피드백 포맷팅 완료')

    return res.status(200).json(formattedFeedback)

  } catch (error) {
    console.error('💥 AI 피드백 생성 실패:', error)
    console.log('🔄 기본 피드백으로 전환')
    
    // AI 실패 시 기본 피드백 반환
    return res.status(200).json(generateFallbackFeedback(req.body.trainingData || {}))
  }
}

// AI용 프롬프트 생성
function createFeedbackPrompt(trainingData) {
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

  // 단계별 성과 분석
  const stepPerformance = Object.entries(stepScores || {}).map(([stepIndex, stepScore]) => {
    const stepActions = (actions || []).filter(a => a.step === parseInt(stepIndex))
    return {
      step: parseInt(stepIndex) + 1,
      score: stepScore,
      actions: stepActions.map(a => ({ action: a.action, correct: a.isCorrect }))
    }
  })

  // 약점 단계 식별
  const weakSteps = stepPerformance.filter(step => step.score < 60).map(step => step.step)
  const strongSteps = stepPerformance.filter(step => step.score === 100).map(step => step.step)

  return `다음 도시가스 비상대응 훈련 결과를 분석하고 개인화된 피드백을 제공해주세요:

**훈련 정보:**
- 시나리오: ${scenarioTitle || '도시가스 비상대응 훈련'}
- 참가자: ${participant || 'Unknown'}
- 역할: ${role || 'Unknown'}
- 최종 점수: ${score || 0}점 (100점 만점)
- 소요 시간: ${timeSpent || 'N/A'}
- 총 단계수: ${totalSteps || 23}

**단계별 성과:**
${stepPerformance.map(step => 
  `단계 ${step.step}: ${step.score}점 - 행동: ${step.actions.map(a => `${a.action}(${a.correct ? '정답' : '오답'})`).join(', ')}`
).join('\n')}

**성과 요약:**
- 우수한 단계: ${strongSteps.length > 0 ? strongSteps.join(', ') + '단계' : '없음'}
- 미흡한 단계: ${weakSteps.length > 0 ? weakSteps.join(', ') + '단계' : '없음'}

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
    },
    {
      "category": "절차준수",
      "feedback": "구체적인 피드백"
    }
  ],
  "actionPlan": [
    "개선을 위한 구체적인 행동계획 1",
    "개선을 위한 구체적인 행동계획 2",
    "개선을 위한 구체적인 행동계획 3"
  ],
  "nextTrainingRecommendations": [
    "다음 훈련 시 집중할 영역 1",
    "다음 훈련 시 집중할 영역 2"
  ]
}`
}

// AI 응답을 시스템 형식에 맞게 변환
function formatAIFeedback(aiResponse, trainingData) {
  const { score } = trainingData
  
  // 점수에 따른 기본 템플릿 선택
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
function generateFallbackFeedback(trainingData) {
  const { score = 0, timeSpent = '0:00' } = trainingData
  
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
    strengths: ['훈련 참여 의지', '기본적인 절차 이해'],
    improvementAreas: ['상황 판단 능력 향상', '절차별 세부 사항 숙지'],
    specificFeedback: [
      {
        category: '의사결정',
        feedback: score >= 70 ? '적절한 의사결정을 하셨습니다.' : '신속하고 정확한 의사결정 능력 향상이 필요합니다.'
      },
      {
        category: '절차준수',
        feedback: score >= 70 ? '대부분의 절차를 올바르게 따랐습니다.' : '표준 비상대응 절차를 정확히 숙지하시기 바랍니다.'
      }
    ],
    actionPlan: ['비상대응 매뉴얼 정독', '정기적인 모의훈련 참여'],
    nextTrainingRecommendations: ['기본 절차 중심 훈련', '상황별 대응 방법 학습'],
    
    // 기존 시스템과 호환성
    criticalActionsMissed: [],
    excellentActions: [],
    personalizedImprovement: ['상황 판단 능력 향상', '절차별 세부 사항 숙지'],
    scenarioSpecificTips: ['기본 절차 중심 훈련', '상황별 대응 방법 학습'],
    commonMistakes: [
      '초기 상황 판단 시 세부사항 놓침',
      '보고 체계 미준수',
      '안전 절차 생략',
      '협조 기관과의 소통 부족'
    ]
  }
}
