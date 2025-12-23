export type GameState = 'landing' | 'playing' | 'results';

export interface Question {
    id: string;
    question: string;
    questionImage?: string; // Optional image for the question
    lore?: string; // Optional lore/description text
    options: {
        A: string;
        B: string;
        C: string;
        D: string;
    };
    optionImages?: {
        A?: string;
        B?: string;
        C?: string;
        D?: string;
    }; // Optional images for each answer option
    correctAnswer: 'A' | 'B' | 'C' | 'D';
    category: 'ability' | 'item' | 'lore' | 'cooldown';
    // Optional metadata for asset resolution
    heroId?: number;
    abilityId?: number;
    itemId?: number;
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

