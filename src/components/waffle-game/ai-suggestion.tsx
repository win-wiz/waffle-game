import React, { useMemo, useCallback } from 'react';
import { Board, Tile, Swap } from '@/types';
import { getIntuitivePosDescription } from './game-constants';

interface AISuggestionProps {
  swaps: Swap[];
  board: Board<Tile>;
  onApplySuggestedSwap: () => void;
}

// Memoized swap item component to prevent unnecessary re-renders
const SwapItem = React.memo(
  ({
    swap,
    index,
    board
  }: {
    swap: Swap;
    index: number;
    board: Board<Tile>;
  }) => {
    const stepLabel = useMemo(() => {
      return index === 0 ? 'Recommended Swap' : 'Next Step';
    }, [index]);

    const swapDescription = useMemo(() => {
      return `${getIntuitivePosDescription(
        swap[0],
        board
      )} ↔ ${getIntuitivePosDescription(swap[1], board)}`;
    }, [swap, board]);

    const stepNumberClass = useMemo(() => {
      return `w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white font-bold shadow-md text-xs sm:text-sm ${
        index === 0
          ? 'bg-gradient-to-r from-emerald-500 to-green-500'
          : 'bg-gradient-to-r from-blue-500 to-indigo-500'
      }`;
    }, [index]);

    return (
      <div className='bg-white/90 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-200/80 shadow-sm'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2 sm:space-x-3'>
            <div className={stepNumberClass}>{index + 1}</div>
            <div>
              <div className='font-semibold text-slate-800 text-sm sm:text-base'>
                {stepLabel}
              </div>
              <div className='text-slate-700/80 text-xs sm:text-sm'>
                {swapDescription}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

SwapItem.displayName = 'SwapItem';

export const AISuggestion = React.memo(
  ({ swaps, board, onApplySuggestedSwap }: AISuggestionProps) => {
    // Early return for empty swaps
    if (swaps.length === 0) {
      return null;
    }

    // Memoize the displayed swaps to avoid recalculating slice on every render
    const displayedSwaps = useMemo(() => swaps.slice(0, 2), [swaps]);

    // Memoize remaining steps calculation
    const remainingSteps = useMemo(() => {
      return swaps.length > 2 ? swaps.length - 2 : 0;
    }, [swaps.length]);

    // Memoize the click handler to prevent unnecessary re-renders of child components
    const handleApplySwap = useCallback(() => {
      onApplySuggestedSwap();
    }, [onApplySuggestedSwap]);

    return (
      <div className='bg-gradient-to-r from-slate-100/80 to-blue-100/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-300/60 shadow-xl mb-4 sm:mb-8'>
        <div className='text-center mb-4 sm:mb-6'>
          <div className='w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-slate-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg border border-slate-400'>
            <span className='text-lg sm:text-2xl'>💡</span>
          </div>
          <h3 className='text-lg sm:text-2xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent mb-1 sm:mb-2'>
            AI Smart Suggestions
          </h3>
          <p className='text-slate-700/80 text-sm sm:text-base'>
            Optimal strategy based on current game state analysis
          </p>
        </div>

        <div className='space-y-3 sm:space-y-4 mb-4 sm:mb-6'>
          {displayedSwaps.map((swap, index) => (
            <SwapItem key={index} swap={swap} index={index} board={board} />
          ))}

          {remainingSteps > 0 && (
            <div className='text-center p-3 sm:p-4 bg-slate-50/90 rounded-lg sm:rounded-xl border border-slate-200/60'>
              <span className='text-slate-600 text-xs sm:text-sm font-medium'>
                {remainingSteps} more steps to complete the puzzle
              </span>
            </div>
          )}
        </div>

        <div className='text-center'>
          <button
            className='bg-gradient-to-r from-emerald-500 to-green-500 border-2 border-emerald-400 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:from-emerald-600 hover:to-green-600 hover:scale-105 hover:border-emerald-500 transition-all duration-300 shadow-lg text-sm sm:text-base'
            onClick={handleApplySwap}
          >
            ✨ Apply Suggestion
          </button>
        </div>
      </div>
    );
  }
);

AISuggestion.displayName = 'AISuggestion';
