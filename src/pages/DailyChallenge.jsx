import React, { useState, useEffect } from 'react';
import { INITIAL_STATE, processRound } from '../game/gameEngine';
import { getGameActions, getSynergyDescription, getAvailableActions } from '../game/gameActions';
import { chooseAIAction } from '../game/gameAI';
import { playClickSound, playSuccessSound, playFailSound, playComboSound, playCounterSound, playThreatCriticalSound, playEnergyLowSound, initAudio } from '../game/soundEffects';
import ActionCard from '../components/ActionCard';
import ThreatMeter from '../components/ThreatMeter';
import BattleLog from '../components/BattleLog';
import MiniReward from '../components/MiniReward';
import QuickStats from '../components/QuickStats';
import { applyModifiersToActions, applyModifiersToGameState, validateChallengeCompletion } from '../game/dailyChallenges';
import { saveChallengeCompletion, getTodaysAverageScore } from '../firebase/dailyChallenges';

export default function DailyChallenge({ challenge, playerName, userId, onGameEnd, onQuit }) {
  // Apply challenge modifiers to actions
  const [gameActions] = useState(() => {
    const actions = getGameActions();
    return {
      hackerActions: applyModifiersToActions(actions.hackerActions, challenge.modifiers),
      defenderActions: applyModifiersToActions(actions.defenderActions, challenge.modifiers)
    };
  });
  
  // Apply modifiers to initial state
  const [gameState, setGameState] = useState(() => {
    // Get actions first
    const actions = getGameActions();
    const modifiedActions = {
      hackerActions: applyModifiersToActions(actions.hackerActions, challenge.modifiers),
      defenderActions: applyModifiersToActions(actions.defenderActions, challenge.modifiers)
    };
    
    const initial = {
      ...INITIAL_STATE,
      playerRole: challenge.role,
      playerName,
      userId,
      gameActions: modifiedActions,
      isDailyChallenge: true,
      challengeData: challenge,
      difficulty: 'normal'
    };
    
    // Apply modifiers (like starting energy)
    const modified = applyModifiersToGameState(initial, challenge.modifiers, challenge.role);
    
    // Ensure all values are initialized
    return {
      ...modified,
      energyHacker: modified.energyHacker || 100,
      energyDefender: modified.energyDefender || 100,
      networkIntegrity: modified.networkIntegrity || 100,
      threatLevel: modified.threatLevel || 50,
      dataStolen: modified.dataStolen || 0
    };
  });
  
  const [selectedAction, setSelectedAction] = useState(null);
  const [isThinking, setIsThinking] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [roundResult, setRoundResult] = useState(null);
  const [miniRewards, setMiniRewards] = useState([]);
  const [quickStats, setQuickStats] = useState(null);
  const [previousThreat, setPreviousThreat] = useState(gameState.threatLevel);
  const [minNetworkIntegrity, setMinNetworkIntegrity] = useState(100);
  
  const playerRole = challenge.role;
  const playerEnergy = playerRole === 'hacker' ? gameState.energyHacker : gameState.energyDefender;
  const playerCooldowns = playerRole === 'hacker' ? gameState.hackerCooldowns : gameState.defenderCooldowns;
  const playerMomentum = playerRole === 'hacker' ? gameState.hackerMomentum : gameState.defenderMomentum;
  const playerLastActions = playerRole === 'hacker' ? gameState.lastHackerActions : gameState.lastDefenderActions;
  const playerActions = playerRole === 'hacker' ? gameActions.hackerActions : gameActions.defenderActions;
  
  // Track minimum network integrity for Perfect Defense challenge
  useEffect(() => {
    const currentIntegrity = gameState.networkIntegrity || 100;
    if (currentIntegrity < minNetworkIntegrity) {
      setMinNetworkIntegrity(currentIntegrity);
    }
  }, [gameState.networkIntegrity, minNetworkIntegrity]);
  
  const potentialSynergy = selectedAction && playerLastActions.length > 0
    ? getSynergyDescription(selectedAction.id, playerLastActions[playerLastActions.length - 1])
    : null;
  
  const handleActionSelect = (action) => {
    if (isThinking || showResult) return;
    
    const onCooldown = (playerCooldowns[action.id] || 0) > 0;
    const hasEnergy = playerEnergy >= action.energyCost;
    if (onCooldown || !hasEnergy) return;
    
    playClickSound();
    setSelectedAction(action);
  };
  
  const handleActionDoubleClick = (action) => {
    if (isThinking || showResult) return;
    
    const onCooldown = (playerCooldowns[action.id] || 0) > 0;
    const hasEnergy = playerEnergy >= action.energyCost;
    if (onCooldown || !hasEnergy) return;
    
    playClickSound();
    setSelectedAction(action);
    setTimeout(() => handleConfirm(action), 100);
  };
  
  const handleConfirm = async (actionToUse = null) => {
    const actionToProcess = actionToUse || selectedAction;
    if (!actionToProcess || isThinking) return;
    
    initAudio();
    setIsThinking(true);
    
    setTimeout(async () => {
      try {
        const aiAction = chooseAIAction(gameState);
        if (!aiAction) {
          console.error('AI failed to choose action');
          setIsThinking(false);
          return;
        }
        
        const newState = processRound(gameState, actionToProcess, aiAction);
        const lastRound = newState.history[newState.history.length - 1];
        
        const rewards = [];
        if (lastRound.hackerSynergy || lastRound.defenderSynergy) {
          rewards.push({ type: 'combo', message: 'Combo!' });
        }
        if (Math.abs(newState.threatLevel - gameState.threatLevel) > 15) {
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
        
        setQuickStats({
          damage: Math.abs(lastRound.networkChange || 0),
          combo: lastRound.hackerSynergy?.name || lastRound.defenderSynergy?.name || null,
          countered: lastRound.hackerCountered,
          threatChange: Math.round(newState.threatLevel - gameState.threatLevel),
          energyUsed: actionToProcess.energyCost
        });
        
        if (rewards.length > 0) {
          setTimeout(() => {
            setMiniRewards(rewards);
          }, 500);
        }
      } catch (error) {
        console.error('Error processing round:', error);
        setIsThinking(false);
      }
    }, 800);
  };
  
  const handleResultClose = async () => {
    const isGameOver = gameState.gameOver;
    
    setShowResult(false);
    setRoundResult(null);
    setSelectedAction(null);
    
    if (isGameOver && userId) {
      // Validate challenge completion
      const modifiedGameState = { ...gameState, minNetworkIntegrity };
      const validation = validateChallengeCompletion(challenge, modifiedGameState);
      
      if (validation.success) {
        // Save completion
        const score = Math.round(gameState.playerScore * challenge.scoreMultiplier);
        await saveChallengeCompletion(userId, challenge.date, score, challenge);
        
        // Get average score
        const avgScore = await getTodaysAverageScore();
        
        setTimeout(() => {
          onGameEnd({ ...gameState, isDailyChallenge: true, challengeCompleted: true, averageScore: avgScore });
        }, 300);
      } else {
        // Failed challenge
        setTimeout(() => {
          onGameEnd({ ...gameState, isDailyChallenge: true, challengeCompleted: false, failureReason: validation.reason });
        }, 300);
      }
    } else if (isGameOver) {
      setTimeout(() => {
        onGameEnd({ ...gameState, isDailyChallenge: true, challengeCompleted: false });
      }, 300);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-bg to-dark-card p-3 md:p-6">
      <div className="h-20"></div>
      
      <div className="max-w-7xl mx-auto">
        {/* Challenge Header */}
        <div className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 border-2 border-yellow-500 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-3xl">{challenge.icon}</span>
                <h1 className="text-xl md:text-2xl font-bold text-yellow-400">
                  Daily Challenge: {challenge.name}
                </h1>
              </div>
              <p className="text-sm text-gray-300">{challenge.description}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-400">×{challenge.scoreMultiplier}</div>
              <div className="text-xs text-gray-400">Score Multiplier</div>
            </div>
          </div>
        </div>
        
        {/* Game Header */}
        <div className="bg-dark-card border border-gray-600 rounded-lg p-3 md:p-4 mb-3 md:mb-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div>
              <h2 className="text-xl font-bold text-cyber-blue">Round {gameState.round}</h2>
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
        <ThreatMeter 
          value={gameState.threatLevel || 50}
          previousValue={previousThreat || 50}
        />
        
        {/* Status Bars */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-3 md:mb-4">
          <StatusBar label="🛡️ Network" value={gameState.networkIntegrity || 100} color="health" />
          <StatusBar label="🎯 Data" value={gameState.dataStolen || 0} color="danger" />
          <StatusBar label="⚡ You" value={playerEnergy || 100} color="energy" />
          <StatusBar label="⚡ AI" value={(playerRole === 'hacker' ? gameState.energyDefender : gameState.energyHacker) || 100} color="energy" />
        </div>
        
        {/* Energy Display */}
        <div className="grid grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4">
          <div className="bg-dark-card border border-gray-600 rounded-lg p-3 md:p-4">
            <div className="text-xs md:text-sm text-gray-400 mb-1">Your Energy</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-700 rounded-full h-3 md:h-4 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                  style={{ width: `${Math.max(0, Math.min(100, playerEnergy || 0))}%` }}
                />
              </div>
              <div className="text-lg md:text-xl font-bold text-cyan-400 min-w-[3rem] text-right">
                {Math.round(playerEnergy || 0)}
              </div>
            </div>
          </div>
          
          <div className="bg-dark-card border border-gray-600 rounded-lg p-3 md:p-4">
            <div className="text-xs md:text-sm text-gray-400 mb-1">AI Energy</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-700 rounded-full h-3 md:h-4 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-500"
                  style={{ width: `${Math.max(0, Math.min(100, (playerRole === 'hacker' ? gameState.energyDefender : gameState.energyHacker) || 0))}%` }}
                />
              </div>
              <div className="text-lg md:text-xl font-bold text-red-400 min-w-[3rem] text-right">
                {Math.round((playerRole === 'hacker' ? gameState.energyDefender : gameState.energyHacker) || 0)}
              </div>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="bg-dark-card border border-gray-600 rounded-lg p-3 md:p-4 mb-3 md:mb-4">
          <h2 className="text-lg md:text-xl font-bold text-cyber-blue mb-3 md:mb-4">Your Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
            {playerActions.map(action => (
              <ActionCard
                key={action.id}
                action={action}
                isSelected={selectedAction?.id === action.id}
                onSelect={handleActionSelect}
                onDoubleClick={handleActionDoubleClick}
                cooldown={playerCooldowns[action.id] || 0}
                energy={playerEnergy}
                momentum={playerMomentum}
                hasSynergy={potentialSynergy && selectedAction?.id === action.id}
                synergyName={potentialSynergy?.name}
              />
            ))}
          </div>
          
          {selectedAction && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => handleConfirm()}
                disabled={isThinking}
                className="px-8 py-3 bg-cyber-blue text-dark-bg font-bold rounded-lg hover:bg-cyber-purple transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {isThinking ? 'Processing...' : 'Confirm Action'}
              </button>
            </div>
          )}
        </div>
        
        {/* Battle Log */}
        <BattleLog history={gameState.history} playerRole={playerRole} />
        
        {/* Quit Button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={onQuit}
            className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Quit Challenge
          </button>
        </div>
      </div>
      
      {/* Round Result Modal */}
      {showResult && roundResult && (
        <RoundResultModal result={roundResult} playerRole={playerRole} onClose={handleResultClose} />
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
  const percentage = Math.max(0, Math.min(100, value || 0));
  
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
        <span className="text-white font-bold">{Math.round(value || 0)}</span>
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
          
          <div className={`p-4 rounded-lg ${aiSuccess ? 'bg-green-900 bg-opacity-30 border border-green-500' : 'bg-red-900 bg-opacity-30 border border-red-500'}`}>
            <div className="font-bold text-white mb-1">
              AI Action: {playerRole === 'hacker' ? result.defenderAction : result.hackerAction}
            </div>
            <div className={aiSuccess ? 'text-green-400' : 'text-red-400'}>
              {aiSuccess ? '✅ SUCCESS' : '❌ FAILED'} ({playerRole === 'hacker' ? result.defenderChance : result.hackerChance}%)
            </div>
            {aiSynergy && (
              <div className="text-purple-400 text-sm mt-1">⚡ COMBO: {aiSynergy.name}!</div>
            )}
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
