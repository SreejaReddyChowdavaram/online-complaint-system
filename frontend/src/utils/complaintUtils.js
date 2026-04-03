/**
 * Standardizes raw category input into snake_case translation keys.
 */
export const formatCategoryKey = (raw) => {
  if (!raw) return 'other';
  return raw
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_')    // Replace spaces with underscores
    .replace(/-/g, '_')      // Replace hyphens with underscores
    .replace(/[^\w]/g, '');  // Remove non-alphanumeric chars
};

/**
 * Robustly translates a complaint category with a human-readable fallback.
 */
export const getCategoryLabel = (category, t) => {
  if (!category) return t('complaints.categories.other') || 'Other';

  // 1. Try direct lookup (Legacy Support)
  let translated = t(`complaints.categories.${category}`);
  
  // 2. If it returns the key, try standardized snake_case lookup
  if (translated === `complaints.categories.${category}`) {
    const key = formatCategoryKey(category);
    translated = t(`complaints.categories.${key}`);
    
    // 3. If still returning key, generate a formatted fallback
    if (translated === `complaints.categories.${key}`) {
      return category
        .replace(/_/g, ' ')
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase())
        .trim();
    }
  }

  return translated;
};

/**
 * Resolves an image path into a full absolute URL.
 * Handles:
 * - Full URLs (Cloudinary/S3)
 * - Relative local paths (standardizing to backend base)
 * - Raw filenames
 */
export const getImgUrl = (path) => {
  if (!path) return null;
  
  // If it's already a full URL, return it
  if (path.startsWith('http')) return path;
  
  // Base URL from env or fallback to localhost
  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  // Ensure we don't double up on /uploads
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  if (cleanPath.startsWith('uploads')) {
    return `${BASE_URL}/${cleanPath}`;
  }
  
  return `${BASE_URL}/uploads/${cleanPath}`;
};
