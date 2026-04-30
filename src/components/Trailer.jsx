import { useEffect, useState } from 'react';
import { fetchTrailer } from '../api/youtube';

const Trailer = ({ movieName, trailerKey }) => {
  const [videoId, setVideoId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!movieName) return;

    const loadTrailer = async () => {
      setLoading(true);
      setError(null);
      setVideoId(null);

      if (trailerKey) {
        setVideoId(trailerKey);
        setLoading(false);
        return;
      }

      try {
        const id = await fetchTrailer(movieName);
        setVideoId(id);
      } catch (err) {
        setError(err.message || 'Failed to load trailer.');
      } finally {
        setLoading(false);
      }
    };

    loadTrailer();
  }, [movieName, trailerKey]);

  if (!movieName) {
    return <p className="text-sm text-gray-500">No movie selected.</p>;
  }

  if (loading) {
    return (
      <div className="rounded-lg bg-gray-900 p-6 text-center text-white">
        Loading trailer...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-500/10 border border-red-500 p-6 text-red-700">
        <p className="font-semibold">Trailer unavailable</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!videoId) {
    return (
      <div className="rounded-3xl bg-slate-900 p-6 text-center text-white border border-slate-700 shadow-2xl max-w-3xl mx-auto">
        <p className="font-semibold">Trailer not available</p>
        <p className="text-sm text-slate-400">We couldn't find a trailer for this movie right now.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-8 max-w-[1000px] rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
      <div className="relative w-full" style={{ aspectRatio: '16 / 9', minHeight: '250px' }}>
        <iframe
          title={`${movieName} Trailer`}
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${videoId}`}
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default Trailer;
