const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const verifyJWT = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Helper to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
      photoURL: user.photoURL,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * Password validation rule:
 * - Must have an Uppercase letter
 * - Must have a Lowercase letter
 * - Length must be at least 6 characters
 */
const validatePassword = (password) => {
  if (!password || password.length < 6) {
    return 'Password must be at least 6 characters long.';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter.';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter.';
  }
  return null;
};

/**
 * POST /auth/register
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, photoURL, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return res.status(400).json({ success: false, message: passwordError });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name: name.trim(),
      email: normalizedEmail,
      photoURL: photoURL && photoURL.trim() ? photoURL.trim() : undefined,
      password: hashedPassword,
      provider: 'credentials',
    });

    const savedUser = await newUser.save();
    const token = generateToken(savedUser);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully!',
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        photoURL: savedUser.photoURL,
      },
    });
  } catch (error) {
    console.error('Error in registration:', error);
    res.status(500).json({ success: false, message: 'Server error during registration', error: error.message });
  }
});

/**
 * POST /auth/login
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: 'This account was created with Google OAuth. Please use Google Login.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
      },
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ success: false, message: 'Server error during login', error: error.message });
  }
});

/**
 * POST /auth/google - Social login handler
 */
router.post('/google', async (req, res) => {
  try {
    const { name, email, photoURL } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required for Google login.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      user = new User({
        name: name || 'Google Reader',
        email: normalizedEmail,
        photoURL: photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        provider: 'google',
      });
      await user.save();
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Google login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
      },
    });
  } catch (error) {
    console.error('Error in google auth:', error);
    res.status(500).json({ success: false, message: 'Server error during Google auth', error: error.message });
  }
});

/**
 * GET /auth/me - Validate token and get current user
 */
router.get('/me', verifyJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error validating token' });
  }
});

module.exports = router;
