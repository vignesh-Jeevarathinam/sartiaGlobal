const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { sendEmail } = require('../services/emailService');

const addUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, role });
    // Send welcome email to the newly registered user
    await sendEmail({ to: email, subject: 'Welcome!', text: 'Welcome to our platform!' });
    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addUser };
