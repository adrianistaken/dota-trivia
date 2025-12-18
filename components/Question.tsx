'use client';

import { Question as QuestionType } from '@/lib/types/game';
import { useEffect, useState } from 'react';

interface QuestionProps {
  question: QuestionType;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: 'A' | 'B' | 'C' | 'D', timeRemaining: number) => void;
  onTimeout: () => void;
}

const TIMER_DURATION = 10; // seconds

export default function Question({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onTimeout,
}: QuestionProps) {
  const [timeRemaining, setTimeRemaining] = useState(TIMER_DURATION);
  const [answered, setAnswered] = useState(false);

  // Reset timer when question changes
  useEffect(() => {
    setTimeRemaining(TIMER_DURATION);
    setAnswered(false);
  }, [question.id]);

  useEffect(() => {
    if (answered) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setAnswered(true);
          setTimeout(() => onTimeout(), 100);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [answered, onTimeout, question.id]);

  const handleAnswer = (answer: 'A' | 'B' | 'C' | 'D') => {
    if (answered) return;
    setAnswered(true);
    onAnswer(answer, timeRemaining);
  };

  const formatTime = (seconds: number): string => {
    return `0:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top Banner */}
      <div className="bg-purple-900 px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <h2 className="text-xl font-semibold text-white">QUEUE TIME TRIVIA</h2>
          <div className="text-xl font-semibold text-white">
            Question {questionNumber}/{totalQuestions}
          </div>
        </div>
      </div>

      {/* Question Area - Centered with lots of space */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        {/* Glossy Card Container */}
        <div className="relative w-full max-w-2xl">
          <div
            className="rounded-2xl border border-purple-500/20 bg-gradient-to-b from-purple-900/90 to-purple-950/90 p-8 shadow-2xl backdrop-blur-sm"
            style={{
              boxShadow:
                '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
            }}
          >
            <div className="space-y-6">
              {/* Question Text */}
              <h3 className="text-center text-xl font-medium text-white">
                {question.question}
              </h3>

              {/* Lore Box (if present) */}
              {question.lore && (
                <div className="rounded-lg bg-black/30 px-4 py-3 backdrop-blur-sm">
                  <p className="text-center text-sm italic text-white/90">
                    {question.lore}
                  </p>
                </div>
              )}

              {/* Answer Options - 2x2 Grid */}
              <div className="grid grid-cols-2 gap-3">
                {(['A', 'B', 'C', 'D'] as const).map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    disabled={answered}
                    className="group relative flex items-center gap-3 rounded-lg border border-purple-600/40 bg-purple-900/40 p-3 text-left backdrop-blur-sm transition-all hover:border-purple-400/60 hover:bg-purple-800/50 disabled:cursor-not-allowed disabled:opacity-50"
                    style={{
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white shadow-md group-hover:bg-purple-500">
                      {option}
                    </span>
                    <span className="flex-1 text-base text-white">
                      {question.options[option]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Timer - Outside card but centered */}
          <div className="mt-6 flex flex-col items-center gap-1">
            <div className="text-3xl font-bold text-purple-400">
              {formatTime(timeRemaining)}
            </div>
            <div className="text-xs text-gray-400">TIME REMAINING</div>
          </div>
        </div>
      </div>
    </div>
  );
}

