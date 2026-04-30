import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, googleSignIn, githubSignIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('[Login] Attempting login with email:', email);
    try {
      setError('');
      setLoading(true);
      const result = await login(email, password);
      console.log('[Login] Login successful, navigating to home');
      navigate('/');
    } catch (err) {
      console.error('[Login] Login failed with error:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    console.log('[Login] Attempting Google login');
    try {
      setError('');
      setLoading(true);
      const result = await googleSignIn();
      console.log('[Login] Google login successful, navigating to home');
      navigate('/');
    } catch (err) {
      console.error('[Login] Google login failed with error:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    console.log('[Login] Attempting GitHub login');
    try {
      setError('');
      setLoading(true);
      const result = await githubSignIn();
      console.log('[Login] GitHub login successful, navigating to home');
      navigate('/');
    } catch (err) {
      console.error('[Login] GitHub login failed with error:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-gray-900 rounded-lg shadow-2xl p-8 border border-gray-700">
          <h1 className="text-3xl font-bold text-white mb-4 text-center">Welcome to CineFlix!</h1>
          <p className="text-gray-300 text-center mb-8 leading-relaxed">
            Sign in to explore movies, save your favorites, and access AI-powered features. <br />
            Use your email and password or continue with Google or GitHub for a faster login experience.
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-white text-slate-900 border border-gray-300 font-semibold py-2 px-4 rounded-lg transition hover:bg-slate-100 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              <FcGoogle size={20} />
              <span>Continue with Google</span>
            </button>
            <button
              type="button"
              onClick={handleGithubLogin}
              disabled={loading}
              className="w-full bg-slate-800 text-white font-semibold py-2 px-4 rounded-lg transition hover:bg-slate-700 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              <FaGithub size={18} />
              <span>Continue with GitHub</span>
            </button>
          </div>

          <p className="text-gray-400 text-center mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;