'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { StatusBadge } from '@/components/common/Badge';
import { formatDate } from '@/lib/format';
import { ConstructionProject } from '@/lib/types';

type SortKey = 'projectNumber' | 'name' | 'region' | 'partnerCompany' | 'progressRate' | 'endDate';

interface ProjectTableProps {
  projects: ConstructionProject[];
}

export function ProjectTable({ projects }: ProjectTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('endDate');
  const [descending, setDescending] = useState(false);

  const sorted = useMemo(() => {
    return [...projects].sort((a, b) => {
      const x = a[sortKey];
      const y = b[sortKey];
      if (x < y) return descending ? 1 : -1;
      if (x > y) return descending ? -1 : 1;
      return 0;
    });
  }, [projects, sortKey, descending]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setDescending((prev) => !prev);
      return;
    }
    setSortKey(key);
    setDescending(false);
  };

  if (!projects.length) {
    return <p className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">검색 조건에 맞는 공사가 없습니다.</p>;
  }

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-100 text-slate-600">
          <tr>
            {[
              ['projectNumber', '공사번호'],
              ['name', '공사명'],
              ['region', '지역'],
              ['partnerCompany', '협력사'],
              ['progressRate', '공정률'],
              ['endDate', '종료예정일']
            ].map(([key, label]) => (
              <th key={key} className="cursor-pointer px-4 py-3 text-left font-semibold" onClick={() => handleSort(key as SortKey)}>
                {label}
              </th>
            ))}
            <th className="px-4 py-3 text-left font-semibold">상태</th>
            <th className="px-4 py-3 text-left font-semibold">기능</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((project) => (
            <tr key={project.id} className="border-t border-slate-200">
              <td className="px-4 py-3">{project.projectNumber}</td>
              <td className="px-4 py-3">{project.name}</td>
              <td className="px-4 py-3">{project.region}</td>
              <td className="px-4 py-3">{project.partnerCompany}</td>
              <td className="px-4 py-3">{project.progressRate}%</td>
              <td className="px-4 py-3">{formatDate(project.endDate)}</td>
              <td className="px-4 py-3">
                <StatusBadge status={project.status} />
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Link href={`/projects/${project.id}`} className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50">
                    상세보기
                  </Link>
                  <button className="rounded-md bg-brand-600 px-2 py-1 text-xs text-white hover:bg-brand-700">보고서 생성</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
