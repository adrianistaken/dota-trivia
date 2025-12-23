const BEST_SCORE_KEY = 'dota-trivia-best-score';

/**
 * Retrieves the best score from localStorage
 * @returns Best score, or 0 if none exists
 */
export function getBestScore(): number {
    if (typeof window === 'undefined') {
        return 0;
    }

    try {
        const stored = localStorage.getItem(BEST_SCORE_KEY);
        if (stored === null) {
            return 0;
        }
        const score = parseInt(stored, 10);
        return isNaN(score) ? 0 : score;
    } catch {
        return 0;
    }
}

/**
 * Saves a new best score if it's higher than the current best
 * @param score - The score to potentially save
 * @returns The new best score (may be unchanged)
 */
export function setBestScore(score: number): number {
    if (typeof window === 'undefined') {
        return score;
    }

    try {
        const currentBest = getBestScore();
        if (score > currentBest) {
            localStorage.setItem(BEST_SCORE_KEY, score.toString());
            return score;
        }
        return currentBest;
    } catch {
        return score;
    }
}

