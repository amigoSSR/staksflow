/**
 * public/admin.js — Admin Dashboard Logic
 */
"use strict";

// ── Auth ─────────────────────────────────────────────────────────────────────
const getToken = () => sessionStorage.getItem("tf_token");
const getEl = (id) => document.getElementById(id);
const getValue = (id) => getEl(id)?.value || '';
const setText = (id, text) => { const el = getEl(id); if (el) el.textContent = text; };
const setHTML = (id, html) => { const el = getEl(id); if (el) el.innerHTML = html; };
const setValue = (id, value) => { const el = getEl(id); if (el) el.value = value; };
const addListener = (id, event, handler) => { const el = getEl(id); if (el) el.addEventListener(event, handler); return el; };

// Auth Guard
if (!getToken()) {
  sessionStorage.setItem('tf_auth_msg', 'Sesi Anda telah berakhir, silakan login kembali.');
  window.location.href = "/login.html";
}

async function adminFetch(url, options = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(url, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) },
  });
  if (res.status === 401 || res.status === 403) {
    sessionStorage.setItem('tf_auth_msg', 'Sesi habis atau akses ditolak. Redirect ke login...');
    sessionStorage.removeItem("tf_token");
    window.location.href = "/login.html";
    return null;
  }
  return res;
}

// ── State ─────────────────────────────────────────────────────────────────────
let allUsers = [];
let allTasks = [];
let allActivity = [];
let currentSection = "overview";

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {
  const token = getToken();
  if (!token) return;

  // Verify token & role
  try {
    const res = await fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok || data.user?.role !== "admin") {
      showToast("Akses ditolak. Harus login sebagai admin.", "error");
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
      return;
    }
    
    // Hide loader
    const loader = getEl("authLoading");
    if (loader) loader.style.display = "none";

    const u = data.user;
    setText("adminName", u.username);
    setText("adminAvatar", u.username.charAt(0).toUpperCase());
  } catch (e) {
    window.location.href = "/";
    return;
  }

  // Apply saved theme
  const savedTheme = localStorage.getItem("tf_theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);

  // Nav click handlers (MPA Navigation)
  document.querySelectorAll(".a-nav-item").forEach((item) => {
    item.addEventListener("click", () => {
      const section = item.dataset.section;
      window.location.href = section === 'overview' ? '/admin.html' : `/admin-${section}.html`;
    });
  });

  // Determine active section from URL
  let section = "overview";
  const pathName = window.location.pathname;
  if (pathName.includes("admin-")) {
    const match = pathName.match(/admin-(.*?)\.html/);
    if (match) section = match[1];
  }
  currentSection = section;

  // Ensure nav is visually active
  const navEl = getEl(`nav-${section}`);
  if (navEl) {
    document.querySelectorAll(".a-nav-item").forEach(n => n.classList.remove("active"));
    navEl.classList.add("active");
  }

  // Load section-specific data
  // Call loadStats() globally to populate sidebar badges
  await loadStats();

  if (section === "overview") {
    await loadActivities(true); // Load recent activities for overview
  }
  if (section === "users") await loadUsers();
  if (section === "tasks") await loadTasks();
  if (section === "activity") await loadActivities(true);
  if (section === "progress" && typeof loadProgressSection === "function") loadProgressSection();
  if (section === "house-rules" && typeof loadHouseRules === "function") loadHouseRules();
  if (section === "duty" && typeof loadDutySchedules === "function") loadDutySchedules();
  if (section === "calendar" && typeof loadSchedules === "function") loadSchedules();

  // ── Socket.io ───────────────────────────────────────────────────────────────
  if (typeof io !== "undefined") {
    const socket = io();

    socket.on("connect", () => {
      socket.emit("join_admin");
    });

    socket.on("task_created", ({ task, log }) => {
      allTasks.unshift(task);
      if (log) allActivity.unshift(log);
      filterTasks();
      filterActivity();
      loadStats(true); // Update stats summary
      if (
        currentSection === "progress" &&
        typeof loadProgressSection === "function"
      )
        loadProgressSection(true);
      showToast(
        `Aktivitas Baru: Task "${task.title}" ditambahkan oleh ${task.username}`,
        "info",
      );
    });

    socket.on("task_updated", ({ task, log }) => {
      const idx = allTasks.findIndex((t) => t.id === task.id);
      if (idx !== -1) allTasks[idx] = task;
      if (log) allActivity.unshift(log);
      filterTasks();
      filterActivity();
      loadStats(true);
      if (
        currentSection === "progress" &&
        typeof loadProgressSection === "function"
      )
        loadProgressSection(true);
    });

    socket.on("task_deleted", ({ taskId, log }) => {
      allTasks = allTasks.filter((t) => t.id !== taskId);
      if (log) allActivity.unshift(log);
      filterTasks();
      filterActivity();
      loadStats(true);
      if (
        currentSection === "progress" &&
        typeof loadProgressSection === "function"
      )
        loadProgressSection(true);
    });

    socket.on("user_registered", ({ user }) => {
      loadStats(true); // Update counts immediately
      if (currentSection === "users") {
        loadUsers(); // Refresh users table
      }
      showToast(`User baru mendaftar: ${user.username}`, "info");
    });
  }
});

async function loadAll() {
  if (currentSection === "overview") {
    await loadStats();
    await loadActivities(true);
  }
  if (currentSection === "users") await loadUsers();
  if (currentSection === "tasks") await loadTasks();
  if (currentSection === "activity") await loadActivities(true);
}

function refreshData() {
  loadAll();
  showToast("Data diperbarui", "info");
}

// ── Section Navigation ────────────────────────────────────────────────────────
const sectionTitles = {
  overview: [
    "Dashboard Overview",
    "Selamat datang di panel administrasi STAKS FLOW",
  ],
  users: ["Manajemen User", "Kelola akun dan role pengguna"],
  tasks: ["Semua Tasks", "Lihat dan kelola task semua pengguna"],
  activity: ["Activity Log", "Rekam jejak aktivitas pengguna"],
  progress: [
    "Progress Monitoring",
    "Pantau produktivitas dan aktivitas setiap user",
  ],
  calendar: ["Calendar / Schedule", "Kelola jadwal dan agenda kegiatan"],
};

async function showSection(section) {
  currentSection = section;
  
  // Update nav state
  document
    .querySelectorAll(".a-nav-item")
    .forEach((n) => n.classList.remove("active"));
  const navEl = getEl(`nav-${section}`);
  if (navEl) navEl.classList.add("active");
  
  const [title, sub] = sectionTitles[section] || ["", ""];
  setText("pageTitle", title);
  setText("pageSub", sub);

  // Dynamic loading of HTML modules
  const container = getEl("app-sections");
  let folder = section;
  if (section === 'duty') folder = 'piket';
  if (section === 'calendar') folder = 'schedule';

  try {
    const res = await fetch(`/src/modules/admin/${folder}/${folder}.html`);
    if (!res.ok) throw new Error('Module HTML not found');
    const html = await res.text();
    container.innerHTML = html;
    
    // Ensure the section becomes visible
    const secElement = getEl(`sec-${section}`);
    if (secElement) {
      secElement.style.display = 'flex';
      secElement.classList.add("active");
    }

  } catch (err) {
    console.error(err);
    container.innerHTML = `<div class="a-empty" style="padding:40px;"><i class="bi bi-exclamation-triangle-fill" style="color:var(--danger);font-size:24px;display:block;margin-bottom:10px;"></i> Gagal memuat modul ${folder}</div>`;
  }

  // Load data logic after DOM is injected
  if (section === "overview") await loadStats();
  if (section === "users") await loadUsers();
  if (section === "tasks") await loadTasks();
  if (section === "activity") await loadActivities();
  if (section === "progress" && typeof loadProgressSection === "function") {
    loadProgressSection();
  }
  if (section === "house-rules" && typeof loadHouseRules === "function") {
    loadHouseRules();
  }
  if (section === "duty" && typeof loadDutySchedules === "function") {
    loadDutySchedules();
  }
  if (section === "calendar" && typeof loadSchedules === "function") {
    loadSchedules();
  }
}

// ── Theme ─────────────────────────────────────────────────────────────────────
function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("tf_theme", next);
  updateThemeIcon(next);
}
function updateThemeIcon(theme) {
  const icon = getEl("themeIcon");
  if (icon)
    icon.className =
      theme === "dark" ? "bi bi-sun-fill" : "bi bi-moon-stars-fill";
}

// ── Sidebar toggle (mobile) ───────────────────────────────────────────────────
function toggleSidebar() {
  const sidebar = getEl("aSidebar");
  if (sidebar) sidebar.classList.toggle("open");
}

// ── Logout ────────────────────────────────────────────────────────────────────
function doLogout() {
  sessionStorage.removeItem("tf_token");
  window.location.href = "/login.html";
}

// ── Stats ─────────────────────────────────────────────────────────────────────
async function loadStats(nocache = false) {
  const url = nocache ? "/api/admin/stats?nocache=1" : "/api/admin/stats";
  const res = await adminFetch(url);
  if (!res) return;
  const { data } = await res.json();
  const elUsers = getEl("s-users");
  if (elUsers) elUsers.textContent = data.totalUsers;
  
  const elTasks = getEl("s-tasks");
  if (elTasks) elTasks.textContent = data.totalTasks;
  
  const elDone = getEl("s-done");
  if (elDone) elDone.textContent = data.doneTasks;
  
  const elPending = getEl("s-pending");
  if (elPending) elPending.textContent = data.pendingTasks;
  
  const elActive = getEl("s-active");
  if (elActive) elActive.textContent = data.mostActiveUser;
  
  // Update sidebar badges globally
  updateSidebarBadge("navUserCount", data.totalUsers);
  updateSidebarBadge("navTaskCount", data.pendingTasks);
  updateSidebarBadge("navActivityCount", data.totalActivities);
}

function updateSidebarBadge(id, count) {
  const badge = getEl(id);
  if (!badge) return;
  if (count && count > 0) {
    badge.textContent = count;
    badge.style.display = 'inline-block';
  } else {
    badge.style.display = 'none';
  }
}

// ── Users ─────────────────────────────────────────────────────────────────────
async function loadUsers() {
  const res = await adminFetch("/api/admin/users");
  if (!res) return;
  const { data } = await res.json();
  allUsers = data;
  renderUsers(allUsers);
}

function renderUsers(users) {
  const tbody = getEl("usersTableBody");
  if (!tbody) return;
  if (!users.length) {
    tbody.innerHTML =
      '<tr><td colspan="6" class="a-empty">Belum ada user terdaftar</td></tr>';
    return;
  }
  tbody.innerHTML = users
    .map(
      (u) => `
    <tr>
      <td>
        <div class="a-user-cell">
          <div class="a-cell-avatar">${u.username.charAt(0).toUpperCase()}</div>
          <div><div class="a-cell-name">${esc(u.username)}</div></div>
        </div>
      </td>
      <td><span class="a-cell-email">${esc(u.email)}</span></td>
      <td><span class="a-role-badge ${u.role}"><i class="bi bi-${u.role === "admin" ? "shield-fill-check" : "person-fill"}"></i>${u.role}</span></td>
      <td><strong style="color:var(--at-1)">${u.taskCount}</strong> <span style="color:var(--at-3);font-size:11px">(${u.doneCount} selesai)</span></td>
      <td style="color:var(--at-3);font-size:12px">${formatDate(u.created_at)}</td>
      <td>
        <div class="a-action-btns">
          <button class="a-tbl-btn edit" onclick="openRoleModal('${u.id}','${esc(u.username)}')" title="Ubah role"><i class="bi bi-shield-lock-fill"></i></button>
          <button class="a-tbl-btn del"  onclick="openDeleteModal('user','${u.id}','Hapus akun <strong>${esc(u.username)}</strong>? Semua data user akan hilang.')" title="Hapus user"><i class="bi bi-trash3-fill"></i></button>
        </div>
      </td>
    </tr>`,
    )
    .join("");
}

function filterUsers() {
  const q = getValue("userSearch").toLowerCase();
  renderUsers(
    allUsers.filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q),
    ),
  );
}

// ── Tasks ─────────────────────────────────────────────────────────────────────
async function loadTasks() {
  const res = await adminFetch("/api/admin/tasks");
  if (!res) return;
  const { data } = await res.json();
  allTasks = data;
  renderTasks(allTasks);
}

function renderTasks(tasks) {
  const tbody = getEl("tasksTableBody");
  if (!tbody) return;
  if (!tasks.length) {
    tbody.innerHTML =
      '<tr><td colspan="6" class="a-empty">Tidak ada task</td></tr>';
    return;
  }
  tbody.innerHTML = tasks
    .map(
      (t) => `
    <tr>
      <td style="font-weight:600;color:var(--at-1);max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(t.title)}</td>
      <td>
        <div class="a-user-cell">
          <div class="a-cell-avatar" style="width:26px;height:26px;font-size:11px">${(t.username || "?").charAt(0).toUpperCase()}</div>
          <span style="font-size:12px">${esc(t.username || "Unknown")}</span>
        </div>
      </td>
      <td><span class="a-cat-badge cat-${t.category}">${t.category || "-"}</span></td>
      <td><span class="a-status-badge ${t.status}">${t.status === "selesai" ? "✓ Selesai" : t.status === "selesai_terlambat" ? "⚠️ Selesai (Telat)" : "⏳ Pending"}</span></td>
      <td style="font-size:12px;color:var(--at-3)">${t.deadline ? formatDate(t.deadline) : "-"}</td>
      <td>
        <button class="a-tbl-btn del" onclick="openDeleteModal('task','${t.id}','Hapus task <strong>${esc(t.title)}</strong>?')" title="Hapus task">
          <i class="bi bi-trash3-fill"></i>
        </button>
      </td>
    </tr>`,
    )
    .join("");
}

function filterTasks() {
  const cat = getValue("filterCategory");
  const status = getValue("filterStatus");
  const q = getValue("taskSearch").toLowerCase();
  let filtered = allTasks;
  if (cat !== "all") filtered = filtered.filter((t) => t.category === cat);
  if (status !== "all") filtered = filtered.filter((t) => t.status === status);
  if (q)
    filtered = filtered.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.username || "").toLowerCase().includes(q),
    );
  renderTasks(filtered);
}

// ── Activity Log ──────────────────────────────────────────────────────────────
let activityPage = 1;
const activityLimit = 20;
let hasMoreActivity = true;
let isLoadingActivity = false;

async function loadActivities(reset = true) {
  if (reset) {
    activityPage = 1;
    allActivity = [];
    hasMoreActivity = true;
    const tbody = getEl("activityTableBody");
    if (tbody) {
      // Skeleton loader
      tbody.innerHTML = Array(5).fill('<tr><td colspan="5"><div class="skeleton" style="height:20px;width:100%;border-radius:4px;"></div></td></tr>').join('');
    }
  }

  if (!hasMoreActivity || isLoadingActivity) return;
  isLoadingActivity = true;

  const res = await adminFetch(`/api/admin/activity?page=${activityPage}&limit=${activityLimit}`);
  if (!res) { isLoadingActivity = false; return; }
  const { data, meta } = await res.json();

  if (reset) allActivity = data;
  else allActivity = [...allActivity, ...data];

  activityPage++;
  if (meta && activityPage > meta.totalPages) hasMoreActivity = false;
  if (!meta && data.length < activityLimit) hasMoreActivity = false;

  filterActivity();
  if (getEl("recentActivityBody")) {
    renderActivity(allActivity.slice(0, 10), "recentActivityBody");
  }

  isLoadingActivity = false;
}

function renderActivity(logs, targetId) {
  const tbody = getEl(targetId);
  if (!tbody) return;
  
  if (!logs.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="a-empty">Belum ada aktivitas</td></tr>`;
    return;
  }
  
  tbody.innerHTML = logs
    .map(
      (l) => `
    <tr>
      <td>
        <div class="a-user-cell">
          <div class="a-cell-avatar" style="width:26px;height:26px;font-size:11px">${(l.username || "?").charAt(0).toUpperCase()}</div>
          <span style="font-size:12px;font-weight:600;color:var(--at-1)">${esc(l.username)}</span>
        </div>
      </td>
      <td><span class="a-action-badge act-${l.action}">${actionLabel(l.action)}</span></td>
      <td style="font-size:12px;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(l.task_title || "-")}</td>
      <td>${l.category ? `<span class="a-cat-badge cat-${l.category}">${l.category}</span>` : "-"}</td>
      <td style="font-size:11px;color:var(--at-3);white-space:nowrap">${timeAgo(l.timestamp)}</td>
    </tr>`,
    )
    .join("");

  // Add Load More button at the end if it's the main activity table
  if (targetId === "activityTableBody" && hasMoreActivity) {
    tbody.insertAdjacentHTML('beforeend', `
      <tr id="loadMoreRow">
        <td colspan="5" style="text-align:center; padding:16px;">
          <button class="a-btn" onclick="loadActivities(false)" style="padding:8px 16px;font-size:12px;">Load More</button>
        </td>
      </tr>
    `);
  }
}

function filterActivity() {
  const q = getValue("activitySearch").toLowerCase();
  if (!q && !allActivity.length) return;
  const filtered = allActivity.filter(
    (l) =>
      (l.username || "").toLowerCase().includes(q) ||
      actionLabel(l.action).toLowerCase().includes(q) ||
      (l.task_title || "").toLowerCase().includes(q),
  );
  renderActivity(filtered, "activityTableBody");
}

// Infinite scroll listener for activity log
window.addEventListener('scroll', () => {
  if (currentSection === "activity" && hasMoreActivity && !isLoadingActivity) {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
      loadActivities(false);
    }
  }
});

// ── Role Modal ────────────────────────────────────────────────────────────────
function openRoleModal(userId, username) {
  setText("roleModalUser", username);
  setValue("roleModalUserId", userId);
  const overlay = getEl("roleModalOverlay");
  if (overlay) overlay.classList.add("open");
}
function closeRoleModal() {
  const overlay = getEl("roleModalOverlay");
  if (overlay) overlay.classList.remove("open");
}
async function confirmRoleChange(role) {
  const userId = getValue("roleModalUserId");
  closeRoleModal();
  const res = await adminFetch(`/api/admin/users/${userId}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
  if (!res) return;
  const data = await res.json();
  if (data.success) {
    showToast(data.message, "success");
    await loadUsers();
    await loadStats();
  } else showToast(data.error || "Gagal mengubah role", "error");
}

// ── Delete Modal ──────────────────────────────────────────────────────────────
let _deleteType = null,
  _deleteId = null;
function openDeleteModal(type, id, desc) {
  _deleteType = type;
  _deleteId = id;
  const descEl = getEl("deleteModalDesc");
  if (descEl) descEl.innerHTML = desc;
  const overlay = getEl("deleteModalOverlay");
  if (overlay) overlay.classList.add("open");
  const confirmBtn = getEl("confirmDeleteBtn");
  if (confirmBtn) confirmBtn.onclick = executeDelete;
}
function closeDeleteModal() {
  const overlay = getEl("deleteModalOverlay");
  if (overlay) overlay.classList.remove("open");
  _deleteType = null;
  _deleteId = null;
}
async function executeDelete() {
  closeDeleteModal();
  const url =
    _deleteType === "user"
      ? `/api/admin/users/${_deleteId}`
      : `/api/admin/tasks/${_deleteId}`;
  const res = await adminFetch(url, { method: "DELETE" });
  if (!res) return;
  const data = await res.json();
  if (data.success) {
    showToast(data.message, "success");
    await loadAll();
  } else showToast(data.error || "Gagal menghapus", "error");
}

// ── First Admin Setup (no auth needed) ───────────────────────────────────────
// Called from console: promoteFirstAdmin('yourUsername')
window.promoteFirstAdmin = async (username) => {
  // This needs a temporary auth workaround - call without admin token
  const res = await fetch("/api/admin/promote-first", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ username }),
  });
  const data = await res.json();
  alert(data.message || data.error);
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function esc(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(str) {
  if (!str) return "-";
  try {
    return new Date(str).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return str;
  }
}

function timeAgo(str) {
  if (!str) return "-";
  try {
    const diff = Date.now() - new Date(str).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "Baru saja";
    if (m < 60) return `${m} menit lalu`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} jam lalu`;
    return `${Math.floor(h / 24)} hari lalu`;
  } catch {
    return str;
  }
}

const ACTION_LABELS = {
  CREATE_TASK: "➕ Buat Task",
  EDIT_TASK: "✏️ Edit Task",
  DELETE_TASK: "🗑️ Hapus Task",
  COMPLETE_TASK: "✅ Selesaikan",
  REOPEN_TASK: "🔄 Buka Kembali",
  DELETE_TASK_ADMIN: "🛡️ Hapus (Admin)",
};
function actionLabel(action) {
  return ACTION_LABELS[action] || action;
}

function showToast(msg, type = "info") {
  const icons = {
    success: "bi-check-circle-fill",
    error: "bi-x-circle-fill",
    info: "bi-info-circle-fill",
  };
  const toast = document.createElement("div");
  toast.className = `a-toast ${type}`;
  toast.innerHTML = `<i class="bi ${icons[type]}"></i><span>${msg}</span>`;
  const container = getEl("toastContainer");
  if (container) container.prepend(toast);
  setTimeout(() => toast.remove(), 3200);
}

// ══════════════════════════════════════════════════════════════
//  HOUSE RULES  —  Admin CRUD
// ══════════════════════════════════════════════════════════════
let allRules = [];
let editingRuleId = null;

// Extend sectionTitles
sectionTitles["house-rules"] = [
  "House Rules",
  "Kelola peraturan dan tata tertib hunian",
];
sectionTitles["duty"] = ["Jadwal Piket", "Atur jadwal piket anggota per hari"];

// Initial load for these sections will happen via showSection if navigated to

// ── Load & Render Rules ──────────────────────────────────────
async function loadHouseRules() {
  const container = getEl("rulesListContainer");
  if (container) {
    container.innerHTML =
      '<div class="hr-empty"><div class="a-spinner"></div></div>';
  }
  const res = await adminFetch("/api/community/house-rules");
  if (!res) return;
  const { data } = await res.json();
  allRules = data || [];
  const badge = getEl("navRulesCount");
  if (badge) badge.textContent = allRules.length;
  renderHouseRules();
}

function renderHouseRules() {
  const container = getEl("rulesListContainer");
  if (!container) return;
  if (!allRules.length) {
    container.innerHTML = `<div class="hr-empty"><i class="bi bi-journal-x"></i>Belum ada house rule. Tambahkan peraturan pertama!</div>`;
    return;
  }
  container.innerHTML = allRules
    .map(
      (r, i) => `
    <div class="hr-item" id="rule-${r.id}">
      <div class="hr-index">${i + 1}</div>
      <div class="hr-body">
        <div class="hr-title">${esc(r.title)}</div>
        <div class="hr-content">${esc(r.content)}</div>
        <div class="hr-meta">
          <i class="bi bi-person-fill"></i> ${esc(r.created_by_username)}
          &nbsp;·&nbsp; <i class="bi bi-clock"></i> ${formatDate(r.created_at)}
        </div>
      </div>
      <div class="hr-actions">
        <button class="a-tbl-btn edit" onclick="openRuleModal('${r.id}')" title="Edit"><i class="bi bi-pencil-fill"></i></button>
        <button class="a-tbl-btn del"  onclick="deleteRule('${r.id}','${esc(r.title)}')" title="Hapus"><i class="bi bi-trash3-fill"></i></button>
      </div>
    </div>`,
    )
    .join("");
}

// ── Rule Modal ───────────────────────────────────────────────
function openRuleModal(id) {
  editingRuleId = id || null;
  setText("ruleModalTitle", id ? "Edit House Rule" : "Tambah House Rule");
  setText("ruleTitleErr", "");
  setText("ruleContentErr", "");
  if (id) {
    const r = allRules.find((x) => x.id === id);
    if (r) {
      setValue("ruleTitle", r.title);
      setValue("ruleContent", r.content);
    }
  } else {
      setValue("ruleTitle", "");
      setValue("ruleContent", "");
  }
  setValue("editingRuleId", id || "");
  const overlay = getEl("ruleModalOverlay");
  if (overlay) overlay.classList.add("open");
  getEl("ruleTitle")?.focus();
}
function closeRuleModal() {
  const overlay = getEl("ruleModalOverlay");
  if (overlay) overlay.classList.remove("open");
  editingRuleId = null;
}

async function saveRule() {
  const title = getValue("ruleTitle").trim();
  const content = getValue("ruleContent").trim();
  let ok = true;
  if (!title) {
    setText("ruleTitleErr", "Judul wajib diisi.");
    ok = false;
  } else setText("ruleTitleErr", "");
  if (!content) {
    setText("ruleContentErr", "Isi wajib diisi.");
    ok = false;
  } else setText("ruleContentErr", "");
  if (!ok) return;

  const btn = getEl("btnSaveRule");
  if (btn) btn.disabled = true;
  const id = getValue("editingRuleId");
  const method = id ? "PUT" : "POST";
  const url = id
    ? `/api/community/house-rules/${id}`
    : "/api/community/house-rules";
  const res = await adminFetch(url, {
    method,
    body: JSON.stringify({ title, content }),
  });
  btn.disabled = false;
  if (!res) return;
  const data = await res.json();
  if (data.success) {
    showToast(
      id ? "House rule diperbarui!" : "House rule ditambahkan!",
      "success",
    );
    closeRuleModal();
    await loadHouseRules();
  } else {
    showToast(data.error || "Gagal menyimpan", "error");
  }
}

async function deleteRule(id, title) {
  openDeleteModal(
    "house-rule",
    id,
    `Hapus rule <strong>${esc(title)}</strong>?`,
  );
  const confirmBtn = getEl("confirmDeleteBtn");
  if (confirmBtn) {
    confirmBtn.onclick = async () => {
      closeDeleteModal();
      const res = await adminFetch(`/api/community/house-rules/${id}`, {
        method: "DELETE",
      });
      if (!res) return;
      const data = await res.json();
      if (data.success) {
        showToast("Rule dihapus!", "success");
        await loadHouseRules();
      } else showToast(data.error || "Gagal hapus", "error");
    };
  }
}

// ══════════════════════════════════════════════════════════════
//  JADWAL PIKET  —  Admin CRUD
// ══════════════════════════════════════════════════════════════
const DAYS_ORDER = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat Ganjil', 'Sabtu Ganjil', 'Jumat Genap', 'Sabtu Genap'];
let dutyData = {};
let editingDutyId = null;

// ── Load & Render ────────────────────────────────────────────
async function loadDutySchedules() {
  const container = getEl("dutyScheduleContainer");
  if (container) {
    container.innerHTML =
      '<div style="padding:40px;text-align:center"><div class="a-spinner"></div></div>';
  }
  const res = await adminFetch("/api/community/duty-schedules");
  if (!res) return;
  const json = await res.json();
  dutyData = json.data || {};
  renderDutySchedules();
}

function renderDutySchedules() {
  const container = getEl("dutyScheduleContainer");
  if (!container) return;
  const dayIcons = {
    "Senin": "💼", "Selasa": "🚀", "Rabu": "🔥", "Kamis": "⚡",
    "Jumat Ganjil": "🌙", "Sabtu Ganjil": "🎉",
    "Jumat Genap": "⭐", "Sabtu Genap": "🎈"
  };

  const renderSection = (title, days) => {
    const cardsHtml = days.map((day) => {
      const members = dutyData[day] || [];
      const membersHTML = members.length
        ? members
            .map(
              (m) => `
            <div class="duty-member-row" id="dm-${m.id}">
              <div class="duty-member-avatar">${m.member_name.charAt(0).toUpperCase()}</div>
              <span class="duty-member-name">${esc(m.member_name)}</span>
              <div class="duty-member-actions">
                <button class="a-tbl-btn edit" onclick="openDutyEditModal('${m.id}','${day}','${esc(m.member_name)}')" title="Edit"><i class="bi bi-pencil-fill"></i></button>
                <button class="a-tbl-btn del"  onclick="deleteDutyEntry('${m.id}','${day}','${esc(m.member_name)}')" title="Hapus"><i class="bi bi-trash3-fill"></i></button>
              </div>
            </div>`,
            )
            .join("")
        : '<div style="font-size:12px;color:var(--at-3);padding:8px 6px;text-align:center">Belum ada anggota</div>';

      return `
        <div class="duty-day-card">
          <div class="duty-day-header">
            <div class="duty-day-name">${dayIcons[day] || "📅"} ${day}</div>
            <span class="duty-day-count">${members.length} anggota</span>
          </div>
          <div class="duty-members" id="dm-list-${day}">${membersHTML}</div>
          <div class="duty-add-row">
            <input type="text" class="duty-add-input" id="dutyInline-${day}"
              placeholder="+ Nama anggota..." maxlength="80"
              onkeydown="if(event.key==='Enter') quickAddDuty('${day}')"/>
            <button class="duty-add-btn" onclick="quickAddDuty('${day}')" title="Tambah"><i class="bi bi-plus-lg"></i></button>
          </div>
        </div>`;
    }).join("");

    return `
      <div style="margin-bottom: 24px;">
        <h4 style="color:var(--at-2); margin-bottom: 12px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">${title}</h4>
        <div class="duty-grid">${cardsHtml}</div>
      </div>
    `;
  };

  container.innerHTML = 
    renderSection("Piket Hari Biasa", ["Senin", "Selasa", "Rabu", "Kamis"]) +
    renderSection("Piket Ganjil", ["Jumat Ganjil", "Sabtu Ganjil"]) +
    renderSection("Piket Genap", ["Jumat Genap", "Sabtu Genap"]);
}

// Quick inline add
async function quickAddDuty(day) {
  const input = getEl(`dutyInline-${day}`);
  if (!input) return;
  const name = input.value.trim();
  if (!name) {
    input.focus();
    return;
  }
  input.disabled = true;
  const res = await adminFetch("/api/community/duty-schedules", {
    method: "POST",
    body: JSON.stringify({ day, member_name: name }),
  });
  input.disabled = false;
  if (!res) return;
  const data = await res.json();
  if (data.success) {
    input.value = "";
    showToast(`${name} ditambahkan ke ${day}`, "success");
    await loadDutySchedules();
  } else {
    showToast(data.error || "Gagal menambahkan", "error");
    input.focus();
  }
}

// ── Duty Modal (for modal-based add) ────────────────────────
function openDutyModal() {
  editingDutyId = null;
  setText("dutyModalTitle", "Tambah Jadwal Piket");
  setValue("dutyDay", "");
  setValue("dutyMember", "");
  const dutyDay = getEl("dutyDay");
  if (dutyDay) dutyDay.disabled = false;
  setText("dutyDayErr", "");
  setText("dutyMemberErr", "");
  setValue("editingDutyId", "");
  const overlay = getEl("dutyModalOverlay");
  if (overlay) overlay.classList.add("open");
}
function openDutyEditModal(id, day, name) {
  editingDutyId = id;
  setText("dutyModalTitle", "Edit Jadwal Piket");
  setValue("dutyDay", day);
  const dutyDay = getEl("dutyDay");
  if (dutyDay) dutyDay.disabled = false;
  setValue("dutyMember", name);
  setText("dutyDayErr", "");
  setText("dutyMemberErr", "");
  setValue("editingDutyId", id);
  const overlay = getEl("dutyModalOverlay");
  if (overlay) overlay.classList.add("open");
}
function closeDutyModal() {
  const overlay = getEl("dutyModalOverlay");
  if (overlay) overlay.classList.remove("open");
  editingDutyId = null;
}

async function saveDuty() {
  const day = getValue("dutyDay");
  const name = getValue("dutyMember").trim();
  let ok = true;
  if (!day) {
    setText("dutyDayErr", "Pilih hari.");
    ok = false;
  } else setText("dutyDayErr", "");
  if (!name) {
    setText("dutyMemberErr", "Nama wajib diisi.");
    ok = false;
  } else setText("dutyMemberErr", "");
  if (!ok) return;

  const btn = getEl("btnSaveDuty");
  if (btn) btn.disabled = true;
  const id = getValue("editingDutyId");
  const method = id ? "PUT" : "POST";
  const url = id
    ? `/api/community/duty-schedules/${id}`
    : "/api/community/duty-schedules";
  const res = await adminFetch(url, {
    method,
    body: JSON.stringify({ day, member_name: name }),
  });
  btn.disabled = false;
  if (!res) return;
  const data = await res.json();
  if (data.success) {
    showToast(id ? "Jadwal diperbarui!" : "Anggota ditambahkan!", "success");
    closeDutyModal();
    await loadDutySchedules();
  } else {
    showToast(data.error || "Gagal menyimpan", "error");
  }
}

async function deleteDutyEntry(id, day, name) {
  openDeleteModal(
    "duty",
    id,
    `Hapus <strong>${esc(name)}</strong> dari hari <strong>${day}</strong>?`,
  );
  const confirmBtn = getEl("confirmDeleteBtn");
  if (confirmBtn) {
    confirmBtn.onclick = async () => {
      closeDeleteModal();
      const res = await adminFetch(`/api/community/duty-schedules/${id}`, {
        method: "DELETE",
      });
      if (!res) return;
      const data = await res.json();
      if (data.success) {
        showToast("Anggota dihapus!", "success");
        await loadDutySchedules();
      } else showToast(data.error || "Gagal hapus", "error");
    };
  }
}

// ══════════════════════════════════════════════════════════════
//  CALENDAR SCHEDULE
// ══════════════════════════════════════════════════════════════
let allSchedules = [];
let editingScheduleId = null;

async function loadSchedules() {
  const grid = getEl("adminCalendarGrid");
  if (grid) grid.innerHTML = '<div class="a-empty"><div class="a-spinner"></div></div>';
  const res = await adminFetch("/api/community/schedules");
  if (!res) return;
  const json = await res.json();
  allSchedules = json.data || [];
  renderSchedules();
}

let currentMonthAdmin = new Date().getMonth();
let currentYearAdmin = new Date().getFullYear();

function prevMonthAdmin() {
  currentMonthAdmin--;
  if (currentMonthAdmin < 0) {
    currentMonthAdmin = 11;
    currentYearAdmin--;
  }
  renderSchedules();
}

function nextMonthAdmin() {
  currentMonthAdmin++;
  if (currentMonthAdmin > 11) {
    currentMonthAdmin = 0;
    currentYearAdmin++;
  }
  renderSchedules();
}

function renderSchedules() {
  const grid = getEl("adminCalendarGrid");
  if (!grid) return;
  const title = getEl("adminCalendarTitle");
  
  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  if (title) title.textContent = `${monthNames[currentMonthAdmin]} ${currentYearAdmin}`;

  grid.innerHTML = `
    <div class="fc-day-head">Senin</div>
    <div class="fc-day-head">Selasa</div>
    <div class="fc-day-head">Rabu</div>
    <div class="fc-day-head">Kamis</div>
    <div class="fc-day-head">Jumat</div>
    <div class="fc-day-head">Sabtu</div>
    <div class="fc-day-head">Minggu</div>
  `;

  const firstDay = new Date(currentYearAdmin, currentMonthAdmin, 1).getDay();
  const daysInMonth = new Date(currentYearAdmin, currentMonthAdmin + 1, 0).getDate();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1; // Make Monday = 0
  
  const today = new Date();
  
  for (let i = 0; i < startOffset; i++) {
    grid.innerHTML += `<div class="fc-day-cell other-month"></div>`;
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = day === today.getDate() && currentMonthAdmin === today.getMonth() && currentYearAdmin === today.getFullYear();
    const dateStr = `${currentYearAdmin}-${String(currentMonthAdmin+1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    const dayEvents = allSchedules.filter(s => s.date === dateStr);
    const eventsHtml = dayEvents.map(s => 
      `<div class="fc-event-pill" onclick="event.stopPropagation(); openScheduleModal('${s.id}')" title="${esc(s.title)}\nOleh: ${esc(s.created_by_username)}">
        ${s.time} ${esc(s.title)}
      </div>`
    ).join('');

    grid.innerHTML += `
      <div class="fc-day-cell ${isToday ? 'today' : ''}" onclick="openScheduleModal(null, '${dateStr}')">
        <div class="fc-day-num">${day}</div>
        <div class="fc-events">${eventsHtml}</div>
      </div>
    `;
  }
}

function openScheduleModal(id = null, selectedDate = null) {
  editingScheduleId = id;
  setText("scheduleModalTitle", id ? "Edit Schedule" : "Tambah Schedule");
  setText("scheduleTitleErr", "");
  setText("scheduleDateErr", "");
  setText("scheduleTimeErr", "");
  
  if (id) {
    const s = allSchedules.find(x => x.id === id);
    if (s) {
      setValue("scheduleTitle", s.title);
      setValue("scheduleDesc", s.description || "");
      setValue("scheduleDate", s.date);
      setValue("scheduleTime", s.time);
      
      // Also show delete button dynamically inside modal if edit mode
      let btnDel = getEl("btnDeleteScheduleInside");
      if (!btnDel) {
        btnDel = document.createElement("button");
        btnDel.type = "button";
        btnDel.id = "btnDeleteScheduleInside";
        btnDel.className = "a-btn-secondary";
        btnDel.style.marginRight = "auto";
        btnDel.innerHTML = '<i class="bi bi-trash3-fill" style="color:var(--danger)"></i> Hapus';
        document.querySelector("#scheduleModalOverlay .a-modal-actions")?.prepend(btnDel);
      }
      if (btnDel) {
        btnDel.style.display = "flex";
        btnDel.onclick = () => { closeScheduleModal(); deleteSchedule(id, s.title); };
      }
    }
  } else {
    setValue("scheduleTitle", "");
    setValue("scheduleDesc", "");
    setValue("scheduleDate", selectedDate || "");
    setValue("scheduleTime", "");
    
    const btnDel = getEl("btnDeleteScheduleInside");
    if (btnDel) btnDel.style.display = "none";
  }
  setValue("editingScheduleId", id || "");
  const overlay = getEl("scheduleModalOverlay");
  if (overlay) overlay.classList.add("open");
}

function closeScheduleModal() {
  const overlay = getEl("scheduleModalOverlay");
  if (overlay) overlay.classList.remove("open");
  editingScheduleId = null;
}

async function saveSchedule() {
  const title = getValue("scheduleTitle").trim();
  const desc = getValue("scheduleDesc").trim();
  const date = getValue("scheduleDate");
  const time = getValue("scheduleTime");
  
  let ok = true;
  if (!title) { setText("scheduleTitleErr", "Wajib diisi"); ok = false; }
  else setText("scheduleTitleErr", "");
  if (!date) { setText("scheduleDateErr", "Wajib diisi"); ok = false; }
  else setText("scheduleDateErr", "");
  if (!time) { setText("scheduleTimeErr", "Wajib diisi"); ok = false; }
  else setText("scheduleTimeErr", "");
  
  if (!ok) return;

  const btn = getEl("btnSaveSchedule");
  if (btn) btn.disabled = true;
  const id = getValue("editingScheduleId");
  const method = id ? "PUT" : "POST";
  const url = id ? `/api/community/schedules/${id}` : "/api/community/schedules";
  
  const res = await adminFetch(url, {
    method,
    body: JSON.stringify({ title, description: desc, date, time })
  });
  
  if (btn) btn.disabled = false;
  if (!res) return;
  const data = await res.json();
  if (data.success) {
    showToast(id ? "Schedule diperbarui!" : "Schedule ditambahkan!", "success");
    closeScheduleModal();
    await loadSchedules();
  } else {
    showToast(data.error || "Gagal menyimpan", "error");
  }
}

async function deleteSchedule(id, title) {
  openDeleteModal("schedule", id, `Hapus agenda <strong>${esc(title)}</strong>?`);
  const confirmBtn = getEl("confirmDeleteBtn");
  if (confirmBtn) {
    confirmBtn.onclick = async () => {
      closeDeleteModal();
      const res = await adminFetch(`/api/community/schedules/${id}`, { method: "DELETE" });
      if (!res) return;
      const data = await res.json();
      if (data.success) {
        showToast("Schedule dihapus!", "success");
        await loadSchedules();
      } else showToast(data.error || "Gagal hapus", "error");
    };
  }
}
