/**
 * middleware/auth.js
 * Verifies JWT token from Authorization header.
 * Attaches req.user = { id, username, email } on success.
 */
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'taskflow_secret_change_in_prod';

const authMiddleware = (req, res, next) => {
  const header = req.headers['authorization'];
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Akses ditolak. Login terlebih dahulu.' });
  }

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Token tidak valid atau sudah kedaluwarsa.' });
  }
};

module.exports = authMiddleware;
