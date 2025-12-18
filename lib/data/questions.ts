import { Question } from '../types/game';

export const allQuestions: Question[] = [
  {
    id: '1',
    question: 'What item has the following lore?',
    lore: 'Only the mightiest and most experienced of warriors can wield the Butterfly, but it provides incredible dexterity in combat.',
    options: {
      A: 'Butterfly',
      B: 'Divine Rapier',
      C: 'Monkey King Bar',
      D: 'Daedalus',
    },
    correctAnswer: 'A',
    category: 'lore',
  },
  {
    id: '2',
    question: 'How much mana does Crystal Maiden\'s Frostbite cost?',
    options: {
      A: '100',
      B: '115',
      C: '130',
      D: '150',
    },
    correctAnswer: 'B',
    category: 'ability',
  },
  {
    id: '3',
    question: 'What is the cooldown of Blink Dagger?',
    options: {
      A: '12 seconds',
      B: '15 seconds',
      C: '18 seconds',
      D: '20 seconds',
    },
    correctAnswer: 'B',
    category: 'cooldown',
  },
  {
    id: '4',
    question: 'What item has the following lore?',
    lore: 'A powerful blade created from the fangs of a slain dragon.',
    options: {
      A: 'Dragon Lance',
      B: 'Dragon Scale',
      C: 'Dragon\'s Blood',
      D: 'Dragon Edge',
    },
    correctAnswer: 'A',
    category: 'lore',
  },
  {
    id: '5',
    question: 'How much mana does Invoker\'s Sun Strike cost?',
    options: {
      A: '150',
      B: '175',
      C: '200',
      D: '225',
    },
    correctAnswer: 'B',
    category: 'ability',
  },
  {
    id: '6',
    question: 'What is the cooldown of Black King Bar\'s active ability?',
    options: {
      A: '60 seconds',
      B: '70 seconds',
      C: '80 seconds',
      D: '90 seconds',
    },
    correctAnswer: 'D',
    category: 'cooldown',
  },
  {
    id: '7',
    question: 'What item provides +25 Intelligence?',
    options: {
      A: 'Aether Lens',
      B: 'Force Staff',
      C: 'Eul\'s Scepter',
      D: 'Dagon',
    },
    correctAnswer: 'A',
    category: 'item',
  },
  {
    id: '8',
    question: 'How much mana does Pudge\'s Meat Hook cost?',
    options: {
      A: '110',
      B: '120',
      C: '130',
      D: '140',
    },
    correctAnswer: 'C',
    category: 'ability',
  },
  {
    id: '9',
    question: 'What is the cooldown of Refresher Orb?',
    options: {
      A: '180 seconds',
      B: '195 seconds',
      C: '200 seconds',
      D: '210 seconds',
    },
    correctAnswer: 'B',
    category: 'cooldown',
  },
  {
    id: '10',
    question: 'What item has the following lore?',
    lore: 'A legendary blade that can cut through any armor.',
    options: {
      A: 'Desolator',
      B: 'Armlet of Mordiggian',
      C: 'Assault Cuirass',
      D: 'Blade Mail',
    },
    correctAnswer: 'A',
    category: 'lore',
  },
  {
    id: '11',
    question: 'How much mana does Zeus\'s Thundergod\'s Wrath cost?',
    options: {
      A: '200',
      B: '225',
      C: '250',
      D: '275',
    },
    correctAnswer: 'C',
    category: 'ability',
  },
  {
    id: '12',
    question: 'What is the cooldown of Shadow Blade?',
    options: {
      A: '20 seconds',
      B: '24 seconds',
      C: '28 seconds',
      D: '30 seconds',
    },
    correctAnswer: 'C',
    category: 'cooldown',
  },
  {
    id: '13',
    question: 'What item provides +10 Strength and +10 Agility?',
    options: {
      A: 'Power Treads',
      B: 'Phase Boots',
      C: 'Arcane Boots',
      D: 'Tranquil Boots',
    },
    correctAnswer: 'A',
    category: 'item',
  },
  {
    id: '14',
    question: 'How much mana does Lion\'s Finger of Death cost?',
    options: {
      A: '200',
      B: '420',
      C: '500',
      D: '600',
    },
    correctAnswer: 'D',
    category: 'ability',
  },
  {
    id: '15',
    question: 'What is the cooldown of Manta Style\'s active ability?',
    options: {
      A: '30 seconds',
      B: '35 seconds',
      C: '40 seconds',
      D: '45 seconds',
    },
    correctAnswer: 'C',
    category: 'cooldown',
  },
  {
    id: '16',
    question: 'What item has the following lore?',
    lore: 'Forged by the gods themselves, this weapon never misses its target.',
    options: {
      A: 'Monkey King Bar',
      B: 'Mjollnir',
      C: 'Abyssal Blade',
      D: 'Satanic',
    },
    correctAnswer: 'A',
    category: 'lore',
  },
  {
    id: '17',
    question: 'How much mana does Lina\'s Laguna Blade cost?',
    options: {
      A: '400',
      B: '500',
      C: '600',
      D: '680',
    },
    correctAnswer: 'D',
    category: 'ability',
  },
  {
    id: '18',
    question: 'What is the cooldown of Eul\'s Scepter of Divinity?',
    options: {
      A: '20 seconds',
      B: '23 seconds',
      C: '25 seconds',
      D: '27 seconds',
    },
    correctAnswer: 'B',
    category: 'cooldown',
  },
  {
    id: '19',
    question: 'What item provides +20 Strength?',
    options: {
      A: 'Heart of Tarrasque',
      B: 'Satanic',
      C: 'Reaver',
      D: 'Sange',
    },
    correctAnswer: 'C',
    category: 'item',
  },
  {
    id: '20',
    question: 'What item has the following lore?',
    lore: 'A mystical staff that channels the power of the elements.',
    options: {
      A: 'Aghanim\'s Scepter',
      B: 'Eul\'s Scepter',
      C: 'Rod of Atos',
      D: 'Octarine Core',
    },
    correctAnswer: 'A',
    category: 'lore',
  },
  {
    id: '21',
    question: 'How much mana does Queen of Pain\'s Sonic Wave cost?',
    options: {
      A: '250',
      B: '300',
      C: '350',
      D: '400',
    },
    correctAnswer: 'C',
    category: 'ability',
  },
  {
    id: '22',
    question: 'What is the cooldown of Linken\'s Sphere?',
    options: {
      A: '12 seconds',
      B: '13 seconds',
      C: '14 seconds',
      D: '15 seconds',
    },
    correctAnswer: 'B',
    category: 'cooldown',
  },
  {
    id: '23',
    question: 'What item provides +25 Agility?',
    options: {
      A: 'Eaglehorn',
      B: 'Yasha',
      C: 'Diffusal Blade',
      D: 'Butterfly',
    },
    correctAnswer: 'A',
    category: 'item',
  },
  {
    id: '24',
    question: 'How much mana does Enigma\'s Black Hole cost?',
    options: {
      A: '200',
      B: '250',
      C: '300',
      D: '350',
    },
    correctAnswer: 'C',
    category: 'ability',
  },
];

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Selects 10 random questions for a run
 */
export function getRandomQuestions(): Question[] {
  const shuffled = shuffleArray(allQuestions);
  return shuffled.slice(0, 10);
}

