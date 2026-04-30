import { useAuth } from '../context/AuthContext';
import { useMovie } from '../context/MovieContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { motion } from 'framer-motion';
import { User, Mail, LogOut, Heart, Eye, Bookmark } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const { favorites, watchlist, watched } = useMovie();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-4">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
                <User size={40} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">{user?.displayName || 'User'}</h1>
                <p className="text-blue-100 flex items-center space-x-2 mt-2">
                  <Mail size={18} />
                  <span>{user?.email}</span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className={`rounded-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="flex items-center space-x-4">
              <Heart size={32} className="text-red-500" />
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Favorites</p>
                <p className="text-3xl font-bold text-red-500">{favorites.length}</p>
              </div>
            </div>
          </div>

          <div className={`rounded-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="flex items-center space-x-4">
              <Bookmark size={32} className="text-blue-500" />
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Watchlist</p>
                <p className="text-3xl font-bold text-blue-500">{watchlist.length}</p>
              </div>
            </div>
          </div>

          <div className={`rounded-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="flex items-center space-x-4">
              <Eye size={32} className="text-green-500" />
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Watched</p>
                <p className="text-3xl font-bold text-green-500">{watched.length}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Favorite Movies Section */}
        {favorites.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              ❤️ Your Favorite Movies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {favorites.slice(0, 10).map((movie, index) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <MovieCard movie={movie} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center mt-12"
        >
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition transform hover:scale-105"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;