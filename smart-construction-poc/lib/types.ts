export type ProjectStatus = '예정' | '진행중' | '지연' | '승인대기' | '준공대기' | '완료';

export interface ConstructionProject {
  id: string;
  projectNumber: string;
  name: string;
  type: '배관공사' | '정압기공사' | '유지보수' | '긴급복구';
  region: string;
  partnerCompany: string;
  startDate: string;
  endDate: string;
  progressRate: number;
  status: ProjectStatus;
  manager: string;
  todayPlanned: boolean;
}

export interface DashboardFilter {
  date: string;
  partnerCompany: string;
  status: string;
  region: string;
  projectType: string;
  keyword: string;
}

export interface DashboardKpi {
  label: string;
  value: number;
  statusColor: 'blue' | 'green' | 'amber' | 'red' | 'slate';
}
