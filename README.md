# Dota 2 Trivia

A Dota 2 trivia game built with Next.js. Test your knowledge of item costs, ability mana costs, and cooldowns.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Updating Game Data for a New Patch

Game data comes from the [Stratz GraphQL API](https://api.stratz.com/graphiq). When a new Dota 2 patch drops, you need to pull fresh data.

### Step 1: Find the Latest Game Version ID

Go to [https://api.stratz.com/graphiq](https://api.stratz.com/graphiq) and run:

```graphql
query {
  constants {
    gameVersions {
      id
      name
      asOfDateTime
    }
  }
}
```

Find the latest entry — the `id` is what you need (e.g. `181` was patch 7.37d).

### Step 2: Pull All Game Data

Using the version ID from step 1, run this query (replace `181` with the new ID):

```graphql
query {
  constants {
    heroes(gameVersionId: 181) {
      id
      displayName
      talents {
        slot
        abilityId
      }
      facets {
        abilityId
        facetId
        slot
      }
      stats {
        enabled
        attackType
        startingArmor
        startingMagicArmor
        startingDamageMin
        startingDamageMax
        attackRange
        primaryAttribute
        strengthBase
        strengthGain
        intelligenceBase
        intelligenceGain
        agilityBase
        agilityGain
        hpRegen
        mpRegen
        moveSpeed
        hpBarOffset
        visionDaytimeRange
        visionNighttimeRange
        complexity
        primaryAttributeEnum
      }
      abilities {
        slot
        ability {
          id
          name
          stat {
            abilityId
            behavior
            unitDamageType
            dispellable
            charges
            duration
            manaCost
            damage
            channelTime
            castRange
            spellImmunity
            cooldown
          }
        }
      }
    }
    gameVersions {
      id
      name
      asOfDateTime
    }
    items(gameVersionId: 181) {
      id
      shortName
      name
      displayName
      stat {
        castRange
        manaCost
        channelTime
        cost
        shopTags
        aliases
        quality
        isPurchasable
        isSideShop
        isSupport
        itemResult
      }
    }
    abilities(gameVersionId: 181) {
      name
      isTalent
      stat {
        abilityId
        behavior
        unitDamageType
        dispellable
        charges
        duration
        manaCost
        damage
        channelTime
        castRange
        spellImmunity
        cooldown
      }
    }
  }
}
```

### Step 3: Save the Response

Save the full JSON response to `app/data/dota-data-181.json` (replace the existing file). Optionally rename the file to match the new version ID.

> If you rename the file, update the path in `scripts/extract-data.js` (line 5) to match.

### Step 4: Run the Extract Script

```bash
node scripts/extract-data.js
```

This reads the raw Stratz data and generates:
- `app/data/heroes.json`
- `app/data/items.json`
- `app/data/abilities.json`

### Step 5: Verify

```bash
npm run dev
```

Play a few rounds and make sure the questions/answers look correct for the new patch.

## Project Structure

```
app/
  data/           # Game data (JSON files)
  page.tsx        # Main app entry, state management
  globals.css     # Global styles and animations
components/
  Landing.tsx     # Main menu
  Game.tsx        # Game orchestrator
  Question.tsx    # Question UI, timer, answers
  Results.tsx     # End-of-run results
  ShootingStars.tsx  # Background flying icons effect
lib/
  data/generators/   # Question generation (cooldowns, mana costs, item costs)
  utils/             # Scoring, asset resolution, storage
scripts/
  extract-data.js    # Transforms raw Stratz data into app-ready JSON
```
