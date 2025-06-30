// Game Statistics Management
// Tracks player performance and game history for Waffle game

export interface GameResult {
  id: string;
  date: string;
  isWon: boolean;
  movesUsed: number;
  maxMoves: number;
  starsEarned: number; // Stars = maxMoves - movesUsed (if won)
  timeSpent: number; // in seconds
  puzzleType: 'random' | 'classic' | 'ai-generated';
  difficulty?: string;
}

export interface GameStatistics {
  totalGames: number;
  gamesWon: number;
  gamesLost: number;
  winRate: number; // percentage
  currentStreak: number;
  maxStreak: number;
  averageMovesWon: number;
  averageTimeWon: number; // in seconds
  totalStarsEarned: number;
  bestGame: {
    fewestMoves: number;
    fastestTime: number;
    mostStars: number;
  };
  distributionByMoves: { [moves: number]: number }; // moves -> count
  distributionByStars: { [stars: number]: number }; // stars -> count
  lastPlayedDate: string;
  firstPlayedDate: string;
}

export interface DailyStats {
  date: string;
  gamesPlayed: number;
  gamesWon: number;
  totalStars: number;
}

const STATISTICS_STORAGE_KEY = 'waffleGameStatistics';
const GAME_HISTORY_STORAGE_KEY = 'waffleGameHistory';
const DAILY_STATS_STORAGE_KEY = 'waffleDailyStats';

// Default statistics object
const createDefaultStatistics = (): GameStatistics => ({
  totalGames: 0,
  gamesWon: 0,
  gamesLost: 0,
  winRate: 0,
  currentStreak: 0,
  maxStreak: 0,
  averageMovesWon: 0,
  averageTimeWon: 0,
  totalStarsEarned: 0,
  bestGame: {
    fewestMoves: 15,
    fastestTime: Infinity,
    mostStars: 0
  },
  distributionByMoves: {},
  distributionByStars: {},
  lastPlayedDate: '',
  firstPlayedDate: ''
});

// Calculate stars earned based on moves used
export const calculateStars = (
  movesUsed: number,
  maxMoves: number,
  isWon: boolean
): number => {
  if (!isWon) return 0;
  return Math.max(0, maxMoves - movesUsed);
};

// Get current date in YYYY-MM-DD format
const getCurrentDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

// Storage utilities with error handling
const safeGetFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const safeSetToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Handle storage errors gracefully
    console.warn(`Failed to save data to localStorage for key: ${key}`);
  }
};

// Statistics management class
export class GameStatisticsManager {
  private statistics: GameStatistics;
  private gameHistory: GameResult[];
  private dailyStats: DailyStats[];

  constructor() {
    this.statistics = safeGetFromStorage(
      STATISTICS_STORAGE_KEY,
      createDefaultStatistics()
    );
    this.gameHistory = safeGetFromStorage(GAME_HISTORY_STORAGE_KEY, []);
    this.dailyStats = safeGetFromStorage(DAILY_STATS_STORAGE_KEY, []);
  }

  // Record a new game result
  recordGame(result: Omit<GameResult, 'id' | 'date' | 'starsEarned'>): void {
    const gameResult: GameResult = {
      ...result,
      id: `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      date: getCurrentDate(),
      starsEarned: calculateStars(
        result.movesUsed,
        result.maxMoves,
        result.isWon
      )
    };

    // Add to history
    this.gameHistory.push(gameResult);

    // Keep only last 1000 games to prevent storage bloat
    if (this.gameHistory.length > 1000) {
      this.gameHistory = this.gameHistory.slice(-1000);
    }

    // Update statistics
    this.updateStatistics(gameResult);

    // Update daily stats
    this.updateDailyStats(gameResult);

    // Save to storage
    this.saveToStorage();
  }

  // Update statistics based on game result
  private updateStatistics(result: GameResult): void {
    const stats = this.statistics;
    const currentDate = getCurrentDate();

    // Basic counts
    stats.totalGames++;
    if (result.isWon) {
      stats.gamesWon++;
    } else {
      stats.gamesLost++;
    }

    // Win rate
    stats.winRate = (stats.gamesWon / stats.totalGames) * 100;

    // Streak tracking
    if (result.isWon) {
      stats.currentStreak++;
      stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
    } else {
      stats.currentStreak = 0;
    }

    // Averages (only for won games)
    if (result.isWon) {
      const wonGames = this.gameHistory.filter(g => g.isWon);
      stats.averageMovesWon =
        wonGames.reduce((sum, g) => sum + g.movesUsed, 0) / wonGames.length;
      stats.averageTimeWon =
        wonGames.reduce((sum, g) => sum + g.timeSpent, 0) / wonGames.length;
    }

    // Stars
    stats.totalStarsEarned += result.starsEarned;

    // Best game records
    if (result.isWon) {
      stats.bestGame.fewestMoves = Math.min(
        stats.bestGame.fewestMoves,
        result.movesUsed
      );
      stats.bestGame.fastestTime = Math.min(
        stats.bestGame.fastestTime,
        result.timeSpent
      );
      stats.bestGame.mostStars = Math.max(
        stats.bestGame.mostStars,
        result.starsEarned
      );
    }

    // Distributions
    stats.distributionByMoves[result.movesUsed] =
      (stats.distributionByMoves[result.movesUsed] || 0) + 1;
    stats.distributionByStars[result.starsEarned] =
      (stats.distributionByStars[result.starsEarned] || 0) + 1;

    // Dates
    stats.lastPlayedDate = currentDate;
    if (!stats.firstPlayedDate) {
      stats.firstPlayedDate = currentDate;
    }
  }

  // Update daily statistics
  private updateDailyStats(result: GameResult): void {
    const today = getCurrentDate();
    let todayStats = this.dailyStats.find(d => d.date === today);

    if (!todayStats) {
      todayStats = {
        date: today,
        gamesPlayed: 0,
        gamesWon: 0,
        totalStars: 0
      };
      this.dailyStats.push(todayStats);
    }

    todayStats.gamesPlayed++;
    if (result.isWon) {
      todayStats.gamesWon++;
    }
    todayStats.totalStars += result.starsEarned;

    // Keep only last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    this.dailyStats = this.dailyStats.filter(
      d => new Date(d.date) >= thirtyDaysAgo
    );
  }

  // Save all data to storage
  private saveToStorage(): void {
    safeSetToStorage(STATISTICS_STORAGE_KEY, this.statistics);
    safeSetToStorage(GAME_HISTORY_STORAGE_KEY, this.gameHistory);
    safeSetToStorage(DAILY_STATS_STORAGE_KEY, this.dailyStats);
  }

  // Get current statistics
  getStatistics(): GameStatistics {
    return { ...this.statistics };
  }

  // Get game history
  getGameHistory(limit?: number): GameResult[] {
    const history = [...this.gameHistory].reverse(); // Most recent first
    return limit ? history.slice(0, limit) : history;
  }

  // Get daily statistics
  getDailyStats(days?: number): DailyStats[] {
    const stats = [...this.dailyStats].reverse(); // Most recent first
    return days ? stats.slice(0, days) : stats;
  }

  // Get statistics for a specific time period
  getStatisticsForPeriod(days: number): Partial<GameStatistics> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const periodGames = this.gameHistory.filter(
      g => new Date(g.date) >= cutoffDate
    );

    if (periodGames.length === 0) {
      return {
        totalGames: 0,
        gamesWon: 0,
        gamesLost: 0,
        winRate: 0
      };
    }

    const gamesWon = periodGames.filter(g => g.isWon).length;
    const gamesLost = periodGames.length - gamesWon;

    return {
      totalGames: periodGames.length,
      gamesWon,
      gamesLost,
      winRate: (gamesWon / periodGames.length) * 100,
      totalStarsEarned: periodGames.reduce((sum, g) => sum + g.starsEarned, 0),
      averageMovesWon:
        gamesWon > 0
          ? periodGames
              .filter(g => g.isWon)
              .reduce((sum, g) => sum + g.movesUsed, 0) / gamesWon
          : 0
    };
  }

  // Reset all statistics (with confirmation)
  resetStatistics(): void {
    this.statistics = createDefaultStatistics();
    this.gameHistory = [];
    this.dailyStats = [];
    this.saveToStorage();
  }

  // Export statistics as JSON
  exportStatistics(): string {
    return JSON.stringify(
      {
        statistics: this.statistics,
        gameHistory: this.gameHistory,
        dailyStats: this.dailyStats,
        exportDate: new Date().toISOString()
      },
      null,
      2
    );
  }
}

// Singleton instance
export const gameStatsManager = new GameStatisticsManager();
