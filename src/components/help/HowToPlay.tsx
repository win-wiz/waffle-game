import React, { useMemo } from 'react';

const HowToPlay: React.FC = React.memo(() => {
  const gameSteps = useMemo(() => [
    {
      number: 1,
      title: 'Observe the Grid',
      description: 'First, examine the 5×5 grid and identify which letters are green (correct position), yellow (wrong position), and gray (not in the word).'
    },
    {
      number: 2,
      title: 'Find Intersections',
      description: 'Focus on intersection positions with blue halos (0, 10, 20, etc.). Letters at these positions must satisfy both horizontal and vertical words.'
    },
    {
      number: 3,
      title: 'Start Swapping',
      description: 'Click on two letters to swap them. Remember, you have 15 swap opportunities - use each move wisely!'
    }
  ], []);

  const prioritySteps = useMemo(() => [
    'First solve green letters (already correct)',
    'Handle yellow letters at intersections',
    'Move other yellow letters to correct positions',
    'Finally handle gray letters'
  ], []);

  const commonMistakes = useMemo(() => [
    'Don\'t move green letters',
    'Don\'t ignore intersection constraints',
    'Don\'t waste swaps on obviously wrong positions',
    'Don\'t focus on just one word while ignoring others'
  ], []);

  return (
    <div className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-slate-800 mb-16 text-center">🎯 How to Start Playing</h2>
        <div className="grid lg:grid-cols-3 gap-12">
          {gameSteps.map((step) => (
            <div key={step.number} className="text-center space-y-6">
              <div className="w-20 h-20 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-6 shadow-lg border border-slate-200">
                {step.number}
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">{step.title}</h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-slate-300">
          <h3 className="text-2xl font-bold text-slate-800 mb-8 text-center">⚡ Quick Start Tips</h3>
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-slate-700 mb-4">Priority Order:</h4>
              <ol className="space-y-3 text-slate-600 text-lg">
                {prioritySteps.map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-blue-100 text-slate-700 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 border border-blue-200">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-slate-700 mb-4">Common Mistakes to Avoid:</h4>
              <ul className="space-y-3 text-slate-600 text-lg">
                {commonMistakes.map((mistake, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-slate-400 text-xl">•</span>
                    {mistake}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

HowToPlay.displayName = 'HowToPlay';

export default HowToPlay;
