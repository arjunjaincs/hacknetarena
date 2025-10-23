/**
 * HackNet Arena - Enhanced Game Engine v3.0
 * 
 * NEW FEATURES:
 * - Synergy/Combo system (chained actions give bonuses)
 * - Momentum tracking (consecutive wins = +5% each, max +25%)
 * - Counter system (category-based, -40% penalty)
 * - Energy & Cooldown management
 * - Threat zones (Green/Yellow/Red)
 * - Strategic scoring (rewards combos, momentum, efficiency)
 */

// ============================================================================
// INITIAL GAME STATE
// ============================================================================

export const INITIAL_STATE = {
  // Round tracking
  round: 1,
  maxRounds: 999, // Effectively infinite
  gameOver: false,
  winner: null,
  lowThreatRounds: 0, // Track consecutive rounds with threat < 40
  
  // Core metrics
  energyHacker: 100,
  energyDefender: 100,
  networkIntegrity: 100,
  dataStolen: 0,
  threatLevel: 50, // Start at 50 for balanced gameplay
  
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
  
  // Combo tracking (for synergies)
  lastHackerActions: [], // Last 2 actions
  lastDefenderActions: [],
  
  // Cooldown tracking
  hackerCooldowns: {},
  defenderCooldowns: {},
  
  // Battle history
  history: [],
  
  // Combo bonuses earned this game
  combosEarned: 0,
  totalDamageDealt: 0,
  totalDamageBlocked: 0
};

// ============================================================================
// SYNERGY/COMBO SYSTEM
// ============================================================================

/**
 * Check if actions create a synergy combo
 * Returns bonus threat/impact if combo detected
 */
function checkSynergy(currentAction, previousActions) {
  if (previousActions.length === 0) return null;
  
  const lastAction = previousActions[previousActions.length - 1];
  
  // HACKER COMBOS (Simplified to 3 essential combos)
  const hackerCombos = {
    // Social Engineering chain
    'phishing->socialeng': { bonus: 15, name: '🎣 Social Chain', description: 'Double manipulation!' },
    'socialeng->phishing': { bonus: 15, name: '🎣 Social Chain', description: 'Double manipulation!' },
    
    // Network assault
    'ddos->bruteforce': { bonus: 18, name: '💥 Network Assault', description: 'Overwhelming attack!' },
    
    // Software exploit chain
    'malware->zeroday': { bonus: 20, name: '⚡ Exploit Chain', description: 'Devastating combo!' }
  };
  
  // DEFENDER COMBOS (Simplified to 3 essential combos)
  const defenderCombos = {
    // Layered defense
    'firewall->monitoring': { bonus: 15, name: '🛡️ Fortified Watch', description: 'Double protection!' },
    
    // Proactive defense
    'patch->backup': { bonus: 18, name: '🔧 Secure Foundation', description: 'Unbreakable defense!' },
    
    // Complete protection
    'training->antivirus': { bonus: 15, name: '📚 Aware Defense', description: 'Smart protection!' }
  };
  
  const comboKey = `${lastAction}->${currentAction}`;
  const combos = currentAction.startsWith('firewall') || 
                 currentAction.startsWith('training') || 
                 currentAction.startsWith('antivirus') ||
                 currentAction.startsWith('monitoring') ||
                 currentAction.startsWith('patch') ||
                 currentAction.startsWith('backup')
                 ? defenderCombos : hackerCombos;
  
  return combos[comboKey] || null;
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
  const momentumBonus = Math.min(momentum * 5, 25);
  chance += momentumBonus;
  
  // Apply counter penalty
  if (isCountered) {
    chance -= 40;
  }
  
  // Check for synergy bonus
  const previousActions = isHacker ? gameState.lastHackerActions : gameState.lastDefenderActions;
  const synergy = checkSynergy(action.id, previousActions);
  let synergyBonus = 0;
  if (synergy) {
    synergyBonus = 15; // +15% success for combos
    chance += synergyBonus;
  }
  
  // Random variance (±5%)
  const randomFactor = (Math.random() - 0.5) * 10;
  chance += randomFactor;
  
  // Clamp between 5% and 95%
  chance = Math.max(5, Math.min(95, chance));
  
  // Roll for success
  const success = Math.random() * 100 < chance;
  
  return {
    success,
    finalChance: Math.round(chance),
    momentumBonus,
    counterPenalty: isCountered ? 40 : 0,
    synergyBonus,
    synergy,
    randomFactor: Math.round(randomFactor)
  };
}

// ============================================================================
// CHECK COUNTERS
// ============================================================================

function isActionCountered(action, lastOpponentAction) {
  if (!lastOpponentAction) return false;
  
  const counters = {
    'firewall': 'Network',
    'training': 'Human',
    'antivirus': 'Software'
  };
  
  return counters[lastOpponentAction] === action.category;
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
  
  const newState = JSON.parse(JSON.stringify(state)); // Deep clone
  
  // Determine roles
  const hackerAction = state.playerRole === 'hacker' ? playerAction : aiAction;
  const defenderAction = state.playerRole === 'defender' ? playerAction : aiAction;
  
  // Check energy
  const hackerHasEnergy = newState.energyHacker >= hackerAction.energyCost;
  const defenderHasEnergy = newState.energyDefender >= defenderAction.energyCost;
  
  // Check cooldowns
  const hackerOnCooldown = newState.hackerCooldowns[hackerAction.id] > 0;
  const defenderOnCooldown = newState.defenderCooldowns[defenderAction.id] > 0;
  
  // Check if countered
  const hackerCountered = isActionCountered(
    hackerAction, 
    newState.lastDefenderActions[newState.lastDefenderActions.length - 1]
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
  
  // Deduct energy
  if (hackerHasEnergy) newState.energyHacker -= hackerAction.energyCost;
  if (defenderHasEnergy) newState.energyDefender -= defenderAction.energyCost;
  
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
  
  // Add to history
  newState.history.push({
    round: newState.round,
    hackerAction: hackerAction.name,
    hackerSuccess: hackerResult.success,
    hackerChance: hackerResult.finalChance,
    hackerCountered,
    hackerSynergy: hackerResult.synergy,
    defenderAction: defenderAction.name,
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
  
  state.playerScore = state.playerRole === 'hacker' ? hackerScore : defenderScore;
  state.aiScore = state.playerRole === 'hacker' ? defenderScore : hackerScore;
}

export { calculateSuccess, checkSynergy };
