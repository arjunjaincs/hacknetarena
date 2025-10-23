/**
 * Enhanced Threat Meter - Dynamic & Visual
 * - Large and prominent
 * - Animated bar with shake/pulse effects
 * - Zone-based background colors
 * - Tension-building visuals
 */

import React, { useEffect, useState } from 'react';

export default function ThreatMeter({ value, previousValue = 0 }) {
  const [isShaking, setIsShaking] = useState(false);
  const percentage = Math.max(0, Math.min(100, value));
  
  // Trigger shake animation when threat changes significantly
  useEffect(() => {
    if (Math.abs(value - previousValue) >= 5) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  }, [value, previousValue]);
  
  // Determine zone and styling
  let zone = 'green';
  let zoneLabel = 'SECURE';
  let barColor = 'from-green-500 to-green-600';
  let bgPulse = '';
  let warningText = '';
  
  if (percentage >= 71) {
    zone = 'red';
    zoneLabel = 'CRITICAL';
    barColor = 'from-red-500 to-red-700';
    bgPulse = 'animate-pulse bg-red-900 bg-opacity-20';
    warningText = percentage >= 90 ? '⚠️ HACKER NEAR VICTORY!' : '⚠️ HIGH THREAT';
  } else if (percentage >= 41) {
    zone = 'yellow';
    zoneLabel = 'ELEVATED';
    barColor = 'from-yellow-500 to-orange-600';
    bgPulse = 'bg-yellow-900 bg-opacity-10';
    warningText = '⚠️ CONTESTED';
  } else if (percentage <= 40 && percentage > 0) {
    warningText = '✓ DEFENDER ADVANTAGE';
  }
  
  return (
    <div className={`relative rounded-xl p-4 md:p-6 mb-4 border-2 transition-all duration-500 ${
      zone === 'red' ? 'border-red-500 bg-red-900 bg-opacity-20' :
      zone === 'yellow' ? 'border-yellow-500 bg-yellow-900 bg-opacity-10' :
      'border-green-500 bg-green-900 bg-opacity-10'
    } ${bgPulse}`}>
      {/* Pulsing background effect for red zone */}
      {zone === 'red' && (
        <div className="absolute inset-0 bg-red-500 opacity-10 animate-pulse rounded-xl" />
      )}
      
      {/* Header */}
      <div className="flex justify-between items-center mb-3 relative z-10">
        <div>
          <h3 className={`text-xl md:text-2xl font-bold ${
            zone === 'red' ? 'text-red-400' :
            zone === 'yellow' ? 'text-yellow-400' :
            'text-green-400'
          }`}>
            ⚠️ THREAT LEVEL
          </h3>
          <p className="text-xs text-gray-400">
            Win at 100 | Defend below 40
          </p>
        </div>
        <div className="text-right">
          <div className={`text-4xl md:text-5xl font-bold ${
            zone === 'red' ? 'text-red-400 animate-pulse' :
            zone === 'yellow' ? 'text-yellow-400' :
            'text-green-400'
          }`}>
            {Math.round(percentage)}
          </div>
          <div className={`text-sm font-bold ${
            zone === 'red' ? 'text-red-300' :
            zone === 'yellow' ? 'text-yellow-300' :
            'text-green-300'
          }`}>
            {zoneLabel}
          </div>
        </div>
      </div>
      
      {/* Warning Text */}
      {warningText && (
        <div className={`text-center mb-2 font-bold text-sm md:text-base ${
          zone === 'red' ? 'text-red-400 animate-pulse' :
          zone === 'yellow' ? 'text-yellow-400' :
          'text-green-400'
        }`}>
          {warningText}
        </div>
      )}
      
      {/* Threat Bar */}
      <div className={`relative h-8 md:h-10 bg-gray-900 rounded-full overflow-hidden shadow-inner ${
        isShaking ? 'animate-shake' : ''
      }`}>
        {/* Zone markers (background) */}
        <div className="absolute inset-0 flex">
          <div className="w-[40%] border-r border-gray-700" />
          <div className="w-[30%] border-r border-gray-700" />
          <div className="w-[30%]" />
        </div>
        
        {/* Animated bar */}
        <div
          className={`absolute top-0 left-0 h-full bg-gradient-to-r ${barColor} transition-all duration-700 ease-out shadow-lg`}
          style={{ width: `${percentage}%` }}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer" />
        </div>
        
        {/* Percentage text on bar */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-bold text-sm md:text-base drop-shadow-lg">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
      
      {/* Zone labels */}
      <div className="flex justify-between text-xs text-gray-400 mt-2 relative z-10">
        <span className="text-green-400">0 Safe</span>
        <span className="text-yellow-400">40</span>
        <span className="text-orange-400">70</span>
        <span className="text-red-400">100 Critical</span>
      </div>
    </div>
  );
}
