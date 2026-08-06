// Centralized API Base URL configuration for local dev and Render deployment
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export default API_BASE;
