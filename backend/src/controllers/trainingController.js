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
    res.json({ success: true, data: [], message: '훈련 세션 목록 API (구현 예정)' })
  },
  getTrainingSessionById: async (req, res) => {
    res.json({ success: true, data: {}, message: '훈련 세션 조회 API (구현 예정)' })
  }
}
