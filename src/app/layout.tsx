import type { Metadata } from 'next';
import './globals.css';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { TooltipProvider } from '@/components/ui/tooltip';

export const metadata: Metadata = {
  title: 'Yootopia - AI Agent Meeting System',
  description: '멀티 에이전트 화상회의 시뮬레이터. 전문 AI 에이전트와 함께하는 스마트 회의 플랫폼.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body>
        <TooltipProvider>
          {/* Gradient Background */}
          <div className="app-bg" />

          {/* Sidebar */}
          <AppSidebar />

          {/* Main Content */}
          <main className="main-content">
            {children}
          </main>
        </TooltipProvider>
      </body>
    </html>
  );
}
