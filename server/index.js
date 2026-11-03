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

// Root API Health route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    project: 'BookNook – A Small Online Library API',
    version: '1.0.0',
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

// Connect to MongoDB and start server
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully.');
    app.listen(PORT, () => {
      console.log(`BookNook Express server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.warn('MongoDB connection failed on start:', err.message);
    console.log('Starting HTTP server in fallback mode (database reconnecting in background)...');
    app.listen(PORT, () => {
      console.log(`BookNook Express server running on port ${PORT} (waiting for MongoDB)`);
    });
  });
