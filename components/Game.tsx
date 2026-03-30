'use client';

import { Question as QuestionType, AnswerResult, GameMode } from '@/lib/types/game';
import { calculatePoints } from '@/lib/utils/scoring';
import { generateNextQuestion } from '@/lib/data/generators/engine';
import { useEffect, useState, useRef, useCallback } from 'react';
import Question from './Question';

interface GameProps {
  gameMode: GameMode;
  onComplete?: (answers: AnswerResult[], finalScore: number) => void;
}

export default function Game({ gameMode, onComplete }: GameProps) {
  const [currentQuestion, setCurrentQuestion] = useState<QuestionType | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answers, setAnswers] = useState<AnswerResult[]>([]);
  const [scoreBreakdown, setScoreBreakdown] = useState<ReturnType<typeof calculatePoints>>(null);
  const [startTimer, setStartTimer] = useState(false);
  const lastCategoryRef = useRef<'cooldown' | 'ability' | 'item' | undefined>(undefined);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  
  const totalQuestions = gameMode === 'limited' ? 10 : undefined;

  const generateNewQuestion = useCallback(() => {
    const newQuestion = generateNextQuestion(lastCategoryRef.current);
    if (newQuestion) {
      setCurrentQuestion(newQuestion);
      lastCategoryRef.current = newQuestion.category as 'cooldown' | 'ability' | 'item';
      setStartTimer(false);
      // Small delay to ensure transition completes before starting timer
      setTimeout(() => {
        setStartTimer(true);
      }, 50);
    } else {
      console.error('Failed to generate new question');
    }
  }, []);

  const handleAnswer = (selectedAnswer: 'A' | 'B' | 'C' | 'D', timeRemaining: number) => {
    if (!currentQuestion) return;
    
    const correct = selectedAnswer === currentQuestion.correctAnswer;
    const breakdown = calculatePoints(correct, timeRemaining, streak);
    const earned = breakdown?.total ?? 0;

    const answerResult: AnswerResult = {
      questionId: currentQuestion.id,
      selectedAnswer,
      correct,
      timeRemaining,
      pointsEarned: earned,
      scoreBreakdown: breakdown ?? undefined,
    };

    const newAnswers = [...answers, answerResult];
    setAnswers(newAnswers);
    setScoreBreakdown(breakdown);

    if (correct) {
      setScore((prev) => prev + earned);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }

    // Check if game should end (limited mode after 10 questions)
    const nextQuestionNumber = questionNumber + 1;
    if (gameMode === 'limited' && nextQuestionNumber > 10) {
      // End game after delay
      setTimeout(() => {
        if (onComplete) {
          onComplete(newAnswers, score + earned);
        }
      }, 3500);
      return;
    }

    // Move to next question after delay
    setTimeout(() => {
      setQuestionNumber((prev) => prev + 1);
      setScoreBreakdown(null);
      generateNewQuestion();
    }, 3500);
  };

  const handleTimeout = () => {
    if (!currentQuestion) return;
    
    const answerResult: AnswerResult = {
      questionId: currentQuestion.id,
      selectedAnswer: null,
      correct: false,
      timeRemaining: 0,
      pointsEarned: 0,
    };

    const newAnswers = [...answers, answerResult];
    setAnswers(newAnswers);
    setStreak(0);
    setScoreBreakdown(null);

    // Check if game should end (limited mode after 10 questions)
    const nextQuestionNumber = questionNumber + 1;
    if (gameMode === 'limited' && nextQuestionNumber > 10) {
      // End game after delay
      setTimeout(() => {
        if (onComplete) {
          onComplete(newAnswers, score);
        }
      }, 3500);
      return;
    }

    // Move to next question after delay
    setTimeout(() => {
      setQuestionNumber((prev) => prev + 1);
      setScoreBreakdown(null);
      generateNewQuestion();
    }, 3500);
  };

  // Initialize first question when component mounts
  useEffect(() => {
    setScore(0);
    setStreak(0);
    setAnswers([]);
    setScoreBreakdown(null);
    setQuestionNumber(1);
    lastCategoryRef.current = undefined;
    generateNewQuestion();
  }, [generateNewQuestion, gameMode]);

  // Start timer when a new question is loaded
  useEffect(() => {
    if (currentQuestion) {
      // Small delay to ensure transition has completed and content is visible
      const timer = setTimeout(() => {
        setStartTimer(true);
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [currentQuestion]);

  if (!currentQuestion) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-white">Loading question...</div>
      </div>
    );
  }

  return (
    <div 
      ref={gameContainerRef}
      className="animate-fade-in"
    >
      <Question
        question={currentQuestion}
        questionNumber={questionNumber}
        totalQuestions={totalQuestions}
        currentScore={score}
        scoreBreakdown={scoreBreakdown}
        onAnswer={handleAnswer}
        onTimeout={handleTimeout}
        startTimer={startTimer}
      />
    </div>
  );
}

