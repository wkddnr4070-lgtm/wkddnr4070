import { ProjectStatus } from '@/lib/types';

const styleMap: Record<ProjectStatus, string> = {
  예정: 'bg-slate-100 text-slate-700',
  진행중: 'bg-blue-100 text-blue-700',
  지연: 'bg-red-100 text-red-700',
  승인대기: 'bg-amber-100 text-amber-700',
  준공대기: 'bg-purple-100 text-purple-700',
  완료: 'bg-emerald-100 text-emerald-700'
};

interface BadgeProps {
  status: ProjectStatus;
}

export function StatusBadge({ status }: BadgeProps) {
  return <span className={`rounded-full px-2 py-1 text-xs font-semibold ${styleMap[status]}`}>{status}</span>;
}
