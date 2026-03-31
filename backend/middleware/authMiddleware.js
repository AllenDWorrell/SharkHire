// Auth middleware – protects private routes using JWT
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized – no token' });
    }

    const token = authHeader.slice(7); // Remove "Bearer " prefix

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized – invalid token' });
    }

    // Get user from token
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Attach user to request object
    req.user = { id: user._id, role: user.role };
    next();
  } catch (error) {
    res.status(500).json({ message: 'Auth middleware error', error: error.message });
  }
};

module.exports = { protect };
