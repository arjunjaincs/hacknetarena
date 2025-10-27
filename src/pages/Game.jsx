import React, { useState, useEffect } from 'react';
import { INITIAL_STATE, processRound } from '../game/gameEngine';
import { getGameActions, getSynergyDescription, getAvailableActions } from '../game/gameActionsExpanded';
import { chooseAIAction } from '../game/gameAI';
import { playClickSound, playSuccessSound, playFailSound, playComboSound, playCounterSound, playThreatCriticalSound, playEnergyLowSound, initAudio } from '../game/soundEffects';
import ActionCard from '../components/ActionCard';
import ThreatMeter from '../components/ThreatMeter';
import BattleLog from '../components/BattleLog';
import MiniReward from '../components/MiniReward';
import QuickStats from '../components/QuickStats';

export default function Game({ playerRole, playerName, userId, onGameEnd, onQuit }) {
  // Generate random action set for this game
  const [gameActions] = useState(() => getGameActions());
  
  const [gameState, setGameState] = useState({
    ...INITIAL_STATE,
    playerRole,
    playerName,
    userId,
    gameActions // Store in state for AI and engine
  });
  
  const [selectedAction, setSelectedAction] = useState(null);
  const [isThinking, setIsThinking] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [roundResult, setRoundResult] = useState(null);
  const [miniRewards, setMiniRewards] = useState([]);
  const [quickStats, setQuickStats] = useState(null);
  const [previousThreat, setPreviousThreat] = useState(gameState.threatLevel);
  
  // Get player's info
  const playerEnergy = playerRole === 'hacker' ? gameState.energyHacker : gameState.energyDefender;
  const playerCooldowns = playerRole === 'hacker' ? gameState.hackerCooldowns : gameState.defenderCooldowns;
  const playerMomentum = playerRole === 'hacker' ? gameState.hackerMomentum : gameState.defenderMomentum;
  const playerLastActions = playerRole === 'hacker' ? gameState.lastHackerActions : gameState.lastDefenderActions;
  const playerActions = playerRole === 'hacker' ? gameActions.hackerActions : gameActions.defenderActions;
  
  // Check for potential synergy
  const potentialSynergy = selectedAction && playerLastActions.length > 0
    ? getSynergyDescription(selectedAction.id, playerLastActions[playerLastActions.length - 1])
    : null;
  
  // Handle action selection
  const handleActionSelect = (action) => {
    if (isThinking || showResult) return;
    
    // Check if action is available
    const onCooldown = (playerCooldowns[action.id] || 0) > 0;
    const hasEnergy = playerEnergy >= action.energyCost;
    if (onCooldown || !hasEnergy) return;
    
    playClickSound();
    setSelectedAction(action);
  };
  
  // Handle double-click (auto-submit)
  const handleActionDoubleClick = (action) => {
    if (isThinking || showResult) return;
    
    // Check if action is available
    const onCooldown = (playerCooldowns[action.id] || 0) > 0;
    const hasEnergy = playerEnergy >= action.energyCost;
    if (onCooldown || !hasEnergy) return;
    
    playClickSound();
    setSelectedAction(action);
    setTimeout(() => handleConfirm(action), 100);
  };
  
  // Handle action confirmation
  const handleConfirm = (actionToUse = null) => {
    // Get the action - either passed directly or from state
    const actionToProcess = actionToUse || selectedAction;
    
    // Validation
    if (!actionToProcess) {
      console.error('No action selected');
      return;
    }
    if (isThinking) {
      console.warn('Already thinking');
      return;
    }
    
    console.log('Processing action:', actionToProcess.name);
    
    playClickSound();
    setIsThinking(true);
    
    // Thinking animation (800-1200ms)
    const thinkingTime = 800 + Math.random() * 400;
    
    setTimeout(() => {
      try {
        // AI picks action
        const aiAction = chooseAIAction(gameState);
        
        if (!aiAction) {
          console.error('AI failed to choose action');
          setIsThinking(false);
          return;
        }
        
        // Process round with the action we validated earlier
        console.log('Processing round with:', actionToProcess.name, 'vs', aiAction.name);
        const newState = processRound(gameState, actionToProcess, aiAction);
        
        // Get last round result
        const lastRound = newState.history[newState.history.length - 1];
        
        // Play sound
        const playerSuccess = playerRole === 'hacker' ? lastRound.hackerSuccess : lastRound.defenderSuccess;
        if (playerSuccess) {
          playSuccessSound();
        } else {
          playFailSound();
        }
        
        // Check for mini-rewards
        const rewards = [];
        if (playerRole === 'hacker' && lastRound.hackerSynergy) {
          rewards.push({ type: 'combo', message: lastRound.hackerSynergy.name });
        }
        if (playerRole === 'defender' && lastRound.defenderSynergy) {
          rewards.push({ type: 'combo', message: lastRound.defenderSynergy.name });
        }
        if (lastRound.hackerCountered) {
          rewards.push({ type: 'counter', message: 'Counter Successful!' });
        }
        if (Math.abs(newState.threatLevel - gameState.threatLevel) >= 15) {
          rewards.push({ type: 'threat', message: 'Threat Spike!' });
        }
        const newMomentum = playerRole === 'hacker' ? newState.hackerMomentum : newState.defenderMomentum;
        const oldMomentum = playerRole === 'hacker' ? gameState.hackerMomentum : gameState.defenderMomentum;
        if (newMomentum > oldMomentum && newMomentum >= 3) {
          rewards.push({ type: 'momentum', message: `${newMomentum}x Momentum!` });
        }
        
        setPreviousThreat(gameState.threatLevel);
        setGameState(newState);
        setRoundResult(lastRound);
        setShowResult(true);
        setIsThinking(false);
        setSelectedAction(null);
        
        // Play enhanced sounds
        if (lastRound.hackerSynergy || lastRound.defenderSynergy) {
          playComboSound();
        }
        if (lastRound.hackerCountered) {
          playCounterSound();
        }
        if (newState.threatLevel >= 80 && gameState.threatLevel < 80) {
          playThreatCriticalSound();
        }
        const newPlayerEnergy = playerRole === 'hacker' ? newState.energyHacker : newState.energyDefender;
        if (newPlayerEnergy < 15 && newPlayerEnergy > 0) {
          playEnergyLowSound();
        }
        
        // Show quick stats
        setQuickStats({
          damage: Math.abs(lastRound.networkChange || 0),
          combo: lastRound.hackerSynergy?.name || lastRound.defenderSynergy?.name || null,
          countered: lastRound.hackerCountered,
          threatChange: Math.round(newState.threatLevel - gameState.threatLevel),
          energyUsed: actionToProcess.energyCost
        });
        
        // Show mini-rewards after a delay
        if (rewards.length > 0) {
          setTimeout(() => {
            setMiniRewards(rewards);
          }, 500);
        }
      } catch (error) {
        console.error('Error processing round:', error);
        console.error('Error details:', {
          action: actionToProcess,
          gameState: gameState,
          error: error.message,
          stack: error.stack
        });
        setIsThinking(false);
        setSelectedAction(null);
        alert('Error: ' + error.message + '. The game state has been reset. Please try again.');
      }
    }, thinkingTime);
  };
  
  // Handle result close
  const handleResultClose = () => {
    // Check if game is over BEFORE closing modal
    const isGameOver = gameState.gameOver;
    
    setShowResult(false);
    setRoundResult(null);
    setSelectedAction(null); // Clear selection for next round
    
    // If game is over, go to results screen
    if (isGameOver) {
      setTimeout(() => {
        onGameEnd(gameState);
      }, 300);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-bg to-dark-card p-3 md:p-6">
      {/* Spacer for navbar */}
      <div className="h-20"></div>
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-dark-card border border-gray-600 rounded-lg p-3 md:p-4 mb-3 md:mb-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-cyber-blue">
                Round {gameState.round}
              </h1>
              <p className="text-sm text-gray-400">
                {playerRole === 'hacker' ? '🎯 Hacker' : '🛡️ Defender'}: {playerName}
              </p>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-xs text-gray-400">Momentum</div>
                <div className="text-lg md:text-2xl font-bold text-cyan-400">
                  {playerMomentum} / 5
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-400">Combos</div>
                <div className="text-lg md:text-2xl font-bold text-purple-400">
                  {gameState.combosEarned}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Threat Meter */}
        <ThreatMeter value={gameState.threatLevel} previousValue={previousThreat} />
        
        {/* Status Bars */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-3 md:mb-4">
          <StatusBar label="🛡️ Network" value={gameState.networkIntegrity} color="health" />
          <StatusBar label="🎯 Data" value={gameState.dataStolen} color="danger" />
          <StatusBar label="⚡ You" value={playerEnergy} color="energy" />
          <StatusBar label="⚡ AI" value={playerRole === 'hacker' ? gameState.energyDefender : gameState.energyHacker} color="energy" />
        </div>
        
        {/* Action Selection */}
        <div className="bg-dark-card border border-gray-600 rounded-lg p-4 md:p-6 mb-3 md:mb-4">
          <h2 className="text-lg md:text-xl font-bold text-cyber-blue mb-3 md:mb-4 text-center">
            {isThinking ? '🤔 AI is thinking...' : '🎮 Choose Your Action'}
          </h2>
          
          {/* Synergy Indicator */}
          {potentialSynergy && !isThinking && !showResult && (
            <div className="mb-4 p-3 bg-purple-900 bg-opacity-30 border border-purple-500 rounded-lg text-center animate-pulse">
              <div className="text-purple-400 font-bold">
                ⚡ COMBO AVAILABLE: {potentialSynergy.name}
              </div>
              <div className="text-xs text-purple-300">+15% success chance & +{potentialSynergy.bonus} bonus damage!</div>
            </div>
          )}
          
          {/* Action Cards - 3 per row, centered */}
          <div className="flex justify-center mb-4 md:mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-5xl">
              {playerActions.map((action) => {
                // Check if action is available
                const onCooldown = (playerCooldowns[action.id] || 0) > 0;
                const hasEnergy = playerEnergy >= action.energyCost;
                const available = !onCooldown && hasEnergy;
                
                const cooldown = playerCooldowns[action.id] || 0;
                const hasSynergy = playerLastActions.length > 0 && 
                  getSynergyDescription(action.id, playerLastActions[playerLastActions.length - 1]);
                
                return (
                  <ActionCard
                    key={action.id}
                    action={action}
                    onSelect={handleActionSelect}
                    onDoubleClick={handleActionDoubleClick}
                    disabled={isThinking || showResult || !available}
                    selected={selectedAction?.id === action.id}
                    cooldown={cooldown}
                    energy={playerEnergy}
                    hasSynergy={!!hasSynergy}
                    synergyName={hasSynergy ? hasSynergy.name : null}
                  />
                );
              })}
            </div>
          </div>
          
          {/* Confirm Button */}
          {selectedAction && !isThinking && !showResult && (
            <div className="text-center animate-fade-in">
              <button
                onClick={() => handleConfirm(selectedAction)}
                className="px-6 md:px-8 py-3 bg-cyber-blue text-dark-bg font-bold text-base md:text-lg rounded-lg hover:bg-cyber-purple transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                ✓ Confirm: {selectedAction.name}
              </button>
            </div>
          )}
          
          {/* Thinking Animation */}
          {isThinking && (
            <div className="text-center">
              <div className="inline-block px-6 md:px-8 py-3 bg-gray-700 text-white font-bold text-base md:text-lg rounded-lg animate-pulse">
                ⏳ Processing Round...
              </div>
            </div>
          )}
        </div>
        
        {/* Battle Log */}
        <BattleLog history={gameState.history} playerRole={playerRole} />
      </div>
      
      {/* Round Result Modal */}
      {showResult && roundResult && (
        <RoundResultModal 
          result={roundResult} 
          playerRole={playerRole}
          onClose={handleResultClose}
        />
      )}
      
      {/* Mini Rewards */}
      {miniRewards.map((reward, index) => (
        <MiniReward
          key={index}
          type={reward.type}
          message={reward.message}
          onComplete={() => {
            setMiniRewards(prev => prev.filter((_, i) => i !== index));
          }}
        />
      ))}
      
      {/* Quick Stats Panel */}
      {quickStats && (
        <QuickStats 
          stats={quickStats} 
          onClose={() => setQuickStats(null)} 
        />
      )}
    </div>
  );
}

// Status Bar Component
function StatusBar({ label, value, color }) {
  const percentage = Math.max(0, Math.min(100, value));
  
  let barColor = 'bg-cyber-blue';
  if (color === 'health') {
    barColor = percentage > 60 ? 'bg-green-500' : percentage > 30 ? 'bg-yellow-500' : 'bg-red-500';
  } else if (color === 'danger') {
    barColor = percentage > 60 ? 'bg-red-500' : percentage > 30 ? 'bg-yellow-500' : 'bg-green-500';
  } else if (color === 'energy') {
    barColor = percentage > 60 ? 'bg-yellow-400' : percentage > 30 ? 'bg-orange-500' : 'bg-red-600';
  }
  
  return (
    <div className="bg-dark-card border border-gray-600 rounded-lg p-2 md:p-3">
      <div className="flex justify-between mb-1 text-xs md:text-sm">
        <span className="text-gray-300">{label}</span>
        <span className="text-white font-bold">{Math.round(value)}</span>
      </div>
      <div className="w-full h-2 md:h-3 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Round Result Modal
function RoundResultModal({ result, playerRole, onClose }) {
  const playerSuccess = playerRole === 'hacker' ? result.hackerSuccess : result.defenderSuccess;
  const aiSuccess = playerRole === 'hacker' ? result.defenderSuccess : result.hackerSuccess;
  const playerSynergy = playerRole === 'hacker' ? result.hackerSynergy : result.defenderSynergy;
  const aiSynergy = playerRole === 'hacker' ? result.defenderSynergy : result.hackerSynergy;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 animate-fade-in p-4">
      <div className="bg-dark-card border-2 border-cyber-blue rounded-lg p-6 md:p-8 max-w-md w-full shadow-2xl">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-4">
          Round {result.round} Results
        </h2>
        
        <div className="space-y-4 mb-6">
          {/* Player Result */}
          <div className={`p-4 rounded-lg ${playerSuccess ? 'bg-green-900 bg-opacity-30 border border-green-500' : 'bg-red-900 bg-opacity-30 border border-red-500'}`}>
            <div className="font-bold text-white mb-1">
              Your Action: {playerRole === 'hacker' ? result.hackerAction : result.defenderAction}
            </div>
            <div className={playerSuccess ? 'text-green-400' : 'text-red-400'}>
              {playerSuccess ? '✅ SUCCESS' : '❌ FAILED'} ({playerRole === 'hacker' ? result.hackerChance : result.defenderChance}%)
            </div>
            {result.hackerCountered && playerRole === 'hacker' && (
              <div className="text-yellow-400 text-sm mt-1">⚠️ Countered! (-40%)</div>
            )}
            {playerSynergy && (
              <div className="text-purple-400 text-sm mt-1">⚡ COMBO: {playerSynergy.name}!</div>
            )}
          </div>
          
          {/* AI Result */}
          <div className={`p-4 rounded-lg ${aiSuccess ? 'bg-red-900 bg-opacity-30 border border-red-500' : 'bg-green-900 bg-opacity-30 border border-green-500'}`}>
            <div className="font-bold text-white mb-1">
              AI Action: {playerRole === 'hacker' ? result.defenderAction : result.hackerAction}
            </div>
            <div className={aiSuccess ? 'text-red-400' : 'text-green-400'}>
              {aiSuccess ? '✅ SUCCESS' : '❌ FAILED'} ({playerRole === 'hacker' ? result.defenderChance : result.hackerChance}%)
            </div>
            {aiSynergy && (
              <div className="text-purple-400 text-sm mt-1">⚡ COMBO: {aiSynergy.name}!</div>
            )}
          </div>
          
          {/* Stats */}
          <div className="bg-dark-bg p-4 rounded-lg text-sm text-gray-300 space-y-1">
            <div>🎯 Threat: {result.threatLevel}</div>
            <div>🛡️ Network: {result.networkIntegrity}</div>
            <div>📊 Data: {result.dataStolen}</div>
            <div>⚡ Energy: {result.energyHacker} / {result.energyDefender}</div>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="w-full px-4 py-3 bg-cyber-blue text-dark-bg font-bold rounded-lg hover:bg-cyber-purple transition-all duration-300"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
