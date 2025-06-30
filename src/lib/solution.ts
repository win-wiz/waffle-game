import {
  Board,
  Direction,
  Order,
  Tile,
  Letter,
  Solution,
  SerializedSolution,
  LetterCount,
  LetterCountConstraintChecker
} from '@/types';
import { ALL_WORD_LOCATIONS, wordFromWordLocation } from './board';
import { searchWord } from './words';

/**
 * 从解决方案生成游戏板
 */
function boardFromSolution(solution: Solution): Board<Letter> {
  const acrossWords = solution.get(Direction.Across)!;
  const downWords = solution.get(Direction.Down)!;

  return [
    acrossWords.get(Order.First)![0] as Letter, // 0
    acrossWords.get(Order.First)![1] as Letter, // 1
    acrossWords.get(Order.First)![2] as Letter, // 2
    acrossWords.get(Order.First)![3] as Letter, // 3
    acrossWords.get(Order.First)![4] as Letter, // 4
    downWords.get(Order.First)![1] as Letter, // 5
    downWords.get(Order.Mid)![1] as Letter, // 6
    downWords.get(Order.Last)![1] as Letter, // 7
    acrossWords.get(Order.Mid)![0] as Letter, // 8
    acrossWords.get(Order.Mid)![1] as Letter, // 9
    acrossWords.get(Order.Mid)![2] as Letter, // 10
    acrossWords.get(Order.Mid)![3] as Letter, // 11
    acrossWords.get(Order.Mid)![4] as Letter, // 12
    downWords.get(Order.First)![3] as Letter, // 13
    downWords.get(Order.Mid)![3] as Letter, // 14
    downWords.get(Order.Last)![3] as Letter, // 15
    acrossWords.get(Order.Last)![0] as Letter, // 16
    acrossWords.get(Order.Last)![1] as Letter, // 17
    acrossWords.get(Order.Last)![2] as Letter, // 18
    acrossWords.get(Order.Last)![3] as Letter, // 19
    acrossWords.get(Order.Last)![4] as Letter // 20
  ];
}

/**
 * 渲染解决方案为可读格式
 */
export function renderSolution(solution: SerializedSolution): string {
  return [
    solution.slice(0, 5),
    `${solution[5]} ${solution[6]} ${solution[7]}`,
    solution.slice(8, 13),
    `${solution[13]} ${solution[14]} ${solution[15]}`,
    solution.slice(16)
  ].join('\n');
}

/**
 * 序列化解决方案
 */
export function serialize(solution: Solution): SerializedSolution {
  return boardFromSolution(solution).join('');
}

/**
 * 初始化字母计数约束检查器
 */
function initialLetterCountChecker(
  board: Board<Tile>
): LetterCountConstraintChecker {
  const counts: LetterCount = {};

  // 统计每个字母的出现次数
  for (const tile of board) {
    counts[tile.letter] = (counts[tile.letter] || 0) + 1;
  }

  // 创建约束检查器
  const checker: LetterCountConstraintChecker = {};
  for (const [letter, count] of Object.entries(counts)) {
    checker[letter as Letter] = { max: count, current: 0 };
  }

  return checker;
}

/**
 * 检查并更新字母计数约束
 */
function updatedLetterCountConstraintIfValid(
  current: LetterCountConstraintChecker,
  word: string
): LetterCountConstraintChecker | null {
  // 深拷贝当前约束
  const updated: LetterCountConstraintChecker = {};
  for (const [letter, constraint] of Object.entries(current)) {
    if (constraint) {
      updated[letter as Letter] = { ...constraint };
    }
  }

  // 检查每个字母
  for (const letter of word) {
    const letterKey = letter as Letter;
    const constraint = updated[letterKey];

    if (!constraint || constraint.current >= constraint.max) {
      return null; // 约束违反
    }

    constraint.current += 1;
  }

  return updated;
}

/**
 * 验证单词间的交叉点约束
 */
function validateIntersections(
  topAcross: string,
  midAcross: string,
  botAcross: string,
  leftDown: string,
  midDown: string,
  rightDown: string
): boolean {
  return (
    leftDown[0] === topAcross[0] && // 位置0
    leftDown[2] === midAcross[0] && // 位置8
    leftDown[4] === botAcross[0] && // 位置16
    midDown[0] === topAcross[2] && // 位置2
    midDown[2] === midAcross[2] && // 位置10
    midDown[4] === botAcross[2] && // 位置18
    rightDown[0] === topAcross[4] && // 位置4
    rightDown[2] === midAcross[4] && // 位置12
    rightDown[4] === botAcross[4] // 位置20
  );
}

/**
 * 从游戏板生成所有可能的解决方案
 */
export function possibleSolutionsFromBoard(
  board: Board<Tile>
): Set<SerializedSolution> {
  const solutions = new Set<SerializedSolution>();
  const letterCountChecker = initialLetterCountChecker(board);

  // 为每个单词位置找到可能的单词
  const possibleWords = new Map<Direction, Map<Order, Set<string>>>();

  for (const wordLocation of ALL_WORD_LOCATIONS) {
    const wordTiles = wordFromWordLocation(board, wordLocation);
    const words = searchWord(wordTiles);

    if (!possibleWords.has(wordLocation.dir)) {
      possibleWords.set(wordLocation.dir, new Map());
    }
    possibleWords.get(wordLocation.dir)!.set(wordLocation.order, words);
  }

  // 获取单词集合的辅助函数
  const getWords = (dir: Direction, order: Order): Set<string> => {
    return possibleWords.get(dir)?.get(order) ?? new Set();
  };

  // 生成所有可能的组合
  for (const topAcross of getWords(Direction.Across, Order.First)) {
    const constraintsAfterTop = updatedLetterCountConstraintIfValid(
      letterCountChecker,
      topAcross
    );
    if (!constraintsAfterTop) continue;

    for (const midAcross of getWords(Direction.Across, Order.Mid)) {
      const constraintsAfterMid = updatedLetterCountConstraintIfValid(
        constraintsAfterTop,
        midAcross
      );
      if (!constraintsAfterMid) continue;

      for (const botAcross of getWords(Direction.Across, Order.Last)) {
        const constraintsAfterBot = updatedLetterCountConstraintIfValid(
          constraintsAfterMid,
          botAcross
        );
        if (!constraintsAfterBot) continue;

        for (const leftDown of getWords(Direction.Down, Order.First)) {
          // 只计算未在横向单词中使用的字母
          const leftDownUnusedLetters = `${leftDown[1]}${leftDown[3]}`;
          const constraintsAfterLeft = updatedLetterCountConstraintIfValid(
            constraintsAfterBot,
            leftDownUnusedLetters
          );
          if (!constraintsAfterLeft) continue;

          for (const midDown of getWords(Direction.Down, Order.Mid)) {
            const midDownUnusedLetters = `${midDown[1]}${midDown[3]}`;
            const constraintsAfterMidDown = updatedLetterCountConstraintIfValid(
              constraintsAfterLeft,
              midDownUnusedLetters
            );
            if (!constraintsAfterMidDown) continue;

            for (const rightDown of getWords(Direction.Down, Order.Last)) {
              const rightDownUnusedLetters = `${rightDown[1]}${rightDown[3]}`;
              const finalConstraints = updatedLetterCountConstraintIfValid(
                constraintsAfterMidDown,
                rightDownUnusedLetters
              );
              if (!finalConstraints) continue;

              // 验证交叉点
              if (
                !validateIntersections(
                  topAcross,
                  midAcross,
                  botAcross,
                  leftDown,
                  midDown,
                  rightDown
                )
              ) {
                continue;
              }

              // 创建解决方案
              const solution: Solution = new Map([
                [
                  Direction.Across,
                  new Map([
                    [Order.First, topAcross],
                    [Order.Mid, midAcross],
                    [Order.Last, botAcross]
                  ])
                ],
                [
                  Direction.Down,
                  new Map([
                    [Order.First, leftDown],
                    [Order.Mid, midDown],
                    [Order.Last, rightDown]
                  ])
                ]
              ]);

              solutions.add(serialize(solution));
            }
          }
        }
      }
    }
  }

  return solutions;
}

/**
 * 检查解决方案是否有效
 */
export function isValidSolution(
  solution: SerializedSolution,
  board: Board<Tile>
): boolean {
  if (solution.length !== 21) return false;

  // 检查字母计数
  const solutionCounts: LetterCount = {};
  const boardCounts: LetterCount = {};

  for (const letter of solution) {
    solutionCounts[letter as Letter] =
      (solutionCounts[letter as Letter] || 0) + 1;
  }

  for (const tile of board) {
    boardCounts[tile.letter] = (boardCounts[tile.letter] || 0) + 1;
  }

  // 比较计数
  for (const [letter, count] of Object.entries(solutionCounts)) {
    if ((boardCounts[letter as Letter] || 0) < count) {
      return false;
    }
  }

  return true;
}

/**
 * 从序列化解决方案创建Solution对象
 */
export function deserialize(serialized: SerializedSolution): Solution {
  return new Map([
    [
      Direction.Across,
      new Map([
        [Order.First, serialized.slice(0, 5)],
        [Order.Mid, serialized.slice(8, 13)],
        [Order.Last, serialized.slice(16, 21)]
      ])
    ],
    [
      Direction.Down,
      new Map([
        [
          Order.First,
          `${serialized[0]}${serialized[5]}${serialized[8]}${serialized[13]}${serialized[16]}`
        ],
        [
          Order.Mid,
          `${serialized[2]}${serialized[6]}${serialized[10]}${serialized[14]}${serialized[18]}`
        ],
        [
          Order.Last,
          `${serialized[4]}${serialized[7]}${serialized[12]}${serialized[15]}${serialized[20]}`
        ]
      ])
    ]
  ]);
}
