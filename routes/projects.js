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
        end_date: p.end_date,
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

// GET /api/projects/:id/timeline
router.get('/:id/timeline', async (req, res) => {
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

module.exports = router;
