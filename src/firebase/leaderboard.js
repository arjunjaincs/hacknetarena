/**
 * Leaderboard Management
 * Handles reading and writing high scores to Firebase
 */

import { database, isFirebaseEnabled } from './config';
import { ref, push, set, get, query, orderByChild, limitToLast } from 'firebase/database';

/**
 * Submit a score to the leaderboard (updates user's stats)
 * @param {string} playerName - Player's name
 * @param {number} score - Final score
 * @param {string} role - 'hacker' or 'defender'
 * @param {boolean} won - Whether player won
 * @param {string} userId - User ID from Firebase Auth
 * @returns {Promise<boolean>} Success status
 */
export async function submitScore(playerName, score, role, won, userId = null) {
  if (!isFirebaseEnabled || !userId) {
    console.warn('Firebase not enabled or no userId - score not saved');
    return false;
  }
  
  try {
    const userStatsRef = ref(database, `leaderboard/${userId}`);
    const snapshot = await get(userStatsRef);
    
    let userData;
    if (snapshot.exists()) {
      // Update existing user
      const existing = snapshot.val();
      userData = {
        playerName: playerName.substring(0, 20),
        userId: userId,
        bestScore: Math.max(existing.bestScore || 0, score),
        totalScore: (existing.totalScore || 0) + score,
        gamesPlayed: (existing.gamesPlayed || 0) + 1,
        wins: (existing.wins || 0) + (won ? 1 : 0),
        lastGame: {
          score: score,
          role: role,
          won: won,
          timestamp: Date.now(),
          date: new Date().toISOString()
        },
        lastUpdated: Date.now()
      };
    } else {
      // New user
      userData = {
        playerName: playerName.substring(0, 20),
        userId: userId,
        bestScore: score,
        totalScore: score,
        gamesPlayed: 1,
        wins: won ? 1 : 0,
        lastGame: {
          score: score,
          role: role,
          won: won,
          timestamp: Date.now(),
          date: new Date().toISOString()
        },
        lastUpdated: Date.now()
      };
    }
    
    await set(userStatsRef, userData);
    console.log('Score submitted successfully');
    return true;
  } catch (error) {
    console.error('Error submitting score:', error);
    return false;
  }
}

/**
 * Get top players from leaderboard (unique players only)
 * @param {number} limit - Number of players to retrieve
 * @param {string} sortBy - 'bestScore' or 'totalScore'
 * @returns {Promise<Array>} Array of top players
 */
export async function getTopScores(limit = 10, sortBy = 'bestScore') {
  if (!isFirebaseEnabled) {
    console.warn('Firebase not enabled - returning mock data');
    return getMockLeaderboard();
  }
  
  try {
    const leaderboardRef = ref(database, 'leaderboard');
    const snapshot = await get(leaderboardRef);
    
    if (snapshot.exists()) {
      const players = [];
      snapshot.forEach((childSnapshot) => {
        players.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      
      // Sort by chosen metric descending
      players.sort((a, b) => b[sortBy] - a[sortBy]);
      
      // Return top N players
      return players.slice(0, limit);
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
    { playerName: 'CyberNinja', bestScore: 285, totalScore: 1420, gamesPlayed: 5, wins: 4, lastGame: { score: 285, role: 'hacker', won: true }, lastUpdated: Date.now() - 3600000 },
    { playerName: 'DefenderPro', bestScore: 270, totalScore: 1350, gamesPlayed: 5, wins: 5, lastGame: { score: 270, role: 'defender', won: true }, lastUpdated: Date.now() - 7200000 },
    { playerName: 'H4ck3rM4n', bestScore: 255, totalScore: 1020, gamesPlayed: 4, wins: 3, lastGame: { score: 255, role: 'hacker', won: true }, lastUpdated: Date.now() - 10800000 },
    { playerName: 'SecurityQueen', bestScore: 240, totalScore: 960, gamesPlayed: 4, wins: 4, lastGame: { score: 240, role: 'defender', won: true }, lastUpdated: Date.now() - 14400000 },
    { playerName: 'ByteBandit', bestScore: 225, totalScore: 675, gamesPlayed: 3, wins: 2, lastGame: { score: 225, role: 'hacker', won: false }, lastUpdated: Date.now() - 18000000 },
    { playerName: 'FirewallKing', bestScore: 210, totalScore: 840, gamesPlayed: 4, wins: 3, lastGame: { score: 210, role: 'defender', won: true }, lastUpdated: Date.now() - 21600000 },
    { playerName: 'PhishMaster', bestScore: 195, totalScore: 585, gamesPlayed: 3, wins: 2, lastGame: { score: 195, role: 'hacker', won: true }, lastUpdated: Date.now() - 25200000 },
    { playerName: 'PatchHero', bestScore: 180, totalScore: 540, gamesPlayed: 3, wins: 1, lastGame: { score: 180, role: 'defender', won: false }, lastUpdated: Date.now() - 28800000 },
    { playerName: 'ZeroDayZ', bestScore: 165, totalScore: 330, gamesPlayed: 2, wins: 2, lastGame: { score: 165, role: 'hacker', won: true }, lastUpdated: Date.now() - 32400000 },
    { playerName: 'ShieldMaiden', bestScore: 150, totalScore: 450, gamesPlayed: 3, wins: 2, lastGame: { score: 150, role: 'defender', won: true }, lastUpdated: Date.now() - 36000000 }
  ];
}
