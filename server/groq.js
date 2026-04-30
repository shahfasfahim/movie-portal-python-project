import 'dotenv/config';
import express from 'express';
import axios from 'axios';
import Groq from 'groq-sdk';

const router = express.Router();
const PYTHON_BACKEND_URL = process.env.PYTHON_BACKEND_URL || 'http://localhost:8001';
const groqApiKey = process.env.GROQ_API_KEY;
const tmdbApiKey = process.env.TMDB_API_KEY || process.env.VITE_TMDB_API_KEY;

console.log('[Groq Router] GROQ_API_KEY loaded:', groqApiKey ? 'yes' : 'no');
console.log('[Groq Router] Python backend URL:', PYTHON_BACKEND_URL);


const groq = groqApiKey
  ? new Groq({
      apiKey: groqApiKey
    })
  : null;

/**
 * Fetch trending movies from TMDB
 */
const fetchTrendingMovies = async (limit = 10) => {
  if (!tmdbApiKey) {
    return [];
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${tmdbApiKey}&language=en-US`
    );

    if (!response.ok) {
      throw new Error(`TMDB request failed: ${response.status}`);
    }

    const data = await response.json();
    return (data.results || [])
      .slice(0, limit)
      .map((movie) => ({
        title: movie.title,
        releaseDate: movie.release_date,
        rating: movie.vote_average
      }));
  } catch (error) {
    console.error('[TMDB] Error fetching trending movies:', error);
    return [];
  }
};

/**
 * Check if user query is asking for trending/latest/new movies
 */
const isMovieDataQuery = (query) => {
  const movieKeywords = ['trending', 'latest', 'new', 'release', 'popular', 'top', 'best', 'upcoming', 'now playing', 'current'];
  const lowerQuery = query.toLowerCase();
  return movieKeywords.some((keyword) => lowerQuery.includes(keyword));
};

const requirePythonBackend = (req, res, next) => {
  // For now, always allow - we have fallback logic
  next();
};

const callPythonBackend = async (endpoint, movieName) => {
  try {
    const response = await axios.post(`${PYTHON_BACKEND_URL}${endpoint}`, {
      movie_name: movieName
    }, {
      timeout: 10000 // 10 second timeout
    });
    return response.data;
  } catch (error) {
    console.error(`[Python Backend] Error calling ${endpoint}:`, error.message);
    throw error;
  }
};

const requireGroqKey = (req, res, next) => {
  if (!groq) {
    return res.status(503).json({
      error: 'Groq API is disabled. Set GROQ_API_KEY in the backend environment and restart the server.'
    });
  }
  next();
};

const getGroqMessageContent = (response) => {
  return response?.choices?.[0]?.message?.content || '';
};

const createGroqCompletion = async ({ messages, maxTokens = 250, temperature = 0.7 }) => {
  const response = await groq.chat.completions.create({
    messages,
    model: 'llama-3.3-70b-versatile',
    temperature,
    max_tokens: maxTokens
  });
  return getGroqMessageContent(response);
};

router.post('/recommendations', requirePythonBackend, async (req, res, next) => {
  try {
    const { movieName } = req.body;
    if (!movieName) {
      return res.status(400).json({ error: 'Movie name is required.' });
    }

    try {
      const data = await callPythonBackend('/recommend', movieName);
      res.json({ recommendations: data.recommendations || [] });
    } catch (pythonError) {
      console.error('[Python Backend] Recommendations failed, using fallback');
      // Fallback: return empty array or simple message
      res.json({ recommendations: [`Sorry, AI recommendations are currently unavailable. Please try again later.`] });
    }
  } catch (error) {
    console.error('[Backend] recommendations error:', error);
    next(error);
  }
});

router.post('/summary', requirePythonBackend, async (req, res, next) => {
  try {
    const { movieName } = req.body;
    if (!movieName) {
      return res.status(400).json({ error: 'Movie name is required.' });
    }

    try {
      const data = await callPythonBackend('/summary', movieName);
      res.json({ summary: data.summary || 'Summary not available.' });
    } catch (pythonError) {
      console.error('[Python Backend] Summary failed, using fallback');
      res.json({ summary: 'Sorry, AI summary is currently unavailable. Please try again later.' });
    }
  } catch (error) {
    console.error('[Backend] summary error:', error);
    next(error);
  }
});

router.post('/review', requirePythonBackend, async (req, res, next) => {
  try {
    const { movieName } = req.body;
    if (!movieName) {
      return res.status(400).json({ error: 'Movie name is required.' });
    }

    try {
      const data = await callPythonBackend('/review', movieName);
      res.json({ review: data.review || 'Review not available.' });
    } catch (pythonError) {
      console.error('[Python Backend] Review failed, using fallback');
      res.json({ review: 'Sorry, AI review is currently unavailable. Please try again later.' });
    }
  } catch (error) {
    console.error('[Backend] review error:', error);
    next(error);
  }
});

router.post('/chat', requireGroqKey, async (req, res, next) => {
  try {
    const { messages, movieContext } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages are required.' });
    }

    const contextText = movieContext?.title
      ? `The user is currently viewing ${movieContext.title} (${movieContext.year || 'unknown year'}), genre: ${movieContext.genre || 'unknown'}.`
      : 'The user is browsing the movie portal without a specific movie selected.';

    const systemPrompt = `You are a fun, knowledgeable movie expert chatbot. ${contextText} Answer questions about cast, director, trivia, behind-the-scenes facts, box office, awards, and fun facts. Keep answers under 120 words and be conversational.`;

    const reply = await createGroqCompletion({
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      maxTokens: 250,
      temperature: 0.7
    });

    res.json({ reply: reply.trim() || 'I am having trouble answering right now.' });
  } catch (error) {
    console.error('[Groq] chat error:', error);
    next(error);
  }
});

/**
 * Enhanced chat endpoint that includes real-time TMDB data
 * Detects if user is asking for trending/latest movies and includes that context
 */
router.post('/chat-with-movies', requireGroqKey, async (req, res, next) => {
  try {
    const { messages, movieContext, includeMovieData = false } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages are required.' });
    }

    // Get the latest user message
    const latestUserMessage = messages.length > 0 && messages[messages.length - 1]?.content ? messages[messages.length - 1].content : '';

    // Check if we should fetch trending movies
    const shouldFetchMovies = includeMovieData || isMovieDataQuery(latestUserMessage);
    let trendingMovies = [];
    let movieDataContext = '';

    if (shouldFetchMovies) {
      trendingMovies = await fetchTrendingMovies(5);

      if (trendingMovies.length > 0) {
        const movieList = trendingMovies
          .map((m) => `- ${m.title} (${m.releaseDate}) - Rating: ${(m.rating || 0).toFixed(1)}/10`)
          .join('\n');

        movieDataContext = `\n\nHere are some current trending movies:\n${movieList}\n`;
      }
    }

    const contextText = movieContext?.title
      ? `The user is currently viewing ${movieContext.title} (${movieContext.year || 'unknown year'}), genre: ${movieContext.genre || 'unknown'}.`
      : 'The user is browsing the movie portal.';

    const systemPrompt = `You are a fun, knowledgeable movie expert chatbot. ${contextText}${movieDataContext} Answer questions about cast, director, trivia, behind-the-scenes facts, box office, awards, and fun facts. When asked about trending or latest movies, reference the data provided above. Keep answers under 150 words and be conversational.`;

    const reply = await createGroqCompletion({
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      maxTokens: 300,
      temperature: 0.7
    });

    res.json({ 
      reply: reply.trim() || 'I am having trouble answering right now.',
      hadMovieData: movieDataContext ? true : false 
    });
  } catch (error) {
    console.error('[Groq] chat-with-movies error:', error);
    next(error);
  }
});

export default router;
