const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');

const generateToken = (userId, role) => {
    return jwt.sign({ userId, role }, 'secretkey', { expiresIn: '1h' });
  };

exports.signup = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, role });
    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    const token = generateToken(user._id, user.role);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Generate token and set expiration time
      const token = generateToken();
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
      await user.save();
  
      // Send email with reset link
      await sendEmail(email, token);
  
      res.status(200).json({ message: 'Reset password link sent to your email' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const sendEmail = async (email, token) => {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'your.email@gmail.com',
          pass: 'yourpassword'
        }
      });
  
      const mailOptions = {
        from: 'your.email@gmail.com',
        to: email,
        subject: 'Password Reset',
        text: `To reset your password, click on this link: http://localhost:3000/reset-password/${token}`
      };
  
      await transporter.sendMail(mailOptions);
    } catch (error) {
      throw new Error('Error sending email');
    }
  };