/**
 * Centralized API Configuration
 * 
 * When connected to Express backend:
 * Default: /api (proxied via Vite or reverse proxy)
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Toggle for mock vs live Express server.
 * Set to false for live backend.
 * Can be overridden via VITE_USE_MOCK_API=true
 */
export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

export const TOKEN_STORAGE_KEY = 'swachhdisha_token';
