// Authentication middleware placeholder
const authenticate = (req, res, next) => {
  // TODO: Implement JWT token verification
  req.user = { id: 'mock-user-id', role: 'student' };
  next();
};

module.exports = { authenticate };
