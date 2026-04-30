import { useEffect } from 'react';
import { useMovie } from '../context/MovieContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Heart, Play } from 'lucide-react';
import { getPosterUrl } from '../utils/imageUtils';

const FALLBACK_MOVIES = [
  { id: 'leo', title: 'Leo', poster_path: null, vote_average: 7.8 },
  { id: 'jailer', title: 'Jailer', poster_path: null, vote_average: 7.9 },
  { id: 'vikram', title: 'Vikram', poster_path: null, vote_average: 8.0 },
  { id: 'endgame', title: 'Avengers: Endgame', poster_path: null, vote_average: 8.4 },
  { id: 'kgf2', title: 'KGF Chapter 2', poster_path: null, vote_average: 8.1 },
  { id: 'pushpa', title: 'Pushpa', poster_path: null, vote_average: 7.2 },
  { id: 'master', title: 'Master', poster_path: null, vote_average: 7.4 },
  { id: 'interstellar', title: 'Interstellar', poster_path: null, vote_average: 8.6 }
];

const Home = () => {
  const { trendingMovies, fetchTrendingMovies, loading, favorites, addToFavorites, removeFromFavorites } = useMovie();
  const { isDark } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  const movies = (trendingMovies && trendingMovies.length > 0)
    ? trendingMovies.slice(0, 12)
    : FALLBACK_MOVIES;

  const handlePlayClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const handleFavoriteClick = (e, movie) => {
    e.stopPropagation();
    if (!user) {
      alert('Please login to add favorites');
      return;
    }
    const isFavorite = favorites.some(f => f.id === movie.id);
    if (isFavorite) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'bg-slate-950' : 'bg-slate-100'}`}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className={`text-4xl font-semibold tracking-tight sm:text-5xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
            🔥 Trending Now
          </h1>
          <p className={`mt-3 max-w-2xl text-sm sm:text-base ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
            Discover the hottest titles on CineFlix with our responsive movie grid layout.
          </p>
        </div>

        {loading && !trendingMovies.length && (
          <div className={`rounded-3xl border p-6 text-center ${isDark ? 'border-slate-800 bg-slate-900/80 text-slate-400' : 'border-gray-300 bg-gray-100 text-gray-600'}`}>
            Loading trending movies...
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {movies.map((movie) => {
            const isFavorite = favorites.some(f => f.id === movie.id);
            return (
              <div
                key={movie.id || movie.title}
                className={`group relative overflow-hidden rounded-2xl transition-transform duration-300 hover:scale-105 ${isDark ? 'bg-slate-900' : 'bg-white'} shadow-lg hover:shadow-2xl`}
              >
                {/* Movie Poster */}
                <div className="relative h-80 overflow-hidden bg-slate-700">
                  <img
                    src={getPosterUrl(movie.poster_path)}
                    alt={movie.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />

                  {/* Overlay with buttons - show on hover */}
                  <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {/* Play Button */}
                    <button
                      onClick={() => handlePlayClick(movie.id)}
                      className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 transition"
                    >
                      <Play size={20} fill="currentColor" />
                      Play
                    </button>

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => handleFavoriteClick(e, movie)}
                      className={`flex items-center justify-center rounded-full px-3 py-2 font-semibold transition ${
                        isFavorite
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-white text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Heart
                        size={20}
                        className={isFavorite ? 'fill-current' : ''}
                      />
                    </button>
                  </div>
                </div>

                {/* Movie Info */}
                <div className={`p-4 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
                  <h2 className={`truncate text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {movie.title}
                  </h2>
                  <div className="mt-2 flex items-center justify-between">
                    {movie.vote_average != null && (
                      <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                        ⭐ {movie.vote_average.toFixed(1)}/10
                      </p>
                    )}
                    {/* Quick Favorite Button (always visible) */}
                    <button
                      onClick={(e) => handleFavoriteClick(e, movie)}
                      className={`transition ${
                        isFavorite ? 'text-red-500' : isDark ? 'text-slate-400 hover:text-red-500' : 'text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <Heart
                        size={18}
                        className={isFavorite ? 'fill-current' : ''}
                      />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;