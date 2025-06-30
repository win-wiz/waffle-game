import React from 'react';

// Static content extracted for performance optimization
const BASIC_STRATEGIES = [
  'Prioritize letters at intersection positions',
  'Never move green letters',
  'Prioritize adjusting yellow letter positions',
  'Start with the most confident words'
] as const;

const ADVANCED_TIPS = [
  'Utilize common English word patterns',
  'Consider letter frequency',
  'Think holistically about grid layout',
  'Remember common 5-letter words'
] as const;

const STEP_CONTENT = [
  {
    title: 'Step 1: Observe and Analyze',
    items: [
      'Identify all green letters',
      'Recognize possible positions for yellow letters',
      'Note intersection constraints',
      'Look for obvious word patterns'
    ]
  },
  {
    title: 'Step 2: Develop Strategy',
    items: [
      'Prioritize solving intersections',
      'Start with high-certainty words',
      'Consider relationships between multiple words',
      'Reserve enough swap attempts'
    ]
  },
  {
    title: 'Step 3: Execute Adjustments',
    items: [
      'Swap carefully and thoughtfully',
      'Re-evaluate after each swap',
      'Avoid disrupting correct positions',
      'Maintain holistic thinking'
    ]
  }
] as const;

const COMMON_MISTAKES = [
  'Moving green letters too early',
  'Ignoring dual constraints at intersections',
  'Focusing only on individual words while ignoring the whole',
  'Wasting swaps on ineffective attempts'
] as const;

const AVOIDANCE_METHODS = [
  'Think carefully before each swap',
  'Prioritize confirming intersection letters',
  'Maintain a global perspective',
  'Allocate swap attempts reasonably'
] as const;

const StrategyTips: React.FC = React.memo(() => {
  return (
    <div className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-slate-800 mb-16 text-center">💡 Expert Tips</h2>

        <div className="grid lg:grid-cols-2 gap-16 mb-12">
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-8">🎯 Basic Strategies</h3>
            <ul className="space-y-6 text-slate-700 text-lg">
              {BASIC_STRATEGIES.map((strategy, index) => (
                <li key={index} className="flex items-start gap-4">
                  <span className="text-blue-500 text-2xl">✓</span>
                  <span>{strategy}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-8">⭐ Advanced Tips</h3>
            <ul className="space-y-6 text-slate-700 text-lg">
              {ADVANCED_TIPS.map((tip, index) => (
                <li key={index} className="flex items-start gap-4">
                  <span className="text-slate-500 text-2xl">★</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mb-12 pt-8 border-t border-slate-300">
          <h3 className="text-2xl font-bold text-slate-800 mb-12 text-center">🧠 Detailed Problem-Solving Approach</h3>
          <div className="grid lg:grid-cols-3 gap-12">
            {STEP_CONTENT.map((step, stepIndex) => (
              <div key={stepIndex} className="text-center space-y-6">
                <div className="w-16 h-16 bg-slate-200 text-slate-700 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4 shadow-lg border border-slate-300">
                  {stepIndex + 1}
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-4">{step.title}</h4>
                <ul className="space-y-3 text-slate-600 text-lg text-left">
                  {step.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8 border-t border-slate-300">
          <h3 className="text-2xl font-bold text-slate-800 mb-12 text-center">⚠️ Common Pitfalls & Avoidance Methods</h3>
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-slate-700 mb-6">Common Mistakes:</h4>
              <ul className="space-y-4 text-slate-600 text-lg">
                {COMMON_MISTAKES.map((mistake, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-red-400 text-xl">•</span>
                    {mistake}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-slate-700 mb-6">Avoidance Methods:</h4>
              <ul className="space-y-4 text-slate-600 text-lg">
                {AVOIDANCE_METHODS.map((method, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-blue-400 text-xl">•</span>
                    {method}
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

export default StrategyTips;
