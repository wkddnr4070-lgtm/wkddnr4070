import Link from 'next/link';
import { StageProgress } from '@/lib/roadmap';

interface ProgressBoardProps {
  stages: StageProgress[];
}

function badgeClass(status: StageProgress['status']) {
  if (status === '완료') return 'bg-emerald-100 text-emerald-700';
  if (status === '진행중') return 'bg-blue-100 text-blue-700';
  return 'bg-slate-100 text-slate-700';
}

export function ProgressBoard({ stages }: ProgressBoardProps) {
  const completedCount = stages.filter((stage) => stage.status === '완료').length;
  const inProgressCount = stages.filter((stage) => stage.status === '진행중').length;

  return (
    <div className="space-y-4">
      <section className="grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">전체 단계</p>
          <p className="mt-1 text-2xl font-bold text-slate-800">{stages.length}단계</p>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm text-emerald-700">완료</p>
          <p className="mt-1 text-2xl font-bold text-emerald-800">{completedCount}단계</p>
        </div>
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm text-blue-700">진행중</p>
          <p className="mt-1 text-2xl font-bold text-blue-800">{inProgressCount}단계</p>
        </div>
      </section>

      <section className="space-y-3">
        {stages.map((stage) => (
          <article key={stage.stage} className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-slate-800">{stage.stage}단계. {stage.title}</h2>
              <span className={`rounded-full px-2 py-1 text-xs font-semibold ${badgeClass(stage.status)}`}>{stage.status}</span>
            </div>
            <p className="mt-1 text-sm text-slate-600">목표: {stage.goal}</p>
            <div className="mt-3 h-2 w-full rounded-full bg-slate-100">
              <div className="h-2 rounded-full bg-brand-600" style={{ width: `${stage.percent}%` }} />
            </div>
            <p className="mt-1 text-xs text-slate-500">진행률 {stage.percent}%</p>

            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-slate-700">현재 구현 내용</p>
                <ul className="mt-1 list-disc pl-5 text-sm text-slate-600">
                  {stage.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">다음 액션</p>
                <ul className="mt-1 list-disc pl-5 text-sm text-slate-600">
                  {stage.nextActions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </section>

      <div className="flex flex-wrap gap-2">
        <Link href="/" className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">대시보드</Link>
        <Link href="/plans" className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">공사계획</Link>
        <Link href="/submissions" className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">제출포털</Link>
      </div>
    </div>
  );
}
