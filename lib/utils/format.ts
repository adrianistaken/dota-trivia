/**
 * Formats an ability's internal name to a display name
 * Converts snake_case to Title Case
 * Example: "ringmaster_spotlight" -> "Ringmaster Spotlight"
 * 
 * @param internalName - The ability's internal name (snake_case)
 * @param heroName - Optional hero name to strip from the ability name if it's a prefix
 */
export function formatAbilityName(internalName: string, heroName?: string): string {
    let name = internalName;

    // If hero name is provided, try to strip it from the ability name
    if (heroName) {
        // Normalize hero name to match ability name format (lowercase, underscores)
        const normalizedHeroName = heroName
            .toLowerCase()
            .replace(/\s+/g, '_')
            .replace(/-/g, '_');

        // Check if ability name starts with hero name prefix
        if (name.toLowerCase().startsWith(normalizedHeroName + '_')) {
            // Remove the hero name prefix and the following underscore
            name = name.substring(normalizedHeroName.length + 1);
        }
    }

    return name
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

