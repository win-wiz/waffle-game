'use client';

import { memo, useMemo, useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import { useScroll } from '@/hooks/use-scroll';
import { ScrollToTop } from '@/components/scroll-to-top';
// import HelpCenter from '@/components/help-center';
// import FAQ from '@/components/faq';
import { GameStyles } from '@/components/waffle-game/game-styles';
import { GameHeader } from '@/components/waffle-game/game-header';
import { GameBoard } from '@/components/waffle-game/game-board';
import { GameControls } from '@/components/waffle-game/game-controls';
import { AISuggestion } from '@/components/waffle-game/ai-suggestion';
import { GameEndDialog } from '@/components/waffle-game/game-end-dialog';
import { useGameLogic } from '@/components/waffle-game/use-game-logic';
import Statistics from '@/components/statistics';
import type { SquareNumber, Board, Tile } from '@/types';
import { Color } from '@/types';

// 动态导入非关键组件以减少初始包大小
const DynamicHelpCenter = dynamic(() => import('@/components/help-center'), {
  ssr: false,
  loading: () => <div className='h-32 animate-pulse bg-gray-100 rounded-lg' />
});

const DynamicFAQ = dynamic(() => import('@/components/faq'), {
  ssr: false,
  loading: () => <div className='h-32 animate-pulse bg-gray-100 rounded-lg' />
});

const HomePage = memo(function HomePage() {
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
      onGetSuggestion: getSuggestion,
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
      getSuggestion,
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
      onApplySuggestedSwap: applySuggestedSwap
    }),
    [swaps, board, applySuggestedSwap]
  );

  // 缓存游戏结束对话框属性
  const gameEndDialogProps = useMemo(
    () => ({
      isOpen: showGameEndDialog,
      gameStatus: gameStatus as 'won' | 'lost',
      moveCount,
      maxMoves,
      onRestart: handleGameEndRestart,
      onNewGame: handleGameEndNewGame,
      onClose: handleGameEndClose
    }),
    [
      showGameEndDialog,
      gameStatus,
      moveCount,
      maxMoves,
      handleGameEndRestart,
      handleGameEndNewGame,
      handleGameEndClose
    ]
  );

  // 缓存样式对象，避免每次渲染都创建新对象
  const gameAreaStyle = useMemo(
    () => ({
      minHeight: 'calc(100vh - 120px)'
    }),
    []
  );

  return (
    <>
      {/* CSS动画样式 */}
      <GameStyles />

      <div className='min-h-screen bg-gradient-to-br from-slate-50/80 via-gray-50/60 to-blue-50/75'>
        {/* 顶部导航栏 */}
        <GameHeader {...gameHeaderProps} />

        {/* 导航栏占位符 - 当导航栏固定时防止内容跳跃 */}
        {isScrolled && <div className='h-[88px]' />}

        {/* 游戏主区域 - 填满整个可见区域并垂直居中 */}
        <div
          className='flex flex-col items-center justify-center gap-6 py-6 w-full'
          style={gameAreaStyle}
        >
          {/* 游戏盘区域 - 始终显示GameBoard，内部处理loading */}
          <GameBoard {...gameBoardProps} />

          {/* 操作按钮区域 - 始终显示 */}
          <div className='w-full flex justify-center'>
            <GameControls {...gameControlsProps} />
          </div>
        </div>

        {/* 以下内容需要滚动才能看到 */}
        <main className='max-w-6xl mx-auto px-6 py-8 bg-gradient-to-br from-slate-50/25 via-gray-50/15 to-blue-50/40'>
          {/* AI建议区域 */}
          {board && <AISuggestion {...aiSuggestionProps} />}

          {/* AI生成器区域 */}
          {/* 第一期暂时隐藏AI生成功能 */}
          {/* <AIGenerator
            showAIPrompts={showAIPrompts}
            aiResponse={aiResponse}
            selectedTheme={selectedTheme}
            onAiResponseChange={setAiResponse}
            onSelectedThemeChange={setSelectedTheme}
            onValidateAIResponse={handleValidateAIResponse}
          /> */}
        </main>

        {/* 帮助中心区域 - 使用动态导入 */}
        <DynamicHelpCenter />

        {/* FAQ区域 - 使用动态导入 */}
        <DynamicFAQ />
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

export default HomePage;
