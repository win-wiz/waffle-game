'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import {
  BarChart3,
  Trophy,
  Target,
  Clock,
  Star,
  TrendingUp,
  Calendar,
  Download,
  RotateCcw,
  Award,
  Zap,
  Timer
} from 'lucide-react';
import { gameStatsManager, GameStatistics, GameResult, DailyStats } from '@/lib/statistics';
import { toast } from 'sonner';

interface StatisticsProps {
  trigger?: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
}

const Statistics: React.FC<StatisticsProps> = ({ trigger, isOpen: externalIsOpen, onClose }) => {
  const [statistics, setStatistics] = useState<GameStatistics | null>(null);
  const [gameHistory, setGameHistory] = useState<GameResult[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = externalIsOpen !== undefined ? (open: boolean) => {
    if (!open && onClose) {
      onClose();
    }
  } : setInternalIsOpen;
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | '7' | '30'>('all');

  // Load statistics when dialog opens
  useEffect(() => {
    if (isOpen) {
      loadStatistics();
    }
  }, [isOpen]);

  const loadStatistics = () => {
    const stats = gameStatsManager.getStatistics();
    const history = gameStatsManager.getGameHistory(50); // Last 50 games
    const daily = gameStatsManager.getDailyStats(30); // Last 30 days

    setStatistics(stats);
    setGameHistory(history);
    setDailyStats(daily);
  };

  const handleExportStats = () => {
    try {
      const exportData = gameStatsManager.exportStatistics();
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `waffle-statistics-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Statistics exported successfully!');
    } catch (error) {
      toast.error('Failed to export statistics');
    }
  };

  const handleResetStats = () => {
    gameStatsManager.resetStatistics();
    loadStatistics();
    toast.success('Statistics reset successfully!');
  };

  const formatTime = (seconds: number): string => {
    if (seconds === Infinity) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return 'Never';
    return new Date(dateStr).toLocaleDateString();
  };

  const getStreakEmoji = (streak: number): string => {
    if (streak >= 10) return '🔥';
    if (streak >= 5) return '⚡';
    if (streak >= 3) return '✨';
    return '🎯';
  };

  const getStarRating = (stars: number): string => {
    return '⭐'.repeat(Math.min(stars, 5)) + '☆'.repeat(Math.max(0, 5 - stars));
  };

  const getPeriodStats = () => {
    if (!statistics) return null;

    if (selectedPeriod === 'all') {
      return statistics;
    }

    const days = selectedPeriod === '7' ? 7 : 30;
    return gameStatsManager.getStatisticsForPeriod(days);
  };

  const periodStats = getPeriodStats();

  if (!statistics || !periodStats) {
    return null;
  }

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <BarChart3 className="w-4 h-4 mr-2" />
      Statistics
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        setIsOpen(open);
        if (onClose) {
          onClose();
        }
      } else {
        setIsOpen(open);
      }
    }}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-background border shadow-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Game Statistics
          </DialogTitle>
          <DialogDescription>
            Track your Waffle game performance and progress over time
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Period Selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Time Period:</span>
              <div className="flex gap-1">
                {(['all', '30', '7'] as const).map((period) => (
                  <Button
                    key={period}
                    variant={selectedPeriod === period ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedPeriod(period)}
                  >
                    {period === 'all' ? 'All Time' : `${period} Days`}
                  </Button>
                ))}
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">Games Played</span>
                  </div>
                  <div className="text-2xl font-bold">{periodStats.totalGames || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">Win Rate</span>
                  </div>
                  <div className="text-2xl font-bold">{(periodStats.winRate || 0).toFixed(1)}%</div>
                  <Progress value={periodStats.winRate || 0} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium">Current Streak</span>
                  </div>
                  <div className="text-2xl font-bold flex items-center gap-1">
                    {statistics.currentStreak}
                    <span className="text-lg">{getStreakEmoji(statistics.currentStreak)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">Total Stars</span>
                  </div>
                  <div className="text-2xl font-bold">{periodStats.totalStarsEarned || 0}</div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Best Streak</span>
                    <Badge variant="secondary">{statistics.maxStreak} games</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Fewest Moves</span>
                    <Badge variant="secondary">
                      {statistics.bestGame.fewestMoves === 15 ? 'N/A' : `${statistics.bestGame.fewestMoves} moves`}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Fastest Time</span>
                    <Badge variant="secondary">{formatTime(statistics.bestGame.fastestTime)}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Most Stars (Single Game)</span>
                    <Badge variant="secondary">{statistics.bestGame.mostStars} ⭐</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Averages
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Avg. Moves (Won)</span>
                    <Badge variant="outline">{(periodStats.averageMovesWon || 0).toFixed(1)}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Avg. Time (Won)</span>
                    <Badge variant="outline">{formatTime(periodStats.averageTimeWon || 0)}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Stars per Game</span>
                    <Badge variant="outline">
                      {periodStats.totalGames ? ((periodStats.totalStarsEarned || 0) / periodStats.totalGames).toFixed(1) : '0.0'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            {/* Move Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Moves Distribution</CardTitle>
                <CardDescription>How many moves you typically use to solve puzzles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(statistics.distributionByMoves)
                    .sort(([a], [b]) => parseInt(a) - parseInt(b))
                    .map(([moves, count]) => {
                      const percentage = (count / statistics.totalGames) * 100;
                      return (
                        <div key={moves} className="flex items-center gap-3">
                          <span className="w-12 text-base font-medium">{moves} moves</span>
                          <Progress value={percentage} className="flex-1" />
                          <span className="w-16 text-base font-medium text-right">{count} games</span>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>

            {/* Stars Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Stars Distribution</CardTitle>
                <CardDescription>Star ratings achieved in completed games</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(statistics.distributionByStars)
                    .sort(([a], [b]) => parseInt(b) - parseInt(a))
                    .map(([stars, count]) => {
                      const percentage = (count / statistics.totalGames) * 100;
                      return (
                        <div key={stars} className="flex items-center gap-3">
                          <span className="w-16 text-base">{getStarRating(parseInt(stars))}</span>
                          <Progress value={percentage} className="flex-1" />
                          <span className="w-16 text-base font-medium text-right">{count} games</span>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Games</CardTitle>
                <CardDescription>Your last 20 games</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {gameHistory.slice(0, 20).map((game, index) => (
                    <div key={game.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <span className="text-base font-medium text-foreground">#{gameHistory.length - index}</span>
                        <Badge variant={game.isWon ? 'default' : 'destructive'}>
                          {game.isWon ? 'Won' : 'Lost'}
                        </Badge>
                        <span className="text-base">{formatDate(game.date)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-base font-medium">{game.movesUsed}/{game.maxMoves} moves</span>
                        <span className="text-base font-medium">{formatTime(game.timeSpent)}</span>
                        {game.isWon && (
                          <span className="text-base">{getStarRating(game.starsEarned)}</span>
                        )}
                        <Badge variant="outline" className="text-sm">
                          {game.puzzleType}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Daily Activity</CardTitle>
                <CardDescription>Games played in the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {dailyStats.map((day) => (
                    <div key={day.date} className="flex items-center justify-between p-3 rounded border">
                      <span className="text-base font-medium">{formatDate(day.date)}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-base">{day.gamesPlayed} games</span>
                        <span className="text-base">{day.gamesWon} won</span>
                        <span className="text-base">{day.totalStars} ⭐</span>
                        <Badge variant="outline">
                          {day.gamesPlayed > 0 ? ((day.gamesWon / day.gamesPlayed) * 100).toFixed(0) : 0}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Playing Time Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Playing History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>First Game</span>
                  <Badge variant="outline">{formatDate(statistics.firstPlayedDate)}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Last Game</span>
                  <Badge variant="outline">{formatDate(statistics.lastPlayedDate)}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Days Playing</span>
                  <Badge variant="outline">
                    {statistics.firstPlayedDate && statistics.lastPlayedDate
                      ? Math.ceil(
                        (new Date(statistics.lastPlayedDate).getTime() -
                            new Date(statistics.firstPlayedDate).getTime()) /
                            (1000 * 60 * 60 * 24)
                      ) + 1
                      : 0} days
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExportStats}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset Statistics</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all your game statistics and history. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleResetStats} className="bg-destructive text-destructive-foreground">
                    Reset All Data
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <Button onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Preserve scroll position when closing via button
            const currentScrollY = window.scrollY;
            setIsOpen(false);
            if (onClose) onClose();
            // Restore scroll position after a brief delay to ensure dialog is closed
            setTimeout(() => {
              window.scrollTo(0, currentScrollY);
            }, 100);
          }}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Statistics;
