import { SquareNumber, Tile } from '@/types';
import { getColorClass } from './game-constants';
import { memo, useMemo, useCallback } from 'react';

interface GameTileProps {
  tile: Tile;
  position: SquareNumber;
  isSelected: boolean;
  isAnimating: boolean;
  justSwapped: boolean;
  onTileClick: (position: SquareNumber) => void;
}

export const GameTile = memo(function GameTile({
  tile,
  position,
  isSelected,
  isAnimating,
  justSwapped,
  onTileClick
}: GameTileProps) {
  const colorClass = getColorClass(tile.color);

  // Combine CSS class names
  const tileClasses = useMemo(() => [
    'dynamic-waffle-tile',
    // Color state class
    colorClass,
    // Selected state
    isSelected && 'selected',
    // Animation state
    isAnimating && 'animating',
    // Just swapped
    justSwapped && 'just-swapped'
  ].filter(Boolean).join(' '), [colorClass, isSelected, isAnimating, justSwapped]);

  const handleClick = useCallback(() => {
    // Prevent clicks during animation
    if (isAnimating) {
      console.log(`🚫 Tile ${position}(${tile.letter}) is animating, ignoring click`);
      return;
    }

    console.log(`🎯 Clicked tile ${position}(${tile.letter}) - Color: ${tile.color}, Classes: ${tileClasses}`);
    onTileClick(position);
  }, [isAnimating, position, tile.letter, tile.color, tileClasses, onTileClick]);

  // Debug logging - Show state changes in development environment
  if (process.env.NODE_ENV === 'development') {
    if (isSelected || isAnimating || justSwapped) {
      console.log(`🔄 Tile ${position}(${tile.letter}) state: selected=${isSelected}, animating=${isAnimating}, justSwapped=${justSwapped}`);
    }
  }

  return (
    <button
      className={tileClasses}
      onClick={handleClick}
      // Accessibility support
      aria-label={`Letter ${tile.letter} at position ${position}${isSelected ? ', selected' : ''}${isAnimating ? ', animating' : ''}`}
      // Disable during animation
      disabled={isAnimating}
      // Add data attributes for debugging
      data-position={position}
      data-letter={tile.letter}
      data-color={tile.color}
      data-selected={isSelected}
      data-animating={isAnimating}
    >
      {tile.letter}
    </button>
  );
});
