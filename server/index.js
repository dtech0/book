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

// Connect to MongoDB (handles both local Node and Vercel serverless lifecycle)
let isConnected = false;
const connectDB = async () => {
  if (isConnected || (mongoose.connection && mongoose.connection.readyState >= 1)) {
    return;
  }
  try {
    if (!MONGODB_URI) {
      console.warn('MONGODB_URI environment variable is missing.');
      return;
    }
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log('Connected to MongoDB successfully.');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
  }
};

// Ensure database connection for all requests in serverless environment
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Start local server if not running in serverless environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`BookNook Express server running on port ${PORT}`);
    });
  });
}

module.exports = app;

