# Smart 공사관리 플랫폼 PoC (1~2단계)

Next.js App Router + TypeScript + Tailwind CSS 기반 PoC입니다.

## 실행

### GitHub에서 로컬 없이 실행
- `../GITHUB_실행_가이드.md` 참고 (Codespaces / Vercel)


### 저장소 루트에서 자동 실행(권장)
```bash
npm run poc:start
```

### 폴더 내부에서 실행
```bash
cd smart-construction-poc
npm install
npm run dev
```

## 접속 주소

- 기본: `http://localhost:3000`
- 대시보드: `http://localhost:3000/`
- 개발현황: `http://localhost:3000/status`
- 공사계획: `http://localhost:3000/plans`
- 제출포털: `http://localhost:3000/submissions`
- 접속안내 페이지: `http://localhost:3000/access`

## 구현 범위

### 1단계
- 공통 레이아웃(상단 헤더 + 좌측 네비게이션)
- 더미 데이터 기반 공사현황 대시보드
- KPI 카드 / 필터 / 정렬 가능한 테이블
- 상세보기 화면 연결

### 2단계
- 공사 등록(공사계획) 페이지: `/plans`
- 협력사 제출 포털 페이지: `/submissions`
- 개발현황 보드 페이지: `/status`
- 파일추가/삭제, 임시저장/제출, 수정 기능
- 필수값/필수 첨부파일 검증 및 한글 오류 메시지

## 다음 단계

3단계에서 Supabase 스키마 구성 및 실제 저장/조회 연결을 진행합니다.
