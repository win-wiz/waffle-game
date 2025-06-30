import React, { memo, useMemo, useCallback } from 'react';
import { ShareDialog } from '@/components/ui/share-dialog';

interface GameEndDialogProps {
  isOpen: boolean;
  gameStatus: 'won' | 'lost';
  moveCount: number;
  maxMoves: number;
  onRestart: () => void;
  onNewGame: () => void;
  onClose: () => void;
  totalGames?: number;
  winRate?: number;
  currentStreak?: number;
}

export const GameEndDialog = memo(function GameEndDialog({
  isOpen,
  gameStatus,
  moveCount,
  maxMoves,
  onRestart,
  onNewGame,
  onClose,
  totalGames,
  winRate,
  currentStreak
}: GameEndDialogProps) {
  if (!isOpen) return null;

  const isWin = useMemo(() => gameStatus === 'won', [gameStatus]);
  const percentage = useMemo(
    () => Math.round((moveCount / maxMoves) * 100),
    [moveCount, maxMoves]
  );

  // Check if screen height is small (mobile or small screen)
  const isSmallScreen = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.innerHeight < 700;
    }
    return false;
  }, []);

  // Calculate performance rating
  const rating = useMemo(() => {
    if (!isWin) return { emoji: '💔', text: 'Incomplete', color: '#ef4444' };

    const efficiency = (maxMoves - moveCount) / maxMoves;
    if (efficiency >= 0.7)
      return { emoji: '🌟', text: 'Perfect', color: '#10b981' };
    if (efficiency >= 0.5)
      return { emoji: '🎯', text: 'Excellent', color: '#3b82f6' };
    if (efficiency >= 0.3)
      return { emoji: '👍', text: 'Good', color: '#8b5cf6' };
    return { emoji: '✅', text: 'Complete', color: '#6b7280' };
  }, [isWin, maxMoves, moveCount]);

  // Memoize style objects for better performance
  const overlayStyle = useMemo(
    () => ({
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)',
      overflowY: 'auto' as const,
      padding: isSmallScreen ? '1rem 0.75rem' : '2rem 1rem'
    }),
    [isSmallScreen]
  );

  const dialogStyle = useMemo(
    () => ({
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      borderRadius: '24px',
      padding: isSmallScreen ? '1.5rem' : '2rem',
      maxWidth: isSmallScreen ? '95vw' : '600px',
      width: '100%',
      maxHeight: isSmallScreen ? 'calc(100vh - 2rem)' : 'calc(100vh - 4rem)',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      position: 'relative' as const,
      textAlign: 'center' as const,
      marginTop: isSmallScreen ? '0.5rem' : '1rem',
      marginBottom: isSmallScreen ? '0.5rem' : '1rem',
      overflowY: 'auto' as const
    }),
    [isSmallScreen]
  );

  const closeButtonStyle = useMemo(
    () => ({
      position: 'absolute' as const,
      top: '1rem',
      right: '1rem',
      background: 'none',
      border: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer',
      opacity: 0.6,
      transition: 'opacity 0.2s'
    }),
    []
  );

  // Memoize text content
  const content = useMemo(
    () => ({
      title: isWin ? 'Congratulations!' : 'Game Over',
      description: isWin
        ? `You completed the Waffle puzzle in ${moveCount} moves!`
        : `Unfortunately, you've used all ${maxMoves} moves, but don't give up!`,
      emoji: isWin ? '🎉' : '😔',
      playAgain: 'Play Again',
      close: 'Close'
    }),
    [isWin, moveCount, maxMoves]
  );

  // Prepare share data
  const shareData = useMemo(
    () => ({
      gameStatus,
      moveCount,
      maxMoves,
      rating,
      totalGames,
      winRate,
      currentStreak
    }),
    [
      gameStatus,
      moveCount,
      maxMoves,
      rating,
      totalGames,
      winRate,
      currentStreak
    ]
  );

  return (
    <div style={overlayStyle}>
      <div style={dialogStyle}>
        {/* Close Button */}
        <button onClick={onClose} style={closeButtonStyle}>
          ✕
        </button>

        {/* Header Section */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: isSmallScreen ? '1rem' : '2rem'
          }}
        >
          {/* Result Icon */}
          <div
            style={{
              fontSize: isSmallScreen ? '3rem' : '4rem',
              marginBottom: isSmallScreen ? '0.5rem' : '1rem',
              lineHeight: '1'
            }}
          >
            {content.emoji}
          </div>

          {/* Title */}
          <h2
            style={{
              fontSize: isSmallScreen ? '1.75rem' : '2.25rem',
              fontWeight: 'bold',
              color: isWin ? '#10b981' : '#ef4444',
              margin: isSmallScreen ? '0 0 0.5rem 0' : '0 0 1rem 0',
              letterSpacing: '-0.025em'
            }}
          >
            {content.title}
          </h2>

          {/* Description */}
          <p
            style={{
              fontSize: isSmallScreen ? '1rem' : '1.125rem',
              color: '#6b7280',
              margin: '0',
              lineHeight: '1.6',
              fontWeight: '500'
            }}
          >
            {content.description}
          </p>
        </div>

        {/* Statistics Section */}
        <div style={{ marginBottom: isSmallScreen ? '1rem' : '2.5rem' }}>
          {/* Stats Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: isSmallScreen ? '0.75rem' : '1.25rem',
              marginBottom: isSmallScreen ? '1rem' : '1.75rem'
            }}
          >
            {/* Moves Used */}
            <div
              style={{
                backgroundColor: 'rgba(249, 250, 251, 0.8)',
                borderRadius: '16px',
                padding: isSmallScreen ? '1rem' : '1.75rem',
                textAlign: 'center',
                border: '1px solid rgba(229, 231, 235, 0.5)',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div
                style={{
                  fontSize: isSmallScreen ? '2rem' : '2.5rem',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '0.5rem'
                }}
              >
                {moveCount}
              </div>
              <div
                style={{
                  fontSize: isSmallScreen ? '0.75rem' : '0.875rem',
                  color: '#6b7280',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                Moves Used
              </div>
            </div>

            {/* Move Usage */}
            <div
              style={{
                backgroundColor: 'rgba(249, 250, 251, 0.8)',
                borderRadius: '16px',
                padding: isSmallScreen ? '1rem' : '1.75rem',
                textAlign: 'center',
                border: '1px solid rgba(229, 231, 235, 0.5)',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div
                style={{
                  fontSize: isSmallScreen ? '2rem' : '2.5rem',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '0.5rem'
                }}
              >
                {percentage}%
              </div>
              <div
                style={{
                  fontSize: isSmallScreen ? '0.75rem' : '0.875rem',
                  color: '#6b7280',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                Move Usage
              </div>
            </div>
          </div>

          {/* Performance Rating */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              padding: isSmallScreen ? '0.75rem 1rem' : '1.25rem 2rem',
              backgroundColor: rating.color + '15',
              borderRadius: '16px',
              border: `2px solid ${rating.color}30`,
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}
          >
            <span style={{ fontSize: isSmallScreen ? '1.5rem' : '1.75rem' }}>
              {rating.emoji}
            </span>
            <span
              style={{
                fontWeight: 'bold',
                color: rating.color,
                fontSize: isSmallScreen ? '1.125rem' : '1.25rem',
                letterSpacing: '-0.025em'
              }}
            >
              {rating.text}
            </span>
          </div>
        </div>

        {/* Action Section */}
        <div style={{ marginBottom: isSmallScreen ? '1rem' : '2rem' }}>
          {/* Share Button (only for wins) */}
          {isWin && (
            <div
              style={{ marginBottom: isSmallScreen ? '0.75rem' : '1.25rem' }}
            >
              <ShareDialog
                shareData={shareData}
                trigger={
                  <button
                    style={{
                      width: '100%',
                      padding: isSmallScreen ? '0.75rem 1rem' : '1.25rem 2rem',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '16px',
                      fontSize: isSmallScreen ? '1rem' : '1.125rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      letterSpacing: '-0.025em'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = '#059669';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow =
                        '0 8px 20px rgba(16, 185, 129, 0.4)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = '#10b981';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow =
                        '0 4px 12px rgba(16, 185, 129, 0.3)';
                    }}
                  >
                    🎉 Share My Victory!
                  </button>
                }
                title='Share Your Victory!'
                description='Show off your amazing Waffle game performance!'
              />
            </div>
          )}

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              gap: isSmallScreen ? '0.5rem' : '1rem',
              flexDirection: 'row'
            }}
          >
            <button
              onClick={onRestart}
              style={{
                flex: '1',
                padding: isSmallScreen ? '0.75rem 1rem' : '1.25rem 2rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                fontSize: isSmallScreen ? '0.9rem' : '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                letterSpacing: '-0.025em'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#2563eb';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow =
                  '0 6px 16px rgba(59, 130, 246, 0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#3b82f6';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 4px 12px rgba(59, 130, 246, 0.3)';
              }}
            >
              {content.playAgain}
            </button>

            <button
              onClick={onClose}
              style={{
                flex: '1',
                padding: isSmallScreen ? '0.75rem 1rem' : '1.25rem 2rem',
                backgroundColor: 'rgba(243, 244, 246, 0.8)',
                color: '#6b7280',
                border: '2px solid rgba(229, 231, 235, 0.8)',
                borderRadius: '16px',
                fontSize: isSmallScreen ? '0.9rem' : '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                letterSpacing: '-0.025em'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor =
                  'rgba(229, 231, 235, 0.8)';
                e.currentTarget.style.borderColor = 'rgba(209, 213, 219, 0.8)';
                e.currentTarget.style.color = '#374151';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor =
                  'rgba(243, 244, 246, 0.8)';
                e.currentTarget.style.borderColor = 'rgba(229, 231, 235, 0.8)';
                e.currentTarget.style.color = '#6b7280';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {content.close}
            </button>
          </div>
        </div>

        {/* Game Instructions */}
        {(!isSmallScreen ||
          typeof window === 'undefined' ||
          window.innerHeight >= 600) && (
          <div
            style={{
              padding: isSmallScreen ? '1rem' : '1.5rem',
              backgroundColor: 'rgba(245, 247, 250, 0.6)',
              borderRadius: '16px',
              fontSize: isSmallScreen ? '0.8125rem' : '0.875rem',
              color: '#6b7280',
              lineHeight: '1.6',
              border: '1px solid rgba(229, 231, 235, 0.5)',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: isSmallScreen ? '0.5rem' : '0.75rem'
              }}
            >
              <span style={{ fontSize: isSmallScreen ? '1rem' : '1.125rem' }}>
                💡
              </span>
              <strong
                style={{
                  color: '#374151',
                  fontSize: isSmallScreen ? '0.8125rem' : '0.875rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                How to Play
              </strong>
            </div>
            <p
              style={{
                margin: isSmallScreen ? '0 0 0.5rem 0' : '0 0 0.75rem 0',
                fontWeight: '500'
              }}
            >
              Waffle is a word swap puzzle. Swap letter positions to form 6
              valid English words (3 horizontal, 3 vertical).
            </p>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: isSmallScreen ? '0.125rem' : '0.25rem',
                fontSize: isSmallScreen ? '0.75rem' : '0.8125rem'
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <span
                  style={{
                    width: '1rem',
                    height: '1rem',
                    backgroundColor: '#10b981',
                    borderRadius: '50%',
                    display: 'inline-block'
                  }}
                ></span>
                <span>Green: Correct position</span>
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <span
                  style={{
                    width: '1rem',
                    height: '1rem',
                    backgroundColor: '#f59e0b',
                    borderRadius: '50%',
                    display: 'inline-block'
                  }}
                ></span>
                <span>Yellow: Letter exists but wrong position</span>
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <span
                  style={{
                    width: '1rem',
                    height: '1rem',
                    backgroundColor: '#9ca3af',
                    borderRadius: '50%',
                    display: 'inline-block'
                  }}
                ></span>
                <span>Gray: Letter doesn't exist</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
