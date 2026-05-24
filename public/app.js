/* =============================================
   STAKS FLOW — Frontend Application Logic
   ============================================= */

const API_BASE  = '/api/diaries';
const AUTH_BASE = '/api/auth';

// ── Manual Book Logic ────────────────────────────────────────
let userManualCategories = [];
let currentTutorialId = null;

async function loadManualBook() {
  const sidebar = getEl("manualSidebarList");
  if (sidebar) sidebar.innerHTML = '<div class="spinner" style="margin:20px auto;"></div>';

  try {
    const json = await apiFetch("/api/manual/categories");
    userManualCategories = json.data || [];
    renderManualSidebar();

    // Auto load first tutorial if available and none selected
    if (userManualCategories.length > 0 && !currentTutorialId) {
      const firstCat = userManualCategories.find(c => c.manuals && c.manuals.length > 0);
      if (firstCat) openTutorial(firstCat.manuals[0].id);
    }
  } catch (err) {
    showToast("Gagal memuat manual book: " + err.message, "error");
  }
}

function renderManualSidebar() {
  const sidebar = getEl("manualSidebarList");
  if (!sidebar) return;

  if (userManualCategories.length === 0) {
    sidebar.innerHTML = '<div style="padding:20px; text-align:center; opacity:0.5;">Belum ada panduan.</div>';
    return;
  }

  sidebar.innerHTML = userManualCategories.map(cat => `
    <div class="manual-cat-group">
      <div class="manual-cat-label" onclick="toggleUserCat('${cat.id}')">
        <i class="bi ${cat.icon || 'bi-journal-text'}"></i>
        <span>${escHtml(cat.name)}</span>
        <i class="bi bi-chevron-down ms-auto" style="font-size:10px; opacity:0.5;"></i>
      </div>
      <ul class="manual-tut-list" id="user-cat-${cat.id}" style="display:block;">
        ${cat.manuals.map(m => `
          <li class="manual-tut-link ${m.id === currentTutorialId ? 'active' : ''}" id="user-tut-${m.id}" onclick="openTutorial('${m.id}')">
            ${escHtml(m.title)}
          </li>
        `).join('')}
      </ul>
    </div>
  `).join('');
}

function toggleUserCat(id) {
  const el = getEl(`user-cat-${id}`);
  if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

async function openTutorial(id) {
  currentTutorialId = id;
  // Update UI active state
  document.querySelectorAll('.manual-tut-link').forEach(l => l.classList.remove('active'));
  getEl(`user-tut-${id}`)?.classList.add('active');

  const contentArea = getEl("manualContentArea");
  if (contentArea) contentArea.innerHTML = '<div class="spinner" style="margin:60px auto;"></div>';

  try {
    const json = await apiFetch(`/api/manual/tutorials/${id}`);
    const tut = json.data;

    if (contentArea) {
      contentArea.innerHTML = `
        <div class="manual-reading-container">
          <div class="manual-reader">
            <div class="manual-breadcrumb">
              <i class="bi bi-journal-bookmark-fill"></i>
              Manual Book / ${escHtml(tut.category.name)}
            </div>
            <h1 class="manual-title">${escHtml(tut.title)}</h1>
            <div class="manual-meta">
              <span><i class="bi bi-clock-history"></i> Terakhir diperbarui: ${new Date(tut.updated_at).toLocaleDateString('id-ID')}</span>
              <span><i class="bi bi-person-circle"></i> Penulis: ${escHtml(tut.creator.username)}</span>
            </div>
            <div class="manual-body manual-rich-content">${tut.content}</div>
          </div>
        </div>
      `;
      // Scroll to top
      getEl('manualContentWrapper')?.scrollTo(0, 0);
    }
  } catch (err) {
    showToast("Gagal memuat tutorial: " + err.message, "error");
  }
}

async function searchManuals() {
  const q = getEl("manualSearchInput")?.value.trim();
  if (!q) {
    loadManualBook();
    return;
  }

  try {
    const json = await apiFetch(`/api/manual/search?q=${encodeURIComponent(q)}`);
    const results = json.data || [];

    const sidebar = getEl("manualSidebarList");
    if (sidebar) {
      if (results.length === 0) {
        sidebar.innerHTML = '<div style="padding:20px; text-align:center; opacity:0.5;">Tidak ada hasil.</div>';
      } else {
        sidebar.innerHTML = `
          <div class="manual-cat-label" style="pointer-events:none; opacity:0.6;">HASIL PENCARIAN</div>
          <ul class="manual-tut-list" style="display:block;">
            ${results.map(r => `
              <li class="manual-tut-link ${r.id === currentTutorialId ? 'active' : ''}" onclick="openTutorial('${r.id}')">
                ${escHtml(r.title)}
              </li>
            `).join('')}
          </ul>
        `;
      }
    }
  } catch (err) { /* ignore search error */ }
}

window.openTutorial = openTutorial;
window.searchManuals = searchManuals;
window.toggleUserCat = toggleUserCat;

// ── Auth Token ───────────────────────────
const getToken  = () => sessionStorage.getItem('tf_token');
const setToken  = (t) => sessionStorage.setItem('tf_token', t);
const clearToken = () => sessionStorage.removeItem('tf_token');

// Auth Guard is handled inside the async IIFE below to avoid race conditions.
let currentUser = null;

// ─── State ───────────────────────────────────
let allDiaries      = [];
let allProjects     = [];
let activeProjectId = 'all';
let searchQuery     = '';
let sortBy          = 'newest';
let editingTaskId   = null;
let deletingTaskId  = null;
let currentTab      = 'diaries';

// ─── DOM References ───────────────────────────
const loadingState     = document.getElementById('loadingState');
const emptyState       = document.getElementById('emptyState');
const modalOverlay     = document.getElementById('modalOverlay');
const deleteModalOverlay = document.getElementById('deleteModalOverlay');
const taskForm         = document.getElementById('taskForm');
const searchInput      = document.getElementById('searchInput');
const searchClear      = document.getElementById('searchClear');
const sidebar          = document.getElementById('sidebar');
const overlay          = document.getElementById('overlay');

const getEl = (id) => document.getElementById(id);
const getValue = (id) => document.getElementById(id)?.value || '';
const setText = (id, text) => { const el = getEl(id); if (el) el.textContent = text; };
const setHTML = (id, html) => { const el = getEl(id); if (el) el.innerHTML = html; };
const setValue = (id, value) => { const el = getEl(id); if (el) el.value = value; };
const addListener = (id, event, handler) => { const el = getEl(id); if (el) el.addEventListener(event, handler); return el; };

// ─── API Helpers ──────────────────────────────
async function apiFetch(url, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, { headers, ...options });
  const data = await res.json();
  if (res.status === 401 || res.status === 403) { doLogout(); return; }
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

async function authFetch(url, body) {
  const res  = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// ─── LOAD & RENDER ────────────────────────────
async function loadTasks() {
  showLoading(true);
  try {
    const [diariesRes, projectsRes] = await Promise.all([
      apiFetch(API_BASE),
      apiFetch('/api/projects/my')
    ]);
    allDiaries = diariesRes.data || [];
    allProjects = projectsRes.data || [];
    
    populateProjectSelects();
    renderAll();
  } catch (err) {
    showToast('Gagal memuat data: ' + err.message, 'error');
    showLoading(false);
  }
}

function populateProjectSelects() {
  const taskProject = getEl('taskProject');
  const filterSelect = getEl('filterProjectSelect');
  
  if (taskProject) {
    taskProject.innerHTML = '<option value="">— Independent Activity (No Project) —</option>' +
      allProjects.map(p => `<option value="${p.id}">${escHtml(p.project_name)} [${escHtml(p.project_status)}]</option>`).join('');
  }
  
  if (filterSelect) {
    filterSelect.innerHTML = '<option value="all">Semua Proyek</option>' +
      '<option value="independent">Independent Activity</option>' +
      allProjects.map(p => `<option value="${p.id}">${escHtml(p.project_name)}</option>`).join('');
  }
}

function renderAll() {
  updateBadges();
  if (currentTab === 'diaries') {
    renderTasks();
  } else {
    renderProjects();
  }
  updateStats();
}

function getFilteredDiaries() {
  let diaries = [...allDiaries];

  if (activeProjectId === 'independent') {
    diaries = diaries.filter(d => !d.project_id);
  } else if (activeProjectId && activeProjectId !== 'all') {
    diaries = diaries.filter(d => d.project_id === activeProjectId);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    diaries = diaries.filter(d =>
      d.diary_title.toLowerCase().includes(q) ||
      (d.activity_description || '').toLowerCase().includes(q) ||
      (d.project_name || '').toLowerCase().includes(q)
    );
  }

  diaries.sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at);
    if (sortBy === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
    if (sortBy === 'title')  return a.diary_title.localeCompare(b.diary_title);
    return 0;
  });

  return diaries;
}

function renderTasks() {
  showLoading(false);
  const diaries = getFilteredDiaries();
  const timeline = getEl('diaryTimeline');
  if (!timeline || !emptyState) return;

  if (diaries.length === 0) {
    timeline.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');
  timeline.innerHTML = diaries.map(buildDiaryRow).join('');
}

function buildDiaryRow(d) {
  const formattedDate = new Date(d.created_at).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const isIndependent = !d.project_id;
  const projectName = isIndependent ? 'Independent Activity' : d.project_name;
  const projectIcon = isIndependent ? 'bi-person-badge' : 'bi-folder-fill';

  return `
  <div class="timeline-item" data-id="${d.id}">
    <div class="timeline-badge" style="${isIndependent ? 'background: var(--at-3, #64748b);' : ''}">
      <i class="bi ${isIndependent ? 'bi-activity' : 'bi-journal-bookmark-fill'}"></i>
    </div>
    <div class="timeline-card">
      <div class="timeline-header">
        <h3 class="timeline-title">${escHtml(d.diary_title)}</h3>
        <span class="timeline-date">${formattedDate}</span>
      </div>
      <div class="timeline-body">
        <p class="timeline-description">${escHtml(d.activity_description || 'Tidak ada deskripsi.')}</p>
        <div style="margin-top: 12px; display: flex; align-items: center; gap: 10px;">
          <div style="flex: 1; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;">
            <div style="width: ${d.work_progress}%; height: 100%; background: var(--accent);"></div>
          </div>
          <span style="font-size: 12px; font-weight: 600; min-width: 35px; text-align: right; color: var(--accent);">${d.work_progress}%</span>
        </div>
      </div>
      <div class="timeline-footer">
        <div class="timeline-meta">
          <span class="meta-item event" title="${isIndependent ? 'Independent' : 'Proyek'}">
            <i class="bi ${projectIcon}"></i> ${escHtml(projectName)}
          </span>
        </div>
        <div class="timeline-actions">
          <button class="task-btn edit" onclick="openEditModal('${d.id}')" title="Edit Diary">
            <i class="bi bi-pencil-fill"></i>
          </button>
          <button class="task-btn delete" onclick="openDeleteModal('${d.id}')" title="Hapus Diary">
            <i class="bi bi-trash3-fill"></i>
          </button>
        </div>
      </div>
    </div>
  </div>`;
}

function renderProjects() {
  const grid = getEl('myProjectsGrid');
  const loading = getEl('projectsLoadingState');
  const empty = getEl('projectsEmptyState');
  if (!grid) return;

  if (loading) loading.style.display = 'none';

  if (allProjects.length === 0) {
    grid.innerHTML = '';
    if (empty) empty.classList.remove('hidden');
    return;
  }

  if (empty) empty.classList.add('hidden');

  grid.innerHTML = allProjects.map(p => {
    const formattedStart = new Date(p.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    const formattedEnd = new Date(p.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

    let statusClass = 'status-ongoing';
    let statusLabel = 'Ongoing';
    if (p.project_status === 'upcoming') {
      statusClass = 'status-upcoming';
      statusLabel = 'Upcoming';
    } else if (p.project_status === 'completed') {
      statusClass = 'status-completed';
      statusLabel = 'Completed';
    }

    const leaderName = p.leader ? p.leader.username : '-';
    const menteesCount = p.mentees ? p.mentees.length : 0;
    const isLeader = p.my_role === 'leader';
    const roleBadge = isLeader 
      ? `<span class="badge-role leader">Leader (Mentor)</span>`
      : `<span class="badge-role mentee">Mentee</span>`;

    return `
      <div class="project-card">
        <div>
          <div class="project-card-header">
            <h3 class="project-title">${escHtml(p.project_name)}</h3>
            <span class="project-status-badge ${statusClass}">
              ${statusLabel}
            </span>
          </div>
          <div class="project-role-wrap">
            ${roleBadge}
          </div>
          <p class="project-desc">
            ${escHtml(p.description || 'Tidak ada deskripsi proyek.')}
          </p>
        </div>

        <div class="project-meta-list">
          <div class="project-meta-item">
            <span class="project-meta-label"><i class="bi bi-person-badge"></i> Leader:</span>
            <span class="project-meta-value">${escHtml(leaderName)}</span>
          </div>
          <div class="project-meta-item">
            <span class="project-meta-label"><i class="bi bi-people"></i> Mentees:</span>
            <span class="project-meta-value">${menteesCount} Anggota</span>
          </div>
          <div class="project-meta-item">
            <span class="project-meta-label"><i class="bi bi-calendar-range"></i> Durasi:</span>
            <span class="project-meta-value" style="font-size: 12px;">${formattedStart} - ${formattedEnd}</span>
          </div>
        </div>

        <button onclick="openProjectDetails('${p.id}')" class="btn-project-detail">
          <i class="bi bi-map-fill"></i> Lihat Detail & Roadmap
        </button>

      </div>
    `;
  }).join('');
}
// ── Project Details Tab Switching ──────────────────────────────────────────
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".tab-btn");
  if (btn) {
    const tabId = btn.dataset.ptab;
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    
    document.querySelectorAll(".ptab-content").forEach(c => c.classList.add("hidden"));
    const content = document.getElementById(`ptab-${tabId}`);
    if (content) content.classList.remove("hidden");
  }
});

// ── Structured Roadmap Rendering ─────────────────────────────────────────────
async function loadStructuredRoadmap(projectId) {
  const container = document.getElementById("structuredRoadmapContainer");
  if (!container) return;
  container.innerHTML = '<div class="loading-state"><div class="spinner"></div></div>';

  try {
    const res = await fetch(`/api/projects/${projectId}/roadmap-details`, {
      headers: { "Authorization": `Bearer ${getToken()}` }
    });
    const json = await res.json();
    const roadmap = json.data;

    if (!roadmap) {
      container.innerHTML = `
        <div class="empty-state" style="padding:60px 20px;">
          <div class="empty-icon" style="font-size:54px; opacity:0.15; margin-bottom:20px; color:var(--accent);"><i class="bi bi-map"></i></div>
          <h3 style="font-size:18px; font-weight:700; color:var(--text-1); margin-bottom:8px;">Roadmap Belum Tersedia</h3>
          <p style="font-size:14px; opacity:0.6; max-width:300px; margin:0 auto 24px;">Project Leader belum menginisialisasi peta jalan pengembangan untuk proyek ini.</p>
          ${json.my_role === 'leader' ? `<button class="btn-add" style="margin:0 auto; display:inline-flex;" onclick="openUInitRoadmap('${projectId}')"><i class="bi bi-plus-lg"></i> Inisialisasi Roadmap</button>` : ''}
        </div>
      `;
      return;
    }

    renderStructuredRoadmap(roadmap, projectId, json.my_role);
  } catch (err) {
    container.innerHTML = `<div class="error-state" style="padding:20px; text-align:center; color:var(--danger);">${err.message}</div>`;
  }
}

function renderStructuredRoadmap(roadmap, projectId, role) {
  const container = document.getElementById("structuredRoadmapContainer");
  if (!container) return;

  const pct = roadmap.progress_percentage || 0;
  const isLeader = role === 'leader';
  const isMentee = role === 'mentee';
  const canManage = isLeader || isMentee;
  const isDelayed = new Date(roadmap.deadline) < new Date() && roadmap.status !== 'completed';

  let milestonesHtml = '';
  if (!roadmap.milestones || roadmap.milestones.length === 0) {
    milestonesHtml = `
      <div style="text-align:center; padding:40px 20px; border:2px dashed var(--border); border-radius:16px; background:rgba(255,255,255,0.02);">
         <div style="font-size:32px; opacity:0.1; margin-bottom:12px;"><i class="bi bi-flag"></i></div>
         <p style="opacity:0.5; font-size:14px; margin-bottom:16px;">Belum ada development milestone yang direncanakan.</p>
         ${canManage ? `<button class="btn-add" onclick="openUAddMilestone('${projectId}')" style="margin:0 auto; display:inline-flex;" ><i class="bi bi-plus"></i> Tambah Milestone</button>` : ''}
      </div>
    `;
  } else {
    milestonesHtml = roadmap.milestones.map((m, idx) => {
      const isDone = m.status === 'completed' || m.progress_percentage === 100;
      const isOverdue = !isDone && m.deadline && new Date(m.deadline) < new Date();
      const mStatus = m.status || 'pending';
      const isAssigned = m.assigned_to === currentUser?.id;
      const assigneeName = m.assignee?.username || 'Unassigned';

      return `
        <div class="roadmap-card-item" style="display:flex; gap:20px; margin-bottom:24px; position:relative; ${isOverdue ? 'border-left:3px solid var(--danger); padding-left:15px; margin-left:-18px;' : ''}">
          <div style="display:flex; flex-direction:column; align-items:center;">
            <div style="width:28px; height:28px; border-radius:50%; background:${isDone ? 'var(--success)' : isOverdue ? 'var(--danger)' : mStatus === 'ongoing' ? 'var(--accent)' : 'rgba(255,255,255,0.1)'}; color:#fff; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:800; z-index:2; border:3px solid var(--bg-card);">
              ${isDone ? '<i class="bi bi-check-lg"></i>' : idx + 1}
            </div>
            ${idx < roadmap.milestones.length - 1 ? '<div style="flex:1; width:2px; background:var(--border); margin:4px 0;"></div>' : ''}
          </div>
          <div style="flex:1; background:rgba(255,255,255,0.02); border:1px solid ${isOverdue ? 'rgba(239,68,68,0.2)' : 'var(--border)'}; border-radius:14px; padding:18px; position:relative; transition:all 0.2s ease;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
              <div>
                <h4 style="margin:0; font-size:15px; color:${isOverdue ? 'var(--danger)' : 'var(--text-1)'}; font-weight:700;">${escHtml(m.title)} ${isOverdue ? '<span style="font-size:9px; background:rgba(239,68,68,0.1); padding:2px 6px; border-radius:4px; margin-left:8px; vertical-align:middle;">OVERDUE</span>' : ''}</h4>
                <div style="font-size:11px; opacity:0.5; margin-top:4px; display:flex; flex-direction:column; gap:4px;">
                  <div style="display:flex; align-items:center; gap:6px;"><i class="bi bi-calendar3"></i> Target: ${m.deadline ? formatDateIndo(m.deadline) : '-'}</div>
                  <div style="display:flex; align-items:center; gap:6px;"><i class="bi bi-person-circle"></i> Assignee: <b>${escHtml(assigneeName)}</b></div>
                </div>
              </div>
              <div style="display:flex; gap:8px;">
                ${!isDone && canManage ? `<button class="icon-btn" onclick="quickCompleteMilestone('${projectId}', '${m.id}', '${escHtml(m.title)}')" style="width:32px; height:32px; font-size:14px; color:var(--success); border-color:rgba(16,185,129,0.2);" title="Selesaikan Milestone"><i class="bi bi-check-all"></i></button>` : ''}
                ${canManage ? `<button class="btn-add" onclick="openUEditMilestone('${projectId}', '${m.id}')" style="padding:4px 12px; font-size:11px; height:32px; background:var(--bg-card); border:1px solid var(--border); color:var(--text-1);" title="Update Progress Milestone"><i class="bi bi-pencil-square"></i> Update</button>` : ''}
                ${isLeader ? `<button class="icon-btn" onclick="deleteUMilestone('${projectId}', '${m.id}', '${escHtml(m.title)}')" style="width:32px; height:32px; font-size:14px; color:var(--danger); border-color:rgba(239,68,68,0.2);" title="Hapus Milestone"><i class="bi bi-trash"></i></button>` : ''}
              </div>
            </div>
            <p style="font-size:13px; opacity:0.7; margin-bottom:12px; line-height:1.6;">${escHtml(m.description || 'Tidak ada rincian milestone.')}</p>
            ${m.activity_note ? `
              <div style="background:rgba(255,255,255,0.03); border-radius:8px; padding:10px 14px; margin-bottom:16px; border-left:3px solid var(--accent-2);">
                <div style="font-size:10px; font-weight:800; opacity:0.5; text-transform:uppercase; margin-bottom:4px; letter-spacing:0.5px;">Latest Activity Note:</div>
                <p style="font-size:12px; margin:0; opacity:0.9; font-style:italic;">"${escHtml(m.activity_note)}"</p>
              </div>
            ` : ''}
            <div style="display:flex; align-items:center; gap:14px;">
              <div style="flex:1; height:7px; background:rgba(255,255,255,0.05); border-radius:4px; overflow:hidden;">
                <div style="width:${m.progress_percentage}%; height:100%; background:${isDone ? 'var(--success)' : 'var(--accent)'}; transition:width 0.4s ease;"></div>
              </div>
              <span style="font-size:12px; font-weight:800; min-width:35px; color:${isDone ? 'var(--success)' : 'var(--text-1)'}">${m.progress_percentage}%</span>
              <span class="badge ${isDone ? 'badge-done' : ''}" style="font-size:10px; padding:3px 10px; text-transform:uppercase; border-radius:8px;">${mStatus}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  container.innerHTML = `
    <div style="display:grid; grid-template-columns: 1fr 280px; gap:32px;">
      <div>
        <div style="background:linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05)); border:1px solid rgba(59, 130, 246, 0.2); border-radius:16px; padding:24px; margin-bottom:32px; position:relative; overflow:hidden;">
           <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
              <div>
                <h3 style="margin:0; font-size:18px; color:var(--text-1); font-weight:800;">${escHtml(roadmap.roadmap_title)}</h3>
                <div style="font-size:12px; opacity:0.6; margin-top:4px; display:flex; align-items:center; gap:12px;">
                  <span style="display:flex; align-items:center; gap:6px;"><i class="bi bi-bullseye"></i> Goal Date: <b>${formatDateIndo(roadmap.deadline)}</b></span>
                  <span class="badge ${roadmap.status === 'completed' ? 'badge-done' : ''}" style="font-size:9px;">${roadmap.status}</span>
                </div>
              </div>
              <div style="text-align:right">
                <div style="font-size:28px; font-weight:900; color:var(--accent-2); line-height:1; letter-spacing:-1px;">${pct}%</div>
                <div style="font-size:10px; opacity:0.4; font-weight:800; margin-top:4px; letter-spacing:1px;">PROGRESS</div>
              </div>
           </div>

           <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
              <div style="font-size:11px; font-weight:800; opacity:0.3; letter-spacing:1px;">ROADMAP COMPLETION</div>
              ${isLeader ? `
                <button class="btn-add" onclick="openUReviseRoadmap('${projectId}')" style="background:var(--warn); border:none; padding:6px 12px; font-size:10px; font-weight:800; border-radius:6px; display:flex; align-items:center; gap:6px; box-shadow:0 4px 10px rgba(217,119,6,0.15); height:auto;">
                  <i class="bi bi-calendar2-range"></i> Revisi Deadline
                </button>
              ` : ''}
           </div>

           <div style="height:10px; background:rgba(255,255,255,0.05); border-radius:5px; overflow:hidden; margin-bottom:16px; box-shadow:inset 0 1px 3px rgba(0,0,0,0.2);">
              <div style="width:${pct}%; height:100%; background:linear-gradient(90deg, var(--accent), var(--accent-2)); transition:width 0.8s ease;"></div>
           </div>
           ${isDelayed ? '<div style="color:var(--danger); font-size:12px; font-weight:700; display:flex; align-items:center; gap:6px;"><i class="bi bi-exclamation-triangle-fill"></i> Proyek melewati target deadline!</div>' : ''}
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
          <h4 style="margin:0; font-size:13px; opacity:0.5; text-transform:uppercase; font-weight:800; letter-spacing:1px;">Milestones & Stages</h4>
          ${canManage ? `<button class="btn-add" onclick="openUAddMilestone('${projectId}')" style="padding:6px 14px; font-size:12px; height:auto;"><i class="bi bi-plus-lg"></i> Add Milestone</button>` : ''}
        </div>
        <div class="roadmap-milestones-list">
          ${milestonesHtml}
        </div>
      </div>
      <div style="border-left:1px solid var(--border); padding-left:24px;">
        <h4 style="margin:0 0 20px 0; font-size:12px; opacity:0.5; text-transform:uppercase; font-weight:800; letter-spacing:1px;">Roadmap Updates</h4>
        <div style="display:flex; flex-direction:column; gap:20px;">
           ${roadmap.logs && roadmap.logs.length > 0 ? roadmap.logs.map(log => `
             <div style="font-size:12px; position:relative; padding-bottom:16px; border-bottom:1px solid rgba(255,255,255,0.04);">
                <div style="display:flex; justify-content:space-between; margin-bottom:4px; align-items:center;">
                   <span style="font-weight:800; color:var(--accent-2); font-size:10px;">${log.action.replace(/_/g, ' ')}</span>
                   <span style="opacity:0.4; font-size:10px;">${timeAgo(log.timestamp)}</span>
                </div>
                <p style="margin:0; opacity:0.8; line-height:1.5;">${escHtml(log.details)}</p>
                <div style="font-size:10px; opacity:0.3; margin-top:6px; font-style:italic;">oleh ${escHtml(log.user?.username || 'System')}</div>
             </div>
           `).join('') : '<div style="opacity:0.3; font-size:12px; text-align:center; padding:40px 0;">No updates recorded yet.</div>'}
        </div>
      </div>
    </div>
  `;
}

function openUInitRoadmap(projectId) {
  const inputId = document.getElementById("uirProjectId");
  if (inputId) inputId.value = projectId;
  const inputStart = document.getElementById("uirStart");
  if (inputStart) inputStart.value = new Date().toISOString().split('T')[0];
  const overlay = document.getElementById("uInitRoadmapModalOverlay");
  if (overlay) overlay.classList.add("open");
}
window.openUInitRoadmap = openUInitRoadmap;

document.getElementById("uInitRoadmapForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const projectId = document.getElementById("uirProjectId").value;
  const roadmap_title = document.getElementById("uirTitle").value;
  const start_date = document.getElementById("uirStart").value;
  const target_date = document.getElementById("uirTarget").value;

  try {
    const res = await fetch(`/api/projects/${projectId}/roadmap`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getToken()}` },
      body: JSON.stringify({ roadmap_title, start_date, deadline: target_date })
    });
    const json = await res.json();
    if (json.success) {
      showToast("Roadmap berhasil dibuat!", "success");
      document.getElementById("uInitRoadmapModalOverlay").classList.remove("open");
      loadStructuredRoadmap(projectId);
    } else {
      showToast(json.error, "error");
    }
  } catch (err) {
    showToast("Gagal menginisialisasi roadmap", "error");
  }
});

function openUAddMilestone(projectId) {
  const form = document.getElementById("uMilestoneForm");
  if (form) form.reset();
  const inputId = document.getElementById("uMilestoneFormId");
  if (inputId) inputId.value = "";
  const inputPid = document.getElementById("uMilestoneProjectId");
  if (inputPid) inputPid.value = projectId;

  const title = document.getElementById("uMilestoneModalTitle");
  if (title) title.textContent = "Tambah Milestone Baru";

  // Default assignee to self if mentee, or none if leader
  const defaultAssignee = currentUser?.role === 'mentee' ? currentUser.id : "";
  populateAssigneeSelect(defaultAssignee);

  // Enable all for new milestone
  toggleMilestoneFields(true);

  const overlay = document.getElementById("uMilestoneModalOverlay");
  if (overlay) overlay.classList.add("open");
}
window.openUAddMilestone = openUAddMilestone;

function populateAssigneeSelect(selectedId = "") {
  const select = document.getElementById("uMilestoneFormAssignee");
  if (!select) return;

  select.innerHTML = '<option value="">— Belum Ditugaskan —</option>' + 
    currentProjectMembers.map(m => `<option value="${m.user_id}" ${m.user_id === selectedId ? 'selected' : ''}>${escHtml(m.username)} (${m.role})</option>`).join('');
}

function toggleMilestoneFields(isEditable) {
  const fields = ["uMilestoneFormTitle", "uMilestoneFormDesc", "uMilestoneFormTarget", "uMilestoneFormAssignee"];
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.disabled = !isEditable;
  });
}

async function openUEditMilestone(projectId, milestoneId) {
  try {
    const res = await fetch(`/api/projects/${projectId}/roadmap-details`, {
      headers: { "Authorization": `Bearer ${getToken()}` }
    });
    const json = await res.json();
    const milestone = json.data.milestones.find(m => m.id === milestoneId);
    if (!milestone) return;

    const role = json.my_role;
    const isLeader = role === 'leader';
    const isMentee = role === 'mentee';
    const canEditStructure = isLeader || isMentee;

    document.getElementById("uMilestoneFormId").value = milestone.id;
    document.getElementById("uMilestoneProjectId").value = projectId;
    document.getElementById("uMilestoneFormTitle").value = milestone.title;
    document.getElementById("uMilestoneFormDesc").value = milestone.description || "";
    document.getElementById("uMilestoneFormTarget").value = milestone.deadline ? milestone.deadline.substring(0, 10) : "";
    document.getElementById("uMilestoneFormProgress").value = milestone.progress_percentage;
    document.getElementById("uMilestoneFormStatus").value = milestone.status;
    document.getElementById("uMilestoneFormNote").value = milestone.activity_note || "";

    populateAssigneeSelect(milestone.assigned_to);
    toggleMilestoneFields(canEditStructure);

    // Only Leader can reassign
    const assigneeField = document.getElementById("uMilestoneFormAssignee");
    if (assigneeField) assigneeField.disabled = !isLeader;

    document.getElementById("uMilestoneModalTitle").textContent = isLeader ? "Edit Milestone" : "Update Progress Milestone";
    document.getElementById("uMilestoneModalOverlay").classList.add("open");
  } catch (err) {
    showToast("Gagal memuat milestone", "error");
  }
}
window.openUEditMilestone = openUEditMilestone;

document.getElementById("uMilestoneForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const projectId = document.getElementById("uMilestoneProjectId").value;
  const milestoneId = document.getElementById("uMilestoneFormId").value;
  const title = document.getElementById("uMilestoneFormTitle").value;
  const description = document.getElementById("uMilestoneFormDesc").value;
  const deadline = document.getElementById("uMilestoneFormTarget").value;
  const progress_percentage = document.getElementById("uMilestoneFormProgress").value;
  const status = document.getElementById("uMilestoneFormStatus").value;
  const assigned_to = document.getElementById("uMilestoneFormAssignee").value;
  const activity_note = document.getElementById("uMilestoneFormNote")?.value || "";

  const method = milestoneId ? "PATCH" : "POST";
  const url = milestoneId 
    ? `/api/projects/${projectId}/roadmap/milestones/${milestoneId}`
    : `/api/projects/${projectId}/roadmap/milestones`;

  try {
    const payload = { progress_percentage, status, activity_note };
    // Only include these if it's a new milestone or if they are not disabled (Leader)
    if (!milestoneId || document.getElementById("uMilestoneFormTitle").disabled === false) {
       payload.title = title;
       payload.description = description;
       payload.deadline = deadline;
       payload.assigned_to = assigned_to;
    }

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getToken()}` },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (json.success) {
      showToast("Milestone berhasil disimpan!", "success");
      document.getElementById("uMilestoneModalOverlay").classList.remove("open");
      loadStructuredRoadmap(projectId);
    } else {
      showToast(json.error, "error");
    }
  } catch (err) {
    showToast("Gagal menyimpan milestone", "error");
  }
});

let currentProjectMembers = [];

async function openUEditRoadmap(projectId) {
  try {
    const res = await fetch(`/api/projects/${projectId}/roadmap-details`, {
      headers: { "Authorization": `Bearer ${getToken()}` }
    });
    const json = await res.json();
    const roadmap = json.data;
    if (!roadmap) return;

    document.getElementById("uerProjectId").value = projectId;
    document.getElementById("uerTitle").value = roadmap.roadmap_title;
    document.getElementById("uerDesc").value = roadmap.description || "";
    document.getElementById("uerTarget").value = roadmap.deadline ? roadmap.deadline.substring(0, 10) : "";
    document.getElementById("uerStatus").value = roadmap.status;

    document.getElementById("uEditRoadmapModalOverlay").classList.add("open");
  } catch (err) {
    showToast("Gagal memuat pengaturan roadmap", "error");
  }
}
window.openUEditRoadmap = openUEditRoadmap;

async function openUReviseRoadmap(projectId) {
  try {
    const res = await fetch(`/api/projects/${projectId}/roadmap-details`, {
      headers: { "Authorization": `Bearer ${getToken()}` }
    });
    const json = await res.json();
    const roadmap = json.data;
    if (!roadmap) return;

    document.getElementById("urevProjectId").value = projectId;
    document.getElementById("urevOldTarget").value = formatDateIndo(roadmap.deadline);
    document.getElementById("urevNewTarget").value = roadmap.deadline ? roadmap.deadline.substring(0, 10) : "";
    document.getElementById("urevReason").value = "";

    document.getElementById("uReviseRoadmapModalOverlay").classList.add("open");
  } catch (err) {
    showToast("Gagal memuat detail revisi", "error");
  }
}
window.openUReviseRoadmap = openUReviseRoadmap;

document.getElementById("uReviseRoadmapForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const projectId = document.getElementById("urevProjectId").value;
  const deadline = document.getElementById("urevNewTarget").value;
  const revision_reason = document.getElementById("urevReason").value;

  try {
    const res = await fetch(`/api/projects/${projectId}/roadmap`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getToken()}` },
      body: JSON.stringify({ deadline, revision_reason })
    });
    const json = await res.json();
    if (json.success) {
      showToast("Deadline berhasil direvisi!", "success");
      document.getElementById("uReviseRoadmapModalOverlay").classList.remove("open");
      loadStructuredRoadmap(projectId);
    } else {
      showToast(json.error, "error");
    }
  } catch (err) {
    showToast("Gagal merevisi deadline", "error");
  }
});

document.getElementById("uEditRoadmapForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const projectId = document.getElementById("uerProjectId").value;
  const roadmap_title = document.getElementById("uerTitle").value;
  const description = document.getElementById("uerDesc").value;
  const deadline = document.getElementById("uerTarget").value;
  const status = document.getElementById("uerStatus").value;

  try {
    const res = await fetch(`/api/projects/${projectId}/roadmap`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getToken()}` },
      body: JSON.stringify({ roadmap_title, description, deadline, status })
    });
    const json = await res.json();
    if (json.success) {
      showToast("Pengaturan roadmap diperbarui!", "success");
      document.getElementById("uEditRoadmapModalOverlay").classList.remove("open");
      loadStructuredRoadmap(projectId);
    } else {
      showToast(json.error, "error");
    }
  } catch (err) {
    showToast("Gagal memperbarui roadmap", "error");
  }
});

async function deleteUMilestone(projectId, milestoneId, name) {
  if (!confirm(`Hapus milestone "${name}"?`)) return;
  
  try {
    const res = await fetch(`/api/projects/${projectId}/roadmap/milestones/${milestoneId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${getToken()}` }
    });
    const json = await res.json();
    if (json.success) {
      showToast("Milestone berhasil dihapus!", "success");
      loadStructuredRoadmap(projectId);
    } else {
      showToast(json.error, "error");
    }
  } catch (err) {
    showToast("Gagal menghapus milestone", "error");
  }
}
window.deleteUMilestone = deleteUMilestone;

async function quickCompleteMilestone(projectId, milestoneId, name) {
  if (!confirm(`Tandai milestone "${name}" sebagai selesai (100%)?`)) return;

  try {
    const res = await fetch(`/api/projects/${projectId}/roadmap/milestones/${milestoneId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getToken()}` },
      body: JSON.stringify({ progress_percentage: 100, status: 'completed', activity_note: 'Milestone diselesaikan via quick action.' })
    });
    const json = await res.json();
    if (json.success) {
      showToast("Milestone diselesaikan!", "success");
      loadStructuredRoadmap(projectId);
    } else {
      showToast(json.error, "error");
    }
  } catch (err) {
    showToast("Gagal memperbarui milestone", "error");
  }
}
window.quickCompleteMilestone = quickCompleteMilestone;

async function openProjectDetails(id) {
  const p = allProjects.find(x => x.id === id);
  if (!p) return;

  setText('projectDetailsTitle', p.project_name);
  setText('projectDetailsDesc', p.description || 'Tidak ada deskripsi proyek.');

  const overlay = getEl('projectDetailsModalOverlay');
  const membersList = getEl('projectDetailsMembersList');
  const diariesTimeline = getEl('projectDetailTimeline');

  if (overlay) overlay.classList.add('open');

  // Reset tabs to Overview
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  const overviewTab = document.querySelector('.tab-btn[data-ptab="overview"]');
  if (overviewTab) overviewTab.classList.add("active");
  document.querySelectorAll(".ptab-content").forEach(c => c.classList.add("hidden"));
  const overviewContent = document.getElementById("ptab-overview");
  if (overviewContent) overviewContent.classList.remove("hidden");

  if (membersList) membersList.innerHTML = '<div class="spinner" style="width:20px; height:20px; border-width:2px; margin:20px auto;"></div>';
  if (diariesTimeline) diariesTimeline.innerHTML = '<div class="spinner" style="width:20px; height:20px; border-width:2px; margin:20px auto;"></div>';

  try {
    const [membersRes, diariesRes] = await Promise.all([
      apiFetch(`/api/projects/${id}/members`),
      apiFetch(`/api/projects/${id}/roadmap`) // Fetch diaries
    ]);

    currentProjectMembers = membersRes.data || [];
    const members = currentProjectMembers;
    const diaries = diariesRes.data || [];
    if (membersList) {
      if (members.length === 0) {
        membersList.innerHTML = '<p style="opacity:0.5; font-size:13px; text-align:center; padding:10px;">Tidak ada anggota.</p>';
      } else {
        membersList.innerHTML = members.map(m => {
          const isLeader = m.role === 'leader';
          return `
            <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.03); padding: 10px 14px; border-radius: 10px; border: 1px solid var(--border);">
              <div style="display:flex; align-items:center; gap:10px;">
                <div style="width:32px; height:32px; border-radius:50%; background:${isLeader ? 'var(--accent)' : 'rgba(255,255,255,0.1)'}; color:#fff; display:grid; place-items:center; font-size:12px; font-weight:800;">${m.username.charAt(0).toUpperCase()}</div>
                <div>
                  <div style="font-weight: 700; font-size: 13px; color:var(--text-1);">${escHtml(m.username)}</div>
                  <div style="font-size: 11px; opacity: 0.5;">${isLeader ? 'Project Leader' : 'Team Member'}</div>
                </div>
              </div>
              ${isLeader ? '<i class="bi bi-shield-check" style="color:var(--accent); font-size:16px;" title="Authorized Leader"></i>' : ''}
            </div>
          `;
        }).join('');
      }
    }

    if (diariesTimeline) {
      if (diaries.length === 0) {
        diariesTimeline.innerHTML = '<div style="opacity:0.4; font-size:13px; text-align: center; padding: 40px 0; background:rgba(255,255,255,0.01); border-radius:12px; border:1px dashed var(--border);">Belum ada diary aktivitas proyek.</div>';
      } else {
        diariesTimeline.innerHTML = diaries.map(d => {
          const formattedDate = new Date(d.created_at).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric'
          });
          return `
            <div class="timeline-item" style="margin-left: 15px; margin-bottom: 24px; position: relative; padding-left: 20px; border-left: 2px solid var(--border);">
              <div style="position: absolute; left: -7px; top: 0; width: 12px; height: 12px; border-radius: 50%; background: var(--accent); border: 3px solid var(--bg-base);"></div>
              <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border); padding: 16px; border-radius: 12px; transition:transform 0.2s ease;" onmouseover="this.style.transform='translateX(4px)'" onmouseout="this.style.transform='none'">
                <div style="display: flex; justify-content: space-between; align-items: start; gap: 12px;">
                  <h4 style="font-size: 14px; font-weight: 700; color: var(--text-1); margin: 0;">${escHtml(d.diary_title)}</h4>
                  <span style="font-size: 11px; opacity: 0.5; font-weight:600; text-transform:uppercase;">${formattedDate}</span>
                </div>
                <p style="font-size: 13px; opacity: 0.7; margin-top: 8px; line-height: 1.6;">${escHtml(d.activity_description)}</p>
                <div style="margin-top: 14px; display: flex; align-items: center; justify-content: space-between; font-size: 11px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 10px;">
                  <span style="opacity: 0.6; display:flex; align-items:center; gap:5px;"><i class="bi bi-person-circle"></i> <b>${escHtml(d.username)}</b></span>
                  <span style="color: var(--accent-2); font-weight: 800; background:rgba(59,130,246,0.1); padding:2px 8px; border-radius:6px;">${d.work_progress}% PROGRESS</span>
                </div>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // Load structured roadmap
    loadStructuredRoadmap(id);

  } catch (err) {
    showToast('Gagal memuat detail proyek: ' + err.message, 'error');
  }
}
window.openProjectDetails = openProjectDetails;

function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " tahun lalu";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " bulan lalu";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " hari lalu";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " jam lalu";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " menit lalu";
  return Math.floor(seconds) + " detik lalu";
}

function closeProjectDetails() {
  const overlay = getEl('projectDetailsModalOverlay');
  if (overlay) overlay.classList.remove('open');
}

addListener('projectDetailsClose', 'click', closeProjectDetails);

// ─── BADGES & STATS ──────────────────────────
function updateBadges() {
  setText('badge-all', allDiaries.length);
  setText('badge-projects', allProjects.length);
}

function updateStats() {
  setText('statTotalDiaries', allDiaries.length);
}

// ─── MODAL: ADD / EDIT ───────────────────────
function openModal(diary = null) {
  editingTaskId = diary ? diary.id : null;

  setText('modalTitle', diary ? 'Edit Catatan Diary' : 'Tulis Diary Baru');
  setText('btnSaveText', diary ? 'Simpan Perubahan' : 'Simpan Diary');
  setValue('taskId', diary ? diary.id : '');
  setValue('taskTitle', diary ? diary.diary_title : '');
  setValue('taskDescription', diary ? (diary.activity_description || '') : '');
  setValue('taskProject', diary ? diary.project_id : '');
  
  const progressVal = diary ? diary.work_progress : 0;
  setValue('taskProgress', progressVal);
  const progOut = getEl('progressOutput');
  if (progOut) progOut.textContent = progressVal + '%';

  updateCharCount();
  clearErrors();
  if (modalOverlay) modalOverlay.classList.add('open');
  getEl('taskTitle')?.focus();
}

function openEditModal(id) {
  const diary = allDiaries.find(d => d.id === id);
  if (diary) openModal(diary);
}

function closeModal() {
  modalOverlay.classList.remove('open');
  taskForm.reset();
  editingTaskId = null;
}

// ─── FORM SUBMIT ──────────────────────────────
if (taskForm) {
  taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const btnSave = getEl('btnSave');
    if (btnSave) btnSave.disabled = true;

    const payload = {
      diary_title:          getValue('taskTitle').trim(),
      activity_description: getValue('taskDescription').trim(),
      project_id:           getValue('taskProject'),
      work_progress:        parseInt(getValue('taskProgress')),
    };

    try {
      if (editingTaskId) {
        const res = await apiFetch(`${API_BASE}/${editingTaskId}`, {
          method: 'PUT', body: JSON.stringify(payload),
        });
        const idx = allDiaries.findIndex(d => d.id === editingTaskId);
        if (idx !== -1) allDiaries[idx] = res.data;
        showToast('✏️ Diary berhasil diperbarui!', 'success');
      } else {
        const res = await apiFetch(API_BASE, {
          method: 'POST', body: JSON.stringify(payload),
        });
        allDiaries.unshift(res.data);
        showToast('🎉 Diary baru berhasil disimpan!', 'success');
      }
      closeModal();
      renderAll();
    } catch (err) {
      showToast('Gagal menyimpan: ' + err.message, 'error');
    } finally {
      btnSave.disabled = false;
    }
  });
}

function validateForm() {
  let ok = true;
  const title = getEl('taskTitle');
  const desc  = getEl('taskDescription');
  const proj  = getEl('taskProject');
  const prog  = getEl('taskProgress');

  if (!title || !title.value.trim()) {
    showFieldError('titleError', title, 'Judul kegiatan wajib diisi');
    ok = false;
  } else {
    clearFieldError('titleError', title);
  }

  if (!desc || !desc.value.trim()) {
    showFieldError('descError', desc, 'Deskripsi kegiatan wajib diisi');
    ok = false;
  } else {
    clearFieldError('descError', desc);
  }

  // Project is now optional
  clearFieldError('projectError', proj);

  if (!prog || prog.value === '') {
    showFieldError('progressError', prog, 'Tentukan progress kerja');
    ok = false;
  } else {
    clearFieldError('progressError', prog);
  }

  return ok;
}

function showFieldError(errId, input, msg) {
  const errEl = getEl(errId);
  if (errEl) errEl.textContent = msg;
  if (input) input.classList.add('error');
}
function clearFieldError(errId, input) {
  const errEl = getEl(errId);
  if (errEl) errEl.textContent = '';
  if (input) input.classList.remove('error');
}
function clearErrors() {
  ['titleError','descError','projectError','progressError'].forEach(id => { const el = getEl(id); if (el) el.textContent = ''; });
  ['taskTitle','taskDescription','taskProject','taskProgress'].forEach(id => { const el = getEl(id); if (el) el.classList.remove('error'); });
}

// ─── DELETE MODAL ─────────────────────────────
function openDeleteModal(id) {
  deletingTaskId = id;
  if (deleteModalOverlay) deleteModalOverlay.classList.add('open');
}
function closeDeleteModal() {
  if (deleteModalOverlay) deleteModalOverlay.classList.remove('open');
  deletingTaskId = null;
}

addListener('btnConfirmDelete', 'click', async () => {
  if (!deletingTaskId) return;
  const btn = getEl('btnConfirmDelete');
  if (btn) btn.disabled = true;
  try {
    await apiFetch(`${API_BASE}/${deletingTaskId}`, { method: 'DELETE' });
    allDiaries = allDiaries.filter(d => d.id !== deletingTaskId);
    closeDeleteModal();
    renderAll();
    showToast('🗑️ Catatan diary berhasil dihapus', 'info');
  } catch (err) {
    showToast('Gagal menghapus: ' + err.message, 'error');
  } finally {
    if (btn) btn.disabled = false;
  }
});

// ─── SIDEBAR NAVIGATION ───────────────────────
addListener('navList', 'click', (e) => {
  const item = e.target.closest('.nav-item');
  if (!item) return;

  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  item.classList.add('active');
  
  switchToTaskView();

  const tab = item.dataset.tab;
  currentTab = tab;

  const gridView = getEl('gridView');
  const viewMyProjects = getEl('viewMyProjects');
  const viewManualBook = getEl('viewManualBook');
  const userFilterBar = getEl('userFilterBar');
  const userSearchContainer = getEl('userSearchContainer');
  const btnAddTask = getEl('btnAddTask');

  if (tab === 'diaries') {
    setText('pageTitle', 'Diary Proyek Saya');
    setText('pageSubtitle', 'Catat kegiatan harian Anda dan hubungkan dengan proyek aktif Anda.');
    if (gridView) gridView.classList.remove('hidden');
    if (viewMyProjects) viewMyProjects.classList.add('hidden');
    if (viewManualBook) viewManualBook.classList.add('hidden');
    if (userFilterBar) userFilterBar.style.display = 'flex';
    if (userSearchContainer) userSearchContainer.style.display = 'flex';
    if (btnAddTask) btnAddTask.style.display = 'inline-flex';
    renderTasks();
  } else if (tab === 'projects') {
    setText('pageTitle', 'Proyek Saya');
    setText('pageSubtitle', 'Daftar proyek aktif dan selesai yang Anda ikuti.');
    if (gridView) gridView.classList.add('hidden');
    if (viewMyProjects) viewMyProjects.classList.remove('hidden');
    if (viewManualBook) viewManualBook.classList.add('hidden');
    if (userFilterBar) userFilterBar.style.display = 'none';
    if (userSearchContainer) userSearchContainer.style.display = 'none';
    if (btnAddTask) btnAddTask.style.display = 'none';
    renderProjects();
  }
  closeSidebar();
});

addListener('helpList', 'click', (e) => {
  const item = e.target.closest('.nav-item');
  if (!item) return;

  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  item.classList.add('active');
  
  const tab = item.dataset.tab;
  if (tab === 'manual') {
    currentTab = 'manual';
    setText('pageTitle', 'Manual Book');
    setText('pageSubtitle', 'Panduan penggunaan dan dokumentasi fitur STAKS Flow.');
    
    getEl('gridView')?.classList.add('hidden');
    getEl('viewMyProjects')?.classList.add('hidden');
    getEl('viewManualBook')?.classList.remove('hidden');
    getEl('userFilterBar').style.display = 'none';
    getEl('userSearchContainer').style.display = 'none';
    getEl('btnAddTask').style.display = 'none';
    
    loadManualBook();
    switchToManualView();
  }
  closeSidebar();
});

// ─── FILTER PROJECT SELECT ─────────────────────
addListener('filterProjectSelect', 'change', (e) => {
  activeProjectId = e.target.value;
  renderTasks();
});

// ─── SORT ─────────────────────────────────────
addListener('sortSelect', 'change', (e) => {
  sortBy = e.target.value;
  renderAll();
});

// Handling sort button group
const sortBtns = document.querySelectorAll('.sort-btn');
sortBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const val = btn.dataset.value;
    sortBy = val;
    
    // Update UI active state
    sortBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Update hidden select if needed (optional since we update sortBy directly)
    const select = getEl('sortSelect');
    if (select) select.value = val;
    
    renderAll();
  });
});

// ─── SEARCH ───────────────────────────────────
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    if (searchClear) searchClear.classList.toggle('visible', searchQuery.length > 0);
    renderTasks();
  });
}
if (searchClear) {
  searchClear.addEventListener('click', () => {
    searchQuery = '';
    if (searchInput) searchInput.value = '';
    searchClear.classList.remove('visible');
    renderTasks();
  });
}

// ─── CHAR COUNT ───────────────────────────────
function updateCharCount() {
  const desc = getEl('taskDescription');
  const len = desc ? desc.value.length : 0;
  setText('descCharCount', `${len} / 500`);
}
const descInput = getEl('taskDescription');
if (descInput) descInput.addEventListener('input', updateCharCount);

// ─── MOBILE SIDEBAR ───────────────────────────
function openSidebar() {
  if (sidebar) sidebar.classList.add('open');
  if (overlay) overlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeSidebar() {
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('show');
  document.body.style.overflow = '';
}

addListener('mobileMenuBtn', 'click', openSidebar);
addListener('mobileMenuBtnC', 'click', openSidebar);
addListener('sidebarToggle', 'click', closeSidebar);
if (overlay) overlay.addEventListener('click', closeSidebar);

// ─── BUTTON EVENTS ────────────────────────────
addListener('btnAddTask', 'click', () => openModal());
addListener('modalClose', 'click', closeModal);
addListener('btnCancel', 'click', closeModal);
addListener('btnCancelDelete', 'click', closeDeleteModal);

if (modalOverlay) modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
if (deleteModalOverlay) deleteModalOverlay.addEventListener('click', (e) => { if (e.target === deleteModalOverlay) closeDeleteModal(); });

// ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closeModal(); closeDeleteModal(); }
});

// ─── TOAST ────────────────────────────────────
function showToast(msg, type = 'info') {
  const icons = { success: 'bi-check-circle-fill', error: 'bi-x-circle-fill', info: 'bi-info-circle-fill' };
  const container = getEl('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="bi ${icons[type]} toast-icon"></i><span class="toast-msg">${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ─── HELPERS ──────────────────────────────────
function showLoading(show) {
  if (loadingState) loadingState.style.display = show ? 'flex' : 'none';
  if (show) {
    const timeline = getEl('diaryTimeline');
    if (timeline) timeline.innerHTML = '';
    if (emptyState) emptyState.classList.add('hidden');
  }
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ─── THEME TOGGLE ─────────────────────────────
const themeToggle = getEl('themeToggle');
const themeIcon   = getEl('themeIcon');
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('tf_theme', theme);
  if (themeIcon) themeIcon.className = theme === 'dark' ? 'bi bi-moon-stars-fill' : 'bi bi-sun-fill';
  window.dispatchEvent(new CustomEvent('themechanged', { detail: { theme } }));
}
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
}
applyTheme(localStorage.getItem('tf_theme') || 'dark');

// ─── AUTH & INIT ───────────────────────────────
function showApp(user) {
  currentUser = user;
  setText('userNameDisplay', user.username);
  setText('userEmailDisplay', user.email);
  setText('userAvatar', user.username.charAt(0).toUpperCase());

  if (user.role === 'admin') {
    const adminLink = getEl('adminPanelLink');
    if (adminLink) adminLink.classList.remove('hidden');
    // Hide Manual Book for admin as per latest requirement
    const manualNav = getEl('nav-manual');
    if (manualNav) manualNav.style.display = 'none';
  }

  loadTasks();
}

function doLogout() {
  clearToken();
  window.location.href = '/login.html';
}

const btnLogout = getEl('btnLogout');
if (btnLogout) {
  btnLogout.addEventListener('click', doLogout);
}

// ─── INIT ─────────────────────────────────────
(async () => {
  const loader = getEl('authLoading');
  const hideLoader = () => { if (loader) loader.style.display = 'none'; };

  const token = getToken();
  if (!token) {
    sessionStorage.setItem('tf_auth_msg', 'Sesi Anda telah berakhir, silakan login kembali.');
    hideLoader();
    window.location.href = '/login.html';
    return;
  }

  try {
    const controller = new AbortController();
    const timeoutId  = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(`${AUTH_BASE}/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.user) {
        hideLoader();
        showApp(data.user);
      } else {
        clearToken();
        hideLoader();
        window.location.href = '/login.html';
      }
    } else {
      clearToken();
      hideLoader();
      window.location.href = '/login.html';
    }
  } catch (err) {
    console.warn('Auth check failed:', err.message);
    clearToken();
    hideLoader();
    window.location.href = '/login.html';
  }
})();

// ══════════════════════════════════════════════════════════════
//  COMMUNITY — User Read-Only View
// ══════════════════════════════════════════════════════════════
const DAYS_ORDER_U = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat Ganjil", "Sabtu Ganjil", "Jumat Genap", "Sabtu Genap"];
const DAY_ICONS_U  = { "Senin":"🌟", "Selasa":"🌸", "Rabu":"🍀", "Kamis":"🍂", "Jumat Ganjil":"🌙", "Sabtu Ganjil":"☀️", "Jumat Genap":"🌘", "Sabtu Genap":"🌤️" };

let activeCommunity = null; // 'house-rules' | 'duty' | 'calendar'

// Nav click handler for community items
const communityListEl = getEl('communityList');
if (communityListEl) {
  communityListEl.addEventListener('click', e => {
    const item = e.target.closest('.nav-item');
    if (!item) return;
    const type = item.dataset.community;
    switchCommunity(type);
    closeSidebar();
  });
}

const mobileMenuBtnC = getEl('mobileMenuBtnC');
if (mobileMenuBtnC) mobileMenuBtnC.addEventListener('click', openSidebar);

function switchCommunity(type) {
  activeCommunity = type;

  document.querySelectorAll('#navList .nav-item').forEach(n => n.classList.remove('active'));
  document.querySelectorAll('#communityList .nav-item').forEach(n => n.classList.remove('active'));
  const navEl = getEl(`nav-${type}`);
  if (navEl) navEl.classList.add('active');

  const mainContent = getEl('mainContent');
  const communityMain = getEl('communityMain');
  const viewManualBook = getEl('viewManualBook');
  if (mainContent) mainContent.classList.add('hidden');
  if (viewManualBook) viewManualBook.classList.add('hidden');
  if (communityMain) communityMain.classList.remove('hidden');

  const viewHouseRules = getEl('viewHouseRules');
  const viewDuty = getEl('viewDuty');
  const viewCalendar = getEl('viewCalendar');
  if (viewHouseRules) viewHouseRules.classList.toggle('hidden', type !== 'house-rules');
  if (viewDuty) viewDuty.classList.toggle('hidden', type !== 'duty');
  if (viewCalendar) viewCalendar.classList.toggle('hidden', type !== 'calendar');

  if (type === 'house-rules') {
    setText('communityTitle', 'House Rules');
    setText('communitySubtitle', 'Peraturan dan tata tertib hunian');
    loadUserHouseRules();
  } else if (type === 'duty') {
    setText('communityTitle', 'Jadwal Piket');
    setText('communitySubtitle', 'Jadwal tugas kebersihan anggota');
    loadUserDutySchedules();
  } else if (type === 'calendar') {
    setText('communityTitle', 'Calendar / Schedule');
    setText('communitySubtitle', 'Jadwal dan agenda kegiatan');
    loadUserSchedules();
  }
}

function switchTab(tab) {
  const item = document.querySelector(`.nav-item[data-tab="${tab}"]`);
  if (item) item.click();
}

function switchToTaskView() {
  activeCommunity = null;
  const mainContent = getEl('mainContent');
  const communityMain = getEl('communityMain');
  const viewManualBook = getEl('viewManualBook');
  if (mainContent) mainContent.classList.remove('hidden');
  if (communityMain) communityMain.classList.add('hidden');
  if (viewManualBook) viewManualBook.classList.add('hidden');
  document.querySelectorAll('#communityList .nav-item').forEach(n => n.classList.remove('active'));
}

function switchToManualView() {
  activeCommunity = null;
  const mainContent = getEl('mainContent');
  const communityMain = getEl('communityMain');
  const viewManualBook = getEl('viewManualBook');
  if (mainContent) mainContent.classList.remove('hidden');
  if (communityMain) communityMain.classList.add('hidden');
  if (viewManualBook) viewManualBook.classList.remove('hidden');
  document.querySelectorAll('#communityList .nav-item').forEach(n => n.classList.remove('active'));
}

// Patch existing nav handlers to call switchToTaskView
const navListEl = getEl('navList');
if (navListEl) navListEl.addEventListener('click', () => { switchToTaskView(); });

// ── House Rules ──────────────────────────────────────────────
async function loadUserHouseRules() {
  const container = getEl('userRulesList');
  if (!container) return;
  container.innerHTML = '<div class="loading-state"><div class="spinner"></div></div>';
  try {
    const data = await apiFetch('/api/community/house-rules');
    const rules = data?.data || [];
    if (!rules.length) {
      container.innerHTML = '<div class="hr-empty"><i class="bi bi-journal-x"></i>Belum ada house rule yang dibuat.</div>';
      return;
    }
    container.innerHTML = rules.map((r, i) => `
      <div class="hr-item">
        <div class="hr-index">${i + 1}</div>
        <div class="hr-body">
          <div class="hr-title">${escHtml(r.title)}</div>
          <div class="hr-content">${escHtml(r.content)}</div>
          <div class="hr-meta">
            <span><i class="bi bi-person-fill"></i> ${escHtml(r.created_by_username)}</span>
            <span><i class="bi bi-clock"></i> ${new Date(r.created_at).toLocaleDateString('id-ID', {day:'numeric',month:'short',year:'numeric'})}</span>
          </div>
        </div>
      </div>`).join('');
  } catch (e) {
    container.innerHTML = '<div class="u-empty-community"><i class="bi bi-exclamation-circle"></i>Gagal memuat data.</div>';
  }
}

// ── Duty Schedules ───────────────────────────────────────────
async function loadUserDutySchedules() {
  const container = getEl('userDutyGrid');
  if (!container) return;
  container.innerHTML = '<div class="loading-state" style="grid-column:1/-1"><div class="spinner"></div></div>';
  try {
    const data = await apiFetch('/api/community/duty-schedules');
    const grouped = data?.data || {};
    const cards = DAYS_ORDER_U.map(day => {
      const members = grouped[day] || [];
      const membersHTML = members.length
        ? members.map(m => `
            <div class="duty-member-row">
               <div class="duty-member-avatar">${m.member_name.charAt(0).toUpperCase()}</div>
              <span class="duty-member-name">${escHtml(m.member_name)}</span>
            </div>`).join('')
        : '<div class="duty-empty">Tidak ada jadwal</div>';
      return `
        <div class="duty-day-card">
          <div class="duty-day-header">
            <div class="duty-day-name">${DAY_ICONS_U[day] || '📅'} ${day}</div>
            <span class="duty-day-count">${members.length} anggota</span>
          </div>
          <div class="duty-members">${membersHTML}</div>
        </div>`;
    });
    container.innerHTML = cards.join('');
  } catch (e) {
    container.innerHTML = '<div class="u-empty-community" style="grid-column:1/-1"><i class="bi bi-exclamation-circle"></i>Gagal memuat data.</div>';
  }
}

// ── Calendar Schedules ───────────────────────────────────────
let currentUserSchedules = [];
let currentUserCategories = [];
let currentMonthUser = new Date().getMonth();
let currentYearUser = new Date().getFullYear();

function prevMonthUser() {
  currentMonthUser--;
  if (currentMonthUser < 0) {
    currentMonthUser = 11;
    currentYearUser--;
  }
  renderUserSchedules();
}

function nextMonthUser() {
  currentMonthUser++;
  if (currentMonthUser > 11) {
    currentMonthUser = 0;
    currentYearUser++;
  }
  renderUserSchedules();
}

// Helper: get category color class from category name
function getUserCategoryColorClass(categoryName) {
  const cat = currentUserCategories.find(c => c.name === categoryName);
  if (!cat) return 'cat-daily';
  return `cat-${cat.color}`;
}

async function loadUserCategories() {
  try {
    const data = await apiFetch('/api/community/categories');
    currentUserCategories = data?.data || [];
    populateUserCategoryFilter();
  } catch (e) {
    console.error('Failed to load categories', e);
  }
}

function populateUserCategoryFilter() {
  const select = getEl('userCategoryFilter');
  if (!select) return;
  const currentVal = select.value;
  select.innerHTML = '<option value="">Semua Kategori</option>';
  currentUserCategories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat.name;
    opt.textContent = cat.name;
    select.appendChild(opt);
  });
  if (currentVal) select.value = currentVal;
}

async function loadUserSchedules() {
  const grid = getEl('userCalendarGrid');
  if (grid) grid.innerHTML = '<div class="loading-state"><div class="spinner"></div></div>';
  try {
    await loadUserCategories();
    const data = await apiFetch('/api/community/schedules');
    currentUserSchedules = data?.data || [];
    renderUserSchedules();
  } catch (e) {
    if (grid) grid.innerHTML = '<div class="u-empty-community"><i class="bi bi-exclamation-circle"></i>Gagal memuat data.</div>';
  }
}

function renderUserSchedules() {
  const grid = getEl('userCalendarGrid');
  if (!grid) return;
  const title = getEl('userCalendarTitle');
  
  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  if (title) title.textContent = `${monthNames[currentMonthUser]} ${currentYearUser}`;

  grid.innerHTML = `
    <div class="fc-day-head">Senin</div>
    <div class="fc-day-head">Selasa</div>
    <div class="fc-day-head">Rabu</div>
    <div class="fc-day-head">Kamis</div>
    <div class="fc-day-head">Jumat</div>
    <div class="fc-day-head">Sabtu</div>
    <div class="fc-day-head">Minggu</div>
  `;

  const firstDay = new Date(currentYearUser, currentMonthUser, 1).getDay();
  const daysInMonth = new Date(currentYearUser, currentMonthUser + 1, 0).getDate();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1; // Make Monday = 0
  
  const today = new Date();
  
  for (let i = 0; i < startOffset; i++) {
    grid.innerHTML += `<div class="fc-day-cell other-month"></div>`;
  }

  const selectedCategory = getEl('userCategoryFilter')?.value;
  
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = day === today.getDate() && currentMonthUser === today.getMonth() && currentYearUser === today.getFullYear();
    const dateStr = `${currentYearUser}-${String(currentMonthUser+1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    // Multi-day filter and category filter
    let dayEvents = currentUserSchedules.filter(s => s.start_date <= dateStr && dateStr <= s.end_date);
    if (selectedCategory) {
      dayEvents = dayEvents.filter(s => s.category === selectedCategory);
    }

    const eventsHtml = dayEvents.map(s => {
      const colorClass = getUserCategoryColorClass(s.category);
      const isStart = s.start_date === dateStr;
      const isEnd = s.end_date === dateStr;
      const pillStyle = isStart && !isEnd ? 'border-radius: 6px 0 0 6px; margin-right: -2px;' :
                        isEnd && !isStart ? 'border-radius: 0 6px 6px 0; margin-left: -2px;' :
                        !isStart && !isEnd ? 'border-radius: 0; margin-left: -2px; margin-right: -2px;' : '';
      return `<div class="fc-event-pill ${colorClass}" onclick="event.stopPropagation(); openEventModal('${s.id}')" title="${escHtml(s.title)}\nKategori: ${escHtml(s.category)}\nOleh: ${escHtml(s.created_by_username)}" style="${pillStyle}">
        <span class="a-cat-badge ${colorClass}" style="padding:1px 5px; font-size:9px; margin-right:3px;">${escHtml(s.category)}</span>${isStart ? escHtml(s.title) : ''}
      </div>`;
    }).join('');

    grid.innerHTML += `
      <div class="fc-day-cell ${isToday ? 'today' : ''}" style="cursor:default;">
        <div class="fc-day-num">${day}</div>
        <div class="fc-events">${eventsHtml}</div>
      </div>
    `;
  }
}

function formatDateIndo(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('id-ID', {day:'numeric',month:'long',year:'numeric'});
}

function openEventModal(id) {
  const s = currentUserSchedules.find(x => x.id === id);
  if (!s) return;
  setText('eventDetailTitle', s.title);
  setText('eventDetailDesc', s.description || 'Tidak ada deskripsi.');
  
  const dateText = s.start_date === s.end_date 
    ? formatDateIndo(s.start_date)
    : `${formatDateIndo(s.start_date)} s/d ${formatDateIndo(s.end_date)}`;
  setText('eventDetailDate', dateText);
  
  // Update category badge
  const categoryBadge = getEl('eventDetailCategory');
  if (categoryBadge) {
    categoryBadge.textContent = s.category;
    // Clear previous classes
    categoryBadge.className = 'a-cat-badge ' + getUserCategoryColorClass(s.category);
  }
  
  setText('eventDetailCreator', s.created_by_username);
  const eventModal = getEl('eventModalOverlay');
  if (eventModal) eventModal.classList.add('open');
}
