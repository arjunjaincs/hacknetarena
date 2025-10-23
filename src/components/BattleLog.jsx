/**
 * Battle Log Component
 * Shows last 6 round results in terminal style
 */

import React, { useEffect, useRef } from 'react';

export default function BattleLog({ history, playerRole }) {
  const logRef = useRef(null);

  // Auto-scroll to bottom when new entries added
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [history]);

  // Show only last 6 entries
  const recentHistory = history.slice(-6);

  if (recentHistory.length === 0) {
    return (
      <div className="bg-black/60 border border-cyan-500/30 rounded-lg p-4">
        <h3 className="text-lg font-bold text-cyan-400 mb-2">📜 Battle Log</h3>
        <div className="font-mono text-xs text-gray-500 text-center">
          Battle log will appear here...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/60 border border-cyan-500/30 rounded-lg p-4">
      <h3 className="text-lg font-bold text-cyan-400 mb-2">📜 Battle Log</h3>
      <div 
        ref={logRef}
        className="h-48 overflow-y-auto font-mono text-xs space-y-3"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#00f0ff #1a1f3a' }}
      >
        {recentHistory.map((round, index) => (
          <div key={index} className="animate-fade-in border-l-2 border-cyan-500/50 pl-3">
            {/* Round header */}
            <div className="text-cyan-400 font-bold mb-1">
              ═══ ROUND {round.round} ═══
            </div>

            {/* Hacker action */}
            <div className={round.hackerSuccess ? 'text-red-400' : 'text-gray-500'}>
              <span className="text-red-300">🎯 HACKER:</span> {round.hackerAction}
              {' '}
              <span className={round.hackerSuccess ? 'text-green-400' : 'text-red-400'}>
                [{round.hackerSuccess ? 'HIT' : 'MISS'}]
              </span>
              {' '}({round.hackerChance}%)
              {round.hackerCountered && <span className="text-yellow-400"> [COUNTERED!]</span>}
              {round.hackerSynergy && <span className="text-purple-400"> [COMBO: {round.hackerSynergy.name}]</span>}
            </div>

            {/* Defender action */}
            <div className={round.defenderSuccess ? 'text-green-400' : 'text-gray-500'}>
              <span className="text-green-300">🛡️ DEFENDER:</span> {round.defenderAction}
              {' '}
              <span className={round.defenderSuccess ? 'text-green-400' : 'text-red-400'}>
                [{round.defenderSuccess ? 'HIT' : 'MISS'}]
              </span>
              {' '}({round.defenderChance}%)
              {round.defenderSynergy && <span className="text-purple-400"> [COMBO: {round.defenderSynergy.name}]</span>}
            </div>

            {/* State */}
            <div className="text-gray-400 text-[10px] mt-1">
              Threat:{round.threatLevel} | Network:{round.networkIntegrity} | Data:{round.dataStolen} | Energy:{round.energyHacker}/{round.energyDefender}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
