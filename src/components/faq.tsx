'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Card } from '@/components/ui/card';

interface FAQItem {
  question: string;
  answer: string;
  category: 'game' | 'technical' | 'strategy';
}

interface FAQItemComponentProps {
  item: FAQItem;
  index: number;
  isOpen: boolean;
  onToggle: (index: number) => void;
}

// Memoized FAQ item component to prevent unnecessary re-renders
const FAQItemComponent: React.FC<FAQItemComponentProps> = React.memo(
  ({ item, index, isOpen, onToggle }) => {
    const categoryStyles = useMemo(() => {
      switch (item.category) {
        case 'game':
          return { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: '🎮' };
        case 'strategy':
          return { bg: 'bg-blue-100', text: 'text-blue-700', icon: '🧠' };
        default:
          return { bg: 'bg-purple-100', text: 'text-purple-700', icon: '⚙️' };
      }
    }, [item.category]);

    const handleClick = useCallback(() => {
      onToggle(index);
    }, [index, onToggle]);

    return (
      <Card className='overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm'>
        <button
          onClick={handleClick}
          className='w-full px-6 py-4 text-left hover:bg-slate-50/50 transition-colors duration-200 flex items-center justify-between group'
        >
          <div className='flex items-center space-x-4 flex-1'>
            <div className='flex-shrink-0'>
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${categoryStyles.bg} ${categoryStyles.text}`}
              >
                {categoryStyles.icon}
              </div>
            </div>

            <div className='flex-1'>
              <h3 className='text-lg font-medium text-slate-800 group-hover:text-slate-700 transition-colors pr-4 leading-tight'>
                {item.question}
              </h3>
            </div>
          </div>

          <div
            className={`transform transition-all duration-300 ${
              isOpen ? 'rotate-180 text-blue-600' : 'rotate-0 text-slate-500'
            } group-hover:text-slate-700`}
          >
            <svg
              className='w-5 h-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 9l-7 7-7-7'
              />
            </svg>
          </div>
        </button>

        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className='px-6 pb-6'>
            <div className='bg-gradient-to-r from-slate-50/50 to-blue-50/50 rounded-xl p-4 border border-slate-200/30'>
              <p className='text-slate-700 leading-relaxed'>{item.answer}</p>
            </div>
          </div>
        </div>
      </Card>
    );
  }
);

FAQItemComponent.displayName = 'FAQItemComponent';

interface CategoryButtonProps {
  category: 'all' | 'game' | 'technical' | 'strategy';
  isActive: boolean;
  count: number;
  onClick: (category: 'all' | 'game' | 'technical' | 'strategy') => void;
}

// Memoized category button component
const CategoryButton: React.FC<CategoryButtonProps> = React.memo(
  ({ category, isActive, count, onClick }) => {
    const handleClick = useCallback(() => {
      onClick(category);
    }, [category, onClick]);

    const categoryConfig = useMemo(() => {
      switch (category) {
        case 'all':
          return { label: 'All Questions', icon: '📋' };
        case 'game':
          return { label: 'Game Rules', icon: '🎮' };
        case 'technical':
          return { label: 'Technical', icon: '⚙️' };
        case 'strategy':
          return { label: 'Strategy', icon: '🧠' };
        default:
          return { label: 'Unknown', icon: '❓' };
      }
    }, [category]);

    return (
      <button
        onClick={handleClick}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
          isActive
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
            : 'bg-white/80 text-slate-600 hover:bg-white hover:text-slate-800 hover:shadow-md'
        }`}
      >
        <span>{categoryConfig.icon}</span>
        <span>{categoryConfig.label}</span>
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${
            isActive ? 'bg-blue-500' : 'bg-slate-200 text-slate-500'
          }`}
        >
          {count}
        </span>
      </button>
    );
  }
);

CategoryButton.displayName = 'CategoryButton';

const FAQ: React.FC = React.memo(() => {
  const [activeCategory, setActiveCategory] = useState<
    'all' | 'game' | 'technical' | 'strategy'
  >('all');
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const faqData: FAQItem[] = useMemo(
    () => [
      // Game-related questions
      {
        question: 'What are the basic rules of the Waffle game?',
        answer:
          'Waffle is a word swap puzzle game. Players need to form 6 valid English words (3 horizontal, 3 vertical) in a 5x5 grid by swapping letter positions. The game provides color hints: green indicates correct position, yellow indicates the letter exists but is in wrong position, gray indicates the letter does not belong to that word.',
        category: 'game'
      },
      {
        question: 'How do I know when the game is completed?',
        answer:
          'When all 21 letter tiles turn green, it means all 6 words have been correctly formed and the game is complete. The system will automatically detect and display victory information.',
        category: 'game'
      },
      {
        question: 'Is there a move limit for each puzzle?',
        answer:
          'Yes, each Waffle puzzle has a maximum move limit, typically 15 moves. This adds challenge to the game, requiring players to think carefully about each swap.',
        category: 'game'
      },
      {
        question: 'How does the AI suggestion feature work?',
        answer:
          'The AI suggestion feature analyzes the current board state, calculates all possible swap combinations, and recommends optimal swap strategies that maximize the number of correct letters. This helps players get hints when stuck.',
        category: 'game'
      },
      {
        question: 'Can I generate custom themed puzzles?',
        answer:
          'Yes, the project supports AI generation functionality that can create word puzzles based on different themes (such as nature, technology, emotions, etc.). Simply select a theme and use the AI generator.',
        category: 'game'
      },

      // Strategy-related questions
      {
        question: 'What are some good solving strategies?',
        answer:
          'Recommended strategies include: 1) Prioritize fixing green letters as anchors; 2) Analyze possible positions for yellow letters; 3) Identify common English word patterns; 4) Start from intersection points, as these letters belong to two words simultaneously; 5) Use AI suggestions wisely.',
        category: 'strategy'
      },
      {
        question: 'How to handle complex swap situations?',
        answer:
          "For complex situations, consider: 1) Solve partial words first to establish a foundation; 2) Utilize word intersection characteristics, as one swap may affect multiple words; 3) Use elimination method to determine which letters don't belong to specific positions; 4) Use AI suggestions when necessary for optimal solutions.",
        category: 'strategy'
      },
      {
        question: 'How to improve solving efficiency?',
        answer:
          'Methods to improve efficiency include: 1) Familiarize yourself with common English word patterns; 2) Prioritize areas with more clues; 3) Learn to identify word roots, prefixes, and suffixes; 4) Practice spatial thinking to predict swap results; 5) Allocate moves wisely.',
        category: 'strategy'
      },

      // Technical questions
      {
        question: 'What technology stack does the project use?',
        answer:
          'The project is built on Next.js 15, using React 18, TypeScript, and Tailwind CSS for development. The UI component library uses shadcn/ui, state management uses React Hooks, and integrates AI functionality and animation systems.',
        category: 'technical'
      },
      {
        question: 'How are the game algorithms implemented?',
        answer:
          "Core game algorithms include: 1) Word validation algorithm that checks if letter combinations form valid words; 2) Color calculation algorithm that determines each letter's status; 3) Swap suggestion algorithm using heuristic search to find optimal solutions; 4) Puzzle generation algorithm ensuring generated puzzles are solvable and challenging.",
        category: 'technical'
      },
      {
        question: 'How is game performance ensured?',
        answer:
          'Performance optimization measures include: 1) Using React.memo and useMemo to reduce unnecessary re-renders; 2) Implementing virtualization and lazy loading; 3) Optimizing algorithm complexity; 4) Using Web Workers for complex calculations; 5) Using CSS animations instead of JavaScript animations for better smoothness.',
        category: 'technical'
      },
      {
        question: 'Which browsers does the project support?',
        answer:
          'The project supports all modern browsers, including Chrome 90+, Firefox 88+, Safari 14+, Edge 90+. It uses modern web standards to ensure good experience across different devices and browsers.',
        category: 'technical'
      }
    ],
    []
  );

  // Cache category counts to avoid recalculation
  const categoryCounts = useMemo(() => {
    const counts = { all: faqData.length, game: 0, strategy: 0, technical: 0 };
    faqData.forEach(item => {
      counts[item.category]++;
    });
    return counts;
  }, [faqData]);

  const categories = useMemo(
    () => [
      { key: 'all', label: 'All Questions', icon: '📋' },
      { key: 'game', label: 'Gameplay', icon: '🎮' },
      { key: 'strategy', label: 'Strategy', icon: '🧠' },
      { key: 'technical', label: 'Technical', icon: '⚙️' }
    ],
    []
  );

  const filteredFAQ = useMemo(
    () =>
      activeCategory === 'all'
        ? faqData
        : faqData.filter(item => item.category === activeCategory),
    [activeCategory, faqData]
  );

  const toggleItem = useCallback((index: number) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  }, []);

  const handleCategoryChange = useCallback(
    (category: 'all' | 'game' | 'technical' | 'strategy') => {
      setActiveCategory(category);
    },
    []
  );

  // Cache background style to avoid recreation
  const backgroundStyle = useMemo(
    () => ({
      // backgroundImage: `
      //   linear-gradient(90deg, rgba(100,116,139,0.15) 1px, transparent 1px),
      //   linear-gradient(rgba(100,116,139,0.15) 1px, transparent 1px)
      // `,
      backgroundSize: '60px 60px'
    }),
    []
  );

  return (
    <div className='bg-gradient-to-br from-slate-200/40 via-gray-200/30 to-blue-200/45 relative'>
      {/* 华夫饼纹理背景 */}
      <div className='absolute inset-0 opacity-3'>
        <div className='w-full h-full' style={backgroundStyle}></div>
      </div>

      <div className='relative z-10 max-w-6xl mx-auto px-6 py-16'>
        {/* 简洁的标题区域 */}
        <div className='text-center mb-16'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-slate-200/80 backdrop-blur-sm rounded-2xl mb-6 shadow-lg border border-slate-300'>
            <span className='text-2xl'>❓</span>
          </div>
          <h2 className='text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent mb-4'>
            Frequently Asked Questions
          </h2>
          <div className='w-20 h-0.5 bg-gradient-to-r from-blue-500 to-slate-600 mx-auto mb-6'></div>
          <p className='text-lg text-slate-700/80 max-w-2xl mx-auto'>
            Detailed Q&A about the Waffle game
          </p>
        </div>
        {/* 分类筛选 - 简洁设计 */}
        <div className='mb-12'>
          <div className='bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/80 shadow-lg'>
            <h3 className='text-xl font-semibold text-slate-800 mb-6 text-center'>
              Question Categories
            </h3>
            <div className='flex flex-wrap justify-center gap-3'>
              {categories.map(category => (
                <CategoryButton
                  key={category.key}
                  category={category.key as any}
                  isActive={activeCategory === category.key}
                  count={
                    categoryCounts[category.key as keyof typeof categoryCounts]
                  }
                  onClick={handleCategoryChange}
                />
              ))}
            </div>
          </div>
        </div>

        {/* FAQ列表 - 简洁设计 */}
        <div className='space-y-4'>
          {filteredFAQ.map((item, index) => {
            const isOpen = openItems.has(index);
            return (
              <FAQItemComponent
                key={index}
                item={item}
                index={index}
                isOpen={isOpen}
                onToggle={toggleItem}
              />
            );
          })}
        </div>

        {/* 空状态 */}
        {filteredFAQ.length === 0 && (
          <div className='text-center py-16'>
            <div className='w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6'>
              <span className='text-4xl'>🤔</span>
            </div>
            <h3 className='text-xl font-semibold text-slate-800 mb-2'>
              No Related Questions
            </h3>
            <p className='text-slate-700'>
              Please select other categories or view all questions
            </p>
          </div>
        )}

        {/* 底部提示区域 - 简洁设计 */}
        <div className='mt-16'>
          <div className='text-center'>
            <div className='bg-gradient-to-r from-slate-100/80 to-blue-100/80 backdrop-blur-sm rounded-xl p-6 border border-slate-300/60 shadow-md'>
              <p className='text-slate-700 font-medium'>
                💫 Can't find the answer you're looking for? Try using the "Get
                Suggestion" feature in the game, or generate new puzzle
                challenges!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

FAQ.displayName = 'FAQ';

export default FAQ;
