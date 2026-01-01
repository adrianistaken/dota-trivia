'use client';

import { useState } from 'react';
import { GameState } from '@/lib/types/game';
import Landing from '@/components/Landing';
import Game from '@/components/Game';

export default function Home() {
  const [gameState, setGameState] = useState<GameState>('landing');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleStartRun = () => {
    // Start transition animation
    setIsTransitioning(true);
    
    // After transition completes, switch to playing state
    setTimeout(() => {
      setGameState('playing');
      setIsTransitioning(false);
    }, 700); // Match transition duration
  };

  if (gameState === 'landing') {
    return <Landing onStartRun={handleStartRun} isTransitioning={isTransitioning} />;
  }

  if (gameState === 'playing') {
    return <Game />;
  }

  return null;
}
