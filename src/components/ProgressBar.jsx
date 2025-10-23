/**
 * ProgressBar Component
 * Displays a colored progress bar with label
 */

import React from 'react';

export default function ProgressBar({ label, value, maxValue = 100, color = 'cyber-blue' }) {
  const percentage = Math.max(0, Math.min(100, (value / maxValue) * 100));
  
  // Determine color based on value
  let barColor = 'bg-cyber-blue';
  if (color === 'health') {
    if (percentage > 60) barColor = 'bg-cyber-green';
    else if (percentage > 30) barColor = 'bg-yellow-500';
    else barColor = 'bg-cyber-red';
  } else if (color === 'danger') {
    if (percentage > 60) barColor = 'bg-cyber-red';
    else if (percentage > 30) barColor = 'bg-yellow-500';
    else barColor = 'bg-cyber-green';
  } else if (color === 'energy') {
    if (percentage > 60) barColor = 'bg-yellow-400';
    else if (percentage > 30) barColor = 'bg-orange-500';
    else barColor = 'bg-red-600';
  }
  
  return (
    <div className="w-full">
      <div className="flex justify-between mb-1 text-sm">
        <span className="text-gray-300">{label}</span>
        <span className="text-white font-bold">{Math.round(value)}/{maxValue}</span>
      </div>
      <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
        <div
          className={`h-full ${barColor} transition-all duration-500 ease-out relative overflow-hidden`}
          style={{ width: `${percentage}%` }}
        >
          {/* Animated shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse-slow"></div>
        </div>
      </div>
    </div>
  );
}
