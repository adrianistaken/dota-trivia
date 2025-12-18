'use client';

import { Question as QuestionType, AnswerResult, RunState } from '@/lib/types/game';
import { calculatePoints } from '@/lib/utils/scoring';
import { useEffect, useState } from 'react';
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

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswer = (selectedAnswer: 'A' | 'B' | 'C' | 'D', timeRemaining: number) => {
    const correct = selectedAnswer === currentQuestion.correctAnswer;
    const pointsEarned = calculatePoints(correct, timeRemaining, streak);

    const answerResult: AnswerResult = {
      questionId: currentQuestion.id,
      selectedAnswer,
      correct,
      timeRemaining,
      pointsEarned,
    };

    const newAnswers = [...answers, answerResult];
    setAnswers(newAnswers);

    if (correct) {
      setScore((prev) => prev + pointsEarned);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }

    // Move to next question or complete
    if (isLastQuestion) {
      setTimeout(() => {
        onComplete(newAnswers, score + pointsEarned);
      }, 500);
    } else {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 500);
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

    // Move to next question or complete
    if (isLastQuestion) {
      setTimeout(() => {
        onComplete(newAnswers, score);
      }, 500);
    } else {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 500);
    }
  };

  // Reset state when questions change
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setStreak(0);
    setAnswers([]);
  }, [questions]);

  return (
    <Question
      question={currentQuestion}
      questionNumber={currentQuestionIndex + 1}
      totalQuestions={questions.length}
      onAnswer={handleAnswer}
      onTimeout={handleTimeout}
    />
  );
}

