import { Question } from '../types/game';
import { generateNextQuestion } from './generators/engine';

/**
 * Generates a random set of questions for a run
 * @param count - Number of questions to generate (default: 10)
 * @returns Array of valid questions
 */
export function getRandomQuestions(count: number = 10): Question[] {
    const questions: Question[] = [];
    let lastCategory: 'cooldown' | 'ability' | 'item' | undefined;

    while (questions.length < count) {
        const question = generateNextQuestion(lastCategory);

        if (question) {
            questions.push(question);
            // Track last category to help with variety
            lastCategory = question.category as 'cooldown' | 'ability' | 'item';
        } else {
            // If we can't generate a question after max retries, break to avoid infinite loop
            // In practice, this should rarely happen
            console.warn(`Failed to generate question ${questions.length + 1} after max retries`);
            break;
        }
    }

    return questions;
}
