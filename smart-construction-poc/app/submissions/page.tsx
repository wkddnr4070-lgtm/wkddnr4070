'use client';

import Link from 'next/link';
import { useState } from 'react';
import { SubmissionForm } from '@/components/submission/SubmissionForm';
import { SubmissionList } from '@/components/submission/SubmissionList';
import { SubmissionFormValue, SubmissionRecord } from '@/lib/submission-types';

export default function SubmissionsPage() {
  const [records, setRecords] = useState<SubmissionRecord[]>([]);
  const [editing, setEditing] = useState<SubmissionRecord | null>(null);

  const upsertRecord = (payload: SubmissionFormValue, status: SubmissionRecord['status']) => {
    const newRecord: SubmissionRecord = {
      id: editing?.id ?? crypto.randomUUID(),
      partnerCompany: '한빛이엔지',
      submittedAt: new Date().toLocaleString('ko-KR'),
      reviewComment: status === '제출완료' ? '검토 대기' : '임시 저장됨',
      status,
      ...payload
    };

    setRecords((prev) => {
      const exists = prev.some((item) => item.id === newRecord.id);
      if (exists) {
        return prev.map((item) => (item.id === newRecord.id ? newRecord : item));
      }
      return [newRecord, ...prev];
    });
    setEditing(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">공사자료 접수 / 협력사 제출</h1>
          <Link href="/" className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">대시보드로 이동</Link>
        </div>

        <SubmissionForm
          editingRecord={editing}
          onSaveDraft={(payload) => upsertRecord(payload, '임시저장')}
          onSubmit={(payload) => upsertRecord(payload, '제출완료')}
        />

        <SubmissionList records={records} onEdit={setEditing} />
      </div>
    </div>
  );
}
