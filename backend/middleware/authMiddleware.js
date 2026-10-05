const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'swachhdisha_jwt_super_secret_key_2026_secure';

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No authentication token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired authentication token.' });
  }
}

function optionalToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch (error) {
      // Ignore invalid token for optional routes
      req.user = null;
    }
  } else {
    req.user = null;
  }
  next();
}

function requireRole(requiredRole) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    if (req.user.role !== requiredRole) {
      return res.status(403).json({
        message: `Forbidden. This operation requires ${requiredRole} privileges.`,
      });
    }

    next();
  };
}

module.exports = {
  verifyToken,
  optionalToken,
  requireRole,
};
