/* =============================================
   STAKS FLOW — Frontend Application Logic
   ============================================= */

const API_BASE  = '/api/tasks';
const AUTH_BASE = '/api/auth';

// ─── Auth Token ───────────────────────────────
const getToken  = () => sessionStorage.getItem('tf_token');
const setToken  = (t) => sessionStorage.setItem('tf_token', t);
const clearToken = () => sessionStorage.removeItem('tf_token');

// Auth Guard is handled inside the async IIFE below to avoid race conditions.
let currentUser = null;

// ─── State ───────────────────────────────────
let allTasks        = [];
let activeCategory  = 'all';
let activeStatus    = 'all';
let searchQuery     = '';
let sortBy          = 'newest';
let editingTaskId   = null;
let deletingTaskId  = null;
let taskStatus      = 'pending'; // for modal toggle

// ─── DOM References ───────────────────────────
const tasksGrid        = document.getElementById('tasksGrid');
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
    const res = await apiFetch(API_BASE);
    allTasks = res.data || [];
    renderAll();
  } catch (err) {
    showToast('Gagal memuat tugas: ' + err.message, 'error');
    showLoading(false);
  }
}

function renderAll() {
  updateBadges();
  renderTasks();
  updateProgress();
  updateStats();
}

function getFilteredTasks() {
  let tasks = [...allTasks];

  // Category filter
  if (activeCategory !== 'all') {
    tasks = tasks.filter(t => t.category === activeCategory);
  }

  // Status filter
  if (activeStatus !== 'all') {
    tasks = tasks.filter(t => t.status === activeStatus);
  }

  // Search filter
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    tasks = tasks.filter(t =>
      t.title.toLowerCase().includes(q) ||
      (t.description || '').toLowerCase().includes(q)
    );
  }

  // Sort
  tasks.sort((a, b) => {
    if (sortBy === 'newest')   return new Date(b.created_at) - new Date(a.created_at);
    if (sortBy === 'oldest')   return new Date(a.created_at) - new Date(b.created_at);
    if (sortBy === 'deadline') return (a.deadline || 'z').localeCompare(b.deadline || 'z');
    if (sortBy === 'title')    return a.title.localeCompare(b.title);
    return 0;
  });

  return tasks;
}

function renderTasks() {
  showLoading(false);
  const tasks = getFilteredTasks();
  if (!tasksGrid || !emptyState) return;

  if (tasks.length === 0) {
    tasksGrid.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');
  tasksGrid.innerHTML = tasks.map(buildTaskCard).join('');
  tasksGrid.querySelectorAll('.task-checkbox').forEach(cb => {
    cb.addEventListener('click', () => {
      const id = cb.closest('.task-card').dataset.id;
      const currentStatus = cb.classList.contains('checked') ? 'selesai' : 'pending';
      toggleStatus(id, currentStatus === 'selesai' ? 'pending' : 'selesai');
    });
  });
}

function buildTaskCard(task) {
  const isDone     = task.status.startsWith('selesai');
  const catClass   = `cat-${task.category}`;
  const deadlineHTML = buildDeadline(task.deadline);

  const catLabels = {
    daily: 'Harian', weekly: 'Mingguan', monthly: 'Bulanan',
    quarterly: 'Per 3 Bln', semesterly: 'Per 6 Bln', yearly: 'Tahunan'
  };

  return `
  <article class="task-card ${isDone ? 'done' : ''}" data-id="${task.id}">
    <div class="task-card-top">
      <div class="task-checkbox ${isDone ? 'checked' : ''}" role="checkbox" aria-checked="${isDone}" aria-label="Toggle status">
        <i class="bi bi-check check-icon"></i>
      </div>
      <div class="task-content">
        <div class="task-title" title="${escHtml(task.title)}">${escHtml(task.title)}</div>
        ${task.description ? `<div class="task-description">${escHtml(task.description)}</div>` : ''}
      </div>
    </div>

    <div class="task-meta">
      <div class="task-tags">
        <span class="tag-category ${catClass}">${catLabels[task.category] || task.category}</span>
        <span class="tag-status ${task.status}">
          <i class="bi ${isDone ? 'bi-check-circle-fill' : 'bi-hourglass-split'}"></i>
          ${isDone ? 'Selesai' : 'Pending'}
        </span>
      </div>
      ${deadlineHTML}
    </div>

    <div class="task-actions">
      <button class="task-btn edit" onclick="openEditModal('${task.id}')" aria-label="Edit task" title="Edit">
        <i class="bi bi-pencil-fill"></i>
      </button>
      <button class="task-btn delete" onclick="openDeleteModal('${task.id}')" aria-label="Delete task" title="Hapus">
        <i class="bi bi-trash3-fill"></i>
      </button>
    </div>
  </article>`;
}

function buildDeadline(deadline) {
  if (!deadline) return '';
  const today = new Date(); today.setHours(0,0,0,0);
  const d = new Date(deadline + 'T00:00:00');
  const diff = Math.ceil((d - today) / 86400000);

  let cls = '', label = '';
  if (diff < 0)       { cls = 'overdue'; label = `Terlambat ${Math.abs(diff)} hari`; }
  else if (diff === 0){ cls = 'soon';    label = 'Hari ini!'; }
  else if (diff <= 3) { cls = 'soon';    label = `${diff} hari lagi`; }
  else { label = new Date(deadline).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' }); }

  return `<span class="task-deadline ${cls}"><i class="bi bi-calendar3"></i> ${label}</span>`;
}

// ─── BADGES & STATS ──────────────────────────
function updateBadges() {
  const categories = ['daily','weekly','monthly','quarterly','semesterly','yearly'];
  setText('badge-all', allTasks.length);
  categories.forEach(cat => {
    const count = allTasks.filter(t => t.category === cat).length;
    setText(`badge-${cat}`, count);
  });
}

function updateStats() {
  const total   = allTasks.length;
  const done    = allTasks.filter(t => t.status.startsWith('selesai')).length;
  const pending = allTasks.filter(t => t.status === 'pending').length;
  const today   = new Date(); today.setHours(0,0,0,0);
  const overdue = allTasks.filter(t => {
    if (t.status.startsWith('selesai') || !t.deadline) return false;
    return new Date(t.deadline + 'T00:00:00') < today;
  }).length;

  // Sidebar stats
  setText('statDone', done);
  setText('statPending', pending);
  setText('statOverdue', overdue);

  // Dashboard bar
  setText('dashTotalNum', total);
  setText('dashDoneNum', done);
  setText('dashPendingNum', pending);
  setText('dashOverdueNum', overdue);
}

function updateProgress() {
  const total   = allTasks.length;
  const done    = allTasks.filter(t => t.status.startsWith('selesai')).length;
  const pct     = total === 0 ? 0 : Math.round((done / total) * 100);
  const progressBar = getEl('progressBar');
  if (progressBar) progressBar.style.width = pct + '%';
  setText('progressPct', pct + '%');
}

// ─── STATUS TOGGLE ────────────────────────────
async function toggleStatus(id, newStatus) {
  try {
    const res = await apiFetch(`${API_BASE}/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus }),
    });
    const idx = allTasks.findIndex(t => t.id === id);
    if (idx !== -1) allTasks[idx] = res.data;
    renderAll();
    showToast(newStatus.startsWith('selesai') ? '✅ Tugas selesai!' : '🔄 Tugas dikembalikan ke pending', 'success');
  } catch (err) {
    showToast('Gagal update status: ' + err.message, 'error');
  }
}

// ─── MODAL: ADD / EDIT ───────────────────────
function openModal(task = null) {
  editingTaskId = task ? task.id : null;
  taskStatus = task ? task.status : 'pending';

  setText('modalTitle', task ? 'Edit Tugas' : 'Tambah Tugas Baru');
  setText('btnSaveText', task ? 'Simpan Perubahan' : 'Simpan Tugas');
  setValue('taskId', task ? task.id : '');
  setValue('taskTitle', task ? task.title : '');
  setValue('taskDescription', task ? (task.description || '') : '');
  setValue('taskCategory', task ? task.category : '');
  setValue('taskDeadline', task ? (task.deadline || '') : '');

  const statusGroup = getEl('statusGroupEdit');
  if (statusGroup) statusGroup.style.display = task ? 'flex' : 'none';
  setStatusBtns(taskStatus);

  updateCharCount();
  clearErrors();
  if (modalOverlay) modalOverlay.classList.add('open');
  getEl('taskTitle')?.focus();
}

function openEditModal(id) {
  const task = allTasks.find(t => t.id === id);
  if (task) openModal(task);
}

function closeModal() {
  modalOverlay.classList.remove('open');
  taskForm.reset();
  editingTaskId = null;
}

function setStatusBtns(status) {
  const btnP = getEl('btnPending');
  const btnD = getEl('btnDone');
  if (btnP) btnP.classList.toggle('active', status === 'pending');
  if (btnD) btnD.classList.toggle('active', status.startsWith('selesai'));
  taskStatus = status;
}

addListener('btnPending', 'click', () => setStatusBtns('pending'));
addListener('btnDone', 'click', () => setStatusBtns('selesai'));

// ─── FORM SUBMIT ──────────────────────────────
if (taskForm) {
  taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const btnSave = getEl('btnSave');
    if (btnSave) btnSave.disabled = true;

    const payload = {
      title:       getValue('taskTitle').trim(),
      description: getValue('taskDescription').trim(),
      category:    getValue('taskCategory'),
      deadline:    getValue('taskDeadline'),
      status:      editingTaskId ? taskStatus : 'pending',
    };

  try {
    if (editingTaskId) {
      const res = await apiFetch(`${API_BASE}/${editingTaskId}`, {
        method: 'PUT', body: JSON.stringify(payload),
      });
      const idx = allTasks.findIndex(t => t.id === editingTaskId);
      if (idx !== -1) allTasks[idx] = res.data;
      showToast('✏️ Tugas berhasil diperbarui!', 'success');
    } else {
      const res = await apiFetch(API_BASE, {
        method: 'POST', body: JSON.stringify(payload),
      });
      allTasks.unshift(res.data);
      showToast('🎉 Tugas baru berhasil ditambahkan!', 'success');
    }
    closeModal();
    renderAll();
  } catch (err) {
    showToast('Gagal menyimpan: ' + err.message, 'error');
  } finally {
    btnSave.disabled = false;
  }
  });
} // end if (taskForm)

function validateForm() {
  let ok = true;
  const title    = getEl('taskTitle');
  const category = getEl('taskCategory');

  if (!title || !title.value.trim()) {
    showFieldError('titleError', title, 'Judul tugas wajib diisi');
    ok = false;
  } else {
    clearFieldError('titleError', title);
  }

  if (!category || !category.value) {
    showFieldError('categoryError', category, 'Pilih kategori tugas');
    ok = false;
  } else {
    clearFieldError('categoryError', category);
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
  ['titleError','categoryError'].forEach(id => { const el = getEl(id); if (el) el.textContent = ''; });
  ['taskTitle','taskCategory'].forEach(id => { const el = getEl(id); if (el) el.classList.remove('error'); });
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
    allTasks = allTasks.filter(t => t.id !== deletingTaskId);
    closeDeleteModal();
    renderAll();
    showToast('🗑️ Tugas berhasil dihapus', 'info');
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
  activeCategory = item.dataset.category;

  const titles = {
    all: ['Semua Tugas', 'Kelola semua tugas Anda di sini'],
    daily: ['Tugas Harian', 'Tugas yang perlu diselesaikan setiap hari'],
    weekly: ['Tugas Mingguan', 'Tugas yang perlu diselesaikan minggu ini'],
    monthly: ['Tugas Bulanan', 'Tugas yang perlu diselesaikan bulan ini'],
    quarterly: ['Tugas Per 3 Bulan', 'Tugas kuartalan Anda'],
    semesterly: ['Tugas Per 6 Bulan', 'Tugas semesteran Anda'],
    yearly: ['Tugas Tahunan', 'Tugas yang perlu diselesaikan tahun ini'],
  };
  const [title, subtitle] = titles[activeCategory] || ['Tugas', ''];
  setText('pageTitle', title);
  setText('pageSubtitle', subtitle);

  renderAll();
  closeSidebar();
});

// ─── FILTER TABS ──────────────────────────────
document.querySelectorAll('.filter-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeStatus = tab.dataset.status;
    renderAll();
  });
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
    if (tasksGrid) tasksGrid.innerHTML = '';
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

// ─── KANBAN VIEW ─────────────────────────────
function renderKanban() {
  const tasks = getFilteredTasks();
  const pending = tasks.filter(t => t.status === 'pending');
  const done    = tasks.filter(t => t.status.startsWith('selesai'));
  const mkCard  = (t) => `
    <div class="kanban-card" draggable="true" data-id="${t.id}"
      ondragstart="handleDragStart(event)">
      <div class="kanban-card-title">${escHtml(t.title)}</div>
      ${t.deadline ? `<div class="task-deadline">${buildDeadline(t.deadline)}</div>` : ''}
      <div class="kanban-card-actions">
        <button class="task-btn edit" onclick="openEditModal('${t.id}')" title="Edit"><i class="bi bi-pencil-fill"></i></button>
        <button class="task-btn delete" onclick="openDeleteModal('${t.id}')" title="Hapus"><i class="bi bi-trash3-fill"></i></button>
      </div>
    </div>`;
  setHTML('kanbanPendingCards', pending.map(mkCard).join('') || '<p class="kanban-empty">Tidak ada tugas</p>');
  setHTML('kanbanDoneCards', done.map(mkCard).join('') || '<p class="kanban-empty">Tidak ada tugas</p>');
  setText('kanbanPendingCount', pending.length);
  setText('kanbanDoneCount', done.length);
}

let draggedId = null;
function handleDragStart(e) { draggedId = e.currentTarget.dataset.id; e.dataTransfer.effectAllowed = 'move'; }
function handleDragOver(e)  { e.preventDefault(); e.currentTarget.classList.add('drag-over'); }
function handleDragLeave(e) { e.currentTarget.classList.remove('drag-over'); }
async function handleDrop(e, status) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  if (!draggedId) return;
  const task = allTasks.find(t => t.id === draggedId);
  if (!task || task.status === status) return;
  await toggleStatus(draggedId, status);
  draggedId = null;
}

// ─── VIEW TOGGLE ──────────────────────────────
let activeView = 'grid';
const viewListEl = getEl('viewList');
if (viewListEl) {
  viewListEl.addEventListener('click', (e) => {
    const item = e.target.closest('.nav-item');
    if (!item || !item.dataset.view) return;
    activeView = item.dataset.view;
    document.querySelectorAll('#viewList .nav-item').forEach(n => n.classList.remove('active'));
    item.classList.add('active');
    const gridView = getEl('gridView');
    const kanbanView = getEl('kanbanView');
    if (gridView) gridView.classList.toggle('hidden', activeView !== 'grid');
    if (kanbanView) kanbanView.classList.toggle('hidden', activeView !== 'kanban');
    if (activeView === 'kanban') renderKanban();
  });
}

// Override renderAll to also update kanban when visible
const _origRenderAll = renderAll;
function renderAll() {
  updateBadges(); renderTasks(); updateProgress(); updateStats();
  if (activeView === 'kanban') renderKanban();
}

// ─── THEME TOGGLE ─────────────────────────────
const themeToggle = getEl('themeToggle');
const themeIcon   = getEl('themeIcon');
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('tf_theme', theme);
  if (themeIcon) themeIcon.className = theme === 'dark' ? 'bi bi-moon-stars-fill' : 'bi bi-sun-fill';
}
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
}
applyTheme(localStorage.getItem('tf_theme') || 'dark');

// ─── NOTIFICATION PANEL ───────────────────────
const notifPanel   = getEl('notifPanel');
const notifOverlay = getEl('notifOverlay');
addListener('btnNotification', 'click', () => {
  buildNotifications();
  if (notifPanel) notifPanel.classList.add('open');
  if (notifOverlay) notifOverlay.classList.add('show');
});
addListener('notifClose', 'click', closeNotif);
if (notifOverlay) notifOverlay.addEventListener('click', closeNotif);
function closeNotif() { if (notifPanel) notifPanel.classList.remove('open'); if (notifOverlay) notifOverlay.classList.remove('show'); }
function buildNotifications() {
  const today = new Date(); today.setHours(0,0,0,0);
  const urgent = allTasks.filter(t => {
    if (t.status.startsWith('selesai') || !t.deadline) return false;
    const d = new Date(t.deadline + 'T00:00:00');
    const diff = Math.ceil((d - today) / 86400000);
    return diff <= 3;
  }).sort((a,b) => a.deadline.localeCompare(b.deadline));
  const badge = getEl('notifBadge');
  if (badge) {
    badge.textContent = urgent.length;
    badge.classList.toggle('hidden', urgent.length === 0);
  }
  const list = getEl('notifList');
  if (!list) return;
  if (urgent.length === 0) {
    list.innerHTML = '<div class="notif-empty">Tidak ada tugas mendekati deadline 🎉</div>';
    return;
  }
  list.innerHTML = urgent.map(t => {
    const today2 = new Date(); today2.setHours(0,0,0,0);
    const d = new Date(t.deadline + 'T00:00:00');
    const diff = Math.ceil((d - today2) / 86400000);
    const label = diff < 0 ? `Terlambat ${Math.abs(diff)} hari` : diff === 0 ? 'Hari ini!' : `${diff} hari lagi`;
    const cls   = diff <= 0 ? 'overdue' : 'soon';
    return `<div class="notif-item">
      <div class="notif-title">${escHtml(t.title)}</div>
      <div class="notif-meta task-deadline ${cls}"><i class="bi bi-calendar3"></i> ${label}</div>
    </div>`;
  }).join('');
}

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
    // Add 10s timeout so loader never hangs forever
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
        // Unexpected response shape
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
    // Network error or timeout
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

  document.querySelectorAll('#navList .nav-item, #viewList .nav-item').forEach(n => n.classList.remove('active'));
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
if (viewListEl) viewListEl.addEventListener('click', () => { switchToTaskView(); });

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

async function loadUserSchedules() {
  const grid = getEl('userCalendarGrid');
  if (grid) grid.innerHTML = '<div class="loading-state"><div class="spinner"></div></div>';
  try {
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
  
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = day === today.getDate() && currentMonthUser === today.getMonth() && currentYearUser === today.getFullYear();
    const dateStr = `${currentYearUser}-${String(currentMonthUser+1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    const dayEvents = currentUserSchedules.filter(s => s.date === dateStr);
    const eventsHtml = dayEvents.map(s => 
      `<div class="fc-event-pill" onclick="event.stopPropagation(); openEventModal('${s.id}')" title="${escHtml(s.title)}\nOleh: ${escHtml(s.created_by_username)}">
        ${s.time} ${escHtml(s.title)}
      </div>`
    ).join('');

    grid.innerHTML += `
      <div class="fc-day-cell ${isToday ? 'today' : ''}" style="cursor:default;">
        <div class="fc-day-num">${day}</div>
        <div class="fc-events">${eventsHtml}</div>
      </div>
    `;
  }
}

function openEventModal(id) {
  const s = currentUserSchedules.find(x => x.id === id);
  if (!s) return;
  setText('eventDetailTitle', s.title);
  setText('eventDetailDesc', s.description || 'Tidak ada deskripsi.');
  setText('eventDetailDate', new Date(s.date).toLocaleDateString('id-ID', {day:'numeric',month:'long',year:'numeric'}));
  setText('eventDetailTime', s.time);
  setText('eventDetailCreator', s.created_by_username);
  const eventModal = getEl('eventModalOverlay');
  if (eventModal) eventModal.classList.add('open');
}
