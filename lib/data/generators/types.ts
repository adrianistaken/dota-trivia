import { Question } from '@/lib/types/game';
import { heroes, abilities, items, indices } from '../loader';

/**
 * Context passed to question generators
 * Contains all necessary data for question generation
 */
export interface GeneratorContext {
    heroes: typeof heroes;
    abilities: typeof abilities;
    items: typeof items;
    indices: typeof indices;
}

/**
 * Generator function interface
 * Returns a Question or null if generation fails
 */
export type QuestionGenerator = (context: GeneratorContext) => Question | null;

/**
 * Question category type
 */
export type QuestionCategory = 'ability' | 'item' | 'cooldown';

