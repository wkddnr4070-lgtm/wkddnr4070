'use client';

import { SubmissionRecord } from '@/lib/submission-types';

interface SubmissionListProps {
  records: SubmissionRecord[];
  onEdit: (record: SubmissionRecord) => void;
}

function getStatusStyle(status: SubmissionRecord['status']) {
  if (status === '제출완료') return 'bg-emerald-100 text-emerald-700';
  if (status === '수정요청') return 'bg-red-100 text-red-700';
  return 'bg-slate-100 text-slate-700';
}

export function SubmissionList({ records, onEdit }: SubmissionListProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="text-lg font-semibold text-slate-800">제출 내역</h2>
      {!records.length ? (
        <p className="mt-4 rounded-md border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">아직 제출된 데이터가 없습니다.</p>
      ) : (
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="px-3 py-2 text-left">공사번호</th>
                <th className="px-3 py-2 text-left">공사명</th>
                <th className="px-3 py-2 text-left">협력사</th>
                <th className="px-3 py-2 text-left">제출시각</th>
                <th className="px-3 py-2 text-left">상태</th>
                <th className="px-3 py-2 text-left">기능</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id} className="border-t border-slate-200">
                  <td className="px-3 py-2">{record.projectNumber}</td>
                  <td className="px-3 py-2">{record.projectName}</td>
                  <td className="px-3 py-2">{record.partnerCompany}</td>
                  <td className="px-3 py-2">{record.submittedAt}</td>
                  <td className="px-3 py-2">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${getStatusStyle(record.status)}`}>{record.status}</span>
                  </td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      onClick={() => onEdit(record)}
                      className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      수정
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
