// Auth controller – handles user registration and login logic
// TODO: Implement JWT-based authentication

// @desc  Register a new user
// @route POST /api/auth/register
const registerUser = async (req, res) => {
  res.status(201).json({ message: 'registerUser – not yet implemented' });
};

// @desc  Login an existing user
// @route POST /api/auth/login
const loginUser = async (req, res) => {
  res.status(200).json({ message: 'loginUser – not yet implemented' });
};

// @desc  Get currently authenticated user profile
// @route GET /api/auth/me
const getMe = async (req, res) => {
  res.status(200).json({ message: 'getMe – not yet implemented' });
};

module.exports = { registerUser, loginUser, getMe };
