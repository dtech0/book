const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    photoURL: {
      type: String,
    },
    password: {
      type: String,
      required: false, // Optional for Google OAuth users
    },
    provider: {
      type: String,
      default: 'credentials',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
