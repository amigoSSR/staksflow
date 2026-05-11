/**
 * routes/auth.js
 * Authentication endpoints: register, login, get current user.
 */
const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const { register, login, findById } = require('../services/authService');
const authMiddleware = require('../middleware/auth');
const prisma = require('../prisma/client');

const JWT_SECRET  = process.env.JWT_SECRET  || 'taskflow_secret_change_in_prod';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

const signToken = (user) =>
  jwt.sign({ id: user.id, username: user.username, email: user.email, role: user.role || 'user' }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

// ── POST /api/auth/register ─────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ success: false, error: 'Semua field wajib diisi' });

    if (username.trim().length < 3)
      return res.status(400).json({ success: false, error: 'Username minimal 3 karakter' });

    if (password.length < 6)
      return res.status(400).json({ success: false, error: 'Password minimal 6 karakter' });

    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRx.test(email))
      return res.status(400).json({ success: false, error: 'Format email tidak valid' });

    const user  = await register({ username, email, password });
    const token = signToken(user);

    // Emit realtime event to admins
    const io = req.app.get('io');
    if (io) {
      io.to('admin_room').emit('user_registered', { user });
    }

    res.status(201).json({ success: true, message: 'Registrasi berhasil!', token, user });
  } catch (err) {
    res.status(409).json({ success: false, error: err.message });
  }
});

// ── POST /api/auth/login ────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password)
      return res.status(400).json({ success: false, error: 'Identifier dan password wajib diisi' });

    const user  = await login({ identifier, password });
    const token = signToken(user);

    res.json({ success: true, message: 'Login berhasil!', token, user });
  } catch (err) {
    res.status(401).json({ success: false, error: err.message });
  }
});

// ── GET /api/auth/me ────────────────────────────────────────────────────────
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, error: 'User tidak ditemukan' });
    res.json({ success: true, user: { id: user.id, username: user.username, email: user.email, role: user.role || 'user' } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ── POST /api/auth/promote-first-admin (No auth - setup only) ───────────────
router.post('/promote-first-admin', async (req, res) => {
  try {
    const { username, secret } = req.body;
    const SETUP_SECRET = process.env.ADMIN_SETUP_SECRET || 'taskflow-admin-setup-2024';
    if (secret !== SETUP_SECRET)
      return res.status(403).json({ success: false, error: 'Setup secret salah.' });
      
    const existingAdmin = await prisma.user.findFirst({ where: { role: 'admin' } });
    if (existingAdmin)
      return res.status(400).json({ success: false, error: 'Admin sudah ada. Gunakan panel admin untuk mengubah role.' });
      
    const userToPromote = await prisma.user.findUnique({ where: { username } });
    if (!userToPromote)
      return res.status(404).json({ success: false, error: `User '${username}' tidak ditemukan. Daftar dulu.` });

    await prisma.user.update({
      where: { username },
      data: { role: 'admin' }
    });
    
    res.json({ success: true, message: `✅ '${username}' sekarang adalah admin. Login ulang untuk masuk ke Admin Dashboard.` });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

module.exports = router;
