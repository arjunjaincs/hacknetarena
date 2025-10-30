/**
 * Achievement System
 * Tracks and manages player achievements
 */

// ============================================================================
// ACHIEVEMENT DEFINITIONS (30 Total)
// ============================================================================

export const ACHIEVEMENTS = {
  // Combat Achievements (8)
  FIRST_BLOOD: {
    id: 'first_blood',
    name: 'First Blood',
    description: 'Win your first game',
    icon: '🎯',
    category: 'combat',
    rarity: 'common',
    condition: (stats) => stats.totalWins >= 1
  },
  
  VETERAN: {
    id: 'veteran',
    name: 'Veteran',
    description: 'Win 5 games',
    icon: '⭐',
    category: 'combat',
    rarity: 'common',
    progress: true,
    maxProgress: 5,
    condition: (stats) => stats.totalWins >= 5
  },
  
  ELITE_WARRIOR: {
    id: 'elite_warrior',
    name: 'Elite Warrior',
    description: 'Win 10 games',
    icon: '🏆',
    category: 'combat',
    rarity: 'rare',
    progress: true,
    maxProgress: 10,
    condition: (stats) => stats.totalWins >= 10
  },
  
  LEGEND: {
    id: 'legend',
    name: 'Legend',
    description: 'Win 25 games',
    icon: '👑',
    category: 'combat',
    rarity: 'epic',
    progress: true,
    maxProgress: 25,
    condition: (stats) => stats.totalWins >= 25
  },
  
  PERFECT_GAME: {
    id: 'perfect_game',
    name: 'Flawless Victory',
    description: 'Win without taking any damage',
    icon: '💎',
    category: 'combat',
    rarity: 'epic',
    condition: (stats) => stats.perfectGames >= 1
  },
  
  COMEBACK_KING: {
    id: 'comeback_king',
    name: 'Comeback King',
    description: 'Win from critical threat level (>80)',
    icon: '🔥',
    category: 'combat',
    rarity: 'rare',
    condition: (stats) => stats.comebackWins >= 1
  },
  
  DOMINATOR: {
    id: 'dominator',
    name: 'Dominator',
    description: 'Win 5 games in a row',
    icon: '⚡',
    category: 'combat',
    rarity: 'epic',
    condition: (stats) => stats.winStreak >= 5
  },
  
  UNSTOPPABLE: {
    id: 'unstoppable',
    name: 'Unstoppable',
    description: 'Win 10 games in a row',
    icon: '🌟',
    category: 'combat',
    rarity: 'legendary',
    condition: (stats) => stats.winStreak >= 10
  },
  
  // Combo Achievements (6)
  COMBO_NOVICE: {
    id: 'combo_novice',
    name: 'Combo Novice',
    description: 'Execute your first combo',
    icon: '🔗',
    category: 'combo',
    rarity: 'common',
    condition: (stats) => stats.totalCombos >= 1
  },
  
  COMBO_MASTER: {
    id: 'combo_master',
    name: 'Combo Master',
    description: 'Execute 25 combos',
    icon: '⚔️',
    category: 'combo',
    rarity: 'rare',
    progress: true,
    maxProgress: 25,
    condition: (stats) => stats.totalCombos >= 25
  },
  
  COMBO_LEGEND: {
    id: 'combo_legend',
    name: 'Combo Legend',
    description: 'Execute 100 combos',
    icon: '🎭',
    category: 'combo',
    rarity: 'epic',
    progress: true,
    maxProgress: 100,
    condition: (stats) => stats.totalCombos >= 100
  },
  
  CHAIN_REACTION: {
    id: 'chain_reaction',
    name: 'Chain Reaction',
    description: 'Execute 3 combos in one game',
    icon: '💥',
    category: 'combo',
    rarity: 'rare',
    condition: (stats) => stats.maxCombosInGame >= 3
  },
  
  COMBO_FIEND: {
    id: 'combo_fiend',
    name: 'Combo Fiend',
    description: 'Execute 5 combos in one game',
    icon: '🌪️',
    category: 'combo',
    rarity: 'epic',
    condition: (stats) => stats.maxCombosInGame >= 5
  },
  
  ALL_COMBOS: {
    id: 'all_combos',
    name: 'Combo Collector',
    description: 'Execute all 18 unique combos',
    icon: '🎨',
    category: 'combo',
    rarity: 'legendary',
    condition: (stats) => stats.uniqueCombos >= 18
  },
  
  // Strategy Achievements (6)
  ENERGY_EFFICIENT: {
    id: 'energy_efficient',
    name: 'Energy Efficient',
    description: 'Win with less than 20 energy remaining',
    icon: '🔋',
    category: 'strategy',
    rarity: 'rare',
    condition: (stats) => stats.lowEnergyWins >= 1
  },
  
  SPEEDRUNNER: {
    id: 'speedrunner',
    name: 'Speedrunner',
    description: 'Win in 8 rounds or less',
    icon: '⏱️',
    category: 'strategy',
    rarity: 'rare',
    condition: (stats) => stats.fastWins >= 1
  },
  
  LIGHTNING_FAST: {
    id: 'lightning_fast',
    name: 'Lightning Fast',
    description: 'Win in 5 rounds or less',
    icon: '⚡',
    category: 'strategy',
    rarity: 'epic',
    condition: (stats) => stats.ultraFastWins >= 1
  },
  
  MARATHON_RUNNER: {
    id: 'marathon_runner',
    name: 'Marathon Runner',
    description: 'Win a game lasting 20+ rounds',
    icon: '🏃',
    category: 'strategy',
    rarity: 'rare',
    condition: (stats) => stats.longGames >= 1
  },
  
  MOMENTUM_MASTER: {
    id: 'momentum_master',
    name: 'Momentum Master',
    description: 'Reach maximum momentum (5 levels)',
    icon: '📈',
    category: 'strategy',
    rarity: 'rare',
    condition: (stats) => stats.maxMomentumReached >= 1
  },
  
  COUNTER_STRIKER: {
    id: 'counter_striker',
    name: 'Counter Striker',
    description: 'Counter the AI 10 times',
    icon: '🛡️',
    category: 'strategy',
    rarity: 'rare',
    progress: true,
    maxProgress: 10,
    condition: (stats) => stats.countersExecuted >= 10
  },
  
  // Score Achievements (4)
  HIGH_SCORER: {
    id: 'high_scorer',
    name: 'High Scorer',
    description: 'Score 500+ points in one game',
    icon: '💯',
    category: 'score',
    rarity: 'rare',
    condition: (stats) => stats.bestScore >= 500
  },
  
  POINT_MASTER: {
    id: 'point_master',
    name: 'Point Master',
    description: 'Score 1000+ points in one game',
    icon: '🎯',
    category: 'score',
    rarity: 'epic',
    condition: (stats) => stats.bestScore >= 1000
  },
  
  SCORE_LEGEND: {
    id: 'score_legend',
    name: 'Score Legend',
    description: 'Score 1500+ points in one game',
    icon: '🌟',
    category: 'score',
    rarity: 'legendary',
    condition: (stats) => stats.bestScore >= 1500
  },
  
  TOTAL_DOMINATION: {
    id: 'total_domination',
    name: 'Total Domination',
    description: 'Accumulate 10,000 total points',
    icon: '💰',
    category: 'score',
    rarity: 'epic',
    progress: true,
    maxProgress: 10000,
    condition: (stats) => stats.totalScore >= 10000
  },
  
  // Role-Specific Achievements (6)
  HACKER_INITIATE: {
    id: 'hacker_initiate',
    name: 'Hacker Initiate',
    description: 'Win 5 games as Hacker',
    icon: '🎯',
    category: 'hacker',
    rarity: 'common',
    progress: true,
    maxProgress: 5,
    condition: (stats) => stats.hackerWins >= 5
  },
  
  MASTER_HACKER: {
    id: 'master_hacker',
    name: 'Master Hacker',
    description: 'Win 15 games as Hacker',
    icon: '💻',
    category: 'hacker',
    rarity: 'rare',
    progress: true,
    maxProgress: 15,
    condition: (stats) => stats.hackerWins >= 15
  },
  
  CYBER_TERRORIST: {
    id: 'cyber_terrorist',
    name: 'Cyber Terrorist',
    description: 'Reach threat level 100 as Hacker',
    icon: '☠️',
    category: 'hacker',
    rarity: 'rare',
    condition: (stats) => stats.maxThreatReached >= 1
  },
  
  DEFENDER_INITIATE: {
    id: 'defender_initiate',
    name: 'Defender Initiate',
    description: 'Win 5 games as Defender',
    icon: '🛡️',
    category: 'defender',
    rarity: 'common',
    progress: true,
    maxProgress: 5,
    condition: (stats) => stats.defenderWins >= 5
  },
  
  MASTER_DEFENDER: {
    id: 'master_defender',
    name: 'Master Defender',
    description: 'Win 15 games as Defender',
    icon: '🏰',
    category: 'defender',
    rarity: 'rare',
    progress: true,
    maxProgress: 15,
    condition: (stats) => stats.defenderWins >= 15
  },
  
  FORTRESS: {
    id: 'fortress',
    name: 'Fortress',
    description: 'Keep threat below 40 for entire game',
    icon: '🧱',
    category: 'defender',
    rarity: 'epic',
    condition: (stats) => stats.lowThreatGames >= 1
  }
};

// ============================================================================
// ACHIEVEMENT CATEGORIES
// ============================================================================

export const ACHIEVEMENT_CATEGORIES = {
  combat: { name: 'Combat', color: 'red', icon: '⚔️' },
  combo: { name: 'Combos', color: 'purple', icon: '🔗' },
  strategy: { name: 'Strategy', color: 'blue', icon: '🧠' },
  score: { name: 'Score', color: 'yellow', icon: '💯' },
  hacker: { name: 'Hacker', color: 'red', icon: '🎯' },
  defender: { name: 'Defender', color: 'green', icon: '🛡️' }
};

// ============================================================================
// RARITY DEFINITIONS
// ============================================================================

export const RARITY_CONFIG = {
  common: { name: 'Common', color: '#9CA3AF', glow: 'rgba(156, 163, 175, 0.5)' },
  rare: { name: 'Rare', color: '#3B82F6', glow: 'rgba(59, 130, 246, 0.5)' },
  epic: { name: 'Epic', color: '#A855F7', glow: 'rgba(168, 85, 247, 0.5)' },
  legendary: { name: 'Legendary', color: '#F59E0B', glow: 'rgba(245, 158, 11, 0.5)' }
};

// ============================================================================
// ACHIEVEMENT CHECKING
// ============================================================================

/**
 * Check which achievements were newly unlocked
 * @param {Object} stats - Player stats
 * @param {Array} unlockedIds - Already unlocked achievement IDs
 * @returns {Array} Newly unlocked achievements
 */
export function checkAchievements(stats, unlockedIds = []) {
  const newlyUnlocked = [];
  
  Object.values(ACHIEVEMENTS).forEach(achievement => {
    // Skip if already unlocked
    if (unlockedIds.includes(achievement.id)) {
      return;
    }
    
    // Check if condition is met
    if (achievement.condition(stats)) {
      newlyUnlocked.push(achievement);
    }
  });
  
  return newlyUnlocked;
}

/**
 * Get achievement progress
 * @param {Object} achievement - Achievement definition
 * @param {Object} stats - Player stats
 * @returns {Object} Progress info
 */
export function getAchievementProgress(achievement, stats) {
  if (!achievement.progress) {
    return { current: 0, max: 1, percentage: 0 };
  }
  
  let current = 0;
  
  // Determine current progress based on achievement
  if (achievement.id === 'veteran') current = stats.totalWins;
  else if (achievement.id === 'elite_warrior') current = stats.totalWins;
  else if (achievement.id === 'legend') current = stats.totalWins;
  else if (achievement.id === 'combo_master') current = stats.totalCombos;
  else if (achievement.id === 'combo_legend') current = stats.totalCombos;
  else if (achievement.id === 'counter_striker') current = stats.countersExecuted;
  else if (achievement.id === 'total_domination') current = stats.totalScore;
  else if (achievement.id === 'hacker_initiate') current = stats.hackerWins;
  else if (achievement.id === 'master_hacker') current = stats.hackerWins;
  else if (achievement.id === 'defender_initiate') current = stats.defenderWins;
  else if (achievement.id === 'master_defender') current = stats.defenderWins;
  
  const max = achievement.maxProgress || 1;
  const percentage = Math.min(100, (current / max) * 100);
  
  return { current, max, percentage };
}

/**
 * Get all achievements with their unlock status
 * @param {Array} unlockedIds - Unlocked achievement IDs
 * @param {Object} stats - Player stats for progress
 * @returns {Array} All achievements with status
 */
export function getAllAchievementsWithStatus(unlockedIds = [], stats = {}) {
  return Object.values(ACHIEVEMENTS).map(achievement => ({
    ...achievement,
    unlocked: unlockedIds.includes(achievement.id),
    progress: getAchievementProgress(achievement, stats)
  }));
}

/**
 * Calculate completion percentage
 * @param {Array} unlockedIds - Unlocked achievement IDs
 * @returns {number} Completion percentage
 */
export function getCompletionPercentage(unlockedIds = []) {
  const total = Object.keys(ACHIEVEMENTS).length;
  const unlocked = unlockedIds.length;
  return Math.round((unlocked / total) * 100);
}

/**
 * Get achievements by category
 * @param {string} category - Category name
 * @param {Array} unlockedIds - Unlocked achievement IDs
 * @param {Object} stats - Player stats
 * @returns {Array} Achievements in category
 */
export function getAchievementsByCategory(category, unlockedIds = [], stats = {}) {
  return getAllAchievementsWithStatus(unlockedIds, stats)
    .filter(a => a.category === category);
}

/**
 * Get recently unlocked achievements
 * @param {Array} unlockedIds - All unlocked achievement IDs
 * @param {number} limit - Number to return
 * @returns {Array} Recent achievements
 */
export function getRecentAchievements(unlockedIds = [], limit = 5) {
  // In a real implementation, you'd track unlock timestamps
  // For now, just return the last N unlocked
  return unlockedIds.slice(-limit).map(id => 
    Object.values(ACHIEVEMENTS).find(a => a.id === id)
  ).filter(Boolean);
}
