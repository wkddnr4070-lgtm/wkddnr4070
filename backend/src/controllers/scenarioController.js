// 실제 시나리오 데이터 (임시)
const scenarios = [
  {
    id: 1,
    title: '도시가스 비상대응',
    description: '도시가스 누출 및 화재 상황 대응 훈련 시나리오입니다.',
    duration: 30,
    difficulty: 'medium',
    status: 'active',
    type: 'emergency_response',
    participants: 24,
    completionRate: 87.5,
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-11-28T15:30:00Z'
  },
  {
    id: 2,
    title: '팀 협력 훈련',
    description: '다중 역할 협력 시뮬레이션 훈련입니다.',
    duration: 45,
    difficulty: 'high',
    status: 'active',
    type: 'team_collaboration',
    participants: 18,
    completionRate: 92.3,
    createdAt: '2024-02-20T10:15:00Z',
    updatedAt: '2024-11-27T14:20:00Z'
  },
  {
    id: 3,
    title: '개별 대응 훈련',
    description: '개인 역량 강화를 위한 단독 대응 훈련입니다.',
    duration: 20,
    difficulty: 'low',
    status: 'active',
    type: 'individual_training',
    participants: 41,
    completionRate: 94.1,
    createdAt: '2024-03-10T11:00:00Z',
    updatedAt: '2024-11-26T16:45:00Z'
  }
]

export default {
  createScenario: async (req, res) => {
    res.json({ success: true, data: {}, message: '시나리오 생성 API (구현 예정)' })
  },
  
  getScenarios: async (req, res) => {
    try {
      console.log('📊 시나리오 목록 요청 처리 중...')
      res.json({ 
        success: true, 
        data: scenarios, 
        message: '시나리오 목록을 성공적으로 가져왔습니다.',
        total: scenarios.length
      })
    } catch (error) {
      console.error('시나리오 목록 조회 오류:', error)
      res.status(500).json({ success: false, message: '시나리오 목록 조회 실패' })
    }
  },
  
  getScenarioById: async (req, res) => {
    try {
      const { id } = req.params
      const scenario = scenarios.find(s => s.id === parseInt(id))
      
      if (!scenario) {
        return res.status(404).json({ success: false, message: '시나리오를 찾을 수 없습니다.' })
      }
      
      res.json({ success: true, data: scenario, message: '시나리오 조회 성공' })
    } catch (error) {
      console.error('시나리오 조회 오류:', error)
      res.status(500).json({ success: false, message: '시나리오 조회 실패' })
    }
  },
  
  updateScenario: async (req, res) => {
    res.json({ success: true, data: {}, message: '시나리오 수정 API (구현 예정)' })
  },
  
  deleteScenario: async (req, res) => {
    res.json({ success: true, message: '시나리오 삭제 API (구현 예정)' })
  },
  
  getScenarioStats: async (req, res) => {
    try {
      const stats = {
        totalScenarios: scenarios.length,
        activeScenarios: scenarios.filter(s => s.status === 'active').length,
        totalParticipants: scenarios.reduce((sum, s) => sum + s.participants, 0),
        averageCompletionRate: scenarios.reduce((sum, s) => sum + s.completionRate, 0) / scenarios.length
      }
      
      res.json({ success: true, data: stats, message: '시나리오 통계 조회 성공' })
    } catch (error) {
      console.error('시나리오 통계 조회 오류:', error)
      res.status(500).json({ success: false, message: '시나리오 통계 조회 실패' })
    }
  }
}
