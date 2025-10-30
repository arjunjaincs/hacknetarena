/**
 * Achievement Firebase Management
 * Handles saving and loading achievements
 */

import { database, isFirebaseEnabled } from './config';
import { ref, set, get, update } from 'firebase/database';

/**
 * Save unlocked achievements to Firebase
 * @param {string} userId - User ID
 * @param {Array} achievementIds - Array of unlocked achievement IDs
 * @returns {Promise<boolean>} Success status
 */
export async function saveAchievements(userId, achievementIds) {
  if (!isFirebaseEnabled || !userId) {
    console.warn('Cannot save achievements: No database or userId');
    return false;
  }

  try {
    const achievementsRef = ref(database, `users/${userId}/achievements`);
    await set(achievementsRef, {
      unlocked: achievementIds,
      lastUpdated: Date.now()
    });
    console.log('Achievements saved successfully');
    return true;
  } catch (error) {
    console.error('Error saving achievements:', error);
    return false;
  }
}

/**
 * Get user's unlocked achievements
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of unlocked achievement IDs
 */
export async function getAchievements(userId) {
  if (!isFirebaseEnabled || !userId) {
    return [];
  }

  try {
    const achievementsRef = ref(database, `users/${userId}/achievements`);
    const snapshot = await get(achievementsRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      return data.unlocked || [];
    }
    return [];
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return [];
  }
}

/**
 * Save achievement stats (for progress tracking)
 * @param {string} userId - User ID
 * @param {Object} stats - Achievement stats
 * @returns {Promise<boolean>} Success status
 */
export async function saveAchievementStats(userId, stats) {
  if (!isFirebaseEnabled || !userId) {
    return false;
  }

  try {
    const statsRef = ref(database, `users/${userId}/achievementStats`);
    await set(statsRef, {
      ...stats,
      lastUpdated: Date.now()
    });
    return true;
  } catch (error) {
    console.error('Error saving achievement stats:', error);
    return false;
  }
}

/**
 * Get achievement stats
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Achievement stats
 */
export async function getAchievementStats(userId) {
  if (!isFirebaseEnabled || !userId) {
    return getDefaultStats();
  }

  try {
    const statsRef = ref(database, `users/${userId}/achievementStats`);
    const snapshot = await get(statsRef);
    
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return getDefaultStats();
  } catch (error) {
    console.error('Error fetching achievement stats:', error);
    return getDefaultStats();
  }
}

/**
 * Update specific achievement stat
 * @param {string} userId - User ID
 * @param {string} statKey - Stat key to update
 * @param {any} value - New value
 * @returns {Promise<boolean>} Success status
 */
export async function updateAchievementStat(userId, statKey, value) {
  if (!isFirebaseEnabled || !userId) {
    return false;
  }

  try {
    const statsRef = ref(database, `users/${userId}/achievementStats`);
    await update(statsRef, {
      [statKey]: value,
      lastUpdated: Date.now()
    });
    return true;
  } catch (error) {
    console.error('Error updating achievement stat:', error);
    return false;
  }
}

/**
 * Get default achievement stats
 */
function getDefaultStats() {
  return {
    totalWins: 0,
    totalGames: 0,
    totalCombos: 0,
    totalScore: 0,
    bestScore: 0,
    hackerWins: 0,
    defenderWins: 0,
    perfectGames: 0,
    comebackWins: 0,
    winStreak: 0,
    maxWinStreak: 0,
    maxCombosInGame: 0,
    uniqueCombos: 0,
    uniqueCombosUsed: [],
    lowEnergyWins: 0,
    fastWins: 0,
    ultraFastWins: 0,
    longGames: 0,
    maxMomentumReached: 0,
    countersExecuted: 0,
    maxThreatReached: 0,
    lowThreatGames: 0
  };
}
