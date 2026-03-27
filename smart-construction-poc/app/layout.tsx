import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Smart 공사관리 플랫폼 PoC',
  description: '도시가스 공사관리 업무 통합 PoC'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
