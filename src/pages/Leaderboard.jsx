/**
 * Leaderboard Page - Redesigned
 * Shows unique players with their best score, total score, and recent game
 */

import React, { useEffect, useState } from 'react';
import { getTopScores } from '../firebase/leaderboard';
import { isFirebaseEnabled } from '../firebase/config';

export default function Leaderboard({ onBack, currentUserId }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('bestScore'); // bestScore or totalScore
  
  useEffect(() => {
    loadScores();
  }, [sortBy]);
  
  const loadScores = async () => {
    setLoading(true);
    const topPlayers = await getTopScores(20, sortBy);
    setPlayers(topPlayers);
    setLoading(false);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-bg to-dark-card p-4 pt-40">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 cyber-glow text-cyber-blue">
            🏆 Leaderboard
          </h1>
          <p className="text-gray-400">
            Top HackNet Arena Champions
          </p>
          {!isFirebaseEnabled && (
            <div className="mt-4 p-3 bg-yellow-900 bg-opacity-30 border border-yellow-600 rounded text-yellow-300 text-sm">
              ⚠️ Firebase not configured - showing demo data
            </div>
          )}
        </div>
        
        {/* Sort Toggle */}
        <div className="mb-6 flex justify-center gap-2">
          <FilterButton active={sortBy === 'bestScore'} onClick={() => setSortBy('bestScore')}>
            🏆 Best Score
          </FilterButton>
          <FilterButton active={sortBy === 'totalScore'} onClick={() => setSortBy('totalScore')}>
            📊 Total Score
          </FilterButton>
        </div>
        
        {/* Leaderboard Table */}
        <div className="bg-dark-card border border-gray-600 rounded-lg overflow-hidden mb-6">
          {loading ? (
            <div className="p-12 text-center text-gray-400">
              <div className="text-4xl mb-4">⏳</div>
              <div>Loading scores...</div>
            </div>
          ) : players.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <div className="text-4xl mb-4">📊</div>
              <div>No players yet. Be the first to play!</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-dark-bg border-b border-gray-600">
                  <tr>
                    <th className="px-3 py-3 text-left text-cyber-blue font-bold">Rank</th>
                    <th className="px-3 py-3 text-left text-cyber-blue font-bold">Player</th>
                    <th className="px-3 py-3 text-left text-cyber-blue font-bold">Recent Game</th>
                    <th className="px-3 py-3 text-right text-cyber-blue font-bold">Best</th>
                    <th className="px-3 py-3 text-right text-cyber-blue font-bold">Total</th>
                    <th className="px-3 py-3 text-center text-cyber-blue font-bold">W/L</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player, index) => (
                    <tr 
                      key={player.id || index}
                      className={`border-b border-gray-700 hover:bg-dark-bg transition-colors ${
                        player.userId === currentUserId ? 'bg-cyan-900 bg-opacity-20 ring-2 ring-cyan-400' : ''
                      } ${
                        index < 3 ? 'bg-opacity-10' : ''
                      } ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' : 
                        index === 2 ? 'bg-orange-600' : ''
                      }`}
                    >
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          {index === 0 && <span className="text-xl">🥇</span>}
                          {index === 1 && <span className="text-xl">🥈</span>}
                          {index === 2 && <span className="text-xl">🥉</span>}
                          <span className="font-bold text-white text-base">#{index + 1}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="text-white font-bold text-base">{player.playerName}</div>
                        <div className="text-xs text-gray-400">{player.gamesPlayed} games</div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            player.lastGame?.role === 'hacker' 
                              ? 'bg-cyber-red bg-opacity-20 text-cyber-red' 
                              : 'bg-cyber-green bg-opacity-20 text-cyber-green'
                          }`}>
                            {player.lastGame?.role === 'hacker' ? '🎯' : '🛡️'}
                          </span>
                          <span className={`text-xs ${
                            player.lastGame?.won ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {player.lastGame?.score}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <span className="text-xl font-bold text-cyber-blue">
                          {player.bestScore}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <span className="text-lg font-bold text-cyber-purple">
                          {player.totalScore}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <div className="text-sm font-medium text-white">
                          {player.wins}/{player.gamesPlayed - player.wins}
                        </div>
                        <div className="text-xs text-gray-400">
                          {Math.round((player.wins / player.gamesPlayed) * 100)}%
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Stats */}
        {players.length > 0 && (
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-dark-card border border-gray-600 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-400 mb-1 font-medium">Top {sortBy === 'bestScore' ? 'Best' : 'Total'} Score</div>
              <div className="text-3xl font-bold text-cyber-blue">
                {players[0]?.[sortBy] || 0}
              </div>
            </div>
            <div className="bg-dark-card border border-gray-600 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-400 mb-1 font-medium">Total Players</div>
              <div className="text-3xl font-bold text-cyber-purple">
                {players.length}
              </div>
            </div>
            <div className="bg-dark-card border border-gray-600 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-400 mb-1 font-medium">Avg {sortBy === 'bestScore' ? 'Best' : 'Total'}</div>
              <div className="text-3xl font-bold text-cyber-green">
                {Math.round(players.reduce((sum, p) => sum + p[sortBy], 0) / players.length)}
              </div>
            </div>
          </div>
        )}
        
        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={onBack}
            className="px-8 py-4 bg-dark-card border-2 border-cyber-blue text-cyber-blue font-bold text-lg rounded-lg hover:bg-cyber-blue hover:text-dark-bg transition-all duration-300 transform hover:scale-105 btn-cyber"
          >
            ← Back to Home
          </button>
        </div>
        
        {/* Refresh Button */}
        {isFirebaseEnabled && (
          <div className="text-center mt-4">
            <button
              onClick={loadScores}
              className="px-4 py-2 text-cyber-blue hover:text-cyber-purple transition-colors"
            >
              🔄 Refresh Scores
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-bold transition-all transform hover:scale-105 ${
        active
          ? 'bg-cyber-blue text-dark-bg shadow-lg'
          : 'bg-dark-card text-gray-400 hover:text-white border border-gray-600'
      }`}
    >
      {children}
    </button>
  );
}
