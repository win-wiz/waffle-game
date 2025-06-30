'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
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
  RotateCcw,
  Award,
  Zap,
  Timer
} from 'lucide-react';
import {
  gameStatsManager,
  GameStatistics,
  GameResult,
  DailyStats
} from '@/lib/statistics';
import { toast } from 'sonner';

interface StatisticsProps {
  trigger?: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
}

const Statistics: React.FC<StatisticsProps> = ({
  trigger,
  isOpen: externalIsOpen,
  onClose
}) => {
  const [statistics, setStatistics] = useState<GameStatistics | null>(null);
  const [gameHistory, setGameHistory] = useState<GameResult[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen =
    externalIsOpen !== undefined
      ? (open: boolean) => {
          if (!open && onClose) {
            onClose();
          }
        }
      : setInternalIsOpen;
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | '7' | '30'>(
    'all'
  );

  // Load statistics when dialog opens
  useEffect(() => {
    if (isOpen) {
      console.log('📊 Dialog opened, loading statistics...');
      loadStatistics();
    }
  }, [isOpen]);

  const loadStatistics = async () => {
    setIsLoading(true);
    try {
      const stats = gameStatsManager.getStatistics();
      const history = gameStatsManager.getGameHistory(50); // Last 50 games
      const daily = gameStatsManager.getDailyStats(30); // Last 30 days

      console.log('📊 Loading statistics:', {
        stats,
        history: history.length,
        daily: daily.length
      });

      setStatistics(stats);
      setGameHistory(history);
      setDailyStats(daily);
    } catch (error) {
      console.error('Failed to load statistics:', error);
      // 设置默认值以防止组件崩溃
      setStatistics({
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
      setGameHistory([]);
      setDailyStats([]);
    } finally {
      setIsLoading(false);
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
    <Button variant='outline' size='sm'>
      <BarChart3 className='w-4 h-4 mr-2' />
      Statistics
    </Button>
  );

  // 当通过外部控制 isOpen 时，不渲染 trigger
  const isExternallyControlled = externalIsOpen !== undefined;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={open => {
        if (!open) {
          // 记录当前滚动位置，防止对话框关闭时页面跳动
          const currentScrollY = window.scrollY;
          setIsOpen(open);
          if (onClose) {
            onClose();
          }
          // 恢复滚动位置
          setTimeout(() => {
            window.scrollTo(0, currentScrollY);
          }, 0);
        } else {
          setIsOpen(open);
        }
      }}
    >
      {!isExternallyControlled && (
        <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      )}
      <DialogContent className='max-w-5xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 border-0 shadow-2xl rounded-2xl z-50'>
        <DialogHeader className='text-center pb-6 border-b border-slate-200 dark:border-slate-700'>
          <DialogTitle className='flex items-center justify-center gap-3 text-2xl font-bold text-slate-800 dark:text-slate-100'>
            <div className='p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full'>
              <Trophy className='w-6 h-6 text-yellow-600 dark:text-yellow-400' />
            </div>
            Game Statistics
          </DialogTitle>
          <DialogDescription className='text-slate-600 dark:text-slate-400 text-base mt-2'>
            Track your Waffle game performance and progress over time
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className='flex items-center justify-center py-8'>
            <div className='text-center'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2'></div>
              <p className='text-sm text-slate-600'>Loading statistics...</p>
            </div>
          </div>
        ) : (
          <Tabs defaultValue='overview' className='w-full mt-6'>
            <TabsList className='grid w-full grid-cols-4 h-12 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200 dark:border-slate-600 rounded-xl p-1'>
              <TabsTrigger
                value='overview'
                className='text-sm font-medium rounded-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all'
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value='performance'
                className='text-sm font-medium rounded-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all'
              >
                Performance
              </TabsTrigger>
              <TabsTrigger
                value='history'
                className='text-sm font-medium rounded-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all'
              >
                History
              </TabsTrigger>
              <TabsTrigger
                value='trends'
                className='text-sm font-medium rounded-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all'
              >
                Trends
              </TabsTrigger>
            </TabsList>

            <TabsContent value='overview' className='space-y-6 pt-4'>
              {/* Period Selector */}
              <div className='flex items-center justify-between bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200 dark:border-slate-600'>
                <span className='text-base font-semibold text-slate-700 dark:text-slate-300'>
                  Time Period:
                </span>
                <div className='flex gap-2 bg-slate-100 dark:bg-slate-700 rounded-lg p-1'>
                  {(['all', '30', '7'] as const).map(period => (
                    <Button
                      key={period}
                      variant='ghost'
                      size='sm'
                      className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
                        selectedPeriod === period
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-600'
                      }`}
                      onClick={() => setSelectedPeriod(period)}
                    >
                      {period === 'all' ? 'All Time' : `${period} Days`}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Key Metrics */}
              <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
                <Card className='bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200 dark:border-slate-600 shadow-lg hover:shadow-xl transition-all hover:scale-105'>
                  <CardContent className='p-6'>
                    <div className='flex items-center gap-3 mb-3'>
                      <div className='p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg'>
                        <Target className='w-5 h-5 text-blue-600 dark:text-blue-400' />
                      </div>
                      <span className='text-sm font-semibold text-slate-700 dark:text-slate-300'>
                        Games Played
                      </span>
                    </div>
                    <div className='text-3xl font-bold text-slate-900 dark:text-slate-100'>
                      {periodStats.totalGames || 0}
                    </div>
                  </CardContent>
                </Card>

                <Card className='bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200 dark:border-slate-600 shadow-lg hover:shadow-xl transition-all hover:scale-105'>
                  <CardContent className='p-6'>
                    <div className='flex items-center gap-3 mb-3'>
                      <div className='p-2 bg-green-100 dark:bg-green-900/30 rounded-lg'>
                        <Trophy className='w-5 h-5 text-green-600 dark:text-green-400' />
                      </div>
                      <span className='text-sm font-semibold text-slate-700 dark:text-slate-300'>
                        Win Rate
                      </span>
                    </div>
                    <div className='text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2'>
                      {(periodStats.winRate || 0).toFixed(1)}%
                    </div>
                    <Progress
                      value={periodStats.winRate || 0}
                      className='h-2 bg-slate-200 dark:bg-slate-700'
                    />
                  </CardContent>
                </Card>

                <Card className='bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200 dark:border-slate-600 shadow-lg hover:shadow-xl transition-all hover:scale-105'>
                  <CardContent className='p-6'>
                    <div className='flex items-center gap-3 mb-3'>
                      <div className='p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg'>
                        <Zap className='w-5 h-5 text-orange-600 dark:text-orange-400' />
                      </div>
                      <span className='text-sm font-semibold text-slate-700 dark:text-slate-300'>
                        Current Streak
                      </span>
                    </div>
                    <div className='text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2'>
                      {statistics.currentStreak}
                      <span className='text-2xl'>
                        {getStreakEmoji(statistics.currentStreak)}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className='bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200 dark:border-slate-600 shadow-lg hover:shadow-xl transition-all hover:scale-105'>
                  <CardContent className='p-6'>
                    <div className='flex items-center gap-3 mb-3'>
                      <div className='p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg'>
                        <Star className='w-5 h-5 text-yellow-600 dark:text-yellow-400' />
                      </div>
                      <span className='text-sm font-semibold text-slate-700 dark:text-slate-300'>
                        Total Stars
                      </span>
                    </div>
                    <div className='text-3xl font-bold text-slate-900 dark:text-slate-100'>
                      {periodStats.totalStarsEarned || 0}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Stats */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <Card>
                  <CardHeader>
                    <CardTitle className='text-lg flex items-center gap-2'>
                      <Award className='w-4 h-4' />
                      Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-3'>
                    <div className='flex justify-between items-center'>
                      <span>Best Streak</span>
                      <Badge variant='secondary'>
                        {statistics.maxStreak} games
                      </Badge>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span>Fewest Moves</span>
                      <Badge variant='secondary'>
                        {statistics.bestGame.fewestMoves === 15
                          ? 'N/A'
                          : `${statistics.bestGame.fewestMoves} moves`}
                      </Badge>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span>Fastest Time</span>
                      <Badge variant='secondary'>
                        {formatTime(statistics.bestGame.fastestTime)}
                      </Badge>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span>Most Stars (Single Game)</span>
                      <Badge variant='secondary'>
                        {statistics.bestGame.mostStars} ⭐
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className='text-lg flex items-center gap-2'>
                      <TrendingUp className='w-4 h-4' />
                      Averages
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-3'>
                    <div className='flex justify-between items-center'>
                      <span>Avg. Moves (Won)</span>
                      <Badge variant='outline'>
                        {(periodStats.averageMovesWon || 0).toFixed(1)}
                      </Badge>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span>Avg. Time (Won)</span>
                      <Badge variant='outline'>
                        {formatTime(periodStats.averageTimeWon || 0)}
                      </Badge>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span>Stars per Game</span>
                      <Badge variant='outline'>
                        {periodStats.totalGames
                          ? (
                              (periodStats.totalStarsEarned || 0) /
                              periodStats.totalGames
                            ).toFixed(1)
                          : '0.0'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value='performance' className='space-y-4'>
              {/* Move Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className='text-lg'>Moves Distribution</CardTitle>
                  <CardDescription>
                    How many moves you typically use to solve puzzles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2'>
                    {Object.entries(statistics.distributionByMoves)
                      .sort(([a], [b]) => parseInt(a) - parseInt(b))
                      .map(([moves, count]) => {
                        const percentage =
                          (count / statistics.totalGames) * 100;
                        return (
                          <div key={moves} className='flex items-center gap-3'>
                            <span className='w-12 text-base font-medium'>
                              {moves} moves
                            </span>
                            <Progress value={percentage} className='flex-1' />
                            <span className='w-16 text-base font-medium text-right'>
                              {count} games
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>

              {/* Stars Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className='text-lg'>Stars Distribution</CardTitle>
                  <CardDescription>
                    Star ratings achieved in completed games
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2'>
                    {Object.entries(statistics.distributionByStars)
                      .sort(([a], [b]) => parseInt(b) - parseInt(a))
                      .map(([stars, count]) => {
                        const percentage =
                          (count / statistics.totalGames) * 100;
                        return (
                          <div key={stars} className='flex items-center gap-3'>
                            <span className='w-16 text-base'>
                              {getStarRating(parseInt(stars))}
                            </span>
                            <Progress value={percentage} className='flex-1' />
                            <span className='w-16 text-base font-medium text-right'>
                              {count} games
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='history' className='space-y-4'>
              <Card>
                <CardHeader>
                  <CardTitle className='text-lg'>Recent Games</CardTitle>
                  <CardDescription>Your last 20 games</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2 max-h-96 overflow-y-auto'>
                    {gameHistory.slice(0, 20).map((game, index) => (
                      <div
                        key={game.id}
                        className='flex items-center justify-between p-3 rounded-lg border'
                      >
                        <div className='flex items-center gap-3'>
                          <span className='text-base font-medium text-foreground'>
                            #{gameHistory.length - index}
                          </span>
                          <Badge
                            variant={game.isWon ? 'default' : 'destructive'}
                          >
                            {game.isWon ? 'Won' : 'Lost'}
                          </Badge>
                          <span className='text-base'>
                            {formatDate(game.date)}
                          </span>
                        </div>
                        <div className='flex items-center gap-3'>
                          <span className='text-base font-medium'>
                            {game.movesUsed}/{game.maxMoves} moves
                          </span>
                          <span className='text-base font-medium'>
                            {formatTime(game.timeSpent)}
                          </span>
                          {game.isWon && (
                            <span className='text-base'>
                              {getStarRating(game.starsEarned)}
                            </span>
                          )}
                          <Badge variant='outline' className='text-sm'>
                            {game.puzzleType}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='trends' className='space-y-4'>
              <Card>
                <CardHeader>
                  <CardTitle className='text-lg'>Daily Activity</CardTitle>
                  <CardDescription>
                    Games played in the last 30 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2 max-h-96 overflow-y-auto'>
                    {dailyStats.map(day => (
                      <div
                        key={day.date}
                        className='flex items-center justify-between p-3 rounded border'
                      >
                        <span className='text-base font-medium'>
                          {formatDate(day.date)}
                        </span>
                        <div className='flex items-center gap-4'>
                          <span className='text-base'>
                            {day.gamesPlayed} games
                          </span>
                          <span className='text-base'>{day.gamesWon} won</span>
                          <span className='text-base'>{day.totalStars} ⭐</span>
                          <Badge variant='outline'>
                            {day.gamesPlayed > 0
                              ? (
                                  (day.gamesWon / day.gamesPlayed) *
                                  100
                                ).toFixed(0)
                              : 0}
                            %
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
                  <CardTitle className='text-lg flex items-center gap-2'>
                    <Calendar className='w-4 h-4' />
                    Playing History
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <div className='flex justify-between items-center'>
                    <span>First Game</span>
                    <Badge variant='outline'>
                      {formatDate(statistics.firstPlayedDate)}
                    </Badge>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span>Last Game</span>
                    <Badge variant='outline'>
                      {formatDate(statistics.lastPlayedDate)}
                    </Badge>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span>Days Playing</span>
                    <Badge variant='outline'>
                      {statistics.firstPlayedDate && statistics.lastPlayedDate
                        ? Math.ceil(
                            (new Date(statistics.lastPlayedDate).getTime() -
                              new Date(statistics.firstPlayedDate).getTime()) /
                              (1000 * 60 * 60 * 24)
                          ) + 1
                        : 0}{' '}
                      days
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        <DialogFooter className='flex justify-between items-center pt-6 border-t border-slate-200 dark:border-slate-700'>
          <div className='flex gap-3'>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  className='bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:border-red-300 dark:hover:border-red-700 transition-all'
                >
                  <RotateCcw className='w-4 h-4 mr-2' />
                  Reset
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className='bg-white dark:bg-slate-900 border shadow-lg'>
                <AlertDialogHeader>
                  <AlertDialogTitle className='text-slate-900 dark:text-slate-100 text-lg font-semibold'>
                    Reset Statistics
                  </AlertDialogTitle>
                  <AlertDialogDescription className='text-slate-700 dark:text-slate-300 text-base'>
                    This will permanently delete all your game statistics and
                    history. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className='gap-2'>
                  <AlertDialogCancel className='bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleResetStats}
                    className='bg-red-600 hover:bg-red-700 text-white'
                  >
                    Reset All Data
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <Button
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              // 统一使用 onOpenChange 逻辑来关闭对话框，避免重复的滚动处理
              if (isExternallyControlled && onClose) {
                onClose();
              } else {
                setInternalIsOpen(false);
              }
            }}
            className='bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all font-medium'
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Statistics;
