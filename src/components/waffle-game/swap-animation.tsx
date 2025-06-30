import { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import { SquareNumber, Letter } from '@/types';

interface SwapAnimationProps {
  fromPos: SquareNumber;
  toPos: SquareNumber;
  fromLetter: Letter;
  toLetter: Letter;
  onComplete: () => void;
}

interface AnimBlockStyle {
  width: number;
  height: number;
  fontSize: string;
  initialTransform: string;
}

interface AnimState {
  aTransform: string;
  bTransform: string;
  aOpacity: number;
  bOpacity: number;
}

export function SwapAnimation({
  fromPos,
  toPos,
  fromLetter,
  toLetter,
  onComplete
}: SwapAnimationProps) {
  const animationFrameRef = useRef<number>();
  const [blockAStyle, setBlockAStyle] = useState<AnimBlockStyle | null>(null);
  const [blockBStyle, setBlockBStyle] = useState<AnimBlockStyle | null>(null);
  const [animState, setAnimState] = useState<AnimState>({
    aTransform: '', bTransform: '', aOpacity: 0, bOpacity: 0
  });

  // 动画配置
  const animationConfig = useMemo(() => ({
    duration: 700,
    minArcHeight: 40,
    maxArcHeight: 100,
    arcHeightRatio: 0.4,
    rotationDegrees: 360,
    scaleMultiplier: 0.3,
    delayBeforeStart: 50,
    positionSetupDelay: 16
  }), []);

  // 计算初始样式
  const prepareAnimation = useCallback(() => {
    const gameBoard = document.querySelector('.game-board');
    if (!gameBoard) return false;
    let fromButton = gameBoard.querySelector(`button[data-position="${fromPos}"]`) as HTMLElement | null;
    let toButton = gameBoard.querySelector(`button[data-position="${toPos}"]`) as HTMLElement | null;
    if (!fromButton || !toButton) {
      const allButtons = gameBoard.querySelectorAll('button.dynamic-waffle-tile');
      fromButton = allButtons[fromPos] as HTMLElement | null;
      toButton = allButtons[toPos] as HTMLElement | null;
    }
    if (!fromButton || !toButton) return false;
    const fromRect = fromButton.getBoundingClientRect();
    const toRect = toButton.getBoundingClientRect();
    const gameBoardRect = gameBoard.getBoundingClientRect();
    const tileSize = Math.min(fromRect.width, fromRect.height);
    const fontSize = getComputedStyle(fromButton).fontSize;
    // 计算初始位置
    const fromX = fromRect.left - gameBoardRect.left + fromRect.width / 2;
    const fromY = fromRect.top - gameBoardRect.top + fromRect.height / 2;
    const toX = toRect.left - gameBoardRect.left + toRect.width / 2;
    const toY = toRect.top - gameBoardRect.top + toRect.height / 2;
    // 初始transform
    const initialATransform = `translate(${fromX - tileSize / 2}px, ${fromY - tileSize / 2}px)`;
    const initialBTransform = `translate(${toX - tileSize / 2}px, ${toY - tileSize / 2}px)`;
    setBlockAStyle({ width: tileSize, height: tileSize, fontSize, initialTransform: initialATransform });
    setBlockBStyle({ width: tileSize, height: tileSize, fontSize, initialTransform: initialBTransform });
    setAnimState({
      aTransform: initialATransform,
      bTransform: initialBTransform,
      aOpacity: 1,
      bOpacity: 1
    });
    // 返回所有动画参数
    return {
      fromX, fromY, toX, toY, tileSize
    };
  }, [fromPos, toPos]);

  // 动画主逻辑
  const startAnimation = useCallback(() => {
    const params = prepareAnimation();
    if (!params) {
      onComplete();
      return;
    }
    const { fromX, fromY, toX, toY, tileSize } = params;
    const deltaX = toX - fromX;
    const deltaY = toY - fromY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const arcHeight = Math.max(
      animationConfig.minArcHeight,
      Math.min(distance * animationConfig.arcHeightRatio, animationConfig.maxArcHeight)
    );
    const startTime = performance.now();
    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / animationConfig.duration, 1);
      // 缓动
      const eased = progress < 0.5
        ? 8 * progress * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 4) / 2;
      // A: from → to
      const currentAX = fromX + deltaX * eased - tileSize / 2;
      const currentAY = fromY + deltaY * eased - arcHeight * Math.sin(Math.PI * progress) - tileSize / 2;
      const aRotation = progress * animationConfig.rotationDegrees;
      const aScale = 1 + Math.sin(Math.PI * progress) * animationConfig.scaleMultiplier;
      // B: to → from
      const currentBX = toX - deltaX * eased - tileSize / 2;
      const currentBY = toY - deltaY * eased - arcHeight * Math.sin(Math.PI * progress) - tileSize / 2;
      const bRotation = -progress * animationConfig.rotationDegrees;
      const bScale = 1 + Math.sin(Math.PI * progress) * animationConfig.scaleMultiplier;
      setAnimState({
        aTransform: `translate(${currentAX}px, ${currentAY}px) rotate(${aRotation}deg) scale(${aScale})`,
        bTransform: `translate(${currentBX}px, ${currentBY}px) rotate(${bRotation}deg) scale(${bScale})`,
        aOpacity: 1,
        bOpacity: 1
      });
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          setAnimState(s => ({ ...s, aOpacity: 0, bOpacity: 0 }));
          onComplete();
        }, 100);
      }
    }
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [prepareAnimation, animationConfig, onComplete]);

  useEffect(() => {
    setBlockAStyle(null);
    setBlockBStyle(null);
    setAnimState({ aTransform: '', bTransform: '', aOpacity: 0, bOpacity: 0 });
    const timer = setTimeout(() => {
      startAnimation();
    }, animationConfig.delayBeforeStart);
    return () => {
      clearTimeout(timer);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [startAnimation, animationConfig.delayBeforeStart]);

  // 统一的动画块样式
  const baseBlockStyle = useMemo(() => ({
    position: 'absolute' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    color: '#fff',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)',
    textAlign: 'center' as const,
    fontFamily: 'inherit',
    pointerEvents: 'none' as const,
    zIndex: 1000,
    border: '2.5px solid #0284c7',
    background: 'linear-gradient(135deg, #7dd3fc 0%, #0ea5e9 100%)',
    transition: 'none',
    willChange: 'transform, opacity'
  }), []);

  return (
    <div className="absolute inset-0 pointer-events-none z-50" style={{ overflow: 'visible' }}>
      {blockAStyle && (
        <div
          style={{
            ...baseBlockStyle,
            width: blockAStyle.width,
            height: blockAStyle.height,
            fontSize: blockAStyle.fontSize,
            transform: animState.aTransform || blockAStyle.initialTransform,
            opacity: animState.aOpacity,
            border: '2.5px solid #0284c7',
            background: 'linear-gradient(135deg, #7dd3fc 0%, #0ea5e9 100%)'
          }}
        >
          {fromLetter}
        </div>
      )}
      {blockBStyle && (
        <div
          style={{
            ...baseBlockStyle,
            width: blockBStyle.width,
            height: blockBStyle.height,
            fontSize: blockBStyle.fontSize,
            transform: animState.bTransform || blockBStyle.initialTransform,
            opacity: animState.bOpacity,
            border: '2.5px solid #2563eb',
            background: 'linear-gradient(135deg, #93c5fd 0%, #3b82f6 100%)'
          }}
        >
          {toLetter}
        </div>
      )}
    </div>
  );
}
