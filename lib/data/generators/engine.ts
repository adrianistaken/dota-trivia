import { Question } from '@/lib/types/game';
import { heroes, abilities, items, indices } from '../loader';
import { GeneratorContext, QuestionGenerator } from './types';
import { generateAbilityCooldownQuestion } from './ability-cooldown';
import { generateAbilityManaCostQuestion } from './ability-mana-cost';
import { generateItemCostQuestion } from './item-cost';

// Configuration constants
const MAX_RETRIES = 20;

// Question category configuration
type Category = 'cooldown' | 'ability' | 'item';
const CATEGORIES: Category[] = ['cooldown', 'ability', 'item'];
const CATEGORY_WEIGHTS = [1, 1, 1]; // Equal weights for now

// Generator mapping
const GENERATORS: Record<Category, QuestionGenerator> = {
    cooldown: generateAbilityCooldownQuestion,
    ability: generateAbilityManaCostQuestion,
    item: generateItemCostQuestion,
};

// Context for generators
const context: GeneratorContext = {
    heroes,
    abilities,
    items,
    indices,
};

/**
 * Selects a question category using weighted random selection
 * Tries to avoid repeating the same category too often
 */
function selectCategory(lastCategory?: Category): Category {
    // Simple weighted selection - can be improved with round-robin logic
    const totalWeight = CATEGORY_WEIGHTS.reduce((sum, w) => sum + w, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < CATEGORIES.length; i++) {
        random -= CATEGORY_WEIGHTS[i];
        if (random <= 0) {
            return CATEGORIES[i];
        }
    }

    return CATEGORIES[0]; // Fallback
}

/**
 * Validates a generated question
 */
function validateQuestion(question: Question | null): boolean {
    if (!question) return false;

    // Check for 4 unique answers
    const answerValues = [
        question.options.A,
        question.options.B,
        question.options.C,
        question.options.D,
    ];

    const uniqueAnswers = new Set(answerValues);
    if (uniqueAnswers.size !== 4) return false;

    // Check for no null/empty values
    if (answerValues.some((v) => !v || v.trim() === '')) return false;

    // Check that correct answer exists
    const correctValue = answerValues[question.correctAnswer.charCodeAt(0) - 65]; // A=0, B=1, C=2, D=3
    if (!correctValue) return false;

    return true;
}

/**
 * Generates the next question by selecting a category and calling the appropriate generator
 * Retries up to MAX_RETRIES times if generation fails
 */
export function generateNextQuestion(lastCategory?: Category): Question | null {
    let attempts = 0;
    let lastUsedCategory = lastCategory;

    while (attempts < MAX_RETRIES) {
        attempts++;

        // Select category
        const category = selectCategory(lastUsedCategory);
        lastUsedCategory = category;

        // Get generator for this category
        const generator = GENERATORS[category];
        if (!generator) {
            continue; // Skip invalid categories
        }

        // Generate question
        const question = generator(context);

        // Validate question
        if (validateQuestion(question)) {
            return question;
        }
    }

    // Failed to generate valid question after max retries
    return null;
}

