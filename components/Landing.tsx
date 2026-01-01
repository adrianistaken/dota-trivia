'use client';

interface LandingProps {
  onStartRun: () => void;
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
        <div className="play-button-wrapper relative w-full max-w-md mx-auto">
          <button
            onClick={onStartRun}
            className="play-button relative w-full h-16 text-white font-bold text-xl uppercase tracking-wider cursor-pointer flex items-center justify-center"
            style={{
              backgroundImage: 'url(/images/dota2websitebackground.jpg)',
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
                backgroundColor: 'rgb(141 255 158)',
                mixBlendMode: 'soft-light',
              }}
            />
            {/* Additional subtle green filter layer */}
            <div 
              className="play-button-overlay-2 absolute inset-0 pointer-events-none transition-opacity duration-300"
              style={{
                backgroundColor: 'rgba(34, 197, 94, 0.15)',
                mixBlendMode: 'overlay',
              }}
            />
            {/* Button content */}
            <span className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-2xl">Play</span>
          </button>
        </div>
      </div>
    </div>
  );
}

