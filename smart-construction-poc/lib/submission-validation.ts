import { SubmissionFormValue, UploadedFileItem } from '@/lib/submission-types';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

const requiredCategories: UploadedFileItem['category'][] = ['작업일보', '일일계획', '준공도면', '현장사진', '산안비증빙'];

export function validateSubmission(value: SubmissionFormValue): ValidationResult {
  const errors: string[] = [];

  if (!value.projectNumber.trim()) errors.push('공사번호를 입력해 주세요.');
  if (!value.projectName.trim()) errors.push('공사명을 입력해 주세요.');
  if (!value.location.trim()) errors.push('위치 정보를 입력해 주세요.');
  if (!value.startDate || !value.endDate) errors.push('공사기간(시작/종료일)을 입력해 주세요.');
  if (!value.workerCount || Number(value.workerCount) <= 0) errors.push('투입 인력을 1명 이상 입력해 주세요.');

  const categories = new Set(value.files.map((file) => file.category));
  requiredCategories.forEach((category) => {
    if (!categories.has(category)) {
      errors.push(`필수 첨부파일이 누락되었습니다: ${category}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

export function createEmptySubmission(): SubmissionFormValue {
  return {
    projectNumber: '',
    projectName: '',
    location: '',
    startDate: '',
    endDate: '',
    workerCount: '',
    dailyPlan: '',
    files: []
  };
}
