const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const { authenticateUser } = require('./middleware/authMiddleware');

const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb+srv://vigneshjeevarathinam1:KLOnxycsbtuH0dS@cluster0.yoznnze.mongodb.net/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("MongoDB connected");
})
.catch((err) => {
  console.error("MongoDB connection error:", err);
});

app.use('/auth', authRoutes); 
app.use('/books', authenticateUser, bookRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
