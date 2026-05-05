const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: '❌ Access denied. No token provided.' });
  }

  // Extract token from "Bearer tokenvalue"
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: '❌ Access denied. Token missing.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user info to request
    // This includes id, email AND role!
    req.user = decoded;

    next();

  } catch (error) {
    res.status(403).json({ message: '❌ Invalid or expired token.' });
  }
};

module.exports = verifyToken;