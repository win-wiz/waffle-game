import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { NoSSR } from '@/components/no-ssr';

export const metadata: Metadata = {
  title: 'Waffle Game - Free Online Word Puzzle with AI Hints',
  description:
    'Play Waffle Game online free! Solve word puzzles in 15 moves with AI hints. Master this engaging brain game with custom themes and daily challenges.',
  keywords:
    'waffle game, word puzzle, online game, AI hints, brain games, word challenge, puzzle game, free games',
  authors: [{ name: 'Waffle Game Team' }],
  creator: 'Waffle Game',
  publisher: 'Waffle Game Platform',
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1',
  openGraph: {
    title: 'Waffle Game - Free Online Word Puzzle Game',
    description:
      'Master Waffle Game with AI hints! Play this addictive word puzzle game online free with strategic gameplay and custom themes.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Waffle Game',
    url: 'https://wafflegame.com'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Waffle Game - Online Word Puzzle Challenge',
    description:
      'Play Waffle Game free online! Solve word puzzles with AI hints and strategic gameplay.'
  },
  alternates: {
    canonical: 'https://wafflegame.com'
  },
  other: {
    'theme-color': '#3b82f6',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Waffle Game'
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
  children: React.ReactNode;
}) {
  return (
    <html lang='zh-CN' className='h-full' suppressHydrationWarning>
      <head>
        <link rel='icon' href='/favicon.ico' />
      </head>
      <body className='h-full antialiased' suppressHydrationWarning>
        <ThemeProvider
          attribute='class'
          defaultTheme='light'
          enableSystem={false}
          disableTransitionOnChange
          storageKey='waffle-theme'
        >
          <div id='root' className='min-h-full bg-transparent'>
            {children}
          </div>
          <NoSSR>
            <Toaster
              position='top-right'
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
                  boxShadow:
                    '0 10px 40px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.06)'
                }
              }}
            />
          </NoSSR>
        </ThemeProvider>
      </body>
    </html>
  );
}
