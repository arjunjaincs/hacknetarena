import React, { useState, useEffect } from 'react';
import { getUserGameHistory, getUserStats } from '../firebase/gameHistory';

export default function Profile({ userId, playerName, onBack }) {
  const [games, setGames] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [gamesData, statsData] = await Promise.all([
        getUserGameHistory(userId, 20),
        getUserStats(userId)
      ]);
      setGames(gamesData);
      setStats(statsData);
      setLoading(false);
    }
    if (userId) {
      loadData();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <div className="text-white text-xl">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-bg to-dark-card p-3 md:p-6">
      {/* Spacer for navbar */}
      <div className="h-20"></div>
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-cyber-blue cyber-glow">
            👤 {playerName}'s Profile
          </h1>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
            <StatCard label="Total Games" value={stats.totalGames} icon="🎮" />
            <StatCard label="Wins" value={stats.wins} icon="🏆" color="green" />
            <StatCard label="Losses" value={stats.losses} icon="💔" color="red" />
            <StatCard label="Win Rate" value={`${stats.winRate}%`} icon="📊" />
            <StatCard label="Best Score" value={stats.bestScore} icon="⭐" />
            <StatCard label="Avg Score" value={stats.averageScore} icon="📈" />
            <StatCard label="Total Rounds" value={stats.totalRounds} icon="🔄" />
            <StatCard label="Draws" value={stats.draws} icon="🤝" color="yellow" />
          </div>
        )}

        {/* Game History */}
        <div className="bg-dark-card border-2 border-cyber-blue rounded-lg p-4 md:p-6">
          <h2 className="text-2xl font-bold text-cyber-blue mb-4">
            📜 Recent Games
          </h2>
          {games.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <div className="text-4xl mb-2">🎮</div>
              <div>No games played yet. Start playing to see your history!</div>
            </div>
          ) : (
            <div className="space-y-3">
              {games.map((game, index) => (
                <GameHistoryCard key={game.id} game={game} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color = 'blue' }) {
  const colors = {
    blue: 'border-cyber-blue text-cyber-blue',
    green: 'border-green-500 text-green-400',
    red: 'border-red-500 text-red-400',
    yellow: 'border-yellow-500 text-yellow-400'
  };

  return (
    <div className={`bg-dark-card border-2 ${colors[color]} rounded-lg p-3 md:p-4 text-center hover:scale-105 transition-transform`}>
      <div className="text-3xl md:text-4xl mb-2">{icon}</div>
      <div className="text-xl md:text-2xl font-bold">{value}</div>
      <div className="text-xs md:text-sm text-gray-400">{label}</div>
    </div>
  );
}

function GameHistoryCard({ game, index }) {
  const wonColor = game.winner === 'draw' ? 'border-yellow-500' : (game.won ? 'border-green-500' : 'border-red-500');
  const wonBg = game.winner === 'draw' ? 'bg-yellow-900 bg-opacity-20' : (game.won ? 'bg-green-900 bg-opacity-20' : 'bg-red-900 bg-opacity-20');
  const icon = game.winner === 'draw' ? '🤝' : (game.won ? '🏆' : '💔');

  return (
    <div className={`${wonBg} border ${wonColor} rounded-lg p-3 md:p-4 hover:scale-102 transition-transform`}>
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{icon}</span>
            <span className="font-bold text-white text-sm md:text-base">
              Game #{index + 1} - {game.role === 'hacker' ? '🎯 Hacker' : '🛡️ Defender'}
            </span>
          </div>
          <div className="text-xs md:text-sm text-gray-400 mt-1">
            {new Date(game.timestamp).toLocaleString()}
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl md:text-3xl font-bold text-cyber-blue">{game.score}</div>
          <div className="text-xs text-gray-400">{game.rounds} rounds</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
        <div className="bg-dark-bg rounded p-2 text-center">
          <div className="text-gray-400">Threat</div>
          <div className="text-white font-bold">{Math.round(game.threatLevel)}</div>
        </div>
        <div className="bg-dark-bg rounded p-2 text-center">
          <div className="text-gray-400">Network</div>
          <div className="text-white font-bold">{Math.round(game.networkIntegrity)}%</div>
        </div>
        <div className="bg-dark-bg rounded p-2 text-center">
          <div className="text-gray-400">Combos</div>
          <div className="text-white font-bold">{game.combosEarned || 0}</div>
        </div>
      </div>
    </div>
  );
}
