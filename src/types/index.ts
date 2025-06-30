// 核心游戏类型
export type Letter =
  | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M'
  | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z';

export enum Color {
  Green = 'green',
  Yellow = 'yellow',
  Grey = 'grey'
}

export interface Tile {
  letter: Letter;
  color: Color;
}

// 游戏板类型 - 21个位置的数组
export type Board<T> = [
  T, T, T, T, T, T, T, T, T, T,
  T, T, T, T, T, T, T, T, T, T,
  T
];

// 位置编号类型 (0-20)
export type SquareNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;

// 交换类型 - 两个位置的元组
export type Swap = [SquareNumber, SquareNumber];

// 单词类型 - 5个字母
export type Word<T> = [T, T, T, T, T];

// 单词位置映射
export interface WordPositions {
  horizontal: {
    word1: SquareNumber[];  // 第一行
    word2: SquareNumber[];  // 第三行
    word3: SquareNumber[];  // 第五行
  };
  vertical: {
    word1: SquareNumber[];  // 第一列
    word2: SquareNumber[];  // 第三列
    word3: SquareNumber[];  // 第五列
  };
}

export enum Direction {
  Across = 'across',
  Down = 'down',
}

export enum Order {
  First = 0,
  Mid = 1,
  Last = 2,
}

// 复合类型
export type LetterNumber = 0 | 1 | 2 | 3 | 4;

export type WordLocation = {
  dir: Direction;
  order: Order;
};

export type LogicalLetterLocation = WordLocation & {
  letterNum: LetterNumber;
};

export type SerializedSolution = string;

export type Solution = Map<Direction, Map<Order, string>>;

export type LetterCount = { [l in Letter]?: number };

export type LetterCountConstraintChecker = {
  [l in Letter]?: { current: number; max: number };
};

// 组件Props类型
export interface TileComponentProps {
  tile: Tile;
  onTileChange: (tile: Tile) => void;
  editable: boolean;
  position: SquareNumber;
}

export interface BoardComponentProps {
  board: Board<Tile>;
  onBoardChange: (board: Board<Tile>) => void;
  editable: boolean;
}

export interface SwapDisplayProps {
  swaps: Swap[];
  onApplySwap?: () => void;
  showApplyButton?: boolean;
}

// 游戏状态类型
export interface GameState {
  board: Board<Tile>;
  solution: Board<Letter> | null;
  swaps: Swap[];
  isLoading: boolean;
  error: string | null;
}

// Hook返回类型
export interface UseWaffleSolverReturn {
  gameState: GameState;
  generateSolution: () => Promise<void>;
  applyNextSwap: () => void;
  updateBoard: (board: Board<Tile>) => void;
  reset: () => void;
}
