/* =============================================
   STAKS FLOW — Frontend Application Logic
   ============================================= */

const API_BASE  = '/api/tasks';
const AUTH_BASE = '/api/auth';

// ─── Auth Token ───────────────────────────────
const getToken  = () => sessionStorage.getItem('tf_token');
const setToken  = (t) => sessionStorage.setItem('tf_token', t);
const clearToken = () => sessionStorage.removeItem('tf_token');

// Auth Guard
if (!getToken()) {
  sessionStorage.setItem('tf_auth_msg', 'Sesi Anda telah berakhir, silakan login kembali.');
  window.location.href = '/login.html';
}
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
  const el = id => document.getElementById(id);

  el('badge-all').textContent = allTasks.length;
  categories.forEach(cat => {
    const count = allTasks.filter(t => t.category === cat).length;
    el(`badge-${cat}`).textContent = count;
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
  document.getElementById('statDone').textContent    = done;
  document.getElementById('statPending').textContent = pending;
  document.getElementById('statOverdue').textContent = overdue;

  // Dashboard bar
  document.getElementById('dashTotalNum').textContent   = total;
  document.getElementById('dashDoneNum').textContent    = done;
  document.getElementById('dashPendingNum').textContent = pending;
  document.getElementById('dashOverdueNum').textContent = overdue;
}

function updateProgress() {
  const total   = allTasks.length;
  const done    = allTasks.filter(t => t.status.startsWith('selesai')).length;
  const pct     = total === 0 ? 0 : Math.round((done / total) * 100);
  document.getElementById('progressBar').style.width = pct + '%';
  document.getElementById('progressPct').textContent  = pct + '%';
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

  document.getElementById('modalTitle').textContent   = task ? 'Edit Tugas' : 'Tambah Tugas Baru';
  document.getElementById('btnSaveText').textContent  = task ? 'Simpan Perubahan' : 'Simpan Tugas';
  document.getElementById('taskId').value             = task ? task.id : '';
  document.getElementById('taskTitle').value          = task ? task.title : '';
  document.getElementById('taskDescription').value    = task ? (task.description || '') : '';
  document.getElementById('taskCategory').value       = task ? task.category : '';
  document.getElementById('taskDeadline').value       = task ? (task.deadline || '') : '';

  // Show status toggle only in edit mode
  const statusGroup = document.getElementById('statusGroupEdit');
  statusGroup.style.display = task ? 'flex' : 'none';
  setStatusBtns(taskStatus);

  // Char count
  updateCharCount();

  // Clear errors
  clearErrors();
  modalOverlay.classList.add('open');
  document.getElementById('taskTitle').focus();
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
  const btnP = document.getElementById('btnPending');
  const btnD = document.getElementById('btnDone');
  btnP.classList.toggle('active', status === 'pending');
  btnD.classList.toggle('active', status.startsWith('selesai'));
  taskStatus = status;
}

document.getElementById('btnPending').addEventListener('click', () => setStatusBtns('pending'));
document.getElementById('btnDone').addEventListener('click', ()    => setStatusBtns('selesai'));

// ─── FORM SUBMIT ──────────────────────────────
taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  const btnSave = document.getElementById('btnSave');
  btnSave.disabled = true;

  const payload = {
    title:       document.getElementById('taskTitle').value.trim(),
    description: document.getElementById('taskDescription').value.trim(),
    category:    document.getElementById('taskCategory').value,
    deadline:    document.getElementById('taskDeadline').value,
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

function validateForm() {
  let ok = true;
  const title    = document.getElementById('taskTitle');
  const category = document.getElementById('taskCategory');

  if (!title.value.trim()) {
    showFieldError('titleError', title, 'Judul tugas wajib diisi');
    ok = false;
  } else {
    clearFieldError('titleError', title);
  }

  if (!category.value) {
    showFieldError('categoryError', category, 'Pilih kategori tugas');
    ok = false;
  } else {
    clearFieldError('categoryError', category);
  }

  return ok;
}

function showFieldError(errId, input, msg) {
  document.getElementById(errId).textContent = msg;
  input.classList.add('error');
}
function clearFieldError(errId, input) {
  document.getElementById(errId).textContent = '';
  input.classList.remove('error');
}
function clearErrors() {
  ['titleError','categoryError'].forEach(id => document.getElementById(id).textContent = '');
  ['taskTitle','taskCategory'].forEach(id => document.getElementById(id).classList.remove('error'));
}

// ─── DELETE MODAL ─────────────────────────────
function openDeleteModal(id) {
  deletingTaskId = id;
  deleteModalOverlay.classList.add('open');
}
function closeDeleteModal() {
  deleteModalOverlay.classList.remove('open');
  deletingTaskId = null;
}

document.getElementById('btnConfirmDelete').addEventListener('click', async () => {
  if (!deletingTaskId) return;
  const btn = document.getElementById('btnConfirmDelete');
  btn.disabled = true;
  try {
    await apiFetch(`${API_BASE}/${deletingTaskId}`, { method: 'DELETE' });
    allTasks = allTasks.filter(t => t.id !== deletingTaskId);
    closeDeleteModal();
    renderAll();
    showToast('🗑️ Tugas berhasil dihapus', 'info');
  } catch (err) {
    showToast('Gagal menghapus: ' + err.message, 'error');
  } finally {
    btn.disabled = false;
  }
});

// ─── SIDEBAR NAVIGATION ───────────────────────
document.getElementById('navList').addEventListener('click', (e) => {
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
  document.getElementById('pageTitle').textContent    = title;
  document.getElementById('pageSubtitle').textContent = subtitle;

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
document.getElementById('sortSelect').addEventListener('change', (e) => {
  sortBy = e.target.value;
  renderAll();
});

// ─── SEARCH ───────────────────────────────────
searchInput.addEventListener('input', (e) => {
  searchQuery = e.target.value;
  searchClear.classList.toggle('visible', searchQuery.length > 0);
  renderTasks();
});
searchClear.addEventListener('click', () => {
  searchQuery = '';
  searchInput.value = '';
  searchClear.classList.remove('visible');
  renderTasks();
});

// ─── CHAR COUNT ───────────────────────────────
function updateCharCount() {
  const len = document.getElementById('taskDescription').value.length;
  document.getElementById('descCharCount').textContent = `${len} / 500`;
}
document.getElementById('taskDescription').addEventListener('input', updateCharCount);

// ─── MOBILE SIDEBAR ───────────────────────────
function openSidebar() {
  sidebar.classList.add('open');
  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('show');
  document.body.style.overflow = '';
}

document.getElementById('mobileMenuBtn').addEventListener('click', openSidebar);
document.getElementById('sidebarToggle').addEventListener('click', closeSidebar);
overlay.addEventListener('click', closeSidebar);

// ─── BUTTON EVENTS ────────────────────────────
document.getElementById('btnAddTask').addEventListener('click', () => openModal());
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('btnCancel').addEventListener('click', closeModal);
document.getElementById('btnCancelDelete').addEventListener('click', closeDeleteModal);

// Close modal on backdrop click
modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
deleteModalOverlay.addEventListener('click', (e) => { if (e.target === deleteModalOverlay) closeDeleteModal(); });

// ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closeModal(); closeDeleteModal(); }
});

// ─── TOAST ────────────────────────────────────
function showToast(msg, type = 'info') {
  const icons = { success: 'bi-check-circle-fill', error: 'bi-x-circle-fill', info: 'bi-info-circle-fill' };
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="bi ${icons[type]} toast-icon"></i><span class="toast-msg">${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ─── HELPERS ──────────────────────────────────
function showLoading(show) {
  loadingState.style.display = show ? 'flex' : 'none';
  if (show) { tasksGrid.innerHTML = ''; emptyState.classList.add('hidden'); }
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
  document.getElementById('kanbanPendingCards').innerHTML = pending.map(mkCard).join('') || '<p class="kanban-empty">Tidak ada tugas</p>';
  document.getElementById('kanbanDoneCards').innerHTML    = done.map(mkCard).join('')    || '<p class="kanban-empty">Tidak ada tugas</p>';
  document.getElementById('kanbanPendingCount').textContent = pending.length;
  document.getElementById('kanbanDoneCount').textContent    = done.length;
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
document.getElementById('viewList').addEventListener('click', (e) => {
  const item = e.target.closest('.nav-item');
  if (!item || !item.dataset.view) return;
  activeView = item.dataset.view;
  document.querySelectorAll('#viewList .nav-item').forEach(n => n.classList.remove('active'));
  item.classList.add('active');
  document.getElementById('gridView').classList.toggle('hidden', activeView !== 'grid');
  document.getElementById('kanbanView').classList.toggle('hidden', activeView !== 'kanban');
  if (activeView === 'kanban') renderKanban();
});

// Override renderAll to also update kanban when visible
const _origRenderAll = renderAll;
function renderAll() {
  updateBadges(); renderTasks(); updateProgress(); updateStats();
  if (activeView === 'kanban') renderKanban();
}

// ─── THEME TOGGLE ─────────────────────────────
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('tf_theme', theme);
  themeIcon.className = theme === 'dark' ? 'bi bi-moon-stars-fill' : 'bi bi-sun-fill';
}
themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  applyTheme(current === 'dark' ? 'light' : 'dark');
});
applyTheme(localStorage.getItem('tf_theme') || 'dark');

// ─── NOTIFICATION PANEL ───────────────────────
const notifPanel   = document.getElementById('notifPanel');
const notifOverlay = document.getElementById('notifOverlay');
document.getElementById('btnNotification').addEventListener('click', () => {
  buildNotifications();
  notifPanel.classList.add('open');
  notifOverlay.classList.add('show');
});
document.getElementById('notifClose').addEventListener('click', closeNotif);
notifOverlay.addEventListener('click', closeNotif);
function closeNotif() { notifPanel.classList.remove('open'); notifOverlay.classList.remove('show'); }
function buildNotifications() {
  const today = new Date(); today.setHours(0,0,0,0);
  const urgent = allTasks.filter(t => {
    if (t.status.startsWith('selesai') || !t.deadline) return false;
    const d = new Date(t.deadline + 'T00:00:00');
    const diff = Math.ceil((d - today) / 86400000);
    return diff <= 3;
  }).sort((a,b) => a.deadline.localeCompare(b.deadline));
  const badge = document.getElementById('notifBadge');
  badge.textContent = urgent.length;
  badge.classList.toggle('hidden', urgent.length === 0);
  const list = document.getElementById('notifList');
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
  document.getElementById('userNameDisplay').textContent  = user.username;
  document.getElementById('userEmailDisplay').textContent = user.email;
  document.getElementById('userAvatar').textContent = user.username.charAt(0).toUpperCase();

  if (user.role === 'admin') {
    const adminLink = document.getElementById('adminPanelLink');
    if (adminLink) adminLink.classList.remove('hidden');
  }

  loadTasks();
}

function doLogout() {
  clearToken();
  window.location.href = '/login.html';
}

const btnLogout = document.getElementById('btnLogout');
if (btnLogout) {
  btnLogout.addEventListener('click', doLogout);
}

// ─── INIT ─────────────────────────────────────
(async () => {
  const token = getToken();
  if (token) {
    try {
      const res = await fetch(`${AUTH_BASE}/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const loader = document.getElementById('authLoading');
        if (loader) loader.style.display = 'none';
        showApp(data.user);
      } else {
        clearToken();
        window.location.href = '/login.html';
      }
    } catch {
      clearToken();
      window.location.href = '/login.html';
    }
  } else {
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
document.getElementById('communityList')?.addEventListener('click', e => {
  const item = e.target.closest('.nav-item');
  if (!item) return;
  const type = item.dataset.community;
  switchCommunity(type);
  closeSidebar();
});

// Mobile menu btn for community main
document.getElementById('mobileMenuBtnC')?.addEventListener('click', openSidebar);

function switchCommunity(type) {
  activeCommunity = type;

  // Deactivate task nav items
  document.querySelectorAll('#navList .nav-item, #viewList .nav-item').forEach(n => n.classList.remove('active'));

  // Activate community nav item
  document.querySelectorAll('#communityList .nav-item').forEach(n => n.classList.remove('active'));
  const navEl = document.getElementById(`nav-${type}`);
  if (navEl) navEl.classList.add('active');

  // Show communityMain, hide appScreen main
  document.getElementById('mainContent').classList.add('hidden');
  document.getElementById('communityMain').classList.remove('hidden');

  // Show correct sub-view
  document.getElementById('viewHouseRules').classList.toggle('hidden', type !== 'house-rules');
  document.getElementById('viewDuty').classList.toggle('hidden', type !== 'duty');
  document.getElementById('viewCalendar').classList.toggle('hidden', type !== 'calendar');

  if (type === 'house-rules') {
    document.getElementById('communityTitle').textContent    = 'House Rules';
    document.getElementById('communitySubtitle').textContent = 'Peraturan dan tata tertib hunian';
    loadUserHouseRules();
  } else if (type === 'duty') {
    document.getElementById('communityTitle').textContent    = 'Jadwal Piket';
    document.getElementById('communitySubtitle').textContent = 'Jadwal tugas kebersihan anggota';
    loadUserDutySchedules();
  } else if (type === 'calendar') {
    document.getElementById('communityTitle').textContent    = 'Calendar / Schedule';
    document.getElementById('communitySubtitle').textContent = 'Jadwal dan agenda kegiatan';
    loadUserSchedules();
  }
}

// Call this when switching BACK to task views (nav clicks on task categories)
function switchToTaskView() {
  activeCommunity = null;
  document.getElementById('mainContent').classList.remove('hidden');
  document.getElementById('communityMain').classList.add('hidden');
  document.querySelectorAll('#communityList .nav-item').forEach(n => n.classList.remove('active'));
}

// Patch existing nav handlers to call switchToTaskView
const _origNavClick = document.getElementById('navList').onclick;
document.getElementById('navList').addEventListener('click', () => { switchToTaskView(); });
document.getElementById('viewList').addEventListener('click', () => { switchToTaskView(); });

// ── House Rules ──────────────────────────────────────────────
async function loadUserHouseRules() {
  const container = document.getElementById('userRulesList');
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
  const container = document.getElementById('userDutyGrid');
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
  const grid = document.getElementById('userCalendarGrid');
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
  const grid = document.getElementById('userCalendarGrid');
  if (!grid) return;
  const title = document.getElementById('userCalendarTitle');
  
  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  title.textContent = `${monthNames[currentMonthUser]} ${currentYearUser}`;

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
  document.getElementById('eventDetailTitle').textContent = s.title;
  document.getElementById('eventDetailDesc').textContent = s.description || 'Tidak ada deskripsi.';
  document.getElementById('eventDetailDate').textContent = new Date(s.date).toLocaleDateString('id-ID', {day:'numeric',month:'long',year:'numeric'});
  document.getElementById('eventDetailTime').textContent = s.time;
  document.getElementById('eventDetailCreator').textContent = s.created_by_username;
  document.getElementById('eventModalOverlay').classList.add('open');
}
