const express = require('express');
const router  = express.Router();
const authMiddleware = require('../middleware/auth');
const prisma = require('../prisma/client');

router.use(authMiddleware);

// GET /api/projects/my
router.get('/my', async (req, res) => {
  try {
    const memberships = await prisma.projectMember.findMany({
      where: { user_id: req.user.id },
      include: {
        project: {
          include: {
            members: {
              include: {
                user: { select: { username: true, email: true } }
              }
            }
          }
        }
      }
    });

    const projects = memberships.map(m => {
      const p = m.project;
      const leader = p.members.find(member => member.role === 'leader');
      const mentees = p.members.filter(member => member.role === 'mentee');
      return {
        id: p.id,
        project_name: p.project_name,
        description: p.description,
        start_date: p.start_date,
        project_status: p.project_status,
        my_role: m.role,
        leader: leader ? { id: leader.user_id, username: leader.user?.username } : null,
        mentees: mentees.map(mt => ({ id: mt.user_id, username: mt.user?.username }))
      };
    });

    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/projects/:id/members
router.get('/:id/members', async (req, res) => {
  try {
    const { id } = req.params;
    const memberCheck = await prisma.projectMember.findFirst({
      where: { project_id: id, user_id: req.user.id }
    });
    if (!memberCheck) {
      return res.status(403).json({ success: false, error: 'Anda bukan anggota proyek ini' });
    }

    const members = await prisma.projectMember.findMany({
      where: { project_id: id },
      include: { user: { select: { username: true, email: true } } }
    });

    res.json({ success: true, data: members.map(m => ({
      user_id: m.user_id,
      username: m.user?.username || 'Unknown',
      email: m.user?.email || '',
      role: m.role
    })) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/projects/:id/roadmap (Project Diaries)
router.get('/:id/roadmap', async (req, res) => {
  try {
    const { id } = req.params;
    const memberCheck = await prisma.projectMember.findFirst({
      where: { project_id: id, user_id: req.user.id }
    });
    const isAdmin = req.user.role === 'admin';
    if (!memberCheck && !isAdmin) {
      return res.status(403).json({ success: false, error: 'Anda bukan anggota proyek ini' });
    }

    const diaries = await prisma.projectDiary.findMany({
      where: { project_id: id },
      include: { creator: { select: { username: true } } },
      orderBy: { created_at: 'desc' }
    });

    res.json({
      success: true,
      data: diaries.map(d => ({
        id: d.id,
        diary_title: d.diary_title,
        activity_description: d.activity_description,
        work_progress: d.work_progress,
        created_by: d.created_by,
        username: d.creator?.username || 'Unknown',
        created_at: d.created_at
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/projects/:id/roadmap-details
router.get('/:id/roadmap-details', async (req, res) => {
  try {
    const { id } = req.params;
    const membership = await prisma.projectMember.findFirst({
      where: { project_id: id, user_id: req.user.id }
    });
    const isAdmin = req.user.role === 'admin';
    if (!membership && !isAdmin) {
      return res.status(403).json({ success: false, error: 'Anda bukan anggota proyek ini' });
    }

    const roadmap = await prisma.projectRoadmap.findUnique({
      where: { project_id: id },
      include: {
        milestones: { 
          orderBy: { order: 'asc' },
          include: { assignee: { select: { username: true } } }
        },
        logs: {
          include: { user: { select: { username: true } } },
          orderBy: { timestamp: 'desc' },
          take: 20
        }
      }
    });

    if (!roadmap) {
      return res.json({ success: true, data: null, my_role: membership?.role || 'admin' });
    }

    res.json({ 
      success: true, 
      data: roadmap,
      my_role: membership?.role || 'admin'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/projects/:id/roadmap
router.patch('/:id/roadmap', async (req, res) => {
  try {
    const { id } = req.params;
    const { roadmap_title, description, start_date, deadline, status, revision_reason } = req.body;

    const membership = await prisma.projectMember.findFirst({
      where: { project_id: id, user_id: req.user.id, role: 'leader' }
    });
    if (!membership) {
      return res.status(403).json({ success: false, error: 'Hanya Project Leader yang dapat mengubah pengaturan roadmap' });
    }

    const currentRoadmap = await prisma.projectRoadmap.findUnique({ where: { project_id: id } });
    if (!currentRoadmap) return res.status(404).json({ success: false, error: 'Roadmap tidak ditemukan' });

    const isDeadlineRevision = deadline && currentRoadmap.deadline !== deadline;

    const roadmap = await prisma.projectRoadmap.update({
      where: { project_id: id },
      data: {
        roadmap_title,
        description,
        start_date,
        deadline,
        status
      }
    });

    let action = 'UPDATE_ROADMAP_SETTINGS';
    let details = `Pengaturan roadmap "${roadmap.roadmap_title}" diperbarui.`;

    if (isDeadlineRevision) {
      action = 'REVISE_DEADLINE';
      details = `DEADLINE REVISED: Dari ${currentRoadmap.deadline} ke ${deadline}.`;
      if (revision_reason) details += ` Alasan: ${revision_reason}`;
    }

    await prisma.roadmapProgressLog.create({
      data: {
        roadmap_id: roadmap.id,
        user_id: req.user.id,
        action,
        details
      }
    });

    res.json({ success: true, data: roadmap });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/projects/:id/roadmap
router.post('/:id/roadmap', async (req, res) => {
  try {
    const { id } = req.params;
    const { roadmap_title, description, start_date, deadline } = req.body;

    const membership = await prisma.projectMember.findFirst({
      where: { project_id: id, user_id: req.user.id, role: 'leader' }
    });
    if (!membership) {
      return res.status(403).json({ success: false, error: 'Hanya Project Leader yang dapat membuat roadmap' });
    }

    const roadmap = await prisma.projectRoadmap.create({
      data: {
        project_id: id,
        roadmap_title,
        description,
        start_date,
        deadline,
        status: 'ongoing'
      }
    });

    await prisma.roadmapProgressLog.create({
      data: {
        roadmap_id: roadmap.id,
        user_id: req.user.id,
        action: 'CREATE_ROADMAP',
        details: `Roadmap "${roadmap_title}" dibuat.`
      }
    });

    res.status(201).json({ success: true, data: roadmap });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/projects/:id/roadmap/milestones
router.post('/:id/roadmap/milestones', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, start_date, deadline, progress_percentage, status, order, assigned_to, activity_note } = req.body;

    const membership = await prisma.projectMember.findFirst({
      where: { project_id: id, user_id: req.user.id }
    });
    if (!membership) {
      return res.status(403).json({ success: false, error: 'Hanya anggota proyek yang dapat menambah milestone' });
    }

    const roadmap = await prisma.projectRoadmap.findUnique({ where: { project_id: id } });
    if (!roadmap) return res.status(404).json({ success: false, error: 'Roadmap belum dibuat' });

    const milestone = await prisma.roadmapMilestone.create({
      data: {
        roadmap_id: roadmap.id,
        title,
        description,
        start_date,
        deadline,
        progress_percentage: parseInt(progress_percentage) || 0,
        status: status || 'pending',
        order: parseInt(order) || 0,
        assigned_to: assigned_to || null,
        activity_note
      }
    });

    // Update overall progress
    const milestones = await prisma.roadmapMilestone.findMany({ where: { roadmap_id: roadmap.id } });
    const totalProgress = milestones.reduce((acc, m) => acc + m.progress_percentage, 0);
    const avgProgress = milestones.length > 0 ? Math.round(totalProgress / milestones.length) : 0;

    await prisma.projectRoadmap.update({
      where: { id: roadmap.id },
      data: { progress_percentage: avgProgress }
    });

    await prisma.roadmapProgressLog.create({
      data: {
        roadmap_id: roadmap.id,
        milestone_id: milestone.id,
        user_id: req.user.id,
        action: 'ADD_MILESTONE',
        details: `Milestone "${title}" ditambahkan.${activity_note ? ` Catatan: ${activity_note}` : ''}`
      }
    });

    res.status(201).json({ success: true, data: milestone });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/projects/:id/roadmap/milestones/:milestoneId
router.patch('/:id/roadmap/milestones/:milestoneId', async (req, res) => {
  try {
    const { id, milestoneId } = req.params;
    const { title, description, start_date, deadline, progress_percentage, status, order, assigned_to, activity_note, note } = req.body;

    const membership = await prisma.projectMember.findFirst({
      where: { project_id: id, user_id: req.user.id }
    });
    
    if (!membership) {
      return res.status(403).json({ success: false, error: 'Anda bukan anggota proyek ini' });
    }

    const milestone = await prisma.roadmapMilestone.findUnique({ where: { id: milestoneId } });
    if (!milestone) return res.status(404).json({ success: false, error: 'Milestone tidak ditemukan' });

    const isLeader = membership.role === 'leader';
    // Mentees can now fill any milestone in the project as per Requirement 1 & 10
    const canEdit = isLeader || membership.role === 'mentee';

    if (!canEdit) {
      return res.status(403).json({ success: false, error: 'Anda tidak memiliki akses untuk mengubah milestone ini' });
    }

    const updateData = {};
    const finalNote = activity_note || note; // Support both names for compatibility

    if (isLeader) {
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (start_date !== undefined) updateData.start_date = start_date;
      if (deadline !== undefined) updateData.deadline = deadline;
      if (progress_percentage !== undefined) updateData.progress_percentage = parseInt(progress_percentage);
      if (status !== undefined) updateData.status = status;
      if (order !== undefined) updateData.order = parseInt(order);
      if (assigned_to !== undefined) updateData.assigned_to = assigned_to;
      if (finalNote !== undefined) updateData.activity_note = finalNote;
    } else {
      // Mentee permissions
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (deadline !== undefined) updateData.deadline = deadline;
      if (progress_percentage !== undefined) updateData.progress_percentage = parseInt(progress_percentage);
      if (status !== undefined) updateData.status = status;
      if (finalNote !== undefined) updateData.activity_note = finalNote;
    }

    const updatedMilestone = await prisma.roadmapMilestone.update({
      where: { id: milestoneId },
      data: updateData
    });

    const roadmap = await prisma.projectRoadmap.findUnique({ where: { project_id: id } });
    const milestones = await prisma.roadmapMilestone.findMany({ where: { roadmap_id: roadmap.id } });
    const totalProgress = milestones.reduce((acc, m) => acc + m.progress_percentage, 0);
    const avgProgress = milestones.length > 0 ? Math.round(totalProgress / milestones.length) : 0;

    await prisma.projectRoadmap.update({
      where: { id: roadmap.id },
      data: { progress_percentage: avgProgress }
    });

    let details = `Milestone "${updatedMilestone.title}" diperbarui. Progress: ${updatedMilestone.progress_percentage}%`;
    if (finalNote) details += ` | Catatan: ${finalNote}`;

    await prisma.roadmapProgressLog.create({
      data: {
        roadmap_id: roadmap.id,
        milestone_id: updatedMilestone.id,
        user_id: req.user.id,
        action: 'UPDATE_MILESTONE',
        details
      }
    });

    res.json({ success: true, data: updatedMilestone });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/projects/:id/roadmap/milestones/:milestoneId
router.delete('/:id/roadmap/milestones/:milestoneId', async (req, res) => {
  try {
    const { id, milestoneId } = req.params;

    const membership = await prisma.projectMember.findFirst({
      where: { project_id: id, user_id: req.user.id, role: 'leader' }
    });
    if (!membership) {
      return res.status(403).json({ success: false, error: 'Hanya Project Leader yang dapat menghapus milestone' });
    }

    const milestone = await prisma.roadmapMilestone.findUnique({ where: { id: milestoneId } });
    if (!milestone) return res.status(404).json({ success: false, error: 'Milestone tidak ditemukan' });

    await prisma.roadmapMilestone.delete({ where: { id: milestoneId } });

    const roadmap = await prisma.projectRoadmap.findUnique({ where: { project_id: id } });
    const milestones = await prisma.roadmapMilestone.findMany({ where: { roadmap_id: roadmap.id } });
    const avgProgress = milestones.length > 0 ? Math.round(milestones.reduce((acc, m) => acc + m.progress_percentage, 0) / milestones.length) : 0;

    await prisma.projectRoadmap.update({
      where: { id: roadmap.id },
      data: { progress_percentage: avgProgress }
    });

    await prisma.roadmapProgressLog.create({
      data: {
        roadmap_id: roadmap.id,
        user_id: req.user.id,
        action: 'DELETE_MILESTONE',
        details: `Milestone "${milestone.title}" dihapus.`
      }
    });

    res.json({ success: true, message: 'Milestone berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
