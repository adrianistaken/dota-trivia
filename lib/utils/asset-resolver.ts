import { getHeroById, getAbilityById, getItemById } from '@/lib/data/loader';
import { getAssetKey } from './asset-aliases';

/**
 * Converts a display name to an asset key format
 * Lowercases the string and replaces spaces/hyphens with underscores
 */
function normalizeToAssetKey(name: string): string {
    return name
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/-/g, '_');
}

/**
 * Gets the original asset key without applying aliases (for fallback)
 */
function getOriginalAssetKey(type: 'hero' | 'item' | 'ability', name: string): string {
    if (type === 'ability') {
        return name.toLowerCase();
    }
    return normalizeToAssetKey(name);
}

/**
 * Gets the hero icon URL from CDN (with alias applied)
 * 
 * @param heroId - The hero ID from Stratz data
 * @returns The CDN URL for the hero portrait, or null if hero not found
 */
export function getHeroIconUrl(heroId: number): string | null {
    const hero = getHeroById(heroId);
    if (!hero) return null;

    const assetKey = getAssetKey('hero', normalizeToAssetKey(hero.displayName));
    return `https://courier.spectral.gg/images/dota/portraits_lg/${assetKey}`;
}

/**
 * Gets the hero icon fallback URL (original key without alias) for fallback purposes
 * 
 * @param heroId - The hero ID from Stratz data
 * @returns The fallback CDN URL, or null if hero not found or no alias was applied
 */
export function getHeroIconFallbackUrl(heroId: number): string | null {
    const hero = getHeroById(heroId);
    if (!hero) return null;

    const originalKey = getOriginalAssetKey('hero', hero.displayName);
    const aliasKey = getAssetKey('hero', normalizeToAssetKey(hero.displayName));

    // Only return fallback if alias was applied (keys differ)
    if (originalKey !== aliasKey) {
        return `https://courier.spectral.gg/images/dota/portraits_lg/${originalKey}`;
    }
    return null;
}

/**
 * Gets the hero full portrait URL from CDN
 * 
 * @param heroId - The hero ID from Stratz data
 * @returns The CDN URL for the hero full portrait, or null if hero not found
 */
export function getHeroFullUrl(heroId: number): string | null {
    const hero = getHeroById(heroId);
    if (!hero) return null;

    const assetKey = getAssetKey('hero', normalizeToAssetKey(hero.displayName));
    return `https://courier.spectral.gg/images/dota/portraits_lg/${assetKey}`;
}

/**
 * Gets the ability icon URL from CDN (with alias applied)
 * 
 * @param abilityId - The ability ID from Stratz data
 * @returns The CDN URL for the ability icon, or null if ability not found
 */
export function getAbilityIconUrl(abilityId: number): string | null {
    const ability = getAbilityById(abilityId);
    if (!ability) return null;

    // Abilities already use snake_case in the name field
    const assetKey = getAssetKey('ability', ability.name);
    return `https://courier.spectral.gg/images/dota/spellicons/${assetKey}`;
}

/**
 * Gets the ability icon fallback URL (original key without alias) for fallback purposes
 * 
 * @param abilityId - The ability ID from Stratz data
 * @returns The fallback CDN URL, or null if ability not found or no alias was applied
 */
export function getAbilityIconFallbackUrl(abilityId: number): string | null {
    const ability = getAbilityById(abilityId);
    if (!ability) return null;

    const originalKey = getOriginalAssetKey('ability', ability.name);
    const aliasKey = getAssetKey('ability', ability.name);

    // Only return fallback if alias was applied (keys differ)
    if (originalKey !== aliasKey) {
        return `https://courier.spectral.gg/images/dota/spellicons/${originalKey}`;
    }
    return null;
}

/**
 * Gets the item icon URL from CDN (with alias applied)
 * 
 * @param itemId - The item ID from Stratz data
 * @returns The CDN URL for the item icon, or null if item not found
 */
export function getItemIconUrl(itemId: number): string | null {
    const item = getItemById(itemId);
    if (!item) return null;

    const assetKey = getAssetKey('item', normalizeToAssetKey(item.displayName));
    return `https://courier.spectral.gg/images/dota/items/${assetKey}`;
}

/**
 * Gets the item icon fallback URL (original key without alias) for fallback purposes
 * 
 * @param itemId - The item ID from Stratz data
 * @returns The fallback CDN URL, or null if item not found or no alias was applied
 */
export function getItemIconFallbackUrl(itemId: number): string | null {
    const item = getItemById(itemId);
    if (!item) return null;

    const originalKey = getOriginalAssetKey('item', item.displayName);
    const aliasKey = getAssetKey('item', normalizeToAssetKey(item.displayName));

    // Only return fallback if alias was applied (keys differ)
    if (originalKey !== aliasKey) {
        return `https://courier.spectral.gg/images/dota/items/${originalKey}`;
    }
    return null;
}

