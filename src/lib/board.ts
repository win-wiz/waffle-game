import {
  Board,
  Word,
  Tile,
  Letter,
  Color,
  SquareNumber,
  Direction,
  Order,
  // LetterNumber,
  LogicalLetterLocation,
  WordLocation
} from '@/types';

export const BOARD_SIZE = 21;

// 常量定义
export const ALL_WORD_LOCATIONS: WordLocation[] = [
  { dir: Direction.Across, order: Order.First },
  { dir: Direction.Across, order: Order.Mid },
  { dir: Direction.Across, order: Order.Last },
  { dir: Direction.Down, order: Order.First },
  { dir: Direction.Down, order: Order.Mid },
  { dir: Direction.Down, order: Order.Last }
];

// 预计算的位置映射表 - 性能优化
const SQUARE_NUMBERS_BY_LOGICAL_LETTER_LOCATION: Record<
  Direction,
  Record<Order, SquareNumber[]>
> = {
  [Direction.Across]: {
    [Order.First]: [0, 1, 2, 3, 4],
    [Order.Mid]: [8, 9, 10, 11, 12],
    [Order.Last]: [16, 17, 18, 19, 20]
  },
  [Direction.Down]: {
    [Order.First]: [0, 5, 8, 13, 16],
    [Order.Mid]: [2, 6, 10, 14, 18],
    [Order.Last]: [4, 7, 12, 15, 20]
  }
};

// 使用Map优化查找性能
export const LETTER_LOCATIONS_BY_SQUARE_NUMBER = new Map<
  SquareNumber,
  LogicalLetterLocation[]
>([
  [
    0,
    [
      { dir: Direction.Across, order: Order.First, letterNum: 0 },
      { dir: Direction.Down, order: Order.First, letterNum: 0 }
    ]
  ],
  [1, [{ dir: Direction.Across, order: Order.First, letterNum: 1 }]],
  [
    2,
    [
      { dir: Direction.Across, order: Order.First, letterNum: 2 },
      { dir: Direction.Down, order: Order.Mid, letterNum: 0 }
    ]
  ],
  [3, [{ dir: Direction.Across, order: Order.First, letterNum: 3 }]],
  [
    4,
    [
      { dir: Direction.Across, order: Order.First, letterNum: 4 },
      { dir: Direction.Down, order: Order.Last, letterNum: 0 }
    ]
  ],
  [5, [{ dir: Direction.Down, order: Order.First, letterNum: 1 }]],
  [6, [{ dir: Direction.Down, order: Order.Mid, letterNum: 1 }]],
  [7, [{ dir: Direction.Down, order: Order.Last, letterNum: 1 }]],
  [
    8,
    [
      { dir: Direction.Across, order: Order.Mid, letterNum: 0 },
      { dir: Direction.Down, order: Order.First, letterNum: 2 }
    ]
  ],
  [9, [{ dir: Direction.Across, order: Order.Mid, letterNum: 1 }]],
  [
    10,
    [
      { dir: Direction.Across, order: Order.Mid, letterNum: 2 },
      { dir: Direction.Down, order: Order.Mid, letterNum: 2 }
    ]
  ],
  [11, [{ dir: Direction.Across, order: Order.Mid, letterNum: 3 }]],
  [
    12,
    [
      { dir: Direction.Across, order: Order.Mid, letterNum: 4 },
      { dir: Direction.Down, order: Order.Last, letterNum: 2 }
    ]
  ],
  [13, [{ dir: Direction.Down, order: Order.First, letterNum: 3 }]],
  [14, [{ dir: Direction.Down, order: Order.Mid, letterNum: 3 }]],
  [15, [{ dir: Direction.Down, order: Order.Last, letterNum: 3 }]],
  [
    16,
    [
      { dir: Direction.Across, order: Order.Last, letterNum: 0 },
      { dir: Direction.Down, order: Order.First, letterNum: 4 }
    ]
  ],
  [17, [{ dir: Direction.Across, order: Order.Last, letterNum: 1 }]],
  [
    18,
    [
      { dir: Direction.Across, order: Order.Last, letterNum: 2 },
      { dir: Direction.Down, order: Order.Mid, letterNum: 4 }
    ]
  ],
  [19, [{ dir: Direction.Across, order: Order.Last, letterNum: 3 }]],
  [
    20,
    [
      { dir: Direction.Across, order: Order.Last, letterNum: 4 },
      { dir: Direction.Down, order: Order.Last, letterNum: 4 }
    ]
  ]
]);

/**
 * 创建初始游戏板，包含一个示例谜题
 */
export function createInitialBoard(): Board<Tile> {
  // 创建一个更有趣的初始示例
  const letters: Letter[] = [
    'S',
    'E',
    'E',
    'I',
    'N', // SEEIN
    'B',
    'A',
    'O', // B_A_O (位置5，6，7)
    'I',
    'N',
    'B',
    'C',
    'R', // INBCR
    'I',
    'R',
    'C', // I_R_C (位置13，14，15)
    'W',
    'E',
    'I',
    'G',
    'H' // WEIGH
  ];

  // 初始颜色状态（模拟部分正确的状态）
  const colors: Color[] = [
    Color.Green,
    Color.Yellow,
    Color.Grey,
    Color.Yellow,
    Color.Green,
    Color.Grey,
    Color.Yellow,
    Color.Grey,
    Color.Yellow,
    Color.Grey,
    Color.Green,
    Color.Grey,
    Color.Yellow,
    Color.Grey,
    Color.Yellow,
    Color.Grey,
    Color.Green,
    Color.Grey,
    Color.Yellow,
    Color.Grey,
    Color.Green
  ];

  const board: Tile[] = [];
  for (let i = 0; i < 21; i++) {
    board.push({
      letter: letters[i],
      color: colors[i]
    });
  }

  return board as Board<Tile>;
}

/**
 * 获取指定方格的单词位置
 */
export function wordLocationsForSquareNumber(
  squareNumber: SquareNumber
): LogicalLetterLocation[] {
  return LETTER_LOCATIONS_BY_SQUARE_NUMBER.get(squareNumber) || [];
}

/**
 * 对游戏板每个位置应用变换函数
 */
export function transformBoard<T, U>(
  board: Board<T>,
  transformFn: (
    item: T,
    squareNum: SquareNumber,
    letterLocs: LogicalLetterLocation[]
  ) => U
): Board<U> {
  return board.map((item, index) => {
    const letterLocs =
      LETTER_LOCATIONS_BY_SQUARE_NUMBER.get(index as SquareNumber) || [];
    return transformFn(item, index as SquareNumber, letterLocs);
  }) as Board<U>;
}

/**
 * 从单词位置提取单词
 */
export function wordFromWordLocation<T>(
  board: Board<T>,
  wordLoc: WordLocation
): Word<T> {
  const positions =
    SQUARE_NUMBERS_BY_LOGICAL_LETTER_LOCATION[wordLoc.dir][wordLoc.order];
  return [
    board[positions[0]],
    board[positions[1]],
    board[positions[2]],
    board[positions[3]],
    board[positions[4]]
  ] as Word<T>;
}

/**
 * 计算字母颜色
 */
export function getColorOfSquare(
  letter: Letter,
  solutionBoard: Board<Letter>,
  squareNumber: SquareNumber
): Color {
  const letterLocations = LETTER_LOCATIONS_BY_SQUARE_NUMBER.get(squareNumber);
  if (!letterLocations) return Color.Grey;

  for (const letterLoc of letterLocations) {
    const word = wordFromWordLocation(solutionBoard, letterLoc);

    // 绿色：字母在正确位置
    if (word[letterLoc.letterNum] === letter) {
      return Color.Green;
    }

    // 黄色：字母在单词中但位置错误
    if (word.includes(letter)) {
      return Color.Yellow;
    }
  }

  return Color.Grey;
}

/**
 * 从逻辑字母位置获取游戏板项目
 */
export function getBoardItemFromLogicalLetterLocation<T>(
  board: Board<T>,
  letterLoc: LogicalLetterLocation
): T {
  const squareNumber =
    SQUARE_NUMBERS_BY_LOGICAL_LETTER_LOCATION[letterLoc.dir][letterLoc.order][
      letterLoc.letterNum
    ];
  return board[squareNumber];
}

/**
 * 验证游戏板是否有效
 */
export function isValidBoard(board: Board<Tile>): boolean {
  return (
    board.length === BOARD_SIZE &&
    board.every(
      tile => tile.letter && Object.values(Color).includes(tile.color)
    )
  );
}

/**
 * 克隆游戏板
 */
export function cloneBoard<T>(board: Board<T>): Board<T> {
  return [...board] as Board<T>;
}

/**
 * 比较两个游戏板是否相等
 */
export function boardsEqual<T>(board1: Board<T>, board2: Board<T>): boolean {
  return JSON.stringify(board1) === JSON.stringify(board2);
}
