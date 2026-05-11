/**
 * routes/admin.js — Full admin CRUD API using Prisma
 */
const express = require('express');
const router  = express.Router();
const adminMW = require('../middleware/admin');
const prisma  = require('../prisma/client');

router.use(adminMW);

// Helper for admin activity log
async function logActivity(userId, username, action, taskId, title, category) {
  try {
    const log = await prisma.activityLog.create({
      data: {
        user_id: userId,
        action: action,
        task_title: title,
        category: category
      },
      include: { user: { select: { username: true } } }
    });
    return log;
  } catch (e) {
    console.error('Error logging admin activity:', e.message);
    return null;
  }
}

let statsCache = null;
let statsCacheTime = 0;
const CACHE_TTL = 30000; // 30 seconds

// ── GET /api/admin/stats ─────────────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const now = Date.now();
    const nocache = req.query.nocache === '1';
    if (!nocache && statsCache && (now - statsCacheTime < CACHE_TTL)) {
      return res.json({ success: true, data: statsCache, cached: true });
    }

    const totalUsers = await prisma.user.count();
    const tasks = await prisma.task.findMany({ select: { user_id: true, status: true } });
    
    const doneTasks = tasks.filter(t => t.status.startsWith('selesai')).length;
    const pendingTasks = tasks.filter(t => t.status === 'pending').length;

    // Most active user
    const tasksByUser = {};
    tasks.forEach(t => { tasksByUser[t.user_id] = (tasksByUser[t.user_id] || 0) + 1; });
    let mostActiveId = null, mostActiveCount = 0;
    Object.entries(tasksByUser).forEach(([uid, cnt]) => {
      if (cnt > mostActiveCount) { mostActiveCount = cnt; mostActiveId = uid; }
    });

    let mostActiveUser = '-';
    if (mostActiveId) {
      const u = await prisma.user.findUnique({ where: { id: mostActiveId }, select: { username: true } });
      if (u) mostActiveUser = u.username;
    }

    const totalActivities = await prisma.activityLog.count();

    statsCache = {
      totalUsers, totalTasks: tasks.length,
      doneTasks, pendingTasks, mostActiveUser,
      totalActivities
    };
    statsCacheTime = now;

    res.json({ success: true, data: statsCache, cached: false });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ── GET /api/admin/users ─────────────────────────────────────────────────────
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        _count: { select: { tasks: true } },
        tasks: { select: { status: true } }
      }
    });

    const data = users.map(u => ({
      id: u.id,
      username: u.username,
      email: u.email,
      role: u.role,
      created_at: u.created_at,
      taskCount: u._count.tasks,
      doneCount: u.tasks.filter(t => t.status.startsWith('selesai')).length
    }));

    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ── PATCH /api/admin/users/:id/role ─────────────────────────────────────────
router.patch('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    if (!['admin', 'user'].includes(role))
      return res.status(400).json({ success: false, error: 'Role harus "admin" atau "user"' });
    if (req.params.id === req.user.id)
      return res.status(400).json({ success: false, error: 'Tidak dapat mengubah role diri sendiri' });

    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { role }
    });
    
    res.json({ success: true, message: `Role diubah menjadi ${role}` });
  } catch (e) { res.status(500).json({ success: false, error: 'User tidak ditemukan' }); }
});

// ── DELETE /api/admin/users/:id ──────────────────────────────────────────────
router.delete('/users/:id', async (req, res) => {
  try {
    if (req.params.id === req.user.id)
      return res.status(400).json({ success: false, error: 'Tidak dapat menghapus akun diri sendiri' });
    
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'User berhasil dihapus (Tasks dan Logs otomatis terhapus cascade)' });
  } catch (e) { res.status(500).json({ success: false, error: 'User tidak ditemukan' }); }
});

// ── GET /api/admin/tasks ─────────────────────────────────────────────────────
router.get('/tasks', async (req, res) => {
  try {
    const { userId, category, status } = req.query;
    
    const where = {};
    if (userId) where.user_id = userId;
    if (category && category !== 'all') where.category = category;
    if (status && status !== 'all') where.status = status;

    const tasks = await prisma.task.findMany({
      where,
      include: { user: { select: { username: true } } },
      orderBy: { created_at: 'desc' }
    });

    const data = tasks.map(t => ({
      ...t,
      username: t.user?.username || 'Unknown',
      userId: t.user_id
    }));
    
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ── DELETE /api/admin/tasks/:id ──────────────────────────────────────────────
router.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await prisma.task.findUnique({ where: { id: req.params.id } });
    if (!task) return res.status(404).json({ success: false, error: 'Task tidak ditemukan' });

    await prisma.task.delete({ where: { id: req.params.id } });
    const log = await logActivity(req.user.id, req.user.username, 'DELETE_TASK_ADMIN', req.params.id, 'Dihapus oleh admin', null);
    
    const io = req.app.get('io');
    if (io) {
      io.to('admin_room').emit('task_deleted', {
        taskId: req.params.id,
        userId: task.user_id,
        log: log ? { ...log, username: req.user.username } : null
      });
    }
    
    res.json({ success: true, message: 'Task berhasil dihapus' });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ── GET /api/admin/activity ──────────────────────────────────────────────────
router.get('/activity', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const [total, logs] = await Promise.all([
      prisma.activityLog.count(),
      prisma.activityLog.findMany({
        skip,
        take: limit,
        orderBy: { timestamp: 'desc' },
        include: { user: { select: { username: true } } }
      })
    ]);
    
    const mapped = logs.map(l => ({ ...l, username: l.user?.username || 'Unknown' }));
    res.json({ 
      success: true, 
      data: mapped, 
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) } 
    });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ── GET /api/admin/progress ─────────────────────────────────────────────────
router.get('/progress', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { username: 'asc' },
      include: { tasks: true, activities: { take: 5, orderBy: { timestamp: 'desc' } } }
    });
    
    const CATEGORIES = ['daily', 'weekly', 'monthly', 'quarterly', 'semesterly', 'yearly'];

    const data = users.map(u => {
      const userTasks = u.tasks;
      const done = userTasks.filter(t => t.status.startsWith('selesai')).length;
      const pending = userTasks.filter(t => t.status === 'pending').length;
      const total = userTasks.length;
      const productivity = total > 0 ? Math.round((done / total) * 100) : 0;

      const byCategory = {};
      CATEGORIES.forEach(cat => {
        const catTasks = userTasks.filter(t => t.category === cat);
        byCategory[cat] = {
          total: catTasks.length,
          done: catTasks.filter(t => t.status.startsWith('selesai')).length,
          pending: catTasks.filter(t => t.status === 'pending').length,
        };
      });

      return {
        id: u.id, username: u.username, email: u.email, created_at: u.created_at,
        total, done, pending, productivity, byCategory, recentActivity: u.activities,
      };
    });

    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ── GET /api/admin/progress/export ───────────────────────────────────────────
router.get('/progress/export', async (req, res) => {
  try {
    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'STAKS FLOW Admin';
    workbook.created = new Date();

    const { category, userId, startDate, endDate } = req.query;

    const whereClause = {};
    if (userId) whereClause.id = userId;

    const users = await prisma.user.findMany({
      where: whereClause,
      orderBy: { username: 'asc' },
      include: {
        tasks: true,
        activities: { take: 50, orderBy: { timestamp: 'desc' } }
      }
    });

    const worksheet = workbook.addWorksheet('Progress Report');

    worksheet.columns = [
      { header: 'No', key: 'no', width: 6 },
      { header: 'Nama User', key: 'username', width: 25 },
      { header: 'Total Task', key: 'total', width: 14 },
      { header: 'Task Selesai', key: 'done', width: 14 },
      { header: 'Task Pending', key: 'pending', width: 14 },
      { header: 'Task Terlambat', key: 'late', width: 16 },
      { header: 'Produktivitas', key: 'productivity', width: 16 },
      { header: 'Kategori Task', key: 'category', width: 20 },
      { header: 'Daftar Tugas Selesai', key: 'completedList', width: 45 },
      { header: 'Tanggal Report', key: 'date', width: 18 },
      { header: 'Activity Summary', key: 'activity', width: 45 },
    ];

    // Style Header Row
    const headerRow = worksheet.getRow(1);
    headerRow.height = 30;
    headerRow.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F46E5' } }; // Indigo-600
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    
    // Add borders to header
    headerRow.eachCell((cell) => {
      cell.border = {
        top: {style:'thin', color: {argb:'FF312E81'}},
        left: {style:'thin', color: {argb:'FF312E81'}},
        bottom: {style:'thin', color: {argb:'FF312E81'}},
        right: {style:'thin', color: {argb:'FF312E81'}}
      };
    });
    
    // Default column alignments
    worksheet.columns.forEach(col => {
      col.alignment = { vertical: 'top', wrapText: true };
    });
    // Center numeric columns
    ['no', 'total', 'done', 'pending', 'late', 'productivity'].forEach(key => {
      worksheet.getColumn(key).alignment = { vertical: 'top', horizontal: 'center' };
    });
    
    const now = new Date().toLocaleDateString('id-ID', { day:'2-digit', month:'long', year:'numeric' });

    users.forEach((u, index) => {
      let userTasks = u.tasks;
      
      if (category && category !== 'all') {
        userTasks = userTasks.filter(t => t.category === category);
      }
      
      if (startDate) {
        userTasks = userTasks.filter(t => new Date(t.created_at) >= new Date(startDate));
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        userTasks = userTasks.filter(t => new Date(t.created_at) <= end);
      }

      const total = userTasks.length;
      const done = userTasks.filter(t => t.status.startsWith('selesai')).length;
      const pending = userTasks.filter(t => t.status === 'pending').length;
      const late = userTasks.filter(t => t.status === 'selesai_terlambat').length;
      const productivity = total > 0 ? Math.round((done / total) * 100) : 0;
      
      const completedList = userTasks
        .filter(t => t.status.startsWith('selesai'))
        .map((t, i) => `${i + 1}. ${t.title}`)
        .join('\n');
      
      let acts = u.activities;
      if (startDate) acts = acts.filter(a => new Date(a.timestamp) >= new Date(startDate));
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        acts = acts.filter(a => new Date(a.timestamp) <= end);
      }

      const actSummary = acts.length > 0 
        ? acts.slice(0, 10).map(a => `[${new Date(a.timestamp).toLocaleDateString('id-ID')}] ${a.action}`).join('\n') 
        : '-';

      worksheet.addRow({
        no: index + 1,
        username: u.username,
        total,
        done,
        pending,
        late,
        productivity: productivity + '%',
        category: category && category !== 'all' ? category : 'Semua',
        completedList: completedList || '-',
        date: now,
        activity: actSummary
      });
    });

    // Style all data rows (Borders & Zebra Striping)
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) { // Skip header
        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.border = {
            top: {style:'thin', color: {argb:'FFE5E7EB'}},
            left: {style:'thin', color: {argb:'FFE5E7EB'}},
            bottom: {style:'thin', color: {argb:'FFE5E7EB'}},
            right: {style:'thin', color: {argb:'FFE5E7EB'}}
          };
          if (rowNumber % 2 === 0) {
            // Light gray for even rows
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF9FAFB' } };
          }
        });
      }
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="progress-monitoring-${new Date().toISOString().split('T')[0]}.xlsx"`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// ── GET /api/admin/progress/:userId ─────────────────────────────────────────
router.get('/progress/:userId', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.userId },
      include: {
        tasks: { orderBy: { created_at: 'desc' } },
        activities: { take: 200, orderBy: { timestamp: 'desc' } }
      }
    });

    if (!user) return res.status(404).json({ success: false, error: 'User tidak ditemukan' });

    const userTasks = user.tasks;
    const CATEGORIES = ['daily', 'weekly', 'monthly', 'quarterly', 'semesterly', 'yearly'];

    const done = userTasks.filter(t => t.status.startsWith('selesai')).length;
    const pending = userTasks.filter(t => t.status === 'pending').length;
    const total = userTasks.length;
    const productivity = total > 0 ? Math.round((done / total) * 100) : 0;

    const byCategory = {};
    CATEGORIES.forEach(cat => {
      const catTasks = userTasks.filter(t => t.category === cat);
      byCategory[cat] = {
        total: catTasks.length,
        done: catTasks.filter(t => t.status.startsWith('selesai')).length,
        pending: catTasks.filter(t => t.status === 'pending').length,
      };
    });

    // 7-day chart
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const weeklyLogs = user.activities.filter(l => l.timestamp >= sevenDaysAgo).map(l => {
      return { ...l, day: l.timestamp.toISOString().split('T')[0] };
    });

    const weeklyChart = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = d.toISOString().split('T')[0];
      const dayLogs = weeklyLogs.filter(l => l.day === dayStr);
      weeklyChart.push({
        date: dayStr,
        label: d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' }),
        completed: dayLogs.filter(l => l.action === 'COMPLETE_TASK').length,
        created: dayLogs.filter(l => l.action === 'CREATE_TASK').length,
      });
    }

    // 6-month chart
    const monthlyChart = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setDate(1);
      d.setMonth(d.getMonth() - i);
      const y = d.getFullYear(), m = d.getMonth() + 1;
      const monthStr = `${y}-${String(m).padStart(2, '0')}`;
      
      const monthLogs = user.activities.filter(l => {
        const d2 = new Date(l.timestamp);
        return d2.getFullYear() === y && (d2.getMonth() + 1) === m;
      });

      monthlyChart.push({
        label: d.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }),
        completed: monthLogs.filter(l => l.action === 'COMPLETE_TASK').length,
        created: monthLogs.filter(l => l.action === 'CREATE_TASK').length,
      });
    }

    const recentTasks = userTasks.slice(0, 10);

    let topCat = '-';
    let topCatCount = 0;
    CATEGORIES.forEach(cat => {
      if (byCategory[cat].done > topCatCount) { topCatCount = byCategory[cat].done; topCat = cat; }
    });

    res.json({ success: true, data: {
      user: { id: user.id, username: user.username, email: user.email, created_at: user.created_at },
      total, done, pending, productivity,
      byCategory, weeklyChart, monthlyChart,
      recentTasks, topCategory: topCat, activityLog: user.activities.slice(0, 20),
    }});
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ── POST /api/admin/promote-first ────────────────────────────────────────────
router.post('/promote-first', async (req, res) => {
  try {
    const existingAdmin = await prisma.user.findFirst({ where: { role: 'admin' } });
    if (existingAdmin) return res.status(400).json({ success: false, error: 'Admin sudah ada. Gunakan panel admin.' });
    
    const { username } = req.body;
    const userToPromote = await prisma.user.findUnique({ where: { username } });
    if (!userToPromote) return res.status(404).json({ success: false, error: 'User tidak ditemukan' });

    await prisma.user.update({
      where: { username },
      data: { role: 'admin' }
    });
    
    res.json({ success: true, message: `${username} telah dipromosikan menjadi admin. Silakan login ulang.` });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

module.exports = router;
