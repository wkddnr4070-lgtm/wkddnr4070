// 비상상황별 상세 훈련 시나리오 데이터
import { scenario2Data } from './scenario2Data.js'
import { scenario3Data } from './scenario3Data.js'

export const detailedScenarios = {
  1: { // 도시가스 중압배관 파손
    title: 'OO동 OOO아파트 인근 도시가스 중압배관 파손',
    type: 'gas_leak',
    severity: 'high',
    duration: 30, // 30분
    description: '평일 09:35 발생한 도시가스 배관 파손 사고 대응 훈련',
    initialSituation: {
      time: '09:35',
      location: 'OO동 OOO아파트 인근',
      weather: '맑음, 기온 15°C, 바람 2m/s (동풍)',
      reportedBy: '아파트 관리사무소',
      initialReport: '지하 주차장에서 가스 냄새가 나며, 인근 도로에서 가스 누출 의심',
      riskFactors: ['주변 아파트 300세대', '인근 초등학교', '지하주차장', '차량 통행량 많음']
    },
    timeline: [
      {
        id: 1,
        time: '09:35',
        title: '사고 신고 접수',
        situation: '아파트 관리사무소에서 "지하주차장에서 가스냄새가 난다"고 신고',
        roleBasedActions: {
          '관제운영반': {
            correctActions: [
              '신고 내용 정확히 기록 (시간, 위치, 상황)',
              '현장 출동팀에 즉시 출동 지시',
              '안전관리팀에 상황 전파',
              '상황실 비상 1단계 발령'
            ],
            timeLimit: 120,
            criticalActions: ['현장 출동팀에 즉시 출동 지시'],
            tips: '신속한 초기 대응이 사고 확산을 방지하는 핵심입니다.'
          },
          '현장출동반': {
            correctActions: [
              '안전장비 착용 및 출동 준비',
              '현장까지의 경로 확인',
              '관제센터에 출동 완료 보고'
            ],
            timeLimit: 180,
            criticalActions: ['안전장비 착용 및 출동 준비'],
            tips: '안전장비 미착용 시 현장 접근 금지입니다.'
          },
          '안전관리반': {
            correctActions: [
              '비상연락망 가동',
              '유관기관 연락 준비',
              '대피 계획 수립 검토'
            ],
            timeLimit: 180,
            criticalActions: ['비상연락망 가동'],
            tips: '초기 대응 시 비상연락망 가동이 중요합니다.'
          }
        },
        teamDiscussion: {
          question: '아파트 인근 가스 누출 신고 접수 시 가장 우선적으로 해야 할 조치는?',
          options: [
            '현장 출동팀에 즉시 출동 지시',
            '아파트 주민 대피 지시',
            '소방서에 신고',
            '가스공급사에 연락'
          ],
          correctAnswer: '현장 출동팀에 즉시 출동 지시',
          explanation: '신속한 현장 확인이 사고 확산 방지의 핵심입니다.'
        }
      },
      {
        id: 2,
        time: '09:40',
        title: '현장 상황 파악',
        situation: '현장 도착 후 가스 누출 확인. 아파트 주변 중압배관 파손 의심',
        roleBasedActions: {
          '관제운영반': {
            correctActions: [
              '현장 상황 상세 보고서 작성',
              '가스공급사에 중압배관 파손 신고',
              '소방서에 가스 누출 신고'
            ],
            timeLimit: 180,
            criticalActions: ['가스공급사에 중압배관 파손 신고'],
            tips: '중압배관 파손은 가스공급사 신고가 필수입니다.'
          },
          '현장출동반': {
            correctActions: [
              '가스 탐지기로 누출량 측정',
              '아파트 주변 접근 금지 표지 설치',
              '파손된 배관 위치 정확히 파악'
            ],
            timeLimit: 300,
            criticalActions: ['가스 탐지기로 누출량 측정'],
            tips: '정확한 누출량 측정이 대응 방안 수립의 핵심입니다.'
          },
          '안전관리반': {
            correctActions: [
              '아파트 주민 대피 지시',
              '교통 통제 및 접근 금지 구역 설정',
              '유관기관 연락'
            ],
            timeLimit: 240,
            criticalActions: ['아파트 주민 대피 지시'],
            tips: '아파트 주민 안전이 최우선입니다.'
          }
        },
        teamDiscussion: {
          question: '아파트 인근 중압배관 파손이 확인되었습니다. 가장 중요한 조치는?',
          options: [
            '아파트 주민 대피 지시',
            '가스공급사에 신고',
            '소방서에 신고',
            '모든 위 사항'
          ],
          correctAnswer: '모든 위 사항',
          explanation: '중압배관 파손은 모든 안전 조치가 필요합니다.'
        }
      },
      {
        id: 3,
        time: '09:50',
        title: '중압배관 차단밸브 조작',
        situation: '가스공급사 기술진 도착. 중압배관 상류 및 하류 차단밸브 조작 준비',
        roleBasedActions: {
          '관제운영반': {
            correctActions: [
              '가스공급사 기술진과 현장 상황 브리핑',
              '차단밸브 조작 계획 수립',
              '아파트 관리사무소와 협의'
            ],
            timeLimit: 180,
            criticalActions: ['가스공급사 기술진과 현장 상황 브리핑'],
            tips: '정확한 상황 전달이 안전한 복구 작업의 기초입니다.'
          },
          '현장출동반': {
            correctActions: [
              '가스공급사 기술진과 함께 차단밸브 위치 확인',
              '아파트 주변 안전 확보',
              '차단밸브 조작 지원'
            ],
            timeLimit: 300,
            criticalActions: ['가스공급사 기술진과 함께 차단밸브 위치 확인'],
            tips: '차단밸브 위치를 정확히 파악해야 안전한 조작이 가능합니다.'
          },
          '안전관리반': {
            correctActions: [
              '아파트 주변 안전 확보',
              '차단밸브 조작 시 추가 대피 계획 수립',
              '아파트 관리사무소와 협의'
            ],
            timeLimit: 240,
            criticalActions: ['아파트 주변 안전 확보'],
            tips: '차단밸브 조작 중에도 안전 확보가 필수입니다.'
          }
        },
        teamDiscussion: {
          question: '중압배관 차단밸브 조작 시 고려해야 할 사항은?',
          options: [
            '아파트 주변 안전 확보',
            '가스공급사 기술진과의 협력',
            '주민 대피 계획 수립',
            '모든 위 사항'
          ],
          correctAnswer: '모든 위 사항',
          explanation: '차단밸브 조작은 위험한 작업이므로 모든 안전 조치가 필요합니다.'
        }
      },
      {
        id: 4,
        time: '10:05',
        title: '중압배관 복구 작업',
        situation: '차단밸브 조작 완료. 중압배관 복구 작업 시작',
        roleBasedActions: {
          '관제운영반': {
            correctActions: [
              '복구 작업 진행 상황 모니터링',
              '아파트 관리사무소와의 협의',
              '복구 완료 후 가스 공급 재개 계획 수립'
            ],
            timeLimit: 300,
            criticalActions: ['복구 작업 진행 상황 모니터링'],
            tips: '복구 작업의 안전한 진행을 위해 지속적인 모니터링이 필요합니다.'
          },
          '현장출동반': {
            correctActions: [
              '복구 작업 현장 지원',
              '안전 장비 점검 및 관리',
              '복구 작업 완료 확인'
            ],
            timeLimit: 600,
            criticalActions: ['복구 작업 현장 지원'],
            tips: '전문 기술진과의 협력이 복구 작업의 핵심입니다.'
          },
          '안전관리반': {
            correctActions: [
              '복구 작업 완료까지 안전 확보',
              '아파트 관리사무소와의 사후 협의',
              '재발 방지 대책 수립'
            ],
            timeLimit: 300,
            criticalActions: ['복구 작업 완료까지 안전 확보'],
            tips: '복구 작업 완료까지 안전 확보가 필수입니다.'
          }
        },
        teamDiscussion: {
          question: '아파트 인근 중압배관 파손 사고의 재발 방지를 위해 필요한 조치는?',
          options: [
            '아파트 관리사무소에 안전 교육 실시',
            '지하 배관 위치 사전 조사 의무화',
            '공사 허가 시 가스공급사 사전 협의',
            '모든 위 사항'
          ],
          correctAnswer: '모든 위 사항',
          explanation: '재발 방지를 위해서는 종합적인 대책이 필요합니다.'
        }
      }
    ]
  },
  2: scenario2Data,
  3: scenario3Data
}

// 역할별 행동 가이드
export const roleActionGuides = {
  '관제운영반': {
    name: '관제운영반',
    description: '전체 상황을 모니터링하고 의사결정을 담당',
    keyResponsibilities: [
      '상황 모니터링 및 보고',
      '의사결정 및 지시',
      '유관기관 연락',
      '자원 배치 및 관리'
    ],
    essentialActions: [
      '신고 접수 및 기록',
      '현장 출동팀 지시',
      '상황 보고서 작성',
      '비상연락망 가동'
    ]
  },
  '현장출동반': {
    name: '현장출동반',
    description: '현장에서 직접 작업을 수행하고 상황을 파악',
    keyResponsibilities: [
      '현장 상황 파악',
      '안전장비 착용 및 사용',
      '기술적 작업 수행',
      '현장 보고'
    ],
    essentialActions: [
      '안전장비 착용',
      '현장 상황 파악',
      '기술적 작업 수행',
      '현장 보고'
    ]
  },
  '안전관리반': {
    name: '안전관리반',
    description: '안전 확보 및 대피 관리',
    keyResponsibilities: [
      '안전 확보',
      '대피 지시 및 관리',
      '접근 통제',
      '유관기관 연락'
    ],
    essentialActions: [
      '안전 확보',
      '대피 지시',
      '접근 통제',
      '유관기관 연락'
    ]
  }
}

// 평가 기준
export const evaluationCriteria = {
  responseTime: {
    excellent: '2분 이내',
    good: '3분 이내',
    fair: '5분 이내',
    poor: '5분 초과'
  },
  safetyCompliance: {
    excellent: '모든 안전 절차 준수',
    good: '주요 안전 절차 준수',
    fair: '일부 안전 절차 준수',
    poor: '안전 절차 미준수'
  },
  communication: {
    excellent: '명확하고 정확한 소통',
    good: '적절한 소통',
    fair: '일부 소통 부족',
    poor: '소통 부족'
  },
  decisionMaking: {
    excellent: '신속하고 정확한 의사결정',
    good: '적절한 의사결정',
    fair: '일부 의사결정 지연',
    poor: '의사결정 지연'
  }
}

// 피드백 템플릿
export const feedbackTemplates = {
  excellent: {
    title: '우수한 대응',
    message: '신속하고 체계적인 대응으로 사고를 효과적으로 관리했습니다.',
    suggestions: ['현재 수준을 유지하세요.', '다른 팀원들과 경험을 공유하세요.']
  },
  good: {
    title: '양호한 대응',
    message: '전반적으로 적절한 대응을 보였습니다.',
    suggestions: ['응답 시간을 더 단축해보세요.', '소통을 더 명확하게 해보세요.']
  },
  fair: {
    title: '개선이 필요한 대응',
    message: '일부 영역에서 개선이 필요합니다.',
    suggestions: ['안전 절차를 더 철저히 준수하세요.', '의사결정 속도를 높여보세요.']
  },
  poor: {
    title: '재훈련이 필요한 대응',
    message: '전반적인 재훈련이 필요합니다.',
    suggestions: ['기본 절차를 다시 학습하세요.', '추가 훈련을 받으세요.']
  }
}

// 시나리오별 특화 피드백
export const scenarioSpecificFeedback = {
  1: { // 아파트 인근 중압배관 파손
    keyPoints: [
      '아파트 주민 안전이 최우선',
      '중압배관 파손은 전문 기술진 필요',
      '반경 100m 내 대피 필요'
    ],
    commonMistakes: [
      '주민 대피 지시 지연',
      '가스공급사 신고 누락',
      '안전장비 미착용'
    ]
  },
  2: { // 무단굴착공사로 인한 중압배관 파손
    keyPoints: [
      '굴착공사 작업 즉시 중단',
      '중압배관 파손은 전문 기술진 필요',
      '반경 100m 내 대피 필요'
    ],
    commonMistakes: [
      '굴착공사 작업 중단 지시 지연',
      '가스공급사 신고 누락',
      '안전장비 미착용'
    ]
  },
  3: { // 도로공사로 인한 저압배관 파손
    keyPoints: [
      '도로공사 작업 즉시 중단',
      '저압배관 파손은 전문 기술진 필요',
      '반경 50m 내 대피 필요'
    ],
    commonMistakes: [
      '도로공사 작업 중단 지시 지연',
      '가스공급사 신고 누락',
      '안전장비 미착용'
    ]
  }
}

export default {
  detailedScenarios,
  roleActionGuides,
  evaluationCriteria,
  feedbackTemplates,
  scenarioSpecificFeedback
};
