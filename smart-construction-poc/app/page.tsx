'use client';

import { useMemo, useState } from 'react';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { ProjectTable } from '@/components/dashboard/ProjectTable';
import { SummaryPanels } from '@/components/dashboard/SummaryPanels';
import { AppShell } from '@/components/layout/AppShell';
import { defaultDashboardFilter, filterProjects, makeKpis } from '@/lib/dashboard';
import { mockProjects } from '@/lib/mock-data';
import { DashboardFilter } from '@/lib/types';

export default function DashboardPage() {
  const [draftFilter, setDraftFilter] = useState<DashboardFilter>(defaultDashboardFilter);
  const [appliedFilter, setAppliedFilter] = useState<DashboardFilter>(defaultDashboardFilter);

  const companies = ['전체', ...new Set(mockProjects.map((item) => item.partnerCompany))];
  const regions = ['전체', ...new Set(mockProjects.map((item) => item.region))];
  const types = ['전체', ...new Set(mockProjects.map((item) => item.type))];
  const statuses = ['전체', '예정', '진행중', '지연', '승인대기', '준공대기', '완료'];

  const filteredProjects = useMemo(() => filterProjects(mockProjects, appliedFilter), [appliedFilter]);
  const kpis = useMemo(() => makeKpis(filteredProjects), [filteredProjects]);

  return (
    <AppShell totalCount={filteredProjects.length}>
      <div className="space-y-4">
        <FilterBar
          filter={draftFilter}
          companies={companies}
          regions={regions}
          types={types}
          statuses={statuses}
          onChange={setDraftFilter}
          onSearch={() => setAppliedFilter(draftFilter)}
          onReset={() => {
            setDraftFilter(defaultDashboardFilter);
            setAppliedFilter(defaultDashboardFilter);
          }}
        />

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
          {kpis.map((kpi) => (
            <KpiCard key={kpi.label} kpi={kpi} />
          ))}
        </section>

        <SummaryPanels projects={filteredProjects} />
        <ProjectTable projects={filteredProjects} />
      </div>
    </AppShell>
  );
}
