import React, { useState } from 'react';
import { auth, database } from '../firebase/config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set, get } from 'firebase/database';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        // Sign up - create account and store username
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userId = userCredential.user.uid;
        const displayName = username || email.split('@')[0];
        
        // Store username in database
        if (database) {
          const userRef = ref(database, `users/${userId}`);
          await set(userRef, {
            username: displayName,
            email: email,
            createdAt: Date.now()
          });
        }
        
        onLoginSuccess(displayName, userId, email);
      } else {
        // Sign in - fetch username from database
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userId = userCredential.user.uid;
        
        let displayName = email.split('@')[0]; // Fallback
        
        // Try to fetch username from database
        if (database) {
          try {
            const userRef = ref(database, `users/${userId}`);
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
              displayName = snapshot.val().username || displayName;
            }
          } catch (err) {
            console.warn('Could not fetch username:', err);
          }
        }
        
        onLoginSuccess(displayName, userId, email);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
      <div className="bg-dark-card border-2 border-cyber-blue rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
        <h2 className="text-3xl font-bold text-cyber-blue mb-2 text-center">
          {isSignUp ? '🎮 Create Account' : '🔐 Login'}
        </h2>
        <p className="text-gray-400 text-center mb-6">
          {isSignUp ? 'Join HackNet Arena' : 'Welcome back, warrior'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-gray-300 mb-2 text-sm">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="CyberWarrior"
                className="w-full px-4 py-3 bg-dark-bg border-2 border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyber-blue"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-gray-300 mb-2 text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="warrior@hacknet.com"
              className="w-full px-4 py-3 bg-dark-bg border-2 border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyber-blue"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 text-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-dark-bg border-2 border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyber-blue"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="bg-red-900 bg-opacity-30 border border-red-500 text-red-300 px-4 py-2 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-cyber-blue text-dark-bg font-bold rounded-lg hover:bg-cyber-purple transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Processing...' : (isSignUp ? '🚀 Create Account' : '🔓 Login')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            className="text-cyber-blue hover:text-cyber-purple transition-colors"
          >
            {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => onLoginSuccess('Guest', null)}
            className="text-gray-400 hover:text-gray-300 transition-colors text-sm"
          >
            Continue as Guest (no leaderboard)
          </button>
        </div>
      </div>
    </div>
  );
}
