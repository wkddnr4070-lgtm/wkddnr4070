import Link from 'next/link';

interface HeaderProps {
  totalCount: number;
}

export function Header({ totalCount }: HeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white px-6 py-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Smart 공사관리 플랫폼 (PoC)</h1>
          <p className="text-sm text-slate-500">역할: 공사관리담당자 / 오늘 관리 대상 공사 {totalCount}건</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Link href="/access" className="rounded-md border border-slate-300 px-3 py-2 text-slate-700 hover:bg-slate-50">접속 안내</Link>
          <button className="rounded-md bg-brand-600 px-3 py-2 text-white hover:bg-brand-700">신규 공사 등록</button>
        </div>
      </div>
    </header>
  );
}
