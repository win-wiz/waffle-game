import React, { useMemo, useCallback } from 'react';

interface WaffleTileProps {
  letter?: string;
  color?: 'green' | 'yellow' | 'white' | 'gray';
  isEmpty?: boolean;
  className?: string;
  isIntersection?: boolean;
}

const WaffleTile: React.FC<WaffleTileProps> = React.memo(
  ({
    letter,
    color = 'white',
    isEmpty = false,
    className = '',
    isIntersection = false
  }) => {
    const colorClasses = useMemo(
      () => ({
        green: 'text-white border-none shadow-md',
        yellow: 'text-white border-none shadow-md',
        white: 'bg-slate-200 text-slate-700 border-2 border-slate-400',
        gray: 'text-white border-none shadow-md'
      }),
      []
    );

    const computedClasses = useMemo(() => {
      if (isEmpty) {
        return `w-12 h-12 ${className}`;
      }

      const baseClasses = className || 'w-12 h-12';
      const intersectionClasses = isIntersection
        ? 'ring-4 ring-blue-500 ring-offset-2 shadow-lg'
        : 'shadow-md';

      return `${baseClasses} flex items-center justify-center font-bold text-lg rounded-lg ${intersectionClasses} ${colorClasses[color]}`;
    }, [className, isIntersection, color, isEmpty, colorClasses]);

    const getCustomStyle = () => {
      if (color === 'green') {
        return {
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          border: '2px solid #10B981',
          color: '#ffffff'
        };
      }
      if (color === 'yellow') {
        return {
          background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
          border: '2px solid #F59E0B',
          color: '#ffffff'
        };
      }
      if (color === 'gray') {
        return {
          background: 'linear-gradient(135deg, #94A3B8 0%, #64748B 100%)',
          border: '2px solid #94A3B8',
          color: '#ffffff'
        };
      }
      return {};
    };

    if (isEmpty) {
      return <div className={computedClasses} />;
    }

    return (
      <div className={computedClasses} style={getCustomStyle()}>
        {letter}
      </div>
    );
  }
);

WaffleTile.displayName = 'WaffleTile';

// Horizontal word example component
const HorizontalWordExample: React.FC<{
  letters: Array<{
    letter: string;
    color: 'green' | 'yellow' | 'gray' | 'white';
  }>;
  title: string;
  description: string;
}> = React.memo(({ letters, title, description }) => {
  const renderedTiles = useMemo(
    () =>
      letters.map((item, index) => (
        <WaffleTile
          key={index}
          letter={item.letter}
          color={item.color}
          className='w-12 h-12 text-base'
        />
      )),
    [letters]
  );

  return (
    <div className='text-center space-y-4'>
      <h4 className='text-lg font-bold text-gray-800'>{title}</h4>
      <div className='flex gap-2 justify-center'>{renderedTiles}</div>
      <p className='text-gray-600 text-sm max-w-xs mx-auto'>{description}</p>
    </div>
  );
});

HorizontalWordExample.displayName = 'HorizontalWordExample';

// Vertical word example component
const VerticalWordExample: React.FC<{
  letters: Array<{
    letter: string;
    color: 'green' | 'yellow' | 'gray' | 'white';
  }>;
  title: string;
  description: string;
}> = React.memo(({ letters, title, description }) => {
  const renderedTiles = useMemo(
    () =>
      letters.map((item, index) => (
        <WaffleTile
          key={index}
          letter={item.letter}
          color={item.color}
          className='w-12 h-12 text-base'
        />
      )),
    [letters]
  );

  return (
    <div className='text-center space-y-4'>
      <h4 className='text-lg font-bold text-gray-800'>{title}</h4>
      <div className='flex flex-col gap-2 items-center'>{renderedTiles}</div>
      <p className='text-gray-600 text-sm max-w-xs mx-auto'>{description}</p>
    </div>
  );
});

VerticalWordExample.displayName = 'VerticalWordExample';

// Crossword intersection example component
const CrosswordExample: React.FC<{
  centerLetter: string;
  centerColor: 'green' | 'yellow' | 'gray';
  horizontalLetters: Array<{
    letter: string;
    color: 'green' | 'yellow' | 'gray' | 'white';
  }>;
  verticalLetters: Array<{
    letter: string;
    color: 'green' | 'yellow' | 'gray' | 'white';
  }>;
  title: string;
  description: string;
}> = React.memo(
  ({
    centerLetter,
    centerColor,
    horizontalLetters,
    verticalLetters,
    title,
    description
  }) => {
    const renderedStructure = useMemo(
      () => (
        <div className='flex flex-col items-center'>
          {/* Top letter */}
          <WaffleTile
            letter={verticalLetters[0].letter}
            color={verticalLetters[0].color}
            className='w-12 h-12 text-base mb-2'
          />

          {/* Horizontal row */}
          <div className='flex gap-2 items-center'>
            <WaffleTile
              letter={horizontalLetters[0].letter}
              color={horizontalLetters[0].color}
              className='w-12 h-12 text-base'
            />
            <WaffleTile
              letter={centerLetter}
              color={centerColor}
              isIntersection={true}
              className='w-12 h-12 text-base'
            />
            <WaffleTile
              letter={horizontalLetters[1].letter}
              color={horizontalLetters[1].color}
              className='w-12 h-12 text-base'
            />
          </div>

          {/* Bottom letter */}
          <WaffleTile
            letter={verticalLetters[1].letter}
            color={verticalLetters[1].color}
            className='w-12 h-12 text-base mt-2'
          />
        </div>
      ),
      [centerLetter, centerColor, horizontalLetters, verticalLetters]
    );

    return (
      <div className='text-center space-y-6'>
        <h4 className='text-lg font-bold text-gray-800'>{title}</h4>
        {renderedStructure}
        <p className='text-gray-600 text-sm max-w-xs mx-auto'>{description}</p>
      </div>
    );
  }
);

CrosswordExample.displayName = 'CrosswordExample';

const ColorMeaningGuide: React.FC = React.memo(() => {
  const headerContent = useMemo(
    () => (
      <div className='text-center mb-16'>
        <h2 className='text-4xl font-bold text-slate-800 mb-8'>
          🎨 Color Meaning Guide
        </h2>
        <div className='mb-8'>
          <h3 className='text-2xl font-bold text-slate-800 mb-4'>
            🔍 Color System Explanation
          </h3>
          <p className='text-slate-700 text-xl leading-relaxed max-w-4xl mx-auto'>
            The Waffle game uses colors to indicate the status of each letter.
            Understanding these colors is key to solving the puzzle! Each
            letter's color is displayed based on its correctness in the current
            word.
          </p>
        </div>
      </div>
    ),
    []
  );

  return (
    <div className='py-20 px-6'>
      <div className='max-w-6xl mx-auto'>
        {/* Header section */}
        {headerContent}

        {/* Green - Correct Position */}
        <div className='mb-16'>
          <div className='flex items-center justify-center gap-8 mb-10'>
            <WaffleTile
              letter='O'
              color='green'
              className='w-16 h-16 text-xl'
            />
            <div className='text-center'>
              <h3 className='text-3xl font-bold text-green-700 mb-2'>
                🟢 Green - Correct Position
              </h3>
              <p className='text-green-600 text-xl'>
                The letter is in the completely correct position in the word
              </p>
            </div>
          </div>

          <div className='text-center mb-12'>
            <h4 className='text-xl font-bold text-green-800 mb-8'>
              ✅ Meaning of Green Letters:
            </h4>
            <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto'>
              <div className='text-green-700 text-lg text-center'>
                <span className='block font-semibold mb-2 text-xl'>
                  Belongs to Word
                </span>
                <p>This letter belongs to this word</p>
              </div>
              <div className='text-green-700 text-lg text-center'>
                <span className='block font-semibold mb-2 text-xl'>
                  Correct Position
                </span>
                <p>The letter's position is completely correct</p>
              </div>
              <div className='text-green-700 text-lg text-center'>
                <span className='block font-semibold mb-2 text-xl'>
                  No Movement Needed
                </span>
                <p>No need to move this letter</p>
              </div>
              <div className='text-green-700 text-lg text-center'>
                <span className='block font-semibold mb-2 text-xl'>
                  Solving Anchor
                </span>
                <p>Can serve as an anchor for solving</p>
              </div>
            </div>
          </div>

          <div className='text-center'>
            <h4 className='text-xl font-bold text-green-800 mb-8'>
              🎮 Game Scenario Examples
            </h4>
            <div className='grid lg:grid-cols-3 gap-12 max-w-5xl mx-auto'>
              <HorizontalWordExample
                letters={[
                  { letter: 'W', color: 'white' },
                  { letter: 'O', color: 'green' },
                  { letter: 'R', color: 'white' },
                  { letter: 'L', color: 'white' },
                  { letter: 'D', color: 'white' }
                ]}
                title='Green in Horizontal Word'
                description='O is correct in the 2nd position of word WORLD'
              />

              <VerticalWordExample
                letters={[
                  { letter: 'M', color: 'white' },
                  { letter: 'O', color: 'green' },
                  { letter: 'U', color: 'white' },
                  { letter: 'S', color: 'white' },
                  { letter: 'E', color: 'white' }
                ]}
                title='Green in Vertical Word'
                description='O is correct in the 2nd position of word MOUSE'
              />

              <CrosswordExample
                centerLetter='O'
                centerColor='green'
                horizontalLetters={[
                  { letter: 'W', color: 'white' },
                  { letter: 'R', color: 'white' }
                ]}
                verticalLetters={[
                  { letter: 'M', color: 'white' },
                  { letter: 'U', color: 'white' }
                ]}
                title='Green at Intersection'
                description='O is correct for both horizontal word WOR and vertical word MOU'
              />
            </div>
          </div>
        </div>

        {/* Yellow - Wrong Position */}
        <div className='mb-16'>
          <div className='flex items-center justify-center gap-8 mb-10'>
            <WaffleTile
              letter='R'
              color='yellow'
              className='w-16 h-16 text-xl'
            />
            <div className='text-center'>
              <h3 className='text-3xl font-bold text-yellow-700 mb-2'>
                🟡 Yellow - Wrong Position
              </h3>
              <p className='text-yellow-600 text-xl'>
                The letter belongs to the word, but is in the wrong position
              </p>
            </div>
          </div>

          <div className='text-center mb-12'>
            <h4 className='text-xl font-bold text-yellow-800 mb-8'>
              ⚠️ Meaning of Yellow Letters:
            </h4>
            <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto'>
              <div className='text-yellow-700 text-lg text-center'>
                <span className='block font-semibold mb-2 text-xl'>
                  Belongs to Word
                </span>
                <p>This letter indeed belongs to this word</p>
              </div>
              <div className='text-yellow-700 text-lg text-center'>
                <span className='block font-semibold mb-2 text-xl'>
                  Wrong Position
                </span>
                <p>But the current position is incorrect</p>
              </div>
              <div className='text-yellow-700 text-lg text-center'>
                <span className='block font-semibold mb-2 text-xl'>
                  Needs Movement
                </span>
                <p>Need to find its correct position</p>
              </div>
              <div className='text-yellow-700 text-lg text-center'>
                <span className='block font-semibold mb-2 text-xl'>
                  Important Clue
                </span>
                <p>Is an important clue for solving</p>
              </div>
            </div>
          </div>

          <div className='text-center'>
            <h4 className='text-xl font-bold text-yellow-800 mb-8'>
              🎮 Game Scenario Examples
            </h4>
            <div className='grid lg:grid-cols-3 gap-12 max-w-5xl mx-auto'>
              <HorizontalWordExample
                letters={[
                  { letter: 'R', color: 'yellow' },
                  { letter: 'I', color: 'white' },
                  { letter: 'G', color: 'white' },
                  { letter: 'H', color: 'white' },
                  { letter: 'T', color: 'white' }
                ]}
                title='Yellow in Horizontal Word'
                description='R belongs to word RIGHT but not in the 1st position'
              />

              <VerticalWordExample
                letters={[
                  { letter: 'P', color: 'white' },
                  { letter: 'R', color: 'yellow' },
                  { letter: 'I', color: 'white' },
                  { letter: 'N', color: 'white' },
                  { letter: 'T', color: 'white' }
                ]}
                title='Yellow in Vertical Word'
                description='R belongs to word PRINT but not in the 2nd position'
              />

              <CrosswordExample
                centerLetter='R'
                centerColor='yellow'
                horizontalLetters={[
                  { letter: 'T', color: 'white' },
                  { letter: 'U', color: 'white' }
                ]}
                verticalLetters={[
                  { letter: 'F', color: 'white' },
                  { letter: 'O', color: 'white' }
                ]}
                title='Yellow at Intersection'
                description='R belongs to one or both words but in wrong position'
              />
            </div>
          </div>
        </div>

        {/* Gray - Not in Word */}
        <div className='mb-16'>
          <div className='flex items-center justify-center gap-8 mb-10'>
            <WaffleTile letter='X' color='gray' className='w-16 h-16 text-xl' />
            <div className='text-center'>
              <h3 className='text-3xl font-bold text-gray-700 mb-2'>
                ⚫ Gray - Not in Word
              </h3>
              <p className='text-gray-600 text-xl'>
                The letter does not belong to the word
              </p>
            </div>
          </div>

          <div className='text-center mb-12'>
            <h4 className='text-xl font-bold text-gray-800 mb-8'>
              ❌ Meaning of Gray Letters:
            </h4>
            <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto'>
              <div className='text-gray-700 text-lg text-center'>
                <span className='block font-semibold mb-2 text-xl'>
                  Not in Word
                </span>
                <p>This letter does not belong to this word at all</p>
              </div>
              <div className='text-gray-700 text-lg text-center'>
                <span className='block font-semibold mb-2 text-xl'>
                  Needs Swapping
                </span>
                <p>Needs to be swapped with letters from other positions</p>
              </div>
              <div className='text-gray-700 text-lg text-center'>
                <span className='block font-semibold mb-2 text-xl'>
                  Final Step
                </span>
                <p>Usually the final step in solving the puzzle</p>
              </div>
              <div className='text-gray-700 text-lg text-center'>
                <span className='block font-semibold mb-2 text-xl'>
                  Exclude Options
                </span>
                <p>Helps eliminate incorrect options</p>
              </div>
            </div>
          </div>

          <div className='text-center'>
            <h4 className='text-xl font-bold text-gray-800 mb-8'>
              🎮 Game Scenario Examples
            </h4>
            <div className='grid lg:grid-cols-3 gap-12 max-w-5xl mx-auto'>
              <HorizontalWordExample
                letters={[
                  { letter: 'X', color: 'gray' },
                  { letter: 'O', color: 'white' },
                  { letter: 'R', color: 'white' },
                  { letter: 'D', color: 'white' },
                  { letter: 'S', color: 'white' }
                ]}
                title='Gray in Horizontal Word'
                description='X does not belong to word WORDS, needs replacement'
              />

              <VerticalWordExample
                letters={[
                  { letter: 'T', color: 'white' },
                  { letter: 'A', color: 'white' },
                  { letter: 'B', color: 'white' },
                  { letter: 'Z', color: 'gray' },
                  { letter: 'E', color: 'white' }
                ]}
                title='Gray in Vertical Word'
                description='Z does not belong to word TABLE, needs replacement'
              />

              <CrosswordExample
                centerLetter='Q'
                centerColor='gray'
                horizontalLetters={[
                  { letter: 'M', color: 'white' },
                  { letter: 'S', color: 'white' }
                ]}
                verticalLetters={[
                  { letter: 'B', color: 'white' },
                  { letter: 'K', color: 'white' }
                ]}
                title='Gray at Intersection'
                description='Q belongs to neither horizontal nor vertical word'
              />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className='text-center bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl'>
          <h3 className='text-2xl font-bold text-gray-800 mb-6'>
            🎯 Strategy Summary
          </h3>
          <div className='grid md:grid-cols-3 gap-8 max-w-4xl mx-auto'>
            <div className='text-center'>
              <div className='text-4xl mb-4'>🟢</div>
              <h4 className='font-bold text-green-700 mb-2'>Green First</h4>
              <p className='text-gray-600'>
                First confirm green letter positions, they are correct
              </p>
            </div>
            <div className='text-center'>
              <div className='text-4xl mb-4'>🟡</div>
              <h4 className='font-bold text-yellow-700 mb-2'>Move Yellow</h4>
              <p className='text-gray-600'>
                Move yellow letters to their correct positions
              </p>
            </div>
            <div className='text-center'>
              <div className='text-4xl mb-4'>⚫</div>
              <h4 className='font-bold text-gray-700 mb-2'>Replace Gray</h4>
              <p className='text-gray-600'>
                Replace gray letters with correct ones
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ColorMeaningGuide.displayName = 'ColorMeaningGuide';

export default ColorMeaningGuide;
