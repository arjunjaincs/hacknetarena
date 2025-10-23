/**
 * Leaderboard Page
 * Displays top scores from Firebase
 */

import React, { useEffect, useState } from 'react';
import { getTopScores } from '../firebase/leaderboard';
import { isFirebaseEnabled } from '../firebase/config';

export default function Leaderboard({ onBack, currentUserId }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, hacker, defender
  const [timeFilter, setTimeFilter] = useState('allTime'); // allTime, today, week, month
  
  useEffect(() => {
    loadScores();
  }, []);
  
  const loadScores = async () => {
    setLoading(true);
    const topScores = await getTopScores(50); // Get more scores for filtering
    setScores(topScores);
    setLoading(false);
  };
  
  // Filter scores based on role and time
  const filteredScores = scores
    .filter(s => filter === 'all' || s.role === filter)
    .filter(s => {
      if (timeFilter === 'allTime') return true;
      const scoreDate = new Date(s.timestamp);
      const now = new Date();
      if (timeFilter === 'today') {
        return scoreDate.toDateString() === now.toDateString();
      }
      if (timeFilter === 'week') {
        const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
        return scoreDate >= weekAgo;
      }
      if (timeFilter === 'month') {
        const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
        return scoreDate >= monthAgo;
      }
      return true;
    })
    .slice(0, 20); // Show top 20
  
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
        
        {/* Filters */}
        <div className="mb-6 space-y-4">
          {/* Role Filter */}
          <div className="flex flex-wrap gap-2 justify-center">
            <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>
              All Roles
            </FilterButton>
            <FilterButton active={filter === 'hacker'} onClick={() => setFilter('hacker')}>
              🎯 Hackers Only
            </FilterButton>
            <FilterButton active={filter === 'defender'} onClick={() => setFilter('defender')}>
              🛡️ Defenders Only
            </FilterButton>
          </div>
          
          {/* Time Filter */}
          <div className="flex flex-wrap gap-2 justify-center">
            <FilterButton active={timeFilter === 'allTime'} onClick={() => setTimeFilter('allTime')}>
              All Time
            </FilterButton>
            <FilterButton active={timeFilter === 'today'} onClick={() => setTimeFilter('today')}>
              Today
            </FilterButton>
            <FilterButton active={timeFilter === 'week'} onClick={() => setTimeFilter('week')}>
              This Week
            </FilterButton>
            <FilterButton active={timeFilter === 'month'} onClick={() => setTimeFilter('month')}>
              This Month
            </FilterButton>
          </div>
          
          {/* Results Count */}
          <div className="text-center text-sm text-gray-400">
            Showing {filteredScores.length} {filter !== 'all' ? filter : 'player'}{filteredScores.length !== 1 ? 's' : ''}
            {timeFilter !== 'allTime' && ` from ${timeFilter}`}
          </div>
        </div>
        
        {/* Leaderboard Table */}
        <div className="bg-dark-card border border-gray-600 rounded-lg overflow-hidden mb-6">
          {loading ? (
            <div className="p-12 text-center text-gray-400">
              <div className="text-4xl mb-4">⏳</div>
              <div>Loading scores...</div>
            </div>
          ) : scores.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <div className="text-4xl mb-4">📊</div>
              <div>No scores yet. Be the first to play!</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-bg border-b border-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-cyber-blue">Rank</th>
                    <th className="px-4 py-3 text-left text-cyber-blue">Player</th>
                    <th className="px-4 py-3 text-left text-cyber-blue">Role</th>
                    <th className="px-4 py-3 text-left text-cyber-blue">Result</th>
                    <th className="px-4 py-3 text-right text-cyber-blue">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredScores.map((score, index) => (
                    <tr 
                      key={score.id || index}
                      className={`border-b border-gray-700 hover:bg-dark-bg transition-colors ${
                        score.userId === currentUserId ? 'ring-2 ring-cyan-400' : ''
                      } ${
                        index < 3 ? 'bg-opacity-20' : ''
                      } ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' : 
                        index === 2 ? 'bg-orange-600' : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {index === 0 && <span className="text-2xl">🥇</span>}
                          {index === 1 && <span className="text-2xl">🥈</span>}
                          {index === 2 && <span className="text-2xl">🥉</span>}
                          <span className="font-bold text-white">#{index + 1}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-white font-bold">
                        {score.playerName}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-sm ${
                          score.role === 'hacker' 
                            ? 'bg-cyber-red bg-opacity-20 text-cyber-red' 
                            : 'bg-cyber-green bg-opacity-20 text-cyber-green'
                        }`}>
                          {score.role === 'hacker' ? '🎯 Hacker' : '🛡️ Defender'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-sm ${
                          score.won 
                            ? 'bg-green-900 bg-opacity-30 text-green-400' 
                            : 'bg-red-900 bg-opacity-30 text-red-400'
                        }`}>
                          {score.won ? '✓ Won' : '✗ Lost'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-2xl font-bold text-cyber-blue">
                          {score.score}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Stats */}
        {filteredScores.length > 0 && (
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-dark-card border border-gray-600 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-400 mb-1">Top Score</div>
              <div className="text-3xl font-bold text-cyber-blue">
                {filteredScores[0]?.score || 0}
              </div>
            </div>
            <div className="bg-dark-card border border-gray-600 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-400 mb-1">Total Players</div>
              <div className="text-3xl font-bold text-cyber-purple">
                {filteredScores.length}
              </div>
            </div>
            <div className="bg-dark-card border border-gray-600 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-400 mb-1">Avg Score</div>
              <div className="text-3xl font-bold text-cyber-green">
                {Math.round(filteredScores.reduce((sum, s) => sum + s.score, 0) / filteredScores.length)}
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
