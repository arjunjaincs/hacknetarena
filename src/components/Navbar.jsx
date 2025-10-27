/**
 * Navbar Component
 * Static navbar with profile button and navigation
 */

import React, { useState, useEffect } from 'react';
import UserProfile from './UserProfile';

export default function Navbar({ isLoggedIn, playerName, userEmail, userId, onLogout, onViewProfile, currentScreen, onBack, onViewGuide, onViewLeaderboard }) {
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Change style when scrolled
      if (currentScrollY > 50) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  if (!isLoggedIn) return null;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isVisible 
        ? 'bg-dark-card/95 backdrop-blur-md border-b border-gray-700 shadow-lg shadow-cyber-blue/20' 
        : 'bg-dark-card/70 backdrop-blur-sm border-b border-gray-700/50'
    }`}>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Left Side - Logo & Navigation */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            {/* Logo */}
            <div className="text-sm sm:text-lg md:text-xl font-bold bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent whitespace-nowrap">
              HACKNET
            </div>
            
            {/* Back/Quit Button */}
            {currentScreen !== 'home' && onBack && (
              <button
                onClick={onBack}
                className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-gray-700/50 hover:bg-gray-600 text-white rounded-lg transition-all text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2"
              >
                <span>←</span>
                <span className="hidden sm:inline">{currentScreen === 'game' ? 'Quit' : 'Back'}</span>
              </button>
            )}
            
            {/* Guide & Leaderboard Buttons - Desktop Only */}
            {currentScreen === 'home' && (
              <div className="hidden md:flex items-center gap-2">
                {onViewGuide && (
                  <button
                    onClick={onViewGuide}
                    className="px-3 py-1.5 bg-cyber-purple/20 hover:bg-cyber-purple hover:text-white text-cyber-purple rounded-lg transition-all text-sm font-medium flex items-center gap-2 border border-cyber-purple/50 hover:border-cyber-purple transform hover:scale-105"
                  >
                    <span>📖</span>
                    <span>Guide</span>
                  </button>
                )}
                
                {onViewLeaderboard && (
                  <button
                    onClick={onViewLeaderboard}
                    className="px-3 py-1.5 bg-cyber-blue/20 hover:bg-cyber-blue hover:text-white text-cyber-blue rounded-lg transition-all text-sm font-medium flex items-center gap-2 border border-cyber-blue/50 hover:border-cyber-blue transform hover:scale-105"
                  >
                    <span>🏆</span>
                    <span>Leaderboard</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right Side - Profile & Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Mobile Guide/Leaderboard Icons */}
            {currentScreen === 'home' && (
              <div className="flex md:hidden items-center gap-1">
                {onViewGuide && (
                  <button
                    onClick={onViewGuide}
                    className="p-2 text-cyber-purple hover:bg-cyber-purple/20 rounded-lg transition-all"
                    title="Guide"
                  >
                    <span className="text-lg">📖</span>
                  </button>
                )}
                
                {onViewLeaderboard && (
                  <button
                    onClick={onViewLeaderboard}
                    className="p-2 text-cyber-blue hover:bg-cyber-blue/20 rounded-lg transition-all"
                    title="Leaderboard"
                  >
                    <span className="text-lg">🏆</span>
                  </button>
                )}
              </div>
            )}
            
            {/* Profile */}
            <UserProfile
              playerName={playerName}
              userEmail={userEmail}
              userId={userId}
              onLogout={onLogout}
              onViewProfile={onViewProfile}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
