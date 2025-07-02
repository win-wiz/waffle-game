import React, { memo, useMemo } from 'react';
import { useScroll, scrollToElement } from '@/hooks/use-scroll';
import { HelpCircle, BarChart3, Share2 } from 'lucide-react';
import { ShareDialog } from '@/components/ui/share-dialog';
import { gameStatsManager } from '@/lib/statistics';

interface GameHeaderProps {
  moveCount: number;
  maxMoves: number;
  gameStatus: 'playing' | 'won' | 'lost';
  onShowStatistics?: () => void;
}

export const GameHeader = memo(function GameHeader({
  moveCount,
  maxMoves,
  gameStatus,
  onShowStatistics
}: GameHeaderProps) {
  const movesRemaining = useMemo(
    () => Math.max(0, maxMoves - moveCount),
    [moveCount, maxMoves]
  );
  const isScrolled = useScroll(50);

  // Handle help center scroll
  const handleHelpClick = () => {
    scrollToElement('help-center', 80);
  };

  // Handle statistics click
  const handleStatisticsClick = () => {
    onShowStatistics?.();
  };

  // Prepare share data
  const shareData = useMemo(() => {
    try {
      const stats = gameStatsManager.getStatistics();
      return {
        gameStatus: gameStatus as 'won' | 'lost',
        moveCount,
        maxMoves,
        totalGames: stats.totalGames,
        winRate: stats.winRate,
        currentStreak: stats.currentStreak
      };
    } catch {
      return {
        gameStatus: gameStatus as 'won' | 'lost',
        moveCount,
        maxMoves
      };
    }
  }, [gameStatus, moveCount, maxMoves]);

  // Memoize status display content
  const statusContent = useMemo(() => {
    switch (gameStatus) {
      case 'won':
        return { icon: '🏆', text: 'Completed', color: 'text-emerald-600' };
      case 'lost':
        return { icon: '💔', text: 'Finished', color: 'text-red-500' };
      default:
        return { icon: '🎯', text: 'In Progress', color: 'text-slate-800' };
    }
  }, [gameStatus]);

  // Memoize style classes with sticky behavior
  const containerClasses = useMemo(() => {
    const baseClasses =
      'bg-gradient-to-r from-slate-100/85 via-gray-100/70 to-blue-100/90 backdrop-blur-sm border-b border-slate-300/50 shadow-lg transition-all duration-300';
    const stickyClasses = isScrolled
      ? 'fixed top-0 left-0 right-0 z-50 shadow-xl'
      : '';
    return `${baseClasses} ${stickyClasses}`;
  }, [isScrolled]);

  const logoContainerClasses = useMemo(
    () =>
      'w-12 h-12 bg-gradient-to-br from-blue-500 to-slate-600 rounded-xl flex items-center justify-center shadow-lg border border-slate-300',
    []
  );

  const titleClasses = useMemo(
    () =>
      'text-2xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent',
    []
  );

  const statBoxClasses = useMemo(
    () =>
      'text-center bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2 border border-slate-200/50 shadow-sm',
    []
  );

  const helpButtonClasses = useMemo(
    () =>
      'flex items-center justify-center w-10 h-10 bg-blue-500/10 hover:bg-blue-500/20 rounded-xl border border-blue-200/50 transition-all duration-200 hover:scale-105 active:scale-95',
    []
  );

  return (
    <nav className={containerClasses}>
      <div className='max-w-6xl mx-auto px-2 xs:px-3 sm:px-6 py-2 xs:py-3 sm:py-4'>
        {/* Mobile Layout - Stacked */}
        <div className='block lg:hidden'>
          {/* Top Row: Logo + Action Buttons */}
          <div className='flex items-center justify-between mb-2 sm:mb-3'>
            <div className='flex items-center space-x-2 sm:space-x-3'>
              <div className='w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-slate-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg border border-slate-300'>
                <span className='text-white text-base xs:text-lg sm:text-xl font-bold'>
                  W
                </span>
              </div>
              <div className='min-w-0 flex-1'>
                <h2 className='text-base xs:text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent truncate'>
                  Waffle Game
                </h2>
                <p className='text-slate-700/80 text-xs sm:text-sm font-medium hidden xs:block'>
                  Word Puzzle Game
                </p>
              </div>
            </div>
            <div className='flex items-center space-x-1 xs:space-x-1.5 sm:space-x-2 flex-shrink-0'>
              <ShareDialog
                shareData={shareData}
                trigger={
                  <button
                    className='flex items-center justify-center w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg border border-blue-200/50 transition-all duration-200 hover:scale-105 active:scale-95'
                    title='Share Game'
                    aria-label='Share your game progress'
                  >
                    <Share2 className='w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-blue-600' />
                  </button>
                }
                title={
                  gameStatus === 'won'
                    ? 'Share Your Victory!'
                    : 'Share Your Progress!'
                }
                description={
                  gameStatus === 'won'
                    ? 'Show off your amazing Waffle game performance!'
                    : 'Share your current Waffle game progress with friends!'
                }
              />
              <button
                onClick={handleStatisticsClick}
                className='flex items-center justify-center w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg border border-blue-200/50 transition-all duration-200 hover:scale-105 active:scale-95'
                title='View Statistics'
                aria-label='View game statistics'
              >
                <BarChart3 className='w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-blue-600' />
              </button>
              <button
                onClick={handleHelpClick}
                className='flex items-center justify-center w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg border border-blue-200/50 transition-all duration-200 hover:scale-105 active:scale-95'
                title='Go to Help Center'
                aria-label='Navigate to help center'
              >
                <HelpCircle className='w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-blue-600' />
              </button>
            </div>
          </div>
          {/* Bottom Row: Game Stats */}
          <div className='flex items-center justify-center space-x-1.5 xs:space-x-2 sm:space-x-3'>
            <div className='text-center bg-white/60 backdrop-blur-sm rounded-lg px-1.5 xs:px-2 sm:px-3 py-1 xs:py-1.5 sm:py-2 border border-slate-200/50 shadow-sm flex-1 max-w-[80px] xs:max-w-[90px] sm:max-w-none'>
              <div className='text-sm xs:text-base sm:text-lg font-bold text-slate-800'>
                {moveCount}
              </div>
              <div className='text-xs text-slate-600 font-medium'>Used</div>
            </div>
            <div className='text-center bg-white/60 backdrop-blur-sm rounded-lg px-1.5 xs:px-2 sm:px-3 py-1 xs:py-1.5 sm:py-2 border border-slate-200/50 shadow-sm flex-1 max-w-[80px] xs:max-w-[90px] sm:max-w-none'>
              <div className='text-sm xs:text-base sm:text-lg font-bold text-slate-800'>
                {movesRemaining}
              </div>
              <div className='text-xs text-slate-600 font-medium'>Left</div>
            </div>
            <div className='text-center bg-white/60 backdrop-blur-sm rounded-lg px-1.5 xs:px-2 sm:px-3 py-1 xs:py-1.5 sm:py-2 border border-slate-200/50 shadow-sm flex-1 max-w-[80px] xs:max-w-[90px] sm:max-w-none'>
              <div
                className={`text-sm xs:text-base sm:text-lg font-bold ${statusContent.color}`}
              >
                {statusContent.icon}
              </div>
              <div className='text-xs text-slate-600 font-medium truncate'>
                {statusContent.text}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout - Original */}
        <div className='hidden lg:flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <div className={logoContainerClasses}>
              <span className='text-white text-2xl font-bold'>W</span>
            </div>
            <div>
              <h2 className={titleClasses}>Waffle Game</h2>
              <p className='text-slate-700/80 text-sm font-medium'>
                Word Puzzle Game
              </p>
            </div>
          </div>

          <div className='flex items-center space-x-6'>
            <div className={statBoxClasses}>
              <div className='text-xl font-bold text-slate-800'>
                {moveCount}
              </div>
              <div className='text-xs text-slate-600 font-medium'>
                Moves Used
              </div>
            </div>
            <div className={statBoxClasses}>
              <div className='text-xl font-bold text-slate-800'>
                {movesRemaining}
              </div>
              <div className='text-xs text-slate-600 font-medium'>
                Moves Left
              </div>
            </div>
            <div className={statBoxClasses}>
              <div className={`text-xl font-bold ${statusContent.color}`}>
                {statusContent.icon}
              </div>
              <div className='text-xs text-slate-600 font-medium'>
                {statusContent.text}
              </div>
            </div>
            <ShareDialog
              shareData={shareData}
              trigger={
                <button
                  className={helpButtonClasses}
                  title='Share Game'
                  aria-label='Share your game progress'
                >
                  <Share2 className='w-5 h-5 text-blue-600' />
                </button>
              }
              title={
                gameStatus === 'won'
                  ? 'Share Your Victory!'
                  : 'Share Your Progress!'
              }
              description={
                gameStatus === 'won'
                  ? 'Show off your amazing Waffle game performance!'
                  : 'Share your current Waffle game progress with friends!'
              }
            />
            <button
              onClick={handleStatisticsClick}
              className={helpButtonClasses}
              title='View Statistics'
              aria-label='View game statistics'
            >
              <BarChart3 className='w-5 h-5 text-blue-600' />
            </button>
            <button
              onClick={handleHelpClick}
              className={helpButtonClasses}
              title='Go to Help Center'
              aria-label='Navigate to help center'
            >
              <HelpCircle className='w-5 h-5 text-blue-600' />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
});
