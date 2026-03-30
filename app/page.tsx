'use client';

import { useState } from 'react';
import { GameState, GameMode } from '@/lib/types/game';
import Landing from '@/components/Landing';
import Game from '@/components/Game';
import Results from '@/components/Results';

export default function Home() {
  const [gameState, setGameState] = useState<GameState>('landing');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>('limited');
  const [finalScore, setFinalScore] = useState(0);


  const handleStartRun = (mode: GameMode) => {
    setGameMode(mode);
    // Start transition animation
    setIsTransitioning(true);

    // After transition completes, switch to playing state
    setTimeout(() => {
      setGameState('playing');
      setIsTransitioning(false);
    }, 700); // Match transition duration
  };

  const handleGameComplete = (answers: any[], score: number) => {
    setFinalScore(score);
    setGameState('results');
  };

  const handleNewRun = () => {
    setGameState('landing');
    setFinalScore(0);
  };

  return (
    <>
      {/* Background */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: 'url(/images/backgrounds/dota2websitebackground.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      />
      {/* Dark overlay for readability */}
      <div className="fixed inset-0 -z-10 bg-black/20" />

      {gameState === 'landing' && (
        <Landing onStartRun={handleStartRun} isTransitioning={isTransitioning} />
      )}
      {gameState === 'playing' && (
        <Game gameMode={gameMode} onComplete={handleGameComplete} />
      )}
      {gameState === 'results' && (
        <Results finalScore={finalScore} onNewRun={handleNewRun} />
      )}
    </>
  );
}
