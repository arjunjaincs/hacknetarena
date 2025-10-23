/**
 * Enhanced Action Card - Visual & Intuitive
 * - Color-coded by category
 * - Energy bar instead of number
 * - Big icons, minimal text
 * - Glow effects for combos
 * - Simplified tooltips
 */

import React, { useState, useRef } from 'react';

export default function ActionCard({ 
  action, 
  onSelect, 
  onDoubleClick,
  disabled, 
  selected, 
  cooldown = 0, 
  energy = 100,
  hasSynergy = false,
  synergyName = null
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const cardRef = useRef(null);
  
  const canAfford = energy >= action.energyCost;
  const isOnCooldown = cooldown > 0;
  const isDisabled = disabled || !canAfford || isOnCooldown;
  
  // Handle double-click
  const handleDoubleClick = () => {
    if (!isDisabled && onDoubleClick) {
      onDoubleClick(action);
    }
  };
  
  // Category colors
  const getCategoryColor = () => {
    switch (action.category) {
      case 'Network':
        return {
          bg: 'from-red-900 to-red-700',
          border: 'border-red-500',
          glow: 'shadow-red-500/50',
          text: 'text-red-300'
        };
      case 'Human':
        return {
          bg: 'from-blue-900 to-blue-700',
          border: 'border-blue-500',
          glow: 'shadow-blue-500/50',
          text: 'text-blue-300'
        };
      case 'Software':
        return {
          bg: 'from-green-900 to-green-700',
          border: 'border-green-500',
          glow: 'shadow-green-500/50',
          text: 'text-green-300'
        };
      default:
        return {
          bg: 'from-gray-900 to-gray-700',
          border: 'border-gray-500',
          glow: 'shadow-gray-500/50',
          text: 'text-gray-300'
        };
    }
  };
  
  const colors = getCategoryColor();
  const energyPercent = (action.energyCost / 25) * 100; // Max energy cost is 25
  
  return (
    <div className="relative" ref={cardRef}>
      <button
        onClick={() => !isDisabled && onSelect(action)}
        onDoubleClick={handleDoubleClick}
        disabled={isDisabled}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`
          relative w-full h-48 md:h-52 p-4 rounded-xl
          bg-gradient-to-br ${colors.bg}
          border-2 ${selected ? 'border-cyan-400' : colors.border}
          ${colors.glow}
          flex flex-col items-center justify-between
          transition-all duration-200 ease-out
          ${hasSynergy && !isDisabled
            ? 'ring-4 ring-purple-500 ring-opacity-50 animate-pulse'
            : ''
          }
          ${selected 
            ? 'scale-105 shadow-2xl' 
            : ''
          }
          ${isDisabled
            ? 'opacity-40 cursor-not-allowed'
            : 'hover:scale-110 hover:shadow-2xl cursor-pointer transform'
          }
        `}
      >
        {/* Combo Badge */}
        {hasSynergy && !isDisabled && (
          <div className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce z-10">
            ⚡ COMBO!
          </div>
        )}
        
        {/* Glow effect for combo */}
        {hasSynergy && !isDisabled && (
          <div className="absolute inset-0 bg-purple-500 opacity-20 rounded-xl animate-pulse" />
        )}
        
        {/* Icon - BIG */}
        <div className="text-5xl md:text-6xl mb-2 relative z-10">
          {action.icon}
        </div>
        
        {/* Name */}
        <h3 className="text-sm md:text-base font-bold text-white text-center leading-tight mb-2 relative z-10">
          {action.name}
        </h3>
        
        {/* Category Badge */}
        <div className={`text-xs px-3 py-1 rounded-full ${colors.text} bg-black bg-opacity-30 relative z-10`}>
          {action.category}
        </div>
        
        {/* Energy Bar (Visual) */}
        <div className="w-full mt-2 relative z-10">
          <div className="flex justify-between text-xs text-gray-300 mb-1">
            <span>Energy</span>
            <span className={canAfford ? 'text-yellow-400' : 'text-red-400'}>
              {action.energyCost}
            </span>
          </div>
          <div className="w-full h-2 bg-black bg-opacity-50 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                canAfford ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-red-600'
              }`}
              style={{ width: `${Math.min(100, energyPercent)}%` }}
            />
          </div>
        </div>
        
        {/* Success Rate (Simplified) */}
        <div className="text-xs text-gray-300 mt-1 relative z-10">
          {action.baseChance}% success
        </div>
        
        {/* Cooldown Overlay */}
        {isOnCooldown && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 rounded-xl backdrop-blur-sm z-20">
            <div className="text-center">
              <div className="text-4xl mb-2">⏱️</div>
              <div className="text-white font-bold text-lg">{cooldown}</div>
              <div className="text-cyan-400 text-xs">rounds</div>
            </div>
          </div>
        )}
        
        {/* Can't Afford Overlay */}
        {!canAfford && !isOnCooldown && !disabled && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 rounded-xl backdrop-blur-sm z-20">
            <div className="text-center">
              <div className="text-4xl mb-2">⚡</div>
              <div className="text-red-400 font-bold text-sm">
                Need {action.energyCost} Energy
              </div>
            </div>
          </div>
        )}
        
        {/* Selected Pulse */}
        {selected && (
          <div className="absolute inset-0 border-4 border-cyan-400 rounded-xl animate-pulse z-10" />
        )}
      </button>
      
      {/* Simplified Tooltip (on hover only) */}
      {showTooltip && !isDisabled && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-dark-bg border-2 border-cyber-blue rounded-lg shadow-2xl z-50 pointer-events-none">
          <div className="text-cyber-blue font-bold mb-1 text-sm">
            {action.name}
          </div>
          <div className="text-gray-300 text-xs leading-relaxed mb-2">
            {action.educationalNote}
          </div>
          {hasSynergy && synergyName && (
            <div className="mt-2 p-2 bg-purple-900 bg-opacity-50 border border-purple-500 rounded text-center">
              <div className="text-purple-300 font-bold text-xs">
                ⚡ {synergyName}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
