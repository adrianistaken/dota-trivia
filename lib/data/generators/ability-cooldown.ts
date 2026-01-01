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
 * Generates believable distractor cooldown values
 */
function generateDistractors(
    correctValue: number,
    context: GeneratorContext,
    excludeAbilityId: number
): number[] {
    const distractors: number[] = [];
    const usedValues = new Set<number>([correctValue]);

    // Strategy 1: Get cooldowns from other abilities
    const otherAbilities = context.indices.abilitiesWithCooldown
        .filter((id) => id !== excludeAbilityId)
        .map((id) => getAbilityById(id))
        .filter((a) => a && a.stat.cooldown && a.stat.cooldown.length > 0);

    // Collect cooldown values from other abilities
    const candidateValues: number[] = [];
    for (const ability of otherAbilities) {
        if (ability && ability.stat.cooldown) {
            for (const cooldown of ability.stat.cooldown) {
                if (cooldown > 0 && !usedValues.has(cooldown)) {
                    candidateValues.push(cooldown);
                }
            }
        }
    }

    // Strategy 2: Common Dota cooldown numbers (round numbers)
    const commonCooldowns = [5, 8, 10, 12, 15, 18, 20, 24, 30, 40, 60, 90, 120, 180];
    for (const common of commonCooldowns) {
        if (!usedValues.has(common) && Math.abs(common - correctValue) > 2) {
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
        const offset = (distractors.length + 1) * 5;
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
 * Generates an ability cooldown question
 */
export function generateAbilityCooldownQuestion(context: GeneratorContext): Question | null {
    // Get random ability with cooldown
    const abilityIds = context.indices.abilitiesWithCooldown;
    if (abilityIds.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * abilityIds.length);
    const abilityId = abilityIds[randomIndex];
    const ability = getAbilityById(abilityId);

    if (!ability || !ability.stat.cooldown || ability.stat.cooldown.length === 0) {
        return null;
    }

    // Select level
    let level: number;
    let cooldown: number;

    if (USE_MAX_LEVEL_ONLY) {
        level = ability.stat.cooldown.length;
        cooldown = ability.stat.cooldown[level - 1];
    } else {
        level = Math.floor(Math.random() * ability.stat.cooldown.length) + 1;
        cooldown = ability.stat.cooldown[level - 1];
    }

    if (!cooldown || cooldown <= 0) {
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
    const distractors = generateDistractors(cooldown, context, abilityId);
    if (distractors.length < 3) {
        return null; // Can't generate enough distractors
    }

    // Create all answers
    const allAnswers = [cooldown, ...distractors];
    const shuffled = shuffleArray(allAnswers);
    const correctIndex = shuffled.indexOf(cooldown);

    if (correctIndex === -1) {
        return null; // Should never happen, but safety check
    }

    const correctAnswer = String.fromCharCode(65 + correctIndex) as 'A' | 'B' | 'C' | 'D';

    // Format answer text (add "seconds" suffix)
    const formatAnswer = (value: number): string => {
        return `${value} seconds`;
    };

    return {
        id: `cooldown-${abilityId}-${level}-${Date.now()}`,
        question: `What is the{icon} cooldown of ${heroName}'s ${abilityName} at level ${level}?`,
        options: {
            A: formatAnswer(shuffled[0]),
            B: formatAnswer(shuffled[1]),
            C: formatAnswer(shuffled[2]),
            D: formatAnswer(shuffled[3]),
        },
        correctAnswer,
        category: 'cooldown',
        abilityId,
        heroId: heroIds[0],
    };
}

