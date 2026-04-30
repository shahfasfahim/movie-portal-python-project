import { createContext, useContext, useState, useEffect } from 'react';

const MOCK_MOVIES = [
  { id: 1, title: 'The Shawshank Redemption', poster_path: '/28RQwW8ts89wCu0KZUbXGHKklJ5.jpg', genre_ids: [18], vote_average: 9.3, overview: 'Two imprisoned men bond over a number of years...' },
  { id: 2, title: 'The Dark Knight', poster_path: '/1hqwGsycsCrc41SDNGyaSheZ67O.jpg', genre_ids: [28, 80], vote_average: 9.0, overview: 'When the menace known as the Joker wreaks havoc...' },
  { id: 3, title: 'Inception', poster_path: '/oYuLEyjQejS1CCgSY4COzjr3SEa.jpg', genre_ids: [28, 12, 878], vote_average: 8.8, overview: 'A thief who steals corporate secrets through dream-sharing technology...' },
  { id: 4, title: 'Pulp Fiction', poster_path: '/dM2w364MScsjFjitO5h0KwYXRUH.jpg', genre_ids: [80], vote_average: 8.9, overview: 'The lives of two mob hitmen, a boxer, a gangster and his wife...' },
  { id: 5, title: 'Forrest Gump', poster_path: '/clnTC5n91Svg7AVksLkiVlkAGKW.jpg', genre_ids: [35, 18, 10749], vote_average: 8.8, overview: 'The presidencies of Kennedy and Johnson unfold through the perspective of an Alabama man...' },
  { id: 6, title: 'The Matrix', poster_path: '/f89U3ADr1oRsRBzos4Dbq6dCMZc.jpg', genre_ids: [28, 878], vote_average: 8.7, overview: 'A computer hacker learns from mysterious rebels about the true nature of reality...' },
  { id: 7, title: 'Interstellar', poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', genre_ids: [12, 18, 878], vote_average: 8.6, overview: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival...' },
  { id: 8, title: 'The Godfather', poster_path: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', genre_ids: [18, 80], vote_average: 9.2, overview: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire...' },
  { id: 9, title: 'Fight Club', poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PchJ.jpg', genre_ids: [18, 80], vote_average: 8.8, overview: 'An insomniac office worker and a devil-may-care soapmaker form an underground fight club...' },
  { id: 10, title: 'The Lion King', poster_path: '/sKCr78MXSLixwmL8IumZgtUDMQc.jpg', genre_ids: [10751, 12, 14, 35], vote_average: 8.5, overview: 'Lion prince Simba flees his kingdom after the death of his father...' }
];

const MovieContext = createContext();

export const useMovie = () => useContext(MovieContext);

export const MovieProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [watched, setWatched] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [currentMovieForChat, setCurrentMovieForChat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load from localStorage
  useEffect(() => {
    const fav = JSON.parse(localStorage.getItem('favorites')) || [];
    const watch = JSON.parse(localStorage.getItem('watchlist')) || [];
    const wat = JSON.parse(localStorage.getItem('watched')) || [];
    setFavorites(fav);
    setWatchlist(watch);
    setWatched(wat);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('watched', JSON.stringify(watched));
  }, [watched]);

  const addToFavorites = (movie) => {
    if (!favorites.find(f => f.id === movie.id)) {
      setFavorites([...favorites, movie]);
    }
  };

  const removeFromFavorites = (id) => {
    setFavorites(favorites.filter(f => f.id !== id));
  };

  const addToWatchlist = (movie) => {
    if (!watchlist.find(w => w.id === movie.id)) {
      setWatchlist([...watchlist, movie]);
    }
  };

  const removeFromWatchlist = (id) => {
    setWatchlist(watchlist.filter(w => w.id !== id));
  };

  const markAsWatched = (movie) => {
    if (!watched.find(w => w.id === movie.id)) {
      setWatched([...watched, movie]);
    }
    removeFromWatchlist(movie.id);
  };

  const removeFromWatched = (id) => {
    setWatched(watched.filter(w => w.id !== id));
  };

  const searchMovies = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    if (!apiKey) {
      const normalizedQuery = query.trim().toLowerCase();
      setSearchResults(
        MOCK_MOVIES.filter((movie) => movie.title.toLowerCase().includes(normalizedQuery))
      );
      setLoading(false);
      return;
    }

    try {
      const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setSearchResults(data.results || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to search movies');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrendingMovies = async () => {
    setLoading(true);
    setError(null);

    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    if (!apiKey) {
      setTrendingMovies(MOCK_MOVIES);
      setLoading(false);
      return;
    }

    try {
      const url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setTrendingMovies(data.results || MOCK_MOVIES);
      setError(null);
    } catch (err) {
      setTrendingMovies(MOCK_MOVIES);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchMoviesByGenre = async (genreId) => {
    setLoading(true);
    setError(null);

    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    if (!apiKey) {
      setTrendingMovies(MOCK_MOVIES.filter((movie) => movie.genre_ids.includes(genreId)));
      setLoading(false);
      return;
    }

    try {
      const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&language=en-US&sort_by=popularity.desc&page=1`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setTrendingMovies(data.results || []);
      if (!data.results || data.results.length === 0) {
        setError('No movies found for this genre.');
      }
    } catch (err) {
      setTrendingMovies([]);
      setError(err.message || 'Failed to load genre movies');
    } finally {
      setLoading(false);
    }
  };

  const searchActorByName = async (name) => {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    if (!apiKey || !name.trim()) return null;

    try {
      const url = `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${encodeURIComponent(name)}&language=en-US&page=1&include_adult=false`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      return (data.results || [])[0] || null;
    } catch (err) {
      console.error('[MovieContext] searchActorByName error:', err);
      return null;
    }
  };

  const fetchMoviesByActor = async (actorId) => {
    setLoading(true);
    setError(null);

    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    if (!apiKey) {
      setTrendingMovies(MOCK_MOVIES);
      setSearchResults(MOCK_MOVIES);
      setLoading(false);
      return;
    }

    try {
      const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_cast=${actorId}&language=en-US&sort_by=popularity.desc&page=1`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setTrendingMovies(data.results || []);
      setSearchResults(data.results || []);
      if (!data.results || data.results.length === 0) {
        setError('No movies found for this actor.');
      }
    } catch (err) {
      setTrendingMovies([]);
      setSearchResults([]);
      setError(err.message || 'Failed to load actor movies');
    } finally {
      setLoading(false);
    }
  };

  const fetchMoviesByQuery = async (query) => {
    setLoading(true);
    setError(null);

    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    if (!apiKey) {
      setTrendingMovies(MOCK_MOVIES.filter((movie) => movie.title.toLowerCase().includes(query.toLowerCase())));
      setLoading(false);
      return;
    }

    try {
      const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=en-US&page=1&include_adult=false`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setTrendingMovies(data.results || []);
      if (!data.results || data.results.length === 0) {
        setError('No movies found for this filter.');
      }
    } catch (err) {
      setTrendingMovies([]);
      setError(err.message || 'Failed to load movies for this filter');
    } finally {
      setLoading(false);
    }
  };

  const getRecommendations = () => {
    if (favorites.length === 0) return trendingMovies.slice(0, 10);
    const favoriteGenres = favorites.flatMap(f => f.genre_ids || []);
    const genreCounts = favoriteGenres.reduce((acc, id) => {
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});
    const topGenre = Object.keys(genreCounts).reduce((a, b) => 
      genreCounts[a] > genreCounts[b] ? a : b, 
      Object.keys(genreCounts)[0]
    );
    return trendingMovies
      .filter(m => m.genre_ids && m.genre_ids.includes(parseInt(topGenre)))
      .slice(0, 10);
  };

  return (
    <MovieContext.Provider value={{
      favorites,
      watchlist,
      watched,
      searchResults,
      trendingMovies,
      loading,
      error,
      addToFavorites,
      removeFromFavorites,
      addToWatchlist,
      removeFromWatchlist,
      markAsWatched,
      removeFromWatched,
      currentMovieForChat,
      setCurrentMovieForChat,
      searchMovies,
      fetchTrendingMovies,
      fetchMoviesByGenre,
      searchActorByName,
      fetchMoviesByActor,
      fetchMoviesByQuery,
      getRecommendations
    }}>
      {children}
    </MovieContext.Provider>
  );
};