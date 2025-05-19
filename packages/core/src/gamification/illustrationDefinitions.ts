import { Illustration } from './illustrationTypes';

// Illustrations database with different rarity tiers
export const ILLUSTRATIONS: Illustration[] = [
  // Common illustrations (highest pull weight)
  { 
    id: 'C001', 
    name: 'Focused Fox', 
    imagePath: 'fox_focused.png', 
    rarity: 'Common', 
    pullWeight: 100,
    description: 'A fox deeply focused on its task, representing concentration.'
  },
  { 
    id: 'C002', 
    name: 'Productive Panda', 
    imagePath: 'panda_productive.png', 
    rarity: 'Common', 
    pullWeight: 100,
    description: 'A panda efficiently managing its time and bamboo.'
  },
  { 
    id: 'C003', 
    name: 'Timer Bunny', 
    imagePath: 'bunny_timer.png', 
    rarity: 'Common', 
    pullWeight: 100,
    description: 'A bunny that is always punctual and never late.'
  },

  // Uncommon illustrations
  { 
    id: 'U001', 
    name: 'Time-Traveling Turtle', 
    imagePath: 'turtle_time.png', 
    rarity: 'Uncommon', 
    pullWeight: 50,
    description: 'A turtle that takes its time but always arrives precisely when needed.'
  },
  { 
    id: 'U002', 
    name: 'Deadline Dragon', 
    imagePath: 'dragon_deadline.png', 
    rarity: 'Uncommon', 
    pullWeight: 50,
    description: 'A dragon that breathes fire when deadlines approach.'
  },

  // Rare illustrations
  { 
    id: 'R001', 
    name: 'Chrono Kitty', 
    imagePath: 'kitty_chrono.png', 
    rarity: 'Rare', 
    pullWeight: 20,
    description: 'A cat with the mysterious ability to bend time.'
  },
  { 
    id: 'R002', 
    name: 'Hourglass Hedgehog', 
    imagePath: 'hedgehog_hourglass.png', 
    rarity: 'Rare', 
    pullWeight: 20,
    description: 'A hedgehog that collects sand from magical hourglasses.'
  },

  // Epic illustrations
  { 
    id: 'E001', 
    name: 'Cosmic Clock Owl', 
    imagePath: 'owl_cosmic.png', 
    rarity: 'Epic', 
    pullWeight: 5,
    description: 'An owl that watches over the cosmic timestream.'
  },

  // Legendary illustrations (lowest pull weight)
  { 
    id: 'L001', 
    name: 'Timeless Phoenix', 
    imagePath: 'phoenix_timeless.png', 
    rarity: 'Legendary', 
    pullWeight: 1,
    description: 'The mythical phoenix that transcends time itself.'
  },
];

// Calculate the total pull weight (used for weighted random selection)
export const TOTAL_PULL_WEIGHT = ILLUSTRATIONS.reduce((sum, illu) => sum + illu.pullWeight, 0);
