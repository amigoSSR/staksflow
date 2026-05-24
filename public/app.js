/* =============================================
   STAKS FLOW — Frontend Application Logic
   ============================================= */

const API_BASE  = '/api/diaries';
const AUTH_BASE = '/api/auth';

// ─── Auth Token ───────────────────────────────
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
          <i class="bi bi-info-circle"></i> Lihat Detail & Timeline
        </button>
      </div>
    `;
  }).join('');
}
async function openProjectDetails(id) {
  const p = allProjects.find(x => x.id === id);
  if (!p) return;

  setText('projectDetailsTitle', p.project_name);
  setText('projectDetailsDesc', p.description || 'Tidak ada deskripsi proyek.');

  const overlay = getEl('projectDetailsModalOverlay');
  const membersList = getEl('projectDetailsMembersList');
  const timeline = getEl('projectDetailTimeline');

  if (overlay) overlay.classList.add('open');
  if (membersList) membersList.innerHTML = '<p style="opacity:0.6; font-size:13px;">Memuat anggota...</p>';
  if (timeline) timeline.innerHTML = '<p style="opacity:0.6; font-size:13px;">Memuat timeline...</p>';

  try {
    const [membersRes, timelineRes] = await Promise.all([
      apiFetch(`/api/projects/${id}/members`),
      apiFetch(`/api/projects/${id}/timeline`)
    ]);

    const members = membersRes.data || [];
    const diaries = timelineRes.data || [];

    if (membersList) {
      if (members.length === 0) {
        membersList.innerHTML = '<p style="opacity:0.6; font-size:13px;">Tidak ada anggota.</p>';
      } else {
        membersList.innerHTML = members.map(m => {
          const roleLabel = m.role === 'leader' ? 'Leader' : 'Mentee';
          const roleStyle = m.role === 'leader' 
            ? 'background: rgba(13, 110, 253, 0.15); color: #0d6efd;'
            : 'background: rgba(25, 135, 84, 0.15); color: #198754;';
          return `
            <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
              <div>
                <div style="font-weight: 500; font-size: 13px;">${escHtml(m.username)}</div>
                <div style="font-size: 11px; opacity: 0.5;">${escHtml(m.email)}</div>
              </div>
              <span style="font-size: 10px; padding: 2px 6px; border-radius: 8px; font-weight: 600; ${roleStyle}">${roleLabel}</span>
            </div>
          `;
        }).join('');
      }
    }

    if (timeline) {
      if (diaries.length === 0) {
        timeline.innerHTML = '<p style="opacity:0.6; font-size:13px; text-align: center; padding: 20px 0;">Belum ada diary aktivitas dalam proyek ini.</p>';
      } else {
        timeline.innerHTML = diaries.map(d => {
          const formattedDate = new Date(d.created_at).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric'
          });
          return `
            <div class="timeline-item" style="margin-left: 15px; margin-bottom: 20px; position: relative;">
              <div style="position: absolute; left: -21px; top: 4px; width: 10px; height: 10px; border-radius: 50%; background: var(--accent); border: 2px solid var(--bg-body, #0a0f1d);"></div>
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 12px; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: start; gap: 8px;">
                  <h4 style="font-size: 13px; font-weight: 600; color: var(--text-1); margin: 0;">${escHtml(d.diary_title)}</h4>
                  <span style="font-size: 11px; opacity: 0.5;">${formattedDate}</span>
                </div>
                <p style="font-size: 12px; opacity: 0.7; margin-top: 6px; line-height: 1.4;">${escHtml(d.activity_description)}</p>
                <div style="margin-top: 8px; display: flex; align-items: center; justify-content: space-between; font-size: 11px;">
                  <span style="opacity: 0.5;"><i class="bi bi-person"></i> Oleh: <b>${escHtml(d.username)}</b></span>
                  <span style="color: var(--accent); font-weight: 600;">${d.work_progress}% Progress</span>
                </div>
              </div>
            </div>
          `;
        }).join('');
      }
    }
  } catch (err) {
    showToast('Gagal memuat detail proyek: ' + err.message, 'error');
  }
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

  document.querySelectorAll('#navList .nav-item, #communityList .nav-item').forEach(n => n.classList.remove('active'));
  item.classList.add('active');
  
  switchToTaskView();

  const tab = item.dataset.tab;
  currentTab = tab;

  const gridView = getEl('gridView');
  const viewMyProjects = getEl('viewMyProjects');
  const userFilterBar = getEl('userFilterBar');
  const userSearchContainer = getEl('userSearchContainer');
  const btnAddTask = getEl('btnAddTask');

  if (tab === 'diaries') {
    setText('pageTitle', 'Diary Proyek Saya');
    setText('pageSubtitle', 'Catat kegiatan harian Anda dan hubungkan dengan proyek aktif Anda.');
    if (gridView) gridView.classList.remove('hidden');
    if (viewMyProjects) viewMyProjects.classList.add('hidden');
    if (userFilterBar) userFilterBar.style.display = 'flex';
    if (userSearchContainer) userSearchContainer.style.display = 'flex';
    if (btnAddTask) btnAddTask.style.display = 'inline-flex';
    renderTasks();
  } else if (tab === 'projects') {
    setText('pageTitle', 'Proyek Saya');
    setText('pageSubtitle', 'Daftar proyek aktif dan selesai yang Anda ikuti.');
    if (gridView) gridView.classList.add('hidden');
    if (viewMyProjects) viewMyProjects.classList.remove('hidden');
    if (userFilterBar) userFilterBar.style.display = 'none';
    if (userSearchContainer) userSearchContainer.style.display = 'none';
    if (btnAddTask) btnAddTask.style.display = 'none';
    renderProjects();
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
  if (mainContent) mainContent.classList.add('hidden');
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

function switchToTaskView() {
  activeCommunity = null;
  const mainContent = getEl('mainContent');
  const communityMain = getEl('communityMain');
  if (mainContent) mainContent.classList.remove('hidden');
  if (communityMain) communityMain.classList.add('hidden');
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
