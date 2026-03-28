import { ConstructionProject } from '@/lib/types';

interface SummaryPanelsProps {
  projects: ConstructionProject[];
}

export function SummaryPanels({ projects }: SummaryPanelsProps) {
  const byRegion = projects.reduce<Record<string, number>>((acc, project) => {
    acc[project.region] = (acc[project.region] || 0) + 1;
    return acc;
  }, {});

  const byPartner = projects.reduce<Record<string, number>>((acc, project) => {
    acc[project.partnerCompany] = (acc[project.partnerCompany] || 0) + 1;
    return acc;
  }, {});

  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <article className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="font-semibold text-slate-800">지역별 공사 분포</h3>
        <ul className="mt-2 space-y-1 text-sm text-slate-600">
          {Object.entries(byRegion).map(([region, count]) => (
            <li key={region} className="flex justify-between">
              <span>{region}</span>
              <span>{count}건</span>
            </li>
          ))}
        </ul>
      </article>
      <article className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="font-semibold text-slate-800">협력사별 진행 건수</h3>
        <ul className="mt-2 space-y-1 text-sm text-slate-600">
          {Object.entries(byPartner).map(([name, count]) => (
            <li key={name} className="flex justify-between">
              <span>{name}</span>
              <span>{count}건</span>
            </li>
          ))}
        </ul>
      </article>
      <article className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="font-semibold text-slate-800">주요 알림</h3>
        <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-600">
          <li>지연 공사 건은 승인관리 화면에서 조치 필요</li>
          <li>준공대기 공사는 준공계 생성 우선 처리 권장</li>
          <li>오늘 예정 공사 누락 제출 여부 확인 필요</li>
        </ul>
      </article>
    </section>
  );
}
