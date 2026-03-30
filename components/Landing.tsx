'use client';

import { GameMode } from '@/lib/types/game';

interface LandingProps {
  onStartRun: (mode: GameMode) => void;
  isTransitioning?: boolean;
}

export default function Landing({ onStartRun, isTransitioning = false }: LandingProps) {
  return (
    <div className={`relative flex min-h-screen flex-col items-center justify-center px-4 transition-opacity duration-700 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      <div className="w-full max-w-2xl text-center">
        <img src="/images/dota2trivialogo.png" alt="Dota 2 Trivia Logo" className="w-40 h-40 mx-auto mb-6" />
        <h1 className="mb-6 text-5xl font-bold text-white uppercase">Dota 2 Trivia</h1>
        <p className="mb-12 text-lg text-gray-300">
          Test your Dota 2 knowledge with quick-fire questions. Answer as many questions
          as you can - the game continues until you're done!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl mx-auto">
          {/* 10-Question Run Button */}
          <div className="flex-1 flex flex-col items-center">
            <div className="play-button-wrapper relative w-full max-w-md">
              <button
                onClick={() => onStartRun('limited')}
                className="play-button relative w-full h-16 text-white font-bold text-xl uppercase tracking-wider cursor-pointer flex items-center justify-center"
                style={{
                  backgroundImage: 'url(/images/backgrounds/dota2websitebackground.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.9), 0 0 10px rgba(0, 0, 0, 0.6), 0 1px 0 rgba(255, 255, 255, 0.1)',
                  overflow: 'hidden',
                }}
              >
                {/* Green tint overlay - lighter to show more texture while maintaining green hue */}
                <div 
                  className="play-button-overlay absolute inset-0 transition-all duration-300 pointer-events-none"
                  style={{
                    backgroundColor: 'rgb(120 220 140)',
                    mixBlendMode: 'soft-light',
                  }}
                />
                {/* Additional subtle green filter layer */}
                <div 
                  className="play-button-overlay-2 absolute inset-0 pointer-events-none transition-opacity duration-300"
                  style={{
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    mixBlendMode: 'overlay',
                  }}
                />
                {/* Button content */}
                <span className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-2xl">10-Question Run</span>
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-400 max-w-md">Answer 10 questions. See your final score.</p>
          </div>

          {/* Endless Mode Button */}
          <div className="flex-1 flex flex-col items-center">
            <div className="play-button-wrapper relative w-full max-w-md">
              <button
                onClick={() => onStartRun('endless')}
                className="play-button relative w-full h-16 text-white font-bold text-xl uppercase tracking-wider cursor-pointer flex items-center justify-center"
                style={{
                  backgroundImage: 'url(/images/backgrounds/dota2websitebackground.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.9), 0 0 10px rgba(0, 0, 0, 0.6), 0 1px 0 rgba(255, 255, 255, 0.1)',
                  overflow: 'hidden',
                }}
              >
                {/* Orangish brown tint overlay */}
                <div 
                  className="play-button-overlay absolute inset-0 transition-all duration-300 pointer-events-none"
                  style={{
                    backgroundColor: 'rgb(220 160 120)',
                    mixBlendMode: 'soft-light',
                  }}
                />
                {/* Additional subtle brown filter layer */}
                <div 
                  className="play-button-overlay-2 absolute inset-0 pointer-events-none transition-opacity duration-300"
                  style={{
                    backgroundColor: 'rgba(180, 83, 9, 0.1)',
                    mixBlendMode: 'overlay',
                  }}
                />
                {/* Button content */}
                <span className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-2xl">Endless Mode</span>
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-400 max-w-md">Play until you miss. How long can you last?</p>
          </div>
        </div>
      </div>
    </div>
  );
}

