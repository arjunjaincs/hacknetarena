/**
 * HackNet Arena - Game Engine v4.0 (Optimized)
 * 
 * FEATURES:
 * - Synergy/Combo system (chained actions give bonuses)
 * - Momentum tracking (consecutive wins = +5% each, max +25%)
 * - Counter system (category-based, -40% penalty)
 * - Energy management with regeneration (+15 per round)
 * - Threat zones (Green/Yellow/Red)
 * - Strategic scoring (rewards combos, momentum, efficiency)
 * 
 * OPTIMIZATIONS:
 * - Map-based combo lookups (O(1) performance)
 * - Fixed energy regeneration
 * - Fixed counter system for both roles
 * - Improved input validation
 * - Reduced memory allocation
 */

import { HACKER_ACTIONS, DEFENDER_ACTIONS, getActionById } from './gameActions.js';

// ============================================================================
// CONSTANTS
// ============================================================================

const ENERGY_REGEN_PER_ROUND = 15;
const MAX_ENERGY = 100;
const MIN_SUCCESS_CHANCE = 5;
const MAX_SUCCESS_CHANCE = 95;
const MOMENTUM_BONUS_PER_LEVEL = 5;
const MAX_MOMENTUM = 5;
const COUNTER_PENALTY = 40;
const SYNERGY_SUCCESS_BONUS = 15;
const RANDOM_VARIANCE = 10;

// ============================================================================
// INITIAL GAME STATE
// ============================================================================

export const INITIAL_STATE = {
  // Round tracking
  round: 1,
  maxRounds: 999,
  gameOver: false,
  winner: null,
  lowThreatRounds: 0,
  difficulty: 'normal',
  
  // Core metrics
  energyHacker: 100,
  energyDefender: 100,
  networkIntegrity: 100,
  dataStolen: 0,
  threatLevel: 50,
  
  // Player info
  playerRole: null,
  playerName: '',
  playerScore: 0,
  aiScore: 0,
  userId: null,
  
  // Momentum tracking
  hackerMomentum: 0,
  defenderMomentum: 0,
  hackerStreak: 0,
  defenderStreak: 0,
  
  // Combo tracking
  lastHackerActions: [],
  lastDefenderActions: [],
  
  // Cooldown tracking
  hackerCooldowns: {},
  defenderCooldowns: {},
  
  // Battle history
  history: [],
  
  // Stats
  combosEarned: 0,
  totalDamageDealt: 0,
  totalDamageBlocked: 0,
  
  // Detailed analytics
  roundHistory: [], // Track threat/network/energy per round
  actionUsage: {}, // Track how many times each action was used
  actionSuccess: {}, // Track success rate per action
  damageByAction: {}, // Track damage dealt by each action
  energySpent: 0,
  successfulActions: 0,
  failedActions: 0
};

// ============================================================================
// SYNERGY/COMBO SYSTEM (Optimized with Map)
// ============================================================================

const COMBO_MAP = new Map([
  // Hacker combos
  ['phishing->socialeng', { bonus: 15, name: '🎣 Social Chain', description: 'Double manipulation!' }],
  ['socialeng->phishing', { bonus: 15, name: '🎣 Social Chain', description: 'Double manipulation!' }],
  ['ddos->bruteforce', { bonus: 18, name: '💥 Network Assault', description: 'Overwhelming attack!' }],
  ['malware->zeroday', { bonus: 20, name: '⚡ Exploit Chain', description: 'Devastating combo!' }],
  
  // Defender combos
  ['firewall->monitoring', { bonus: 15, name: '🛡️ Fortified Watch', description: 'Double protection!' }],
  ['patch->backup', { bonus: 18, name: '🔧 Secure Foundation', description: 'Unbreakable defense!' }],
  ['training->antivirus', { bonus: 15, name: '📚 Aware Defense', description: 'Smart protection!' }]
]);

/**
 * Check if actions create a synergy combo (O(1) lookup)
 */
function checkSynergy(currentAction, previousActions) {
  if (!previousActions || previousActions.length === 0) return null;
  
  const lastAction = previousActions[previousActions.length - 1];
  const comboKey = `${lastAction}->${currentAction}`;
  
  return COMBO_MAP.get(comboKey) || null;
}

// ============================================================================
// ACTION SUCCESS CALCULATION
// ============================================================================

/**
 * Calculate if an action succeeds with all modifiers
 */
function calculateSuccess(action, gameState, isHacker, isCountered) {
  let chance = action.baseChance;
  
  // Get momentum
  const momentum = isHacker ? gameState.hackerMomentum : gameState.defenderMomentum;
  const momentumBonus = Math.min(momentum * MOMENTUM_BONUS_PER_LEVEL, MAX_MOMENTUM * MOMENTUM_BONUS_PER_LEVEL);
  chance += momentumBonus;
  
  // Apply counter penalty
  const counterPenalty = isCountered ? COUNTER_PENALTY : 0;
  if (isCountered) {
    chance -= COUNTER_PENALTY;
  }
  
  // Check for synergy bonus
  const previousActions = isHacker ? gameState.lastHackerActions : gameState.lastDefenderActions;
  const synergy = checkSynergy(action.id, previousActions);
  const synergyBonus = synergy ? SYNERGY_SUCCESS_BONUS : 0;
  if (synergy) {
    chance += SYNERGY_SUCCESS_BONUS;
  }
  
  // Random variance
  const randomFactor = (Math.random() - 0.5) * RANDOM_VARIANCE;
  chance += randomFactor;
  
  // Clamp between min and max
  chance = Math.max(MIN_SUCCESS_CHANCE, Math.min(MAX_SUCCESS_CHANCE, chance));
  
  // Roll for success
  const success = Math.random() * 100 < chance;
  
  return {
    success,
    finalChance: Math.round(chance),
    momentumBonus,
    counterPenalty,
    synergyBonus,
    synergy,
    randomFactor: Math.round(randomFactor)
  };
}

// ============================================================================
// CHECK COUNTERS (Fixed for both roles)
// ============================================================================

function isActionCountered(action, lastOpponentActionId, allActions) {
  if (!lastOpponentActionId) return false;
  
  // Find the opponent's last action
  const opponentAction = allActions?.find(a => a.id === lastOpponentActionId);
  if (!opponentAction) return false;
  
  // Counter relationships: Network counters Software, Human counters Network, Software counters Human
  const counterMap = {
    'Network': 'Software',
    'Human': 'Network',
    'Software': 'Human'
  };
  
  return counterMap[opponentAction.category] === action.category;
}

// ============================================================================
// PROCESS ROUND
// ============================================================================

export function processRound(state, playerAction, aiAction) {
  // Validate inputs
  if (!state) {
    throw new Error('Game state is null or undefined');
  }
  if (!playerAction) {
    throw new Error('Player action is null or undefined');
  }
  if (!aiAction) {
    throw new Error('AI action is null or undefined');
  }
  if (!playerAction.id || !playerAction.name) {
    throw new Error('Invalid player action: ' + JSON.stringify(playerAction));
  }
  if (!aiAction.id || !aiAction.name) {
    throw new Error('Invalid AI action: ' + JSON.stringify(aiAction));
  }
  
  // Shallow clone for performance (deep clone only nested objects that change)
  const newState = {
    ...state,
    hackerCooldowns: { ...state.hackerCooldowns },
    defenderCooldowns: { ...state.defenderCooldowns },
    lastHackerActions: [...state.lastHackerActions],
    lastDefenderActions: [...state.lastDefenderActions],
    history: [...state.history]
  };
  
  // Determine roles
  const hackerAction = state.playerRole === 'hacker' ? playerAction : aiAction;
  const defenderAction = state.playerRole === 'defender' ? playerAction : aiAction;
  
  // All actions for counter checking
  const allActions = state.gameActions 
    ? [...state.gameActions.hackerActions, ...state.gameActions.defenderActions]
    : [...HACKER_ACTIONS, ...DEFENDER_ACTIONS];
  
  // Validate energy state
  if (newState.energyHacker < 0 || newState.energyDefender < 0) {
    console.error('Invalid energy state detected:', {
      hacker: newState.energyHacker,
      defender: newState.energyDefender
    });
    newState.energyHacker = Math.max(0, newState.energyHacker);
    newState.energyDefender = Math.max(0, newState.energyDefender);
  }
  
  // Check energy availability
  const hackerHasEnergy = newState.energyHacker >= hackerAction.energyCost;
  const defenderHasEnergy = newState.energyDefender >= defenderAction.energyCost;
  
  // Log energy check for debugging
  if (!hackerHasEnergy) {
    console.warn(`Hacker insufficient energy: ${newState.energyHacker}/${hackerAction.energyCost} for ${hackerAction.name}`);
  }
  if (!defenderHasEnergy) {
    console.warn(`Defender insufficient energy: ${newState.energyDefender}/${defenderAction.energyCost} for ${defenderAction.name}`);
  }
  
  // Check cooldowns
  const hackerOnCooldown = (newState.hackerCooldowns[hackerAction.id] || 0) > 0;
  const defenderOnCooldown = (newState.defenderCooldowns[defenderAction.id] || 0) > 0;
  
  // Check if countered (FIXED: now properly checks opponent's action)
  const hackerCountered = isActionCountered(
    hackerAction,
    newState.lastDefenderActions[newState.lastDefenderActions.length - 1],
    allActions
  );
  
  // Calculate success
  const hackerResult = hackerHasEnergy && !hackerOnCooldown
    ? calculateSuccess(hackerAction, newState, true, hackerCountered)
    : { success: false, finalChance: 0, momentumBonus: 0, counterPenalty: 0, synergyBonus: 0, synergy: null };
    
  const defenderResult = defenderHasEnergy && !defenderOnCooldown
    ? calculateSuccess(defenderAction, newState, false, false)
    : { success: false, finalChance: 0, momentumBonus: 0, counterPenalty: 0, synergyBonus: 0, synergy: null };
  
  // Apply impacts
  let roundDamage = 0;
  let roundBlocked = 0;
  
  if (hackerResult.success) {
    // Calculate damage with synergy multiplier
    let damage = hackerAction.impactRange[0] + 
      Math.random() * (hackerAction.impactRange[1] - hackerAction.impactRange[0]);
    
    if (hackerResult.synergy) {
      damage += hackerResult.synergy.bonus;
      newState.combosEarned += 1;
    }
    
    roundDamage = damage;
    newState.totalDamageDealt += damage;
    
    // Apply to network
    newState.networkIntegrity = Math.max(0, newState.networkIntegrity - damage);
    newState.dataStolen = Math.min(100, newState.dataStolen + damage * 0.6);
    newState.threatLevel = Math.min(100, newState.threatLevel + hackerAction.threatImpact);
    
    // Update momentum
    newState.hackerMomentum = Math.min(5, newState.hackerMomentum + 1);
    newState.hackerStreak += 1;
    newState.defenderMomentum = 0;
    newState.defenderStreak = 0;
  } else {
    newState.hackerMomentum = 0;
    newState.hackerStreak = 0;
  }
  
  if (defenderResult.success) {
    // Calculate healing with synergy
    let healing = defenderAction.impactRange[0] + 
      Math.random() * (defenderAction.impactRange[1] - defenderAction.impactRange[0]);
    
    if (defenderResult.synergy) {
      healing += defenderResult.synergy.bonus;
      newState.combosEarned += 1;
    }
    
    roundBlocked = healing;
    newState.totalDamageBlocked += healing;
    
    // Apply healing
    newState.networkIntegrity = Math.min(100, newState.networkIntegrity + healing);
    newState.threatLevel = Math.max(0, newState.threatLevel - defenderAction.threatImpact);
    
    // Update momentum
    newState.defenderMomentum = Math.min(5, newState.defenderMomentum + 1);
    newState.defenderStreak += 1;
    newState.hackerMomentum = 0;
    newState.hackerStreak = 0;
  } else {
    newState.defenderMomentum = 0;
    newState.defenderStreak = 0;
  }
  
  // Deduct energy FIRST
  if (hackerHasEnergy) {
    newState.energyHacker -= hackerAction.energyCost;
  }
  if (defenderHasEnergy) {
    newState.energyDefender -= defenderAction.energyCost;
  }
  
  // Regenerate energy AFTER deduction (difficulty-based for AI)
  // Import difficulty settings
  const difficultySettings = {
    easy: { aiRegen: 12, playerRegen: 15 },
    normal: { aiRegen: 15, playerRegen: 15 },
    hard: { aiRegen: 18, playerRegen: 15 }
  };
  const difficulty = newState.difficulty || 'normal';
  const regenSettings = difficultySettings[difficulty];
  
  // Apply different regen rates based on role
  const playerRole = newState.playerRole;
  const hackerRegen = playerRole === 'hacker' ? regenSettings.playerRegen : regenSettings.aiRegen;
  const defenderRegen = playerRole === 'defender' ? regenSettings.playerRegen : regenSettings.aiRegen;
  
  newState.energyHacker = Math.max(0, Math.min(MAX_ENERGY, newState.energyHacker + hackerRegen));
  newState.energyDefender = Math.max(0, Math.min(MAX_ENERGY, newState.energyDefender + defenderRegen));
  
  // Validate energy never goes negative
  if (newState.energyHacker < 0) {
    console.error('Energy went negative for hacker:', newState.energyHacker);
    newState.energyHacker = 0;
  }
  if (newState.energyDefender < 0) {
    console.error('Energy went negative for defender:', newState.energyDefender);
    newState.energyDefender = 0;
  }
  
  // Set cooldowns
  if (hackerResult.success && hackerAction.cooldown > 0) {
    newState.hackerCooldowns[hackerAction.id] = hackerAction.cooldown;
  }
  if (defenderResult.success && defenderAction.cooldown > 0) {
    newState.defenderCooldowns[defenderAction.id] = defenderAction.cooldown;
  }
  
  // Decrease all cooldowns
  Object.keys(newState.hackerCooldowns).forEach(key => {
    newState.hackerCooldowns[key] = Math.max(0, newState.hackerCooldowns[key] - 1);
  });
  Object.keys(newState.defenderCooldowns).forEach(key => {
    newState.defenderCooldowns[key] = Math.max(0, newState.defenderCooldowns[key] - 1);
  });
  
  // Update action history (keep last 2)
  newState.lastHackerActions.push(hackerAction.id);
  if (newState.lastHackerActions.length > 2) newState.lastHackerActions.shift();
  
  newState.lastDefenderActions.push(defenderAction.id);
  if (newState.lastDefenderActions.length > 2) newState.lastDefenderActions.shift();
  
  // Track detailed analytics
  newState.roundHistory = [...(newState.roundHistory || []), {
    round: newState.round,
    threatLevel: Math.round(newState.threatLevel),
    networkIntegrity: Math.round(newState.networkIntegrity),
    energyHacker: Math.round(newState.energyHacker),
    energyDefender: Math.round(newState.energyDefender)
  }];
  
  // Track action usage
  newState.actionUsage = { ...(newState.actionUsage || {}) };
  newState.actionUsage[playerAction.id] = (newState.actionUsage[playerAction.id] || 0) + 1;
  
  // Track action success
  newState.actionSuccess = { ...(newState.actionSuccess || {}) };
  const playerResult = state.playerRole === 'hacker' ? hackerResult : defenderResult;
  if (!newState.actionSuccess[playerAction.id]) {
    newState.actionSuccess[playerAction.id] = { success: 0, total: 0 };
  }
  newState.actionSuccess[playerAction.id].total += 1;
  if (playerResult.success) {
    newState.actionSuccess[playerAction.id].success += 1;
    newState.successfulActions = (newState.successfulActions || 0) + 1;
  } else {
    newState.failedActions = (newState.failedActions || 0) + 1;
  }
  
  // Track damage by action
  if (playerResult.success && roundDamage > 0) {
    newState.damageByAction = { ...(newState.damageByAction || {}) };
    newState.damageByAction[playerAction.id] = (newState.damageByAction[playerAction.id] || 0) + roundDamage;
  }
  
  // Track energy spent
  newState.energySpent = (newState.energySpent || 0) + playerAction.energyCost;
  
  // Add to history
  newState.history.push({
    round: newState.round,
    hackerAction: hackerAction.name,
    defenderAction: defenderAction.name,
    hackerSuccess: hackerResult.success,
    hackerChance: hackerResult.finalChance,
    hackerSynergy: hackerResult.synergy,
    hackerCountered,
    defenderSuccess: defenderResult.success,
    defenderChance: defenderResult.finalChance,
    defenderSynergy: defenderResult.synergy,
    threatLevel: Math.round(newState.threatLevel),
    networkIntegrity: Math.round(newState.networkIntegrity),
    dataStolen: Math.round(newState.dataStolen),
    energyHacker: Math.round(newState.energyHacker),
    energyDefender: Math.round(newState.energyDefender),
    roundDamage: Math.round(roundDamage),
    roundBlocked: Math.round(roundBlocked)
  });
  
  // Increment round
  newState.round += 1;
  
  // Check win conditions
  checkWinConditions(newState);
  
  return newState;
}

// ============================================================================
// WIN CONDITIONS & SCORING
// ============================================================================

function checkWinConditions(state) {
  // Instant win: Threat >= 100
  if (state.threatLevel >= 100) {
    state.gameOver = true;
    state.winner = 'hacker';
    calculateFinalScores(state);
    return;
  }
  
  // Instant win: Network destroyed
  if (state.networkIntegrity <= 0) {
    state.gameOver = true;
    state.winner = 'hacker';
    calculateFinalScores(state);
    return;
  }
  
  // Track consecutive low threat rounds
  if (state.threatLevel < 40) {
    state.lowThreatRounds = (state.lowThreatRounds || 0) + 1;
  } else {
    state.lowThreatRounds = 0;
  }
  
  // Defender wins: Threat < 40 for 3 consecutive rounds
  if (state.lowThreatRounds >= 3) {
    state.gameOver = true;
    state.winner = 'defender';
    calculateFinalScores(state);
    return;
  }
  
  // Draw: Both players out of energy (< 15)
  if (state.energyHacker < 15 && state.energyDefender < 15) {
    state.gameOver = true;
    state.winner = 'draw';
    calculateFinalScores(state);
    return;
  }
}

function calculateFinalScores(state) {
  // Strategic scoring: rewards combos, momentum, efficiency
  const hackerScore = 
    state.dataStolen * 1.0 +
    (100 - state.networkIntegrity) * 0.6 +
    state.combosEarned * 10 +
    state.totalDamageDealt * 0.3 +
    (100 - state.energyHacker) * 0.1;
    
  const defenderScore = 
    state.networkIntegrity * 1.0 +
    (100 - state.dataStolen) * 0.6 +
    state.combosEarned * 10 +
    state.totalDamageBlocked * 0.3 +
    (100 - state.energyDefender) * 0.1;
  
  // Apply difficulty multiplier
  const difficultyMultipliers = {
    easy: 0.8,
    normal: 1.0,
    hard: 1.5
  };
  const multiplier = difficultyMultipliers[state.difficulty || 'normal'];
  
  state.playerScore = Math.round((state.playerRole === 'hacker' ? hackerScore : defenderScore) * multiplier);
  state.aiScore = state.playerRole === 'hacker' ? Math.round(defenderScore) : Math.round(hackerScore);
  state.difficultyMultiplier = multiplier;
}

export { calculateSuccess, checkSynergy, isActionCountered };
