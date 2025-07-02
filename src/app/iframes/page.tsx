'use client';

import { memo, useMemo, useCallback, useState } from 'react';
import { useScroll, scrollToElement } from '@/hooks/use-scroll';
import { ScrollToTop } from '@/components/scroll-to-top';
import { GameStyles } from '@/components/waffle-game/game-styles';
import { IFrameGameHeader } from '@/components/waffle-game/iframe-game-header';
import { GameBoard } from '@/components/waffle-game/game-board';
import { GameControls } from '@/components/waffle-game/game-controls';
import { AISuggestion } from '@/components/waffle-game/ai-suggestion';
import { GameEndDialog } from '@/components/waffle-game/game-end-dialog';
import { useGameLogic } from '@/components/waffle-game/use-game-logic';
import Statistics from '@/components/statistics';
import { gameStatsManager } from '@/lib/statistics';
import type { SquareNumber, Board, Tile } from '@/types';
import { Color } from '@/types';

const IFramePage = memo(function IFramePage() {
  // 监听滚动状态，用于导航栏占位
  const isScrolled = useScroll(50);

  // 统计对话框状态
  const [showStatistics, setShowStatistics] = useState(false);

  const {
    // 游戏状态
    board,
    swaps,
    isLoading,
    selectedPositions,
    moveCount,
    maxMoves,
    movesRemaining,
    isGenerating,
    showAIPrompts,
    aiResponse,
    selectedTheme,
    isLoadingClassic,
    gameStatus,
    showGameEndDialog,

    // 动画状态
    animatingPositions,
    justSwappedPositions,
    swapAnimation,

    // 游戏操作
    handleTileClick,
    handleSwapAnimationComplete,
    getSuggestion,
    applySuggestedSwap,
    resetGame,
    generateNewPuzzle,
    useClassicPuzzle,

    // AI相关
    setShowAIPrompts,
    setAiResponse,
    setSelectedTheme,
    handleValidateAIResponse,

    // 游戏结束处理
    handleGameEndRestart,
    handleGameEndNewGame,
    handleGameEndClose
  } = useGameLogic();

  // 优化内联函数，避免每次渲染都创建新函数
  const handleToggleAIPrompts = useCallback(() => {
    setShowAIPrompts(!showAIPrompts);
  }, [showAIPrompts, setShowAIPrompts]);

  // 处理统计对话框显示
  const handleShowStatistics = useCallback(() => {
    setShowStatistics(true);
  }, []);

  const handleCloseStatistics = useCallback(() => {
    setShowStatistics(false);
  }, []);

  // 包装getSuggestion函数，添加滚动到AI建议区域的逻辑
  const handleGetSuggestionWithScroll = useCallback(async () => {
    await getSuggestion();
    // 延迟滚动，确保AI建议内容已经渲染
    setTimeout(() => {
      const aiSuggestionsElement = document.getElementById('ai-suggestions');

      if (aiSuggestionsElement) {
        // 获取AI建议区域的位置
        const aiRect = aiSuggestionsElement.getBoundingClientRect();
        const aiTop = aiRect.top + window.scrollY;

        // 计算滚动目标：让AI建议区域的顶部显示在屏幕的下1/3处
        // 这样屏幕上2/3显示游戏区域，下1/3显示AI建议区域
        const targetScrollY = aiTop - (window.innerHeight * 2) / 3 + 100;

        window.scrollTo({
          top: Math.max(0, targetScrollY), // 确保不会滚动到负数位置
          behavior: 'smooth'
        });
      }
    }, 300);
  }, [getSuggestion]);

  // 包装applySuggestedSwap函数，添加滚动到游戏区域的逻辑
  const handleApplySuggestionWithScroll = useCallback(() => {
    applySuggestedSwap();
    // 延迟滚动，确保游戏状态已更新
    setTimeout(() => {
      scrollToElement('game-area', 100);
    }, 200);
  }, [applySuggestedSwap]);

  // 缓存游戏头部属性
  const gameHeaderProps = useMemo(
    () => ({
      moveCount,
      maxMoves,
      gameStatus,
      onShowStatistics: handleShowStatistics
    }),
    [moveCount, maxMoves, gameStatus, handleShowStatistics]
  );

  // 缓存游戏板属性
  const gameBoardProps = useMemo(
    () => ({
      board,
      selectedPositions,
      animatingPositions,
      justSwappedPositions,
      swapAnimation,
      isLoading: isGenerating,
      onTileClick: handleTileClick,
      onSwapAnimationComplete: handleSwapAnimationComplete
    }),
    [
      board,
      selectedPositions,
      animatingPositions,
      justSwappedPositions,
      swapAnimation,
      isGenerating,
      handleTileClick,
      handleSwapAnimationComplete
    ]
  );

  // 缓存游戏控制属性
  const gameControlsProps = useMemo(
    () => ({
      isLoading,
      movesRemaining,
      isGenerating,
      isLoadingClassic,
      showAIPrompts,
      onGetSuggestion: handleGetSuggestionWithScroll,
      onResetGame: resetGame,
      onGenerateNewPuzzle: generateNewPuzzle,
      onUseClassicPuzzle: useClassicPuzzle,
      onToggleAIPrompts: handleToggleAIPrompts
    }),
    [
      isLoading,
      movesRemaining,
      isGenerating,
      isLoadingClassic,
      showAIPrompts,
      handleGetSuggestionWithScroll,
      resetGame,
      generateNewPuzzle,
      useClassicPuzzle,
      handleToggleAIPrompts
    ]
  );

  // 缓存AI建议属性
  const aiSuggestionProps = useMemo(
    () => ({
      swaps,
      board: board!,
      onApplySuggestedSwap: handleApplySuggestionWithScroll
    }),
    [swaps, board, handleApplySuggestionWithScroll]
  );

  // 获取统计数据用于分享功能
  const statisticsData = useMemo(() => {
    try {
      return gameStatsManager.getStatistics();
    } catch {
      return null;
    }
  }, [gameStatus]); // 当游戏状态改变时重新获取统计数据

  // 缓存游戏结束对话框属性
  const gameEndDialogProps = useMemo(
    () => ({
      isOpen: showGameEndDialog,
      gameStatus: gameStatus as 'won' | 'lost',
      moveCount,
      maxMoves,
      onRestart: handleGameEndRestart,
      onNewGame: handleGameEndNewGame,
      onClose: handleGameEndClose,
      totalGames: statisticsData?.totalGames,
      winRate: statisticsData?.winRate,
      currentStreak: statisticsData?.currentStreak
    }),
    [
      showGameEndDialog,
      gameStatus,
      moveCount,
      maxMoves,
      handleGameEndRestart,
      handleGameEndNewGame,
      handleGameEndClose,
      statisticsData
    ]
  );



  return (
    <>
      {/* CSS动画样式 */}
      <GameStyles />

      <div className='min-h-screen bg-gradient-to-br from-slate-50/80 via-gray-50/60 to-blue-50/75'>
        {/* 顶部导航栏 - iframe专用 */}
        <IFrameGameHeader {...gameHeaderProps} />

        {/* 游戏主区域 - 优化间距和布局 */}
        <div
          id='game-area'
          className='flex flex-col items-center justify-center gap-4 sm:gap-6 px-4 sm:px-6 py-4 sm:py-6 w-full min-h-[calc(100vh-120px)]'
        >
          {/* 游戏盘区域 - 始终显示GameBoard，内部处理loading */}
          <div className='w-full max-w-sm sm:max-w-md md:max-w-lg flex justify-center'>
            <GameBoard {...gameBoardProps} />
          </div>

          {/* 操作按钮区域 - 始终显示 */}
          <div className='w-full flex justify-center'>
            <GameControls {...gameControlsProps} />
          </div>
        </div>

        {/* AI建议区域 - 优化间距 */}
        <main className='max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 bg-gradient-to-br from-slate-50/25 via-gray-50/15 to-blue-50/40'>
          <div id='ai-suggestions' className='w-full max-w-md sm:max-w-lg mx-auto px-2 sm:px-4'>
            {board && <AISuggestion {...aiSuggestionProps} />}
          </div>
        </main>
      </div>

      {/* 游戏结束对话框 */}
      {showGameEndDialog && gameStatus !== 'playing' && (
        <GameEndDialog {...gameEndDialogProps} />
      )}

      {/* 统计对话框 */}
      <Statistics isOpen={showStatistics} onClose={handleCloseStatistics} />

      {/* 返回顶部按钮 */}
      <ScrollToTop threshold={300} />
    </>
  );
});

IFramePage.displayName = 'IFramePage';

export default IFramePage;
