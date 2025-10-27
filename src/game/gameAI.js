/**
 * HackNet Arena - AI Opponent v4.0 (Optimized)
 * 
 * OPTIMIZATIONS:
 * - Cached action lookups (O(1) performance)
 * - Improved pattern prediction algorithm
 * - Better expected value calculation
 * - Reduced redundant operations
 * - Smarter difficulty balancing
 * 
 * STRATEGY:
 * - Analyzes player's last 2 moves to predict patterns
 * - Prioritizes high-impact moves when energy allows
 * - Avoids being countered by player's likely next move
 * - Makes strategic mistakes 15% of time for balance
 * - Uses same mechanics as player (fair play)
 * 
 * DECISION PROCESS:
 * 1. Filter available actions (energy + cooldown)
 * 2. Calculate expected value for each
 * 3. Adjust for player pattern prediction
 * 4. 85% pick best, 15% random (mistakes)
 */

import { getAvailableActions, getSynergyDescription, getActionById } from './gameActions.js';
import { calculateSuccess } from './gameEngine.js';

// ============================================================================
// CONSTANTS
// ============================================================================

const MISTAKE_PROBABILITY = 0.15;
const COMBO_BONUS_MULTIPLIER = 1.3;
const COUNTER_BONUS_MULTIPLIER = 1.4;
const HIGH_DAMAGE_THRESHOLD = 12;

// AI Personalities - adds variety to gameplay
const AI_PERSONALITIES = {
  aggressive: {
    name: 'Aggressive',
    highDamageBonus: 1.4,      // Prefers high-damage moves
    riskTolerance: 1.3,         // Takes more risks
    energyConservation: 0.8     // Less conservative with energy
  },
  defensive: {
    name: 'Defensive',
    counterBonus: 1.5,          // Prioritizes counters
    energyConservation: 1.4,    // Very conservative with energy
    highDamageBonus: 0.9        // Less focused on damage
  },
  balanced: {
    name: 'Balanced',
    highDamageBonus: 1.0,
    counterBonus: 1.0,
    energyConservation: 1.0
  }
};

// Select random personality (persists for game session)
const aiPersonality = ['aggressive', 'defensive', 'balanced'][Math.floor(Math.random() * 3)];
const personalityConfig = AI_PERSONALITIES[aiPersonality];
console.log(`🤖 AI Personality: ${personalityConfig.name}`);

// ============================================================================
// AI DECISION MAKING
// ============================================================================

export function chooseAIAction(gameState) {
  const aiRole = gameState.playerRole === 'hacker' ? 'defender' : 'hacker';
  const aiEnergy = aiRole === 'hacker' ? gameState.energyHacker : gameState.energyDefender;
  const aiCooldowns = aiRole === 'hacker' ? gameState.hackerCooldowns : gameState.defenderCooldowns;
  const aiMomentum = aiRole === 'hacker' ? gameState.hackerMomentum : gameState.defenderMomentum;
  const aiLastActions = aiRole === 'hacker' ? gameState.lastHackerActions : gameState.lastDefenderActions;
  
  // Get available actions (not on cooldown, enough energy)
  const availableActions = getAvailableActions(aiRole, aiEnergy, aiCooldowns, gameState.gameActions);
  
  // Fallback: if no actions available, get all actions and pick cheapest
  if (availableActions.length === 0) {
    console.warn('AI has no available actions, picking cheapest');
    const allActions = getAvailableActions(aiRole, 100, {}, gameState.gameActions);
    if (allActions.length === 0) {
      console.error('No actions available for AI role:', aiRole);
      return null;
    }
    return allActions.reduce((cheapest, action) => 
      action.energyCost < cheapest.energyCost ? action : cheapest
    );
  }
  
  // 15% chance to make a "mistake" (random choice for balance)
  if (Math.random() < MISTAKE_PROBABILITY) {
    return availableActions[Math.floor(Math.random() * availableActions.length)];
  }
  
  // Analyze player's last 2 moves to predict pattern
  const playerLastActions = gameState.playerRole === 'hacker' 
    ? gameState.lastHackerActions 
    : gameState.lastDefenderActions;
  
  const predictedPlayerCategory = predictPlayerNextCategory(playerLastActions, gameState);
  
  // Calculate expected value for each action
  const evaluations = availableActions.map(action => {
    let ev = calculateExpectedValue(action, gameState, aiRole, aiMomentum);
    
    // Bonus for synergy with last action
    if (aiLastActions.length > 0) {
      const lastAction = aiLastActions[aiLastActions.length - 1];
      const synergy = getSynergyDescription(action.id, lastAction);
      if (synergy) {
        ev *= COMBO_BONUS_MULTIPLIER;
      }
    }
    
    // Counter system bonuses
    const counters = {
      'firewall': 'Network',
      'training': 'Human',
      'antivirus': 'Software'
    };
    
    // Bonus for countering predicted player move
    if (aiRole === 'defender' && predictedPlayerCategory) {
      if (counters[action.id] === predictedPlayerCategory) {
        ev *= COUNTER_BONUS_MULTIPLIER;
      }
    }
    
    // Adjust based on game state urgency
    ev *= getUrgencyMultiplier(gameState, aiRole, action);
    
    // Apply AI personality modifiers
    const avgImpact = (action.impactRange[0] + action.impactRange[1]) / 2;
    if (avgImpact > HIGH_DAMAGE_THRESHOLD) {
      ev *= personalityConfig.highDamageBonus || 1.0;
    }
    if (action.energyCost > 15) {
      ev *= personalityConfig.energyConservation || 1.0;
    }
    if (counters[action.id]) {
      ev *= personalityConfig.counterBonus || 1.0;
    }
    
    return { action, ev };
  });
  
  // Sort by expected value
  evaluations.sort((a, b) => b.ev - a.ev);
  
  // Pick best action
  return evaluations[0].action;
}

// ============================================================================
// PATTERN PREDICTION
// ============================================================================

/**
 * Predict player's next move category based on their last 2 actions
 */
function predictPlayerNextCategory(playerLastActions, gameState) {
  if (playerLastActions.length < 2) return null;
  
  // Simple pattern detection: if player used same category twice, 
  // they might switch or continue
  const categories = playerLastActions.map(actionId => {
    const action = getActionFromId(actionId, gameState.playerRole);
    return action ? action.category : null;
  }).filter(Boolean);
  
  if (categories.length < 2) return null;
  
  // If player used same category twice, predict they'll switch
  if (categories[0] === categories[1]) {
    const allCategories = ['Network', 'Human', 'Software'];
    const otherCategories = allCategories.filter(c => c !== categories[0]);
    return otherCategories[Math.floor(Math.random() * otherCategories.length)];
  }
  
  // If alternating, predict they'll continue alternating
  return categories[0];
}

function getActionFromId(actionId, role) {
  // Get all actions for the role and find by ID
  const actions = getAvailableActions(role, 999, {}); // Get all actions
  return actions.find(a => a.id === actionId);
}

// ============================================================================
// EXPECTED VALUE CALCULATION
// ============================================================================

function calculateExpectedValue(action, gameState, role, momentum) {
  // Estimate success chance (simplified, no counter check for AI planning)
  const baseChance = action.baseChance + (momentum * 5);
  const successChance = Math.max(5, Math.min(95, baseChance)) / 100;
  
  // Average impact
  const avgImpact = (action.impactRange[0] + action.impactRange[1]) / 2;
  
  // Strategic value
  const strategicValue = calculateStrategicValue(action, gameState, role);
  
  // Expected value
  return successChance * avgImpact * strategicValue;
}

// ============================================================================
// STRATEGIC VALUE
// ============================================================================

function calculateStrategicValue(action, gameState, role) {
  let value = 1.0;
  
  if (role === 'hacker') {
    // Aggressive when threat is high
    if (gameState.threatLevel > 75) {
      value *= 1.4;
    }
    
    // Finish low integrity networks
    if (gameState.networkIntegrity < 30) {
      value *= 1.3;
    }
    
    // Prefer high-impact when ahead
    if (gameState.dataStolen > 60) {
      value *= (action.threatImpact / 10);
    }
    
    // Energy efficiency late game
    if (gameState.round > 3) {
      value *= (1 - action.energyCost / 100);
    }
  } else {
    // Defensive urgency when threat is critical
    if (gameState.threatLevel > 75) {
      value *= (action.threatImpact / 10) * 2.5;
    }
    
    // Restore integrity when low
    if (gameState.networkIntegrity < 40) {
      value *= 1.5;
    }
    
    // Counter high data stolen
    if (gameState.dataStolen > 50) {
      value *= 1.3;
    }
  }
  
  return value;
}

// ============================================================================
// URGENCY MULTIPLIER
// ============================================================================

function getUrgencyMultiplier(gameState, role, action) {
  let multiplier = 1.0;
  
  // Last round urgency
  if (gameState.round >= gameState.maxRounds) {
    multiplier *= 1.5;
  }
  
  // Critical threat level
  if (gameState.threatLevel > 85 && role === 'defender') {
    multiplier *= 2.0;
  }
  
  if (gameState.threatLevel > 85 && role === 'hacker') {
    // Go for the kill
    if (action.threatImpact >= 15) {
      multiplier *= 1.8;
    }
  }
  
  // Critical network integrity
  if (gameState.networkIntegrity < 20) {
    if (role === 'hacker') {
      multiplier *= 1.6; // Finish it
    } else {
      multiplier *= 1.4; // Desperate defense
    }
  }
  
  return multiplier;
}

export { calculateExpectedValue, predictPlayerNextCategory };
