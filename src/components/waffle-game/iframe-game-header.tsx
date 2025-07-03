import React, { memo, useMemo, useCallback } from 'react';
import { BarChart3, Share2 } from 'lucide-react';
import { ShareDialog } from '@/components/ui/share-dialog';
import { gameStatsManager } from '@/lib/statistics';

interface IFrameGameHeaderProps {
  moveCount: number;
  maxMoves: number;
  gameStatus: 'playing' | 'won' | 'lost';
  onShowStatistics?: () => void;
}

// 静态样式常量 - 避免每次渲染重新创建
const STYLES = {
  nav: 'bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm',
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3',
  layout: 'flex items-center justify-between gap-4 sm:gap-8',
  titleSection: 'flex items-center flex-shrink-0 min-w-[120px]',
  title: 'text-lg sm:text-xl font-bold text-slate-800 tracking-tight',
  centerStats: 'flex items-center justify-center flex-1 max-w-md mx-auto',
  moveBox:
    'flex items-center gap-2 bg-slate-50/80 rounded-xl px-4 py-2 border border-slate-200/80',
  moveLabel: 'text-sm text-slate-600 font-medium',
  moveValue: 'text-lg font-bold text-slate-800',
  moveSeparator: 'text-sm text-slate-400 mx-1',
  actionButtons:
    'flex items-center gap-2 flex-shrink-0 min-w-[120px] justify-end',
  shareButton:
    'flex items-center justify-center w-9 h-9 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors duration-200',
  statsButton:
    'flex items-center justify-center w-9 h-9 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors duration-200',
  shareIcon: 'w-4 h-4 text-blue-600',
  statsIcon: 'w-4 h-4 text-slate-600'
} as const;

export const IFrameGameHeader = memo(function IFrameGameHeader({
  moveCount,
  maxMoves,
  gameStatus,
  onShowStatistics
}: IFrameGameHeaderProps) {
  // 简单计算不需要 useMemo
  const movesRemaining = Math.max(0, maxMoves - moveCount);

  // 使用 useCallback 优化事件处理器
  const handleStatisticsClick = useCallback(() => {
    onShowStatistics?.();
  }, [onShowStatistics]);

  // 优化 shareData 计算 - 只在游戏结束时计算
  const shareData = useMemo(() => {
    if (gameStatus === 'playing') {
      return {
        gameStatus: gameStatus as 'won' | 'lost',
        moveCount,
        maxMoves
      };
    }

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

  const getShareTitle = () => {
    return gameStatus === 'won'
      ? 'Share Your Victory!'
      : 'Share Your Progress!';
  };

  const getShareDescription = () => {
    return gameStatus === 'won'
      ? 'Show off your amazing Waffle game performance!'
      : 'Share your current Waffle game progress with friends!';
  };

  return (
    <nav className={STYLES.nav}>
      <div className={STYLES.container}>
        <div className={STYLES.layout}>
          {/* Left: Title with better spacing */}
          <div className={STYLES.titleSection}>
            <h2 className={STYLES.title}>Waffle Game</h2>
          </div>

          {/* Center: Enhanced Game Stats */}
          <div className={STYLES.centerStats}>
            <div className={STYLES.moveBox}>
              <span className={STYLES.moveLabel}>Moves</span>
              <div className='flex items-center'>
                <span className={STYLES.moveValue}>{moveCount}</span>
                <span className={STYLES.moveSeparator}>/</span>
                <span className={STYLES.moveValue}>{maxMoves}</span>
              </div>
            </div>
          </div>

          {/* Right: Action Buttons with better spacing */}
          <div className={STYLES.actionButtons}>
            <ShareDialog
              shareData={shareData}
              trigger={
                <button
                  className={STYLES.shareButton}
                  title='Share Game'
                  aria-label='Share your game progress'
                >
                  <Share2 className={STYLES.shareIcon} />
                </button>
              }
              title={getShareTitle()}
              description={getShareDescription()}
            />
            <button
              onClick={handleStatisticsClick}
              className={STYLES.statsButton}
              title='View Statistics'
              aria-label='View game statistics'
            >
              <BarChart3 className={STYLES.statsIcon} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
});
