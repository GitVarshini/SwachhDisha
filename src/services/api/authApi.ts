import { User } from '../../types';
import { client } from './client';
import { USE_MOCK_API, TOKEN_STORAGE_KEY } from './config';
import { mockAuthApi } from '../mock/mockAuthApi';

/**
 * Authentication API Service
 * Supports both real Express REST backend and mock mode
 */
export const authApi = {
  async login(email: string, pass: string): Promise<{ user: User; token: string }> {
    if (USE_MOCK_API) {
      return mockAuthApi.login(email, pass);
    }

    const res = await client.post<{ user: User; token: string }>('/auth/login', {
      email,
      password: pass,
    });

    if (res.token) {
      try {
        localStorage.setItem(TOKEN_STORAGE_KEY, res.token);
      } catch (e) {
        console.warn('Could not store token in localStorage', e);
      }
    }

    return res;
  },

  async logout(): Promise<void> {
    if (USE_MOCK_API) {
      return mockAuthApi.logout();
    }

    try {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch (e) {
      console.warn('Could not remove token from localStorage', e);
    }
  },

  async getCurrentUser(): Promise<User | null> {
    if (USE_MOCK_API) {
      return mockAuthApi.getCurrentUser();
    }

    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) {
      return null;
    }

    try {
      const res = await client.get<{ user: User }>('/auth/me');
      return res.user || null;
    } catch (err) {
      // If token is expired or invalid, clear it
      try {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      } catch (e) {}
      return null;
    }
  },
};
