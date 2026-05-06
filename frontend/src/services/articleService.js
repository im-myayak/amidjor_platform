const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * Fetch published articles
 * @param {number} limit - Number of articles to fetch
 */
export async function fetchArticles(limit = null) {
  const url = new URL(`${API_URL}/articles/`);
  if (limit) {
    url.searchParams.append('limit', limit);
  }
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch articles');
  }
  return response.json();
}

/**
 * Fetch single article by slug
 * @param {string} slug - Article slug
 */
export async function fetchArticleBySlug(slug) {
  const response = await fetch(`${API_URL}/articles/${slug}/`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Article not found');
    }
    throw new Error('Failed to fetch article');
  }
  return response.json();
}
