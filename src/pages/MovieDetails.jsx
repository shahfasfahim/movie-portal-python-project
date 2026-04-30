import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMovie } from '../context/MovieContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import useMovieDetails from '../hooks/useMovieDetails';
import MovieCard from '../components/MovieCard';
import Trailer from '../components/Trailer';
import AIRecommendations from '../components/AIRecommendations';
import { generateMovieSummary, generateMovieReview } from '../api/groq';
import { motion } from 'framer-motion';
import { Heart, Bookmark, Check, Calendar, Clock } from 'lucide-react';
import { getBackdropUrl, getPosterUrl, getProfileUrl } from '../utils/imageUtils';

const MovieDetails = () => {
  const { id } = useParams();
  const { movie, cast, similar, trailerKey, loading, error } = useMovieDetails(id);
  const { addToWatchlist, removeFromWatchlist, markAsWatched, watchlist, watched, favorites, removeFromFavorites, addToFavorites, setCurrentMovieForChat } = useMovie();
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [aiSummary, setAiSummary] = useState('');
  const [aiReview, setAiReview] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  const isInWatchlist = watchlist.some(w => w.id == movie?.id);
  const isWatched = watched.some(w => w.id == movie?.id);
  const isFavorite = favorites.some(f => f.id === movie?.id);
  const movieYear = movie?.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const movieGenre = movie?.genres?.[0]?.name || 'Drama';

  const backdropUrl = getBackdropUrl(movie?.backdrop_path);
  const posterUrl = getPosterUrl(movie?.poster_path);

  useEffect(() => {
    if (movie) {
      setCurrentMovieForChat({
        title: movie?.title,
        year: movieYear,
        genre: movieGenre
      });
    }
  }, [movie, movieYear, movieGenre, setCurrentMovieForChat]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <p className={`text-lg ${isDark ? 'text-red-400' : 'text-red-600'}`}>Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-900 dark:text-white">Movie details are unavailable.</p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Please try again or return to the home page.</p>
        </div>
      </div>
    );
  }

  const handleGenerateSummary = async () => {
    setAiError(null);
    setSummaryLoading(true);
    try {
      const summary = await generateMovieSummary({ title: movie?.title, year: movieYear, genre: movieGenre });
      setAiSummary(summary);
    } catch (err) {
      setAiError(err.message || 'AI is taking a break. Try again shortly.');
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleGenerateReview = async () => {
    setAiError(null);
    setReviewLoading(true);
    try {
      const { review } = await generateMovieReview({ title: movie?.title, year: movieYear, genre: movieGenre, rating: movie?.vote_average });
      setAiReview(review);
    } catch (err) {
      console.error('[MovieDetails] generate review error:', err);
      setAiError(err.message || 'AI is taking a break. Try again shortly.');
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
      </div>

      <div className="container mx-auto px-4 -mt-64 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-start gap-6 mb-8"
        >
          {/* Fixed-size poster container */}
          <div className="w-[260px] h-[390px] min-w-[260px] flex-shrink-0 overflow-hidden rounded-xl shadow-2xl">
            <img
              src={posterUrl}
              alt={movie.title || 'Movie poster'}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          <div className="flex-1">
            <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {movie.title}
            </h1>

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center space-x-2 bg-yellow-500 text-white px-4 py-2 rounded-lg">
                <span className="text-2xl">★</span>
                <span className="font-semibold">{movie.vote_average?.toFixed(1)}/10</span>
              </div>
              {movie.runtime && (
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
                  <Clock size={18} />
                  <span>{movie.runtime}min</span>
                </div>
              )}
              {movie.release_date && (
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
                  <Calendar size={18} />
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres?.map(genre => (
                <span key={genre.id} className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm">
                  {genre.name}
                </span>
              ))}
            </div>

            {user && (
              <div className="flex flex-wrap gap-3 mb-6">
                <button
                  onClick={() => isFavorite ? removeFromFavorites(movie.id) : addToFavorites(movie)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                    isFavorite
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : `${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`
                  }`}
                >
                  <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
                  <span>{isFavorite ? 'Favorited' : 'Favorite'}</span>
                </button>

                <button
                  onClick={() => isInWatchlist ? removeFromWatchlist(movie.id) : addToWatchlist(movie)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                    isInWatchlist
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : `${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`
                  }`}
                >
                  <Bookmark size={20} className={isInWatchlist ? 'fill-current' : ''} />
                  <span>{isInWatchlist ? 'In Watchlist' : 'Watch Later'}</span>
                </button>

                {!isWatched && (
                  <button
                    onClick={() => markAsWatched(movie)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                  >
                    <Check size={20} />
                    <span>Mark Watched</span>
                  </button>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={handleGenerateSummary}
                disabled={summaryLoading}
                className="rounded-lg bg-violet-600 px-5 py-3 text-white hover:bg-violet-500 transition disabled:cursor-not-allowed disabled:bg-slate-500"
              >
                {summaryLoading ? 'Generating summary...' : 'Generate AI Summary'}
              </button>
              <button
                onClick={handleGenerateReview}
                disabled={reviewLoading}
                className="rounded-lg bg-fuchsia-600 px-5 py-3 text-white hover:bg-fuchsia-500 transition disabled:cursor-not-allowed disabled:bg-slate-500"
              >
                {reviewLoading ? 'Generating review...' : 'Generate AI Review'}
              </button>
            </div>

            {aiError && (
              <div className="mb-6 rounded-3xl bg-rose-500/10 px-4 py-3 text-rose-100">
                {aiError}
              </div>
            )}

            <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {movie.overview}
            </p>

            {aiSummary && (
              <div className="mt-8 w-full rounded-xl bg-slate-900/90 p-6 text-slate-100 shadow-lg">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="text-xl font-bold">AI Summary</h3>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">Powered by Groq</span>
                </div>
                <p className="text-base leading-relaxed text-slate-300 max-w-[600px]">{aiSummary}</p>
              </div>
            )}

            {aiReview && (
              <div className="mt-8 w-full rounded-xl bg-slate-900/90 p-6 text-slate-100 shadow-lg">
                <div className="mb-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xl font-bold">AI Review</h3>
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">Powered by Groq</span>
                  </div>
                  <p className="text-base text-slate-400">A professional review generated from the movie title, rating, and genre.</p>
                </div>
                <p className="text-base leading-relaxed text-slate-300 whitespace-pre-line">{aiReview}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Trailer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Trailer
          </h2>
          <Trailer movieName={movie.title} trailerKey={trailerKey} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <AIRecommendations movieName={movie.title} />
        </motion.div>

        {/* Cast */}
        {cast.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Cast & Crew
            </h2>
            <div className="flex overflow-x-auto space-x-4 pb-4 -mx-4 px-4">
              {cast.map(actor => (
                <div key={actor.id} className="text-center min-w-max">
                  <div className="w-32 h-48 rounded-lg overflow-hidden mb-3 shadow-lg">
                    <img
                      src={getProfileUrl(actor.profile_path)}
                      alt={actor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {actor.name}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {actor.character}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Similar Movies */}
        {similar.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <h2 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Similar Movies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {similar.map((mov, index) => (
                <motion.div
                  key={mov.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <MovieCard movie={mov} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;