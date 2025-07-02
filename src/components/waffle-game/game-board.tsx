import { Board, Tile, SquareNumber, Letter } from '@/types';
import { GameTile } from './game-tile';
import { SwapAnimation } from './swap-animation';

interface GameBoardProps {
  board: Board<Tile> | null;
  selectedPositions: SquareNumber[];
  animatingPositions: SquareNumber[];
  justSwappedPositions: SquareNumber[];
  swapAnimation: {
    from: SquareNumber;
    to: SquareNumber;
    fromLetter: Letter;
    toLetter: Letter;
    progress: number;
  } | null;
  isLoading?: boolean;
  onTileClick: (position: SquareNumber) => void;
  onSwapAnimationComplete: () => void;
}

export function GameBoard({
  board,
  selectedPositions,
  animatingPositions,
  justSwappedPositions,
  swapAnimation,
  isLoading = false,
  onTileClick,
  onSwapAnimationComplete
}: GameBoardProps) {
  return (
    <div className='w-full flex justify-center items-center px-2 sm:px-0'>
      <div className='game-board grid grid-cols-5 gap-2 xs:gap-3 sm:gap-4 md:gap-4 w-fit max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg mx-auto relative z-10'>
        {swapAnimation &&
          (() => {
            if (process.env.NODE_ENV === 'development') {
              console.log(
                '🎬 [GameBoard] 渲染 SwapAnimation 组件:',
                swapAnimation
              );
            }
            return (
              <SwapAnimation
                fromPos={swapAnimation.from}
                toPos={swapAnimation.to}
                fromLetter={swapAnimation.fromLetter}
                toLetter={swapAnimation.toLetter}
                onComplete={onSwapAnimationComplete}
              />
            );
          })()}
        {Array.from({ length: 25 }, (_, gridIndex) => {
          const row = Math.floor(gridIndex / 5);
          const col = gridIndex % 5;
          const isEmptyPosition =
            (row === 1 && (col === 1 || col === 3)) ||
            (row === 3 && (col === 1 || col === 3));

          // 空位置：在loading和正常状态下都显示透明占位符
          if (isEmptyPosition) {
            return (
              <div
                key={gridIndex}
                className='dynamic-waffle-tile'
                style={{ opacity: 0, pointerEvents: 'none' }}
              ></div>
            );
          }

          // 计算letterIndex
          let letterIndex = 0;
          for (let i = 0; i < gridIndex; i++) {
            const r = Math.floor(i / 5);
            const c = i % 5;
            const isEmpty =
              (r === 1 && (c === 1 || c === 3)) ||
              (r === 3 && (c === 1 || c === 3));
            if (!isEmpty) letterIndex++;
          }

          // 如果正在loading或board为null，显示loading状态
          if (isLoading || !board) {
            const isCenterTile = gridIndex === 12; // 中心位置
            return (
              <button
                key={gridIndex}
                className={`dynamic-waffle-tile ${
                  isCenterTile ? 'loading-center' : 'loading-empty'
                }`}
                disabled
              >
                {isCenterTile ? (
                  <div className='animate-spin rounded-full border-2 border-white border-t-transparent h-6 w-6'></div>
                ) : (
                  <div className='text-xs opacity-50'>•</div>
                )}
              </button>
            );
          }

          // 正常游戏状态：确保board存在且letterIndex有效
          if (!board || letterIndex >= board.length) {
            return (
              <div
                key={gridIndex}
                className='dynamic-waffle-tile'
                style={{
                  background: 'rgba(248, 250, 252, 0.6)',
                  border: '2px dashed #cbd5e1',
                  color: '#9ca3af'
                }}
              >
                ?
              </div>
            );
          }

          const tile = board[letterIndex];
          const isSelected = selectedPositions.includes(
            letterIndex as SquareNumber
          );
          const isAnimating = animatingPositions.includes(
            letterIndex as SquareNumber
          );
          const justSwapped = justSwappedPositions.includes(
            letterIndex as SquareNumber
          );

          return (
            <GameTile
              key={gridIndex}
              tile={tile}
              position={letterIndex as SquareNumber}
              isSelected={isSelected}
              isAnimating={isAnimating}
              justSwapped={justSwapped}
              onTileClick={onTileClick}
            />
          );
        })}
      </div>
    </div>
  );
}
