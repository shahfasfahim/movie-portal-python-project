const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

export const getImageUrl = (path, size = 'w300') => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
};

export const getPosterUrl = (posterPath) => {
  return getImageUrl(posterPath, 'w300') || 'https://via.placeholder.com/300x450?text=No+Poster';
};

export const getBackdropUrl = (backdropPath) => {
  return getImageUrl(backdropPath, 'w1280') || 'https://via.placeholder.com/1280x720?text=No+Backdrop';
};

export const getProfileUrl = (profilePath) => {
  return getImageUrl(profilePath, 'w200') || 'https://via.placeholder.com/200x300?text=No+Image';
};
