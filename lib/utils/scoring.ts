/**
 * Calculates points earned for an answer
 * @param correct - Whether the answer was correct
 * @param timeRemaining - Seconds remaining on the timer
 * @param streak - Current streak count
 * @returns Points earned (0 if incorrect)
 */
export function calculatePoints(
    correct: boolean,
    timeRemaining: number,
    streak: number
): number {
    if (!correct) {
        return 0;
    }

    // Base points: 100
    const basePoints = 100;

    // Time bonus: remaining seconds × 10
    const timeBonus = timeRemaining * 10;

    // Streak multiplier: 1.1x per streak level (1 streak = 1.1x, 2 streak = 1.2x, etc.)
    const streakMultiplier = 1 + streak * 0.1;

    // Total points = (base + time bonus) × streak multiplier
    const totalPoints = Math.round((basePoints + timeBonus) * streakMultiplier);

    return totalPoints;
}

