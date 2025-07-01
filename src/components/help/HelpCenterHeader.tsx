import React from 'react';

const HelpCenterHeader: React.FC = React.memo(() => {
  return (
    <div className='py-20 px-6'>
      <div className='max-w-6xl mx-auto text-center'>
        <h1 className='text-6xl font-bold text-slate-800 mb-8'>
          🔑 Unstuck Your Waffle
        </h1>
        <div className='w-40 h-1 bg-gradient-to-r from-blue-500 to-slate-600 mx-auto mb-8'></div>
        <p className='text-2xl text-slate-700 max-w-4xl mx-auto leading-relaxed'>
          Master this challenging word puzzle by swapping letters to create 6
          valid English words in a 5×5 grid!
        </p>
      </div>
    </div>
  );
});

HelpCenterHeader.displayName = 'HelpCenterHeader';

export default HelpCenterHeader;
