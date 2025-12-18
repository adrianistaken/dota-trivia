export type GameState = 'landing' | 'playing' | 'results';

export interface Question {
  id: string;
  question: string;
  lore?: string; // Optional lore/description text
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  category: 'ability' | 'item' | 'lore' | 'cooldown';
}

export interface AnswerResult {
  questionId: string;
  selectedAnswer: 'A' | 'B' | 'C' | 'D' | null;
  correct: boolean;
  timeRemaining: number;
  pointsEarned: number;
}

export interface RunState {
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  streak: number;
  answers: AnswerResult[];
  startTime: number;
}

