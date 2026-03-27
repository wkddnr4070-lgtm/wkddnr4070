'use client';

import { ChangeEvent } from 'react';
import { DashboardFilter } from '@/lib/types';

interface FilterBarProps {
  filter: DashboardFilter;
  companies: string[];
  regions: string[];
  types: string[];
  statuses: string[];
  onChange: (filter: DashboardFilter) => void;
  onSearch: () => void;
  onReset: () => void;
}

export function FilterBar({
  filter,
  companies,
  regions,
  types,
  statuses,
  onChange,
  onSearch,
  onReset
}: FilterBarProps) {
  const update = (key: keyof DashboardFilter) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange({ ...filter, [key]: event.target.value });
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <input type="date" value={filter.date} onChange={update('date')} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
        <select value={filter.partnerCompany} onChange={update('partnerCompany')} className="rounded-md border border-slate-300 px-3 py-2 text-sm">
          {companies.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <select value={filter.status} onChange={update('status')} className="rounded-md border border-slate-300 px-3 py-2 text-sm">
          {statuses.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <select value={filter.region} onChange={update('region')} className="rounded-md border border-slate-300 px-3 py-2 text-sm">
          {regions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <select value={filter.projectType} onChange={update('projectType')} className="rounded-md border border-slate-300 px-3 py-2 text-sm">
          {types.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <input
          value={filter.keyword}
          onChange={update('keyword')}
          placeholder="공사명/번호 검색"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      <div className="mt-3 flex gap-2">
        <button onClick={onSearch} className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
          검색
        </button>
        <button onClick={onReset} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          초기화
        </button>
      </div>
    </section>
  );
}
