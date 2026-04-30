// youtube.js
// Utility for safely fetching a YouTube trailer using environment variables.

const getYoutubeApiKey = () => {
  return import.meta.env.VITE_YOUTUBE_API_KEY || '';
};

export const fetchTrailer = async (movieName) => {
  if (!movieName) {
    throw new Error('Movie name is required to fetch a trailer.');
  }

  const apiKey = getYoutubeApiKey();
  if (!apiKey) {
    throw new Error('YouTube API key is missing. Add VITE_YOUTUBE_API_KEY to your .env file.');
  }

  const query = encodeURIComponent(`${movieName} official trailer`);
  const endpoint = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${query}&key=${apiKey}`;

  const response = await fetch(endpoint);
  if (!response.ok) {
    const errorDetails = await response.json().catch(() => null);
    const message = errorDetails?.error?.message || 'YouTube request failed.';
    throw new Error(message);
  }

  const data = await response.json();
  const videoId = data?.items?.[0]?.id?.videoId;

  if (!videoId) {
    throw new Error('No trailer found for this movie on YouTube.');
  }

  return videoId;
};
