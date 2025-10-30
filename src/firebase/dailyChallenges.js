/**
 * Firebase Daily Challenge Management
 */

import { database, isFirebaseEnabled } from './config';
import { ref, set, get, update } from 'firebase/database';
import { getTodayDateString } from '../game/dailyChallenges';

/**
 * Save daily challenge completion
 */
export async function saveChallengeCompletion(userId, date, score, challengeData) {
  if (!isFirebaseEnabled || !userId) {
    return false;
  }

  try {
    const challengeRef = ref(database, `dailyChallenges/${date}/${userId}`);
    await set(challengeRef, {
      score,
      completed: true,
      timestamp: Date.now(),
      challengeType: challengeData.type,
      role: challengeData.role
    });
    
    // Update user's challenge stats
    const userStatsRef = ref(database, `users/${userId}/challengeStats`);
    const snapshot = await get(userStatsRef);
    const stats = snapshot.exists() ? snapshot.val() : {
      totalCompleted: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastCompletedDate: null
    };
    
    // Update stats
    stats.totalCompleted = (stats.totalCompleted || 0) + 1;
    
    // Calculate streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (stats.lastCompletedDate === yesterdayStr) {
      stats.currentStreak = (stats.currentStreak || 0) + 1;
    } else if (stats.lastCompletedDate !== date) {
      stats.currentStreak = 1;
    }
    
    stats.longestStreak = Math.max(stats.longestStreak || 0, stats.currentStreak);
    stats.lastCompletedDate = date;
    
    await set(userStatsRef, stats);
    
    return true;
  } catch (error) {
    console.error('Error saving challenge completion:', error);
    return false;
  }
}

/**
 * Check if user completed today's challenge
 */
export async function hasCompletedTodaysChallenge(userId) {
  if (!isFirebaseEnabled || !userId) {
    return false;
  }

  try {
    const today = getTodayDateString();
    const challengeRef = ref(database, `dailyChallenges/${today}/${userId}`);
    const snapshot = await get(challengeRef);
    return snapshot.exists();
  } catch (error) {
    console.error('Error checking challenge completion:', error);
    return false;
  }
}

/**
 * Get today's challenge completion count
 */
export async function getTodaysChallengeCount() {
  if (!isFirebaseEnabled) {
    return 0;
  }

  try {
    const today = getTodayDateString();
    const challengeRef = ref(database, `dailyChallenges/${today}`);
    const snapshot = await get(challengeRef);
    
    if (snapshot.exists()) {
      return Object.keys(snapshot.val()).length;
    }
    return 0;
  } catch (error) {
    console.error('Error getting challenge count:', error);
    return 0;
  }
}

/**
 * Get user's challenge stats
 */
export async function getUserChallengeStats(userId) {
  if (!isFirebaseEnabled || !userId) {
    return {
      totalCompleted: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastCompletedDate: null
    };
  }

  try {
    const userStatsRef = ref(database, `users/${userId}/challengeStats`);
    const snapshot = await get(userStatsRef);
    
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return {
      totalCompleted: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastCompletedDate: null
    };
  } catch (error) {
    console.error('Error getting challenge stats:', error);
    return {
      totalCompleted: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastCompletedDate: null
    };
  }
}

/**
 * Get global average score for today's challenge
 */
export async function getTodaysAverageScore() {
  if (!isFirebaseEnabled) {
    return 0;
  }

  try {
    const today = getTodayDateString();
    const challengeRef = ref(database, `dailyChallenges/${today}`);
    const snapshot = await get(challengeRef);
    
    if (snapshot.exists()) {
      const completions = snapshot.val();
      const scores = Object.values(completions).map(c => c.score);
      const average = scores.reduce((a, b) => a + b, 0) / scores.length;
      return Math.round(average);
    }
    return 0;
  } catch (error) {
    console.error('Error getting average score:', error);
    return 0;
  }
}
