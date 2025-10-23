import React, { useEffect, useState } from 'react';
import { submitScore } from '../firebase/leaderboard';
import { saveGameHistory } from '../firebase/gameHistory';
import { playGameOverSound } from '../game/soundEffects';

export default function Results({ gameState, onPlayAgain, onViewLeaderboard }) {
  const [finalScore, setFinalScore] = useState(0);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const isDraw = gameState.winner === 'draw';
  const playerWon = !isDraw && gameState.winner === gameState.playerRole;
  
  useEffect(() => {
    playGameOverSound(playerWon);
    
    const score = Math.round(gameState.playerScore);
    setFinalScore(score);
    
    const saveScore = async () => {
      setSaving(true);
      
      // Save to leaderboard
      const success = await submitScore(
        gameState.playerName || 'Anonymous',
        score,
        gameState.playerRole,
        playerWon,
        gameState.userId
      );
      
      // Save to game history
      if (gameState.userId) {
        await saveGameHistory(gameState.userId, {
          playerName: gameState.playerName,
          score,
          role: gameState.playerRole,
          won: playerWon,
          winner: gameState.winner,
          rounds: gameState.round - 1,
          threatLevel: gameState.threatLevel,
          networkIntegrity: gameState.networkIntegrity,
          dataStolen: gameState.dataStolen,
          combosEarned: gameState.combosEarned
        });
      }
      
      setScoreSaved(success);
      setSaving(false);
    };
    
    saveScore();
  }, [gameState, playerWon]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-bg to-dark-card flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Result Header */}
        <div className="text-center mb-8">
          <div className="text-8xl mb-4">
            {isDraw ? '🤝' : (playerWon ? '🏆' : '💔')}
          </div>
          <h1 className={`text-5xl font-bold mb-4 ${
            isDraw ? 'text-yellow-400' : (playerWon ? 'text-cyber-green' : 'text-cyber-red')
          }`}>
            {isDraw ? 'Draw!' : (playerWon ? 'Victory!' : 'Defeated!')}
          </h1>
          <p className="text-2xl text-gray-300">
            {isDraw ? 'Resources Exhausted' : 
             (gameState.winner === 'hacker' ? 'Network Breached' : 'Network Defended')}
          </p>
        </div>
        
        {/* Score Display */}
        <div className="bg-dark-card border-2 border-cyber-blue rounded-lg p-8 mb-6">
          <div className="text-center mb-6">
            <div className="text-gray-400 mb-2">Final Score</div>
            <div className="text-6xl font-bold text-cyber-blue cyber-glow">{finalScore}</div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-dark-bg rounded">
              <div className="text-sm text-gray-400">Threat Level</div>
              <div className="text-2xl font-bold text-red-400">{Math.round(gameState.threatLevel)}</div>
            </div>
            <div className="text-center p-4 bg-dark-bg rounded">
              <div className="text-sm text-gray-400">Network</div>
              <div className="text-2xl font-bold text-green-400">{Math.round(gameState.networkIntegrity)}%</div>
            </div>
            <div className="text-center p-4 bg-dark-bg rounded">
              <div className="text-sm text-gray-400">Data Stolen</div>
              <div className="text-2xl font-bold text-yellow-400">{Math.round(gameState.dataStolen)}%</div>
            </div>
            <div className="text-center p-4 bg-dark-bg rounded">
              <div className="text-sm text-gray-400">Rounds</div>
              <div className="text-2xl font-bold text-cyan-400">{gameState.round - 1}</div>
            </div>
          </div>
        </div>
        
        {/* Save Status */}
        {saving && (
          <div className="text-center mb-4 text-yellow-400">💾 Saving score...</div>
        )}
        {scoreSaved && !saving && (
          <div className="text-center mb-4 text-green-400">✓ Score saved to leaderboard!</div>
        )}
        
        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button
            onClick={onPlayAgain}
            className="px-8 py-4 bg-cyber-blue text-dark-bg font-bold text-xl rounded-lg hover:bg-cyber-purple transition-all duration-300 transform hover:scale-105"
          >
            🔄 Play Again
          </button>
          <button
            onClick={onViewLeaderboard}
            className="px-8 py-4 bg-gray-700 text-white font-bold text-xl rounded-lg hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
          >
            🏆 View Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
}
