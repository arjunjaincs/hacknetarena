import React from 'react';

export default function Guide({ onBack }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-bg to-dark-card p-4">
      {/* Spacer for navbar */}
      <div className="h-20"></div>
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-cyber-blue cyber-glow mb-4">
            📖 How to Play
          </h1>
          <p className="text-gray-400">Master the basics and dominate the arena!</p>
        </div>

        {/* Quick Start */}
        <div className="bg-dark-card border-2 border-cyber-blue rounded-lg p-6 mb-6 animate-fade-in">
          <h2 className="text-2xl font-bold text-cyber-blue mb-4">⚡ Quick Start</h2>
          <ol className="space-y-3 text-gray-300">
            <li className="flex gap-3">
              <span className="text-cyber-blue font-bold">1.</span>
              <span><strong>Choose your role:</strong> Hacker (offensive) or Defender (protective)</span>
            </li>
            <li className="flex gap-3">
              <span className="text-cyber-blue font-bold">2.</span>
              <span><strong>Select an action card</strong> each round (single-click + confirm OR double-click)</span>
            </li>
            <li className="flex gap-3">
              <span className="text-cyber-blue font-bold">3.</span>
              <span><strong>Watch the battle:</strong> Your action vs AI's action</span>
            </li>
            <li className="flex gap-3">
              <span className="text-cyber-blue font-bold">4.</span>
              <span><strong>Win the game:</strong> Reach your role's win condition!</span>
            </li>
          </ol>
        </div>

        {/* Win Conditions */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gradient-to-br from-red-900/20 to-dark-card border-2 border-red-500/50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-red-400 mb-3">🎯 Hacker Wins</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Threat reaches <strong className="text-red-400">100</strong></li>
              <li>• Network drops to <strong className="text-red-400">0</strong></li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-green-900/20 to-dark-card border-2 border-green-500/50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-green-400 mb-3">🛡️ Defender Wins</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Keep threat <strong className="text-green-400">&lt; 40</strong> for 3 rounds</li>
              <li>• Survive until hacker runs out of energy</li>
            </ul>
          </div>
        </div>

        {/* Pro Tips */}
        <div className="bg-dark-card border-2 border-cyber-purple rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-cyber-purple mb-4">💡 Pro Tips</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-cyan-400 mb-2">🔥 Build Combos</h3>
              <p className="text-gray-300 text-sm">Use actions back-to-back to trigger combos! Look for the purple glow on cards. Combos give +15-20 bonus damage.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-cyan-400 mb-2">⚡ Manage Energy</h3>
              <p className="text-gray-300 text-sm">You start with 100 energy and regenerate +15 per round. Don't spam expensive actions! Cards glow red when you can't afford them.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-cyan-400 mb-2">🎯 Build Momentum</h3>
              <p className="text-gray-300 text-sm">Win consecutive rounds to build momentum (+5% success per win, max +25%). This makes your actions more likely to succeed!</p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-cyan-400 mb-2">🛡️ Avoid Counters</h3>
              <p className="text-gray-300 text-sm">Don't be predictable! If the AI predicts your move, you get -40% success chance. Mix up your strategy!</p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-cyan-400 mb-2">🎧 Listen for Audio Cues</h3>
              <p className="text-gray-300 text-sm">Combos, counters, and critical threats have unique sounds. Use audio feedback to react faster!</p>
            </div>
          </div>
        </div>

        {/* Action Categories */}
        <div className="bg-dark-card border-2 border-gray-600 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">🎴 Action Categories</h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-red-900/20 border border-red-500/50 rounded p-4">
              <h3 className="text-red-400 font-bold mb-2">🔴 Network</h3>
              <p className="text-xs text-gray-400">DDoS, Brute Force, Firewall, Monitoring</p>
            </div>
            
            <div className="bg-blue-900/20 border border-blue-500/50 rounded p-4">
              <h3 className="text-blue-400 font-bold mb-2">🔵 Human</h3>
              <p className="text-xs text-gray-400">Phishing, Social Eng, Training, Backup</p>
            </div>
            
            <div className="bg-green-900/20 border border-green-500/50 rounded p-4">
              <h3 className="text-green-400 font-bold mb-2">🟢 Software</h3>
              <p className="text-xs text-gray-400">Malware, Zero-Day, Antivirus, Patch</p>
            </div>
          </div>
          
          <p className="text-sm text-gray-400 mt-4">💡 <strong>Counter System:</strong> Network counters Software, Human counters Network, Software counters Human!</p>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={onBack}
            className="px-8 py-4 bg-dark-card border-2 border-cyber-blue text-cyber-blue font-bold text-lg rounded-lg hover:bg-cyber-blue hover:text-dark-bg transition-all duration-300 transform hover:scale-105"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
