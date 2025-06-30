import React, { useMemo } from 'react';

const GameRules: React.FC = React.memo(() => {
  const gameFeatures = useMemo(() => [
    {
      icon: '🎯',
      title: 'Game Objective',
      description: 'Use all letters in the grid to form 6 valid English words'
    },
    {
      icon: '🔄',
      title: 'Move Limit',
      description: 'You have 15 swap opportunities to solve the puzzle'
    },
    {
      icon: '🖱️',
      title: 'How to Play',
      description: 'Click two letters to swap them, each swap consumes one opportunity'
    },
    {
      icon: '🏆',
      title: 'Victory Condition',
      description: 'Win when all 6 words turn green'
    }
  ], []);

  const wordRequirements = useMemo(() => [
    'Must be real English words',
    'No proper nouns accepted',
    'No abbreviations or slang accepted',
    'Each word must be 5 letters long'
  ], []);

  const swapRules = useMemo(() => [
    'Only two letters can be swapped at a time',
    'Color hints update immediately after swapping',
    'Cannot undo completed swaps',
    'Game ends when all swaps are used'
  ], []);

  return (
    <div className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-slate-800 mb-16 text-center">📋 Game Rules</h2>
        <div className="grid lg:grid-cols-2 gap-16">
          <div className="space-y-12">
            {gameFeatures.slice(0, 2).map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="w-16 h-16 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-6 shadow-lg border border-slate-200">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">{feature.title}</h3>
                <p className="text-slate-600 text-lg leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
          <div className="space-y-12">
            {gameFeatures.slice(2, 4).map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="w-16 h-16 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-6 shadow-lg border border-slate-200">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">{feature.title}</h3>
                <p className="text-slate-600 text-lg leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-300">
          <h3 className="text-2xl font-bold text-slate-800 mb-12 text-center">📝 Detailed Rules</h3>
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <h4 className="text-xl font-bold text-slate-700 mb-6">Word Requirements:</h4>
              <ul className="space-y-4 text-slate-600 text-lg">
                {wordRequirements.map((requirement, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-blue-400 text-xl">•</span>
                    {requirement}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-8">
              <h4 className="text-xl font-bold text-slate-700 mb-6">Swap Rules:</h4>
              <ul className="space-y-4 text-slate-600 text-lg">
                {swapRules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-blue-400 text-xl">•</span>
                    {rule}
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

GameRules.displayName = 'GameRules';

export default GameRules;
