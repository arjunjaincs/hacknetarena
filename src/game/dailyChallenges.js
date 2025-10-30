/**
 * Daily Challenge System
 * Generates deterministic daily challenges using date as seed
 */

// ============================================================================
// CHALLENGE DEFINITIONS
// ============================================================================

export const CHALLENGE_TYPES = {
  NO_NETWORK: {
    id: 'no_network',
    name: 'No Network Actions',
    description: 'Win without using any Network category actions',
    icon: '🚫',
    color: 'red',
    difficulty: 'medium',
    modifiers: {
      bannedCategories: ['Network']
    }
  },
  
  BUDGET_BATTLE: {
    id: 'budget_battle',
    name: 'Budget Battle',
    description: 'All actions cost maximum 12 energy',
    icon: '💰',
    color: 'green',
    difficulty: 'easy',
    modifiers: {
      maxEnergyCost: 12
    }
  },
  
  SPEED_RUN: {
    id: 'speed_run',
    name: 'Speed Run',
    description: 'Win in under 8 rounds',
    icon: '⚡',
    color: 'yellow',
    difficulty: 'hard',
    modifiers: {
      maxRounds: 8
    }
  },
  
  COMBO_MASTER: {
    id: 'combo_master',
    name: 'Combo Master',
    description: 'Trigger 3 or more combos to win',
    icon: '🔗',
    color: 'purple',
    difficulty: 'medium',
    modifiers: {
      minCombos: 3
    }
  },
  
  PERFECT_DEFENSE: {
    id: 'perfect_defense',
    name: 'Perfect Defense',
    description: 'Win without Network Integrity dropping below 80',
    icon: '🛡️',
    color: 'blue',
    difficulty: 'hard',
    modifiers: {
      minNetworkIntegrity: 80
    }
  },
  
  HIGH_STAKES: {
    id: 'high_stakes',
    name: 'High Stakes',
    description: 'Start with 50 energy, no regeneration',
    icon: '🎲',
    color: 'orange',
    difficulty: 'hard',
    modifiers: {
      startingEnergy: 50,
      energyRegen: 0
    }
  },
  
  ULTIMATE_POWER: {
    id: 'ultimate_power',
    name: 'Ultimate Power',
    description: 'Only actions costing 20+ energy available',
    icon: '⚡',
    color: 'gold',
    difficulty: 'hard',
    modifiers: {
      minEnergyCost: 20
    }
  }
};

// ============================================================================
// SEEDED RANDOM NUMBER GENERATOR
// ============================================================================

class SeededRandom {
  constructor(seed) {
    this.seed = seed;
  }
  
  next() {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
  
  nextInt(min, max) {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
}

// ============================================================================
// DAILY CHALLENGE GENERATION
// ============================================================================

export function getTodayDateString() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function getSeedFromDate(dateString) {
  const parts = dateString.split('-');
  return parseInt(parts[0]) * 10000 + parseInt(parts[1]) * 100 + parseInt(parts[2]);
}

export function getDailyChallenge(dateString = getTodayDateString()) {
  const seed = getSeedFromDate(dateString);
  const rng = new SeededRandom(seed);
  
  const challengeTypes = Object.values(CHALLENGE_TYPES);
  const challengeIndex = rng.nextInt(0, challengeTypes.length - 1);
  const challenge = challengeTypes[challengeIndex];
  
  const roles = ['hacker', 'defender'];
  const roleIndex = rng.nextInt(0, 1);
  const role = roles[roleIndex];
  
  return {
    date: dateString,
    type: challenge.id,
    name: challenge.name,
    description: challenge.description,
    icon: challenge.icon,
    color: challenge.color,
    difficulty: challenge.difficulty,
    role: role,
    modifiers: challenge.modifiers,
    scoreMultiplier: 2.0
  };
}

export function getTimeUntilNextChallenge() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow - now;
}

export function formatTimeRemaining(ms) {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((ms % (1000 * 60)) / 1000);
  return `${hours}h ${minutes}m ${seconds}s`;
}

export function validateChallengeCompletion(challenge, gameState) {
  const modifiers = challenge.modifiers;
  
  if (!gameState.gameOver || gameState.winner !== gameState.playerRole) {
    return { success: false, reason: 'Must win the game' };
  }
  
  if (modifiers.maxRounds && gameState.round > modifiers.maxRounds) {
    return { success: false, reason: `Must win in ${modifiers.maxRounds} rounds or less` };
  }
  
  if (modifiers.minCombos && gameState.combosEarned < modifiers.minCombos) {
    return { success: false, reason: `Must trigger at least ${modifiers.minCombos} combos` };
  }
  
  if (modifiers.minNetworkIntegrity && gameState.minNetworkIntegrity < modifiers.minNetworkIntegrity) {
    return { success: false, reason: `Network Integrity must stay above ${modifiers.minNetworkIntegrity}` };
  }
  
  return { success: true, reason: 'Challenge completed!' };
}

export function applyModifiersToActions(actions, modifiers) {
  let filteredActions = [...actions];
  
  if (modifiers.bannedCategories) {
    filteredActions = filteredActions.filter(
      action => !modifiers.bannedCategories.includes(action.category)
    );
  }
  
  if (modifiers.maxEnergyCost) {
    filteredActions = filteredActions.filter(
      action => action.energyCost <= modifiers.maxEnergyCost
    );
  }
  
  if (modifiers.minEnergyCost) {
    filteredActions = filteredActions.filter(
      action => action.energyCost >= modifiers.minEnergyCost
    );
  }
  
  return filteredActions;
}

export function applyModifiersToGameState(initialState, modifiers, playerRole) {
  const modifiedState = { ...initialState };
  
  if (modifiers.startingEnergy !== undefined) {
    if (playerRole === 'hacker') {
      modifiedState.energyHacker = modifiers.startingEnergy;
    } else {
      modifiedState.energyDefender = modifiers.startingEnergy;
    }
  }
  
  modifiedState.challengeModifiers = modifiers;
  
  return modifiedState;
}
