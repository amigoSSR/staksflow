/**
 * routes/diaries.js
 * Protected project diary routes — scoped to authenticated user via Prisma.
 */
const express = require('express');
const router  = express.Router();
const authMiddleware = require('../middleware/auth');
const prisma = require('../prisma/client');

router.use(authMiddleware);

// Helper for activity log
async function logActivity(userId, action, diaryTitle, category) {
  try {
    const log = await prisma.activityLog.create({
      data: {
        action,
        diary_title: diaryTitle,
        category, // category represents the project name/status here
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

// ── GET /api/diaries ──────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const diaries = await prisma.projectDiary.findMany({
      where: { created_by: req.user.id },
      include: {
        project: { select: { project_name: true } }
      },
      orderBy: { created_at: 'desc' }
    });
    
    const mapped = diaries.map(d => ({
      id: d.id,
      project_id: d.project_id,
      project_name: d.project?.project_name || 'Unknown Project',
      diary_title: d.diary_title,
      activity_description: d.activity_description,
      work_progress: d.work_progress,
      created_by: d.created_by,
      created_at: d.created_at
    }));

    res.json({ success: true, data: mapped, count: mapped.length });
  } catch (error) {
    console.error('GET /diaries error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ── GET /api/diaries/:id ──────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const diary = await prisma.projectDiary.findFirst({
      where: { id: req.params.id, created_by: req.user.id },
      include: { project: { select: { project_name: true } } }
    });
    if (!diary) return res.status(404).json({ success: false, error: 'Diary tidak ditemukan' });
    res.json({ success: true, data: diary });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ── POST /api/diaries ─────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { project_id, diary_title, activity_description, work_progress } = req.body;

    if (!diary_title || work_progress === undefined) {
      return res.status(400).json({ success: false, error: 'Judul dan progress wajib diisi' });
    }

    let projectName = 'Independent Activity';
    
    if (project_id) {
      // Verify user is a member of the project
      const membership = await prisma.projectMember.findFirst({
        where: { project_id, user_id: req.user.id },
        include: { project: true }
      });
      if (!membership) {
        return res.status(403).json({ success: false, error: 'Anda bukan anggota proyek ini' });
      }
      projectName = membership.project.project_name;
    }

    const progressInt = parseInt(work_progress);
    if (isNaN(progressInt) || progressInt < 0 || progressInt > 100) {
      return res.status(400).json({ success: false, error: 'Progress harus berupa angka 0 - 100' });
    }

    const created = await prisma.projectDiary.create({
      data: {
        project_id: project_id || null,
        diary_title: diary_title.trim(),
        activity_description: (activity_description || '').trim(),
        work_progress: progressInt,
        created_by: req.user.id
      },
      include: {
        project: { select: { project_name: true } }
      }
    });

    const log = await logActivity(req.user.id, 'CREATE_DIARY', diary_title.trim(), projectName);
    
    const io = req.app.get('io');
    if (io) {
      io.to('admin_room').emit('diary_created', { 
        diary: {
          id: created.id,
          project_id: created.project_id,
          project_name: created.project?.project_name || 'Independent Activity',
          diary_title: created.diary_title,
          activity_description: created.activity_description,
          work_progress: created.work_progress,
          created_by: created.created_by,
          created_at: created.created_at,
          username: req.user.username,
          userId: req.user.id
        },
        log: log ? { ...log, username: req.user.username } : null
      });
    }

    res.status(201).json({ success: true, data: created, message: 'Diary berhasil disimpan' });
  } catch (error) {
    console.error('POST /diaries error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ── PUT /api/diaries/:id ──────────────────────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const { project_id, diary_title, activity_description, work_progress } = req.body;

    const existing = await prisma.projectDiary.findFirst({
      where: { id: req.params.id, created_by: req.user.id },
      include: { project: true }
    });
    if (!existing) return res.status(404).json({ success: false, error: 'Diary tidak ditemukan' });

    const updates = {};
    if (diary_title !== undefined) updates.diary_title = diary_title.trim();
    if (activity_description !== undefined) updates.activity_description = activity_description.trim();
    if (work_progress !== undefined) {
      const progressInt = parseInt(work_progress);
      if (isNaN(progressInt) || progressInt < 0 || progressInt > 100) {
        return res.status(400).json({ success: false, error: 'Progress harus berupa angka 0 - 100' });
      }
      updates.work_progress = progressInt;
    }

    let projectName = existing.project?.project_name || 'Independent Activity';

    if (project_id !== undefined && project_id !== existing.project_id) {
      if (project_id) {
        // Verify user is a member of the new project
        const membership = await prisma.projectMember.findFirst({
          where: { project_id, user_id: req.user.id },
          include: { project: true }
        });
        if (!membership) {
          return res.status(403).json({ success: false, error: 'Anda bukan anggota proyek baru ini' });
        }
        updates.project_id = project_id;
        projectName = membership.project.project_name;
      } else {
        updates.project_id = null;
        projectName = 'Independent Activity';
      }
    }

    const updated = await prisma.projectDiary.update({
      where: { id: req.params.id },
      data: updates,
      include: { project: { select: { project_name: true } } }
    });

    const log = await logActivity(req.user.id, 'EDIT_DIARY', updated.diary_title, projectName);
    
    const io = req.app.get('io');
    if (io) {
      io.to('admin_room').emit('diary_updated', { 
        diary: {
          id: updated.id,
          project_id: updated.project_id,
          project_name: updated.project?.project_name || 'Independent Activity',
          diary_title: updated.diary_title,
          activity_description: updated.activity_description,
          work_progress: updated.work_progress,
          created_by: updated.created_by,
          created_at: updated.created_at,
          username: req.user.username,
          userId: req.user.id
        },
        log: log ? { ...log, username: req.user.username } : null
      });
    }

    res.json({ success: true, data: updated, message: 'Diary berhasil diperbarui' });
  } catch (error) {
    console.error('PUT /diaries error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ── DELETE /api/diaries/:id ────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const existing = await prisma.projectDiary.findFirst({
      where: { id: req.params.id, created_by: req.user.id },
      include: { project: true }
    });
    if (!existing) return res.status(404).json({ success: false, error: 'Diary tidak ditemukan' });

    await prisma.projectDiary.delete({ where: { id: req.params.id } });
    const log = await logActivity(req.user.id, 'DELETE_DIARY', existing.diary_title, existing.project?.project_name || 'Unknown Project');
    
    const io = req.app.get('io');
    if (io) {
      io.to('admin_room').emit('diary_deleted', {
        diaryId: req.params.id,
        userId: req.user.id,
        log: log ? { ...log, username: req.user.username } : null
      });
    }
    res.json({ success: true, message: 'Diary berhasil dihapus' });
  } catch (error) {
    console.error('DELETE /diaries error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
