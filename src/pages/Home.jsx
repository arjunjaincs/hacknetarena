/**
 * Modern Home Page - Redesigned
 * Clean, aesthetic, minimalistic with animations
 */

import React, { useState, useEffect, useRef } from 'react';
import { playClickSound, initAudio } from '../game/soundEffects';
import { DIFFICULTY_SETTINGS } from '../game/gameAI';
import { getDailyChallenge, getTimeUntilNextChallenge, formatTimeRemaining } from '../game/dailyChallenges';
import { getTodaysChallengeCount, hasCompletedTodaysChallenge } from '../firebase/dailyChallenges';

export default function Home({ onStartGame, onStartDailyChallenge, userId, isLoggedIn = false, playerName: loggedInName = '' }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [showNameModal, setShowNameModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [difficulty, setDifficulty] = useState(() => {
    return localStorage.getItem('hacknet_difficulty') || 'normal';
  });
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [challengeCount, setChallengeCount] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');
  const inputRef = useRef(null);
  
  // Fade in animation
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  // Load daily challenge
  useEffect(() => {
    const challenge = getDailyChallenge();
    setDailyChallenge(challenge);
    
    getTodaysChallengeCount().then(setChallengeCount);
    
    if (userId) {
      hasCompletedTodaysChallenge(userId).then(setHasCompleted);
    }
    
    // Update countdown timer
    const timer = setInterval(() => {
      const ms = getTimeUntilNextChallenge();
      setTimeRemaining(formatTimeRemaining(ms));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [userId]);
  
  const handleRoleSelect = (role) => {
    initAudio();
    playClickSound();
    setSelectedRole(role);
    
    if (isLoggedIn) {
      onStartGame(role, loggedInName, difficulty);
    } else {
      setShowNameModal(true);
    }
  };
  
  const handleDifficultyChange = (newDifficulty) => {
    playClickSound();
    setDifficulty(newDifficulty);
    localStorage.setItem('hacknet_difficulty', newDifficulty);
  };
  
  useEffect(() => {
    if (showNameModal && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [showNameModal]);
  
  const handleStart = () => {
    const sanitizedName = playerName.trim().slice(0, 20).replace(/[^A-Za-z0-9 _-]/g, '').replace(/\s+/g, ' ');
    if (selectedRole && sanitizedName) {
      playClickSound();
      onStartGame(selectedRole, sanitizedName, difficulty);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-24 relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-cyber-blue opacity-10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyber-purple opacity-10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className={`max-w-6xl w-full transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <div className="text-7xl md:text-8xl font-black mb-4 bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-blue bg-clip-text text-transparent animate-gradient bg-300%">
              HACKNET
            </div>
            <div className="text-4xl md:text-5xl font-light text-gray-300 tracking-widest">
              ARENA
            </div>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto mb-8 leading-relaxed font-medium" style={{ textShadow: '0 0 20px rgba(0, 240, 255, 0.3)' }}>
            Master cybersecurity through strategic combat
          </p>
          
          {/* Stats */}
          <div className="flex justify-center gap-8 text-sm text-gray-300 mt-4">
            <div className="hover:text-cyber-blue transition-colors" style={{ cursor: 'inherit' }}>
              <span className="font-bold text-2xl text-white block cyber-glow">24</span>
              <span className="font-semibold" style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.5)' }}>ACTIONS</span>
            </div>
            <div className="hover:text-cyber-purple transition-colors" style={{ cursor: 'inherit' }}>
              <span className="font-bold text-2xl text-white block cyber-glow">18</span>
              <span className="font-semibold" style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.5)' }}>COMBOS</span>
            </div>
            <div className="hover:text-cyber-green transition-colors" style={{ cursor: 'inherit' }}>
              <span className="font-bold text-2xl text-white block cyber-glow">∞</span>
              <span className="font-semibold" style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.5)' }}>ROUNDS</span>
            </div>
          </div>
        </div>
        
        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Hacker Card */}
          <div
            onClick={() => handleRoleSelect('hacker')}
            className="group relative bg-gradient-to-br from-red-900/20 to-dark-card border-2 border-red-500/30 rounded-2xl p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:border-red-500 hover:shadow-2xl hover:shadow-red-500/20"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-red-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="relative z-10">
              <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">🎯</div>
              <h3 className="text-3xl font-bold text-red-400 mb-3">HACKER</h3>
              <p className="text-red-300 mb-6 leading-relaxed font-medium" style={{ textShadow: '0 0 15px rgba(255, 0, 0, 0.4)' }}>
                Infiltrate systems, exploit vulnerabilities, and breach defenses
              </p>
              
              <div className="space-y-2 text-sm text-red-300">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span style={{ textShadow: '0 0 8px rgba(255, 0, 0, 0.3)' }}>Offensive tactics</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span style={{ textShadow: '0 0 8px rgba(255, 0, 0, 0.3)' }}>High-risk, high-reward</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span style={{ textShadow: '0 0 8px rgba(255, 0, 0, 0.3)' }}>Win by reaching threat 100</span>
                </div>
              </div>
              
              <div className="mt-6 text-red-400 font-bold group-hover:translate-x-2 transition-transform">
                SELECT →
              </div>
            </div>
          </div>
          
          {/* Defender Card */}
          <div
            onClick={() => handleRoleSelect('defender')}
            className="group relative bg-gradient-to-br from-green-900/20 to-dark-card border-2 border-green-500/30 rounded-2xl p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:border-green-500 hover:shadow-2xl hover:shadow-green-500/20"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="relative z-10">
              <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">🛡️</div>
              <h3 className="text-3xl font-bold text-green-400 mb-3">DEFENDER</h3>
              <p className="text-green-300 mb-6 leading-relaxed font-medium" style={{ textShadow: '0 0 15px rgba(0, 255, 0, 0.4)' }}>
                Protect networks, patch vulnerabilities, and maintain security
              </p>
              
              <div className="space-y-2 text-sm text-green-300">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span style={{ textShadow: '0 0 8px rgba(0, 255, 0, 0.3)' }}>Defensive strategies</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span style={{ textShadow: '0 0 8px rgba(0, 255, 0, 0.3)' }}>Consistent protection</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span style={{ textShadow: '0 0 8px rgba(0, 255, 0, 0.3)' }}>Win by keeping threat low</span>
                </div>
              </div>
              
              <div className="mt-6 text-green-400 font-bold group-hover:translate-x-2 transition-transform">
                SELECT →
              </div>
            </div>
          </div>
        </div>
        
        {/* Difficulty Selector */}
        <div className="mt-8 bg-dark-card/80 backdrop-blur-md border-2 border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-center text-cyber-blue mb-4">⚙️ Select Difficulty</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(DIFFICULTY_SETTINGS).map(([key, config]) => (
              <button
                key={key}
                onClick={() => handleDifficultyChange(key)}
                className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                  difficulty === key
                    ? 'border-cyber-blue bg-cyber-blue/20 scale-105'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-white">{config.name}</span>
                  {difficulty === key && <span className="text-cyber-blue">✓</span>}
                </div>
                <div className="text-sm text-gray-300 space-y-1">
                  <div>• AI Mistakes: {Math.round(config.mistakeProbability * 100)}%</div>
                  <div>• Score: ×{config.scoreMultiplier}</div>
                  {config.playerEnergyBonus > 0 && (
                    <div className="text-green-400">• +{config.playerEnergyBonus} Starting Energy</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Daily Challenge */}
        {dailyChallenge && (
          <div className="mt-8 bg-gradient-to-r from-yellow-900/80 to-orange-900/80 backdrop-blur-md border-2 border-yellow-500 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h2 className="text-2xl font-bold text-yellow-400 flex items-center gap-2">
                  {dailyChallenge.icon} Daily Challenge
                </h2>
                <div className="text-sm text-yellow-300 font-mono">
                  ⏰ Next in: {timeRemaining}
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-xl font-bold text-white mb-2">{dailyChallenge.name}</h3>
                <p className="text-gray-300 mb-3">{dailyChallenge.description}</p>
                <div className="flex items-center gap-4 text-sm flex-wrap">
                  <span className="px-3 py-1 rounded bg-yellow-900/50 text-yellow-400 border border-yellow-500">
                    {dailyChallenge.role === 'hacker' ? '🎯 Hacker' : '🛡️ Defender'}
                  </span>
                  <span className="px-3 py-1 rounded bg-orange-900/50 text-orange-400 border border-orange-500">
                    ×{dailyChallenge.scoreMultiplier} Score
                  </span>
                  <span className="text-gray-400">
                    👥 {challengeCount.toLocaleString()} completed today
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => onStartDailyChallenge && onStartDailyChallenge(dailyChallenge)}
                disabled={hasCompleted}
                className={`w-full px-6 py-4 rounded-lg font-bold text-lg transition-all duration-300 ${
                  hasCompleted
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/50'
                }`}
              >
                {hasCompleted ? '✓ Completed Today' : '🎯 Start Daily Challenge'}
              </button>
            </div>
          </div>
        )}
        
        {/* Features */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-dark-card backdrop-blur-sm border-2 border-gray-700 rounded-xl p-4 hover:border-cyber-blue transition-colors">
            <div className="text-2xl mb-2">⚡</div>
            <div className="text-xs text-gray-400">FAST-PACED</div>
          </div>
          <div className="bg-dark-card backdrop-blur-sm border-2 border-gray-700 rounded-xl p-4 hover:border-cyber-purple transition-colors">
            <div className="text-2xl mb-2">🧠</div>
            <div className="text-xs text-gray-400">STRATEGIC</div>
          </div>
          <div className="bg-dark-card backdrop-blur-sm border-2 border-gray-700 rounded-xl p-4 hover:border-cyber-green transition-colors">
            <div className="text-2xl mb-2">🎓</div>
            <div className="text-xs text-gray-400">EDUCATIONAL</div>
          </div>
          <div className="bg-dark-card backdrop-blur-sm border-2 border-gray-700 rounded-xl p-4 hover:border-red-500 transition-colors">
            <div className="text-2xl mb-2">🏆</div>
            <div className="text-xs text-gray-400">COMPETITIVE</div>
          </div>
        </div>
      </div>
      
      {/* Name Modal */}
      {showNameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-dark-card border-2 border-cyber-blue rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-cyber-blue/20 transform animate-scale-in">
            <h2 className="text-3xl font-bold text-cyber-blue mb-6">Enter Your Name</h2>
            <input
              ref={inputRef}
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleStart()}
              placeholder="CyberWarrior"
              className="w-full px-6 py-4 bg-dark-bg border-2 border-gray-600 rounded-xl text-white text-lg focus:outline-none focus:border-cyber-blue transition-colors mb-6"
              maxLength={20}
            />
            <div className="flex gap-4">
              <button
                onClick={() => setShowNameModal(false)}
                className="flex-1 px-6 py-4 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleStart}
                disabled={!playerName.trim()}
                className="flex-1 px-6 py-4 bg-cyber-blue text-dark-bg rounded-xl hover:bg-cyber-purple transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
              >
                Start Game
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
