import Link from 'next/link';
import { notFound } from 'next/navigation';
import { StatusBadge } from '@/components/common/Badge';
import { mockProjects } from '@/lib/mock-data';
import { formatDate } from '@/lib/format';

interface ProjectDetailPageProps {
  params: {
    id: string;
  };
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const project = mockProjects.find((item) => item.id === params.id);
  if (!project) notFound();

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl rounded-lg border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-bold text-slate-800">공사 상세 정보</h1>
        <p className="mt-1 text-sm text-slate-500">제출 문서, 승인 상태, 메일 내역 통합 조회(1단계 PoC 목업)</p>

        <dl className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <dt className="text-xs text-slate-400">공사번호</dt>
            <dd className="font-medium text-slate-800">{project.projectNumber}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-400">공사명</dt>
            <dd className="font-medium text-slate-800">{project.name}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-400">협력사</dt>
            <dd className="font-medium text-slate-800">{project.partnerCompany}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-400">상태</dt>
            <dd><StatusBadge status={project.status} /></dd>
          </div>
          <div>
            <dt className="text-xs text-slate-400">공사기간</dt>
            <dd className="font-medium text-slate-800">{formatDate(project.startDate)} ~ {formatDate(project.endDate)}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-400">공정률</dt>
            <dd className="font-medium text-slate-800">{project.progressRate}%</dd>
          </div>
        </dl>

        <div className="mt-8 flex gap-2">
          <button className="rounded-md bg-brand-600 px-4 py-2 text-sm text-white hover:bg-brand-700">보고서 생성</button>
          <button className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">메일 발송 준비</button>
          <Link href="/" className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
            대시보드로 이동
          </Link>
        </div>
      </div>
    </div>
  );
}
