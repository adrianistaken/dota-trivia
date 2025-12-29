const fs = require('fs');
const path = require('path');

// Read the main data file
const mainDataPath = path.join(__dirname, '../app/data/dota-data-181.json');
const mainData = JSON.parse(fs.readFileSync(mainDataPath, 'utf8'));

const constants = mainData.data.constants;

// Extract and transform items
const items = constants.items.map(item => {
    const stat = item.stat || {};
    return {
        id: item.id,
        shortName: item.shortName,
        displayName: item.displayName,
        cost: stat.cost ?? null,
        shopTags: stat.shopTags ?? null,
        quality: stat.quality ?? null,
        isPurchasable: stat.isPurchasable ?? false,
        isSupport: stat.isSupport ?? false,
        isSideShop: stat.isSideShop ?? false,
        castRange: stat.castRange ?? null,
        manaCost: stat.manaCost ?? null,
        channelTime: stat.channelTime ?? null,
        aliases: stat.aliases ?? null,
        itemResult: stat.itemResult ?? null
    };
});

// Extract and transform heroes
const heroes = constants.heroes.map(hero => {
    const stats = hero.stats || {};
    return {
        id: hero.id,
        displayName: hero.displayName,
        primaryAttribute: stats.primaryAttribute ?? null,
        attackType: stats.attackType ?? null,
        complexity: stats.complexity ?? null,
        moveSpeed: stats.moveSpeed ?? null,
        attackRange: stats.attackRange ?? null,
        startingArmor: stats.startingArmor ?? null,
        startingDamageMin: stats.startingDamageMin ?? null,
        startingDamageMax: stats.startingDamageMax ?? null,
        startingMagicArmor: stats.startingMagicArmor ?? null,
        strengthBase: stats.strengthBase ?? null,
        strengthGain: stats.strengthGain ?? null,
        agilityBase: stats.agilityBase ?? null,
        agilityGain: stats.agilityGain ?? null,
        intelligenceBase: stats.intelligenceBase ?? null,
        intelligenceGain: stats.intelligenceGain ?? null,
        visionDay: stats.visionDaytimeRange ?? null,
        visionNight: stats.visionNighttimeRange ?? null,
        enabled: stats.enabled ?? false
    };
});

// Extract and transform abilities
const abilities = constants.abilities.map(ability => {
    // Ability ID comes from stat.abilityId, not a top-level id
    const abilityId = ability.stat?.abilityId ?? null;
    return {
        id: abilityId,
        name: ability.name ?? null,
        isTalent: ability.isTalent ?? false,
        stat: ability.stat ? {
            behavior: ability.stat.behavior ?? null,
            unitDamageType: ability.stat.unitDamageType ?? null,
            dispellable: ability.stat.dispellable ?? null,
            charges: ability.stat.charges ?? null,
            duration: ability.stat.duration ?? null,
            manaCost: ability.stat.manaCost ?? null,
            damage: ability.stat.damage ?? null,
            channelTime: ability.stat.channelTime ?? null,
            castRange: ability.stat.castRange ?? null,
            spellImmunity: ability.stat.spellImmunity ?? null,
            cooldown: ability.stat.cooldown ?? null
        } : {
            behavior: null,
            unitDamageType: null,
            dispellable: null,
            charges: null,
            duration: null,
            manaCost: null,
            damage: null,
            channelTime: null,
            castRange: null,
            spellImmunity: null,
            cooldown: null
        }
    };
});

// Write the output files
const outputDir = path.join(__dirname, '../app/data');

fs.writeFileSync(
    path.join(outputDir, 'items.json'),
    JSON.stringify(items, null, 2),
    'utf8'
);

fs.writeFileSync(
    path.join(outputDir, 'heroes.json'),
    JSON.stringify(heroes, null, 2),
    'utf8'
);

fs.writeFileSync(
    path.join(outputDir, 'abilities.json'),
    JSON.stringify(abilities, null, 2),
    'utf8'
);

console.log('Successfully extracted and transformed data:');
console.log(`- ${items.length} items`);
console.log(`- ${heroes.length} heroes`);
console.log(`- ${abilities.length} abilities`);

