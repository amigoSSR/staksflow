/**
 * routes/manual.js — Manual Book API for Tutorials & Documentation
 */
const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');
const adminMW = require('../middleware/admin');
const prisma  = require('../prisma/client');

// ── PUBLIC / USER ACCESS (READ ONLY) ────────────────────────────────────────

// GET /api/manual/categories — Get all categories with tutorials based on user role
router.get('/categories', auth, async (req, res) => {
  try {
    const { manage } = req.query;
    const whereClause = {};

    // If not admin management mode, filter by role
    if (!(manage === 'true' && req.user.role === 'admin')) {
      whereClause.access_role = req.user.role;
    }

    const categories = await prisma.manualCategory.findMany({
      where: whereClause,
      orderBy: { order: 'asc' },
      include: {
        manuals: {
          where: manage === 'true' && req.user.role === 'admin' ? {} : { access_role: req.user.role },
          select: { id: true, title: true, order: true, access_role: true },
          orderBy: { order: 'asc' }
        }
      }
    });
    res.json({ success: true, data: categories });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/manual/tutorials/:id — Get specific tutorial details with permission check
router.get('/tutorials/:id', auth, async (req, res) => {
  try {
    const tutorial = await prisma.manualBook.findUnique({
      where: { id: req.params.id },
      include: {
        category: { select: { name: true, icon: true } },
        creator: { select: { username: true } }
      }
    });
    if (!tutorial) return res.status(404).json({ success: false, error: 'Tutorial tidak ditemukan' });
    
    // Permission check
    if (tutorial.access_role !== req.user.role && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Akses ditolak' });
    }

    res.json({ success: true, data: tutorial });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/manual/search — Search tutorials based on user role
router.get('/search', auth, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ success: true, data: [] });

    const results = await prisma.manualBook.findMany({
      where: {
        access_role: req.user.role,
        OR: [
          { title: { contains: q } },
          { content: { contains: q } }
        ]
      },
      select: { id: true, title: true, category_id: true },
      take: 10
    });
    res.json({ success: true, data: results });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// ── ADMIN ACCESS (CRUD) ─────────────────────────────────────────────────────

// POST /api/manual/categories — Create category
router.post('/categories', [auth, adminMW], async (req, res) => {
  try {
    const { name, description, icon, order, access_role } = req.body;
    const category = await prisma.manualCategory.create({
      data: { 
        name, 
        description, 
        icon, 
        order: parseInt(order) || 0,
        access_role: access_role || 'user'
      }
    });
    res.status(201).json({ success: true, data: category });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// PATCH /api/manual/categories/:id — Update category
router.patch('/categories/:id', [auth, adminMW], async (req, res) => {
  try {
    const { name, description, icon, order, access_role } = req.body;
    const category = await prisma.manualCategory.update({
      where: { id: req.params.id },
      data: { 
        name, 
        description, 
        icon, 
        order: order !== undefined ? parseInt(order) : undefined,
        access_role
      }
    });
    res.json({ success: true, data: category });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// DELETE /api/manual/categories/:id — Delete category
router.delete('/categories/:id', [auth, adminMW], async (req, res) => {
  try {
    await prisma.manualCategory.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Kategori berhasil dihapus' });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// POST /api/manual/tutorials — Create tutorial
router.post('/tutorials', [auth, adminMW], async (req, res) => {
  try {
    const { category_id, title, content, order, access_role } = req.body;
    const tutorial = await prisma.manualBook.create({
      data: {
        category_id,
        title,
        content,
        order: parseInt(order) || 0,
        access_role: access_role || 'user',
        created_by: req.user.id
      }
    });
    res.status(201).json({ success: true, data: tutorial });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// PATCH /api/manual/tutorials/:id — Update tutorial
router.patch('/tutorials/:id', [auth, adminMW], async (req, res) => {
  try {
    const { category_id, title, content, order, access_role } = req.body;
    const tutorial = await prisma.manualBook.update({
      where: { id: req.params.id },
      data: {
        category_id,
        title,
        content,
        order: order !== undefined ? parseInt(order) : undefined,
        access_role
      }
    });
    res.json({ success: true, data: tutorial });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// DELETE /api/manual/tutorials/:id — Delete tutorial
router.delete('/tutorials/:id', [auth, adminMW], async (req, res) => {
  try {
    await prisma.manualBook.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Tutorial berhasil dihapus' });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

module.exports = router;
