/**
 * RoundResult Component
 * Displays the outcome of a game round with animations
 */

import React, { useEffect, useState } from 'react';

export default function RoundResult({ result, onClose }) {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div className={`
      fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80
      transition-opacity duration-300
      ${visible ? 'opacity-100' : 'opacity-0'}
    `}>
      <div className={`
        bg-dark-card border-2 border-cyber-blue rounded-lg p-8 max-w-md mx-4
        transform transition-all duration-300
        ${visible ? 'scale-100' : 'scale-75'}
      `}>
        <h2 className="text-2xl font-bold text-cyber-blue mb-4 text-center">
          Round {result.round} Complete!
        </h2>
        
        <div className="space-y-4">
          {/* Actions taken */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-dark-bg rounded border border-cyber-red">
              <div className="text-sm text-gray-400">Hacker</div>
              <div className="text-lg font-bold text-cyber-red">{result.hackerAction}</div>
              <div className="text-2xl mt-1">
                {result.hackerSuccess ? '✅' : '❌'}
              </div>
            </div>
            
            <div className="text-center p-3 bg-dark-bg rounded border border-cyber-green">
              <div className="text-sm text-gray-400">Defender</div>
              <div className="text-lg font-bold text-cyber-green">{result.defenderAction}</div>
              <div className="text-2xl mt-1">
                {result.defenderSuccess ? '✅' : '❌'}
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div className="bg-dark-bg p-4 rounded border border-gray-600">
            <p className="text-gray-300 text-center">{result.description}</p>
          </div>
          
          {/* Current stats */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-sm text-gray-400">Network Integrity</div>
              <div className="text-2xl font-bold text-cyber-green">
                {Math.round(result.networkIntegrity)}%
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Data Stolen</div>
              <div className="text-2xl font-bold text-cyber-red">
                {Math.round(result.dataStolen)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
