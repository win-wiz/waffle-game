import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { NoSSR } from '@/components/no-ssr';

export const metadata: Metadata = {
  title: 'Waffle Game - Word Puzzle Challenge with AI Hints | Play Online Free',
  description:
    'Master Waffle Game - the ultimate word puzzle challenge! Solve 6 words in 15 moves with color-coded hints. Play Waffle Game online free with AI suggestions, custom themes, and daily puzzles. Perfect for word game enthusiasts seeking brain-training fun.',
  keywords:
    'waffle game, word puzzle, word game, brain games, puzzle game, word challenge, online games, free games, word swap, letter puzzle, daily puzzle, AI hints, vocabulary game, word finder, crossword alternative',
  authors: [{ name: 'Waffle Game Team' }],
  creator: 'Waffle Game',
  publisher: 'Waffle Game Platform',
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1',
  openGraph: {
    title: 'Waffle Game - Ultimate Word Puzzle Challenge',
    description:
      'Play Waffle Game online free! Solve word puzzles with AI hints, custom themes, and strategic gameplay. Challenge your vocabulary in this addictive Waffle Game experience.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Waffle Game'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Waffle Game - Word Puzzle Challenge',
    description:
      'Master the ultimate Waffle Game word puzzle! Play free online with AI hints and custom themes.'
  },
  alternates: {
    canonical: '/'
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
