import { ScoreBreakdown } from '@/lib/types/game';

/**
 * Calculates points earned for an answer with detailed breakdown
 * @param correct - Whether the answer was correct
 * @param timeRemaining - Seconds remaining on the timer
 * @param streak - Current streak count
 * @returns Score breakdown object (or null if incorrect)
 */
export function calculatePoints(
    correct: boolean,
    timeRemaining: number,
    streak: number
): ScoreBreakdown | null {
    if (!correct) {
        return null;
    }

    // Base points: 100
    const base = 100;

    // Time bonus: remaining seconds × 10
    const speed = Math.round(timeRemaining * 10);

    // Perfect answer bonus: +100 if answered within first 2 seconds (timeRemaining >= 8)
    const perfect = timeRemaining >= 8 ? 100 : 0;

    // Streak multiplier: 1.1x per streak level (1 streak = 1.1x, 2 streak = 1.2x, etc.)
    const streakMultiplier = 1 + streak * 0.1;

    // Streak bonus points (the extra points from the multiplier)
    // This is calculated as: (base + speed + perfect) * (streakMultiplier - 1)
    const streakBonus = Math.round((base + speed + perfect) * (streakMultiplier - 1));

    // Total points = (base + speed + perfect) × streak multiplier
    const total = Math.round((base + speed + perfect) * streakMultiplier);

    return {
        total,
        base,
        speed,
        streak: streakBonus,
        perfect,
        streakMultiplier,
    };
}

