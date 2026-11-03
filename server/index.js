require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const booksRoutes = require('./routes/books');
const borrowsRoutes = require('./routes/borrows');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB (cached connection for local Node and Vercel serverless)
let isConnected = false;
const connectDB = async () => {
  if (isConnected || (mongoose.connection && mongoose.connection.readyState >= 1)) {
    return;
  }
  try {
    if (!MONGODB_URI) {
      console.warn('MONGODB_URI environment variable is missing.');
      throw new Error('MONGODB_URI environment variable is missing.');
    }
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log('Connected to MongoDB successfully.');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    throw err;
  }
};

// Middleware
app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());

// Request logger for development insight
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Ensure database connection for all requests BEFORE hitting any routes
app.use(async (req, res, next) => {
  // Allow root health check to respond even if DB is connecting
  if (req.path === '/') {
    return next();
  }
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed. Please ensure MONGODB_URI is configured.',
      error: err.message,
    });
  }
});

// Root API Health route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    project: 'BookNook – A Small Online Library API',
    version: '1.0.0',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    endpoints: {
      books: '/books',
      borrows: '/borrows',
      auth: '/auth',
    },
  });
});

// Mount Routes
app.use('/books', booksRoutes);
app.use('/borrows', borrowsRoutes);
app.use('/auth', authRoutes);

// Central 404 handler for API routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start local server if not running in serverless environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`BookNook Express server running on port ${PORT}`);
    });
  }).catch((err) => {
    console.error('Failed to connect to DB on start:', err);
  });
}

module.exports = app;
