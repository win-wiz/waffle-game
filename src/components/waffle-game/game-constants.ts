import { Board, Letter, Color, SquareNumber, Tile } from '@/types';
import { getColorOfSquare } from '@/lib/board';
import { createWaffleSolution, WaffleSolution } from '@/lib/words';

// Correct Waffle solution - 6 valid words in crossword grid
export const SOLUTION_BOARD: Board<Letter> = [
  'S', 'I', 'R', 'E', 'N',  // 0-4:  SIREN (horizontal row 1)
  'C',      'O',      'E',  // 5,6,7: C from SCREW, O from ROBIN, E from NEIGH (vertical parts)
  'R', 'A', 'B', 'B', 'I',  // 8-12: RABBI (horizontal row 2)
  'E',      'I',      'G',  // 13,14,15: E from SCREW, I from ROBIN, G from NEIGH (vertical parts)
  'W', 'I', 'N', 'C', 'H'   // 16-20: WINCH (horizontal row 3)
] as Board<Letter>;

// Preset Waffle puzzle - creates solvable initial state based on SOLUTION_BOARD
export const createWafflePuzzle = (): Board<Tile> => {
  // Target solution: SIREN, RABBI, WINCH / SCREW, ROBIN, NEIGH
  // SOLUTION_BOARD = ['S','I','R','E','N','C','O','E','R','A','B','B','I','E','I','G','W','I','N','C','H']
  // Create a shuffled state containing exactly the same letters
  const shuffledBoard: Board<Letter> = [
    'N', 'I', 'E', 'S', 'R',  // 0-4: shuffled SIREN
    'C',      'O',      'E',  // 5,6,7: keep some correct positions
    'W', 'A', 'B', 'B', 'I',  // 8-12: shuffled RABBI
    'E',      'I',      'G',  // 13,14,15: keep some correct positions
    'R', 'C', 'N', 'I', 'H'   // 16-20: shuffled WINCH + remaining letters
  ];

  // Calculate color for each position based on SOLUTION_BOARD
  return shuffledBoard.map((letter, index) => {
    const correctColor = getColorOfSquare(letter, SOLUTION_BOARD, index as SquareNumber);
    return {
      letter,
      color: correctColor
    };
  }) as Board<Tile>;
};

// Create shuffled puzzle from WaffleSolution
export const createPuzzleFromSolution = (solution: WaffleSolution): Board<Tile> => {
  const letters = solution.board as Board<Letter>;

  // Create shuffled letter array while keeping some positions green (correct)
  const shuffledLetters = [...letters];

  // Simple shuffle algorithm - preserve some green positions
  for (let i = shuffledLetters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledLetters[i], shuffledLetters[j]] = [shuffledLetters[j], shuffledLetters[i]];
  }

  return shuffledLetters.map((letter, index) => {
    // Calculate correct color for this position's letter
    const isCorrect = letter === letters[index];
    const correctColor = getColorOfSquare(letter, letters, index as SquareNumber);

    return {
      letter,
      color: isCorrect ? Color.Green : correctColor
    };
  }) as Board<Tile>;
};

// Get color CSS class
export function getColorClass(color: Color): string {
  switch (color) {
  case Color.Green: return 'green';    // Correct position - green
  case Color.Yellow: return 'yellow';  // Wrong position - yellow
  case Color.Grey: return 'gray';      // Not exists - gray
  default: return 'gray';
  }
}

// Convert position index to user-friendly description
export const getPositionDescription = (position: SquareNumber): string => {
  const positionMap = {
    0: 'Row 1 Col 1', 1: 'Row 1 Col 2', 2: 'Row 1 Col 3', 3: 'Row 1 Col 4', 4: 'Row 1 Col 5',
    5: 'Row 2 Col 1', 6: 'Row 2 Col 2', 7: 'Row 2 Col 3',
    8: 'Row 3 Col 1', 9: 'Row 3 Col 2', 10: 'Row 3 Col 3', 11: 'Row 3 Col 4', 12: 'Row 3 Col 5',
    13: 'Row 4 Col 1', 14: 'Row 4 Col 2', 15: 'Row 4 Col 3',
    16: 'Row 5 Col 1', 17: 'Row 5 Col 2', 18: 'Row 5 Col 3', 19: 'Row 5 Col 4', 20: 'Row 5 Col 5'
  };

  return positionMap[position] || `Position ${position}`;
};

// Get intuitive position description (based on actual grid layout)
export const getIntuitivePosDescription = (position: SquareNumber, board: Board<Tile>): string => {
  const letter = board[position].letter;

  // Based on actual Waffle grid layout (21 positions in 5x5 grid, excluding 4 empty spots)
  const gridDescriptions = {
    0: 'Top Left', 1: 'Row 1 Col 2', 2: 'Row 1 Center', 3: 'Row 1 Col 4', 4: 'Top Right',
    5: 'Row 2 Left', 6: 'Row 2 Center', 7: 'Row 2 Right',
    8: 'Row 3 Left', 9: 'Row 3 Col 2', 10: 'Center', 11: 'Row 3 Col 4', 12: 'Row 3 Right',
    13: 'Row 4 Left', 14: 'Row 4 Center', 15: 'Row 4 Right',
    16: 'Bottom Left', 17: 'Row 5 Col 2', 18: 'Row 5 Center', 19: 'Row 5 Col 4', 20: 'Bottom Right'
  };

  const description = gridDescriptions[position] || `Position ${position}`;
  return `"${letter}" at ${description}`;
};

// Classic puzzle collection - validated combinations based on intelligent generator
export const classicPuzzles = [
  {
    name: 'Classic Original - First Generation',
    words: ['SIREN', 'RABBI', 'WINCH', 'SCREW', 'ROBIN', 'NEIGH'],
    hint: 'The original classic Waffle puzzle'
  },
  {
    name: 'Animal Theme - Wild',
    words: ['BEGIN', 'SCORE', 'NEEDS', 'BISON', 'GOOSE', 'NEEDS'],
    hint: 'Animal words like BISON, GOOSE'
  },
  {
    name: 'Animal Theme - Sky',
    words: ['EAGLE', 'GLOBE', 'EMPTY', 'EAGLE', 'GROUP', 'EVERY'],
    hint: 'Flying animal words like EAGLE'
  },
  {
    name: 'Nature Scene - Forest',
    words: ['LEAVE', 'GROVE', 'THEFT', 'LIGHT', 'ABOVE', 'EVENT'],
    hint: 'Nature words like GROVE, LIGHT'
  },
  {
    name: 'Emotional Expression - Dreams',
    words: ['GUARD', 'ABOVE', 'DREAM', 'GRAND', 'ABOVE', 'DREAM'],
    hint: 'Emotional words like DREAM'
  },
  {
    name: 'Daily Life - Office',
    words: ['JOINT', 'PAPER', 'NOTED', 'JAPAN', 'INPUT', 'TIRED'],
    hint: 'Office words like PAPER, INPUT'
  },
  {
    name: 'Daily Life - Tableware',
    words: ['PLATE', 'ABOUT', 'EXTRA', 'PLACE', 'ABOUT', 'EXTRA'],
    hint: 'Tableware words like PLATE'
  },
  {
    name: 'Action Words - Life',
    words: ['ISSUE', 'ALIVE', 'EIGHT', 'IMAGE', 'SWING', 'EVENT'],
    hint: 'Action words like ALIVE, SWING'
  },
  {
    name: 'Action Words - Driving',
    words: ['DROVE', 'ENTER', 'MARCH', 'DREAM', 'OTTER', 'EARTH'],
    hint: 'Action words like DROVE, ENTER'
  },
  {
    name: 'Descriptive Words - Properties',
    words: ['WRONG', 'EXTRA', 'LARGE', 'WHEEL', 'OUTER', 'GRACE'],
    hint: 'Descriptive words like WRONG, LARGE'
  },
  {
    name: 'Geographic Words - Countries',
    words: ['JAPAN', 'PLANE', 'NEEDS', 'JAPAN', 'PHASE', 'NEEDS'],
    hint: 'Geographic words like JAPAN, PLANE'
  },
  {
    name: 'Architecture Words - Building',
    words: ['BUILD', 'AGAIN', 'SCENE', 'BEARS', 'IMAGE', 'DANCE'],
    hint: 'Architecture words like BUILD, SCENE'
  },
  {
    name: 'Team Words - Organization',
    words: ['SQUAD', 'URBAN', 'DANCE', 'SOUND', 'URBAN', 'DANCE'],
    hint: 'Team words like SQUAD, URBAN'
  },
  {
    name: 'Time Words - Sequence',
    words: ['WHILE', 'ORDER', 'SIXTY', 'WOODS', 'INDEX', 'EARLY'],
    hint: 'Time words like ORDER, SIXTY'
  },
  {
    name: 'Knowledge Words - Learning',
    words: ['BROWN', 'OCCUR', 'SERVE', 'BOOKS', 'OCCUR', 'NURSE'],
    hint: 'Knowledge words like BOOKS, SERVE'
  }
];
