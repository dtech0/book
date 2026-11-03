const express = require('express');
const mongoose = require('mongoose');
const Borrow = require('../models/Borrow');
const Book = require('../models/Book');
const verifyJWT = require('../middleware/auth');

const router = express.Router();

/**
 * 6. POST /borrows — borrow a book (protected with JWT)
 * Challenge 1: decrease copies by 1 with $inc.
 * Challenge 2: No double borrow (user cannot borrow same book two times at the same time).
 */
router.post('/', verifyJWT, async (req, res) => {
  try {
    const { bookId, bookTitle, bookImage, returnDate, userEmail, userName } = req.body;

    if (!bookId || !returnDate) {
      return res.status(400).json({ success: false, message: 'Book ID and Return Date are required' });
    }

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ success: false, message: 'Invalid Book ID format' });
    }

    const email = (req.user?.email || userEmail || '').toLowerCase();
    const name = req.user?.name || userName || 'Library Member';

    if (!email) {
      return res.status(400).json({ success: false, message: 'User email is required to borrow' });
    }

    // Challenge 2: Check if user already has an active borrow for this book
    const existingBorrow = await Borrow.findOne({
      bookId,
      userEmail: email,
      status: 'borrowed',
    });

    if (existingBorrow) {
      return res.status(400).json({
        success: false,
        message: 'You have already borrowed this book. Please return it before borrowing again.',
      });
    }

    // Challenge 1: Find book and decrement totalCopies with $inc atomically if totalCopies > 0
    const updatedBook = await Book.findOneAndUpdate(
      { _id: bookId, totalCopies: { $gt: 0 } },
      { $inc: { totalCopies: -1 } },
      { new: true }
    );

    if (!updatedBook) {
      return res.status(400).json({
        success: false,
        message: 'Sorry, this book is currently Not Available (0 copies left).',
      });
    }

    const borrowRecord = new Borrow({
      bookId,
      bookTitle: bookTitle || updatedBook.title,
      bookImage: bookImage || updatedBook.image,
      userEmail: email,
      userName: name,
      borrowDate: new Date().toISOString().split('T')[0],
      returnDate,
      status: 'borrowed',
    });

    const savedBorrow = await borrowRecord.save();

    res.status(201).json({
      success: true,
      message: `Successfully borrowed "${updatedBook.title}"!`,
      data: savedBorrow,
      remainingCopies: updatedBook.totalCopies,
    });
  } catch (error) {
    console.error('Error borrowing book:', error);
    res.status(500).json({ success: false, message: 'Server error processing borrow', error: error.message });
  }
});

/**
 * 7. GET /borrows — get the borrows of the logged in user (protected with JWT)
 */
router.get('/', verifyJWT, async (req, res) => {
  try {
    const userEmail = (req.user?.email || req.query.userEmail || '').toLowerCase();

    if (!userEmail) {
      return res.status(400).json({ success: false, message: 'User email is required' });
    }

    const borrows = await Borrow.find({
      userEmail,
      status: 'borrowed',
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: borrows.length, data: borrows });
  } catch (error) {
    console.error('Error fetching user borrows:', error);
    res.status(500).json({ success: false, message: 'Server error fetching borrows', error: error.message });
  }
});

/**
 * 8. DELETE /borrows/:id — return a book (protected with JWT)
 * Challenge 1: increase copies by 1 with $inc.
 */
router.delete('/:id', verifyJWT, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Borrow ID format' });
    }

    const borrow = await Borrow.findById(id);
    if (!borrow) {
      return res.status(404).json({ success: false, message: 'Borrow record not found' });
    }

    // Increment book totalCopies by 1
    if (borrow.bookId) {
      await Book.findByIdAndUpdate(borrow.bookId, { $inc: { totalCopies: 1 } });
    }

    // Delete the borrow record (or mark returned)
    await Borrow.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: `Book "${borrow.bookTitle}" returned successfully! Thank you.`,
      returnedBookId: borrow.bookId,
    });
  } catch (error) {
    console.error('Error returning borrowed book:', error);
    res.status(500).json({ success: false, message: 'Server error returning book', error: error.message });
  }
});

module.exports = router;
