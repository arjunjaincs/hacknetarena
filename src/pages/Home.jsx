/**
 * Home Page
 * Landing page with game introduction and role selection
 */

import React, { useState, useEffect, useRef } from 'react';
import { playClickSound, initAudio } from '../game/soundEffects';
import { getUserLeaderboardStats } from '../firebase/leaderboard';

export default function Home({ onStartGame, isLoggedIn = false, playerName: loggedInName = '', userId = null }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [showNameModal, setShowNameModal] = useState(false);
  const [userStats, setUserStats] = useState(null);
  const inputRef = useRef(null);
  
  // Load user stats if logged in
  useEffect(() => {
    async function loadStats() {
      if (userId) {
        const stats = await getUserLeaderboardStats(userId);
        setUserStats(stats);
      }
    }
    loadStats();
  }, [userId]);
  
  const handleRoleSelect = (role) => {
    initAudio(); // Initialize audio on first interaction
    playClickSound();
    setSelectedRole(role);
    
    // If logged in, start game immediately. Otherwise show name modal
    if (isLoggedIn) {
      onStartGame(role, loggedInName);
    } else {
      setShowNameModal(true);
    }
  };
  
  // Auto-focus input when modal opens
  useEffect(() => {
    if (showNameModal && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [showNameModal]);
  
  const handleStart = () => {
    if (selectedRole && playerName.trim()) {
      playClickSound();
      onStartGame(selectedRole, playerName.trim());
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-bg to-dark-card flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 cyber-glow animated-gradient-text">
            HackNet Arena
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-2">
            The Human Firewall Challenge
          </p>
          <p className="text-gray-400">
            Learn cybersecurity through interactive gameplay
          </p>
          
          {/* User Stats Display */}
          {isLoggedIn && userStats && userStats.totalScore > 0 && (
            <div className="mt-6 inline-flex items-center gap-4 bg-dark-card border border-cyber-blue rounded-lg px-6 py-3">
              <div className="text-center">
                <div className="text-xs text-gray-400 font-medium">Best Score</div>
                <div className="text-xl font-bold text-cyber-blue">{userStats.bestScore}</div>
              </div>
              <div className="h-8 w-px bg-gray-600"></div>
              <div className="text-center">
                <div className="text-xs text-gray-400 font-medium">Total Score</div>
                <div className="text-xl font-bold text-cyber-purple">{userStats.totalScore}</div>
              </div>
              <div className="h-8 w-px bg-gray-600"></div>
              <div className="text-center">
                <div className="text-xs text-gray-400 font-medium">Games</div>
                <div className="text-xl font-bold text-cyber-green">{userStats.gamesPlayed}</div>
              </div>
            </div>
          )}
        </div>
        
        {/* Game Description */}
        <div className="bg-dark-card border border-gray-600 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-cyber-blue mb-4">🎮 How to Play</h2>
          <div className="space-y-2 text-gray-300">
            <p>• Choose your role: <span className="text-cyber-red font-bold">Hacker</span> or <span className="text-cyber-green font-bold">Defender</span></p>
            <p>• Battle against AI in 5 intense rounds</p>
            <p>• Select action cards representing real cyber tactics</p>
            <p>• Learn cybersecurity concepts through gameplay</p>
            <p>• Compete for the top spot on the leaderboard!</p>
          </div>
        </div>
        
        {/* Role Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center text-cyber-blue mb-4">
            Choose Your Role
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Hacker Role */}
            <button
              onClick={() => handleRoleSelect('hacker')}
              className={`
                p-6 rounded-lg border-2 transition-all duration-300 btn-cyber
                ${selectedRole === 'hacker' 
                  ? 'border-cyber-red bg-cyber-red bg-opacity-20 scale-105' 
                  : 'border-gray-600 bg-dark-card hover:border-cyber-red hover:scale-105'
                }
              `}
            >
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-cyber-red mb-2">Hacker</h3>
              <p className="text-gray-300 mb-4">
                Breach the network using phishing, malware, and social engineering
              </p>
              <div className="text-sm text-gray-400">
                <div>🎯 Goal: Steal data and reduce network integrity to 0</div>
                <div>💡 Learn: Attack vectors and exploitation techniques</div>
              </div>
            </button>
            
            {/* Defender Role */}
            <button
              onClick={() => handleRoleSelect('defender')}
              className={`
                p-6 rounded-lg border-2 transition-all duration-300 btn-cyber
                ${selectedRole === 'defender' 
                  ? 'border-cyber-green bg-cyber-green bg-opacity-20 scale-105' 
                  : 'border-gray-600 bg-dark-card hover:border-cyber-green hover:scale-105'
                }
              `}
            >
              <div className="text-6xl mb-4">🛡️</div>
              <h3 className="text-2xl font-bold text-cyber-green mb-2">Defender</h3>
              <p className="text-gray-300 mb-4">
                Protect the network with firewalls, patches, and security training
              </p>
              <div className="text-sm text-gray-400">
                <div>🛡️ Goal: Maintain network integrity above 60%</div>
                <div>💡 Learn: Defense strategies and security best practices</div>
              </div>
            </button>
          </div>
        </div>
        
        {/* Name Entry Modal */}
        {showNameModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 animate-fade-in">
            <div className="bg-dark-card border-2 border-cyber-blue rounded-lg p-8 max-w-md w-full mx-4 animate-slide-up shadow-2xl">
              <h2 className="text-2xl font-bold text-cyber-blue mb-4 text-center">
                {selectedRole === 'hacker' ? '🎯 Hacker' : '🛡️ Defender'} Selected
              </h2>
              <p className="text-gray-300 mb-6 text-center">
                Enter your username to begin the battle
              </p>
              <input
                ref={inputRef}
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter username..."
                maxLength={20}
                className="w-full px-4 py-3 bg-dark-bg border-2 border-cyber-blue rounded-lg text-white text-center focus:outline-none focus:border-cyber-purple mb-6 text-lg"
                onKeyPress={(e) => e.key === 'Enter' && playerName.trim() && handleStart()}
              />
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowNameModal(false);
                    setSelectedRole(null);
                    setPlayerName('');
                  }}
                  className="flex-1 px-4 py-3 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStart}
                  disabled={!playerName.trim()}
                  className="flex-1 px-4 py-3 bg-cyber-blue text-dark-bg font-bold rounded-lg hover:bg-cyber-purple transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Start Battle 🚀
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Built for cybersecurity education • Free & Open Source</p>
        </div>
      </div>
    </div>
  );
}
