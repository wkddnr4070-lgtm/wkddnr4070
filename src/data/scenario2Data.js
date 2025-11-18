// 무단굴착공사로 인한 도시가스 중압배관 파손 시나리오
export const scenario2Data = {
    id: 2,
    title: '무단굴착공사로 인한 도시가스 중압배관 파손',
    type: 'fire',
    severity: 'high',
    duration: 25, // 25분
    description: '전라북도 익산시 신동 123-45 일대 무단굴착공사 중 발생한 도시가스 중압배관 파손 사고 대응 훈련',
    initialSituation: {
        time: '14:20',
        date: '2024년 1월 15일',
        location: '전라북도 익산시 신동 123-45 일대',
        weather: '맑음, 기온 18°C, 바람 3m/s (남동풍)',
        reportedBy: '홍길동',
        reporterPhone: '010-1234-5678',
        initialReport: '무단굴착공사 현장에서 가스 냄새가 나며, 굴착기로 인한 배관 파손 의심',
        riskFactors: ['중압배관 파손', '무단굴착공사', '주변 주택가', '가스 누출 위험'],
        // 사고 규모 채점용 키워드
        scaleKeywords: ['무단굴착', '굴착', '가스 냄새', '배관 파손', '중압배관', '누출', '의심']
    },
    timeline: [
        {
            id: 1,
            time: '14:20',
            title: '사고 상황 접수',
            situation: '익산시 신동 주민이 "굴착공사 현장에서 가스 냄새가 난다"고 신고. 굴착기 작업 중 중압배관 파손 의심',
            teamDiscussion: {
                responsibleOrganization: '상황반',
                responsiblePersonnel: '상황운영원',
                question: '신고 접수 및 사고 개요 파악',
                description: '주어진 상황을 보고 아래 항목들을 파악하여 서술형으로 답변해주세요.',
                inputType: 'descriptive', // 서술형
                requiredFields: [
                    {
                        id: 'location',
                        label: '사고 발생장소',
                        placeholder: '사고 발생 장소를 정확히 기입해주세요'
                    },
                    {
                        id: 'datetime',
                        label: '사고 발생 일/시/분',
                        placeholder: '사고 발생 일시를 정확히 기입해주세요 (예: 2024년 1월 15일 14시 20분)'
                    },
                    {
                        id: 'scale',
                        label: '사고의 규모 (배관 손괴정도 및 누출, 화재 폭발 등)',
                        placeholder: '사고의 규모, 배관 손괴정도, 누출 상황, 화재 폭발 여부 등을 상세히 기입해주세요'
                    },
                    {
                        id: 'reporter',
                        label: '신고자 신원 파악',
                        placeholder: '신고자 이름, 연락처, 신원 정보 등을 기입해주세요'
                    }
                ],
                explanation: '신고 접수 시 사고 발생장소, 발생 시간, 사고 규모, 신고자 신원을 모두 정확히 파악하는 것이 중요합니다.'
            }
        },
        {
            id: 2,
            time: '14:21',
            title: '현장 출동 지시',
            situation: '신고 접수 완료. 현장 출동반에 즉시 출동 지시',
            teamDiscussion: {
                responsibleOrganization: '관제운영반',
                responsiblePersonnel: '관제운영원',
                question: '신고 접수 완료 후 현장 출동 지시 시 가장 적절한 조치는?',
                inputType: 'multiple_choice',
                options: [
                    '차량관제 후 사고위치 인근 구성원 출동 지시',
                    '즉시 모든 현장출동반을 사고현장으로 출동 지시',
                    '사고 상황 재확인 후 출동 여부 결정',
                    '관련 부서 회의를 통한 출동 계획 수립'
                ],
                correctAnswer: '차량관제 후 사고위치 인근 구성원 출동 지시',
                explanation: '효율적인 현장 대응을 위해 차량관제를 통해 사고위치 인근에 있는 구성원을 우선 출동시키는 것이 적절합니다.'
            }
        },
        {
            id: 3,
            time: '14:22',
            title: '종판단/비상발령/EMS 1차 분석',
            situation: '긴급상황 판단 완료. 비상발령 및 EMS 시스템 1차 분석 실시',
            teamDiscussion: {
                responsibleOrganization: '관제운영반',
                responsiblePersonnel: '상황운영원',
                question: '종판단/비상발령/EMS 1차 분석 단계에서 가장 우선적으로 수행해야 할 역할은?',
                inputType: 'multiple_choice',
                options: [
                    '비상사태 종 판단 및 사고 상황 판단(비상사태 발령)',
                    '현장 복구 작업 지시 및 언론 보도자료 작성',
                    '전 구성원 SMS 발송만 실시',
                    'EMS 분석 없이 즉시 현장 출동'
                ],
                correctAnswer: '비상사태 종 판단 및 사고 상황 판단(비상사태 발령)',
                explanation: '종판단/비상발령/EMS 1차 분석 단계에서는 비상사태 종 판단과 사고 상황 판단 및 발령이 가장 우선적인 역할입니다.'
            }
        },
        {
            id: 4,
            time: '14:25',
            title: '계통보고',
            situation: '상급기관 및 관련 부서에 사고 상황 보고',
            teamDiscussion: {
                responsibleOrganization: '관제운영반',
                responsiblePersonnel: '상황운영원',
                question: '내부 계통보고의 올바른 순서는?',
                inputType: 'multiple_choice',
                options: [
                    '상황운영원 → 현장지휘부장 → 사업운영실장 → 대표이사',
                    '상황운영원 → 사업운영실장 → 현장지휘부장 → 대표이사',
                    '현장지휘부장 → 상황운영원 → 사업운영실장 → 대표이사',
                    '상황운영원 → 대표이사 → 현장지휘부장 → 사업운영실장'
                ],
                correctAnswer: '상황운영원 → 현장지휘부장 → 사업운영실장 → 대표이사',
                explanation: '내부 계통보고는 상황운영원부터 시작하여 현장지휘부장, 사업운영실장, 대표이사 순으로 보고합니다.'
            }
        },
        {
            id: 5,
            time: '14:30',
            title: '최초 출동자 현장 도착',
            situation: '현장 출동반 첫 대원이 사고 현장에 도착',
            teamDiscussion: {
                responsibleOrganization: '현장출동반',
                responsiblePersonnel: '현장출동원',
                question: '최초 출동자가 현장에 도착했을 때 가장 우선적으로 해야 할 조치는?',
                inputType: 'multiple_choice',
                options: [
                    '사고 상황 파악 및 사고 위치 전송',
                    '즉시 복구 작업 시작',
                    '주변 주민 대피 안내',
                    '언론 대응 준비'
                ],
                correctAnswer: '사고 상황 파악 및 사고 위치 전송',
                explanation: '최초 출동자는 현장 상황을 정확히 파악하고 관제센터에 사고 위치와 상황을 전송하는 것이 최우선입니다.'
            }
        },
        {
            id: 6,
            time: '14:35',
            title: '비상대책본부 구성',
            situation: '비상대책본부 구성 완료 및 운영 시작',
            teamDiscussion: {
                responsibleOrganization: '비상대책본부',
                responsiblePersonnel: '비상대책본부장',
                question: '비상대책본부 구성원으로 올바른 것은?',
                inputType: 'multiple_choice',
                options: [
                    '비상대책본부장, RM팀장, 보좌원',
                    '비상대책본부장, 현장지휘부장, 기술반장',
                    '비상대책본부장, 홍보반장, 고객서비스반장',
                    '비상대책본부장, 안전반장, 총무반장'
                ],
                correctAnswer: '비상대책본부장, RM팀장, 보좌원',
                explanation: '비상대책본부는 비상대책본부장, RM팀장, 보좌원으로 구성됩니다.'
            }
        },
        {
            id: 7,
            time: '14:40',
            title: '1차 밸브 차단',
            situation: '가스 누출 방지를 위한 1차 차단 밸브 폐쇄',
            teamDiscussion: {
                responsibleOrganization: '현장통제반',
                responsiblePersonnel: '현장통제원',
                question: '현장통제반 사고현장 도착 후 가장 우선적으로 취해야 할 조치는?',
                inputType: 'multiple_choice',
                options: [
                    '1차 밸브 차단 및 주변 통제(차량/보행자 통로)',
                    '즉시 복구 작업 시작',
                    '언론 보도자료 작성',
                    '고객 개별 안내 실시'
                ],
                correctAnswer: '1차 밸브 차단 및 주변 통제(차량/보행자 통로)',
                explanation: '현장통제반이 사고현장에 도착하면 먼저 1차 밸브 차단과 주변 통제를 실시해야 합니다.'
            }
        },
        {
            id: 8,
            time: '14:45',
            title: 'EMS 2차 분석',
            situation: '현장 상황을 반영한 EMS 시스템 2차 분석 실시',
            teamDiscussion: {
                responsibleOrganization: '관제운영반',
                responsiblePersonnel: 'EMS 운영원',
                question: 'EMS 2차 분석 단계에서 수행해야 할 주요 작업은?',
                inputType: 'multiple_choice',
                options: [
                    '사고 위치 전송에 따른 2차 분석',
                    '1차 분석 결과 재확인',
                    '복구 작업 계획 수립',
                    '고객 안내 문구 작성'
                ],
                correctAnswer: '사고 위치 전송에 따른 2차 분석',
                explanation: 'EMS 2차 분석은 현장에서 전송된 사고 위치 정보를 바탕으로 실시하는 분석입니다.'
            }
        },
        {
            id: 9,
            time: '14:50',
            title: '2차 밸브 차단',
            situation: '안전 확보를 위한 2차 차단 밸브 폐쇄',
            teamDiscussion: {
                responsibleOrganization: '현장통제반',
                responsiblePersonnel: '현장통제원',
                question: '2차 밸브 차단 단계에서 수행해야 할 조치로 올바르지 않은 것은?',
                inputType: 'negative_choice',
                options: [
                    '2차 밸브 차단, 주변 통제, 차단 개소 많을 시 순서 차단 실시',
                    '1차 밸브 차단 재확인, 주변 안전 점검',
                    '2차 밸브 차단, 주변 통제, 복구 작업 시작',
                    '2차 밸브 차단, 주변 통제, 차단 개소 많을 시 순서 차단 실시, 현장 상황 보고'
                ],
                correctAnswer: '2차 밸브 차단, 주변 통제, 복구 작업 시작',
                explanation: '2차 밸브 차단 단계에서는 밸브 차단과 주변 통제, 차단 개소가 많을 경우 순서 차단을 실시해야 하며, 복구 작업은 차단 완료 후 시작합니다.'
            }
        },
        {
            id: 10,
            time: '14:55',
            title: '현장지휘본부 구성',
            situation: '현장 지휘를 위한 현장지휘본부 설치 및 운영',
            teamDiscussion: {
                responsibleOrganization: '현장지휘본부',
                responsiblePersonnel: '현장지휘부장',
                question: '현장지휘본부 구성 시 가장 우선적으로 수행해야 할 작업은?',
                inputType: 'multiple_choice',
                options: [
                    '사고 현장 도착 현장지휘부 구성',
                    '본사와의 통신망 구축',
                    '복구 작업 계획 수립',
                    '언론 대응 준비'
                ],
                correctAnswer: '사고 현장 도착 현장지휘부 구성',
                explanation: '현장지휘본부는 사고 현장에 도착한 후 즉시 구성되어 현장 지휘를 시작합니다.'
            }
        },
        {
            id: 11,
            time: '15:00',
            title: '1차 홍보,보도자료 배포',
            situation: '사고 상황 관련 1차 보도자료 작성 및 배포',
            teamDiscussion: {
                responsibleOrganization: '홍보반',
                responsiblePersonnel: '홍보반장',
                question: '1차 홍보 및 보도자료 배포 단계에서 수행해야 할 작업으로 올바르지 않은 것은?',
                inputType: 'negative_choice',
                options: [
                    '홍보문안 작성 및 고객 홍보(공급중단), 필요 시 LSC 지원 인력 요청, 보도자료 작성(사고개요)',
                    '홍보문안 작성 및 고객 홍보(공급중단), 보도자료 작성(사고개요), 복구 일정 공지',
                    '홍보문안 작성 및 고객 홍보(공급중단), 필요 시 LSC 지원 인력 요청, 보도자료 작성(사고개요), 현장 복구 작업 시작',
                    '홍보문안 작성 및 고객 홍보(공급중단), 필요 시 LSC 지원 인력 요청, 보도자료 작성(사고개요), 유관기관 통보'
                ],
                correctAnswer: '홍보문안 작성 및 고객 홍보(공급중단), 필요 시 LSC 지원 인력 요청, 보도자료 작성(사고개요), 현장 복구 작업 시작',
                explanation: '1차 홍보 단계에서는 홍보문안 작성, 고객 홍보, LSC 지원 인력 요청, 보도자료 작성이 주요 작업이며, 복구 작업은 이후 단계에서 시작합니다.'
            }
        },
        {
            id: 12,
            time: '15:05',
            title: '수요가 밸브 차단',
            situation: '고객 안전을 위한 수요가 밸브 차단 실시',
            teamDiscussion: {
                responsibleOrganization: '현장통제반',
                responsiblePersonnel: '현장통제원',
                question: '수요가 밸브 차단을 실시하는 기준은?',
                inputType: 'multiple_choice',
                options: [
                    '2차 분석 결과에 따른 수요가 밸브 차단',
                    '1차 분석 결과에 따른 수요가 밸브 차단',
                    '현장 상황 판단에 따른 수요가 밸브 차단',
                    '고객 요청에 따른 수요가 밸브 차단'
                ],
                correctAnswer: '2차 분석 결과에 따른 수요가 밸브 차단',
                explanation: '수요가 밸브 차단은 EMS 2차 분석 결과를 바탕으로 결정됩니다.'
            }
        },
        {
            id: 13,
            time: '15:10',
            title: '1차 Purge',
            situation: '배관 내 잔류 가스 제거를 위한 1차 퍼지 작업',
            teamDiscussion: {
                responsibleOrganization: '현장통제반',
                responsiblePersonnel: '현장통제원',
                question: '1차 Purge 작업의 담당조직 역할로 알맞은 것은?',
                inputType: 'multiple_choice',
                options: [
                    '현장통제반',
                    '복구반',
                    '홍보반',
                    '고객대응반'
                ],
                correctAnswer: '현장통제반',
                explanation: '1차 Purge 작업은 현장통제반이 담당하는 작업입니다.'
            }
        },
        {
            id: 14,
            time: '15:30',
            title: '복구 작업',
            situation: '파손된 배관 복구 작업 시작',
            teamDiscussion: {
                responsibleOrganization: '복구반',
                responsiblePersonnel: '복구반장',
                question: '사고 현장 복구 및 자재 불출 시 올바르지 않은 것은?',
                inputType: 'negative_choice',
                options: [
                    '협력회사 현장 도착 및 터파기 실시, 복구방법 결정 및 자재 요청, 복구자재 지원',
                    '협력회사 현장 도착 및 터파기 실시, 복구방법 결정 및 자재 요청, 복구자재 지원, 현장 안전 점검',
                    '협력회사 현장 도착 및 터파기 실시, 복구방법 결정 및 자재 요청, 복구자재 지원, 공급 재개',
                    '협력회사 현장 도착 및 터파기 실시, 복구방법 결정 및 자재 요청, 복구자재 지원, 복구 작업 감독'
                ],
                correctAnswer: '협력회사 현장 도착 및 터파기 실시, 복구방법 결정 및 자재 요청, 복구자재 지원, 공급 재개',
                explanation: '복구 작업 단계에서는 협력회사 도착, 터파기, 복구방법 결정, 자재 요청 및 지원이 주요 작업이며, 공급 재개는 복구 완료 후 진행됩니다.'
            }
        },
        {
            id: 15,
            time: '16:00',
            title: '2차 홍보,보도자료 배포',
            situation: '복구 진행 상황 관련 2차 보도자료 작성 및 배포',
            teamDiscussion: {
                responsibleOrganization: '홍보반',
                responsiblePersonnel: '홍보반장',
                question: '2차 홍보 및 보도자료 배포 단계에서 수행해야 할 작업으로 올바르지 않은 것은?',
                inputType: 'negative_choice',
                options: [
                    '홍보문안 작성, 고객 홍보(복구작업 진행 내용), 보도자료 작성',
                    '홍보문안 작성, 고객 홍보(복구작업 진행 내용), 보도자료 작성, 복구 완료 공지',
                    '홍보문안 작성, 고객 홍보(복구작업 진행 내용), 보도자료 작성, 공급 재개 안내',
                    '홍보문안 작성, 고객 홍보(복구작업 진행 내용), 보도자료 작성, 현장 복구 작업 직접 수행'
                ],
                correctAnswer: '홍보문안 작성, 고객 홍보(복구작업 진행 내용), 보도자료 작성, 현장 복구 작업 직접 수행',
                explanation: '2차 홍보 단계에서는 홍보문안 작성, 고객 홍보, 보도자료 작성이 주요 작업이며, 홍보반은 복구 작업을 직접 수행하지 않습니다.'
            }
        },
        {
            id: 16,
            time: '17:00',
            title: '복구 작업 완료/공급재개',
            situation: '배관 복구 완료 및 가스 공급 재개 준비',
            teamDiscussion: {
                responsibleOrganization: '비상대책본부',
                responsiblePersonnel: '비상대책본부장',
                question: '복구 작업 완료/공급재개 단계에서 현장통제반이 수행해야 할 주요 작업은?',
                inputType: 'multiple_choice',
                options: [
                    '차단밸브 OPEN/Purge 작업 시행 등',
                    '사고현장 복구 완료 등',
                    '산업체 수요가 단독조정기 및 연소기 점검/홍보 등',
                    '3차 보도자료 배포(사고 상황 수습 및 사과 내용)'
                ],
                correctAnswer: '차단밸브 OPEN/Purge 작업 시행 등',
                explanation: '복구 작업 완료/공급재개 단계에서 현장통제반은 차단밸브 OPEN 및 Purge 작업을 주요하게 수행합니다.'
            }
        },
        {
            id: 17,
            time: '17:10',
            title: '3차 홍보,보도자료 배포',
            situation: '복구 완료 및 공급 재개 관련 3차 보도자료 배포',
            teamDiscussion: null // 추후 설정
        },
        {
            id: 18,
            time: '17:15',
            title: '전단 밸브 open',
            situation: '공급 재개를 위한 전단 밸브 개방',
            teamDiscussion: null // 추후 설정
        },
        {
            id: 19,
            time: '17:20',
            title: '3차 purge',
            situation: '공급 재개 전 최종 퍼지 작업 실시',
            teamDiscussion: null // 추후 설정
        },
        {
            id: 20,
            time: '17:25',
            title: '1,2차 밸브 open',
            situation: '1차 및 2차 차단 밸브 순차 개방',
            teamDiscussion: null // 추후 설정
        },
        {
            id: 21,
            time: '17:30',
            title: '수요가 밸브 Open',
            situation: '수요가 밸브 개방으로 고객 공급 재개',
            teamDiscussion: null // 추후 설정
        },
        {
            id: 22,
            time: '17:35',
            title: '안전점검 실시',
            situation: '공급 재개 후 전체 시스템 안전점검 실시',
            teamDiscussion: null // 추후 설정
        },
        {
            id: 23,
            time: '17:40',
            title: '상황 종료',
            situation: '모든 복구 작업 완료 및 비상상황 해제',
            teamDiscussion: null // 추후 설정
        }
    ]
}