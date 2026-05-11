/**
 * routes/community.js
 * House Rules & Duty Schedules API
 * Admin  → full CRUD
 * User   → GET only (read-only)
 */
const express   = require('express');
const router    = express.Router();
const authMW    = require('../middleware/auth');
const adminMW   = require('../middleware/admin');
const prisma    = require('../prisma/client');
const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat Ganjil', 'Sabtu Ganjil', 'Jumat Genap', 'Sabtu Genap'];

// ─── READ ENDPOINTS (any authenticated user) ────────────────────────────────

// GET /api/community/house-rules
router.get('/house-rules', authMW, async (req, res) => {
  try {
    const rules = await prisma.houseRule.findMany({
      orderBy: { created_at: 'asc' },
      include: { creator: { select: { username: true } } }
    });
    res.json({ success: true, data: rules.map(r => ({
      id: r.id, title: r.title, content: r.content,
      created_by: r.created_by,
      created_by_username: r.creator?.username || '-',
      created_at: r.created_at
    })) });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// GET /api/community/duty-schedules
router.get('/duty-schedules', authMW, async (req, res) => {
  try {
    const schedules = await prisma.dutySchedule.findMany({
      orderBy: [{ day: 'asc' }, { member_name: 'asc' }]
    });
    // Group by day in order
    const grouped = {};
    DAYS.forEach(d => { grouped[d] = []; });
    schedules.forEach(s => {
      if (!grouped[s.day]) grouped[s.day] = [];
      grouped[s.day].push({ id: s.id, member_name: s.member_name, created_by: s.created_by });
    });
    res.json({ success: true, data: grouped, days: DAYS });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// GET /api/community/schedules
router.get('/schedules', authMW, async (req, res) => {
  try {
    const schedules = await prisma.schedule.findMany({
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
      include: { creator: { select: { username: true } } }
    });
    res.json({ success: true, data: schedules.map(s => ({
      id: s.id,
      title: s.title,
      description: s.description,
      date: s.date,
      time: s.time,
      created_by: s.created_by,
      created_by_username: s.creator?.username || '-',
      created_at: s.created_at
    })) });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ─── ADMIN-ONLY WRITE ENDPOINTS ─────────────────────────────────────────────

// POST /api/community/house-rules
router.post('/house-rules', adminMW, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title?.trim() || !content?.trim())
      return res.status(400).json({ success: false, error: 'Title dan content wajib diisi.' });
    const rule = await prisma.houseRule.create({
      data: { title: title.trim(), content: content.trim(), created_by: req.user.id },
      include: { creator: { select: { username: true } } }
    });
    res.json({ success: true, data: { ...rule, created_by_username: rule.creator?.username } });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// PUT /api/community/house-rules/:id
router.put('/house-rules/:id', adminMW, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title?.trim() || !content?.trim())
      return res.status(400).json({ success: false, error: 'Title dan content wajib diisi.' });
    const rule = await prisma.houseRule.update({
      where: { id: req.params.id },
      data: { title: title.trim(), content: content.trim() },
      include: { creator: { select: { username: true } } }
    });
    res.json({ success: true, data: { ...rule, created_by_username: rule.creator?.username } });
  } catch (e) { res.status(500).json({ success: false, error: 'Rule tidak ditemukan.' }); }
});

// DELETE /api/community/house-rules/:id
router.delete('/house-rules/:id', adminMW, async (req, res) => {
  try {
    await prisma.houseRule.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'House rule berhasil dihapus.' });
  } catch (e) { res.status(500).json({ success: false, error: 'Rule tidak ditemukan.' }); }
});

// POST /api/community/duty-schedules  — add one member to a day
router.post('/duty-schedules', adminMW, async (req, res) => {
  try {
    const { day, member_name } = req.body;
    if (!DAYS.includes(day))
      return res.status(400).json({ success: false, error: `Hari tidak valid. Pilih: ${DAYS.join(', ')}` });
    if (!member_name?.trim())
      return res.status(400).json({ success: false, error: 'Nama anggota wajib diisi.' });
    // Prevent duplicate on same day
    const exists = await prisma.dutySchedule.findFirst({
      where: { day, member_name: member_name.trim() }
    });
    if (exists)
      return res.status(400).json({ success: false, error: `${member_name} sudah terdaftar di hari ${day}.` });
    const entry = await prisma.dutySchedule.create({
      data: { day, member_name: member_name.trim(), created_by: req.user.id }
    });
    res.json({ success: true, data: entry });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// PUT /api/community/duty-schedules/:id  — rename a member entry
router.put('/duty-schedules/:id', adminMW, async (req, res) => {
  try {
    const { day, member_name } = req.body;
    if (day && !DAYS.includes(day))
      return res.status(400).json({ success: false, error: `Hari tidak valid.` });
    if (!member_name?.trim())
      return res.status(400).json({ success: false, error: 'Nama anggota wajib diisi.' });
    const entry = await prisma.dutySchedule.update({
      where: { id: req.params.id },
      data: { ...(day ? { day } : {}), member_name: member_name.trim() }
    });
    res.json({ success: true, data: entry });
  } catch (e) { res.status(500).json({ success: false, error: 'Entry tidak ditemukan.' }); }
});

// DELETE /api/community/duty-schedules/:id
router.delete('/duty-schedules/:id', adminMW, async (req, res) => {
  try {
    await prisma.dutySchedule.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Jadwal berhasil dihapus.' });
  } catch (e) { res.status(500).json({ success: false, error: 'Entry tidak ditemukan.' }); }
});

// DELETE /api/community/duty-schedules/day/:day  — clear whole day
router.delete('/duty-schedules/day/:day', adminMW, async (req, res) => {
  try {
    const day = decodeURIComponent(req.params.day);
    if (!DAYS.includes(day))
      return res.status(400).json({ success: false, error: 'Kategori tidak valid.' });
    await prisma.dutySchedule.deleteMany({ where: { day } });
    res.json({ success: true, message: `Semua jadwal ${day} dihapus.` });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ─── SCHEDULE ADMIN ENDPOINTS ───

// POST /api/community/schedules
router.post('/schedules', adminMW, async (req, res) => {
  try {
    const { title, description, date, time } = req.body;
    if (!title || !date || !time)
      return res.status(400).json({ success: false, error: 'Title, date, dan time wajib diisi.' });

    const entry = await prisma.schedule.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        date: date,
        time: time,
        created_by: req.user.id
      },
      include: { creator: { select: { username: true } } }
    });
    res.json({ success: true, data: { ...entry, created_by_username: entry.creator?.username } });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// PUT /api/community/schedules/:id
router.put('/schedules/:id', adminMW, async (req, res) => {
  try {
    const { title, description, date, time } = req.body;
    if (!title || !date || !time)
      return res.status(400).json({ success: false, error: 'Title, date, dan time wajib diisi.' });

    const entry = await prisma.schedule.update({
      where: { id: req.params.id },
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        date: date,
        time: time
      },
      include: { creator: { select: { username: true } } }
    });
    res.json({ success: true, data: { ...entry, created_by_username: entry.creator?.username } });
  } catch (e) { res.status(500).json({ success: false, error: 'Jadwal tidak ditemukan.' }); }
});

// DELETE /api/community/schedules/:id
router.delete('/schedules/:id', adminMW, async (req, res) => {
  try {
    await prisma.schedule.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Jadwal calendar berhasil dihapus.' });
  } catch (e) { res.status(500).json({ success: false, error: 'Jadwal tidak ditemukan.' }); }
});

module.exports = router;
