import heroesData from '@/app/data/heroes.json';
import abilitiesData from '@/app/data/abilities.json';
import itemsData from '@/app/data/items.json';
import indicesData from '@/app/data/indices.json';

// Type definitions for the data structures
export interface Hero {
    id: number;
    displayName: string;
    primaryAttribute: string;
    attackType: string;
    complexity: number;
    moveSpeed: number;
    attackRange: number;
    startingArmor: number;
    startingDamageMin: number;
    startingDamageMax: number;
    startingMagicArmor: number;
    strengthBase: number;
    strengthGain: number;
    agilityBase: number;
    agilityGain: number;
    intelligenceBase: number;
    intelligenceGain: number;
    visionDay: number;
    visionNight: number;
    enabled: boolean;
}

export interface Ability {
    id: number;
    name: string;
    isTalent: boolean;
    stat: {
        behavior: number;
        unitDamageType: number;
        dispellable: string;
        charges: string;
        duration: string;
        manaCost: number[] | null;
        damage: number[] | null;
        channelTime: number[] | null;
        castRange: number[] | null;
        spellImmunity: number;
        cooldown: number[] | null;
    };
}

export interface Item {
    id: number;
    displayName: string;
    cost: number;
    shopTags: string;
    quality: string | null;
    isPurchasable: boolean;
    isSupport: boolean;
    isSideShop: boolean;
    castRange: number[] | null;
    manaCost: number[] | null;
    channelTime: number[] | null;
    aliases: string | null;
    itemResult: number | null;
}

export interface Indices {
    abilitiesByHero: Record<string, number[]>;
    talentsByHero: Record<string, number[]>;
    facetsByHero: Record<string, Array<{ facetId: number; abilityId: number | null; slot: number }>>;
    abilityToHero: Record<string, number[]>;
    abilitiesWithCooldown: number[];
    abilitiesWithManaCost: number[];
    itemsPurchasable: number[];
    itemsByShopTag: Record<string, number[]>;
    itemsByQuality: Record<string, number[]>;
    heroesByPrimaryAttribute: Record<string, number[]>;
}

// Load and cache data at module initialization
export const heroes: Hero[] = heroesData as Hero[];
export const abilities: Ability[] = abilitiesData as Ability[];
export const items: Item[] = itemsData as Item[];
export const indices: Indices = indicesData as Indices;

// Helper functions to look up data by ID
export function getHeroById(id: number): Hero | undefined {
    return heroes.find((h) => h.id === id);
}

export function getAbilityById(id: number): Ability | undefined {
    return abilities.find((a) => a.id === id);
}

export function getItemById(id: number): Item | undefined {
    return items.find((i) => i.id === id);
}

