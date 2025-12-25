/**
 * Asset alias mappings for cases where Stratz IDs/names differ from Valve CDN asset keys
 * 
 * These mappings convert Stratz identifiers to the correct Valve CDN asset key format.
 * Add new aliases here as needed.
 */

export type AssetType = 'hero' | 'item' | 'ability';

interface AliasMap {
    heroes: Record<string, string>;
    items: Record<string, string>;
    abilities: Record<string, string>;
}

const ALIASES: AliasMap = {
    heroes: {
        'io': 'wisp',
    },
    items: {
        'blink_dagger': 'blink',
    },
    abilities: {
        // Add ability aliases here as needed
    },
};

/**
 * Applies alias mapping to convert a Stratz ID/name to a Valve CDN asset key
 * 
 * @param type - The type of asset (hero, item, or ability)
 * @param idOrName - The original ID or name from Stratz data
 * @returns The asset key to use for Valve CDN (alias if exists, otherwise original)
 */
export function getAssetKey(type: AssetType, idOrName: string): string {
    const normalizedKey = idOrName.toLowerCase();
    const aliasMap = ALIASES[`${type}s` as keyof AliasMap];

    if (aliasMap && aliasMap[normalizedKey]) {
        return aliasMap[normalizedKey];
    }

    return normalizedKey;
}

