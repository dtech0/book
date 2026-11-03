const mongoose = require('mongoose');

const borrowSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: [true, 'Book ID is required'],
    },
    bookTitle: {
      type: String,
      required: [true, 'Book title is required'],
    },
    bookImage: {
      type: String,
      required: [true, 'Book image is required'],
    },
    userEmail: {
      type: String,
      required: [true, 'User email is required'],
      trim: true,
      lowercase: true,
    },
    userName: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
    },
    borrowDate: {
      type: String,
      required: [true, 'Borrow date is required'],
    },
    returnDate: {
      type: String,
      required: [true, 'Return date is required'],
    },
    status: {
      type: String,
      enum: ['borrowed', 'returned'],
      default: 'borrowed',
    },
  },
  {
    timestamps: true,
  }
);

// Index to quickly enforce or query active user borrows
borrowSchema.index({ bookId: 1, userEmail: 1, status: 1 });

module.exports = mongoose.models.Borrow || mongoose.model('Borrow', borrowSchema);
