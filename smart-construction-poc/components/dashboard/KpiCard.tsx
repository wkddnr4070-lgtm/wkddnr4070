import { DashboardKpi } from '@/lib/types';

const colorClass: Record<DashboardKpi['statusColor'], string> = {
  blue: 'border-blue-200 bg-blue-50 text-blue-700',
  green: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  amber: 'border-amber-200 bg-amber-50 text-amber-700',
  red: 'border-red-200 bg-red-50 text-red-700',
  slate: 'border-slate-200 bg-slate-100 text-slate-700'
};

interface KpiCardProps {
  kpi: DashboardKpi;
}

export function KpiCard({ kpi }: KpiCardProps) {
  return (
    <section className={`rounded-lg border p-4 ${colorClass[kpi.statusColor]}`}>
      <p className="text-xs font-semibold">{kpi.label}</p>
      <p className="mt-2 text-2xl font-bold">{kpi.value}건</p>
    </section>
  );
}
