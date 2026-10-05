import { User } from '../../types';
import { MOCK_USERS, getStoredAuthUser, saveStoredAuthUser } from '../../data/mockData';

// Simulated delay helper for realistic UX feel
const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockAuthApi = {
  async login(email: string, pass: string): Promise<{ user: User; token: string }> {
    await delay(350);
    const normalizedEmail = email.trim().toLowerCase();

    // Check admin credentials
    if (normalizedEmail === 'admin@swachhdisha.com' && pass === 'admin123') {
      const adminUser = MOCK_USERS[0];
      saveStoredAuthUser(adminUser);
      return { user: adminUser, token: 'mock-jwt-admin-token-12345' };
    }

    // Citizen demo login
    if (normalizedEmail === 'varshini.amudala06@gmail.com' || normalizedEmail.includes('citizen')) {
      const citizenUser = MOCK_USERS[1];
      saveStoredAuthUser(citizenUser);
      return { user: citizenUser, token: 'mock-jwt-citizen-token-67890' };
    }

    // Allow generic admin email for flexibility
    if (pass === 'admin123') {
      const genericAdmin: User = {
        id: 'usr_admin_custom',
        name: 'Municipal Administrator',
        email: normalizedEmail,
        role: 'ADMIN',
      };
      saveStoredAuthUser(genericAdmin);
      return { user: genericAdmin, token: 'mock-jwt-admin-token-custom' };
    }

    throw new Error('Invalid email or password. Use demo credentials shown on the login screen.');
  },

  async logout(): Promise<void> {
    await delay(150);
    saveStoredAuthUser(null);
  },

  async getCurrentUser(): Promise<User | null> {
    await delay(100);
    return getStoredAuthUser();
  },
};
