import Link from 'next/link';

const menus = [
  { label: '대시보드', href: '/' },
  { label: '개발현황', href: '/status' },
  { label: '공사계획', href: '/plans' },
  { label: '제출서류', href: '/submissions' },
  { label: '승인관리', href: '#' },
  { label: '착공계·기성계·준공계 생성', href: '#' },
  { label: '메일 발송', href: '#' },
  { label: 'AI 분석 결과', href: '#' },
  { label: '설정', href: '#' }
];

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-slate-200 bg-white p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Menu</p>
      <ul className="space-y-1">
        {menus.map((menu, idx) => (
          <li key={menu.label}>
            <Link
              href={menu.href}
              className={`block w-full rounded-md px-3 py-2 text-left text-sm font-medium transition ${
                idx === 0 ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {menu.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
