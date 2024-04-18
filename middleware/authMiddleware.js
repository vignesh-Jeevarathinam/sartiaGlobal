const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  // Get token from request headers or cookies
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  // Verify token
  jwt.verify(token, 'secretkey', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    // Attach user data to request object
    req.user = decoded;
    next();
  });
};

const authorizeUser = (requiredRole) => (req, res, next) => {
  if (req.user.role !== requiredRole) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  next();
};

module.exports = { authenticateUser, authorizeUser };
