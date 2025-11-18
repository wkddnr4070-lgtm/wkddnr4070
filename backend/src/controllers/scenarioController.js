export default {
  createScenario: async (req, res) => {
    res.json({ success: true, data: {}, message: '시나리오 생성 API (구현 예정)' })
  },
  getScenarios: async (req, res) => {
    res.json({ success: true, data: [], message: '시나리오 목록 API (구현 예정)' })
  },
  getScenarioById: async (req, res) => {
    res.json({ success: true, data: {}, message: '시나리오 조회 API (구현 예정)' })
  },
  updateScenario: async (req, res) => {
    res.json({ success: true, data: {}, message: '시나리오 수정 API (구현 예정)' })
  },
  deleteScenario: async (req, res) => {
    res.json({ success: true, message: '시나리오 삭제 API (구현 예정)' })
  },
  getScenarioStats: async (req, res) => {
    res.json({ success: true, data: {}, message: '시나리오 통계 API (구현 예정)' })
  }
}
