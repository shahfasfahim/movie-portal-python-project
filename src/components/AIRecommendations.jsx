import { useEffect, useState } from 'react';
import { getGroqRecommendations } from '../api/groq.js';

const AIRecommendations = ({ movieName }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!movieName) {
      setRecommendations([]);
      setError('AI recommendations not available');
      setLoading(false);
      return;
    }

    let isMounted = true;

    const loadRecommendations = async () => {
      setLoading(true);
      setError(null);
      setRecommendations([]);

      try {
        const recs = await getGroqRecommendations(movieName);
        if (!isMounted) return;

        setRecommendations(Array.isArray(recs) ? recs : []);
        if (!recs?.length) {
          setError('AI recommendations not available');
        }
      } catch (err) {
        console.error('[AIRecommendations] fetch error:', err);
        if (isMounted) {
          setError('AI recommendations not available');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadRecommendations();

    return () => {
      isMounted = false;
    };
  }, [movieName]);

  return (
    <div className="rounded-3xl bg-slate-900/90 p-6 shadow-xl">
      <div className="mb-6 flex flex-col gap-2">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Powered by Groq</p>
        <h3 className="text-2xl font-bold text-white">AI Recommendations</h3>
        <p className="text-sm text-slate-400">Suggestions for movies similar to {movieName || 'this film'}.</p>
      </div>

      {loading ? (
        <div className="rounded-3xl bg-slate-950 p-6 text-center text-white shadow-inner">
          <p className="text-lg font-semibold">Loading AI recommendations...</p>
        </div>
      ) : error ? (
        <div className="rounded-3xl bg-orange-500/10 border border-orange-400 p-6 text-orange-800 shadow-lg">
          <p className="text-lg font-semibold">AI recommendations not available</p>
          <p className="mt-2 text-sm">{error}</p>
        </div>
      ) : !recommendations?.length ? (
        <div className="rounded-3xl bg-slate-950 p-6 text-center text-white shadow-inner">
          <p className="text-lg font-semibold">AI recommendations not available</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((recommendation, index) => (
            <div
              key={`${recommendation}-${index}`}
              className="rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:bg-white/10"
            >
              <p className="text-base font-semibold text-white">{recommendation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIRecommendations;
