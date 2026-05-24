'use strict';
/**
 * services/weeklyReportService.js
 * Generates ONE combined weekly PDF containing all active project leaders
 * and their teams grouped in separate sections inside the same document.
 */

const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const prisma = require('../prisma/client');

const REPORTS_DIR = path.join(__dirname, '..', 'reports', 'weekly');
fs.mkdirSync(REPORTS_DIR, { recursive: true });

// ── Colour palette ─────────────────────────────────────────────────────────────
const C = {
  brand: '#0f172a', // Slate 900
  brandMid: '#1e293b', // Slate 800
  accent: '#2563eb', // Blue 600
  accentSoft: '#f1f5f9', // Slate 100
  white: '#ffffff',
  black: '#020617',
  gray1: '#334155', // Slate 700
  gray2: '#475569', // Slate 600
  gray3: '#64748b', // Slate 500
  gray4: '#94a3b8', // Slate 400
  gray5: '#cbd5e1', // Slate 300
  gray6: '#e2e8f0', // Slate 200
  gray7: '#f1f5f9', // Slate 100
  gray8: '#f8fafc', // Slate 50
  success: '#059669', // Emerald 600
  successBg: '#ecfdf5', // Emerald 50
  warn: '#d97706', // Amber 600
  warnBg: '#fffbeb', // Amber 50
  danger: '#dc2626', // Red 600
  section: [
    '#2563eb', '#7c3aed', '#059669', '#d97706',
    '#dc2626', '#0891b2', '#be185d', '#4f46e5',
  ],
};

// ── Date helpers ───────────────────────────────────────────────────────────────
function formatDateIndo(date) {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
}
function formatDateShort(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function monthName(date) {
  return new Date(date).toLocaleDateString('en-US', { month: 'long' }).toLowerCase();
}
function weekOfMonth(date) {
  const d = new Date(date);
  const f = new Date(d.getFullYear(), d.getMonth(), 1);
  return Math.ceil((d.getDate() + f.getDay()) / 7);
}

// ── File name builder ──────────────────────────────────────────────────────────
function buildCombinedFileName(periodStart) {
  const d = new Date(periodStart);
  const mon = monthName(d);
  const wk = weekOfMonth(d);
  return `weekly-checkup-${mon}-week-${wk}.pdf`;
}

// ── PDF draw helpers ───────────────────────────────────────────────────────────
function drawProgressBar(doc, x, y, width, height, pct, color) {
  doc.roundedRect(x, y, width, height, height / 2).fill(C.gray6);
  const fillW = Math.max(height, Math.round((pct / 100) * width));
  if (pct > 0) {
    doc.roundedRect(x, y, Math.min(fillW, width), height, height / 2).fill(color || C.accent);
  }
}

function contPageHeader(doc, pageW, period) {
  // Top accent line
  doc.rect(0, 0, pageW, 4).fill(C.accent);

  doc.fillColor(C.brand).fontSize(9).font('Helvetica-Bold')
    .text('STAKS FLOW', 50, 18);

  doc.fillColor(C.gray3).fontSize(8).font('Helvetica')
    .text('Weekly Check-Up Report', 115, 19);

  doc.fillColor(C.gray3).fontSize(8).font('Helvetica')
    .text(`Period: ${period}`, 0, 19, { align: 'right', width: pageW - 50 });

  doc.moveTo(50, 32).lineTo(pageW - 50, 32).lineWidth(0.5).strokeColor(C.gray6).stroke();
}

function ensureSpace(doc, needed, pageH, pageW, period) {
  if (doc.y + needed > pageH - 60) {
    doc.addPage();
    contPageHeader(doc, pageW, period);
    doc.y = 50;
  }
}

function drawSectionDivider(doc, y, pageW) {
  doc.moveTo(50, y).lineTo(pageW - 50, y).lineWidth(0.3).strokeColor(C.gray6).stroke();
}

function generateConclusion(avgProgress) {
  if (avgProgress >= 85) return "Project progress is excellent and ahead of schedule. Keep up the consistent performance.";
  if (avgProgress >= 70) return "Project progress is stable and meeting expectations. Maintain current coordination levels.";
  if (avgProgress >= 50) return "Project progress is moderate. Some areas may require closer attention to stay on track.";
  if (avgProgress > 0) return "Project progress is slow. Increased coordination and task focus are recommended.";
  return "No measurable progress recorded this week. Immediate review is advised.";
}

// ── Cover page ─────────────────────────────────────────────────────────────────
function drawCoverPage(doc, { periodStart, periodEnd, periodLabel, leaderCount, projectCount, diaryCount, totalActivities, generatedAt }) {
  const pageW = doc.page.width;
  const pageH = doc.page.height;

  // Modern background
  doc.rect(0, 0, pageW, pageH).fill(C.gray8);

  // Minimalist top accent
  doc.rect(0, 0, pageW, 10).fill(C.brand);

  // Logo & Company Name
  try {
    const logoPath = path.join(__dirname, '..', 'public', 'img', 'logo.png');
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 50, { width: 50 });
    }
  } catch (_) { }

  doc.fillColor(C.brand).fontSize(16).font('Helvetica-Bold')
    .text('STAKS FLOW', 110, 68);

  // Main Titles
  doc.fillColor(C.brand).fontSize(48).font('Helvetica-Bold')
    .text('Weekly', 50, 200, { lineGap: -10 });
  doc.text('Check-Up Report', 50, 245);

  doc.fillColor(C.accent).fontSize(14).font('Helvetica-Bold')
    .text('COMPANY PERFORMANCE OVERVIEW', 50, 310);

  // Period card
  const periodY = 380;
  doc.roundedRect(50, periodY, pageW - 100, 60, 2).fill(C.white);
  doc.roundedRect(50, periodY, pageW - 100, 60, 2).lineWidth(0.2).strokeColor(C.gray5).stroke();

  doc.fillColor(C.gray3).fontSize(8).font('Helvetica-Bold')
    .text('REPORTING PERIOD', 70, periodY + 15);
  doc.fillColor(C.brand).fontSize(16).font('Helvetica-Bold')
    .text(`${formatDateIndo(periodStart)}  –  ${formatDateIndo(periodEnd)}`, 70, periodY + 30);

  // Statistics Grid
  const statY = 500;
  const statW = (pageW - 100 - 40) / 3;
  const stats = [
    ['Project Leaders', String(leaderCount)],
    ['Active Projects', String(projectCount)],
    ['Total Activities', String(totalActivities)],
  ];

  stats.forEach(([label, val], i) => {
    const sx = 50 + (statW + 20) * i;
    doc.fillColor(C.brand).fontSize(32).font('Helvetica-Bold').text(val, sx, statY);
    doc.fillColor(C.gray3).fontSize(9).font('Helvetica-Bold').text(label.toUpperCase(), sx, statY + 40);
  });

  // Footer info
  doc.fillColor(C.gray4).fontSize(9).font('Helvetica')
    .text(`Confidential report generated on ${formatDateIndo(generatedAt)}`, 50, pageH - 80);
  doc.text('© 2026 STAKS FLOW. INTERNAL USE ONLY.', 50, pageH - 65);
}

function drawRoadmapSection(doc, roadmap, pageW, pageH, period) {
  if (!roadmap) return;
  const contentW = pageW - 100;

  ensureSpace(doc, 120, pageH, pageW, period);

  // Section Header with background bar
  doc.roundedRect(50, doc.y, contentW, 22, 2).fill(C.accentSoft);
  doc.fillColor(C.accent).fontSize(9).font('Helvetica-Bold').text('PROJECT ROADMAP & MILESTONES', 65, doc.y + 7);
  doc.y += 32;

  // Roadmap Info Card
  const infoY = doc.y;
  doc.roundedRect(50, infoY, contentW, 60, 2).fill(C.white);
  doc.roundedRect(50, infoY, contentW, 60, 2).lineWidth(0.5).strokeColor(C.gray6).stroke();

  doc.fillColor(C.brand).fontSize(10).font('Helvetica-Bold').text(`Roadmap: ${roadmap.roadmap_title}`, 65, infoY + 12);
  doc.fillColor(C.gray3).fontSize(8).font('Helvetica').text(`Timeline: ${formatDateIndo(roadmap.start_date)} - ${formatDateIndo(roadmap.deadline)}`, 65, infoY + 28);

  const pct = roadmap.progress_percentage || 0;
  doc.fillColor(C.brand).fontSize(9).font('Helvetica-Bold').text(`${pct}% COMPLETE`, 0, infoY + 12, { align: 'right', width: pageW - 65 });
  drawProgressBar(doc, pageW - 150, infoY + 28, 100, 5, pct, C.accent);

  doc.y = infoY + 75;

  // Deadline Revisions (Show if any occurred during the week)
  const revisions = (roadmap.logs || []).filter(l => l.action === 'REVISE_DEADLINE');
  if (revisions.length > 0) {
    ensureSpace(doc, 40, pageH, pageW, period);
    doc.fillColor(C.warn).fontSize(9).font('Helvetica-Bold').text('DEADLINE REVISIONS THIS WEEK:', 50, doc.y);
    doc.y += 12;

    revisions.forEach(rev => {
      const revText = `• ${rev.details}`;
      const revH = doc.heightOfString(revText, { width: contentW - 20, fontSize: 8 });
      ensureSpace(doc, revH + 10, pageH, pageW, period);

      doc.fillColor(C.gray1).fontSize(8).font('Helvetica')
        .text(revText, 65, doc.y, { width: contentW - 30 });
      doc.y += revH + 5;
    });
    doc.y += 10;
  }

  // Milestones
  if (roadmap.milestones && roadmap.milestones.length > 0) {
    doc.fillColor(C.brand).fontSize(9).font('Helvetica-Bold').text('Target Milestones:', 50, doc.y);
    doc.y += 15;

    roadmap.milestones.forEach(m => {
      const isDone = m.status === 'completed' || m.progress_percentage === 100;
      const milestoneH = 32 + (m.activity_note ? 15 : 0);

      ensureSpace(doc, milestoneH + 10, pageH, pageW, period);

      const mY = doc.y;
      // Milestone card background
      doc.roundedRect(55, mY, contentW - 5, milestoneH, 2).fill(isDone ? C.successBg : C.gray8);

      doc.fillColor(isDone ? C.success : C.brand).fontSize(9).font(isDone ? 'Helvetica-Bold' : 'Helvetica')
        .text(`${isDone ? '✓' : '○'} ${m.title}`, 70, mY + 10);

      doc.fillColor(isDone ? C.success : C.gray3).fontSize(8).font('Helvetica-Bold')
        .text(`${m.progress_percentage}%`, 0, mY + 10, { align: 'right', width: pageW - 75 });

      doc.y = mY + 22;

      if (m.activity_note) {
        doc.fillColor(C.gray1).fontSize(8).font('Helvetica-Oblique')
          .text(`Latest Activity: ${m.activity_note}`, 85, doc.y, { width: contentW - 40 });
        doc.y += 12;
      }
      doc.y += 15;
    });
    doc.y += 10;
  }
}

// ── Leader section ─────────────────────────────────────────────────────────────
function drawLeaderSection(doc, leaderGroup, sectionIndex, period) {
  const pageW = doc.page.width;
  const pageH = doc.page.height;
  const contentW = pageW - 100;
  const isIndependent = leaderGroup.leaderId === 'independent';
  const color = isIndependent ? C.gray3 : C.section[sectionIndex % C.section.length];

  // Always start leader on fresh page
  doc.addPage();
  contPageHeader(doc, pageW, period);
  doc.y = 70;

  // ── Leader header banner ───────────────────────────────────────────────────
  const leaderHeaderH = 50;
  doc.roundedRect(50, doc.y, contentW, leaderHeaderH, 2).fill(C.brand);
  doc.fillColor(C.white).fontSize(20).font('Helvetica-Bold')
    .text(isIndependent ? 'General Activities' : leaderGroup.leaderName, 65, doc.y + 10);
  doc.fillColor(C.accentSoft).fontSize(8).font('Helvetica-Bold')
    .text(isIndependent ? 'INDEPENDENT USER LOGS' : 'PROJECT LEADER SECTION', 65, doc.y + 32);
  doc.y += leaderHeaderH + 30;

  // ── Projects loop ──────────────────────────────────────────────────────────
  leaderGroup.projects.forEach((proj, pIdx) => {
    ensureSpace(doc, 120, pageH, pageW, period);

    // Project sub-header with background
    const projHeaderH = 35;
    doc.roundedRect(50, doc.y, contentW, projHeaderH, 2).fill(C.gray8);
    doc.roundedRect(50, doc.y, 3, projHeaderH, 0).fill(color); // Accent line on the left

    doc.fillColor(C.brand).fontSize(14).font('Helvetica-Bold')
      .text(proj.projectName, 65, doc.y + 10);

    doc.y += projHeaderH + 10;

    if (!isIndependent) {
      doc.fillColor(C.brand).fontSize(8).font('Helvetica-Bold').text('TEAM MEMBERS:', 65, doc.y);
      const teamText = proj.mentees.map(m => m.username).join('  •  ') || 'None assigned';
      doc.fillColor(C.brand).fontSize(8).font('Helvetica-Bold').text(teamText, 140, doc.y, { width: contentW - 90 });
      doc.y += 25;
    }

    // ── Roadmap Section ───────────────────────────────────────────────────
    if (proj.roadmap) {
      drawRoadmapSection(doc, proj.roadmap, pageW, pageH, period);
    }

    // ── Diaries ─────────────────────────────────────────────────────────────
    if (!proj.diaries.length) {
      doc.fillColor(C.gray4).fontSize(9).font('Helvetica-Oblique').text('No activity logs recorded for this project.', 50, doc.y);
      doc.y += 30;
    } else {
      // Group diaries by creator
      const byUser = new Map();
      proj.diaries.forEach(d => {
        const uid = d.created_by;
        if (!byUser.has(uid)) byUser.set(uid, { name: d.creator?.username || 'Unknown', entries: [] });
        byUser.get(uid).entries.push(d);
      });

      for (const [, userData] of byUser) {
        ensureSpace(doc, 30, pageH, pageW, period);
        doc.fillColor(C.brand).fontSize(11).font('Helvetica-Bold').text(userData.name, 50, doc.y);
        doc.y += 18;

        userData.entries.forEach((diary, dIdx) => {
          const desc = diary.activity_description || 'No description provided.';
          const descHeight = doc.heightOfString(desc, { width: contentW, fontSize: 9, lineGap: 3 });
          // Title (12) + Gap (8) + Progress Bar (6) + Gap (8) + Description
          const entryH = 34 + descHeight;

          ensureSpace(doc, entryH + 20, pageH, pageW, period);

          const startY = doc.y;
          // Soft divider
          doc.moveTo(50, startY).lineTo(pageW - 50, startY).lineWidth(0.2).strokeColor(C.gray6).stroke();

          // Activity Title — Progress XX%
          const pct = diary.work_progress || 0;
          doc.fillColor(C.brand).fontSize(10).font('Helvetica-Bold')
            .text(`${diary.diary_title || 'Untitled'} — ${pct}%`, 50, startY + 12);

          // Progress Bar with Color Logic
          const barY = startY + 28;
          const barColor = pct <= 30 ? C.danger : pct <= 70 ? C.warn : C.success;
          drawProgressBar(doc, 50, barY, contentW, 4, pct, barColor);

          // Description
          doc.fillColor(C.gray2).fontSize(9).font('Helvetica')
            .text(desc, 50, barY + 12, { width: contentW, lineGap: 3, align: 'justify' });

          doc.y = startY + entryH + 15;
        });
      }
    }

    // Project footer Conclusion Summary
    if (proj.diaries.length > 0) {
      const avgP = proj.diaries.reduce((s, d) => s + (d.work_progress || 0), 0) / proj.diaries.length;
      ensureSpace(doc, 80, pageH, pageW, period);

      doc.y += 15;
      const concY = doc.y;
      doc.rect(50, concY, contentW, 60).fill(C.gray8);
      doc.rect(50, concY, 3, 60).fill(C.brand);

      doc.fillColor(C.brand).fontSize(9).font('Helvetica-Bold')
        .text('PROJECT CONCLUSION', 65, concY + 12);

      doc.fillColor(C.gray1).fontSize(9).font('Helvetica')
        .text(generateConclusion(avgP), 65, concY + 28, { width: contentW - 30 });

      doc.fillColor(C.gray3).fontSize(8).font('Helvetica-Bold')
        .text(`AVG. PROGRESS: ${Math.round(avgP)}%`, 0, concY + 12, { align: 'right', width: pageW - 65 });

      doc.y = concY + 75;
    }

    doc.y += 20;
  });
}

// ── Footer page numbers ────────────────────────────────────────────────────────
function addPageNumbers(doc) {
  const range = doc.bufferedPageRange();
  const pageW = doc.page.width;
  const pageH = doc.page.height;
  for (let i = 0; i < range.count; i++) {
    doc.switchToPage(i);
    if (i === 0) continue; // skip cover

    doc.moveTo(50, pageH - 40).lineTo(pageW - 50, pageH - 40).lineWidth(0.5).strokeColor(C.gray6).stroke();

    doc.fillColor(C.gray4).fontSize(7).font('Helvetica')
      .text('Generated by STAKS Flow', 50, pageH - 30);

    doc.fillColor(C.gray4).fontSize(7).font('Helvetica')
      .text(`Page ${i + 1} of ${range.count}`, 0, pageH - 30, { align: 'right', width: pageW - 50 });
  }
}

// ── Build the combined PDF ─────────────────────────────────────────────────────
async function buildCombinedPdf({ fileName, periodStart, periodEnd, periodLabel, leaderGroups, completedGroups }) {
  const filePath = path.join(REPORTS_DIR, fileName);
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 0, bottom: 50, left: 50, right: 50 },
    bufferPages: true,
    autoFirstPage: true,
  });

  const ws = fs.createWriteStream(filePath);
  doc.pipe(ws);

  const leaderCount = leaderGroups.filter(lg => lg.leaderId !== 'independent').length;
  const projectCount = leaderGroups.reduce((s, lg) => s + (lg.leaderId === 'independent' ? 0 : lg.projects.length), 0);
  const diaryCount = leaderGroups.reduce((s, lg) => s + lg.projects.reduce((ps, p) => ps + p.diaries.length, 0), 0);
  const totalActivities = leaderGroups.reduce((s, lg) => s + lg.projects.reduce((ps, p) => ps + (p.activities?.length || 0), 0), 0) + diaryCount;

  // Page 1 — Cover
  drawCoverPage(doc, {
    periodStart, periodEnd, periodLabel,
    leaderCount, projectCount, diaryCount, totalActivities,
    generatedAt: new Date(),
  });

  // Page 2+ — Completed Projects

  if (completedGroups && completedGroups.length > 0) {
    drawCompletedProjectsSection(doc, completedGroups, periodLabel);
  }

  // Next Pages — One section per leader
  leaderGroups.forEach((lg, idx) => {
    drawLeaderSection(doc, lg, idx, periodLabel);
  });

  // Page numbers
  addPageNumbers(doc);

  doc.end();
  return new Promise((resolve, reject) => {
    ws.on('finish', () => resolve(filePath));
    ws.on('error', reject);
    doc.on('error', reject);
  });
}

function drawCompletedProjectsSection(doc, completedGroups, period) {
  const pageW = doc.page.width;
  const pageH = doc.page.height;
  const contentW = pageW - 100;

  doc.addPage();
  contPageHeader(doc, pageW, period);
  doc.y = 60;

  // Section title
  doc.fillColor(C.brand).fontSize(18).font('Helvetica-Bold').text('Completed Projects', 50, doc.y);
  doc.y += 35;

  completedGroups.forEach((proj, idx) => {
    ensureSpace(doc, 130, pageH, pageW, period);

    const startY = doc.y;
    doc.rect(50, startY, contentW, 110).fill(C.successBg);
    doc.rect(50, startY, contentW, 110).lineWidth(0.5).strokeColor(C.success).stroke();

    // Project Name & Leader
    doc.fillColor(C.success).fontSize(8).font('Helvetica-Bold').text('COMPLETED STATUS', 65, startY + 15);
    doc.fillColor(C.brand).fontSize(14).font('Helvetica-Bold').text(proj.projectName, 65, startY + 28);

    const infoY = startY + 55;
    doc.fillColor(C.gray2).fontSize(8).font('Helvetica').text('Project Leader', 65, infoY);
    doc.fillColor(C.brandMid).fontSize(9).font('Helvetica-Bold').text(proj.leaderName, 65, infoY + 12);

    doc.fillColor(C.gray2).fontSize(8).font('Helvetica').text('Completion Date', 180, infoY);
    doc.fillColor(C.brandMid).fontSize(9).font('Helvetica-Bold').text(formatDateIndo(proj.completedAt), 180, infoY + 12);

    doc.fillColor(C.gray2).fontSize(8).font('Helvetica').text('Team Size', 300, infoY);
    doc.fillColor(C.brandMid).fontSize(9).font('Helvetica-Bold').text(`${proj.mentees.length} Members`, 300, infoY + 12);

    // Summary
    doc.fillColor(C.gray3).fontSize(8).font('Helvetica-Oblique')
      .text(`Summary: ${proj.description}`, 65, startY + 85, { width: contentW - 30, height: 15, ellipsis: true });

    doc.y = startY + 125;
  });
}

// ── Main entry point ───────────────────────────────────────────────────────────
async function generateWeeklyReports(referenceDate = new Date()) {
  const now = new Date(referenceDate);
  now.setHours(0, 0, 0, 0);

  // Previous week Mon–Sun
  const dayOfWeek = now.getDay(); // 0=Sun…6=Sat
  const offsetToSun = dayOfWeek === 0 ? 7 : dayOfWeek;
  const end = new Date(now);
  end.setDate(end.getDate() - offsetToSun);
  end.setHours(23, 59, 59, 999);

  const start = new Date(end);
  start.setDate(start.getDate() - 6);
  start.setHours(0, 0, 0, 0);

  const periodStart = formatDateShort(start);
  const periodEnd = formatDateShort(end);
  const periodLabel = `${periodStart} - ${periodEnd}`;

  // ── Duplicate guard ────────────────────────────────────────────────────────
  const existing = await prisma.combinedWeeklyReport.findUnique({
    where: { report_period: periodLabel },
  });
  if (existing) {
    return { period: periodLabel, generated_at: new Date(), created_count: 0, reports: [] };
  }

  // ── Fetch all active projects and their roadmaps ─────────────────────────
  const activeProjects = await prisma.project.findMany({
    where: { project_status: { in: ['ongoing', 'upcoming'] } },
    include: {
      members: { include: { user: true } },
      roadmap: {
        include: {
          milestones: { orderBy: { order: 'asc' } },
          logs: {
            where: { timestamp: { gte: start, lte: end } },
            include: { user: { select: { username: true } } },
            orderBy: { timestamp: 'desc' }
          }
        }
      },
      diaries: {
        where: { created_at: { gte: start, lte: end } },
        include: { creator: true }
      }
    }
  });

  // ── Fetch general diaries in the period ───────────────────────────────────
  const generalDiaries = await prisma.diary.findMany({
    where: { created_at: { gte: start, lte: end } },
    include: { creator: true },
    orderBy: { created_at: 'asc' },
  });

  // ── Fetch activity logs in the period ─────────────────────────────────────
  const activityLogs = await prisma.activityLog.findMany({
    where: { timestamp: { gte: start, lte: end } },
    include: { user: true },
    orderBy: { timestamp: 'asc' }
  });

  // ── Fetch completed projects in the period ────────────────────────────────
  const completedProjects = await prisma.project.findMany({
    where: {
      project_status: 'completed',
      completed_at: { gte: start, lte: end }
    },
    include: {
      members: { include: { user: true } },
      diaries: {
        where: { created_at: { gte: start, lte: end } },
        include: { creator: true }
      }
    }
  });

  if (!activeProjects.length && !generalDiaries.length && !completedProjects.length) {
    return { period: periodLabel, generated_at: new Date(), created_count: 0, reports: [] };
  }

  // ── Group by project → leader → mentees ───────────────────────────────────
  // Map: leaderId → { leaderName, projects: Map<projectId, { projectName, mentees[], diaries[], activities[], roadmap }> }
  const leaderMap = new Map();
  const independentData = { diaries: [], activities: [] };

  // Helper to get or create leader entry
  const getLeaderEntry = (leaderId, leaderName) => {
    if (!leaderMap.has(leaderId)) {
      leaderMap.set(leaderId, { leaderId, leaderName, projects: new Map(), personalActivities: [] });
    }
    return leaderMap.get(leaderId);
  };

  activeProjects.forEach(project => {
    const leaderMember = (project.members || []).find(m => m.role === 'leader');
    const leaderId = leaderMember?.user?.id || 'no-leader';
    const leaderName = leaderMember?.user?.username || 'No Leader Assigned';

    const leaderEntry = getLeaderEntry(leaderId, leaderName);

    const pid = project.id;
    if (!leaderEntry.projects.has(pid)) {
      const mentees = (project.members || [])
        .filter(m => m.role !== 'leader')
        .map(m => ({ id: m.user_id, username: m.user?.username || 'Unknown' }));
      leaderEntry.projects.set(pid, {
        projectId: pid,
        projectName: project.project_name,
        mentees,
        diaries: project.diaries || [],
        activities: [],
        roadmap: project.roadmap
      });
    }
  });

  // Include general diaries as independent or link to user
  generalDiaries.forEach(diary => {
    independentData.diaries.push(diary);
  });

  // Add activity logs to roadmap
  activityLogs.forEach(log => {
    // Try to find which project this log belongs to (based on category or user)
    const user = log.user;
    if (!user) return;

    // Check if user is in any leader's project
    let found = false;
    for (const leaderEntry of leaderMap.values()) {
      for (const project of leaderEntry.projects.values()) {
        const isMember = project.mentees.some(m => m.id === log.user_id) || leaderEntry.leaderId === log.user_id;
        if (isMember) {
          project.activities.push(log);
          found = true;
          break;
        }
      }
      if (found) break;
    }

    if (!found) {
      independentData.activities.push(log);
    }
  });

  // Convert to array (sort leaders alphabetically)
  const leaderGroups = Array.from(leaderMap.values())
    .sort((a, b) => a.leaderName.localeCompare(b.leaderName))
    .map(lg => ({
      ...lg,
      projects: Array.from(lg.projects.values()),
    }));

  // Add independent activities group if any
  if (independentData.diaries.length > 0 || independentData.activities.length > 0) {
    leaderGroups.push({
      leaderId: 'independent',
      leaderName: 'General Activities',
      projects: [{
        projectId: 'none',
        projectName: 'General Activities',
        mentees: [],
        diaries: independentData.diaries,
        activities: independentData.activities
      }]
    });
  }

  // ── Prepare Completed Projects Group ──────────────────────────────────────
  const completedGroups = completedProjects.map(proj => {
    const leaderMember = (proj.members || []).find(m => m.role === 'leader');
    const mentees = (proj.members || [])
      .filter(m => m.role !== 'leader')
      .map(m => ({ id: m.user_id, username: m.user?.username || 'Unknown' }));
    return {
      projectName: proj.project_name,
      description: proj.description || 'No description provided.',
      leaderName: leaderMember?.user?.username || 'No Leader',
      mentees: mentees,
      completedAt: proj.completed_at,
      diaries: proj.diaries
    };
  });

  // ── Generate PDF ───────────────────────────────────────────────────────────
  const fileName = buildCombinedFileName(periodStart);
  await buildCombinedPdf({ fileName, periodStart, periodEnd, periodLabel, leaderGroups, completedGroups });

  // Use forward slashes for database consistency
  const relPath = `reports/weekly/${fileName}`;
  const leaderCount = leaderGroups.length;

  // Calculate total diaries from all sources
  const activeDiariesCount = activeProjects.reduce((acc, p) => acc + (p.diaries?.length || 0), 0);
  const completedDiariesCount = completedProjects.reduce((acc, p) => acc + (p.diaries?.length || 0), 0);
  const diaryCount = activeDiariesCount + completedDiariesCount + generalDiaries.length;

  const totalActivities = diaryCount + activityLogs.length;
  const reportName = `Weekly Check-Up Report — ${periodLabel}`;

  const record = await prisma.combinedWeeklyReport.create({
    data: {
      report_name: reportName,
      report_period: periodLabel,
      file_name: fileName,
      file_path: relPath,
      leader_count: leaderCount,
      diary_count: diaryCount,
      total_activities: totalActivities,
    },
  });

  return {
    period: periodLabel,
    generated_at: new Date(),
    created_count: 1,
    reports: [record],
  };
}

module.exports = { generateWeeklyReports, REPORTS_DIR };