const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const fetchFromTmdb = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.status_message || `TMDB request failed with status ${response.status}`);
  }
  const data = await response.json();
  return data;
};

export const searchMoviesByQuery = async (query, limit = 6) => {
  if (!query || !API_KEY) {
    return [];
  }
  const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1&include_adult=false`;
  const data = await fetchFromTmdb(url);
  return (data.results || []).slice(0, limit);
};

export const getMovieDetailsById = async (id) => {
  if (!id || !API_KEY) return null;
  const url = `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`;
  return await fetchFromTmdb(url);
};
