// 실제 훈련 세션 데이터 (임시)
const trainingSessions = [
  {
    id: 'training-001',
    scenarioId: 1,
    scenarioTitle: '도시가스 비상대응',
    participant: '김현수',
    role: '안전관리자',
    status: 'completed',
    score: 87.5,
    startTime: '2024-11-28T09:15:00Z',
    endTime: '2024-11-28T09:45:00Z',
    duration: 30,
    completedAt: '2024-11-28T09:45:00Z'
  },
  {
    id: 'training-002', 
    scenarioId: 1,
    scenarioTitle: '도시가스 비상대응',
    participant: '이지영',
    role: '현장대응팀',
    status: 'completed',
    score: 92.3,
    startTime: '2024-11-28T10:00:00Z',
    endTime: '2024-11-28T10:28:00Z',
    duration: 28,
    completedAt: '2024-11-28T10:28:00Z'
  },
  {
    id: 'training-003',
    scenarioId: 2,
    scenarioTitle: '팀 협력 훈련',
    participant: '박민재',
    role: '팀리더',
    status: 'completed',
    score: 78.9,
    startTime: '2024-11-27T14:20:00Z',
    endTime: '2024-11-27T15:05:00Z',
    duration: 45,
    completedAt: '2024-11-27T15:05:00Z'
  },
  {
    id: 'training-004',
    scenarioId: 1,
    scenarioTitle: '도시가스 비상대응',
    participant: '최영호',
    role: '기술지원',
    status: 'in_progress',
    score: null,
    startTime: '2024-11-28T15:30:00Z',
    endTime: null,
    duration: null,
    completedAt: null
  }
]

export default {
  startTrainingSession: async (req, res) => {
    res.json({ success: true, data: {}, message: '훈련 세션 시작 API (구현 예정)' })
  },
  
  submitTrainingResponse: async (req, res) => {
    res.json({ success: true, data: {}, message: '훈련 응답 제출 API (구현 예정)' })
  },
  
  completeTrainingSession: async (req, res) => {
    res.json({ success: true, data: {}, message: '훈련 세션 완료 API (구현 예정)' })
  },
  
  getTrainingSessions: async (req, res) => {
    try {
      console.log('📈 훈련 세션 목록 요청 처리 중...')
      const completedSessions = trainingSessions.filter(session => session.status === 'completed')
      
      res.json({
        success: true,
        data: completedSessions,
        message: '훈련 세션 목록을 성공적으로 가져왔습니다.',
        total: completedSessions.length,
        stats: {
          completed: trainingSessions.filter(s => s.status === 'completed').length,
          inProgress: trainingSessions.filter(s => s.status === 'in_progress').length,
          averageScore: completedSessions.reduce((sum, s) => sum + s.score, 0) / completedSessions.length || 0
        }
      })
    } catch (error) {
      console.error('훈련 세션 목록 조회 오류:', error)
      res.status(500).json({ success: false, message: '훈련 세션 목록 조회 실패' })
    }
  },
  
  getTrainingSessionById: async (req, res) => {
    try {
      const { id } = req.params
      const session = trainingSessions.find(s => s.id === id)
      
      if (!session) {
        return res.status(404).json({ success: false, message: '훈련 세션을 찾을 수 없습니다.' })
      }
      
      res.json({ success: true, data: session, message: '훈련 세션 조회 성공' })
    } catch (error) {
      console.error('훈련 세션 조회 오류:', error)
      res.status(500).json({ success: false, message: '훈련 세션 조회 실패' })
    }
  }
}
