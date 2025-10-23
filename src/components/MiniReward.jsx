/**
 * Mini Reward Notification Component
 * Shows small popups for combos, counters, threat spikes
 */

import React, { useEffect, useState } from 'react';

export default function MiniReward({ type, message, onComplete }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 300);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const getStyles = () => {
    switch (type) {
      case 'combo':
        return {
          bg: 'bg-gradient-to-r from-purple-600 to-pink-600',
          icon: '⚡',
          glow: 'shadow-purple-500/50'
        };
      case 'counter':
        return {
          bg: 'bg-gradient-to-r from-yellow-600 to-orange-600',
          icon: '🛡️',
          glow: 'shadow-yellow-500/50'
        };
      case 'threat':
        return {
          bg: 'bg-gradient-to-r from-red-600 to-red-800',
          icon: '⚠️',
          glow: 'shadow-red-500/50'
        };
      case 'momentum':
        return {
          bg: 'bg-gradient-to-r from-cyan-600 to-blue-600',
          icon: '🔥',
          glow: 'shadow-cyan-500/50'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-cyber-blue to-cyber-purple',
          icon: '✨',
          glow: 'shadow-cyan-500/50'
        };
    }
  };

  const styles = getStyles();

  return (
    <div
      className={`
        fixed top-24 left-1/2 transform -translate-x-1/2 z-50
        ${styles.bg} ${styles.glow}
        px-6 py-3 rounded-full shadow-2xl
        flex items-center gap-3
        transition-all duration-300
        ${visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-75 -translate-y-4'}
      `}
    >
      {/* Particle effect */}
      <div className="absolute inset-0 overflow-hidden rounded-full">
        <div className="absolute w-2 h-2 bg-white rounded-full animate-ping" style={{ top: '20%', left: '20%' }} />
        <div className="absolute w-2 h-2 bg-white rounded-full animate-ping" style={{ top: '60%', right: '20%', animationDelay: '0.3s' }} />
      </div>

      {/* Icon */}
      <span className="text-2xl animate-bounce">{styles.icon}</span>

      {/* Message */}
      <span className="text-white font-bold text-lg whitespace-nowrap relative z-10">
        {message}
      </span>
    </div>
  );
}
