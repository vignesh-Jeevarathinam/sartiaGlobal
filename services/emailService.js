const nodemailer = require('nodemailer');
const email = 'vigneshjeevarathinam1@gmail.com'

const sendEmail = async (emailData) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: email, // Your Gmail email address
        pass: 'yourpassword' // Your Gmail password or app-specific password
      }
    });

    const mailOptions = {
      from: email, // Sender address
      to: emailData.to, // Recipient address
      subject: emailData.subject, // Email subject
      text: emailData.text // Plain text body of the email
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Error sending email');
  }
};

module.exports = { sendEmail };
