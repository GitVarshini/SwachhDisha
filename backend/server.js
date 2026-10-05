const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { testConnection } = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend development
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing with capacity for data URLs
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  return res.json({
    status: 'ok',
    message: 'SwachhDisha API is running',
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/map', require('./routes/mapRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// 404 Handler
app.use((req, res) => {
  return res.status(404).json({
    message: `Endpoint ${req.method} ${req.originalUrl} not found on SwachhDisha server.`,
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  const status = err.status || 500;
  return res.status(status).json({
    message: err.message || 'Internal server error occurred.',
  });
});

// Start Server & verify database
app.listen(PORT, async () => {
  console.log(`🚀 SwachhDisha Backend running at http://localhost:${PORT}`);
  await testConnection();
});

module.exports = app;
