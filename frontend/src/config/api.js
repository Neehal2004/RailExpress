// Centralized API Base URL configuration for local dev and Render deployment
let API_BASE = import.meta.env.VITE_API_BASE_URL || '';

// Automatically prepend https:// if Render passes hostname (property: host)
if (API_BASE && !API_BASE.startsWith('http://') && !API_BASE.startsWith('https://')) {
  API_BASE = `https://${API_BASE}`;
}

export default API_BASE;
