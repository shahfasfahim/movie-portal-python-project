const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

/**
 * Detect if user is asking for movie data (trending/latest/new movies)
 */
export const isMovieDataQuery = (query) => {
  if (!query) return false;
  const movieKeywords = ['trending', 'latest', 'new', 'release', 'popular', 'top', 'best', 'upcoming', 'now playing', 'current'];
  const lowerQuery = query.toLowerCase();
  return movieKeywords.some((keyword) => lowerQuery.includes(keyword));
};

const buildFetchErrorMessage = (error, endpoint) => {
  const message = error?.message || '';
  if (message.includes('Failed to fetch')) {
    return `Unable to reach the AI backend at ${API_BASE_URL}. Please make sure the backend server is running.`;
  }
  if (message.includes('Network request failed') || message.includes('NetworkError')) {
    return `Network error while contacting ${endpoint}. Check your connection and backend server.`;
  }
  return message || `Request to ${endpoint} failed.`;
};

/**
 * Get Groq API recommendations for a movie
 * @param {string} movieName - Name of the movie to get recommendations for
 * @returns {Promise<string[]>} Array of recommended movie names
 */
export const getGroqRecommendations = async (movieName) => {
  if (!movieName) {
    throw new Error('Movie name is required');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/groq/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ movieName })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `Groq API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.recommendations || [];
  } catch (error) {
    throw error;
  }
};

export const generateMovieSummary = async ({ title }) => {
  if (!title) {
    throw new Error('Movie title is required for summary generation.');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/groq/summary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ movieName: title })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `Groq API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.summary || '';
  } catch (error) {
    throw error;
  }
};

export const generateMovieReview = async ({ title }) => {
  if (!title) {
    throw new Error('Movie title is required for review generation.');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/groq/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ movieName: title })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `Groq API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return { review: data.review || '', score: null };
  } catch (error) {
    throw error;
  }
};

export const chatWithMovieBot = async (messages, movieContext) => {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error('Messages are required for chat.');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/groq/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages, movieContext })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `Groq API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.reply || 'I am having trouble answering right now.';
  } catch (error) {
    const message = buildFetchErrorMessage(error, '/api/groq/chat');
    throw new Error(message);
  }
};

/**
 * Enhanced chat with real-time TMDB movie data
 * Automatically includes trending movies context when relevant
 * @param {Array} messages - Chat message history
 * @param {Object} movieContext - Current movie context
 * @param {boolean} includeMovieData - Force inclusion of movie data
 * @returns {Promise<Object>} { reply, hadMovieData }
 */
export const chatWithMovieBotEnhanced = async (messages, movieContext, includeMovieData = false) => {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error('Messages are required for chat.');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/groq/chat-with-movies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages, movieContext, includeMovieData })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `Groq API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return {
      reply: data.reply || 'I am having trouble answering right now.',
      hadMovieData: data.hadMovieData || false
    };
  } catch (error) {
    const message = buildFetchErrorMessage(error, '/api/groq/chat-with-movies');
    throw new Error(message);
  }
};
