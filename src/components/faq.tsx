'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Card } from '@/components/ui/card';

interface FAQItem {
  question: string;
  answer:
    | string
    | {
        intro?: string;
        list?: string[];
        outro?: string;
      };
  category: 'game' | 'tips' | 'strategy';
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

    const renderAnswer = useMemo(() => {
      if (typeof item.answer === 'string') {
        return <p className='text-slate-700 leading-relaxed'>{item.answer}</p>;
      }

      return (
        <div className='text-slate-700 leading-relaxed space-y-4'>
          {item.answer.intro && <p>{item.answer.intro}</p>}
          {item.answer.list && (
            <ul className='space-y-3 ml-4'>
              {item.answer.list.map((listItem, listIndex) => (
                <li key={listIndex} className='flex items-start space-x-3'>
                  <span className='inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex-shrink-0 mt-0.5'>
                    {listIndex + 1}
                  </span>
                  <span className='flex-1'>{listItem}</span>
                </li>
              ))}
            </ul>
          )}
          {item.answer.outro && (
            <p className='font-medium'>{item.answer.outro}</p>
          )}
        </div>
      );
    }, [item.answer]);

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
            isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className='px-6 pb-6'>
            <div className='bg-gradient-to-r from-slate-50/50 to-blue-50/50 rounded-xl p-4 border border-slate-200/30'>
              {renderAnswer}
            </div>
          </div>
        </div>
      </Card>
    );
  }
);

FAQItemComponent.displayName = 'FAQItemComponent';

interface CategoryButtonProps {
  category: 'all' | 'game' | 'tips' | 'strategy';
  isActive: boolean;
  count: number;
  onClick: (category: 'all' | 'game' | 'tips' | 'strategy') => void;
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
          return { label: 'Gameplay', icon: '🎮' };
        case 'tips':
          return { label: 'Tips & Help', icon: '💡' };
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
    'all' | 'game' | 'tips' | 'strategy'
  >('all');
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const faqData: FAQItem[] = useMemo(
    () => [
      // Game-related questions
      {
        question: 'How do you play Waffle Game? What are the basic rules?',
        answer:
          'Waffle Game is an engaging word puzzle where players create 6 valid words (3 horizontal, 3 vertical) in a 5x5 grid by swapping letters. The Waffle Game uses color-coded feedback: green shows correct letter placement, yellow indicates the letter belongs in the word but wrong position, and gray means the letter does not belong. Master these Waffle Game mechanics to solve puzzles efficiently.',
        category: 'game'
      },
      {
        question: 'How do I know when I have completed a Waffle Game puzzle?',
        answer:
          'You win Waffle Game when all 21 tiles turn green, meaning all 6 words are correctly formed. The Waffle Game system automatically detects completion and displays your victory stats, including moves used and time taken to solve the Waffle Game puzzle.',
        category: 'game'
      },
      {
        question: 'Is there a move limit in Waffle Game puzzles?',
        answer:
          'Yes, each Waffle Game puzzle has a 15-move limit, adding strategic depth to gameplay. This Waffle Game constraint requires careful planning and efficient swapping strategies to solve puzzles within the move allowance.',
        category: 'game'
      },
      {
        question: 'How does the AI suggestion feature work in Waffle Game?',
        answer:
          'The Waffle Game AI analyzes your current board state and calculates optimal swap combinations. This intelligent Waffle Game assistant recommends the best moves to maximize correct letter placements, helping players when stuck on challenging Waffle Game puzzles.',
        category: 'game'
      },
      {
        question: 'Can I create custom themed Waffle Game puzzles?',
        answer:
          'Absolutely! Our Waffle Game includes AI-powered puzzle generation with various themes like nature, technology, and emotions. Simply select your preferred theme, and the Waffle Game generator creates unique, solvable puzzles tailored to your interests.',
        category: 'game'
      },

      // Strategy-related questions
      {
        question:
          'What are the best strategies for solving Waffle Game puzzles?',
        answer: {
          intro:
            'Effective Waffle Game strategies that significantly improve your solving success rates include:',
          list: [
            'Secure green letters first as anchors - they are confirmed correct placements',
            'Analyze yellow letter placement options to find their proper positions',
            'Recognize common English word patterns and letter combinations',
            'Focus on intersection points where letters serve dual words simultaneously',
            'Use AI hints strategically when stuck on challenging Waffle Game puzzles'
          ],
          outro:
            'These proven Waffle Game tactics will help you solve puzzles more efficiently and consistently.'
        },
        category: 'strategy'
      },
      {
        question: 'How should I handle complex Waffle Game swap situations?',
        answer: {
          intro:
            'For challenging Waffle Game scenarios, apply these advanced techniques:',
          list: [
            'Solve partial words first to establish solid foundations',
            'Leverage intersection characteristics for multi-word benefits',
            'Use elimination methods to identify incorrect letter placements',
            'Apply AI suggestions for optimal Waffle Game solutions when needed'
          ]
        },
        category: 'strategy'
      },
      {
        question:
          'How can I improve my Waffle Game solving speed and efficiency?',
        answer: {
          intro:
            'Boost your Waffle Game performance with these proven methods:',
          list: [
            'Learn common English word patterns, prefixes, and suffixes',
            'Prioritize high-clue areas with more confirmed letters',
            'Develop spatial awareness to predict swap results accurately',
            'Practice recognizing word roots and common letter combinations',
            'Manage your moves strategically throughout each Waffle Game puzzle'
          ],
          outro:
            'Regular practice with these techniques will significantly improve your Waffle Game solving speed.'
        },
        category: 'strategy'
      },

      // User Experience & Tips questions (replacing Technical)
      {
        question: 'What should I do when I feel stuck on a Waffle Game puzzle?',
        answer: {
          intro:
            'When you feel stuck on a Waffle Game puzzle, try these helpful approaches:',
          list: [
            'Take a step back and look for obvious letter patterns or common word endings',
            'Focus on intersection letters first - they belong to two words simultaneously',
            'Use the AI suggestion feature to get a strategic hint without giving up',
            'Look for green letters as anchors and build around confirmed correct placements',
            'Try working backwards from partially completed words to find missing letters'
          ],
          outro:
            'Remember, every Waffle Game puzzle is designed to be solvable - persistence and strategy will get you there!'
        },
        category: 'tips'
      },
      {
        question:
          'How difficult are Waffle Game puzzles? Are there different difficulty levels?',
        answer:
          "Waffle Game puzzles are designed to be challenging but fair for players of all skill levels. While there isn't a formal difficulty selection, each Waffle Game puzzle varies in complexity based on word choices and letter arrangements. Beginners might find their first few Waffle Game puzzles challenging, but with practice, pattern recognition improves significantly. The 15-move limit ensures every puzzle remains engaging without being frustratingly difficult.",
        category: 'tips'
      },
      {
        question: 'Can I play Waffle Game on my phone or tablet?',
        answer: {
          intro:
            'Absolutely! Waffle Game is fully optimized for mobile devices:',
          list: [
            'Works perfectly on smartphones and tablets with touch controls',
            'Responsive design automatically adjusts to your screen size',
            'Smooth touch gestures for swapping letters with finger taps',
            'Fast loading and reliable performance on mobile browsers',
            'No app download required - play directly in your mobile browser'
          ],
          outro:
            "Whether you're on desktop, tablet, or phone, your Waffle Game experience will be smooth and engaging!"
        },
        category: 'tips'
      },
      {
        question: 'What happens if I run out of moves in Waffle Game?',
        answer:
          "If you use all 15 moves without solving the Waffle Game puzzle, don't worry! You can start a new puzzle immediately or use the AI suggestion feature before your moves run out. Each failed attempt is a learning opportunity that helps you recognize patterns faster in future Waffle Game puzzles. Many players find that understanding why they got stuck helps them improve their strategy for the next challenge.",
        category: 'tips'
      }
    ],
    []
  );

  // Cache category counts to avoid recalculation
  const categoryCounts = useMemo(() => {
    const counts = { all: faqData.length, game: 0, strategy: 0, tips: 0 };
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
      { key: 'tips', label: 'Tips & Help', icon: '💡' }
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
    (category: 'all' | 'game' | 'tips' | 'strategy') => {
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
      {/* Waffle texture background */}
      <div className='absolute inset-0 opacity-3'>
        <div className='w-full h-full' style={backgroundStyle}></div>
      </div>

      <div className='relative z-10 max-w-6xl mx-auto px-6 py-16'>
        {/* Header section */}
        <div className='text-center mb-16'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-slate-200/80 backdrop-blur-sm rounded-2xl mb-6 shadow-lg border border-slate-300'>
            <span className='text-2xl'>❓</span>
          </div>
          <h2 className='text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent mb-4'>
            Waffle Game FAQ: Complete Guide & Answers
          </h2>
          <div className='w-20 h-0.5 bg-gradient-to-r from-blue-500 to-slate-600 mx-auto mb-6'></div>
          <p className='text-lg text-slate-700/80 max-w-2xl mx-auto'>
            Comprehensive answers to all your Waffle Game questions, from basic
            gameplay to advanced strategies
          </p>
        </div>

        {/* Category filter */}
        <div className='mb-12'>
          <div className='bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/80 shadow-lg'>
            <h3 className='text-xl font-semibold text-slate-800 mb-6 text-center'>
              Waffle Game Help Categories
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

        {/* FAQ list */}
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

        {/* Empty state */}
        {filteredFAQ.length === 0 && (
          <div className='text-center py-16'>
            <div className='w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6'>
              <span className='text-4xl'>🤔</span>
            </div>
            <h3 className='text-xl font-semibold text-slate-800 mb-2'>
              No Waffle Game Questions Found
            </h3>
            <p className='text-slate-700'>
              Select different categories or view all Waffle Game questions
            </p>
          </div>
        )}

        {/* Footer tip section */}
        <div className='mt-16'>
          <div className='text-center'>
            <div className='bg-gradient-to-r from-slate-100/80 to-blue-100/80 backdrop-blur-sm rounded-xl p-6 border border-slate-300/60 shadow-md'>
              <p className='text-slate-700 font-medium'>
                💫 Need more Waffle Game help? Try the AI suggestion feature
                in-game, or generate new Waffle Game challenges to practice your
                skills!
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
