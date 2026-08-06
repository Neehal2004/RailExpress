// Centralized API Base URL configuration for local dev and Render deployment
const rawEnv = import.meta.env.VITE_API_BASE_URL;

function getApiBase() {
  if (!rawEnv) return '';
  let url = String(rawEnv).trim();
  if (url === '' || url === 'undefined' || url === 'null') return '';

  // If Render internal hostname is passed without domain extension (e.g. 'rtbs-backend-vuvv')
  if (!url.includes('.') && !url.includes('localhost')) {
    url = `${url}.onrender.com`;
  }

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }

  return url.replace(/\/+$/, '');
}

const API_BASE = getApiBase();
export default API_BASE;
