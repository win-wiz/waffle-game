import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Board, Tile, Letter, Color, Swap, SquareNumber } from '@/types';
import { transformBoard, getColorOfSquare } from '@/lib/board';
import { possibleSolutionsFromBoard } from '@/lib/solution';
import { findSwaps } from '@/lib/swaps';
import { findBestSwap } from '@/lib/swap-chooser';
import {
  createWaffleSolution,
  WaffleSolution,
  generateGuaranteedWaffle
} from '@/lib/words';
import {
  validateAIGeneratedWords,
  parseAIWaffleResponse
} from '@/lib/ai-generator';
import { toast } from 'sonner';
import {
  SOLUTION_BOARD,
  createWafflePuzzle,
  createPuzzleFromSolution,
  getIntuitivePosDescription,
  classicPuzzles
} from './game-constants';
import { useGameStatistics } from '@/hooks/use-game-statistics';

export function useGameLogic() {
  const [board, setBoard] = useState<Board<Tile> | null>(null);
  const [solution, setSolution] = useState<Board<Letter> | null>(null);
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPositions, setSelectedPositions] = useState<SquareNumber[]>(
    []
  );
  const [moveCount, setMoveCount] = useState(0);
  const [maxMoves] = useState(15);
  const [currentSolution, setCurrentSolution] = useState<WaffleSolution | null>(
    null
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAIPrompts, setShowAIPrompts] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('random');
  const [isLoadingClassic, setIsLoadingClassic] = useState(false);
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState<{
    from: SquareNumber;
    to: SquareNumber;
  } | null>(null);

  // Animation state management
  const [animatingPositions, setAnimatingPositions] = useState<SquareNumber[]>(
    []
  );
  const [justSwappedPositions, setJustSwappedPositions] = useState<
    SquareNumber[]
  >([]);
  const [swapAnimation, setSwapAnimation] = useState<{
    from: SquareNumber;
    to: SquareNumber;
    fromLetter: Letter;
    toLetter: Letter;
    progress: number;
  } | null>(null);

  // Game state management
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>(
    'playing'
  );
  const [showGameEndDialog, setShowGameEndDialog] = useState(false);

  // Classic puzzle validation state
  const [validClassicPuzzles, setValidClassicPuzzles] = useState<
    typeof classicPuzzles
  >([]);

  // Anti-duplicate toast state
  const [lastToastTime, setLastToastTime] = useState<number>(0);

  // Puzzle type tracking for statistics
  const [currentPuzzleType, setCurrentPuzzleType] = useState<
    'random' | 'classic' | 'ai-generated'
  >('random');

  // Initialization flag - use ref to ensure only initialize once
  const isInitialized = useRef(false);

  // Game statistics integration
  const gameStats = useGameStatistics({
    gameStatus,
    moveCount,
    maxMoves,
    puzzleType: currentPuzzleType,
    onGameStart: () => {
      console.log('📊 Game statistics: Game started');
    },
    onGameEnd: result => {
      console.log('📊 Game statistics: Game ended', result);
      // Show achievement toast for good performance
      if (result.isWon) {
        if (result.starsEarned >= 10) {
          toast.success('🌟 Perfect Game!', {
            description: `Amazing! You earned ${result.starsEarned} stars!`
          });
        } else if (result.starsEarned >= 5) {
          toast.success('⭐ Great Performance!', {
            description: `Well done! You earned ${result.starsEarned} stars!`
          });
        }
      }
    }
  });

  // Auto-generate new puzzle on page initialization (silent loading, no toast)
  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      console.log('🚀 Page initialization, starting puzzle generation');
      generateNewPuzzle(false); // No toast on initialization
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Anti-duplicate toast helper function
  const showToastWithDeduplication = useCallback(
    (
      toastFn: Function,
      message: string,
      options?: any,
      deduplicationTime: number = 2000
    ) => {
      const now = Date.now();
      if (now - lastToastTime > deduplicationTime) {
        setLastToastTime(now);
        toastFn(message, options);
      }
    },
    [lastToastTime]
  );

  // Recalculate colors - based on current letter position in target solution
  const recalculateColors = useCallback(
    (currentBoard: Board<Tile>): Board<Tile> => {
      const targetBoard = currentSolution?.board || SOLUTION_BOARD;
      return currentBoard.map((tile, index) => {
        const newColor = getColorOfSquare(
          tile.letter,
          targetBoard as Board<Letter>,
          index as SquareNumber
        );
        return {
          ...tile,
          color: newColor
        };
      }) as Board<Tile>;
    },
    [currentSolution]
  );

  // Handle tile click - for selecting positions to swap
  const handleTileClick = useCallback(
    (position: SquareNumber) => {
      if (!board) return;
      // Check if game has ended
      if (gameStatus !== 'playing') {
        console.log('Game has ended, cannot perform swap');
        return;
      }

      // Check if there are remaining moves
      if (moveCount >= maxMoves) {
        console.log('No moves left, game over');
        return;
      }

      // Check if current position letter is already in correct position (green)
      const currentTile = board[position];
      if (currentTile?.color === Color.Green) {
        // If letter is in correct position, don't allow selection
        console.log(
          `Letter "${currentTile.letter}" at position ${position} is already in correct position, cannot swap`
        );
        return;
      }

      if (selectedPositions.includes(position)) {
        // Deselect
        setSelectedPositions(prev => prev.filter(pos => pos !== position));
      } else if (selectedPositions.length === 0) {
        // Select first position
        setSelectedPositions([position]);
      } else if (selectedPositions.length === 1) {
        // Select second position and perform swap
        const [firstPos] = selectedPositions;
        performSwap(firstPos, position);
        setSelectedPositions([]);
      } else {
        // Restart selection
        setSelectedPositions([position]);
      }
    },
    [selectedPositions, board, gameStatus, moveCount, maxMoves]
  );

  // Perform letter swap
  const performSwap = useCallback(
    (pos1: SquareNumber, pos2: SquareNumber) => {
      if (!board) return;
      if (pos1 === pos2) return;

      console.log(`🎯 Attempting swap: ${pos1} ↔ ${pos2}`);

      // Check if both positions' letters are not in correct position
      const tile1 = board[pos1];
      const tile2 = board[pos2];

      console.log(
        `📋 Tile info: ${pos1}(${tile1?.letter}, ${tile1?.color}) ↔ ${pos2}(${tile2?.letter}, ${tile2?.color})`
      );

      if (tile1?.color === Color.Green) {
        console.log(
          `❌ Letter "${tile1.letter}" at position ${pos1} is already in correct position, cannot swap`
        );
        toast.error('⚠️ Cannot Swap', {
          description: `Letter at position ${pos1} is already in correct position, cannot swap`
        });
        return;
      }

      if (tile2?.color === Color.Green) {
        console.log(
          `❌ Letter "${tile2.letter}" at position ${pos2} is already in correct position, cannot swap`
        );
        toast.error('⚠️ Cannot Swap', {
          description: `Letter at position ${pos2} is already in correct position, cannot swap`
        });
        return;
      }

      // Set arc swap animation
      console.log(
        `🚀 [performSwap] Setting swap animation: ${pos1}(${tile1?.letter}) ↔ ${pos2}(${tile2?.letter})`
      );

      const animationData = {
        from: pos1,
        to: pos2,
        fromLetter: tile1.letter ?? '',
        toLetter: tile2.letter ?? '',
        progress: 0
      };

      console.log('📊 [performSwap] Animation data:', animationData);

      // First set animation state (make original position letters semi-transparent)
      setAnimatingPositions([pos1, pos2]);
      console.log(
        `📍 [performSwap] Set animation positions: [${pos1}, ${pos2}]`
      );

      // Then set swap animation data
      setSwapAnimation(animationData);
      console.log('✅ [performSwap] Swap animation state set');

      // Add state confirmation callback
      setTimeout(() => {
        console.log('🔄 [performSwap] Delayed state confirmation:');
        console.log(
          '   - animatingPositions current value:',
          animatingPositions
        );
        console.log('   - swapAnimation current value:', swapAnimation);
      }, 200);
    },
    [board]
  );

  // Animation completion callback
  const handleSwapAnimationComplete = useCallback(() => {
    if (!board) return;
    console.log('🔄 [handleSwapAnimationComplete] Callback invoked');
    console.log(
      '🔄 [handleSwapAnimationComplete] Current swapAnimation:',
      swapAnimation
    );

    if (!swapAnimation) {
      console.log(
        '⚠️ [handleSwapAnimationComplete] swapAnimation is null, exiting'
      );
      return;
    }

    const { from, to } = swapAnimation;
    console.log(
      `🔄 [handleSwapAnimationComplete] Executing swap: ${from}(${swapAnimation.fromLetter}) ↔ ${to}(${swapAnimation.toLetter})`
    );

    // Perform actual letter swap
    const newBoard = [...board] as Board<Tile>;
    console.log(
      '🔄 [handleSwapAnimationComplete] Board before swap:',
      newBoard.map((tile, i) => `${i}:${tile.letter}`)
    );

    const temp = newBoard[from].letter;
    newBoard[from] = { ...newBoard[from], letter: newBoard[to].letter };
    newBoard[to] = { ...newBoard[to], letter: temp };

    console.log(
      '🔄 [handleSwapAnimationComplete] Board after swap:',
      newBoard.map((tile, i) => `${i}:${tile.letter}`)
    );

    // Recalculate colors for all positions
    const boardWithNewColors = recalculateColors(newBoard);
    console.log(
      '🔄 [handleSwapAnimationComplete] After color recalculation:',
      boardWithNewColors.map((tile, i) => `${i}:${tile.letter}(${tile.color})`)
    );

    setBoard(boardWithNewColors);
    const newMoveCount = moveCount + 1;
    setMoveCount(newMoveCount);

    // Clear animation state
    console.log('🔄 [handleSwapAnimationComplete] Clearing animation state');
    setSwapAnimation(null);
    setAnimatingPositions([]);
    setJustSwappedPositions([from, to]);

    // Check if game is completed
    const isCompleted = boardWithNewColors.every(
      tile => tile.color === Color.Green
    );
    const movesLeft = maxMoves - newMoveCount;

    if (isCompleted) {
      // Game won
      console.log('🎉 Game completed! All letters are in correct positions!');
      setGameStatus('won');
      setShowGameEndDialog(true);

      toast.success('🎉 Congratulations! Game completed!', {
        description: `You completed the Waffle puzzle in ${newMoveCount} moves, amazing!`
      });
    } else if (movesLeft <= 0) {
      // Game lost - out of moves
      console.log('💔 Game over! Out of moves');
      setGameStatus('lost');
      setShowGameEndDialog(true);

      toast.error("Out of moves, but don't give up, try again!");
    }

    // Clear swap completion effect - shortened time to match new animation
    setTimeout(() => {
      setJustSwappedPositions([]);
    }, 600);

    console.log(
      `✅ [handleSwapAnimationComplete] Swap completed: position ${from} ↔ position ${to}`
    );
  }, [swapAnimation, board, recalculateColors, moveCount, maxMoves]);

  // Get AI suggestion for best swap
  const getSuggestion = useCallback(async () => {
    if (!board || board.length !== 21) return;
    setIsLoading(true);

    try {
      // toast.info('AI is analyzing current game state, finding optimal solution...');

      await new Promise(resolve => setTimeout(resolve, 500));

      console.log(
        'Current board state:',
        board.map(tile => `${tile.letter}(${tile.color})`)
      );

      // Analyze current game state
      const possibleSolutions = possibleSolutionsFromBoard(
        board && board.length === 21
          ? board
          : (Array(21).fill({ letter: '', color: Color.Grey }) as Board<Tile>)
      );
      console.log(`Found ${possibleSolutions.size} possible solutions`);

      if (possibleSolutions.size === 0) {
        // Get current target solution
        const targetBoard = currentSolution?.board || SOLUTION_BOARD;

        // Provide fallback suggestion - find a simple swap
        const wrongPositions = board
          .map((tile, index) => ({
            tile,
            index,
            correct: tile.letter === targetBoard[index],
            targetLetter: targetBoard[index]
          }))
          .filter(item => !item.correct && item.tile.color !== Color.Green);

        if (wrongPositions.length >= 2) {
          // Try to find swaps that can match each other
          let bestSwap = null;
          for (let i = 0; i < wrongPositions.length; i++) {
            for (let j = i + 1; j < wrongPositions.length; j++) {
              const pos1 = wrongPositions[i];
              const pos2 = wrongPositions[j];

              // Check if swap can improve situation
              if (
                pos1.tile.letter === pos2.targetLetter ||
                pos2.tile.letter === pos1.targetLetter
              ) {
                bestSwap = [pos1.index, pos2.index];
                break;
              }
            }
            if (bestSwap) break;
          }

          if (!bestSwap) {
            // If no perfect match found, use first two wrong positions
            bestSwap = [wrongPositions[0].index, wrongPositions[1].index];
          }

          setSolution(null);
          setSwaps([
            [bestSwap[0] as SquareNumber, bestSwap[1] as SquareNumber]
          ]);

          toast.info('💡 Smart Suggestion', {
            description: `Suggest swapping ${getIntuitivePosDescription(
              bestSwap[0] as SquareNumber,
              board && board.length === 21
                ? board
                : (Array(21).fill({
                    letter: '',
                    color: Color.Grey
                  }) as Board<Tile>)
            )} and ${getIntuitivePosDescription(
              bestSwap[1] as SquareNumber,
              board && board.length === 21
                ? board
                : (Array(21).fill({
                    letter: '',
                    color: Color.Grey
                  }) as Board<Tile>)
            )}, this might improve current situation.`
          });
          return;
        }

        toast.error(
          'Current state cannot find valid solution, suggest restarting the game.'
        );
        return;
      }

      const startString = transformBoard(
        board && board.length === 21
          ? board
          : (Array(21).fill({ letter: '', color: Color.Grey }) as Board<Tile>),
        tile => tile.letter
      ).join('');

      if (possibleSolutions.size === 1) {
        // Only one solution, give complete path
        const solutionBoard = Array.from(possibleSolutions)[0]!;
        const solutionSwaps = findSwaps(startString, solutionBoard);

        setSolution([...solutionBoard] as Board<Letter>);
        setSwaps(solutionSwaps);

        toast.success('🎯 Found Complete Solution!', {
          description: `AI found complete solution path, requires ${solutionSwaps.length} swaps.`
        });
      } else {
        // Multiple solutions, give best next step
        const bestSwap = findBestSwap(startString, possibleSolutions);

        setSolution(null);
        setSwaps([bestSwap]);

        toast.info('💡 AI Suggestion', {
          description: `Suggest swapping ${getIntuitivePosDescription(
            bestSwap[0],
            board && board.length === 21
              ? board
              : (Array(21).fill({
                  letter: '',
                  color: Color.Grey
                }) as Board<Tile>)
          )} and ${getIntuitivePosDescription(
            bestSwap[1],
            board && board.length === 21
              ? board
              : (Array(21).fill({
                  letter: '',
                  color: Color.Grey
                }) as Board<Tile>)
          )}, this is the optimal next step.`
        });
      }
    } catch (error) {
      console.error('Failed to get suggestion:', error);
      toast.error(
        'Error occurred during AI analysis, please retry or restart the game.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [board, currentSolution]);

  // Apply AI suggested swap
  const applySuggestedSwap = useCallback(() => {
    if (!board || board.length !== 21) return;
    if (swaps.length === 0) return;

    const [currentSwap, ...remainingSwaps] = swaps;
    const [from, to] = currentSwap;

    toast.info('✨ Apply AI Suggestion', {
      description: `Swapping ${getIntuitivePosDescription(
        from,
        board && board.length === 21
          ? board
          : (Array(21).fill({ letter: '', color: Color.Grey }) as Board<Tile>)
      )} and ${getIntuitivePosDescription(
        to,
        board && board.length === 21
          ? board
          : (Array(21).fill({ letter: '', color: Color.Grey }) as Board<Tile>)
      )}`
    });

    performSwap(from, to);
    setSwaps(remainingSwaps);
    setSelectedPositions([]);
  }, [swaps, performSwap, board]);

  // Generate new Waffle puzzle
  const generateNewPuzzle = useCallback(
    async (showSuccessToast: boolean = true) => {
      setIsGenerating(true);
      setBoard(null); // Enter loading state to prevent showing old puzzle
      try {
        // Ensure loading has a chance to render
        await new Promise(resolve => setTimeout(resolve, 100));
        const newSolution = generateGuaranteedWaffle();
        setCurrentSolution(newSolution);
        const newPuzzle = createPuzzleFromSolution(newSolution);
        setBoard(newPuzzle);
        // Reset game state
        setSolution(null);
        setSwaps([]);
        setSelectedPositions([]);
        setMoveCount(0);
        setGameStatus('playing');
        setShowGameEndDialog(false);
        setCurrentPuzzleType('random'); // Set puzzle type for statistics

        // Only show success toast when needed
        if (showSuccessToast) {
          showToastWithDeduplication(
            toast.success,
            '🎯 Brand new Waffle puzzle is ready, start the challenge!'
          );
        }
      } catch (error) {
        console.error('Failed to generate puzzle:', error);
        toast.error(
          'Puzzle generation failed, will use classic puzzle as fallback'
        );
        // If it really fails, use classic puzzle as fallback
        try {
          const classicSolution = createWaffleSolution(
            'SIREN',
            'RABBI',
            'WINCH',
            'SCREW',
            'ROBIN',
            'NEIGH'
          );
          if (classicSolution) {
            setCurrentSolution(classicSolution);
            setBoard(createWafflePuzzle());
            resetGameState();
          }
        } catch (fallbackError) {
          toast.error(
            'Error occurred while generating puzzle, please refresh the page and try again'
          );
        }
      } finally {
        setIsGenerating(false);
      }
    },
    [showToastWithDeduplication]
  );

  // Reset game to initial state
  const resetGame = useCallback(() => {
    generateNewPuzzle();
  }, [generateNewPuzzle]);

  // Use classic puzzle
  const useClassicPuzzle = useCallback(async () => {
    if (isLoadingClassic) return;

    setIsLoadingClassic(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const availablePuzzles =
        validClassicPuzzles.length > 0 ? validClassicPuzzles : classicPuzzles;
      const randomPuzzle =
        availablePuzzles[Math.floor(Math.random() * availablePuzzles.length)];

      const classicSolution = createWaffleSolution(
        randomPuzzle.words[0],
        randomPuzzle.words[1],
        randomPuzzle.words[2],
        randomPuzzle.words[3],
        randomPuzzle.words[4],
        randomPuzzle.words[5]
      );

      if (classicSolution) {
        setCurrentSolution(classicSolution);
        const newPuzzle = createPuzzleFromSolution(classicSolution);
        setBoard(newPuzzle);
        resetGameState();
        setCurrentPuzzleType('classic'); // Set puzzle type for statistics

        toast.success(`🏛️ ${randomPuzzle.name}`, {
          description: `Classic puzzle loaded: ${randomPuzzle.hint}`
        });
      } else {
        throw new Error('Unable to create classic puzzle solution');
      }
    } catch (error) {
      console.error('❌ Classic puzzle loading failed:', error);
      toast.error('Failed to load classic puzzle', {
        description: 'Please retry or select another puzzle'
      });
    } finally {
      setIsLoadingClassic(false);
    }
  }, [isLoadingClassic, validClassicPuzzles]);

  // Validate AI response
  const handleValidateAIResponse = useCallback(() => {
    if (!aiResponse.trim()) return;

    const parsed = parseAIWaffleResponse(aiResponse);
    if (!parsed) {
      toast.error('Unable to parse AI response, please check JSON format');
      return;
    }

    const validation = validateAIGeneratedWords(
      parsed.horizontal_words,
      parsed.vertical_words
    );

    if (validation.isValid) {
      const solution = createWaffleSolution(
        parsed.horizontal_words[0],
        parsed.horizontal_words[1],
        parsed.horizontal_words[2],
        parsed.vertical_words[0],
        parsed.vertical_words[1],
        parsed.vertical_words[2]
      );

      if (solution) {
        setCurrentSolution(solution);
        const newBoard = solution.board.map(letter => ({
          letter: letter,
          color: Color.Grey
        })) as Board<Tile>;
        setBoard(newBoard);
        resetGameState();
        setCurrentPuzzleType('ai-generated'); // Set puzzle type for statistics
        toast.success(
          '✅ AI generated puzzle validated successfully and applied!'
        );
      } else {
        toast.error(
          '❌ Validation failed: Unable to create valid Waffle solution'
        );
      }
    } else {
      toast.error('❌ Validation failed:\n' + validation.errors.join('\n'));
    }
  }, [aiResponse]);

  // Helper function to reset game state
  const resetGameState = useCallback(() => {
    setSolution(null);
    setSwaps([]);
    setSelectedPositions([]);
    setMoveCount(0);
    setGameStatus('playing');
    setShowGameEndDialog(false);
  }, []);

  // Game end handling
  const handleGameEndRestart = useCallback(() => {
    setShowGameEndDialog(false);
    resetGame();
  }, [resetGame]);

  const handleGameEndNewGame = useCallback(async () => {
    setShowGameEndDialog(false);
    await generateNewPuzzle();
  }, [generateNewPuzzle]);

  const handleGameEndClose = useCallback(() => {
    setShowGameEndDialog(false);
  }, []);

  // Validate classic puzzles
  const validateAndFilterPuzzles = useCallback(() => {
    const validPuzzles: typeof classicPuzzles = [];

    classicPuzzles.forEach(puzzle => {
      try {
        const solution = createWaffleSolution(
          puzzle.words[0],
          puzzle.words[1],
          puzzle.words[2],
          puzzle.words[3],
          puzzle.words[4],
          puzzle.words[5]
        );

        if (solution) {
          validPuzzles.push(puzzle);
        }
      } catch (error) {
        // Silently handle errors
      }
    });

    setValidClassicPuzzles(validPuzzles);

    if (process.env.NODE_ENV === 'development') {
      console.log(
        `🎯 Classic puzzle validation completed: ${validPuzzles.length}/${classicPuzzles.length} valid`
      );
    }

    return validPuzzles;
  }, []);

  // Validate classic puzzles on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      validateAndFilterPuzzles();
    }, 1000);

    return () => clearTimeout(timer);
  }, [validateAndFilterPuzzles]);

  // Calculate derived state with memoization
  const movesRemaining = useMemo(
    () => Math.max(0, maxMoves - moveCount),
    [maxMoves, moveCount]
  );

  // Memoize game state object to prevent unnecessary re-renders
  const gameState = useMemo(
    () => ({
      board,
      solution,
      swaps,
      isLoading,
      selectedPositions,
      moveCount,
      movesRemaining,
      gameStatus,
      maxMoves,
      isLoadingSuggestion,
      currentSuggestion,
      showGameEndDialog
    }),
    [
      board,
      solution,
      swaps,
      isLoading,
      selectedPositions,
      moveCount,
      movesRemaining,
      gameStatus,
      maxMoves,
      isLoadingSuggestion,
      currentSuggestion,
      showGameEndDialog
    ]
  );

  // Memoize animation state object
  const animationState = useMemo(
    () => ({
      animatingPositions,
      justSwappedPositions,
      swapAnimation
    }),
    [animatingPositions, justSwappedPositions, swapAnimation]
  );

  // Memoize game operations object
  const gameOperations = useMemo(
    () => ({
      handleTileClick,
      handleSwapAnimationComplete,
      getSuggestion,
      applySuggestedSwap,
      generateNewPuzzle,
      resetGame,
      useClassicPuzzle
    }),
    [
      handleTileClick,
      handleSwapAnimationComplete,
      getSuggestion,
      applySuggestedSwap,
      generateNewPuzzle,
      resetGame,
      useClassicPuzzle
    ]
  );

  // Memoize AI operations object
  const aiOperations = useMemo(
    () => ({
      setShowAIPrompts,
      setAiResponse,
      aiResponse,
      handleValidateAIResponse
    }),
    [setShowAIPrompts, setAiResponse, aiResponse, handleValidateAIResponse]
  );

  // Memoize game end operations object
  const gameEndOperations = useMemo(
    () => ({
      handleGameEndRestart,
      handleGameEndNewGame,
      handleGameEndClose
    }),
    [handleGameEndRestart, handleGameEndNewGame, handleGameEndClose]
  );

  return {
    // Memoized game state
    ...gameState,

    // Memoized animation state
    ...animationState,

    // Memoized game operations
    ...gameOperations,

    // Memoized AI operations
    ...aiOperations,

    // Memoized game end operations
    ...gameEndOperations,

    // Additional state not in memoized objects
    currentSolution,
    isGenerating,
    showAIPrompts,
    selectedTheme,
    isLoadingClassic,
    setSelectedTheme,

    // Statistics data
    currentPuzzleType,
    gameStats
  };
}
