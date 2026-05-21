/**
 * routes/admin.js — Full admin CRUD API using Prisma for Projects & Activities
 */
const express = require('express');
const router  = express.Router();
const adminMW = require('../middleware/admin');
const prisma  = require('../prisma/client');

router.use(adminMW);

// Helper for admin activity log
async function logActivity(userId, username, action, targetId, title, category) {
  try {
    const log = await prisma.activityLog.create({
      data: {
        user_id: userId,
        action: action,
        diary_title: title,
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

// Active project assignment validation helper
async function validateAssignments(projectId, leaderId, menteeIds = []) {
  // Find all active projects (status: "ongoing" or "upcoming")
  const activeProjects = await prisma.project.findMany({
    where: {
      project_status: { in: ['ongoing', 'upcoming'] },
      NOT: projectId ? { id: projectId } : undefined
    },
    include: {
      members: true
    }
  });

  // Check leader limit (max 1 active project)
  if (leaderId) {
    const isAlreadyLeader = activeProjects.some(p => 
      p.members.some(m => m.user_id === leaderId && m.role === 'leader')
    );
    if (isAlreadyLeader) {
      const user = await prisma.user.findUnique({ where: { id: leaderId }, select: { username: true } });
      throw new Error(`User "${user?.username || 'Leader'}" sudah memimpin 1 proyek aktif.`);
    }
  }

  // Check mentee limit (max 2 active projects) and active leader constraint
  for (const menteeId of menteeIds) {
    if (leaderId === menteeId) {
      throw new Error(`This user is currently an active Project Leader and cannot join as mentee until the project is completed.`);
    }

    const activeMenteeCount = activeProjects.reduce((acc, p) => {
      const isMentee = p.members.some(m => m.user_id === menteeId && m.role === 'mentee');
      return acc + (isMentee ? 1 : 0);
    }, 0);

    if (activeMenteeCount >= 2) {
      const user = await prisma.user.findUnique({ where: { id: menteeId }, select: { username: true } });
      throw new Error(`User "${user?.username || 'Mentee'}" sudah bergabung di 2 proyek aktif sebagai mentee.`);
    }

    const isAlreadyLeader = activeProjects.some(p => 
      p.members.some(m => m.user_id === menteeId && m.role === 'leader')
    );
    if (isAlreadyLeader) {
      throw new Error(`This user is currently an active Project Leader and cannot join as mentee until the project is completed.`);
    }
  }
}

let statsCache = null;
let statsCacheTime = 0;
const CACHE_TTL = 10000; // 10 seconds

// ── GET /api/admin/stats ─────────────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const now = Date.now();
    const nocache = req.query.nocache === '1';
    if (!nocache && statsCache && (now - statsCacheTime < CACHE_TTL)) {
      return res.json({ success: true, data: statsCache, cached: true });
    }

    const totalUsers = await prisma.user.count();
    const totalDiaries = await prisma.projectDiary.count();
    const totalProjects = await prisma.project.count();
    const activeProjects = await prisma.project.count({ where: { project_status: { in: ['ongoing', 'upcoming'] } } });

    // Most active user based on project diary entries
    const diaries = await prisma.projectDiary.findMany({ select: { created_by: true } });
    const diariesByUser = {};
    diaries.forEach(d => { diariesByUser[d.created_by] = (diariesByUser[d.created_by] || 0) + 1; });
    let mostActiveId = null, mostActiveCount = 0;
    Object.entries(diariesByUser).forEach(([uid, cnt]) => {
      if (cnt > mostActiveCount) { mostActiveCount = cnt; mostActiveId = uid; }
    });

    let mostActiveUser = '-';
    if (mostActiveId) {
      const u = await prisma.user.findUnique({ where: { id: mostActiveId }, select: { username: true } });
      if (u) mostActiveUser = u.username;
    }

    const totalActivities = await prisma.activityLog.count();

    statsCache = {
      totalUsers,
      totalDiaries,
      mostActiveUser,
      totalActivities,
      totalProjects,
      activeProjects
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
        _count: { select: { projectDiaries: true } },
        projectMembers: {
          include: { project: { select: { project_status: true } } }
        }
      }
    });

    const data = users.map(u => {
      const activeMemberships = u.projectMembers
        .filter(m => ['ongoing', 'upcoming'].includes(m.project.project_status))
        .map(m => ({ projectId: m.project_id, role: m.role }));
        
      return {
        id: u.id,
        username: u.username,
        email: u.email,
        role: u.role,
        created_at: u.created_at,
        diaryCount: u._count.projectDiaries,
        activeMemberships
      };
    });

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

    await prisma.user.update({
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
    res.json({ success: true, message: 'User berhasil dihapus' });
  } catch (e) { res.status(500).json({ success: false, error: 'User tidak ditemukan' }); }
});

// ── GET /api/admin/diaries ─────────────────────────────────────────────────────
router.get('/diaries', async (req, res) => {
  try {
    const { projectId, leaderId, menteeId, month } = req.query;
    
    const where = {};
    if (projectId && projectId !== 'all') {
      where.project_id = projectId;
    }
    if (leaderId && leaderId !== 'all') {
      where.created_by = leaderId;
    } else if (menteeId && menteeId !== 'all') {
      where.created_by = menteeId;
    }
    if (month && month.match(/^\d{4}-\d{2}$/)) {
      const startDate = new Date(`${month}-01T00:00:00.000Z`);
      const [year, m] = month.split('-').map(Number);
      const nextMonth = m === 12 ? 1 : m + 1;
      const nextYear = m === 12 ? year + 1 : year;
      const endDate = new Date(`${nextYear}-${String(nextMonth).padStart(2, '0')}-01T00:00:00.000Z`);
      where.created_at = {
        gte: startDate,
        lt: endDate
      };
    }

    const diaries = await prisma.projectDiary.findMany({
      where,
      include: {
        creator: { select: { username: true } },
        project: { select: { project_name: true } }
      },
      orderBy: { created_at: 'desc' }
    });

    const data = diaries.map(d => ({
      id: d.id,
      diary_title: d.diary_title,
      activity_description: d.activity_description,
      work_progress: d.work_progress,
      created_by: d.created_by,
      created_at: d.created_at,
      username: d.creator?.username || 'Unknown',
      project_name: d.project?.project_name || 'Unknown Project'
    }));
    
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ── DELETE /api/admin/diaries/:id ──────────────────────────────────────────────
router.delete('/diaries/:id', async (req, res) => {
  try {
    const diary = await prisma.projectDiary.findUnique({
      where: { id: req.params.id },
      include: { project: true }
    });
    if (!diary) return res.status(404).json({ success: false, error: 'Diary tidak ditemukan' });

    await prisma.projectDiary.delete({ where: { id: req.params.id } });
    const log = await logActivity(req.user.id, req.user.username, 'DELETE_DIARY_ADMIN', req.params.id, diary.diary_title, diary.project?.project_name || 'Project');
    
    const io = req.app.get('io');
    if (io) {
      io.to('admin_room').emit('diary_deleted', {
        diaryId: req.params.id,
        userId: diary.created_by,
        log: log ? { ...log, username: req.user.username } : null
      });
    }
    
    res.json({ success: true, message: 'Diary berhasil dihapus' });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ── GET /api/admin/projects ──────────────────────────────────────────────────
router.get('/projects', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        members: {
          include: {
            user: { select: { username: true, email: true } }
          }
        },
        _count: { select: { diaries: true } }
      },
      orderBy: { created_at: 'desc' }
    });

    const data = projects.map(p => {
      const leader = p.members.find(m => m.role === 'leader');
      const mentees = p.members.filter(m => m.role === 'mentee');
      return {
        id: p.id,
        project_name: p.project_name,
        description: p.description,
        start_date: p.start_date,
        end_date: p.end_date,
        project_status: p.project_status,
        diary_count: p._count.diaries,
        created_at: p.created_at,
        leader: leader ? { id: leader.user_id, username: leader.user?.username } : null,
        mentees: mentees.map(mt => ({ id: mt.user_id, username: mt.user?.username }))
      };
    });

    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ── POST /api/admin/projects ─────────────────────────────────────────────────
router.post('/projects', async (req, res) => {
  try {
    const { project_name, description, start_date, end_date, project_status, leader_id, mentee_ids } = req.body;

    if (!project_name || !start_date || !end_date) {
      return res.status(400).json({ success: false, error: 'Nama proyek, tanggal mulai, dan tanggal selesai wajib diisi' });
    }

    const mIds = Array.isArray(mentee_ids) ? mentee_ids : [];

    if (leader_id && mIds.includes(leader_id)) {
      return res.status(400).json({ success: false, error: 'Project Leader tidak boleh menjadi mentee di proyek yang sama.' });
    }

    const status = project_status || 'ongoing';
    if (status !== 'completed') {
      try {
        await validateAssignments(null, leader_id, mIds);
      } catch (err) {
        return res.status(400).json({ success: false, error: err.message });
      }
    }

    const createdProject = await prisma.project.create({
      data: {
        project_name: project_name.trim(),
        description: (description || '').trim(),
        start_date,
        end_date,
        project_status: status
      }
    });

    const memberData = [];
    if (leader_id) {
      memberData.push({
        project_id: createdProject.id,
        user_id: leader_id,
        role: 'leader'
      });
    }
    mIds.forEach(uid => {
      memberData.push({
        project_id: createdProject.id,
        user_id: uid,
        role: 'mentee'
      });
    });

    if (memberData.length > 0) {
      await prisma.projectMember.createMany({ data: memberData });
    }

    await logActivity(req.user.id, req.user.username, 'CREATE_PROJECT_ADMIN', createdProject.id, createdProject.project_name, status);

    res.status(201).json({ success: true, message: 'Proyek berhasil dibuat', data: createdProject });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// ── PUT /api/admin/projects/:id ──────────────────────────────────────────────
router.put('/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { project_name, description, start_date, end_date, project_status, leader_id, mentee_ids } = req.body;

    const existingProject = await prisma.project.findUnique({ where: { id } });
    if (!existingProject) {
      return res.status(404).json({ success: false, error: 'Proyek tidak ditemukan' });
    }

    const mIds = Array.isArray(mentee_ids) ? mentee_ids : [];

    if (leader_id && mIds.includes(leader_id)) {
      return res.status(400).json({ success: false, error: 'Project Leader tidak boleh menjadi mentee di proyek yang sama.' });
    }

    const status = project_status || existingProject.project_status;
    if (status !== 'completed') {
      try {
        await validateAssignments(id, leader_id, mIds);
      } catch (err) {
        return res.status(400).json({ success: false, error: err.message });
      }
    }

    await prisma.project.update({
      where: { id },
      data: {
        project_name: project_name !== undefined ? project_name.trim() : undefined,
        description: description !== undefined ? description.trim() : undefined,
        start_date: start_date || undefined,
        end_date: end_date || undefined,
        project_status: status
      }
    });

    await prisma.projectMember.deleteMany({ where: { project_id: id } });

    const memberData = [];
    if (leader_id) {
      memberData.push({
        project_id: id,
        user_id: leader_id,
        role: 'leader'
      });
    }
    mIds.forEach(uid => {
      memberData.push({
        project_id: id,
        user_id: uid,
        role: 'mentee'
      });
    });

    if (memberData.length > 0) {
      await prisma.projectMember.createMany({ data: memberData });
    }

    await logActivity(req.user.id, req.user.username, 'EDIT_PROJECT_ADMIN', id, project_name || existingProject.project_name, status);

    res.json({ success: true, message: 'Proyek berhasil diperbarui' });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// ── DELETE /api/admin/projects/:id ───────────────────────────────────────────
router.delete('/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ success: false, error: 'Proyek tidak ditemukan' });

    await prisma.project.delete({ where: { id } });
    await logActivity(req.user.id, req.user.username, 'DELETE_PROJECT_ADMIN', id, existing.project_name, 'deleted');

    res.json({ success: true, message: 'Proyek berhasil dihapus' });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
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
