import { Question } from '@/lib/types/game';
import { GeneratorContext } from './types';
import { getAbilityById, getHeroById } from '../loader';
import { formatAbilityName } from '@/lib/utils/format';

// Configuration constants
const USE_MAX_LEVEL_ONLY = true; // Set to false to randomly pick between level 1 and max

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Generates believable distractor mana cost values
 */
function generateDistractors(
    correctValue: number,
    context: GeneratorContext,
    excludeAbilityId: number
): number[] {
    const distractors: number[] = [];
    const usedValues = new Set<number>([correctValue]);

    // Strategy 1: Get mana costs from other abilities
    const otherAbilities = context.indices.abilitiesWithManaCost
        .filter((id) => id !== excludeAbilityId)
        .map((id) => getAbilityById(id))
        .filter((a) => a && a.stat.manaCost && a.stat.manaCost.length > 0);

    // Collect mana cost values from other abilities
    const candidateValues: number[] = [];
    for (const ability of otherAbilities) {
        if (ability && ability.stat.manaCost) {
            for (const manaCost of ability.stat.manaCost) {
                if (manaCost > 0 && !usedValues.has(manaCost)) {
                    candidateValues.push(manaCost);
                }
            }
        }
    }

    // Strategy 2: Common Dota mana cost numbers (round numbers)
    const commonManaCosts = [50, 75, 100, 110, 120, 125, 130, 140, 150, 175, 200, 225, 250, 300, 400, 500, 600];
    for (const common of commonManaCosts) {
        if (!usedValues.has(common) && Math.abs(common - correctValue) > 10) {
            candidateValues.push(common);
        }
    }

    // Shuffle and pick 3 unique distractors
    const shuffled = shuffleArray(candidateValues);
    for (const value of shuffled) {
        if (distractors.length >= 3) break;
        if (!usedValues.has(value)) {
            distractors.push(value);
            usedValues.add(value);
        }
    }

    // If we don't have enough, generate some close values
    while (distractors.length < 3) {
        const offset = (distractors.length + 1) * 25;
        const candidate = correctValue + offset;
        if (candidate > 0 && !usedValues.has(candidate)) {
            distractors.push(candidate);
            usedValues.add(candidate);
        } else {
            const candidate2 = Math.max(1, correctValue - offset);
            if (!usedValues.has(candidate2)) {
                distractors.push(candidate2);
                usedValues.add(candidate2);
            } else {
                break; // Can't generate more
            }
        }
    }

    return distractors.slice(0, 3);
}

/**
 * Generates an ability mana cost question
 */
export function generateAbilityManaCostQuestion(context: GeneratorContext): Question | null {
    // Get random ability with mana cost
    const abilityIds = context.indices.abilitiesWithManaCost;
    if (abilityIds.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * abilityIds.length);
    const abilityId = abilityIds[randomIndex];
    const ability = getAbilityById(abilityId);

    if (!ability || !ability.stat.manaCost || ability.stat.manaCost.length === 0) {
        return null;
    }

    // Select level
    let level: number;
    let manaCost: number;

    if (USE_MAX_LEVEL_ONLY) {
        level = ability.stat.manaCost.length;
        manaCost = ability.stat.manaCost[level - 1];
    } else {
        level = Math.floor(Math.random() * ability.stat.manaCost.length) + 1;
        manaCost = ability.stat.manaCost[level - 1];
    }

    if (!manaCost || manaCost <= 0) {
        return null;
    }

    // Get hero name
    const heroIds = context.indices.abilityToHero[abilityId.toString()];
    if (!heroIds || heroIds.length === 0) {
        return null;
    }

    const hero = getHeroById(heroIds[0]);
    if (!hero) {
        return null;
    }

    const heroName = hero.displayName;
    const abilityName = formatAbilityName(ability.name, heroName);

    // Generate distractors
    const distractors = generateDistractors(manaCost, context, abilityId);
    if (distractors.length < 3) {
        return null; // Can't generate enough distractors
    }

    // Create all answers
    const allAnswers = [manaCost, ...distractors];
    const shuffled = shuffleArray(allAnswers);
    const correctIndex = shuffled.indexOf(manaCost);

    if (correctIndex === -1) {
        return null; // Should never happen, but safety check
    }

    const correctAnswer = String.fromCharCode(65 + correctIndex) as 'A' | 'B' | 'C' | 'D';

    return {
        id: `ability-${abilityId}-${level}-${Date.now()}`,
        question: `How much{icon} mana does ${heroName}'s ${abilityName} cost at level ${level}?`,
        options: {
            A: shuffled[0].toString(),
            B: shuffled[1].toString(),
            C: shuffled[2].toString(),
            D: shuffled[3].toString(),
        },
        correctAnswer,
        category: 'ability',
        abilityId,
        heroId: heroIds[0],
    };
}

