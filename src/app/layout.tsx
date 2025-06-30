import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { NoSSR } from '@/components/no-ssr';

export const metadata: Metadata = {
  title: 'Waffle Solver - 智能单词谜题求解器',
  description: '基于 Next.js 15 构建的 Waffle 单词游戏求解器，使用先进算法快速找到最优解决方案',
  keywords: ['waffle', 'word game', 'puzzle solver', 'word puzzle', '单词游戏', '谜题求解'],
  authors: [{ name: 'Waffle Solver Team' }],
  creator: 'Waffle Solver',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://waffle-solver.vercel.app',
    title: 'Waffle Solver - 智能单词谜题求解器',
    description: '基于 Next.js 15 构建的 Waffle 单词游戏求解器',
    siteName: 'Waffle Solver'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Waffle Solver - 智能单词谜题求解器',
    description: '基于 Next.js 15 构建的 Waffle 单词游戏求解器'
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#3b82f6'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="h-full antialiased" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
          storageKey="waffle-theme"
        >
          <div id="root" className="min-h-full bg-transparent">
            {children}
          </div>
          <NoSSR>
            <Toaster
              position="top-right"
              richColors={true}
              closeButton={true}
              toastOptions={{
                duration: 4000,
                className: '',
                style: {
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  color: '#374151',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.06)'
                }
              }}
            />
          </NoSSR>
        </ThemeProvider>
      </body>
    </html>
  );
}
