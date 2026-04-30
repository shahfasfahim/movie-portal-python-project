import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useMovie } from '../context/MovieContext';
import { useTheme } from '../context/ThemeContext';
import MovieCard from '../components/MovieCard';
import { motion } from 'framer-motion';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const type = searchParams.get('type');
  const actorId = searchParams.get('actorId');
  const { searchResults, loading, searchMovies, fetchMoviesByActor } = useMovie();
  const { isDark } = useTheme();
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!query) return;
    setHasSearched(true);

    if (type === 'actor' && actorId) {
      fetchMoviesByActor(actorId);
    } else {
      searchMovies(query);
    }
  }, [query, type, actorId]);

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-12">
        <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Search Results
        </h1>
        <p className={`mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {hasSearched && `Results for "${query}"`}
        </p>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {!loading && searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className={`mb-8 text-lg font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Found {searchResults.length} movies
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {searchResults.map((movie, index) => (
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

        {!loading && hasSearched && searchResults.length === 0 && (
          <div className="text-center py-12">
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              No movies found for "{query}"
            </p>
          </div>
        )}

        {!hasSearched && (
          <div className="text-center py-12">
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Enter a search query to find movies
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;