# Smart 공사관리 플랫폼 PoC (1~2단계)

Next.js App Router + TypeScript + Tailwind CSS 기반 PoC입니다.

## 실행

```bash
cd smart-construction-poc
npm install
npm run dev
```

브라우저에서 `http://localhost:3000` 접속.

## 구현 범위

### 1단계
- 공통 레이아웃(상단 헤더 + 좌측 네비게이션)
- 더미 데이터 기반 공사현황 대시보드
- KPI 카드 / 필터 / 정렬 가능한 테이블
- 상세보기 화면 연결

### 2단계
- 공사 등록(공사계획) 페이지: `/plans`
- 협력사 제출 포털 페이지: `/submissions`
- 파일추가/삭제, 임시저장/제출, 수정 기능
- 필수값/필수 첨부파일 검증 및 한글 오류 메시지

## 다음 단계

3단계에서 Supabase 스키마 구성 및 실제 저장/조회 연결을 진행합니다.
