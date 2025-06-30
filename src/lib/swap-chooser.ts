import { SerializedSolution, Swap, SquareNumber } from '@/types';
import { findSwaps, applySwap } from './swaps';

/**
 * 在多个可能解决方案中选择最优的下一步交换
 * 使用平均剩余步数最少的策略
 */
export function findBestSwap(
  start: SerializedSolution,
  possibleEndings: Iterable<SerializedSolution>
): Swap {
  const endingsArray = Array.from(possibleEndings);

  if (endingsArray.length === 0) {
    throw new Error('No possible endings provided');
  }

  if (endingsArray.length === 1) {
    // 只有一个解决方案，直接返回第一个交换
    const swaps = findSwaps(start, endingsArray[0]);
    return swaps[0] || [0, 1]; // 如果没有交换需要，返回默认值
  }

  const swapScores = new Map<string, number>();
  const boardLength = start.length;

  // 评估所有可能的交换
  for (let from = 0; from < boardLength; from++) {
    for (let to = from + 1; to < boardLength; to++) {
      const swap: Swap = [from as SquareNumber, to as SquareNumber];
      const startWithSwap = applySwap(start, swap);

      let totalRemainingSwaps = 0;

      for (const ending of endingsArray) {
        const remainingSwaps = findSwaps(startWithSwap, ending);
        totalRemainingSwaps += remainingSwaps.length;
      }

      const averageRemaining = totalRemainingSwaps / endingsArray.length;
      const swapKey = `${from}-${to}`;
      swapScores.set(swapKey, averageRemaining);
    }
  }

  // 找到最小平均剩余步数的交换
  let bestSwap: Swap = [0, 1];
  let minScore = Infinity;

  for (const [swapKey, score] of swapScores) {
    if (score < minScore) {
      minScore = score;
      const [from, to] = swapKey.split('-').map(Number);
      bestSwap = [from as SquareNumber, to as SquareNumber];
    }
  }

  return bestSwap;
}

/**
 * 计算交换的评分（越小越好）
 */
export function calculateSwapScore(
  start: SerializedSolution,
  swap: Swap,
  possibleEndings: SerializedSolution[]
): number {
  const startWithSwap = applySwap(start, swap);
  let totalRemainingSwaps = 0;

  for (const ending of possibleEndings) {
    const remainingSwaps = findSwaps(startWithSwap, ending);
    totalRemainingSwaps += remainingSwaps.length;
  }

  return totalRemainingSwaps / possibleEndings.length;
}
