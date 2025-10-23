/**
 * Navbar Component
 * Static navbar with profile button and navigation
 */

import React, { useState, useEffect } from 'react';
import UserProfile from './UserProfile';

export default function Navbar({ isLoggedIn, playerName, userEmail, userId, onLogout, onViewProfile, currentScreen, onBack, onViewGuide }) {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="text-xl font-bold bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent">
              HACKNET ARENA
            </div>
            
            {/* Back/Quit Button */}
            {currentScreen !== 'home' && onBack && (
              <button
                onClick={onBack}
                className="px-4 py-2 bg-gray-700/50 hover:bg-gray-600 text-white rounded-lg transition-all text-sm font-medium flex items-center gap-2"
              >
                <span>←</span>
                <span>{currentScreen === 'game' ? 'Quit' : 'Back'}</span>
              </button>
            )}
            
            {/* Guide Button */}
            {currentScreen === 'home' && onViewGuide && (
              <button
                onClick={onViewGuide}
                className="px-4 py-2 bg-cyber-purple/20 hover:bg-cyber-purple hover:text-white text-cyber-purple rounded-lg transition-all text-sm font-medium flex items-center gap-2 border border-cyber-purple/50 hover:border-cyber-purple transform hover:scale-105"
              >
                <span>📖</span>
                <span>Guide</span>
              </button>
            )}
          </div>

          {/* Profile */}
          <div className="flex items-center">
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
