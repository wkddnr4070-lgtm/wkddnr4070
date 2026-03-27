export interface StageProgress {
  stage: number;
  title: string;
  goal: string;
  status: '완료' | '진행중' | '대기';
  percent: number;
  highlights: string[];
  nextActions: string[];
}

export const stageProgressList: StageProgress[] = [
  {
    stage: 1,
    title: '프로젝트 초기 세팅 + 대시보드 UI',
    goal: '기본 레이아웃/메뉴/대시보드 골격을 구성해 전체 방향을 확인',
    status: '완료',
    percent: 100,
    highlights: ['Next.js App Router + TypeScript + Tailwind 세팅', 'KPI 카드/필터/정렬 테이블/상세 보기 구현'],
    nextActions: ['화면별 라우팅 확장', '공통 디자인 토큰 정리']
  },
  {
    stage: 2,
    title: '공사 등록 + 협력사 제출 포털',
    goal: '공사계획 등록과 제출 업무를 실제 화면으로 확인 가능하게 구현',
    status: '진행중',
    percent: 70,
    highlights: ['공사 등록(/plans) 폼 + 목록 구현', '제출 포털(/submissions) + 파일추가/삭제 + 임시저장/제출 구현', '필수값/필수첨부 검증(한글 에러 메시지)'],
    nextActions: ['제출 상태(수정요청) 시나리오 강화', '폼 편집 UX 개선(저장 후 알림, 초기화 제어)']
  },
  {
    stage: 3,
    title: 'Supabase DB/Storage 연동',
    goal: '더미 데이터를 실제 저장/조회로 전환',
    status: '대기',
    percent: 0,
    highlights: ['construction_projects/submissions/submission_files/workflow_logs 스키마 연결 예정'],
    nextActions: ['RLS 정책 기초 설정', 'Repository 계층 분리']
  },
  {
    stage: 4,
    title: '승인 워크플로우 + 문서생성 + 메일 준비',
    goal: '승인/반려/수정요청 및 보고 자동화 흐름 연결',
    status: '대기',
    percent: 0,
    highlights: ['워크플로우 상태머신', '문서 템플릿 매핑', '메일 발송 준비 모듈'],
    nextActions: ['상태 전이 규칙 정의', '보고서 미리보기 UI 설계']
  },
  {
    stage: 5,
    title: 'AI 분석 + 예외처리 + 배포 정리',
    goal: '규칙 기반 분석과 운영 안정성을 확보해 PoC 마무리',
    status: '대기',
    percent: 0,
    highlights: ['분석 요청/결과/검토 상태 관리', '빈 상태/로딩/권한 확장 구조', 'Vercel/Replit 배포 문서화'],
    nextActions: ['모의 분석 엔진 연결', '환경변수/운영가이드 정리']
  }
];
