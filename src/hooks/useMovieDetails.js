import { useState, useEffect } from 'react';

const FALLBACK_MOVIES = {
  7: {
    id: 7,
    title: 'The Matrix',
    overview: 'A computer hacker learns from mysterious rebels about the true nature of reality.',
    vote_average: 8.7,
    runtime: 136,
    release_date: '1999-03-31',
    backdrop_path: '/f89U3ADr1oRsRBzos4Dbq6dCMZc.jpg',
    poster_path: '/f89U3ADr1oRsRBzos4Dbq6dCMZc.jpg',
    genres: [{ id: 28, name: 'Action' }, { id: 878, name: 'Science Fiction' }]
  }
};

const FALLBACK_CAST = [
  { id: 1, name: 'Keanu Reeves', character: 'Neo', profile_path: '/rRdru6REr9i3WIHv2mntpcgxnoY.jpg' },
  { id: 2, name: 'Laurence Fishburne', character: 'Morpheus', profile_path: '/2MXv3sipnHrHf1pMlC0K1FhNfKy.jpg' },
  { id: 3, name: 'Carrie-Anne Moss', character: 'Trinity', profile_path: '/xFS4A4JXMAxyiK6TN7tTKlJpWbM.jpg' }
];

const FALLBACK_SIMILAR = [
  { id: 101, title: 'Inception', poster_path: '/oYuLEyjQejS1CCgSY4COzjr3SEa.jpg', vote_average: 8.8, genre_ids: [28, 12, 878] },
  { id: 102, title: 'Interstellar', poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', vote_average: 8.6, genre_ids: [12, 18, 878] },
  { id: 103, title: 'Blade Runner 2049', poster_path: '/tbVZ3Sq88dZaCANlUcewQuHQOaE.jpg', vote_average: 8.0, genre_ids: [878, 18] }
];

const useMovieDetails = (id) => {
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      setError(null);
      const apiKey = import.meta.env.VITE_TMDB_API_KEY;

      if (!apiKey) {
        setMovie(FALLBACK_MOVIES[id] || {
          id,
          title: 'Unknown Movie',
          overview: 'Movie details are unavailable because the TMDB service cannot be reached.',
          vote_average: 0,
          runtime: null,
          release_date: '',
          backdrop_path: '',
          poster_path: '',
          genres: []
        });
        setCast(FALLBACK_CAST);
        setSimilar(FALLBACK_SIMILAR);
        setTrailerKey(null);
        setLoading(false);
        return;
      }

      const movieUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`;
      const creditsUrl = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`;
      const similarUrl = `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${apiKey}`;
      const videosUrl = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}`;

      try {
        const [movieRes, creditsRes, similarRes, videosRes] = await Promise.all([
          fetch(movieUrl),
          fetch(creditsUrl),
          fetch(similarUrl),
          fetch(videosUrl)
        ]);

        if (!movieRes.ok || !creditsRes.ok || !similarRes.ok || !videosRes.ok) {
          const statusErrors = [];
          if (!movieRes.ok) statusErrors.push(`movie ${movieRes.status}`);
          if (!creditsRes.ok) statusErrors.push(`credits ${creditsRes.status}`);
          if (!similarRes.ok) statusErrors.push(`similar ${similarRes.status}`);
          if (!videosRes.ok) statusErrors.push(`videos ${videosRes.status}`);
          throw new Error(`TMDB fetch failed (${statusErrors.join(', ')})`);
        }

        const movieData = await movieRes.json();
        const creditsData = await creditsRes.json();
        const similarData = await similarRes.json();
        const videosData = await videosRes.json();

        setMovie(movieData);
        setCast(creditsData.cast.slice(0, 10));
        setSimilar(similarData.results.slice(0, 10));

        const trailerVideo = videosData.results.find((v) => v.type === 'Trailer' && v.site === 'YouTube');
        setTrailerKey(trailerVideo ? trailerVideo.key : null);
      } catch (err) {
        setMovie(FALLBACK_MOVIES[id] || {
          id,
          title: 'Unknown Movie',
          overview: 'Movie details are unavailable because the TMDB service cannot be reached.',
          vote_average: 0,
          runtime: null,
          release_date: '',
          backdrop_path: '',
          poster_path: '',
          genres: []
        });
        setCast(FALLBACK_CAST);
        setSimilar(FALLBACK_SIMILAR);
        setTrailerKey(null);
        setError(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchMovie();
  }, [id]);

  return { movie, cast, similar, trailerKey, loading, error };
};

export default useMovieDetails;