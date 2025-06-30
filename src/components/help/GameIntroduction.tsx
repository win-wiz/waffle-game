import React, { useMemo } from 'react';

const GameIntroduction: React.FC = React.memo(() => {
  const gameFeatures = useMemo(
    () => [
      '3 horizontal words + 3 vertical words',
      'Letters at intersections must satisfy both words',
      'Solve only by swapping letter positions',
      'Limited to 15 swap attempts'
    ],
    []
  );

  const targetAudience = useMemo(
    () => [
      'Word game enthusiasts',
      'People who enjoy logical thinking challenges',
      'English learners (vocabulary building)',
      'Users seeking casual puzzle games'
    ],
    []
  );

  return (
    <div className='py-20 px-6'>
      <div className='max-w-6xl mx-auto'>
        <h2 className='text-4xl font-bold text-slate-800 mb-12 text-center'>
          🎮 What is Waffle Game?
        </h2>
        <div className='grid lg:grid-cols-2 gap-16'>
          <div className='space-y-8'>
            <p className='text-slate-700 text-xl leading-relaxed'>
              Waffle is a word-based puzzle game similar to Wordle, but more
              challenging! You need to solve 6 intersecting English words
              simultaneously in a 5×5 grid.
            </p>
            <div className='space-y-6'>
              <h4 className='text-2xl font-bold text-slate-800 mb-4'>
                Game Features:
              </h4>
              <ul className='space-y-4 text-slate-700 text-lg'>
                {gameFeatures.map((feature, index) => (
                  <li key={index} className='flex items-start gap-3'>
                    <span className='text-blue-500 text-2xl'>•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className='space-y-8'>
            <div className='space-y-6'>
              <h4 className='text-2xl font-bold text-slate-800 mb-4'>
                Perfect For:
              </h4>
              <div className='space-y-4 text-slate-700 text-lg'>
                {targetAudience.map((audience, index) => (
                  <p key={index} className='flex items-center gap-3'>
                    <span className='text-blue-600 text-xl'>✅</span>
                    {audience}
                  </p>
                ))}
              </div>
            </div>
            <div className='mt-8 pt-8 border-t border-slate-200'>
              <h4 className='text-xl font-bold text-slate-800 mb-4'>
                💡 Beginner Tips
              </h4>
              <p className='text-slate-700 text-lg leading-relaxed'>
                Don't be intimidated by the complex grid! Start by understanding
                the color meanings, then focus on intersection points, and
                you'll quickly get the hang of it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

GameIntroduction.displayName = 'GameIntroduction';

export default GameIntroduction;
