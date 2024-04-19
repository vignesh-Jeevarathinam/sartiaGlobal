const nodemailer = require('nodemailer');
const email = '' //Please enter you Gmail 

//please ensure your email doesn't enable two-factor authentication

exports.sendEmail = async (emailData) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: email, 
        pass: '' // please enter your password for specific gmail
      }
    });

    const mailOptions = {
      from: email, 
      to: emailData.to,
      subject: emailData.subject, 
      text: emailData.text 
    };

    await transporter.sendMail(mailOptions);

    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Error sending email');
  }
};


exports.sendNewOrderNotification = async (userId, bookId, quantity) => {
  try {
    const superAdminEmail = 'superadmin@example.com'; 
    const book = await Book.findById(bookId);
    const user = await User.findById(userId);
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: email,
        pass: ''
      }
    });

    const mailOptions = {
      from: email,
      to: superAdminEmail,
      subject: 'New Book Order Notification',
      text: `Hello new book order has been placed: Book Title: ${book.title} Quantity: ${quantity} Ordered By: ${user.email}`
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending new order notification email:', error);
  }
};

