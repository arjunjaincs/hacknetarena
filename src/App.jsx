/**
 * Main App Component
 * Manages navigation between different game screens
 */

import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Game from './pages/Game';
import DailyChallenge from './pages/DailyChallenge';
import Results from './pages/Results';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Guide from './pages/Guide';
import CyberBackground3D from './components/CyberBackground3D';
import CyberBackgroundSubtle from './components/CyberBackgroundSubtle';
import Login from './components/Login';
import Navbar from './components/Navbar';
import { isFirebaseEnabled, auth, database } from './firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, get } from 'firebase/database';

function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [playerRole, setPlayerRole] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [gameState, setGameState] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [dailyChallengeData, setDailyChallengeData] = useState(null);
  
  // Check Firebase Auth state (works across devices)
  useEffect(() => {
    if (!isFirebaseEnabled || !auth) return;
    
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        console.log('User authenticated:', user.uid);
        
        // Fetch username from database
        let username = user.email?.split('@')[0] || 'User';
        if (database) {
          try {
            const userRef = ref(database, `users/${user.uid}`);
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
              username = snapshot.val().username || username;
            }
          } catch (err) {
            console.warn('Could not fetch username:', err);
          }
        }
        
        setPlayerName(username);
        setUserId(user.uid);
        setUserEmail(user.email || '');
        setIsLoggedIn(true);
        setShowLogin(false);
      } else {
        // User is signed out
        console.log('No user authenticated');
        setIsLoggedIn(false);
        setShowLogin(true);
      }
    });
    
    // Cleanup subscription
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [currentScreen]);

  const handleLoginSuccess = (username, uid, email = '') => {
    setPlayerName(username);
    setUserId(uid);
    setUserEmail(email);
    setIsLoggedIn(true);
    setShowLogin(false);
    // Firebase Auth handles persistence automatically
  };
  
  const handleStartGame = (role, name, difficulty = 'normal') => {
    setPlayerRole(role);
    setPlayerName(name);
    setGameState({ difficulty }); // Store difficulty for Game component
    setCurrentScreen('game');
  };
  
  const handleGameEnd = (finalGameState) => {
    setGameState(finalGameState);
    setCurrentScreen('results');
  };
  
  const handlePlayAgain = () => {
    setCurrentScreen('home');
    setPlayerRole(null);
    setPlayerName('');
    setGameState(null);
  };
  
  const handleViewLeaderboard = () => {
    setCurrentScreen('leaderboard');
  };
  
  const handleBackToHome = () => {
    setCurrentScreen('home');
  };
  
  const handleViewProfile = () => {
    setCurrentScreen('profile');
  };
  
  const handleViewGuide = () => {
    setCurrentScreen('guide');
  };
  
  const handleStartDailyChallenge = (challenge) => {
    setDailyChallengeData(challenge);
    setPlayerRole(challenge.role);
    setCurrentScreen('dailyChallenge');
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserId(null);
    setUserEmail('');
    setPlayerName('');
    setCurrentScreen('home');
    setShowLogin(true);
    // Firebase Auth state will be cleared by UserProfile component
  };
  
  return (
    <div className="min-h-screen relative">
      {/* 3D Cyber Background - Full on home, subtle on other pages */}
      {currentScreen === 'home' ? (
        <CyberBackground3D />
      ) : (
        <CyberBackgroundSubtle blur={true} />
      )}
      
      {/* Animated cyber grid */}
      <div className="cyber-bg"></div>
      
      {/* Login Modal */}
      {showLogin && <Login onLoginSuccess={handleLoginSuccess} />}
      
      {/* Navbar with Profile */}
      <Navbar
        isLoggedIn={isLoggedIn}
        playerName={playerName}
        userEmail={userEmail}
        userId={userId}
        onLogout={handleLogout}
        onViewProfile={handleViewProfile}
        onViewGuide={handleViewGuide}
        onViewLeaderboard={handleViewLeaderboard}
        currentScreen={currentScreen}
        onBack={currentScreen === 'game' ? handleBackToHome : handleBackToHome}
      />
      
      {/* Main content with relative positioning */}
      <div className="relative z-10">
        {currentScreen === 'home' && (
          <Home 
            onStartGame={handleStartGame}
            onStartDailyChallenge={handleStartDailyChallenge}
            userId={userId}
            isLoggedIn={isLoggedIn}
            playerName={playerName}
          />
        )}
        
        {currentScreen === 'game' && (
          <Game 
            playerRole={playerRole}
            playerName={playerName}
            userId={userId}
            difficulty={gameState?.difficulty || 'normal'}
            onGameEnd={handleGameEnd}
            onQuit={handleBackToHome}
          />
        )}
        
        {currentScreen === 'dailyChallenge' && dailyChallengeData && (
          <DailyChallenge
            challenge={dailyChallengeData}
            playerName={playerName || 'Player'}
            userId={userId}
            onGameEnd={handleGameEnd}
            onQuit={handleBackToHome}
          />
        )}
        
        {currentScreen === 'results' && gameState && (
          <Results 
            gameState={gameState}
            onPlayAgain={handlePlayAgain}
            onViewLeaderboard={handleViewLeaderboard}
            newAchievements={gameState.newAchievements || []}
          />
        )}
        
        {currentScreen === 'leaderboard' && (
          <Leaderboard onBack={handleBackToHome} currentUserId={userId} />
        )}
        
        {currentScreen === 'profile' && (
          <Profile 
            userId={userId}
            playerName={playerName}
            onBack={handleBackToHome}
          />
        )}
        
        {currentScreen === 'guide' && (
          <Guide onBack={handleBackToHome} />
        )}
      </div>
    </div>
  );
}

export default App;
