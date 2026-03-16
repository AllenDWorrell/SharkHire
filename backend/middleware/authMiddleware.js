// Auth middleware – protects private routes using JWT
// TODO: Install jsonwebtoken and implement token verification

const protect = async (req, res, next) => {
  // Placeholder: allow all requests through until JWT is implemented
  // TODO: Extract Bearer token from Authorization header, verify with jwt.verify()
  next();
};

module.exports = { protect };
