const User = require('../models/User');
const { sendNewOrderNotification } = require('../services/emailService');

exports.purchaseBook = async (req, res) => {
  try {
    const { bookId, quantity } = req.body;
    
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }    
    book.quantity -= quantity;
    book.sales += quantity;
    await book.save();   
    const userId = req.user.userId; 
    const user = await User.findById(userId);
    user.purchaseHistory.push({
      book: bookId,
      quantity,
      totalPrice: book.price * quantity,
      purchaseDate: new Date()
    });
    await user.save();
    await sendNewOrderNotification(userId, bookId, quantity)
    res.status(200).json({ message: 'Book purchased successfully' });
  } catch (error) {
    console.error('Error purchasing book:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
