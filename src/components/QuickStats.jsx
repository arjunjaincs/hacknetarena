/**
 * Quick Stats Panel
 * Shows after each round with key stats
 */

import React, { useEffect } from 'react';

export default function QuickStats({ stats, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!stats) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 animate-fade-in">
      <div className="bg-dark-card/95 backdrop-blur-md border-2 border-cyber-blue rounded-lg p-4 shadow-2xl shadow-cyber-blue/20 min-w-[200px]">
        <div className="text-sm space-y-2">
          {/* Damage/Defense */}
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Impact:</span>
            <span className="text-white font-bold">{stats.damage || 0}</span>
          </div>
          
          {/* Combo */}
          {stats.combo && (
            <div className="flex justify-between items-center text-purple-400">
              <span>⚡ Combo:</span>
              <span className="font-bold">{stats.combo}</span>
            </div>
          )}
          
          {/* Counter */}
          {stats.countered && (
            <div className="flex justify-between items-center text-yellow-400">
              <span>🛡️ Countered!</span>
            </div>
          )}
          
          {/* Threat Change */}
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Threat:</span>
            <span className={`font-bold ${stats.threatChange > 0 ? 'text-red-400' : stats.threatChange < 0 ? 'text-green-400' : 'text-gray-400'}`}>
              {stats.threatChange > 0 ? '+' : ''}{stats.threatChange}
            </span>
          </div>
          
          {/* Energy Used */}
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Energy:</span>
            <span className="text-cyan-400 font-bold">-{stats.energyUsed}</span>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-3 h-1 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyber-blue to-cyber-purple animate-shimmer"
            style={{ 
              width: '100%',
              animation: 'shimmer 3s linear'
            }}
          />
        </div>
      </div>
    </div>
  );
}
