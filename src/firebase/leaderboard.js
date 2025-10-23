/**
 * Leaderboard Management
 * Handles reading and writing high scores to Firebase
 */

import { database, isFirebaseEnabled } from './config';
import { ref, push, set, get, query, orderByChild, limitToLast } from 'firebase/database';

/**
 * Submit a score to the leaderboard
 * @param {string} playerName - Player's name
 * @param {number} score - Final score
 * @param {string} role - 'hacker' or 'defender'
 * @param {boolean} won - Whether player won
 * @param {string} userId - User ID from Firebase Auth
 * @returns {Promise<boolean>} Success status
 */
export async function submitScore(playerName, score, role, won, userId = null) {
  if (!isFirebaseEnabled) {
    console.warn('Firebase not enabled - score not saved');
    return false;
  }
  
  try {
    const leaderboardRef = ref(database, 'leaderboard');
    const newScoreRef = push(leaderboardRef);
    
    await set(newScoreRef, {
      playerName: playerName.substring(0, 20),
      score: score,
      role: role,
      won: won,
      userId: userId,
      timestamp: Date.now(),
      date: new Date().toISOString()
    });
    
    console.log('Score submitted successfully');
    return true;
  } catch (error) {
    console.error('Error submitting score:', error);
    return false;
  }
}

/**
 * Get top scores from leaderboard
 * @param {number} limit - Number of scores to retrieve
 * @returns {Promise<Array>} Array of top scores
 */
export async function getTopScores(limit = 10) {
  if (!isFirebaseEnabled) {
    console.warn('Firebase not enabled - returning mock data');
    return getMockLeaderboard();
  }
  
  try {
    const leaderboardRef = ref(database, 'leaderboard');
    const topScoresQuery = query(
      leaderboardRef,
      orderByChild('score'),
      limitToLast(limit)
    );
    
    const snapshot = await get(topScoresQuery);
    
    if (snapshot.exists()) {
      const scores = [];
      snapshot.forEach((childSnapshot) => {
        scores.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      
      // Sort by score descending
      return scores.sort((a, b) => b.score - a.score);
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return getMockLeaderboard();
  }
}

/**
 * Get player's rank on leaderboard
 * @param {number} score - Player's score
 * @returns {Promise<number>} Player's rank (1-indexed)
 */
export async function getPlayerRank(score) {
  if (!isFirebaseEnabled) {
    return Math.floor(Math.random() * 50) + 1;
  }
  
  try {
    const leaderboardRef = ref(database, 'leaderboard');
    const snapshot = await get(leaderboardRef);
    
    if (snapshot.exists()) {
      const scores = [];
      snapshot.forEach((childSnapshot) => {
        scores.push(childSnapshot.val().score);
      });
      
      scores.sort((a, b) => b - a);
      const rank = scores.findIndex(s => s <= score) + 1;
      return rank || scores.length + 1;
    }
    
    return 1;
  } catch (error) {
    console.error('Error getting rank:', error);
    return 0;
  }
}

/**
 * Get smart leaderboard showing players around the user
 * Shows all players above user + 2-3 players below to encourage competition
 * @param {string} userId - User's ID
 * @param {number} userScore - User's score
 * @returns {Promise<Array>} Leaderboard with user context
 */
export async function getSmartLeaderboard(userId, userScore) {
  if (!isFirebaseEnabled) {
    return getMockLeaderboard();
  }
  
  try {
    const leaderboardRef = ref(database, 'leaderboard');
    const snapshot = await get(leaderboardRef);
    
    if (!snapshot.exists()) {
      return [];
    }
    
    const allScores = [];
    snapshot.forEach((childSnapshot) => {
      allScores.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    
    // Sort by score descending
    allScores.sort((a, b) => b.score - a.score);
    
    // Find user's position
    const userIndex = allScores.findIndex(s => s.userId === userId);
    
    if (userIndex === -1) {
      // User not found, return top 10
      return allScores.slice(0, 10);
    }
    
    // Show all players above user + 2-3 players below
    const playersBelow = Math.min(3, allScores.length - userIndex - 1);
    const startIndex = 0;
    const endIndex = userIndex + playersBelow + 1;
    
    return allScores.slice(startIndex, endIndex);
  } catch (error) {
    console.error('Error fetching smart leaderboard:', error);
    return getMockLeaderboard();
  }
}

/**
 * Mock leaderboard data for when Firebase is not configured
 */
function getMockLeaderboard() {
  return [
    { playerName: 'CyberNinja', score: 285, role: 'hacker', won: true, timestamp: Date.now() - 3600000 },
    { playerName: 'DefenderPro', score: 270, role: 'defender', won: true, timestamp: Date.now() - 7200000 },
    { playerName: 'H4ck3rM4n', score: 255, role: 'hacker', won: true, timestamp: Date.now() - 10800000 },
    { playerName: 'SecurityQueen', score: 240, role: 'defender', won: true, timestamp: Date.now() - 14400000 },
    { playerName: 'ByteBandit', score: 225, role: 'hacker', won: false, timestamp: Date.now() - 18000000 },
    { playerName: 'FirewallKing', score: 210, role: 'defender', won: true, timestamp: Date.now() - 21600000 },
    { playerName: 'PhishMaster', score: 195, role: 'hacker', won: true, timestamp: Date.now() - 25200000 },
    { playerName: 'PatchHero', score: 180, role: 'defender', won: false, timestamp: Date.now() - 28800000 },
    { playerName: 'ZeroDayZ', score: 165, role: 'hacker', won: true, timestamp: Date.now() - 32400000 },
    { playerName: 'ShieldMaiden', score: 150, role: 'defender', won: true, timestamp: Date.now() - 36000000 }
  ];
}
