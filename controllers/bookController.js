const Book = require('../models/Book');
const User = require('../models/User');

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json({ books });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createBook = async (req, res) => {
  try {
    const { title, author, description } = req.body;
    const createdBy = req.user.userId; // Extracted from JWT token
    const book = await Book.create({ title, author, description, createdBy });
    // Send email to Super Admin about the new book
    res.status(201).json({ book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBook = await Book.findByIdAndUpdate(id, req.body, { new: true });
    // Send email to Super Admin about the updated book
    res.json({ book: updatedBook });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    await Book.findByIdAndDelete(id);
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
