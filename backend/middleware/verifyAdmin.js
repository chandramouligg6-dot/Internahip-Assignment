// verifyAdmin middleware
// This runs AFTER verifyToken
// By the time this runs, req.user is already set

const verifyAdmin = (req, res, next) => {
  // Check the role that was decoded from the token
  if (req.user.role !== 'admin') {
    // If not admin — block access with 403 Forbidden
    return res.status(403).json({
      message: '❌ Access denied. Admins only.'
    });
  }

  // If admin — allow access
  next();
};

module.exports = verifyAdmin;