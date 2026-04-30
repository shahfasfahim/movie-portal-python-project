import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const sanitizeEnv = (value) => {
  if (!value) return '';
  return value.replace(/^\"|\"$/g, '').trim();
};

const projectId = sanitizeEnv(import.meta.env.VITE_FIREBASE_PROJECT_ID);
const storageBucket = sanitizeEnv(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET) || `${projectId}.appspot.com`;

const firebaseConfig = {
  apiKey: sanitizeEnv(import.meta.env.VITE_FIREBASE_API_KEY) || 'placeholder-api-key',
  authDomain: sanitizeEnv(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN) || 'placeholder.firebaseapp.com',
  projectId: projectId || 'placeholder-project',
  storageBucket,
  messagingSenderId: sanitizeEnv(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID) || 'placeholder-id',
  appId: sanitizeEnv(import.meta.env.VITE_FIREBASE_APP_ID) || 'placeholder-app-id',
};

// Debug logging
console.log('[Firebase] ===== Firebase Configuration Debug =====');
console.log('[Firebase] Environment variables loaded:');
console.log('- VITE_FIREBASE_API_KEY:', import.meta.env.VITE_FIREBASE_API_KEY ? 'Set (ends with: ' + import.meta.env.VITE_FIREBASE_API_KEY.slice(-4) + ')' : 'NOT SET');
console.log('- VITE_FIREBASE_AUTH_DOMAIN:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'NOT SET');
console.log('- VITE_FIREBASE_PROJECT_ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID || 'NOT SET');
console.log('- VITE_FIREBASE_STORAGE_BUCKET:', import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'NOT SET');
console.log('- VITE_FIREBASE_MESSAGING_SENDER_ID:', import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'NOT SET');
console.log('- VITE_FIREBASE_APP_ID:', import.meta.env.VITE_FIREBASE_APP_ID || 'NOT SET');

// Check if using placeholder values
const hasValidConfig = 
  firebaseConfig.apiKey !== 'placeholder-api-key' &&
  firebaseConfig.authDomain !== 'placeholder.firebaseapp.com' &&
  firebaseConfig.projectId !== 'placeholder-project';

console.log('[Firebase] Has valid config:', hasValidConfig);
console.log('[Firebase] Firebase config object:', {
  apiKey: firebaseConfig.apiKey ? '***' + firebaseConfig.apiKey.slice(-4) : 'MISSING',
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId
});

let app;
let auth = null;

try {
  console.log('[Firebase] Attempting to initialize Firebase App...');
  app = initializeApp(firebaseConfig);
  console.log('[Firebase] ✓ Firebase App initialized successfully');
  
  console.log('[Firebase] Attempting to initialize Auth service...');
  auth = getAuth(app);
  console.log('[Firebase] ✓ Auth service initialized successfully');
  console.log('[Firebase] ===== Firebase Ready =====');
  
} catch (error) {
  console.error('[Firebase] ✗ INITIALIZATION FAILED');
  console.error('[Firebase] Error code:', error.code);
  console.error('[Firebase] Error message:', error.message);
  console.error('[Firebase] Full error:', error);
  
  console.error('[Firebase]');
  console.error('[Firebase] TROUBLESHOOTING - To fix "auth/api-key-not-valid" error:');
  console.error('[Firebase]');
  console.error('[Firebase] 1. Go to https://console.firebase.google.com/');
  console.error('[Firebase] 2. Select your project: cineflix-5fb4a');
  console.error('[Firebase] 3. Go to Project Settings > General');
  console.error('[Firebase] 4. Verify your Web App is created');
  console.error('[Firebase] 5. Go to Authentication > Sign-in method');
  console.error('[Firebase]    - Enable "Email/Password"');
  console.error('[Firebase]    - Enable "Google"');
  console.error('[Firebase] 6. Go to Authentication > Settings > Authorized domains');
  console.error('[Firebase]    - Add "localhost" (and your domain)');
  console.error('[Firebase] 7. Verify API key has required permissions');
  console.error('[Firebase] 8. Clear browser cache and restart the app');
  console.error('[Firebase]');
  console.warn('[Firebase] Auth features are disabled until Firebase is properly configured');
}

export { auth };
export default app;