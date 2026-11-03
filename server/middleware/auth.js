const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Unauthorized access: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized access: Malformed token header' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Forbidden access: Invalid or expired token' });
    }
    req.user = decoded;
    next();
  });
};

module.exports = verifyJWT;
