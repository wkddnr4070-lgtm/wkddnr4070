import { ProgressBoard } from '@/components/status/ProgressBoard';
import { stageProgressList } from '@/lib/roadmap';

export default function StatusPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl space-y-4">
        <header className="rounded-lg border border-slate-200 bg-white p-4">
          <h1 className="text-2xl font-bold text-slate-800">Smart 공사관리 플랫폼 개발현황</h1>
          <p className="mt-1 text-sm text-slate-600">사이트 형태로 현재 구현 상태를 한눈에 확인할 수 있는 현황판입니다.</p>
        </header>

        <ProgressBoard stages={stageProgressList} />
      </div>
    </div>
  );
}
