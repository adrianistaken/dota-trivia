import { Question } from '@/lib/types/game';
import { GeneratorContext } from './types';
import { getItemById } from '../loader';

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
 * Generates believable distractor item costs
 */
function generateDistractors(
    correctValue: number,
    context: GeneratorContext,
    excludeItemId: number,
    shopTags?: string
): number[] {
    const distractors: number[] = [];
    const usedValues = new Set<number>([correctValue]);

    // Strategy 1: Get costs from items in the same shop tag category
    if (shopTags) {
        const tags = shopTags.split(';').filter((tag) => tag.length > 0);
        for (const tag of tags) {
            const itemsInCategory = context.indices.itemsByShopTag[tag];
            if (itemsInCategory) {
                for (const itemId of itemsInCategory) {
                    if (itemId === excludeItemId) continue;
                    const item = getItemById(itemId);
                    if (item && item.cost > 0 && !usedValues.has(item.cost)) {
                        distractors.push(item.cost);
                        usedValues.add(item.cost);
                        if (distractors.length >= 3) break;
                    }
                }
            }
            if (distractors.length >= 3) break;
        }
    }

    // Strategy 2: Get costs from other purchasable items
    if (distractors.length < 3) {
        const otherItems = context.indices.itemsPurchasable
            .filter((id) => id !== excludeItemId)
            .map((id) => getItemById(id))
            .filter((item) => item && item.cost > 0 && !usedValues.has(item.cost));

        for (const item of otherItems) {
            if (distractors.length >= 3) break;
            if (item && !usedValues.has(item.cost)) {
                distractors.push(item.cost);
                usedValues.add(item.cost);
            }
        }
    }

    // Strategy 3: Generate one "close" cost (±20% of correct) and one "further" cost
    // Sort existing distractors to find gaps
    const sortedDistractors = [...distractors].sort((a, b) => a - b);

    // Add a close cost if we don't have enough
    if (distractors.length < 3) {
        const closeOffset = Math.round(correctValue * 0.2);
        const closeHigh = correctValue + closeOffset;
        const closeLow = Math.max(1, correctValue - closeOffset);

        // Try close high first
        if (closeHigh > 0 && !usedValues.has(closeHigh) && Math.abs(closeHigh - correctValue) > 10) {
            distractors.push(closeHigh);
            usedValues.add(closeHigh);
        } else if (closeLow > 0 && !usedValues.has(closeLow) && Math.abs(closeLow - correctValue) > 10) {
            distractors.push(closeLow);
            usedValues.add(closeLow);
        }
    }

    // Add a further cost if we still don't have enough
    if (distractors.length < 3) {
        const furtherOffset = Math.round(correctValue * 0.5);
        const furtherHigh = correctValue + furtherOffset;
        const furtherLow = Math.max(1, correctValue - furtherOffset);

        // Try further high first
        if (furtherHigh > 0 && !usedValues.has(furtherHigh) && Math.abs(furtherHigh - correctValue) > 50) {
            distractors.push(furtherHigh);
            usedValues.add(furtherHigh);
        } else if (furtherLow > 0 && !usedValues.has(furtherLow) && Math.abs(furtherLow - correctValue) > 50) {
            distractors.push(furtherLow);
            usedValues.add(furtherLow);
        }
    }

    // Final fallback: generate values with fixed offsets
    while (distractors.length < 3) {
        const offset = (distractors.length + 1) * 500;
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
 * Generates an item cost question
 */
export function generateItemCostQuestion(context: GeneratorContext): Question | null {
    // Get random purchasable item
    const itemIds = context.indices.itemsPurchasable;
    if (itemIds.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * itemIds.length);
    const itemId = itemIds[randomIndex];
    const item = getItemById(itemId);

    if (!item || !item.displayName || item.cost <= 0) {
        return null;
    }

    const cost = item.cost;
    const itemName = item.displayName;

    // Generate distractors
    const distractors = generateDistractors(cost, context, itemId, item.shopTags);
    if (distractors.length < 3) {
        return null; // Can't generate enough distractors
    }

    // Create all answers
    const allAnswers = [cost, ...distractors];
    const shuffled = shuffleArray(allAnswers);
    const correctIndex = shuffled.indexOf(cost);

    if (correctIndex === -1) {
        return null; // Should never happen, but safety check
    }

    const correctAnswer = String.fromCharCode(65 + correctIndex) as 'A' | 'B' | 'C' | 'D';

    // Format answer text (add "gold" suffix)
    const formatAnswer = (value: number): string => {
        return `${value.toLocaleString()} gold`;
    };

    return {
        id: `item-${itemId}-${Date.now()}`,
        question: `How much gold does ${itemName} cost?`,
        options: {
            A: formatAnswer(shuffled[0]),
            B: formatAnswer(shuffled[1]),
            C: formatAnswer(shuffled[2]),
            D: formatAnswer(shuffled[3]),
        },
        correctAnswer,
        category: 'item',
        itemId,
    };
}

