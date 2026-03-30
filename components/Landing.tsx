'use client';

import { GameMode } from '@/lib/types/game';
import ShootingStars from './ShootingStars';

interface LandingProps {
  onStartRun: (mode: GameMode) => void;
  isTransitioning?: boolean;
}

export default function Landing({ onStartRun, isTransitioning = false }: LandingProps) {
  return (
    <div className={`relative flex min-h-screen flex-col items-center justify-center px-4 transition-opacity duration-700 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      <ShootingStars />
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Title with inline logo */}
        <div className="flex items-center gap-4 mb-6">
          <h1 className="text-5xl sm:text-6xl font-bold uppercase tracking-tight text-white">
            DOTA 2
          </h1>
          <img src="/images/dota2trivialogo.png" alt="Dota 2 Trivia Logo" className="w-24 h-24 sm:w-28 sm:h-28" />
          <h1 className="text-5xl sm:text-6xl font-bold uppercase tracking-tight text-white">
            TRIVIA
          </h1>
        </div>

        <p className="mb-10 text-base" style={{ color: '#94a3b8' }}>
          Test your Dota 2 knowledge with quick-fire questions.
          <br />
          Answer as many questions as you can!
        </p>

        {/* Single Play button — launches endless mode */}
        <button
          onClick={() => onStartRun('endless')}
          className="play-btn cursor-pointer"
        >
          PLAY
        </button>
      </div>
    </div>
  );
}
