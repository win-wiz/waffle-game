import { SquareNumber, Letter, Swap, SerializedSolution } from '@/types';
// 深度比较两个对象是否相等
function isEqual<T>(a: T, b: T): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

interface SquareLookupEntry {
  start: Letter;
  end: Letter;
  square: SquareNumber;
}

/**
 * 计算从起始状态到目标状态所需的交换序列
 * 使用循环分解算法最小化交换次数
 */
export function findSwaps(
  start: SerializedSolution,
  end: SerializedSolution
): Swap[] {
  if (start === end) return [];

  const startToTargetMap = buildMapFromStartToTarget(start, end);
  const remainingSquareNumbers = new Set<SquareNumber>();

  // 初始化剩余方格集合
  for (let i = 0; i < start.length; i++) {
    remainingSquareNumbers.add(i as SquareNumber);
  }

  const swaps: Swap[] = [];

  // 处理每个循环组
  while (remainingSquareNumbers.size > 0) {
    const firstSquare = Array.from(remainingSquareNumbers)[0]!;
    const currentGroup = buildInitialGroup(startToTargetMap, firstSquare);

    // 从剩余集合中移除当前组的所有方格
    for (const square of currentGroup) {
      remainingSquareNumbers.delete(square);
    }

    // 构建查找表
    const lookupForGroup: SquareLookupEntry[] = [];
    for (const square of currentGroup) {
      lookupForGroup.push({
        square,
        start: start[square] as Letter,
        end: end[square] as Letter
      });
    }

    // 进一step化分组以优化交换序列
    const dividedGroups = divideGroupFurther(lookupForGroup);

    for (const subGroup of dividedGroups) {
      if (subGroup.size <= 1) continue;

      const squareNumbers = Array.from(subGroup)
        .map(entry => entry.square)
        .sort((a, b) => a - b); // 排序确保一致性

      // 生成最小交换序列
      for (let i = 0; i < squareNumbers.length - 1; i++) {
        const swap: Swap = [squareNumbers[i], squareNumbers[i + 1]];
        swaps.push(swap);
      }
    }
  }

  return swaps;
}

/**
 * 构建从起始位置到目标位置的映射
 */
function buildMapFromStartToTarget(
  start: SerializedSolution,
  end: SerializedSolution
): Map<SquareNumber, SquareNumber> {
  const availableTargets = new Set<SquareNumber>();
  const mapping = new Map<SquareNumber, SquareNumber>();

  // 初始化可用目标位置
  for (let i = 0; i < start.length; i++) {
    availableTargets.add(i as SquareNumber);
  }

  // 首先处理已经正确的位置
  for (let i = 0; i < start.length; i++) {
    if (start[i] === end[i]) {
      availableTargets.delete(i as SquareNumber);
      mapping.set(i as SquareNumber, i as SquareNumber);
    }
  }

  // 为需要移动的字母找到目标位置
  for (let i = 0; i < start.length; i++) {
    if (mapping.has(i as SquareNumber)) continue;

    const sourceChar = start[i];

    // 寻找目标位置
    for (let j = 0; j < end.length; j++) {
      if (!availableTargets.has(j as SquareNumber)) continue;
      if (sourceChar !== end[j]) continue;

      mapping.set(i as SquareNumber, j as SquareNumber);
      availableTargets.delete(j as SquareNumber);
      break;
    }
  }

  return mapping;
}

/**
 * 构建交换循环组
 */
function buildInitialGroup(
  mapping: Map<SquareNumber, SquareNumber>,
  startSquare: SquareNumber
): Set<SquareNumber> {
  const group = new Set<SquareNumber>();
  let current = startSquare;

  // 跟踪循环直到回到起始点
  while (!group.has(current)) {
    group.add(current);
    current = mapping.get(current) ?? current;
  }

  return group;
}

/**
 * 进一步细分组以优化交换序列
 */
function divideGroupFurther(
  squareLookup: SquareLookupEntry[]
): Set<Set<SquareLookupEntry>> {
  const groups = new Set<Set<SquareLookupEntry>>();
  let remainingEntries = [...squareLookup];

  while (remainingEntries.length > 0) {
    const currentGroup = new Set<SquareLookupEntry>();
    const processedLetters = new Set<Letter>();
    let currentEntry = remainingEntries[0]!;

    // ハンドル自循环（起始和目标相同）
    if (currentEntry.start === currentEntry.end) {
      currentGroup.add(currentEntry);
      remainingEntries = remainingEntries.filter(entry => !isEqual(entry, currentEntry));
      groups.add(currentGroup);
      continue;
    }

    // 构建字母链
    while (!processedLetters.has(currentEntry.end)) {
      processedLetters.add(currentEntry.start);
      currentGroup.add(currentEntry);

      // 寻找下一个条目
      const nextCandidates = remainingEntries.filter(
        entry => entry.start === currentEntry.end && entry.start !== entry.end
      );

      let nextEntry: SquareLookupEntry | null = null;

      // 检查是否有回环
      for (const candidate of nextCandidates) {
        if (processedLetters.has(candidate.end)) {
          nextEntry = candidate;
          break;
        }
      }

      if (nextEntry) {
        currentGroup.add(nextEntry);
        break;
      } else if (nextCandidates.length > 0) {
        processedLetters.add(currentEntry.end);
        currentEntry = nextCandidates[0]!;
      } else {
        // 无法继续，使用原始分组
        return new Set([new Set(squareLookup)]);
      }
    }

    // 移除已处理的条目
    for (const entry of currentGroup) {
      remainingEntries = remainingEntries.filter(e => !isEqual(e, entry));
    }

    groups.add(currentGroup);
  }

  return groups;
}

/**
 * 应用单个交换到字符串
 */
export function applySwap(
  solution: SerializedSolution,
  swap: Swap
): SerializedSolution {
  const chars = solution.split('');
  const [pos1, pos2] = swap;

  // 交换字符
  const temp = chars[pos1];
  chars[pos1] = chars[pos2];
  chars[pos2] = temp;

  return chars.join('');
}

/**
 * 应用交换序列
 */
export function applySwaps(
  solution: SerializedSolution,
  swaps: Swap[]
): SerializedSolution {
  return swaps.reduce((current, swap) => applySwap(current, swap), solution);
}

/**
 * 验证交换序列是否正确
 */
export function validateSwaps(
  start: SerializedSolution,
  end: SerializedSolution,
  swaps: Swap[]
): boolean {
  const result = applySwaps(start, swaps);
  return result === end;
}

/**
 * 优化交换序列（移除冗余交换）
 */
export function optimizeSwaps(swaps: Swap[]): Swap[] {
  const optimized: Swap[] = [];
  const swapCounts = new Map<string, number>();

  for (const swap of swaps) {
    const key = `${Math.min(swap[0], swap[1])}-${Math.max(swap[0], swap[1])}`;
    const count = swapCounts.get(key) || 0;
    swapCounts.set(key, count + 1);
  }

  for (const [key, count] of swapCounts) {
    if (count % 2 === 1) { // 只保留奇数次交换
      const [pos1, pos2] = key.split('-').map(Number);
      optimized.push([pos1 as SquareNumber, pos2 as SquareNumber]);
    }
  }

  return optimized;
}
