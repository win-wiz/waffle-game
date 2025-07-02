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
  container: 'max-w-full mx-auto px-3 py-2',
  layout: 'flex items-center justify-between',
  title: 'text-sm font-semibold text-slate-800',
  centerStats: 'flex items-center space-x-1 sm:space-x-2 flex-1 justify-center',
  moveBox: 'flex items-center space-x-1 bg-slate-50 rounded-lg px-2 py-1 border border-slate-200',
  moveLabel: 'text-xs text-slate-600',
  moveValue: 'text-sm font-bold text-slate-800',
  moveSeparator: 'text-xs text-slate-400',
  actionButtons: 'flex items-center space-x-1 flex-shrink-0',
  shareButton: 'flex items-center justify-center w-7 h-7 bg-blue-50 hover:bg-blue-100 rounded-md border border-blue-200 transition-colors duration-200',
  statsButton: 'flex items-center justify-center w-7 h-7 bg-slate-50 hover:bg-slate-100 rounded-md border border-slate-200 transition-colors duration-200',
  shareIcon: 'w-3.5 h-3.5 text-blue-600',
  statsIcon: 'w-3.5 h-3.5 text-slate-600'
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

  // 简化状态内容 - 移除不必要的 useMemo
  const getShareTitle = () => {
    return gameStatus === 'won' ? 'Share Your Victory!' : 'Share Your Progress!';
  };
  
  const getShareDescription = () => {
    return gameStatus === 'won'
      ? 'Show off your amazing Waffle game performance!'
      : 'Share your current Waffle game progress with friends!';
  };

  return (
    <nav className={STYLES.nav}>
      <div className={STYLES.container}>
        {/* Unified Single Row Layout */}
        <div className={STYLES.layout}>
          {/* Left: Title Only */}
          <div className='flex items-center flex-shrink-0'>
            <h2 className={STYLES.title}>Waffle</h2>
          </div>

          {/* Center: Compact Game Stats */}
          <div className={STYLES.centerStats}>
            <div className={STYLES.moveBox}>
              <span className={STYLES.moveLabel}>Moves:</span>
              <span className={STYLES.moveValue}>{moveCount}</span>
              <span className={STYLES.moveSeparator}>/</span>
              <span className={STYLES.moveValue}>{maxMoves}</span>
            </div>
          </div>

          {/* Right: Action Buttons */}
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
