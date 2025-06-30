import React from 'react';
import HelpCenterHeader from './help/HelpCenterHeader';
import GameIntroduction from './help/GameIntroduction';
import GameGridDisplay from './help/GameGridDisplay';
import HowToPlay from './help/HowToPlay';
import ColorMeaningGuide from './help/ColorMeaningGuide';
import GameRules from './help/GameRules';
import StrategyTips from './help/StrategyTips';
import FAQ from './help/FAQ';

const HelpCenter: React.FC = () => {
  return (
    <div id="help-center" className="min-h-screen">
      <HelpCenterHeader />
      <GameIntroduction />
      <GameGridDisplay />
      <HowToPlay />
      <ColorMeaningGuide />
      <GameRules />
      <StrategyTips />
      <FAQ />
    </div>
  );
};

export default HelpCenter;
