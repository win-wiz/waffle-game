'use client';

import { useEffect, useRef, useCallback } from 'react';
import { gameStatsManager } from '@/lib/statistics';

interface UseGameStatisticsProps {
  gameStatus: 'playing' | 'won' | 'lost';
  moveCount: number;
  maxMoves: number;
  puzzleType?: 'random' | 'classic' | 'ai-generated';
  onGameStart?: () => void;
  onGameEnd?: (result: { isWon: boolean; movesUsed: number; timeSpent: number; starsEarned: number }) => void;
}

interface GameStatisticsHook {
  startTime: number | null;
  elapsedTime: number;
  startGame: () => void;
  endGame: () => void;
  recordGameResult: () => void;
}

export function useGameStatistics({
  gameStatus,
  moveCount,
  maxMoves,
  puzzleType = 'random',
  onGameStart,
  onGameEnd
}: UseGameStatisticsProps): GameStatisticsHook {
  const startTimeRef = useRef<number | null>(null);
  const elapsedTimeRef = useRef<number>(0);
  const gameRecordedRef = useRef<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start game timer
  const startGame = useCallback(() => {
    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now();
      gameRecordedRef.current = false;
      elapsedTimeRef.current = 0;

      // Start interval to update elapsed time
      intervalRef.current = setInterval(() => {
        if (startTimeRef.current) {
          elapsedTimeRef.current = Math.floor((Date.now() - startTimeRef.current) / 1000);
        }
      }, 1000);

      onGameStart?.();
      console.log('🎮 Game timer started');
    }
  }, [onGameStart]);

  // End game timer
  const endGame = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (startTimeRef.current) {
      elapsedTimeRef.current = Math.floor((Date.now() - startTimeRef.current) / 1000);
      console.log(`⏱️ Game ended, total time: ${elapsedTimeRef.current}s`);
    }
  }, []);

  // Record game result to statistics
  const recordGameResult = useCallback(() => {
    if (gameRecordedRef.current || !startTimeRef.current) {
      return; // Already recorded or game not started
    }

    const isWon = gameStatus === 'won';
    const isLost = gameStatus === 'lost';

    if (!isWon && !isLost) {
      return; // Game still in progress
    }

    const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const starsEarned = isWon ? Math.max(0, maxMoves - moveCount) : 0;

    try {
      gameStatsManager.recordGame({
        isWon,
        movesUsed: moveCount,
        maxMoves,
        timeSpent,
        puzzleType
      });

      gameRecordedRef.current = true;

      const result = {
        isWon,
        movesUsed: moveCount,
        timeSpent,
        starsEarned
      };

      onGameEnd?.(result);

      console.log('📊 Game result recorded:', result);
    } catch (error) {
      console.error('Failed to record game result:', error);
    }
  }, [gameStatus, moveCount, maxMoves, puzzleType, onGameEnd]);

  // Auto-start game when component mounts and game is in playing state
  useEffect(() => {
    if (gameStatus === 'playing' && startTimeRef.current === null) {
      startGame();
    }
  }, [gameStatus, startGame]);

  // Auto-end game and record result when game status changes to won/lost
  useEffect(() => {
    if ((gameStatus === 'won' || gameStatus === 'lost') && !gameRecordedRef.current) {
      endGame();
      recordGameResult();
    }
  }, [gameStatus, endGame, recordGameResult]);

  // Reset when game restarts (moveCount goes back to 0)
  useEffect(() => {
    if (moveCount === 0 && gameStatus === 'playing' && gameRecordedRef.current) {
      // Game has been reset, start new tracking
      startTimeRef.current = null;
      gameRecordedRef.current = false;
      elapsedTimeRef.current = 0;
      startGame();
    }
  }, [moveCount, gameStatus, startGame]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    startTime: startTimeRef.current,
    elapsedTime: elapsedTimeRef.current,
    startGame,
    endGame,
    recordGameResult
  };
}

// Helper hook for formatting elapsed time
export function useFormattedTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Helper hook for getting current statistics
export function useCurrentStatistics() {
  const getStats = useCallback(() => {
    return gameStatsManager.getStatistics();
  }, []);

  const getRecentGames = useCallback((limit: number = 10) => {
    return gameStatsManager.getGameHistory(limit);
  }, []);

  const getDailyStats = useCallback((days: number = 7) => {
    return gameStatsManager.getDailyStats(days);
  }, []);

  return {
    getStats,
    getRecentGames,
    getDailyStats
  };
}
