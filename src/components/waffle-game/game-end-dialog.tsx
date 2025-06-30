import React, { memo, useMemo, useCallback } from 'react';

interface GameEndDialogProps {
  isOpen: boolean;
  gameStatus: 'won' | 'lost';
  moveCount: number;
  maxMoves: number;
  onRestart: () => void;
  onNewGame: () => void;
  onClose: () => void;
}

export const GameEndDialog = memo(function GameEndDialog({
  isOpen,
  gameStatus,
  moveCount,
  maxMoves,
  onRestart,
  onNewGame,
  onClose
}: GameEndDialogProps) {
  if (!isOpen) return null;

  const isWin = useMemo(() => gameStatus === 'won', [gameStatus]);
  const percentage = useMemo(() => Math.round((moveCount / maxMoves) * 100), [moveCount, maxMoves]);

  // Calculate performance rating
  const rating = useMemo(() => {
    if (!isWin) return { emoji: '💔', text: 'Incomplete', color: '#ef4444' };

    const efficiency = (maxMoves - moveCount) / maxMoves;
    if (efficiency >= 0.7) return { emoji: '🌟', text: 'Perfect', color: '#10b981' };
    if (efficiency >= 0.5) return { emoji: '🎯', text: 'Excellent', color: '#3b82f6' };
    if (efficiency >= 0.3) return { emoji: '👍', text: 'Good', color: '#8b5cf6' };
    return { emoji: '✅', text: 'Complete', color: '#6b7280' };
  }, [isWin, maxMoves, moveCount]);

  // Memoize style objects for better performance
  const overlayStyle = useMemo(() => ({
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)'
  }), []);

  const dialogStyle = useMemo(() => ({
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    borderRadius: '24px',
    padding: '2.5rem',
    maxWidth: '480px',
    width: '90%',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    position: 'relative' as const,
    textAlign: 'center' as const
  }), []);

  const closeButtonStyle = useMemo(() => ({
    position: 'absolute' as const,
    top: '1rem',
    right: '1rem',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    opacity: 0.6,
    transition: 'opacity 0.2s'
  }), []);

  const titleStyle = useMemo(() => ({
    fontSize: '3rem',
    marginBottom: '1rem'
  }), []);

  const headingStyle = useMemo(() => ({
    fontSize: '2rem',
    fontWeight: 'bold',
    color: isWin ? '#10b981' : '#ef4444',
    margin: '0 0 1rem 0'
  }), [isWin]);

  const descriptionStyle = useMemo(() => ({
    fontSize: '1.1rem',
    color: '#6b7280',
    marginBottom: '2rem',
    lineHeight: '1.6'
  }), []);

  const statsContainerStyle = useMemo(() => ({
    background: 'rgba(249, 250, 251, 0.8)',
    borderRadius: '16px',
    padding: '1.5rem',
    marginBottom: '2rem',
    border: '1px solid rgba(229, 231, 235, 0.8)'
  }), []);

  const statsGridStyle = useMemo(() => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem',
    marginBottom: '1rem'
  }), []);

  const statNumberStyle = useMemo(() => ({
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1f2937'
  }), []);

  const statLabelStyle = useMemo(() => ({
    fontSize: '0.9rem',
    color: '#6b7280'
  }), []);

  const ratingStyle = useMemo(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.75rem',
    backgroundColor: rating.color + '20',
    borderRadius: '12px',
    border: `2px solid ${rating.color}40`
  }), [rating.color]);

  const ratingEmojiStyle = useMemo(() => ({
    fontSize: '1.5rem'
  }), []);

  const ratingTextStyle = useMemo(() => ({
    fontWeight: 'bold',
    color: rating.color,
    fontSize: '1.1rem'
  }), [rating.color]);

  // Memoize text content
  const content = useMemo(() => ({
    title: isWin ? 'Congratulations!' : 'Game Over',
    description: isWin
      ? `You completed the Waffle puzzle in ${moveCount} moves!`
      : `Unfortunately, you've used all ${maxMoves} moves, but don't give up!`,
    emoji: isWin ? '🎉' : '😔',
    playAgain: 'Play Again',
    close: 'Close'
  }), [isWin, moveCount, maxMoves]);

  // Memoize button styles
  const buttonContainerStyle = useMemo(() => ({
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center'
  }), []);

  const primaryButtonStyle = useMemo(() => ({
    padding: '0.75rem 2rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
  }), []);

  const secondaryButtonStyle = useMemo(() => ({
    padding: '0.75rem 2rem',
    backgroundColor: 'transparent',
    color: '#6b7280',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }), []);

  return (
    <div style={overlayStyle}>
      <div style={dialogStyle}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={closeButtonStyle}
        >
          ✕
        </button>

        {/* Result Title */}
        <div style={titleStyle}>
          {content.emoji}
        </div>

        <h2 style={headingStyle}>
          {content.title}
        </h2>

        <p style={descriptionStyle}>
          {content.description}
        </p>

        {/* Statistics */}
        <div style={statsContainerStyle}>
          <div style={statsGridStyle}>
            <div>
              <div style={statNumberStyle}>
                {moveCount}
              </div>
              <div style={statLabelStyle}>
                Moves Used
              </div>
            </div>
            <div>
              <div style={statNumberStyle}>
                {percentage}%
              </div>
              <div style={statLabelStyle}>
                Move Usage
              </div>
            </div>
          </div>

          {/* Performance Rating */}
          <div style={ratingStyle}>
            <span style={ratingEmojiStyle}>{rating.emoji}</span>
            <span style={ratingTextStyle}>
              {rating.text}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div style={buttonContainerStyle}>
          <button
            onClick={onRestart}
            style={primaryButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2563eb';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#3b82f6';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {content.playAgain}
          </button>

          <button
            onClick={onClose}
            style={secondaryButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#d1d5db';
              e.currentTarget.style.color = '#374151';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.color = '#6b7280';
            }}
          >
            {content.close}
          </button>
        </div>

        {/* Game Instructions */}
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: 'rgba(245, 247, 250, 0.8)',
          borderRadius: '12px',
          fontSize: '0.9rem',
          color: '#6b7280',
          lineHeight: '1.5'
        }}>
          <strong style={{ color: '#374151' }}>💡 How to Play:</strong><br/>
          Waffle is a word swap puzzle. Swap letter positions to form 6 valid English words (3 horizontal, 3 vertical).
          <br/>
          🟢 Green: Correct position | 🟡 Yellow: Letter exists but wrong position | ⚪ Gray: Letter doesn't exist
        </div>
      </div>
    </div>
  );
});
