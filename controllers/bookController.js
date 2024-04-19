const Book = require('../models/Book');
const User = require('../models/User');
const { sendEmail } = require('../services/emailService');

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
    const createdBy = req.user.userId; 
    const book = await Book.create({ title, author, description, createdBy });
    await sendEmail({ to: '', subject: 'Create Book', text: 'Book created successfully' });
    res.status(201).json({ book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBook = await Book.findByIdAndUpdate(id, req.body, { new: true });
    await sendEmail({ to: '', subject: 'update Book', text: 'Book updated successfully' });   
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


exports.approveBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBook = await Book.findByIdAndUpdate(id, { status: 'approved' }, {new: true});
    await updatedBook.save();
    res.status(200).json({ message: 'Book approved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.rejectBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBook =  await Book.findByIdAndUpdate(id, { status: 'rejected' });
    const admin = await User.findById(updatedBook.adminId);
    await sendEmail({ to: admin.email, subject: 'Book Rejection Notification', text: `Dear Admin your ${updatedBook.title} has been rejected` });   
    res.status(200).json({ message: 'Book rejected successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
