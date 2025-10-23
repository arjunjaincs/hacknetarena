/**
 * Modern Home Page - Redesigned
 * Clean, aesthetic, minimalistic with animations
 */

import React, { useState, useEffect, useRef } from 'react';
import { playClickSound, initAudio } from '../game/soundEffects';

export default function Home({ onStartGame, isLoggedIn = false, playerName: loggedInName = '' }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [showNameModal, setShowNameModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const inputRef = useRef(null);
  
  // Fade in animation
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  const handleRoleSelect = (role) => {
    initAudio();
    playClickSound();
    setSelectedRole(role);
    
    if (isLoggedIn) {
      onStartGame(role, loggedInName);
    } else {
      setShowNameModal(true);
    }
  };
  
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
              <span className="font-bold text-2xl text-white block cyber-glow">12</span>
              <span className="font-semibold" style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.5)' }}>ACTIONS</span>
            </div>
            <div className="hover:text-cyber-purple transition-colors" style={{ cursor: 'inherit' }}>
              <span className="font-bold text-2xl text-white block cyber-glow">6</span>
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
        
        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-dark-card/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 hover:border-cyber-blue transition-colors">
            <div className="text-2xl mb-2">⚡</div>
            <div className="text-xs text-gray-400">FAST-PACED</div>
          </div>
          <div className="bg-dark-card/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 hover:border-cyber-purple transition-colors">
            <div className="text-2xl mb-2">🧠</div>
            <div className="text-xs text-gray-400">STRATEGIC</div>
          </div>
          <div className="bg-dark-card/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 hover:border-cyber-green transition-colors">
            <div className="text-2xl mb-2">🎓</div>
            <div className="text-xs text-gray-400">EDUCATIONAL</div>
          </div>
          <div className="bg-dark-card/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 hover:border-red-500 transition-colors">
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
