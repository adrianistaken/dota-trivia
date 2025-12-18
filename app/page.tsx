'use client';

import { useState } from 'react';
import { GameState, Question, AnswerResult } from '@/lib/types/game';
import { getRandomQuestions } from '@/lib/data/questions';
import Landing from '@/components/Landing';
import Game from '@/components/Game';
import Results from '@/components/Results';

export default function Home() {
  const [gameState, setGameState] = useState<GameState>('landing');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [finalScore, setFinalScore] = useState(0);
  const [answers, setAnswers] = useState<AnswerResult[]>([]);

  const handleStartRun = () => {
    const randomQuestions = getRandomQuestions();
    setQuestions(randomQuestions);
    setGameState('playing');
    setFinalScore(0);
    setAnswers([]);
  };

  const handleGameComplete = (finalAnswers: AnswerResult[], score: number) => {
    setAnswers(finalAnswers);
    setFinalScore(score);
    setGameState('results');
  };

  const handleNewRun = () => {
    setGameState('landing');
  };

  if (gameState === 'landing') {
    return <Landing onStartRun={handleStartRun} />;
  }

  if (gameState === 'playing') {
    return <Game questions={questions} onComplete={handleGameComplete} />;
  }

  if (gameState === 'results') {
    return <Results finalScore={finalScore} onNewRun={handleNewRun} />;
  }

  return null;
}
