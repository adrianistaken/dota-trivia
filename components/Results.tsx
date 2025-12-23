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
      <div className="w-full max-w-2xl space-y-8 text-center">
        <h1 className="text-4xl font-bold text-white">Run Complete!</h1>

        <div className="space-y-4">
          <div>
            <div className="text-lg text-gray-300">Final Score</div>
            <div className="text-5xl font-bold text-white">{finalScore.toLocaleString()}</div>
          </div>

          <div>
            <div className="text-lg text-gray-300">Best Score</div>
            <div className="text-3xl font-bold text-white">
              {bestScore.toLocaleString()}
            </div>
            {isNewBest && (
              <div className="mt-2 text-lg text-green-400">New Best! 🎉</div>
            )}
          </div>
        </div>

        <button
          onClick={onNewRun}
          className="rounded-lg bg-slate-700 px-8 py-4 text-xl font-semibold text-white transition-all hover:bg-slate-600 hover:shadow-lg active:scale-95"
        >
          Start New Run
        </button>
      </div>
    </div>
  );
}

