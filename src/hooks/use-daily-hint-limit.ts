import { useState, useEffect, useCallback } from 'react';
import { hintStorage, type HintData } from '@/lib/storage';

const DAILY_HINT_LIMIT = 3;

interface HintResult {
  newCount: number;
  remaining: number;
  isLastHint: boolean;
}

export function useDailyHintLimit() {
  const [dailyHintCount, setDailyHintCount] = useState(0);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize hint data on mount
  useEffect(() => {
    const today = new Date().toDateString();
    const storedData = hintStorage.get();

    if (storedData?.date === today) {
      // Same day, use stored count
      setDailyHintCount(storedData.count);
      setIsLimitReached(storedData.count >= DAILY_HINT_LIMIT);
    } else {
      // New day or no data, reset
      setDailyHintCount(0);
      setIsLimitReached(false);
      hintStorage.set({ date: today, count: 0 });
    }

    setIsInitialized(true);
  }, []);

  // Increment hint count with optimistic updates
  const incrementHintCount = useCallback((): HintResult => {
    const newCount = dailyHintCount + 1;
    const remaining = DAILY_HINT_LIMIT - newCount;
    const isLastHint = newCount === DAILY_HINT_LIMIT;
    const today = new Date().toDateString();

    // Optimistic update
    setDailyHintCount(newCount);
    setIsLimitReached(newCount >= DAILY_HINT_LIMIT);

    // Persist to storage
    hintStorage.set({ date: today, count: newCount });

    return {
      newCount,
      remaining,
      isLastHint
    };
  }, [dailyHintCount]);

  // Memoized computed values
  const remainingHints = DAILY_HINT_LIMIT - dailyHintCount;

  return {
    dailyHintCount,
    isLimitReached,
    remainingHints,
    incrementHintCount,
    isInitialized,
    DAILY_HINT_LIMIT
  };
}

export type { HintResult };
