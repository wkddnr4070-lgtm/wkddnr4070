import { ConstructionProject } from '@/lib/types';

export const mockProjects: ConstructionProject[] = [
  {
    id: 'pjt-001',
    projectNumber: 'CG-2026-001',
    name: '강남구 도시가스 배관 교체 1차',
    type: '배관공사',
    region: '서울 강남구',
    partnerCompany: '한빛이엔지',
    startDate: '2026-03-20',
    endDate: '2026-04-05',
    progressRate: 42,
    status: '진행중',
    manager: '김주임',
    todayPlanned: true
  },
  {
    id: 'pjt-002',
    projectNumber: 'CG-2026-002',
    name: '수원 정압기 점검 및 교체',
    type: '정압기공사',
    region: '경기 수원시',
    partnerCompany: '미래설비',
    startDate: '2026-03-24',
    endDate: '2026-03-30',
    progressRate: 63,
    status: '승인대기',
    manager: '박대리',
    todayPlanned: true
  },
  {
    id: 'pjt-003',
    projectNumber: 'CG-2026-003',
    name: '인천 북항 긴급 복구',
    type: '긴급복구',
    region: '인천 동구',
    partnerCompany: '대한가스텍',
    startDate: '2026-03-21',
    endDate: '2026-03-25',
    progressRate: 85,
    status: '준공대기',
    manager: '이과장',
    todayPlanned: false
  },
  {
    id: 'pjt-004',
    projectNumber: 'CG-2026-004',
    name: '의정부 배관 유지보수',
    type: '유지보수',
    region: '경기 의정부시',
    partnerCompany: '한빛이엔지',
    startDate: '2026-03-10',
    endDate: '2026-03-22',
    progressRate: 78,
    status: '지연',
    manager: '최대리',
    todayPlanned: false
  },
  {
    id: 'pjt-005',
    projectNumber: 'CG-2026-005',
    name: '부천 배관 신설 2구간',
    type: '배관공사',
    region: '경기 부천시',
    partnerCompany: '청솔건설',
    startDate: '2026-03-27',
    endDate: '2026-04-12',
    progressRate: 10,
    status: '예정',
    manager: '윤사원',
    todayPlanned: false
  }
];
