/**
 * User Profile Dropdown Component
 * Beautiful profile button with dropdown menu
 */

import React, { useState, useRef, useEffect } from 'react';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { getUserStats } from '../firebase/gameHistory';

export default function UserProfile({ playerName, userEmail, onLogout, onViewProfile, userId }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [stats, setStats] = useState(null);
  const dropdownRef = useRef(null);

  // Load user stats
  useEffect(() => {
    async function loadStats() {
      if (userId) {
        const userStats = await getUserStats(userId);
        setStats(userStats);
      }
    }
    loadStats();
  }, [userId]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
      setShowDropdown(false);
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-3 bg-dark-card border-2 border-cyber-blue rounded-lg px-4 py-2 hover:bg-dark-bg hover:border-cyber-purple transition-all duration-300 group"
      >
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyber-blue to-cyber-purple flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
          {playerName.charAt(0).toUpperCase()}
        </div>
        
        {/* Name */}
        <div className="hidden md:block text-left">
          <div className="text-sm font-bold text-cyber-blue group-hover:text-cyber-purple transition-colors">
            {playerName}
          </div>
          <div className="text-xs text-gray-400">View Profile</div>
        </div>
        
        {/* Dropdown Arrow */}
        <div className={`text-cyber-blue transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`}>
          ▼
        </div>
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-72 bg-dark-card border-2 border-cyber-blue rounded-lg shadow-2xl overflow-hidden animate-fade-in z-50">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyber-blue to-cyber-purple p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white font-bold text-xl">
                {playerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-white font-bold">{playerName}</div>
                {userEmail && (
                  <div className="text-white text-opacity-80 text-xs">{userEmail}</div>
                )}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            {/* Profile Stats */}
            <div className="px-3 py-2 mb-2">
              <div className="text-xs text-gray-400 mb-2">PLAYER STATS</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-dark-bg rounded p-2 text-center">
                  <div className="text-cyber-blue font-bold text-lg">{stats?.totalGames || 0}</div>
                  <div className="text-xs text-gray-400">Games Played</div>
                </div>
                <div className="bg-dark-bg rounded p-2 text-center">
                  <div className="text-cyber-green font-bold text-lg">{stats?.winRate || 0}%</div>
                  <div className="text-xs text-gray-400">Win Rate</div>
                </div>
              </div>
            </div>

            {/* View Profile Button */}
            <button
              onClick={() => {
                setShowDropdown(false);
                onViewProfile();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-cyber-blue hover:bg-opacity-20 text-cyber-blue hover:text-cyan-300 transition-all duration-200 group"
            >
              <span className="text-xl">👤</span>
              <div className="text-left flex-1">
                <div className="font-bold">View Profile</div>
                <div className="text-xs opacity-70">See your game history</div>
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </button>

            {/* Divider */}
            <div className="border-t border-gray-700 my-2"></div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-red-900 hover:bg-opacity-30 text-red-400 hover:text-red-300 transition-all duration-200 group"
            >
              <span className="text-xl">🚪</span>
              <div className="text-left flex-1">
                <div className="font-bold">Logout</div>
                <div className="text-xs opacity-70">Sign out of your account</div>
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
