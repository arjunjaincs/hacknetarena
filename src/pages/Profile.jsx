import React, { useState, useEffect } from 'react';
import { getUserGameHistory, getUserStats } from '../firebase/gameHistory';
import { getUserLeaderboardStats } from '../firebase/leaderboard';
import { getAchievements, getAchievementStats } from '../firebase/achievements';
import { getAllAchievementsWithStatus, getCompletionPercentage, ACHIEVEMENT_CATEGORIES, RARITY_CONFIG } from '../game/achievements';

export default function Profile({ userId, playerName, onBack }) {
  const [games, setGames] = useState([]);
  const [stats, setStats] = useState(null);
  const [leaderboardStats, setLeaderboardStats] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [achievementStats, setAchievementStats] = useState({});
  const [unlockedIds, setUnlockedIds] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [gamesData, statsData, lbStats, unlockedAchievements, achStats] = await Promise.all([
        getUserGameHistory(userId, 20),
        getUserStats(userId),
        getUserLeaderboardStats(userId),
        getAchievements(userId),
        getAchievementStats(userId)
      ]);
      setGames(gamesData);
      setStats(statsData);
      setLeaderboardStats(lbStats);
      setUnlockedIds(unlockedAchievements || []);
      setAchievementStats(achStats || {});
      setAchievements(getAllAchievementsWithStatus(unlockedAchievements || [], achStats || {}));
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
            <StatCard label="Best Score" value={leaderboardStats?.bestScore || stats.bestScore} icon="⭐" color="cyan" />
            <StatCard label="Total Score" value={leaderboardStats?.totalScore || 0} icon="💎" color="purple" />
            <StatCard label="Avg Score" value={stats.averageScore} icon="📈" />
            <StatCard label="Total Rounds" value={stats.totalRounds} icon="🔄" />
          </div>
        )}

        {/* Achievements Section */}
        <div className="bg-dark-card border-2 border-cyber-purple rounded-lg p-4 md:p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-cyber-purple">
              🏆 Achievements
            </h2>
            <div className="text-right">
              <div className="text-3xl font-bold text-cyber-purple">
                {getCompletionPercentage(unlockedIds)}%
              </div>
              <div className="text-xs text-gray-400">
                {unlockedIds.length} / {achievements.length} Unlocked
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-cyber-purple text-white'
                  : 'bg-dark-bg text-gray-400 hover:text-white'
              }`}
            >
              All
            </button>
            {Object.entries(ACHIEVEMENT_CATEGORIES).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                  selectedCategory === key
                    ? 'bg-cyber-purple text-white'
                    : 'bg-dark-bg text-gray-400 hover:text-white'
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>

          {/* Achievement Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements
              .filter(a => selectedCategory === 'all' || a.category === selectedCategory)
              .map(achievement => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
          </div>
        </div>

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
    yellow: 'border-yellow-500 text-yellow-400',
    cyan: 'border-cyan-500 text-cyan-400',
    purple: 'border-purple-500 text-purple-400'
  };

  return (
    <div className={`bg-dark-card border-2 ${colors[color]} rounded-lg p-3 md:p-4 text-center hover:scale-105 transition-transform`}>
      <div className="text-3xl md:text-4xl mb-2">{icon}</div>
      <div className="text-xl md:text-2xl font-bold">{value}</div>
      <div className="text-xs md:text-sm text-gray-400">{label}</div>
    </div>
  );
}

function AchievementCard({ achievement }) {
  const rarity = RARITY_CONFIG[achievement.rarity] || RARITY_CONFIG.common;
  const isUnlocked = achievement.unlocked;
  
  return (
    <div
      className={`relative bg-dark-bg rounded-lg p-4 border-2 transition-all duration-300 ${
        isUnlocked
          ? 'hover:scale-105 cursor-pointer'
          : 'opacity-50 grayscale'
      }`}
      style={{
        borderColor: isUnlocked ? rarity.color : '#4B5563',
        boxShadow: isUnlocked ? `0 0 20px ${rarity.glow}` : 'none'
      }}
    >
      {/* Locked overlay */}
      {!isUnlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
          <div className="text-4xl">🔒</div>
        </div>
      )}
      
      {/* Icon */}
      <div className="text-center mb-3">
        <div
          className="text-5xl inline-block"
          style={{
            filter: isUnlocked ? `drop-shadow(0 0 10px ${rarity.color})` : 'none'
          }}
        >
          {achievement.icon}
        </div>
      </div>
      
      {/* Name */}
      <h3 className="text-lg font-bold text-white text-center mb-2">
        {achievement.name}
      </h3>
      
      {/* Description */}
      <p className="text-sm text-gray-300 text-center mb-3 min-h-[40px]">
        {achievement.description}
      </p>
      
      {/* Progress bar (if has progress) */}
      {achievement.progress && achievement.progress.max > 1 && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Progress</span>
            <span>{achievement.progress.current} / {achievement.progress.max}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${achievement.progress.percentage}%`,
                backgroundColor: rarity.color
              }}
            />
          </div>
        </div>
      )}
      
      {/* Rarity badge */}
      <div className="flex justify-center">
        <span
          className="text-xs font-bold px-3 py-1 rounded-full"
          style={{
            backgroundColor: `${rarity.color}20`,
            color: rarity.color,
            border: `1px solid ${rarity.color}`
          }}
        >
          {rarity.name}
        </span>
      </div>
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
