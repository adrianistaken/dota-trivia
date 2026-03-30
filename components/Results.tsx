'use client';

import { getBestScore, setBestScore } from '@/lib/utils/storage';

interface ResultsProps {
  finalScore: number;
  onNewRun: () => void;
}

export default function Results({ finalScore, onNewRun }: ResultsProps) {
  const bestScore = getBestScore();
  const newBestScore = setBestScore(finalScore);
  const isNewBest = newBestScore === finalScore && finalScore > 0;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div
        className="w-full max-w-md space-y-8 text-center p-8"
        style={{
          background: 'rgb(18 18 18)',
          border: '1px solid #4f4f4f3b',
          borderRadius: '10px',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(127, 176, 105, 0.05)',
        }}
      >
        <h1 className="text-3xl font-bold" style={{ color: '#f8fafc' }}>Run Complete</h1>

        <div className="space-y-6">
          <div>
            <div className="text-sm uppercase tracking-widest font-medium mb-2" style={{ color: '#94a3b8' }}>Final Score</div>
            <div className="text-5xl font-bold tabular-nums" style={{ color: '#7fb069' }}>
              {finalScore.toLocaleString()}
            </div>
          </div>

          <div
            className="pt-6"
            style={{ borderTop: '1px solid #4f4f4f3b' }}
          >
            <div className="text-sm uppercase tracking-widest font-medium mb-2" style={{ color: '#94a3b8' }}>Best Score</div>
            <div className="text-3xl font-bold tabular-nums" style={{ color: '#f8fafc' }}>
              {bestScore.toLocaleString()}
            </div>
            {isNewBest && (
              <div className="mt-2 text-sm font-semibold" style={{ color: '#7fb069' }}>New Best!</div>
            )}
          </div>
        </div>

        <button
          onClick={onNewRun}
          className="landing-btn w-full h-14 font-semibold text-base uppercase tracking-wider cursor-pointer flex items-center justify-center mt-4"
        >
          Start New Run
        </button>
      </div>
    </div>
  );
}
