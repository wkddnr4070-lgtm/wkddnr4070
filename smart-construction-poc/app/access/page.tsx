import Link from 'next/link';

const routes = [
  { path: '/', title: '대시보드', description: '공사 KPI/필터/현황 테이블 확인' },
  { path: '/status', title: '개발현황', description: '1~5단계 개발 진행률 및 다음 작업 확인' },
  { path: '/plans', title: '공사계획', description: '공사 등록 폼과 등록 목록 확인' },
  { path: '/submissions', title: '제출포털', description: '협력사 제출 입력, 파일추가, 임시저장/제출 확인' }
];

export default function AccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl space-y-4">
        <header className="rounded-lg border border-slate-200 bg-white p-4">
          <h1 className="text-2xl font-bold text-slate-800">웹페이지 접속 안내</h1>
          <p className="mt-1 text-sm text-slate-600">로컬 실행 후 아래 주소로 접속하면 각 화면을 바로 확인할 수 있습니다.</p>
        </header>

        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-700">기본 주소: <strong>http://localhost:3000</strong></p>
          <ul className="mt-3 space-y-2">
            {routes.map((route) => (
              <li key={route.path} className="rounded-md border border-slate-200 p-3">
                <p className="font-semibold text-slate-800">{route.title}</p>
                <p className="text-sm text-slate-600">{route.description}</p>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <code className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-700">http://localhost:3000{route.path}</code>
                  <Link href={route.path} className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50">
                    바로가기
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
