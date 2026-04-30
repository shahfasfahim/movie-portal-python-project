import { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  GithubAuthProvider
} from 'firebase/auth';
import { auth } from '../config/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Helper function to convert Firebase errors to user-friendly messages
const getFriendlyErrorMessage = (error) => {
  const errorCode = error.code || '';
  const errorMessage = error.message || '';
  
  console.log('[Auth] Processing error - Code:', errorCode, 'Message:', errorMessage);
  
  switch (errorCode) {
    case 'auth/invalid-api-key':
    case 'auth/api-key-not-valid':
      return 'Authentication service is not properly configured. Please check your Firebase API key.';
    case 'auth/invalid-project-id':
      return 'Invalid Firebase project configuration. Please check your project ID.';
    case 'auth/project-not-found':
      return 'Firebase project not found. Please check your project configuration.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please sign up first.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-credential':
      return 'Invalid login credentials. Please check your email and password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in was cancelled.';
    case 'auth/popup-blocked':
      return 'Pop-up was blocked by your browser. Please allow pop-ups and try again.';
    case 'auth/cancelled-popup-request':
      return 'Sign-in was cancelled.';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with the same email but different sign-in credentials.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    default:
      console.warn('[Auth] Unknown error code:', errorCode, 'Full error:', error);
      return `Login failed: ${errorMessage || 'Please try again.'}`;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!auth) {
      console.warn('[Auth] Firebase not initialized. Auth features disabled.');
      setError('Firebase authentication is not configured. Please check your Firebase settings.');
      setLoading(false);
      return;
    }
    
    console.log('[Auth] Setting up auth state listener');
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('[Auth] Auth state changed:', currentUser ? `User: ${currentUser.email}` : 'No user');
      setUser(currentUser);
      setLoading(false);
    }, (error) => {
      console.error('[Auth] Auth state listener error:', error);
      setError('Authentication service error. Please try refreshing the page.');
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signUp = async (email, password, displayName) => {
    if (!auth) {
      const err = new Error('Firebase authentication is not configured. Please set up Firebase credentials.');
      setError(err.message);
      throw err;
    }
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName });
      setUser(result.user);
      return result.user;
    } catch (err) {
      const friendlyMessage = getFriendlyErrorMessage(err);
      setError(friendlyMessage);
      throw new Error(friendlyMessage);
    }
  };

  const login = async (email, password) => {
    if (!auth) {
      const err = new Error('Firebase authentication is not configured. Please set up Firebase credentials.');
      console.error('[Auth] Login failed: Firebase not initialized');
      setError(err.message);
      throw err;
    }
    try {
      setError(null);
      console.log('[Auth] Attempting login for:', email);
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('[Auth] Login successful for user:', result.user.email);
      setUser(result.user);
      return result.user;
    } catch (err) {
      console.error('[Auth] Login failed:', err.code, err.message);
      const friendlyMessage = getFriendlyErrorMessage(err);
      console.log('[Auth] Friendly error message:', friendlyMessage);
      setError(friendlyMessage);
      throw new Error(friendlyMessage);
    }
  };

  const googleSignIn = async () => {
    if (!auth) {
      const err = new Error('Firebase authentication is not configured. Please set up Firebase credentials.');
      console.error('[Auth] Google sign-in failed: Firebase not initialized');
      setError(err.message);
      throw err;
    }
    try {
      setError(null);
      console.log('[Auth] Attempting Google sign-in');
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log('[Auth] Google sign-in successful for user:', result.user.email);
      setUser(result.user);
      return result.user;
    } catch (err) {
      console.error('[Auth] Google sign-in failed:', err.code, err.message);
      const friendlyMessage = getFriendlyErrorMessage(err);
      console.log('[Auth] Friendly error message:', friendlyMessage);
      setError(friendlyMessage);
      throw new Error(friendlyMessage);
    }
  };

  const githubSignIn = async () => {
    if (!auth) {
      const err = new Error('Firebase authentication is not configured. Please set up Firebase credentials.');
      console.error('[Auth] GitHub sign-in failed: Firebase not initialized');
      setError(err.message);
      throw err;
    }
    try {
      setError(null);
      console.log('[Auth] Attempting GitHub sign-in');
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log('[Auth] GitHub sign-in successful for user:', result.user.email);
      setUser(result.user);
      return result.user;
    } catch (err) {
      console.error('[Auth] GitHub sign-in failed:', err.code, err.message);
      const friendlyMessage = getFriendlyErrorMessage(err);
      console.log('[Auth] Friendly error message:', friendlyMessage);
      setError(friendlyMessage);
      throw new Error(friendlyMessage);
    }
  };

  const logout = async () => {
    if (!auth) {
      console.warn('[Auth] Firebase not configured, skipping logout.');
      return;
    }
    try {
      setError(null);
      await signOut(auth);
      setUser(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, signUp, login, googleSignIn, githubSignIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};