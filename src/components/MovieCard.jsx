import { Link } from 'react-router-dom';
import { useMovie } from '../context/MovieContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { getPosterUrl } from '../utils/imageUtils';

const MovieCard = ({ movie }) => {
  const { addToFavorites, removeFromFavorites, favorites } = useMovie();
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [isHovering, setIsHovering] = useState(false);
  const isFavorite = favorites.some(f => f.id === movie.id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to add favorites');
      return;
    }
    if (isFavorite) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  const posterUrl = getPosterUrl(movie.poster_path);
  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
    >
      <div className={`rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all h-full ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        <Link to={`/movie/${movie.id}`} className="block">
          <div className="relative h-64 overflow-hidden bg-gray-700">
            <img
              src={posterUrl}
              alt={movie.title || 'Movie poster'}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {isHovering && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <button
                  onClick={handleFavoriteClick}
                  className="p-3 bg-white rounded-full hover:bg-gray-100 transition"
                >
                  <Heart
                    size={24}
                    className={`${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                  />
                </button>
              </div>
            )}
          </div>

          <div className="p-4">
            <h3 className={`text-lg font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {movie.title || 'Unknown Title'}
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {releaseYear}
            </p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-yellow-400 font-semibold">★ {movie.vote_average?.toFixed(1)}</span>
              <button
                onClick={handleFavoriteClick}
                className={`p-1 rounded transition ${
                  isFavorite ? 'text-red-500' : isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
              </button>
            </div>
          </div>
        </Link>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            to={`/movie/${movie.id}`}
            className="inline-flex items-center justify-center w-full px-3 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Watch Trailer
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default MovieCard;