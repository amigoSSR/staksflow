/**
 * routes/admin.js — Full admin CRUD API using Prisma for Projects & Activities
 */
const express = require('express');
const router  = express.Router();
const adminMW = require('../middleware/admin');
const prisma  = require('../prisma/client');
const path    = require('path');
const fs      = require('fs');
const weeklyReportService = require('../services/weeklyReportService');

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

  // Check leader limit (max 1 active project as leader)
  if (leaderId) {
    const isAlreadyLeader = activeProjects.some(p => 
      p.members.some(m => m.user_id === leaderId && m.role === 'leader')
    );
    if (isAlreadyLeader) {
      throw new Error(`User has reached maximum active Project Leader limit.`);
    }
  }

  // Check same project restriction: leader cannot be mentee in the same project
  if (leaderId && menteeIds.includes(leaderId)) {
    throw new Error(`Project Leader cannot become mentee in the same project.`);
  }

  // Prevent duplicate member assignment in the same project
  const uniqueMentees = new Set(menteeIds);
  if (uniqueMentees.size !== menteeIds.length) {
    throw new Error(`User already assigned in this project.`);
  }

  // Check mentee limits
  for (const menteeId of menteeIds) {
    // Max 1 active project as mentee
    const activeMenteeCount = activeProjects.reduce((acc, p) => {
      const isMentee = p.members.some(m => m.user_id === menteeId && m.role === 'mentee');
      return acc + (isMentee ? 1 : 0);
    }, 0);

    if (activeMenteeCount >= 1) {
      throw new Error(`User has reached maximum active Mentee limit.`);
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

    statsCache = {
      totalUsers,
      totalDiaries,
      mostActiveUser,
      totalProjects,
      activeProjects
    };
    statsCacheTime = now;

    res.json({ success: true, data: statsCache, cached: false });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

let activeUsersCache = null;
let activeUsersCacheTime = 0;
const WEEKLY_CACHE_TTL = 300000; // 5 minutes

// ── GET /api/admin/active-users-weekly ──────────────────────────────────────
router.get('/active-users-weekly', async (req, res) => {
  try {
    const now = Date.now();
    const nocache = req.query.nocache === '1';
    if (!nocache && activeUsersCache && (now - activeUsersCacheTime < WEEKLY_CACHE_TTL)) {
      return res.json({ success: true, data: activeUsersCache, cached: true });
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Get project diary counts per user in last 7 days
    const projectDiaryCounts = await prisma.projectDiary.groupBy({
      by: ['created_by'],
      where: { created_at: { gte: sevenDaysAgo } },
      _count: { _all: true }
    });

    // Get regular diary counts per user in last 7 days
    const diaryCounts = await prisma.diary.groupBy({
      by: ['created_by'],
      where: { created_at: { gte: sevenDaysAgo } },
      _count: { _all: true }
    });

    // Merge counts
    const userActivityMap = {};
    projectDiaryCounts.forEach(d => {
      userActivityMap[d.created_by] = (userActivityMap[d.created_by] || 0) + d._count._all;
    });
    diaryCounts.forEach(d => {
      userActivityMap[d.created_by] = (userActivityMap[d.created_by] || 0) + d._count._all;
    });

    // Get user details and current project
    const activeUserIds = Object.keys(userActivityMap);
    const users = await prisma.user.findMany({
      where: { id: { in: activeUserIds } },
      select: {
        id: true,
        username: true,
        projectMembers: {
          where: {
            project: {
              project_status: 'ongoing'
            }
          },
          include: {
            project: {
              select: {
                project_name: true
              }
            }
          },
          take: 1,
          orderBy: {
            created_at: 'desc'
          }
        }
      }
    });

    const data = users.map(u => ({
      id: u.id,
      username: u.username,
      activityCount: userActivityMap[u.id] || 0,
      currentProject: u.projectMembers[0]?.project?.project_name || 'Independent'
    })).sort((a, b) => b.activityCount - a.activityCount).slice(0, 10);

    activeUsersCache = data;
    activeUsersCacheTime = now;

    res.json({ success: true, data, cached: false });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// ── GET /api/admin/users ─────────────────────────────────────────────────────
router.get('/users', async (req, res) => {
  try {
    const { filter } = req.query; // all, with-project, without-project
    
    const users = await prisma.user.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        _count: { select: { projectDiaries: true } },
        projectMembers: {
          include: { 
            project: { 
              select: { 
                id: true,
                project_name: true, 
                project_status: true 
              } 
            } 
          }
        }
      }
    });

    let data = users.map(u => {
      const activeMemberships = u.projectMembers.map(m => ({
        projectId: m.project.id,
        projectName: m.project.project_name,
        status: m.project.project_status,
        role: m.role
      }));
        
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

    if (filter === 'with-project') {
      data = data.filter(u => u.activeMemberships.length > 0);
    } else if (filter === 'without-project') {
      data = data.filter(u => u.activeMemberships.length === 0);
    }

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
      if (projectId === 'none') {
        where.project_id = null;
      } else {
        where.project_id = projectId;
      }
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
      project_id: d.project_id,
      diary_title: d.diary_title,
      activity_description: d.activity_description,
      work_progress: d.work_progress,
      created_by: d.created_by,
      created_at: d.created_at,
      username: d.creator?.username || 'Unknown',
      project_name: d.project?.project_name || 'Independent Activity'
    }));
    
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ── GET /api/admin/weekly-reports ─────────────────────────────────────────────
router.get('/weekly-reports', async (req, res) => {
  try {
    const { project, user, week, month } = req.query;
    const where = {};
    if (project && project !== 'all') where.project_id = project;
    if (user && user !== 'all') where.user_id = user;

    if (week) {
      const weekDate = new Date(week);
      if (!isNaN(weekDate)) {
        const start = new Date(weekDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setDate(end.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        const periodString = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')} - ${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`;
        where.report_period = { contains: periodString };
      }
    }

    if (month && month.match(/^\d{4}-\d{2}$/)) {
      const parts = month.split('-').map(Number);
      const start = new Date(parts[0], parts[1] - 1, 1);
      const nextMonth = new Date(parts[0], parts[1], 1);
      where.generated_at = { gte: start, lt: nextMonth };
    }

    const reports = await prisma.weeklyReport.findMany({
      where,
      orderBy: { generated_at: 'desc' },
      include: {
        project: {
          select: { project_name: true, members: { include: { user: { select: { username: true } } } } } },
        user: { select: { username: true } }
      }
    });

    const data = reports.map((r) => {
      const leaderMember = (r.project.members || []).find((m) => m.role === 'leader');
      return {
        id: r.id,
        report_name: r.report_name,
        report_period: r.report_period,
        project_id: r.project_id,
        project_name: r.project?.project_name || 'Unknown',
        user_id: r.user_id,
        user_name: r.user?.username || 'Unknown',
        project_leader: leaderMember?.user?.username || 'N/A',
        file_path: r.file_path,
        download_url: `/api/admin/weekly-reports/${r.id}/download`,
        preview_url: `/api/admin/weekly-reports/${r.id}/preview`,
        generated_at: r.generated_at,
      };
    });

    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ── POST /api/admin/weekly-reports/generate ───────────────────────────────────
router.post('/weekly-reports/generate', async (req, res) => {
  try {
    const result = await weeklyReportService.generateWeeklyReports();
    res.json({ success: true, data: result });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ── GET /api/admin/weekly-reports/:id/preview ──────────────────────────────────
router.get('/weekly-reports/:id/preview', async (req, res) => {
  try {
    const report = await prisma.weeklyReport.findUnique({ where: { id: req.params.id } });
    if (!report) return res.status(404).json({ success: false, error: 'Report tidak ditemukan.' });
    const fullPath = path.join(__dirname, '..', report.file_path);
    if (!fs.existsSync(fullPath)) return res.status(404).json({ success: false, error: 'File tidak ditemukan.' });
    const safeFilename = path.basename(report.file_path);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${safeFilename}"`);
    res.sendFile(fullPath);
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ── GET /api/admin/weekly-reports/:id/download ─────────────────────────────────
router.get('/weekly-reports/:id/download', async (req, res) => {
  try {
    const report = await prisma.weeklyReport.findUnique({ where: { id: req.params.id } });
    if (!report) return res.status(404).json({ success: false, error: 'Report tidak ditemukan.' });
    const fullPath = path.join(__dirname, '..', report.file_path);
    if (!fs.existsSync(fullPath)) return res.status(404).json({ success: false, error: 'File tidak ditemukan.' });
    const safeFilename = path.basename(report.file_path);
    res.download(fullPath, safeFilename);
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ── DELETE /api/admin/weekly-reports/:id ───────────────────────────────────────
router.delete('/weekly-reports/:id', async (req, res) => {
  try {
    const report = await prisma.weeklyReport.findUnique({ where: { id: req.params.id } });
    if (!report) return res.status(404).json({ success: false, error: 'Report tidak ditemukan.' });
    const fullPath = path.join(__dirname, '..', report.file_path);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    await prisma.weeklyReport.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Weekly report berhasil dihapus.' });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ══════════════════════════════════════════════════════════════════════════════
// COMBINED WEEKLY REPORTS  (one PDF per week — all leaders combined)
// ══════════════════════════════════════════════════════════════════════════════

// ── GET /api/admin/combined-reports ───────────────────────────────────────────
router.get('/combined-reports', async (req, res) => {
  try {
    const { month } = req.query;
    const where = {};
    if (month && /^\d{4}-\d{2}$/.test(month)) {
      const [y, m] = month.split('-').map(Number);
      const start  = new Date(y, m - 1, 1);
      const end    = new Date(y, m, 1);
      where.generated_at = { gte: start, lt: end };
    }
    const reports = await prisma.combinedWeeklyReport.findMany({
      where,
      orderBy: { generated_at: 'desc' },
    });

    const data = reports.map(r => {
      const fullPath = path.resolve(path.join(__dirname, '..', r.file_path));
      return {
        ...r,
        file_exists: fs.existsSync(fullPath)
      };
    });

    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ── POST /api/admin/combined-reports/generate ─────────────────────────────────
router.post('/combined-reports/generate', async (req, res) => {
  try {
    const result = await weeklyReportService.generateWeeklyReports();
    res.json({ success: true, data: result });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ── GET /api/admin/combined-reports/:id/preview ───────────────────────────────
router.get('/combined-reports/:id/preview', async (req, res) => {
  try {
    const report = await prisma.combinedWeeklyReport.findUnique({ where: { id: req.params.id } });
    if (!report) return res.status(404).json({ success: false, error: 'Report tidak ditemukan.' });
    const fullPath = path.resolve(path.join(__dirname, '..', report.file_path));
    if (!fs.existsSync(fullPath)) return res.status(404).json({ success: false, error: 'File PDF tidak ditemukan di server.' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${report.file_name}"`);
    res.sendFile(fullPath);
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ── GET /api/admin/combined-reports/:id/download ──────────────────────────────
router.get('/combined-reports/:id/download', async (req, res) => {
  try {
    const report = await prisma.combinedWeeklyReport.findUnique({ where: { id: req.params.id } });
    if (!report) return res.status(404).json({ success: false, error: 'Report tidak ditemukan.' });
    const fullPath = path.resolve(path.join(__dirname, '..', report.file_path));
    if (!fs.existsSync(fullPath)) return res.status(404).json({ success: false, error: 'File PDF tidak ditemukan di server.' });
    res.download(fullPath, report.file_name);
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ── DELETE /api/admin/combined-reports/:id ────────────────────────────────────
router.delete('/combined-reports/:id', async (req, res) => {
  try {
    const report = await prisma.combinedWeeklyReport.findUnique({ where: { id: req.params.id } });
    if (!report) return res.status(404).json({ success: false, error: 'Report tidak ditemukan.' });
    const fullPath = path.resolve(path.join(__dirname, '..', report.file_path));
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    await prisma.combinedWeeklyReport.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Combined weekly report berhasil dihapus.' });
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
    const log = await logActivity(req.user.id, req.user.username, 'DELETE_DIARY_ADMIN', req.params.id, diary.diary_title, diary.project?.project_name || 'Independent Activity');
    
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
    const { project_name, description, start_date, project_status, leader_id, mentee_ids } = req.body;

    if (!project_name || !start_date) {
      return res.status(400).json({ success: false, error: 'Nama proyek dan tanggal mulai wajib diisi' });
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
    const { project_name, description, start_date, project_status, leader_id, mentee_ids } = req.body;

    const existingProject = await prisma.project.findUnique({ where: { id } });
    if (!existingProject) {
      return res.status(404).json({ success: false, error: 'Proyek tidak ditemukan' });
    }

    // Prevent editing completed projects (unless admin reopens by changing status to ongoing?)
    // Requirement says: "Prevent editing active workflow unless reopened by admin"
    // So if existing is completed and we're NOT changing status, prevent edit.
    if (existingProject.project_status === 'completed' && project_status !== 'ongoing' && project_status !== 'upcoming') {
        return res.status(400).json({ success: false, error: 'Proyek yang sudah selesai tidak dapat diubah.' });
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

    const updateData = {
      project_name: project_name !== undefined ? project_name.trim() : undefined,
      description: description !== undefined ? description.trim() : undefined,
      start_date: start_date || undefined,
      project_status: status
    };

    // If reopening
    if (existingProject.project_status === 'completed' && (status === 'ongoing' || status === 'upcoming')) {
        updateData.completed_at = null;
        updateData.completed_by = null;
    }

    await prisma.project.update({
      where: { id },
      data: updateData
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

// ── POST /api/admin/projects/:id/complete ──────────────────────────────────
router.post('/projects/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ success: false, error: 'Proyek tidak ditemukan' });

    if (existing.project_status === 'completed') {
      return res.status(400).json({ success: false, error: 'Proyek sudah dalam status selesai.' });
    }

    await prisma.project.update({
      where: { id },
      data: {
        project_status: 'completed',
        completed_at: new Date(),
        completed_by: req.user.id
      }
    });

    await logActivity(req.user.id, req.user.username, 'COMPLETE_PROJECT_ADMIN', id, existing.project_name, 'completed');

    res.json({ success: true, message: 'Proyek berhasil diselesaikan' });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// ── GET /api/admin/projects/roadmaps ────────────────────────────────────────
router.get('/projects/roadmaps', async (req, res) => {
  try {
    const roadmaps = await prisma.projectRoadmap.findMany({
      include: {
        project: {
          select: {
            project_name: true,
            project_status: true,
            members: {
              where: { role: 'leader' },
              include: { user: { select: { username: true } } }
            }
          }
        },
        milestones: true
      },
      orderBy: { deadline: 'asc' }
    });

    const data = roadmaps.map(r => {
      const leader = r.project?.members[0]?.user?.username || 'No Leader';
      const isDelayed = new Date(r.deadline) < new Date() && r.status !== 'completed';
      
      return {
        ...r,
        project_name: r.project?.project_name,
        leader,
        is_delayed: isDelayed
      };
    });

    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// ── GET /api/admin/roadmaps/logs ─────────────────────────────────────────────
router.get('/roadmaps/logs', async (req, res) => {
  try {
    const logs = await prisma.roadmapProgressLog.findMany({
      take: 15,
      orderBy: { timestamp: 'desc' },
      include: {
        user: { select: { username: true } },
        roadmap: { select: { roadmap_title: true, project: { select: { project_name: true } } } },
        milestone: { select: { title: true } }
      }
    });

    const data = logs.map(l => ({
      id: l.id,
      timestamp: l.timestamp,
      action: l.action,
      details: l.details,
      username: l.user?.username || 'System',
      project_name: l.roadmap?.project?.project_name || 'Project',
      roadmap_title: l.roadmap?.roadmap_title,
      milestone_title: l.milestone?.title
    }));

    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// ── POST /api/admin/promote-first ────────────────────────────────────────────
router.post('/promote-first', async (req, res) => {
  try {
    const existingAdmin = await prisma.user.findFirst({ where: { role: 'admin' } });
    if (existingAdmin) return res.status(400).json({ success: false, error: 'Admin sudah ada. Gunakan panel admin.' });

    const { username } = req.body;
    const userToPromote = await prisma.user.findFirst({ 
      where: { 
        username: { in: [username.trim(), username.trim().toLowerCase()] } 
      } 
    });
    if (!userToPromote) return res.status(404).json({ success: false, error: 'User tidak ditemukan' });

    await prisma.user.update({
      where: { id: userToPromote.id },
      data: { role: 'admin' }
    });

    res.json({ success: true, message: `${username} telah dipromosikan menjadi admin. Silakan login ulang.` });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});
// ── GET /weekly-checkup/:id/preview (Unified stable endpoint) ──────────────
router.get('/weekly-checkup/:id/preview', async (req, res) => {
  try {
    const { id } = req.params;
    
    // 1. Try finding in Combined reports
    let report = await prisma.combinedWeeklyReport.findUnique({ where: { id } });
    let fileName = report?.file_name;
    
    // 2. If not found, try Individual reports
    if (!report) {
      report = await prisma.weeklyReport.findUnique({ where: { id } });
      if (report) {
        fileName = path.basename(report.file_path);
      }
    }

    if (!report) {
      return res.status(404).json({ success: false, error: 'Report data not found in database.' });
    }

    const fullPath = path.resolve(path.join(__dirname, '..', report.file_path));
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ success: false, error: `PDF file not found on server: ${report.file_path}` });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${fileName || 'report.pdf'}"`);
    res.sendFile(fullPath);
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

module.exports = router;
