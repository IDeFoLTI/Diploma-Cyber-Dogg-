const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function resolveImageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const base = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
  const p = path.startsWith('/') ? path : '/' + path;
  return base + p;
}
