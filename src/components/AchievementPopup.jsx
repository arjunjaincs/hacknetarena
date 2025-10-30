/**
 * Achievement Popup Component
 * Shows animated popup when achievement is unlocked
 */

import React, { useEffect, useState } from 'react';
import { RARITY_CONFIG } from '../game/achievements';

export default function AchievementPopup({ achievement, onDismiss }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Fade in
    setTimeout(() => setIsVisible(true), 50);

    // Auto dismiss after 3 seconds
    const dismissTimer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(() => {
        onDismiss();
      }, 500);
    }, 3000);

    return () => clearTimeout(dismissTimer);
  }, [onDismiss]);

  if (!achievement) return null;

  const rarity = RARITY_CONFIG[achievement.rarity] || RARITY_CONFIG.common;

  return (
    <div
      className={`fixed top-24 right-4 z-50 transform transition-all duration-500 ${
        isVisible && !isLeaving
          ? 'translate-x-0 opacity-100'
          : 'translate-x-full opacity-0'
      }`}
    >
      <div
        className="relative bg-dark-card border-2 rounded-xl p-4 shadow-2xl max-w-sm overflow-hidden"
        style={{
          borderColor: rarity.color,
          boxShadow: `0 0 30px ${rarity.glow}, 0 0 60px ${rarity.glow}`
        }}
      >
        {/* Animated background glow */}
        <div
          className="absolute inset-0 opacity-20 animate-pulse"
          style={{
            background: `radial-gradient(circle at center, ${rarity.color} 0%, transparent 70%)`
          }}
        />

        {/* Sparkle effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full animate-sparkle">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `twinkle ${1 + Math.random()}s infinite ${Math.random()}s`
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-start gap-3">
          {/* Icon */}
          <div
            className="text-5xl flex-shrink-0 animate-bounce"
            style={{
              filter: `drop-shadow(0 0 10px ${rarity.color})`
            }}
          >
            {achievement.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: rarity.color }}>
                Achievement Unlocked!
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-white mb-1 truncate">
              {achievement.name}
            </h3>
            
            <p className="text-sm text-gray-300 line-clamp-2">
              {achievement.description}
            </p>

            {/* Rarity badge */}
            <div className="mt-2 inline-block">
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

        {/* Progress bar animation */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
          <div
            className="h-full transition-all duration-3000 ease-linear"
            style={{
              width: isLeaving ? '0%' : '100%',
              backgroundColor: rarity.color
            }}
          />
        </div>
      </div>
    </div>
  );
}

// CSS for sparkle animation (add to index.css)
const styles = `
@keyframes twinkle {
  0%, 100% { opacity: 0; transform: scale(0); }
  50% { opacity: 1; transform: scale(1); }
}

@keyframes sparkle {
  0% { transform: translateY(0); }
  100% { transform: translateY(-10px); }
}
`;
