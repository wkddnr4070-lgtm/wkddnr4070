'use client';

import { useEffect, useState } from 'react';
import { createEmptySubmission, validateSubmission } from '@/lib/submission-validation';
import { SubmissionFormValue, SubmissionRecord, UploadedFileItem } from '@/lib/submission-types';

interface SubmissionFormProps {
  onSaveDraft: (payload: SubmissionFormValue) => void;
  onSubmit: (payload: SubmissionFormValue) => void;
  editingRecord?: SubmissionRecord | null;
}

const fileCategories: UploadedFileItem['category'][] = ['작업일보', '일일계획', '준공도면', '현장사진', '산안비증빙', '기타'];

export function SubmissionForm({ onSaveDraft, onSubmit, editingRecord }: SubmissionFormProps) {
  const [form, setForm] = useState<SubmissionFormValue>(createEmptySubmission());
  const [errors, setErrors] = useState<string[]>([]);
  const [newFileName, setNewFileName] = useState('');
  const [newFileCategory, setNewFileCategory] = useState<UploadedFileItem['category']>('작업일보');

  useEffect(() => {
    if (!editingRecord) return;
    const { id: _id, partnerCompany: _partnerCompany, submittedAt: _submittedAt, status: _status, reviewComment: _reviewComment, ...rest } = editingRecord;
    setForm(rest);
  }, [editingRecord]);

  const addFile = () => {
    if (!newFileName.trim()) {
      setErrors(['파일명을 입력해 주세요.']);
      return;
    }

    setForm((prev) => ({
      ...prev,
      files: [
        ...prev.files,
        {
          id: crypto.randomUUID(),
          name: newFileName,
          category: newFileCategory,
          sizeKb: Math.floor(Math.random() * 900) + 100,
          uploadedAt: new Date().toLocaleString('ko-KR')
        }
      ]
    }));
    setNewFileName('');
    setErrors([]);
  };

  const deleteFile = (fileId: string) => {
    setForm((prev) => ({ ...prev, files: prev.files.filter((file) => file.id !== fileId) }));
  };

  const submitWith = (mode: 'draft' | 'submit') => {
    const result = validateSubmission(form);
    if (mode === 'submit' && !result.valid) {
      setErrors(result.errors);
      return;
    }

    setErrors([]);
    if (mode === 'draft') onSaveDraft(form);
    else onSubmit(form);

    setForm(createEmptySubmission());
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="text-lg font-semibold text-slate-800">협력사 제출 포털</h2>
      <p className="mt-1 text-sm text-slate-500">작업일보, 계획, 도면/사진/산안비 증빙 파일을 업로드해 제출합니다.</p>

      {errors.length > 0 && (
        <div className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <p className="font-semibold">입력값을 확인해 주세요.</p>
          <ul className="mt-1 list-disc pl-5">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        <input placeholder="공사번호" value={form.projectNumber} onChange={(e) => setForm({ ...form, projectNumber: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
        <input placeholder="공사명" value={form.projectName} onChange={(e) => setForm({ ...form, projectName: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
        <input placeholder="위치" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
        <input placeholder="투입 인력" type="number" value={form.workerCount} onChange={(e) => setForm({ ...form, workerCount: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
        <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
        <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
      </div>

      <textarea
        value={form.dailyPlan}
        onChange={(e) => setForm({ ...form, dailyPlan: e.target.value })}
        placeholder="일일 공사계획 메모"
        className="mt-3 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        rows={4}
      />

      <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-3">
        <p className="text-sm font-semibold text-slate-700">파일 업로드(모의)</p>
        <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-4">
          <input value={newFileName} onChange={(e) => setNewFileName(e.target.value)} placeholder="파일명 입력" className="rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-2" />
          <select value={newFileCategory} onChange={(e) => setNewFileCategory(e.target.value as UploadedFileItem['category'])} className="rounded-md border border-slate-300 px-3 py-2 text-sm">
            {fileCategories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <button type="button" onClick={addFile} className="rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100">파일추가</button>
        </div>

        <ul className="mt-3 space-y-1 text-sm">
          {form.files.length === 0 ? (
            <li className="text-slate-500">업로드된 파일이 없습니다.</li>
          ) : (
            form.files.map((file) => (
              <li key={file.id} className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2">
                <span>[{file.category}] {file.name} ({file.sizeKb}KB)</span>
                <button type="button" onClick={() => deleteFile(file.id)} className="rounded-md border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50">삭제</button>
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={() => submitWith('draft')} className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">임시저장</button>
        <button type="button" onClick={() => submitWith('submit')} className="rounded-md bg-brand-600 px-3 py-2 text-sm text-white hover:bg-brand-700">제출</button>
      </div>
    </section>
  );
}
