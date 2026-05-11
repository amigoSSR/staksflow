/**
 * routes/tasks.js
 * Protected task routes — all operations scoped to authenticated user via Prisma.
 */
const express = require('express');
const router  = express.Router();
const authMiddleware = require('../middleware/auth');
const prisma = require('../prisma/client');

router.use(authMiddleware);

const VALID_CATEGORIES = ['daily', 'weekly', 'monthly', 'quarterly', 'semesterly', 'yearly'];

// Helper for activity log
async function logActivity(userId, action, taskTitle, category) {
  try {
    const log = await prisma.activityLog.create({
      data: {
        action,
        task_title: taskTitle,
        category,
        user_id: userId
      },
      include: { user: { select: { username: true } } }
    });
    return log;
  } catch (err) {
    console.error('Error logging activity:', err.message);
    return null;
  }
}

// ── GET /api/tasks ──────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { category, sort } = req.query;

    const where = { user_id: req.user.id };
    if (category && category !== 'all') {
      where.category = category.toLowerCase();
    }

    let orderBy = { created_at: 'desc' };
    if (sort === 'deadline') {
      orderBy = { deadline: 'asc' }; // Note: Prisma string sorts nulls properly
    } else if (sort === 'oldest') {
      orderBy = { created_at: 'asc' };
    } else if (sort === 'title') {
      orderBy = { title: 'asc' };
    }

    const tasks = await prisma.task.findMany({ where, orderBy });
    
    // Sort null deadlines to the bottom manually if sorted by deadline
    if (sort === 'deadline') {
      tasks.sort((a, b) => {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return a.deadline.localeCompare(b.deadline);
      });
    }

    res.json({ success: true, data: tasks, count: tasks.length });
  } catch (error) {
    console.error('GET /tasks error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ── GET /api/tasks/stats ────────────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({ where: { user_id: req.user.id } });

    const total   = tasks.length;
    const done    = tasks.filter(t => t.status.startsWith('selesai')).length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    const pct     = total === 0 ? 0 : Math.round((done / total) * 100);

    const today   = new Date(); today.setHours(0, 0, 0, 0);
    const overdue = tasks.filter(t => {
      if (t.status.startsWith('selesai') || !t.deadline) return false;
      const d = new Date(t.deadline + 'T00:00:00');
      return d < today;
    }).length;

    const byCategory = {};
    VALID_CATEGORIES.forEach(cat => {
      const catTasks = tasks.filter(t => t.category === cat);
      byCategory[cat] = {
        total:   catTasks.length,
        done:    catTasks.filter(t => t.status.startsWith('selesai')).length,
        pending: catTasks.filter(t => t.status === 'pending').length,
      };
    });

    res.json({ success: true, data: { total, done, pending, overdue, progressPct: pct, byCategory } });
  } catch (error) {
    console.error('GET /tasks/stats error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ── GET /api/tasks/:id ──────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const task = await prisma.task.findFirst({
      where: { id: req.params.id, user_id: req.user.id }
    });
    if (!task) return res.status(404).json({ success: false, error: 'Task tidak ditemukan' });
    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Helper for auto-deadline
function calculateDeadline(category) {
  const date = new Date();
  if (category === 'daily') {
    // deadline today
  } else if (category === 'weekly') {
    date.setDate(date.getDate() + 7);
  } else if (category === 'monthly') {
    date.setMonth(date.getMonth() + 1);
  } else if (category === 'quarterly') {
    date.setMonth(date.getMonth() + 3);
  } else if (category === 'semesterly') {
    date.setMonth(date.getMonth() + 6);
  } else if (category === 'yearly') {
    date.setFullYear(date.getFullYear() + 1);
  }
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// ── POST /api/tasks ─────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { title, description, category, deadline, status } = req.body;

    if (!title || !category)
      return res.status(400).json({ success: false, error: 'Title dan kategori wajib diisi' });

    if (!VALID_CATEGORIES.includes(category.toLowerCase()))
      return res.status(400).json({ success: false, error: `Kategori tidak valid. Pilih: ${VALID_CATEGORIES.join(', ')}` });

    const autoDeadline = calculateDeadline(category.toLowerCase());

    const created = await prisma.task.create({
      data: {
        title: title.trim(),
        description: (description || '').trim(),
        category: category.toLowerCase(),
        deadline: autoDeadline,
        status: status || 'pending',
        user_id: req.user.id
      }
    });

    const log = await logActivity(req.user.id, 'CREATE_TASK', title.trim(), category.toLowerCase());
    const io = req.app.get('io');
    if (io) {
      io.to('admin_room').emit('task_created', { 
        task: { ...created, username: req.user.username, userId: req.user.id },
        log: log ? { ...log, username: req.user.username } : null
      });
    }
    res.status(201).json({ success: true, data: created, message: 'Tugas berhasil dibuat' });
  } catch (error) {
    console.error('POST /tasks error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ── PUT /api/tasks/:id ──────────────────────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const { title, description, category, deadline, status } = req.body;

    const existing = await prisma.task.findFirst({ where: { id: req.params.id, user_id: req.user.id } });
    if (!existing) return res.status(404).json({ success: false, error: 'Task tidak ditemukan' });

    const updates = {};
    if (title       !== undefined) updates.title       = title.trim();
    if (description !== undefined) updates.description = description.trim();
    if (category    !== undefined) {
      const lowerCat = category.toLowerCase();
      updates.category = lowerCat;
      if (existing.category !== lowerCat) {
        updates.deadline = calculateDeadline(lowerCat);
      }
    }
    if (status      !== undefined) updates.status      = status;

    const updated = await prisma.task.update({
      where: { id: req.params.id },
      data: updates
    });

    const log = await logActivity(req.user.id, 'EDIT_TASK', updated.title, updated.category);
    const io = req.app.get('io');
    if (io) {
      io.to('admin_room').emit('task_updated', { 
        task: { ...updated, username: req.user.username, userId: req.user.id },
        log: log ? { ...log, username: req.user.username } : null
      });
    }
    res.json({ success: true, data: updated, message: 'Tugas berhasil diperbarui' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ── PATCH /api/tasks/:id/status ─────────────────────────────────────────────
router.patch('/:id/status', async (req, res) => {
  try {
    let { status } = req.body;
    // Map old status from frontend if any
    if (status === 'done') status = 'selesai';
    
    if (!['pending', 'selesai', 'selesai_terlambat'].includes(status))
      return res.status(400).json({ success: false, error: 'Status harus "pending", "selesai", atau "selesai_terlambat"' });

    const existing = await prisma.task.findFirst({ where: { id: req.params.id, user_id: req.user.id } });
    if (!existing) return res.status(404).json({ success: false, error: 'Task tidak ditemukan' });

    // Cek keterlambatan otomatis jika diset menjadi selesai
    if (status === 'selesai' && existing.deadline) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dl = new Date(existing.deadline + 'T00:00:00');
      if (today > dl) {
        status = 'selesai_terlambat';
      }
    }

    const updated = await prisma.task.update({
      where: { id: req.params.id },
      data: { status }
    });

    const action = status.startsWith('selesai') ? 'COMPLETE_TASK' : 'REOPEN_TASK';
    const log = await logActivity(req.user.id, action, updated.title, updated.category);
    const io = req.app.get('io');
    if (io) {
      io.to('admin_room').emit('task_updated', { 
        task: { ...updated, username: req.user.username, userId: req.user.id },
        log: log ? { ...log, username: req.user.username } : null
      });
    }
    res.json({ success: true, data: updated, message: `Tugas ditandai ${status}` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ── PATCH /api/tasks/reorder ────────────────────────────────────────────────
router.patch('/reorder/batch', async (req, res) => {
  try {
    const { updates } = req.body;
    if (!Array.isArray(updates))
      return res.status(400).json({ success: false, error: 'updates must be an array' });

    const results = [];
    const io = req.app.get('io');
    for (const { id, status: reqStatus } of updates) {
      let status = reqStatus;
      if (status === 'done') status = 'selesai';
      if (!['pending', 'selesai', 'selesai_terlambat'].includes(status)) continue;
      
      const existing = await prisma.task.findFirst({ where: { id, user_id: req.user.id } });
      if (existing) {
        if (status === 'selesai' && existing.deadline) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const dl = new Date(existing.deadline + 'T00:00:00');
          if (today > dl) {
            status = 'selesai_terlambat';
          }
        }

        const updated = await prisma.task.update({
          where: { id },
          data: { status }
        });
        results.push(updated);
        const action = status.startsWith('selesai') ? 'COMPLETE_TASK' : 'REOPEN_TASK';
        const log = await logActivity(req.user.id, action, updated.title, updated.category);
        if (io) {
          io.to('admin_room').emit('task_updated', {
            task: { ...updated, username: req.user.username, userId: req.user.id },
            log: log ? { ...log, username: req.user.username } : null
          });
        }
      }
    }

    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ── DELETE /api/tasks/:id ────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const existing = await prisma.task.findFirst({ where: { id: req.params.id, user_id: req.user.id } });
    if (!existing) return res.status(404).json({ success: false, error: 'Task tidak ditemukan' });

    await prisma.task.delete({ where: { id: req.params.id } });
    const log = await logActivity(req.user.id, 'DELETE_TASK', existing.title, existing.category);
    const io = req.app.get('io');
    if (io) {
      io.to('admin_room').emit('task_deleted', {
        taskId: req.params.id,
        userId: req.user.id,
        log: log ? { ...log, username: req.user.username } : null
      });
    }
    res.json({ success: true, message: 'Tugas berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
