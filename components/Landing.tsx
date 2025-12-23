interface LandingProps {
  onStartRun: () => void;
}

export default function Landing({ onStartRun }: LandingProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-2xl text-center">
        <h1 className="mb-6 text-5xl font-bold text-white">Queue Time Trivia</h1>
        <p className="mb-12 text-lg text-gray-300">
          Test your Dota 2 knowledge with quick-fire questions. Answer 10 questions
          as fast as you can to maximize your score!
        </p>
        <button
          onClick={onStartRun}
          className="rounded-lg bg-slate-700 px-8 py-4 text-xl font-semibold text-white transition-all hover:bg-slate-600 hover:shadow-lg active:scale-95 cursor-pointer"
        >
          Start Run
        </button>
      </div>
    </div>
  );
}

