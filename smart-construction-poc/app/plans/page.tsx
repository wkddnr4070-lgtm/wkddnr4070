'use client';

import Link from 'next/link';
import { useState } from 'react';

interface PlanItem {
  id: string;
  projectNumber: string;
  projectName: string;
  region: string;
  partnerCompany: string;
  startDate: string;
  endDate: string;
}

const emptyPlan = {
  projectNumber: '',
  projectName: '',
  region: '',
  partnerCompany: '',
  startDate: '',
  endDate: ''
};

export default function PlansPage() {
  const [form, setForm] = useState(emptyPlan);
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [error, setError] = useState('');

  const savePlan = () => {
    if (!form.projectNumber || !form.projectName || !form.region || !form.partnerCompany) {
      setError('필수 항목(공사번호, 공사명, 지역, 협력사)을 입력해 주세요.');
      return;
    }

    const item: PlanItem = {
      id: crypto.randomUUID(),
      ...form
    };
    setPlans((prev) => [item, ...prev]);
    setForm(emptyPlan);
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">공사 등록 / 공사계획</h1>
          <Link href="/" className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">대시보드로 이동</Link>
        </div>

        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="text-lg font-semibold text-slate-800">공사 등록</h2>
          {error && <p className="mt-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
            <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="공사번호" value={form.projectNumber} onChange={(e) => setForm({ ...form, projectNumber: e.target.value })} />
            <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="공사명" value={form.projectName} onChange={(e) => setForm({ ...form, projectName: e.target.value })} />
            <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="지역" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} />
            <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="협력사" value={form.partnerCompany} onChange={(e) => setForm({ ...form, partnerCompany: e.target.value })} />
            <input type="date" className="rounded-md border border-slate-300 px-3 py-2 text-sm" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            <input type="date" className="rounded-md border border-slate-300 px-3 py-2 text-sm" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
          </div>
          <div className="mt-3">
            <button onClick={savePlan} className="rounded-md bg-brand-600 px-4 py-2 text-sm text-white hover:bg-brand-700">저장</button>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="text-lg font-semibold text-slate-800">등록된 공사 목록</h2>
          {plans.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">등록된 공사가 없습니다.</p>
          ) : (
            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-100 text-slate-600">
                  <tr>
                    <th className="px-3 py-2 text-left">공사번호</th>
                    <th className="px-3 py-2 text-left">공사명</th>
                    <th className="px-3 py-2 text-left">지역</th>
                    <th className="px-3 py-2 text-left">협력사</th>
                    <th className="px-3 py-2 text-left">기간</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((item) => (
                    <tr key={item.id} className="border-t border-slate-200">
                      <td className="px-3 py-2">{item.projectNumber}</td>
                      <td className="px-3 py-2">{item.projectName}</td>
                      <td className="px-3 py-2">{item.region}</td>
                      <td className="px-3 py-2">{item.partnerCompany}</td>
                      <td className="px-3 py-2">{item.startDate || '-'} ~ {item.endDate || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
