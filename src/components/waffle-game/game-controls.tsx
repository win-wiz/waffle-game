import { memo, useMemo, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useDailyHintLimit } from '@/hooks/use-daily-hint-limit';

interface GameControlsProps {
  isLoading: boolean;
  movesRemaining: number;
  isGenerating: boolean;
  isLoadingClassic: boolean;
  showAIPrompts: boolean;
  onGetSuggestion: () => void;
  onResetGame: () => void;
  onGenerateNewPuzzle: () => void;
  onUseClassicPuzzle: () => void;
  onToggleAIPrompts: () => void;
}

export const GameControls = memo(function GameControls({
  isLoading,
  movesRemaining,
  isGenerating,
  isLoadingClassic,
  showAIPrompts,
  onGetSuggestion,
  onResetGame,
  onGenerateNewPuzzle,
  onUseClassicPuzzle,
  onToggleAIPrompts
}: GameControlsProps) {
  const { toast } = useToast();
  const {
    dailyHintCount,
    isLimitReached,
    remainingHints,
    incrementHintCount,
    isInitialized
  } = useDailyHintLimit();

  // Handle hint button click with daily limit check
  const handleGetSuggestion = useCallback(() => {
    if (isLimitReached) {
      toast({
        title: 'Daily Hint Limit Reached',
        description: 'You\'ve used all 3 hints for today. Come back tomorrow for more hints!',
        variant: 'destructive'
      });
      return;
    }

    const result = incrementHintCount();

    // Show appropriate toast message
    if (result.isLastHint) {
      toast({
        title: 'Last Hint Used',
        description: 'This was your last hint for today. Come back tomorrow for more!',
        variant: 'default'
      });
    } else {
      toast({
        title: 'Hint Used',
        description: `You have ${result.remaining} hint${result.remaining === 1 ? '' : 's'} remaining today.`,
        variant: 'default'
      });
    }

    // Call the original function
    onGetSuggestion();
  }, [isLimitReached, incrementHintCount, onGetSuggestion, toast]);
  // Memoize className calculations for better performance
  const suggestionButtonClass = useMemo(() => {
    const baseClass = 'flex items-center justify-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200';
    const disabledClass = 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200';
    const enabledClass = 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95 shadow-sm';
    const isDisabled = isLoading || movesRemaining === 0 || isLimitReached;
    return `${baseClass} ${isDisabled ? disabledClass : enabledClass}`;
  }, [isLoading, movesRemaining, isLimitReached]);

  const randomPuzzleButtonClass = useMemo(() => {
    const baseClass = 'flex flex-col items-center justify-center px-3 py-3 rounded-xl font-medium transition-all duration-200 text-sm min-h-[56px]';
    const disabledClass = 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200';
    const enabledClass = 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 active:scale-95';
    return `${baseClass} ${isGenerating ? disabledClass : enabledClass}`;
  }, [isGenerating]);

  const classicPuzzleButtonClass = useMemo(() => {
    const baseClass = 'flex flex-col items-center justify-center px-3 py-3 rounded-xl font-medium transition-all duration-200 text-sm min-h-[56px]';
    const disabledClass = 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200';
    const enabledClass = 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 active:scale-95';
    return `${baseClass} ${isLoadingClassic ? disabledClass : enabledClass}`;
  }, [isLoadingClassic]);

  // Memoize button content for better performance
  const suggestionButtonContent = useMemo(() => {
    if (!isInitialized) {
      return { icon: '⏳', text: 'Loading...' };
    }
    if (isLoading) {
      return { icon: '🤔', text: 'Analyzing...' };
    }
    if (isLimitReached) {
      return { icon: '🚫', text: 'No Hints Left' };
    }
    return {
      icon: '💡',
      text: `Get Hint (${remainingHints})`
    };
  }, [isInitialized, isLoading, isLimitReached, remainingHints]);

  const randomPuzzleButtonContent = useMemo(() => ({
    text: isGenerating ? 'Generating...' : 'Random Puzzle'
  }), [isGenerating]);

  const classicPuzzleButtonContent = useMemo(() => ({
    text: isLoadingClassic ? 'Loading...' : 'Classic Puzzle'
  }), [isLoadingClassic]);

  return (
    <div className="w-full max-w-md mx-auto mt-6">
      {/* 2x2 Grid Layout */}
      <div className="grid grid-cols-2 gap-3">
        {/* Get Suggestion */}
        <button
          className={suggestionButtonClass}
          onClick={handleGetSuggestion}
          disabled={!isInitialized || isLoading || movesRemaining === 0 || isLimitReached}
        >
          <span className="mr-2">{suggestionButtonContent.icon}</span>
          {suggestionButtonContent.text}
        </button>

        {/* Reset Game */}
        <button
          className="flex items-center justify-center px-4 py-3 rounded-xl font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:scale-95 transition-all duration-200 shadow-sm text-sm"
          onClick={onResetGame}
        >
          <span className="mr-2">🔄</span>
          Reset Game
        </button>

        {/* Random Puzzle */}
        <button
          onClick={onGenerateNewPuzzle}
          disabled={isGenerating}
          className={randomPuzzleButtonClass}
        >
          <span className="text-base mb-1">🎲</span>
          <span className="text-xs">{randomPuzzleButtonContent.text}</span>
        </button>

        {/* Classic Puzzle */}
        <button
          onClick={onUseClassicPuzzle}
          disabled={isLoadingClassic}
          className={classicPuzzleButtonClass}
        >
          <span className="text-base mb-1">🏛️</span>
          <span className="text-xs">{classicPuzzleButtonContent.text}</span>
        </button>
      </div>

      {/* AI Generation feature temporarily hidden in first phase */}
      {/* <button
        onClick={onToggleAIPrompts}
        className="bg-gradient-to-r from-purple-100 to-violet-100 border border-purple-300 text-purple-800 px-2 sm:px-3 py-2 rounded-md sm:rounded-lg font-medium hover:from-purple-200 hover:to-violet-200 hover:scale-[1.02] hover:border-purple-400 transition-all duration-300 shadow-sm text-xs sm:text-sm min-h-[40px]"
      >
        <div className="text-xs mb-0.5">🤖</div>
        {showAIPrompts ? 'Hide' : 'AI Generate'}
      </button> */}
    </div>
  );
});
