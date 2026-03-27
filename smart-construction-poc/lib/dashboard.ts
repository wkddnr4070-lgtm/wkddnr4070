import { ConstructionProject, DashboardFilter, DashboardKpi } from '@/lib/types';

export const defaultDashboardFilter: DashboardFilter = {
  date: '',
  partnerCompany: '전체',
  status: '전체',
  region: '전체',
  projectType: '전체',
  keyword: ''
};

export function filterProjects(
  projects: ConstructionProject[],
  filter: DashboardFilter
): ConstructionProject[] {
  return projects.filter((project) => {
    const byDate = filter.date ? project.startDate <= filter.date && project.endDate >= filter.date : true;
    const byCompany = filter.partnerCompany === '전체' || project.partnerCompany === filter.partnerCompany;
    const byStatus = filter.status === '전체' || project.status === filter.status;
    const byRegion = filter.region === '전체' || project.region === filter.region;
    const byType = filter.projectType === '전체' || project.type === filter.projectType;
    const byKeyword = filter.keyword
      ? [project.name, project.projectNumber, project.partnerCompany]
          .join(' ')
          .toLowerCase()
          .includes(filter.keyword.toLowerCase())
      : true;

    return byDate && byCompany && byStatus && byRegion && byType && byKeyword;
  });
}

export function makeKpis(projects: ConstructionProject[]): DashboardKpi[] {
  return [
    { label: '전체 공사', value: projects.length, statusColor: 'blue' },
    { label: '오늘 예정 공사', value: projects.filter((p) => p.todayPlanned).length, statusColor: 'green' },
    { label: '진행 중 공사', value: projects.filter((p) => p.status === '진행중').length, statusColor: 'blue' },
    { label: '지연 공사', value: projects.filter((p) => p.status === '지연').length, statusColor: 'red' },
    { label: '승인 대기', value: projects.filter((p) => p.status === '승인대기').length, statusColor: 'amber' },
    { label: '준공 대기', value: projects.filter((p) => p.status === '준공대기').length, statusColor: 'slate' }
  ];
}
