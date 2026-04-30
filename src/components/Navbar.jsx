import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useMovie } from '../context/MovieContext';
import { Menu, X, Moon, Sun, Search } from 'lucide-react';


const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { searchMovies, fetchMoviesByActor } = useMovie();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedActor, setSelectedActor] = useState(null);
  const [actorSuggestions, setActorSuggestions] = useState([]);
  const [showActorSuggestions, setShowActorSuggestions] = useState(false);
  const [isSearchingActors, setIsSearchingActors] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const suggestionsRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!query.trim() || query.trim().length < 2) {
      setActorSuggestions([]);
      setShowActorSuggestions(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsSearchingActors(true);
      const apiKey = import.meta.env.VITE_TMDB_API_KEY;

      if (!apiKey) {
        setActorSuggestions([]);
        setShowActorSuggestions(false);
        setIsSearchingActors(false);
        return;
      }

      try {
        const url = `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${encodeURIComponent(
          query
        )}&page=1&include_adult=false&language=en-US`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const results = (data.results || [])
          .filter((person) => person.known_for_department === 'Acting')
          .slice(0, 8)
          .map((person) => ({
            id: person.id,
            name: person.name,
            profilePath: person.profile_path,
            knownFor: (person.known_for || [])
              .slice(0, 3)
              .map((item) => item.title || item.name || '')
              .filter(Boolean)
              .join(', '),
          }));

        setActorSuggestions(results);
        setShowActorSuggestions(results.length > 0);
      } catch (err) {
        setActorSuggestions([]);
        setShowActorSuggestions(false);
      } finally {
        setIsSearchingActors(false);
      }
    }, 250);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowActorSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (selectedActor?.name === query && selectedActor.id) {
      await fetchMoviesByActor(selectedActor.id);
      navigate(
        `/search?q=${encodeURIComponent(selectedActor.name)}&type=actor&actorId=${selectedActor.id}`
      );
    } else {
      await searchMovies(query);
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }

    setShowActorSuggestions(false);
  };

  const handleActorSelect = async (actor) => {
    setQuery(actor.name);
    setSelectedActor(actor);
    await fetchMoviesByActor(actor.id);
    navigate(
      `/search?q=${encodeURIComponent(actor.name)}&type=actor&actorId=${actor.id}`
    );
    setShowActorSuggestions(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className={`sticky top-0 z-50 shadow-lg ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-b transition-colors`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent tracking-wide">
              CineFlix
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="font-medium hover:text-blue-500 transition">
              Home
            </Link>
            {user && (
              <>
                <Link to="/favorites" className="font-medium hover:text-blue-500 transition">
                  Favorites
                </Link>
                <Link to="/profile" className="font-medium hover:text-blue-500 transition">
                  Profile
                </Link>
              </>
            )}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-col gap-2 flex-1 max-w-xl">
            <div className="relative w-full">
              <form onSubmit={handleSearch} className="flex items-center relative w-full">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedActor(null);
                  }}
                  placeholder="Search movies or actors..."
                  className={`px-4 py-2 rounded-lg pl-10 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    isDark ? 'bg-gray-800 text-white border-gray-700 placeholder-gray-400' : 'bg-white text-gray-900 border-gray-300 placeholder-gray-500'
                  } border`}
                />
                <Search size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <button type="submit" className="ml-2 p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
                  <Search size={20} />
                </button>
              </form>

              {showActorSuggestions && (
                <div ref={suggestionsRef} className="absolute top-full left-0 w-full mt-2 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden z-50">
                  {actorSuggestions.map((actor) => (
                    <button
                      key={actor.id}
                      type="button"
                      onClick={() => handleActorSelect(actor)}
                      className="w-full text-left px-4 py-3 hover:bg-slate-100 dark:hover:bg-gray-700 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                          {actor.profilePath ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w185${actor.profilePath}`}
                              alt={actor.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="flex h-full items-center justify-center text-xs text-slate-500 dark:text-slate-400">N/A</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-slate-900 dark:text-white">{actor.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{actor.knownFor || 'Actor credits'}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                  {isSearchingActors && (
                    <div className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">Searching actors...</div>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition">
              {isDark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
            </button>

            {user ? (
              <>
                <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {user.displayName || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition">
                  Login
                </Link>
                <Link to="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden pb-4 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
            <Link to="/" className="block py-2 font-medium hover:text-blue-500">Home</Link>
            {user && (
              <>
                <Link to="/favorites" className="block py-2 font-medium hover:text-blue-500">Favorites</Link>
                <Link to="/profile" className="block py-2 font-medium hover:text-blue-500">Profile</Link>
              </>
            )}
            <div className="py-2 border-t mt-2">
              {user ? (
                <>
                  <p className="py-1 text-sm">{user.displayName || user.email}</p>
                  <button onClick={handleLogout} className="w-full text-left py-2 text-red-600 font-medium">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block py-2 font-medium">Login</Link>
                  <Link to="/signup" className="block py-2 font-medium">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        )}

      </div>
    </nav>
  );
};

export default Navbar;