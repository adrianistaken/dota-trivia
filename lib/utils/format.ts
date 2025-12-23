/**
 * Formats an ability's internal name to a display name
 * Converts snake_case to Title Case
 * Example: "ringmaster_spotlight" -> "Ringmaster Spotlight"
 */
export function formatAbilityName(internalName: string): string {
    return internalName
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

