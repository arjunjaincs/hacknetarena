import React, { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { submitScore } from '../firebase/leaderboard';
import { saveGameHistory } from '../firebase/gameHistory';
import { getUserLeaderboardStats } from '../firebase/leaderboard';
import { playGameOverSound } from '../game/soundEffects';
import { getAchievements } from '../firebase/achievements';
import { ACHIEVEMENTS, RARITY_CONFIG } from '../game/achievements';
import { calculateOverallGrade, getGradeColor, getImprovementSuggestions, getActionAnalytics, compareWithBest, generateShareText } from '../game/gameAnalytics';

export default function ResultsNew({ gameState, onPlayAgain, onViewLeaderboard, newAchievements = [] }) {
  const [finalScore, setFinalScore] = useState(0);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [displayAchievements, setDisplayAchievements] = useState([]);
  const [grades, setGrades] = useState(null);
  const [bestStats, setBestStats] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [showDetailedStats, setShowDetailedStats] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const isDraw = gameState.winner === 'draw';
  const playerWon = !isDraw && gameState.winner === gameState.playerRole;
  
  useEffect(() => {
    playGameOverSound(playerWon);
    
    const score = Math.round(gameState.playerScore);
    setFinalScore(score);
    
    // Calculate grades
    const calculatedGrades = calculateOverallGrade(gameState);
    setGrades(calculatedGrades);
    
    // Get achievement details from IDs
    if (newAchievements && newAchievements.length > 0) {
      const achDetails = newAchievements.map(id => 
        Object.values(ACHIEVEMENTS).find(a => a.id === id)
      ).filter(Boolean);
      setDisplayAchievements(achDetails);
    }
    
    const saveScore = async () => {
      setSaving(true);
      
      // Get best stats for comparison
      if (gameState.userId) {
        const userStats = await getUserLeaderboardStats(gameState.userId);
        setBestStats(userStats);
        
        // Compare with best
        if (userStats) {
          const comp = compareWithBest(gameState, userStats);
          setComparison(comp);
        }
      }
      
      // Save to leaderboard
      const success = await submitScore(
        gameState.playerName || 'Anonymous',
        score,
        gameState.playerRole,
        playerWon,
        gameState.userId
      );
      
      // Save to game history
      if (gameState.userId) {
        await saveGameHistory(gameState.userId, {
          playerName: gameState.playerName,
          score,
          role: gameState.playerRole,
          won: playerWon,
          winner: gameState.winner,
          rounds: gameState.round - 1,
          threatLevel: gameState.threatLevel,
          networkIntegrity: gameState.networkIntegrity,
          dataStolen: gameState.dataStolen,
          combosEarned: gameState.combosEarned
        });
      }
      
      setScoreSaved(success);
      setSaving(false);
    };
    
    saveScore();
  }, [gameState, playerWon, newAchievements]);
  
  const handleShare = () => {
    if (grades) {
      const shareText = generateShareText(gameState, grades);
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  // Prepare chart data
  const roundData = gameState.roundHistory || [];
  const actionAnalytics = getActionAnalytics(gameState, gameState.gameActions);
  const suggestions = grades ? getImprovementSuggestions(grades, gameState) : [];
  
  // Success rate data
  const successRate = gameState.successfulActions / Math.max(1, gameState.successfulActions + gameState.failedActions) * 100;
  const successData = [
    { name: 'Success', value: gameState.successfulActions || 0, color: '#10b981' },
    { name: 'Failed', value: gameState.failedActions || 0, color: '#ef4444' }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-bg to-dark-card p-4">
      {/* Spacer for navbar */}
      <div className="h-20"></div>
      
      <div className="max-w-7xl mx-auto">
        {/* Result Header */}
        <div className="text-center mb-6">
          <div className="text-6xl md:text-8xl mb-4 animate-bounce">
            {isDraw ? '🤝' : (playerWon ? '🏆' : '💔')}
          </div>
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
            isDraw ? 'text-yellow-400' : (playerWon ? 'text-cyber-green' : 'text-cyber-red')
          }`}>
            {isDraw ? 'Draw!' : (playerWon ? 'Victory!' : 'Defeated!')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300">
            {isDraw ? 'Resources Exhausted' : 
             (gameState.winner === 'hacker' ? 'Network Breached' : 'Network Defended')}
          </p>
        </div>
        
        {/* Score & Grade Display */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Score Card */}
          <div className="bg-dark-card border-2 border-cyber-blue rounded-lg p-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="text-gray-400">Final Score</div>
                {gameState.difficultyMultiplier && gameState.difficultyMultiplier !== 1.0 && (
                  <span className="text-xs px-2 py-1 rounded bg-yellow-900/30 text-yellow-400 border border-yellow-500">
                    ×{gameState.difficultyMultiplier}
                  </span>
                )}
              </div>
              <div className="text-5xl md:text-6xl font-bold text-cyber-blue cyber-glow mb-4">
                <AnimatedNumber value={finalScore} />
              </div>
              {gameState.difficulty && (
                <div className={`inline-block text-xs px-3 py-1 rounded font-bold mb-4 ${
                  gameState.difficulty === 'easy' ? 'bg-green-900/30 text-green-400 border border-green-500' :
                  gameState.difficulty === 'hard' ? 'bg-red-900/30 text-red-400 border border-red-500' :
                  'bg-blue-900/30 text-blue-400 border border-blue-500'
                }`}>
                  {gameState.difficulty === 'easy' ? 'BEGINNER' : gameState.difficulty === 'hard' ? 'EXPERT' : 'NORMAL'}
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-dark-bg rounded p-3">
                  <div className="text-gray-400">Threat</div>
                  <div className="text-xl font-bold text-red-400">{Math.round(gameState.threatLevel)}</div>
                </div>
                <div className="bg-dark-bg rounded p-3">
                  <div className="text-gray-400">Network</div>
                  <div className="text-xl font-bold text-green-400">{Math.round(gameState.networkIntegrity)}%</div>
                </div>
                <div className="bg-dark-bg rounded p-3">
                  <div className="text-gray-400">Rounds</div>
                  <div className="text-xl font-bold text-cyan-400">{gameState.round - 1}</div>
                </div>
                <div className="bg-dark-bg rounded p-3">
                  <div className="text-gray-400">Combos</div>
                  <div className="text-xl font-bold text-purple-400">{gameState.combosEarned}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Grade Card */}
          {grades && (
            <div className="bg-dark-card border-2 border-cyber-purple rounded-lg p-6">
              <div className="text-center mb-4">
                <div className="text-gray-400 mb-2">Performance Grade</div>
                <div className={`text-7xl font-bold ${getGradeColor(grades.overall).text} mb-2`}>
                  {grades.overall}
                </div>
                <div className="text-2xl text-gray-300">{grades.overallScore}/100</div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <GradeItem label="⚔️ Offense" grade={grades.categories.offense.grade} score={grades.categories.offense.score} />
                <GradeItem label="🛡️ Defense" grade={grades.categories.defense.grade} score={grades.categories.defense.score} />
                <GradeItem label="🧠 Strategy" grade={grades.categories.strategy.grade} score={grades.categories.strategy.score} />
                <GradeItem label="⚡ Efficiency" grade={grades.categories.efficiency.grade} score={grades.categories.efficiency.score} />
              </div>
            </div>
          )}
        </div>
        
        {/* Comparison with Best */}
        {comparison && (
          <div className="bg-dark-card border-2 border-yellow-500 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4 text-center">
              📊 Personal Best Comparison
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ComparisonItem 
                label="Score" 
                current={comparison.score.current} 
                best={comparison.score.best} 
                improved={comparison.score.improved}
                higherIsBetter={true}
              />
              <ComparisonItem 
                label="Rounds" 
                current={comparison.rounds.current} 
                best={comparison.rounds.best} 
                improved={comparison.rounds.improved}
                higherIsBetter={false}
              />
              <ComparisonItem 
                label="Combos" 
                current={comparison.combos.current} 
                best={comparison.combos.best} 
                improved={comparison.combos.improved}
                higherIsBetter={true}
              />
              <ComparisonItem 
                label="Success Rate" 
                current={`${comparison.successRate.current}%`} 
                best={`${comparison.successRate.best}%`} 
                improved={comparison.successRate.improved}
                higherIsBetter={true}
              />
            </div>
          </div>
        )}
        
        {/* Achievements Unlocked */}
        {displayAchievements.length > 0 && (
          <div className="bg-dark-card border-2 border-cyber-purple rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-cyber-purple text-center mb-4">
              🎉 Achievements Unlocked!
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayAchievements.map(achievement => (
                <AchievementUnlockedCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </div>
        )}
        
        {/* Toggle Detailed Stats */}
        <div className="text-center mb-6">
          <button
            onClick={() => setShowDetailedStats(!showDetailedStats)}
            className="px-6 py-3 bg-cyber-blue text-dark-bg font-bold rounded-lg hover:bg-cyber-purple transition-all duration-300"
          >
            {showDetailedStats ? '📊 Hide' : '📊 Show'} Detailed Analytics
          </button>
        </div>
        
        {/* Detailed Stats (Collapsible) */}
        {showDetailedStats && (
          <div className="space-y-6 mb-6">
            {/* Round Timeline */}
            <div className="bg-dark-card border-2 border-cyan-500 rounded-lg p-6">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">📈 Round-by-Round Timeline</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={roundData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="round" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="threatLevel" stroke="#ef4444" name="Threat Level" strokeWidth={2} />
                  <Line type="monotone" dataKey="networkIntegrity" stroke="#10b981" name="Network" strokeWidth={2} />
                  <Line type="monotone" dataKey="energyHacker" stroke="#f59e0b" name="Hacker Energy" strokeWidth={2} />
                  <Line type="monotone" dataKey="energyDefender" stroke="#3b82f6" name="Defender Energy" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {/* Action Analytics */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Action Frequency */}
              <div className="bg-dark-card border-2 border-purple-500 rounded-lg p-6">
                <h3 className="text-xl font-bold text-purple-400 mb-4">🎯 Action Usage</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={actionAnalytics.slice(0, 6)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" angle={-45} textAnchor="end" height={100} />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="usage" fill="#a855f7" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              {/* Success Rate Pie */}
              <div className="bg-dark-card border-2 border-green-500 rounded-lg p-6">
                <h3 className="text-xl font-bold text-green-400 mb-4">✅ Success Rate</h3>
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-green-400">{Math.round(successRate)}%</div>
                  <div className="text-sm text-gray-400">
                    {gameState.successfulActions} / {gameState.successfulActions + gameState.failedActions} Actions
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={successData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {successData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Action Details Table */}
            <div className="bg-dark-card border-2 border-blue-500 rounded-lg p-6">
              <h3 className="text-xl font-bold text-blue-400 mb-4">📋 Action Performance Details</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left p-2 text-gray-400">Action</th>
                      <th className="text-center p-2 text-gray-400">Usage</th>
                      <th className="text-center p-2 text-gray-400">Success Rate</th>
                      <th className="text-center p-2 text-gray-400">Total Damage</th>
                      <th className="text-center p-2 text-gray-400">Efficiency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {actionAnalytics.map((action, index) => (
                      <tr key={action.id} className="border-b border-gray-800 hover:bg-gray-800">
                        <td className="p-2 text-white">{action.name}</td>
                        <td className="p-2 text-center text-purple-400 font-bold">{action.usage}</td>
                        <td className="p-2 text-center">
                          <span className={action.successRate >= 70 ? 'text-green-400' : action.successRate >= 50 ? 'text-yellow-400' : 'text-red-400'}>
                            {action.successRate}%
                          </span>
                        </td>
                        <td className="p-2 text-center text-red-400 font-bold">{action.damage}</td>
                        <td className="p-2 text-center text-cyan-400">{action.efficiency}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Efficiency Metrics */}
            <div className="bg-dark-card border-2 border-yellow-500 rounded-lg p-6">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">⚡ Efficiency Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard 
                  label="Damage/Energy" 
                  value={(gameState.totalDamageDealt / Math.max(1, gameState.energySpent)).toFixed(2)}
                  icon="💥"
                />
                <MetricCard 
                  label="Avg Damage/Round" 
                  value={(gameState.totalDamageDealt / Math.max(1, gameState.round - 1)).toFixed(1)}
                  icon="📊"
                />
                <MetricCard 
                  label="Energy Spent" 
                  value={gameState.energySpent || 0}
                  icon="🔋"
                />
                <MetricCard 
                  label="Combo Rate" 
                  value={`${((gameState.combosEarned / Math.max(1, gameState.round - 1)) * 100).toFixed(0)}%`}
                  icon="🔗"
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Improvement Suggestions */}
        {suggestions.length > 0 && (
          <div className="bg-dark-card border-2 border-orange-500 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-orange-400 mb-4 text-center">
              💡 Improvement Suggestions
            </h2>
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="bg-dark-bg rounded-lg p-4 flex items-start gap-3">
                  <div className="text-3xl">{suggestion.icon}</div>
                  <div>
                    <div className="font-bold text-white mb-1">{suggestion.category}</div>
                    <div className="text-gray-300 text-sm">{suggestion.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Save Status */}
        {saving && (
          <div className="text-center mb-4 text-yellow-400">💾 Saving score...</div>
        )}
        {scoreSaved && !saving && (
          <div className="text-center mb-4 text-green-400">✓ Score saved to leaderboard!</div>
        )}
        
        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button
            onClick={onPlayAgain}
            className="px-8 py-4 bg-cyber-blue text-dark-bg font-bold text-xl rounded-lg hover:bg-cyber-purple transition-all duration-300 transform hover:scale-105"
          >
            🔄 Play Again
          </button>
          <button
            onClick={onViewLeaderboard}
            className="px-8 py-4 bg-gray-700 text-white font-bold text-xl rounded-lg hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
          >
            🏆 View Leaderboard
          </button>
          <button
            onClick={handleShare}
            className="px-8 py-4 bg-green-600 text-white font-bold text-xl rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
          >
            {copied ? '✓ Copied!' : '📤 Share Results'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function AnimatedNumber({ value }) {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1000;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return <span>{displayValue}</span>;
}

function GradeItem({ label, grade, score }) {
  const colors = getGradeColor(grade);
  return (
    <div className="bg-dark-bg rounded p-2 text-center">
      <div className="text-xs text-gray-400 mb-1">{label}</div>
      <div className={`text-2xl font-bold ${colors.text}`}>{grade}</div>
      <div className="text-xs text-gray-500">{score}/100</div>
    </div>
  );
}

function ComparisonItem({ label, current, best, improved, higherIsBetter }) {
  const isImproved = higherIsBetter ? improved : !improved;
  return (
    <div className="bg-dark-bg rounded p-4 text-center">
      <div className="text-sm text-gray-400 mb-2">{label}</div>
      <div className="flex justify-center items-center gap-2 mb-1">
        <div className="text-xl font-bold text-white">{current}</div>
        {isImproved && <span className="text-green-400">↑</span>}
        {!isImproved && best > 0 && <span className="text-red-400">↓</span>}
      </div>
      <div className="text-xs text-gray-500">Best: {best}</div>
    </div>
  );
}

function MetricCard({ label, value, icon }) {
  return (
    <div className="bg-dark-bg rounded p-4 text-center">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  );
}

function AchievementUnlockedCard({ achievement }) {
  const rarity = RARITY_CONFIG[achievement.rarity] || RARITY_CONFIG.common;
  
  return (
    <div
      className="bg-dark-bg rounded-lg p-4 border-2 transform hover:scale-105 transition-all duration-300"
      style={{
        borderColor: rarity.color,
        boxShadow: `0 0 20px ${rarity.glow}`
      }}
    >
      <div className="flex items-center gap-4">
        <div
          className="text-5xl flex-shrink-0"
          style={{
            filter: `drop-shadow(0 0 10px ${rarity.color})`
          }}
        >
          {achievement.icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-1">
            {achievement.name}
          </h3>
          <p className="text-sm text-gray-300 mb-2">
            {achievement.description}
          </p>
          <span
            className="text-xs font-bold px-2 py-1 rounded"
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
    </div>
  );
}
