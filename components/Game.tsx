'use client';

import { Question as QuestionType, AnswerResult, RunState } from '@/lib/types/game';
import { calculatePoints } from '@/lib/utils/scoring';
import { useEffect, useState, useRef } from 'react';
import Question from './Question';

interface GameProps {
  questions: QuestionType[];
  onComplete: (answers: AnswerResult[], finalScore: number) => void;
}

export default function Game({ questions, onComplete }: GameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answers, setAnswers] = useState<AnswerResult[]>([]);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [startTimer, setStartTimer] = useState(false);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswer = (selectedAnswer: 'A' | 'B' | 'C' | 'D', timeRemaining: number) => {
    const correct = selectedAnswer === currentQuestion.correctAnswer;
    const earned = calculatePoints(correct, timeRemaining, streak);

    const answerResult: AnswerResult = {
      questionId: currentQuestion.id,
      selectedAnswer,
      correct,
      timeRemaining,
      pointsEarned: earned,
    };

    const newAnswers = [...answers, answerResult];
    setAnswers(newAnswers);
    setPointsEarned(earned);

    if (correct) {
      setScore((prev) => prev + earned);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }

    // Move to next question or complete
    if (isLastQuestion) {
      setTimeout(() => {
        onComplete(newAnswers, score + earned);
      }, 3500);
    } else {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
        setPointsEarned(0);
      }, 3500);
    }
  };

  const handleTimeout = () => {
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
    setPointsEarned(0);

    // Move to next question or complete
    if (isLastQuestion) {
      setTimeout(() => {
        onComplete(newAnswers, score);
      }, 3500);
    } else {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
        setPointsEarned(0);
      }, 3500);
    }
  };

  // Reset state when questions change
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setStreak(0);
    setAnswers([]);
    setPointsEarned(0);
    setStartTimer(false);
  }, [questions]);

  // Start timer when component is mounted and visible (after transition)
  // This ensures the timer only starts after the screen transition completes
  useEffect(() => {
    // Small delay to ensure transition has completed and content is visible
    const timer = setTimeout(() => {
      setStartTimer(true);
    }, 50); // Small delay to ensure DOM is ready and transition is complete

    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      ref={gameContainerRef}
      className="animate-fade-in"
    >
      <Question
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        currentScore={score}
        pointsEarned={pointsEarned}
        onAnswer={handleAnswer}
        onTimeout={handleTimeout}
        startTimer={startTimer}
      />
    </div>
  );
}

