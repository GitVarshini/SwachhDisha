const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'swachhdisha_jwt_super_secret_key_2026_secure';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * POST /api/auth/login
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const [users] = await pool.query(
      'SELECT id, name, email, password_hash, phone, role FROM users WHERE LOWER(email) = ?',
      [normalizedEmail]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during authentication.', error: error.message });
  }
}

/**
 * POST /api/auth/register
 */
async function register(req, res) {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const [existing] = await pool.query('SELECT id FROM users WHERE LOWER(email) = ?', [normalizedEmail]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const userRole = role === 'ADMIN' ? 'ADMIN' : 'CITIZEN';
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = `usr_${userRole === 'ADMIN' ? 'admin' : 'cit'}_${Date.now()}`;

    await pool.query(
      'INSERT INTO users (id, name, email, password_hash, phone, role) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, name.trim(), normalizedEmail, passwordHash, phone ? phone.trim() : null, userRole]
    );

    const token = jwt.sign(
      {
        id: userId,
        email: normalizedEmail,
        role: userRole,
        name: name.trim(),
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(201).json({
      user: {
        id: userId,
        name: name.trim(),
        email: normalizedEmail,
        phone: phone || null,
        role: userRole,
      },
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server error during registration.', error: error.message });
  }
}

/**
 * GET /api/auth/me
 */
async function getCurrentUser(req, res) {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, phone, role FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User profile not found.' });
    }

    return res.json({ user: users[0] });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ message: 'Server error fetching user profile.', error: error.message });
  }
}

module.exports = {
  login,
  register,
  getCurrentUser,
};
