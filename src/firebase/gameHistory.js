/**
 * Game History Management
 * Tracks user's past games for profile viewing
 */

import { database } from './config';
import { ref, push, set, get, query, orderByChild, equalTo, limitToLast } from 'firebase/database';

/**
 * Save a completed game to user's history
 */
export async function saveGameHistory(userId, gameData) {
  if (!database || !userId) {
    console.warn('Cannot save game history: No database or userId');
    return false;
  }

  try {
    const historyRef = ref(database, `gameHistory/${userId}`);
    const newGameRef = push(historyRef);
    
    await set(newGameRef, {
      ...gameData,
      timestamp: Date.now(),
      date: new Date().toISOString()
    });
    
    console.log('Game history saved successfully');
    return true;
  } catch (error) {
    console.error('Error saving game history:', error);
    return false;
  }
}

/**
 * Get user's game history
 */
export async function getUserGameHistory(userId, limit = 20) {
  if (!database || !userId) {
    console.warn('Cannot fetch game history: No database or userId');
    return [];
  }

  try {
    const historyRef = ref(database, `gameHistory/${userId}`);
    const historyQuery = query(historyRef, limitToLast(limit));
    const snapshot = await get(historyQuery);
    
    if (!snapshot.exists()) {
      return [];
    }

    const games = [];
    const seenIds = new Set();
    
    snapshot.forEach((childSnapshot) => {
      const gameId = childSnapshot.key;
      // Prevent duplicates
      if (!seenIds.has(gameId)) {
        seenIds.add(gameId);
        games.push({
          id: gameId,
          ...childSnapshot.val()
        });
      }
    });

    // Sort by timestamp (newest first) and remove any remaining duplicates by timestamp
    const uniqueGames = games.reduce((acc, game) => {
      const exists = acc.find(g => Math.abs(g.timestamp - game.timestamp) < 1000);
      if (!exists) {
        acc.push(game);
      }
      return acc;
    }, []);
    
    return uniqueGames.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Error fetching game history:', error);
    return [];
  }
}

/**
 * Get user stats summary
 */
export async function getUserStats(userId) {
  if (!database || !userId) {
    return {
      totalGames: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      winRate: 0,
      averageScore: 0,
      bestScore: 0,
      totalRounds: 0
    };
  }

  try {
    const games = await getUserGameHistory(userId, 100); // Get last 100 games
    
    if (games.length === 0) {
      return {
        totalGames: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        winRate: 0,
        averageScore: 0,
        bestScore: 0,
        totalRounds: 0
      };
    }

    const wins = games.filter(g => g.won).length;
    const draws = games.filter(g => g.winner === 'draw').length;
    const losses = games.length - wins - draws;
    const totalScore = games.reduce((sum, g) => sum + (g.score || 0), 0);
    const bestScore = Math.max(...games.map(g => g.score || 0));
    const totalRounds = games.reduce((sum, g) => sum + (g.rounds || 0), 0);

    return {
      totalGames: games.length,
      wins,
      losses,
      draws,
      winRate: games.length > 0 ? ((wins / games.length) * 100).toFixed(1) : 0,
      averageScore: games.length > 0 ? Math.round(totalScore / games.length) : 0,
      bestScore,
      totalRounds
    };
  } catch (error) {
    console.error('Error calculating user stats:', error);
    return {
      totalGames: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      winRate: 0,
      averageScore: 0,
      bestScore: 0,
      totalRounds: 0
    };
  }
}
