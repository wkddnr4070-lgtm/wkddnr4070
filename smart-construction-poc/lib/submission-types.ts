export type SubmissionStatus = '임시저장' | '제출완료' | '수정요청';

export interface UploadedFileItem {
  id: string;
  name: string;
  category: '작업일보' | '일일계획' | '준공도면' | '현장사진' | '산안비증빙' | '기타';
  sizeKb: number;
  uploadedAt: string;
}

export interface SubmissionFormValue {
  projectNumber: string;
  projectName: string;
  location: string;
  startDate: string;
  endDate: string;
  workerCount: string;
  dailyPlan: string;
  files: UploadedFileItem[];
}

export interface SubmissionRecord extends SubmissionFormValue {
  id: string;
  partnerCompany: string;
  submittedAt: string;
  status: SubmissionStatus;
  reviewComment: string;
}
