const express = require('express');
const mongoose = require('mongoose');
const Book = require('../models/Book');
const verifyJWT = require('../middleware/auth');

const router = express.Router();

/**
 * 1. GET /books — get all books (public)
 * Supports query parameters:
 *  - category: filter by category
 *  - search: filter by title or author regex
 *  - limit: limit results count (e.g., limit=6 for New Arrivals)
 *  - sort: 'newest' (createdAt desc)
 *  - userEmail: filter by added-by email (for My Books fallback)
 */
router.get('/', async (req, res) => {
  try {
    const { category, search, limit, sort, userEmail } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
      ];
    }

    if (userEmail) {
      query.userEmail = userEmail.toLowerCase();
    }

    let cursor = Book.find(query);

    if (sort === 'newest') {
      cursor = cursor.sort({ createdAt: -1 });
    } else {
      cursor = cursor.sort({ createdAt: -1 });
    }

    if (limit) {
      cursor = cursor.limit(parseInt(limit, 10));
    }

    const books = await cursor.exec();
    res.status(200).json({ success: true, count: books.length, data: books });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ success: false, message: 'Server error fetching books', error: error.message });
  }
});

/**
 * 2. GET /books/:id — get one book (protected with JWT)
 */
router.get('/:id', verifyJWT, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Book ID format' });
    }

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    res.status(200).json({ success: true, data: book });
  } catch (error) {
    console.error('Error fetching book by ID:', error);
    res.status(500).json({ success: false, message: 'Server error fetching book details', error: error.message });
  }
});

/**
 * 3. POST /books — add a book (protected with JWT)
 */
router.post('/', verifyJWT, async (req, res) => {
  try {
    const { title, author, category, image, description, totalCopies, userName, userEmail } = req.body;

    if (!title || !author || !category || !image || !description) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields' });
    }

    const copies = Number(totalCopies) >= 0 ? Number(totalCopies) : 1;

    // Use token email / payload if provided, or body fallback
    const finalEmail = req.user?.email || userEmail;
    const finalName = req.user?.name || userName || 'Library Contributor';

    const newBook = new Book({
      title: title.trim(),
      author: author.trim(),
      category,
      image: image.trim(),
      description: description.trim(),
      totalCopies: copies,
      userName: finalName,
      userEmail: finalEmail.toLowerCase(),
    });

    const savedBook = await newBook.save();
    res.status(201).json({ success: true, message: 'Book added successfully!', data: savedBook });
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ success: false, message: 'Server error creating book', error: error.message });
  }
});

/**
 * 4. PATCH /books/:id — update a book (protected with JWT)
 */
router.patch('/:id', verifyJWT, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Book ID format' });
    }

    const updates = { ...req.body };
    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;

    if (updates.totalCopies !== undefined) {
      updates.totalCopies = Number(updates.totalCopies);
      if (updates.totalCopies < 0) {
        return res.status(400).json({ success: false, message: 'Total copies cannot be negative' });
      }
    }

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    res.status(200).json({ success: true, message: 'Book updated successfully!', data: updatedBook });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ success: false, message: 'Server error updating book', error: error.message });
  }
});

/**
 * 5. DELETE /books/:id — delete a book (protected with JWT)
 */
router.delete('/:id', verifyJWT, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Book ID format' });
    }

    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    res.status(200).json({ success: true, message: 'Book deleted successfully!', data: deletedBook });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ success: false, message: 'Server error deleting book', error: error.message });
  }
});

module.exports = router;
