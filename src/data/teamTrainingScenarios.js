// 팀 단위 훈련용 시나리오 데이터 - Updated 2024

export const teamScenarios = {
  gas_leak: {
    title: 'OO동 OOO아파트 인근 도시가스 중압배관 파손',
    type: 'gas_leak',
    description: '평일 09:35 발생한 도시가스 중압배관 파손 사고 대응 훈련',
    duration: 30, // 분
    difficulty: 'high',

    // 절차별 체크리스트
    procedures: {
      A: {
        name: '초기 대응',
        description: '사고 발생 시 즉시 취해야 할 조치',
        weight: 10, // 감점 가중치
        steps: [
          {
            id: 'A1',
            name: '안전장비 착용',
            description: '모든 팀원이 가스 탐지기, 방독면 등 안전장비 착용',
            required: true,
            penalty: 10
          },
          {
            id: 'A2',
            name: '아파트 주변 접근 금지',
            description: 'OO동 OOO아파트 주변 위험 구역 접근 금지 표지 설치',
            required: true,
            penalty: 10
          },
          {
            id: 'A3',
            name: '119 신고 및 가스공급사 연락',
            description: '소방서 신고 및 가스공급사에 중압배관 파손 신고',
            required: true,
            penalty: 10
          },
          {
            id: 'A4',
            name: '아파트 주민 대피 지시',
            description: 'OO동 OOO아파트 주민 및 인근 반경 100m 내 대피 지시',
            required: true,
            penalty: 10
          }
        ]
      },
      B: {
        name: '상황 파악',
        description: '사고 상황을 정확히 파악하고 평가',
        weight: 5,
        steps: [
          {
            id: 'B1',
            name: '아파트 인근 중압배관 파손 지점 확인',
            description: 'OO동 OOO아파트 인근 중압배관 파손 지점 정확히 파악',
            required: true,
            penalty: 5
          },
          {
            id: 'B2',
            name: '가스 누출량 및 압력 측정',
            description: '중압배관에서 누출되는 가스량과 압력 측정',
            required: true,
            penalty: 5
          },
          {
            id: 'B3',
            name: '아파트 주민 안전 확인',
            description: 'OO동 OOO아파트 주민 안전 상태 및 대피 상황 확인',
            required: true,
            penalty: 5
          },
          {
            id: 'B4',
            name: '관제센터 및 가스공급사 보고',
            description: '아파트 인근 중압배관 파손 상황을 관제센터와 가스공급사에 보고',
            required: true,
            penalty: 5
          }
        ]
      },
      C: {
        name: '대응 조치',
        description: '사고 확산 방지 및 복구를 위한 조치',
        weight: 3,
        steps: [
          {
            id: 'C1',
            name: '아파트 인근 중압배관 차단밸브 조작',
            description: 'OO동 OOO아파트 인근 중압배관 상류 및 하류 차단밸브 조작',
            required: true,
            penalty: 3
          },
          {
            id: 'C2',
            name: '아파트 주변 안전 확보',
            description: 'OO동 OOO아파트 주변 안전 확보 및 접근 통제',
            required: true,
            penalty: 3
          },
          {
            id: 'C3',
            name: '가스공급사 기술진 투입',
            description: '가스공급사 기술진 현장 투입 및 중압배관 복구 작업',
            required: true,
            penalty: 3
          },
          {
            id: 'C4',
            name: '아파트 인근 중압배관 복구 계획 수립',
            description: 'OO동 OOO아파트 인근 중압배관 복구 작업 계획 수립 및 실행',
            required: true,
            penalty: 3
          }
        ]
      },
      D: {
        name: '사후 처리',
        description: '사고 후 정리 및 재발 방지 조치',
        weight: 1,
        steps: [
          {
            id: 'D1',
            name: '사고 보고서 작성',
            description: '상세한 사고 보고서 작성',
            required: false,
            penalty: 1
          },
          {
            id: 'D2',
            name: '재발 방지 대책',
            description: '재발 방지를 위한 대책 수립',
            required: false,
            penalty: 1
          },
          {
            id: 'D3',
            name: '교육 계획 수립',
            description: '팀원 교육 계획 수립',
            required: false,
            penalty: 1
          }
        ]
      }
    },

    // 팀 역할별 책임
    teamRoles: {
      leader: {
        name: '팀장',
        description: '전체 지휘 및 의사결정',
        responsibilities: [
          '전체 상황 판단',
          '팀원 업무 분담',
          '의사결정',
          '상위 보고'
        ],
        keyActions: [
          '상황 판단',
          '업무 지시',
          '보고',
          '의사결정'
        ]
      },
      field: {
        name: '현장팀',
        description: '현장에서 실제 작업 수행',
        responsibilities: [
          '안전장비 착용',
          '현장 작업 수행',
          '상황 보고',
          '안전 확보'
        ],
        keyActions: [
          '안전장비 착용',
          '현장 출동',
          '작업 수행',
          '상황 보고'
        ]
      },
      control: {
        name: '관제팀',
        description: '상황 모니터링 및 통신 관리',
        responsibilities: [
          '상황 모니터링',
          '통신 관리',
          '정보 수집',
          '보고 체계 관리'
        ],
        keyActions: [
          '상황 모니터링',
          '통신 관리',
          '정보 수집',
          '보고'
        ]
      },
      safety: {
        name: '안전팀',
        description: '안전 확보 및 위험 관리',
        responsibilities: [
          '안전 확보',
          '위험 평가',
          '대피 계획',
          '안전 교육'
        ],
        keyActions: [
          '안전 확보',
          '위험 평가',
          '대피 지시',
          '안전 점검'
        ]
      }
    }
  },

  fire: {
    title: '무단굴착공사로 인한 도시가스 중압배관 파손',
    type: 'fire',
    description: '전라북도 익산시 신동 123-45 일대 무단굴착공사 중 발생한 도시가스 중압배관 파손 사고 대응 훈련',
    duration: 25,
    difficulty: 'high',

    procedures: {
      A: {
        name: '초기 대응',
        weight: 10,
        steps: [
          {
            id: 'A1',
            name: '안전장비 착용',
            description: '모든 팀원이 가스 탐지기, 방독면 등 안전장비 착용',
            required: true,
            penalty: 10
          },
          {
            id: 'A2',
            name: '굴착공사 현장 접근 금지',
            description: '익산시 신동 무단굴착공사 현장 주변 접근 금지 표지 설치',
            required: true,
            penalty: 10
          },
          {
            id: 'A3',
            name: '119 신고 및 가스공급사 연락',
            description: '소방서 신고 및 가스공급사에 익산시 신동 무단굴착으로 인한 중압배관 파손 신고',
            required: true,
            penalty: 10
          },
          {
            id: 'A4',
            name: '굴착공사 현장 주변 대피 지시',
            description: '익산시 신동 무단굴착공사 현장 주변 반경 100m 내 대피 지시',
            required: true,
            penalty: 10
          }
        ]
      },
      B: {
        name: '무단굴착공사 중압배관 복구',
        weight: 5,
        steps: [
          {
            id: 'B1',
            name: '굴착공사 현장 중압배관 차단밸브 조작',
            description: '익산시 신동 무단굴착공사 현장 중압배관 상류 및 하류 차단밸브 조작',
            required: true,
            penalty: 5
          },
          {
            id: 'B2',
            name: '굴착공사 범위 및 중압배관 파손 지점 확인',
            description: '익산시 신동 무단굴착공사 범위와 중압배관 파손 지점 및 범위 확인',
            required: true,
            penalty: 5
          },
          {
            id: 'B3',
            name: '가스공급사 기술진 현장 투입',
            description: '가스공급사 기술진 익산시 신동 현장 투입 및 중압배관 복구 작업',
            required: true,
            penalty: 5
          }
        ]
      }
    },

    teamRoles: {
      leader: {
        name: '팀장',
        description: '전체 지휘 및 의사결정',
        responsibilities: ['전체 상황 판단', '팀원 업무 분담', '의사결정', '상위 보고'],
        keyActions: ['상황 판단', '업무 지시', '보고', '의사결정']
      },
      field: {
        name: '현장팀',
        description: '굴착공사 현장 작업 및 중압배관 복구',
        responsibilities: ['현장 작업 수행', '중압배관 복구', '안전 확보', '상황 보고'],
        keyActions: ['현장 출동', '배관 복구', '안전 확보', '상황 보고']
      },
      safety: {
        name: '안전팀',
        description: '안전 확보 및 대피 관리',
        responsibilities: ['안전 확보', '대피 지시', '인원 확인', '상황 보고'],
        keyActions: ['안전 확보', '대피 지시', '인원 확인', '상황 보고']
      }
    }
  },

  customer_complaint: {
    title: '도시가스 저압배관 파손 사고 대응 팀 훈련',
    type: 'customer_complaint',
    description: '전라북도 익산시 평화동 456-78 일대 도로공사 중 발생한 도시가스 저압배관 파손 사고 대응 훈련',
    duration: 20,
    difficulty: 'medium',

    procedures: {
      A: {
        name: '초기 대응',
        weight: 5,
        steps: [
          {
            id: 'A1',
            name: '저압배관 파손 신고',
            description: '119에 익산시 평화동 도로공사 중 발생한 도시가스 저압배관 파손 신고',
            required: true,
            penalty: 5
          },
          {
            id: 'A2',
            name: '반경 50m 대피 지시',
            description: '익산시 평화동 저압배관 파손으로 인한 반경 50m 내 대피 지시',
            required: true,
            penalty: 5
          },
          {
            id: 'A3',
            name: '전기 차단',
            description: '익산시 평화동 저압배관 파손 현장 주변 전기 차단',
            required: true,
            penalty: 5
          },
          {
            id: 'A4',
            name: '가스공급사 긴급 연락',
            description: '가스공급사에 익산시 평화동 저압배관 파손 긴급 연락',
            required: true,
            penalty: 5
          }
        ]
      },
      B: {
        name: '저압배관 복구',
        weight: 3,
        steps: [
          {
            id: 'B1',
            name: '저압배관 차단밸브 조작',
            description: '저압배관 상류 차단밸브 조작',
            required: true,
            penalty: 3
          },
          {
            id: 'B2',
            name: '저압배관 파손 지점 확인',
            description: '저압배관 파손 지점 및 범위 확인',
            required: true,
            penalty: 3
          },
          {
            id: 'B3',
            name: '가스공급사 기술진 현장 투입',
            description: '가스공급사 기술진 현장 투입 및 복구 작업',
            required: true,
            penalty: 3
          }
        ]
      }
    },

    teamRoles: {
      leader: {
        name: '팀장',
        description: '전체 지휘 및 의사결정',
        responsibilities: ['전체 상황 판단', '팀원 업무 분담', '의사결정', '상위 보고'],
        keyActions: ['상황 판단', '업무 지시', '보고', '의사결정']
      },
      field: {
        name: '현장팀',
        description: '저압배관 현장 작업 및 복구',
        responsibilities: ['현장 작업 수행', '저압배관 복구', '안전 확보', '상황 보고'],
        keyActions: ['현장 출동', '배관 복구', '안전 확보', '상황 보고']
      },
      technical: {
        name: '기술팀',
        description: '기술적 문제 해결 및 복구',
        responsibilities: ['현장 확인', '기술 진단', '문제 해결', '보고서 작성'],
        keyActions: ['현장 확인', '기술 진단', '문제 해결', '보고서 작성']
      }
    }
  }
}

// 팀 평가 기준
export const teamEvaluationCriteria = {
  procedureCompletion: {
    excellent: { threshold: 95, label: '우수' },
    good: { threshold: 85, label: '양호' },
    average: { threshold: 70, label: '보통' },
    poor: { threshold: 60, label: '미흡' },
    fail: { threshold: 0, label: '실패' }
  },

  timeBonus: {
    excellent: { threshold: 0.8, multiplier: 1.2 },
    good: { threshold: 0.9, multiplier: 1.1 },
    average: { threshold: 1.0, multiplier: 1.0 },
    poor: { threshold: 1.2, multiplier: 0.9 }
  },

  collaborationBonus: {
    communication: 5, // 의사소통 점수
    coordination: 5,  // 협조 점수
    leadership: 5     // 리더십 점수
  }
}

// 팀 피드백 템플릿
export const teamFeedbackTemplates = {
  excellent: {
    title: '우수한 팀워크!',
    message: '모든 절차를 완벽하게 수행하고 훌륭한 팀워크를 보여주었습니다.',
    improvements: ['지속적인 훈련으로 더욱 발전하세요'],
    strengths: ['완벽한 절차 수행', '훌륭한 팀워크', '효율적인 의사소통']
  },
  good: {
    title: '잘 수행했습니다!',
    message: '대부분의 절차를 올바르게 수행했으며 좋은 팀워크를 보여주었습니다.',
    improvements: ['몇 가지 절차를 더 신속하게 처리하세요'],
    strengths: ['대부분 절차 완료', '좋은 협업', '적절한 의사소통']
  },
  average: {
    title: '보통 수준입니다',
    message: '기본적인 절차는 수행했지만 일부 개선이 필요합니다.',
    improvements: ['절차 숙지도 향상', '팀워크 개선', '의사소통 강화'],
    strengths: ['기본 절차 수행', '팀 협력', '문제 해결 의지']
  },
  poor: {
    title: '개선이 필요합니다',
    message: '중요한 절차를 놓치거나 팀워크에 문제가 있었습니다.',
    improvements: ['절차 재교육', '팀워크 훈련', '의사소통 개선'],
    strengths: ['훈련 참여 의지', '일부 절차 수행']
  },
  fail: {
    title: '재훈련이 필요합니다',
    message: '핵심 절차를 놓치거나 심각한 문제가 발생했습니다.',
    improvements: ['전체 절차 재교육', '기본 훈련 강화', '팀워크 기초 훈련'],
    strengths: ['훈련 참여']
  }
}
