/**
 * Game Analytics & Grading System
 * Calculates performance grades and detailed statistics
 */

// ============================================================================
// GRADE CALCULATION
// ============================================================================

export function calculateOverallGrade(gameState) {
  const scores = {
    offense: calculateOffenseGrade(gameState),
    defense: calculateDefenseGrade(gameState),
    strategy: calculateStrategyGrade(gameState),
    efficiency: calculateEfficiencyGrade(gameState)
  };
  
  const average = (scores.offense + scores.defense + scores.strategy + scores.efficiency) / 4;
  
  return {
    overall: scoreToGrade(average),
    overallScore: Math.round(average),
    categories: {
      offense: { grade: scoreToGrade(scores.offense), score: Math.round(scores.offense) },
      defense: { grade: scoreToGrade(scores.defense), score: Math.round(scores.defense) },
      strategy: { grade: scoreToGrade(scores.strategy), score: Math.round(scores.strategy) },
      efficiency: { grade: scoreToGrade(scores.efficiency), score: Math.round(scores.efficiency) }
    }
  };
}

function calculateOffenseGrade(gameState) {
  const role = gameState.playerRole;
  if (role === 'hacker') {
    const damageScore = (gameState.totalDamageDealt / (gameState.round * 10)) * 100;
    const threatScore = gameState.threatLevel;
    const dataScore = gameState.dataStolen;
    return (damageScore * 0.4 + threatScore * 0.3 + dataScore * 0.3);
  } else {
    const blockedScore = (gameState.totalDamageBlocked / (gameState.round * 10)) * 100;
    const threatScore = Math.max(0, 100 - gameState.threatLevel);
    return (blockedScore * 0.5 + threatScore * 0.5);
  }
}

function calculateDefenseGrade(gameState) {
  const role = gameState.playerRole;
  if (role === 'defender') {
    const networkScore = gameState.networkIntegrity;
    const threatScore = Math.max(0, 100 - gameState.threatLevel);
    return (networkScore * 0.6 + threatScore * 0.4);
  } else {
    const networkScore = Math.max(0, 100 - gameState.networkIntegrity);
    return networkScore;
  }
}

function calculateStrategyGrade(gameState) {
  const comboScore = Math.min(100, (gameState.combosEarned / Math.max(1, gameState.round / 3)) * 100);
  const successRate = gameState.successfulActions / Math.max(1, gameState.successfulActions + gameState.failedActions) * 100;
  const momentumScore = Math.min(100, ((gameState.hackerMomentum + gameState.defenderMomentum) / 10) * 100);
  
  return (comboScore * 0.4 + successRate * 0.4 + momentumScore * 0.2);
}

function calculateEfficiencyGrade(gameState) {
  const damagePerEnergy = gameState.totalDamageDealt / Math.max(1, gameState.energySpent);
  const energyScore = Math.min(100, damagePerEnergy * 20);
  
  const actionEfficiency = gameState.successfulActions / Math.max(1, gameState.round) * 100;
  
  return (energyScore * 0.5 + actionEfficiency * 0.5);
}

function scoreToGrade(score) {
  if (score >= 90) return 'S';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  if (score >= 50) return 'D';
  return 'F';
}

// ============================================================================
// GRADE COLORS
// ============================================================================

export function getGradeColor(grade) {
  const colors = {
    'S': { bg: 'bg-gradient-to-r from-yellow-500 to-orange-500', text: 'text-yellow-400', border: 'border-yellow-500', glow: 'shadow-yellow-500/50' },
    'A': { bg: 'bg-gradient-to-r from-green-500 to-emerald-500', text: 'text-green-400', border: 'border-green-500', glow: 'shadow-green-500/50' },
    'B': { bg: 'bg-gradient-to-r from-blue-500 to-cyan-500', text: 'text-blue-400', border: 'border-blue-500', glow: 'shadow-blue-500/50' },
    'C': { bg: 'bg-gradient-to-r from-purple-500 to-pink-500', text: 'text-purple-400', border: 'border-purple-500', glow: 'shadow-purple-500/50' },
    'D': { bg: 'bg-gradient-to-r from-orange-500 to-red-500', text: 'text-orange-400', border: 'border-orange-500', glow: 'shadow-orange-500/50' },
    'F': { bg: 'bg-gradient-to-r from-red-500 to-red-700', text: 'text-red-400', border: 'border-red-500', glow: 'shadow-red-500/50' }
  };
  return colors[grade] || colors['F'];
}

// ============================================================================
// IMPROVEMENT SUGGESTIONS
// ============================================================================

export function getImprovementSuggestions(grades, gameState) {
  const suggestions = [];
  
  // Offense suggestions
  if (grades.categories.offense.score < 70) {
    if (gameState.playerRole === 'hacker') {
      suggestions.push({
        category: 'Offense',
        icon: '⚔️',
        text: 'Focus on high-damage actions and chain combos for maximum impact'
      });
    } else {
      suggestions.push({
        category: 'Offense',
        icon: '🛡️',
        text: 'Block more attacks and reduce threat level consistently'
      });
    }
  }
  
  // Defense suggestions
  if (grades.categories.defense.score < 70) {
    if (gameState.playerRole === 'defender') {
      suggestions.push({
        category: 'Defense',
        icon: '🏰',
        text: 'Maintain network integrity and keep threat below 40'
      });
    } else {
      suggestions.push({
        category: 'Defense',
        icon: '💥',
        text: 'Break through defenses more effectively'
      });
    }
  }
  
  // Strategy suggestions
  if (grades.categories.strategy.score < 70) {
    suggestions.push({
      category: 'Strategy',
      icon: '🧠',
      text: 'Execute more combos and maintain momentum for bonus damage'
    });
  }
  
  // Efficiency suggestions
  if (grades.categories.efficiency.score < 70) {
    suggestions.push({
      category: 'Efficiency',
      icon: '⚡',
      text: 'Optimize energy usage - choose high-impact, low-cost actions'
    });
  }
  
  // Success rate
  const successRate = gameState.successfulActions / Math.max(1, gameState.successfulActions + gameState.failedActions) * 100;
  if (successRate < 60) {
    suggestions.push({
      category: 'Accuracy',
      icon: '🎯',
      text: 'Improve action success rate by building momentum and avoiding counters'
    });
  }
  
  return suggestions;
}

// ============================================================================
// ACTION ANALYTICS
// ============================================================================

export function getActionAnalytics(gameState, gameActions) {
  const playerActions = gameState.playerRole === 'hacker' 
    ? gameActions.hackerActions 
    : gameActions.defenderActions;
  
  const analytics = playerActions.map(action => {
    const usage = gameState.actionUsage?.[action.id] || 0;
    const successData = gameState.actionSuccess?.[action.id] || { success: 0, total: 0 };
    const damage = gameState.damageByAction?.[action.id] || 0;
    const successRate = successData.total > 0 ? (successData.success / successData.total) * 100 : 0;
    
    return {
      id: action.id,
      name: action.name,
      usage,
      successRate: Math.round(successRate),
      damage: Math.round(damage),
      efficiency: usage > 0 ? Math.round(damage / (usage * action.energyCost)) : 0
    };
  });
  
  return analytics.sort((a, b) => b.usage - a.usage);
}

// ============================================================================
// COMPARISON WITH BEST
// ============================================================================

export function compareWithBest(currentGame, bestGame) {
  if (!bestGame) return null;
  
  return {
    score: {
      current: Math.round(currentGame.playerScore || currentGame.score),
      best: Math.round(bestGame.bestScore || 0),
      improved: (currentGame.playerScore || currentGame.score) > (bestGame.bestScore || 0)
    },
    rounds: {
      current: currentGame.round - 1,
      best: bestGame.rounds || 0,
      improved: (currentGame.round - 1) < (bestGame.rounds || 999)
    },
    combos: {
      current: currentGame.combosEarned || 0,
      best: bestGame.combos || 0,
      improved: (currentGame.combosEarned || 0) > (bestGame.combos || 0)
    },
    successRate: {
      current: Math.round((currentGame.successfulActions / Math.max(1, currentGame.successfulActions + currentGame.failedActions)) * 100),
      best: bestGame.successRate || 0,
      improved: ((currentGame.successfulActions / Math.max(1, currentGame.successfulActions + currentGame.failedActions)) * 100) > (bestGame.successRate || 0)
    }
  };
}

// ============================================================================
// SHARE TEXT GENERATION
// ============================================================================

export function generateShareText(gameState, grades) {
  const role = gameState.playerRole === 'hacker' ? '🎯 Hacker' : '🛡️ Defender';
  const result = gameState.winner === gameState.playerRole ? '🏆 VICTORY' : '💔 DEFEAT';
  
  return `HackNet Arena ${result}

${role} | Round ${gameState.round - 1}
Score: ${Math.round(gameState.playerScore || gameState.score)}
Grade: ${grades.overall} (${grades.overallScore}/100)

⚔️ Offense: ${grades.categories.offense.grade}
🛡️ Defense: ${grades.categories.defense.grade}
🧠 Strategy: ${grades.categories.strategy.grade}
⚡ Efficiency: ${grades.categories.efficiency.grade}

Combos: ${gameState.combosEarned}
Success Rate: ${Math.round((gameState.successfulActions / Math.max(1, gameState.successfulActions + gameState.failedActions)) * 100)}%

Play now: https://hacknetarena.vercel.app`;
}
