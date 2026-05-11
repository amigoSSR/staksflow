/**
 * middleware/admin.js
 * Verifies JWT AND checks role === 'admin'.
 */
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'taskflow_secret_change_in_prod';

const adminMiddleware = (req, res, next) => {
  const header = req.headers['authorization'];
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Akses ditolak. Login terlebih dahulu.' });
  }
  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Akses admin diperlukan.' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Token tidak valid atau sudah kedaluwarsa.' });
  }
};

module.exports = adminMiddleware;
