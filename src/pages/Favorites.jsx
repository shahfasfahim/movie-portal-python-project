import { useMovie } from '../context/MovieContext';
import { useTheme } from '../context/ThemeContext';
import MovieCard from '../components/MovieCard';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const Favorites = () => {
  const { favorites } = useMovie();
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center space-x-3 mb-8">
            <Heart size={32} className="text-red-500 fill-red-500" />
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              My Favorite Movies
            </h1>
          </div>
        </motion.div>

        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center py-20 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} border-2 border-dashed ${isDark ? 'border-gray-700' : 'border-gray-300'}`}
          >
            <Heart size={48} className={`mx-auto mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              No favorite movies yet. Add some from the home page!
            </p>
          </motion.div>
        ) : (
          <>
            <p className={`mb-8 text-lg font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {favorites.length} movie{favorites.length !== 1 ? 's' : ''} saved
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6"
            >
              {favorites.map((movie, index) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <MovieCard movie={movie} />
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default Favorites;