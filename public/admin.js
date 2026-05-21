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
let allProjects = [];
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
  if (section === "projects") await loadProjects();
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

    socket.on("diary_created", ({ diary, log }) => {
      allTasks.unshift(diary);
      if (log) allActivity.unshift(log);
      if (typeof filterDiaries === "function") filterDiaries();
      filterActivity();
      loadStats(true);
      showToast(
        `Aktivitas Baru: Diary "${diary.title}" ditulis oleh ${diary.username}`,
        "info"
      );
    });

    socket.on("diary_updated", ({ diary, log }) => {
      const idx = allTasks.findIndex((t) => t.id === diary.id);
      if (idx !== -1) allTasks[idx] = diary;
      if (log) allActivity.unshift(log);
      if (typeof filterDiaries === "function") filterDiaries();
      filterActivity();
      loadStats(true);
    });

    socket.on("diary_deleted", ({ diaryId, log }) => {
      allTasks = allTasks.filter((t) => t.id !== diaryId);
      if (log) allActivity.unshift(log);
      if (typeof filterDiaries === "function") filterDiaries();
      filterActivity();
      loadStats(true);
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
  if (currentSection === "projects") await loadProjects();
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
  projects: ["Manajemen Proyek", "Kelola proyek aktif, leader, mentee, dan timeline"],
  tasks: ["Diary & Aktivitas", "Lihat dan kelola diary/aktivitas harian pengguna"],
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
  if (section === "projects") await loadProjects();
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
  window.dispatchEvent(new CustomEvent('themechanged', { detail: { theme: next } }));
}
function updateThemeIcon(theme) {
  const icon = getEl("themeIcon");
  if (icon)
    icon.className =
      theme === "dark" ? "bi bi-moon-stars-fill" : "bi bi-sun-fill";
}

// ── Sidebar toggle (mobile) ───────────────────────────────────────────────────
function toggleSidebar() {
  const sidebar = getEl("aSidebar");
  const overlay = getEl("aOverlay");
  if (sidebar) sidebar.classList.toggle("open");
  if (overlay) overlay.classList.toggle("show");
}

document.addEventListener("DOMContentLoaded", () => {
  const overlay = getEl("aOverlay");
  if (overlay) overlay.addEventListener("click", () => {
    const sidebar = getEl("aSidebar");
    if (sidebar) sidebar.classList.remove("open");
    overlay.classList.remove("show");
  });
});

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
  if (elTasks) elTasks.textContent = data.totalDiaries;
  
  const elActive = getEl("s-active");
  if (elActive) elActive.textContent = data.mostActiveUser;
  
  // Update sidebar badges globally
  updateSidebarBadge("navUserCount", data.totalUsers);
  updateSidebarBadge("navTaskCount", data.totalDiaries);
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
  const [resDiaries, resProjects, resUsers] = await Promise.all([
    adminFetch("/api/admin/diaries"),
    adminFetch("/api/admin/projects"),
    adminFetch("/api/admin/users")
  ]);
  if (!resDiaries || !resProjects || !resUsers) return;
  const jsonDiaries = await resDiaries.json();
  const jsonProjects = await resProjects.json();
  const jsonUsers = await resUsers.json();
  
  allTasks = jsonDiaries.data || [];
  const projects = jsonProjects.data || [];
  const users = jsonUsers.data || [];
  
  const projSelect = getEl("filterProject");
  if (projSelect) {
    projSelect.innerHTML = '<option value="all">Semua Proyek</option>' +
      projects.map(p => `<option value="${p.id}">${esc(p.project_name)}</option>`).join('');
  }
  
  const userSelect = getEl("filterUser");
  if (userSelect) {
    userSelect.innerHTML = '<option value="all">Semua Anggota</option>' +
      users.map(u => `<option value="${u.id}">${esc(u.username)}</option>`).join('');
  }
  
  renderTasks(allTasks);
}

function renderTasks(diaries) {
  const tbody = getEl("tasksTableBody");
  if (!tbody) return;
  if (!diaries.length) {
    tbody.innerHTML =
      '<tr><td colspan="6" class="a-empty">Belum ada catatan diary</td></tr>';
    return;
  }
  tbody.innerHTML = diaries
    .map(
      (d) => `
    <tr>
      <td style="max-width:260px;">
        <div style="font-weight:600;color:var(--at-1);overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${esc(d.diary_title)}">${esc(d.diary_title)}</div>
        <div style="font-size:11px;color:var(--at-3);overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${esc(d.activity_description)}">${esc(d.activity_description || '-')}</div>
      </td>
      <td>
        <div class="a-user-cell">
          <div class="a-cell-avatar" style="width:26px;height:26px;font-size:11px">${(d.username || "?").charAt(0).toUpperCase()}</div>
          <span style="font-size:12px;font-weight:500;color:var(--at-1)">${esc(d.username || "Unknown")}</span>
        </div>
      </td>
      <td style="font-size:13px;color:var(--at-1)">${esc(d.project_name || "-")}</td>
      <td>
        <div style="display:flex; align-items:center; gap:8px;">
          <div style="flex:1; height:6px; background:rgba(255,255,255,0.06); border-radius:3px; overflow:hidden;">
            <div style="width:${d.work_progress || 0}%; height:100%; background:var(--accent);"></div>
          </div>
          <span style="font-size:11px; font-weight:600; color:var(--accent); min-width:32px; text-align:right;">${d.work_progress || 0}%</span>
        </div>
      </td>
      <td style="font-size:12px;color:var(--at-3);white-space:nowrap">${formatDate(d.created_at)}</td>
      <td>
        <button class="a-tbl-btn del" onclick="openDeleteModal('diary','${d.id}','Hapus diary <strong>${esc(d.diary_title)}</strong> oleh <strong>${esc(d.username)}</strong>?')" title="Hapus diary">
          <i class="bi bi-trash3-fill"></i>
        </button>
      </td>
    </tr>`,
    )
    .join("");
}

function filterDiaries() {
  const proj = getValue("filterProject");
  const user = getValue("filterUser");
  const month = getValue("filterMonth");
  const q = getValue("diarySearch").toLowerCase();
  
  let filtered = allTasks;
  if (proj && proj !== "all") filtered = filtered.filter(t => t.project_id === proj);
  if (user && user !== "all") filtered = filtered.filter(t => t.created_by === user);
  if (month) filtered = filtered.filter(t => t.created_at && t.created_at.startsWith(month));
  if (q) {
    filtered = filtered.filter(t =>
      (t.diary_title || "").toLowerCase().includes(q) ||
      (t.activity_description || "").toLowerCase().includes(q) ||
      (t.username || "").toLowerCase().includes(q)
    );
  }
  renderTasks(filtered);
}
window.filterDiaries = filterDiaries;

// ── Projects Management ────────────────────────────────────────────────────────
async function loadProjects() {
  const res = await adminFetch("/api/admin/projects");
  if (!res) return;
  const json = await res.json();
  allProjects = json.data || [];
  
  // Also fetch users to populate Mentor/Mentee selectors with active role limits
  const resUsers = await adminFetch("/api/admin/users");
  if (resUsers) {
    const jsonUsers = await resUsers.json();
    allUsers = jsonUsers.data || [];
  }

  renderProjects(allProjects);
}

function renderProjects(projects) {
  const tbody = getEl("projectsTableBody");
  if (!tbody) return;
  if (!projects.length) {
    tbody.innerHTML = '<tr><td colspan="7" class="a-empty">Belum ada proyek dibuat.</td></tr>';
    return;
  }
  
  tbody.innerHTML = projects.map(p => {
    const startStr = formatDate(p.start_date);
    const endStr = formatDate(p.end_date);
    const statusBadges = {
      ongoing: '<span class="a-cat-badge cat-piket-ganjil" style="background:#00bcd4;color:#fff;">Ongoing</span>',
      upcoming: '<span class="a-cat-badge cat-piket-genap" style="background:#ff9800;color:#fff;">Upcoming</span>',
      completed: '<span class="a-cat-badge cat-default" style="background:#4caf50;color:#fff;">Completed</span>'
    };
    const statusBadge = statusBadges[p.project_status] || p.project_status;
    
    const menteeNames = p.mentees && p.mentees.length 
      ? p.mentees.map(m => esc(m.username)).join(', ') 
      : '<span style="opacity:0.4;">Tidak ada mentee</span>';
      
    return `
      <tr>
        <td>
          <div style="font-weight:600; color:var(--text-1);">${esc(p.project_name)}</div>
          <div style="font-size:11px; opacity:0.6; max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${esc(p.description)}">${esc(p.description || '-')}</div>
        </td>
        <td>${statusBadge}</td>
        <td style="font-size:12px; white-space:nowrap;">
          <div>Mulai: <b>${startStr}</b></div>
          <div style="opacity:0.6; margin-top:2px;">Selesai: <b>${endStr}</b></div>
        </td>
        <td>
          <div class="a-user-cell">
            <div class="a-cell-avatar" style="width:26px; height:26px; font-size:11px; background:var(--accent); color:#fff;">
              ${(p.leader?.username || "?").charAt(0).toUpperCase()}
            </div>
            <span style="font-size:12px; font-weight:600; color:var(--text-1)">${esc(p.leader?.username || '-')}</span>
          </div>
        </td>
        <td style="font-size:12px; max-width:180px; overflow:hidden; text-overflow:ellipsis;" title="${menteeNames}">
          ${menteeNames}
        </td>
        <td>
          <strong style="color:var(--accent);">${p.diary_count || 0}</strong> diary
        </td>
        <td>
          <div class="a-action-btns" style="justify-content:center;">
            <button class="a-tbl-btn edit" onclick="openProjectTimeline('${p.id}', '${esc(p.project_name)}')" title="Lihat Timeline" style="background:rgba(76, 175, 80, 0.1); color:#4caf50;">
              <i class="bi bi-clock-history"></i>
            </button>
            <button class="a-tbl-btn edit" onclick="openEditProjectModal('${p.id}')" title="Edit Proyek">
              <i class="bi bi-pencil-fill"></i>
            </button>
            <button class="a-tbl-btn del" onclick="deleteProject('${p.id}', '${esc(p.project_name)}')" title="Hapus Proyek">
              <i class="bi bi-trash3-fill"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function filterProjects() {
  const q = getValue("projectSearch").toLowerCase();
  const filtered = allProjects.filter(p => p.project_name.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q));
  renderProjects(filtered);
}
window.filterProjects = filterProjects;

function renderMemberSelectors(currentProjectId = null) {
  const leaderSelect = getEl("projectFormLeader");
  if (leaderSelect) {
    leaderSelect.innerHTML = '<option value="">— Pilih Project Leader —</option>' +
      allUsers.map(u => {
        const activeAsLeader = (u.activeMemberships || []).find(m => m.role === 'leader' && m.projectId !== currentProjectId);
        
        let disabled = false;
        let labelText = `${esc(u.username)} (${u.email})`;
        if (activeAsLeader) { disabled = true; labelText += ' - [Active Leader]'; }
        
        return `<option value="${u.id}" ${disabled ? 'disabled' : ''}>${labelText}</option>`;
      }).join('');
  }
  
  const menteesContainer = getEl("projectFormMenteesContainer");
  if (menteesContainer) {
    menteesContainer.innerHTML = allUsers.map(u => {
      const activeAsLeader = (u.activeMemberships || []).find(m => m.role === 'leader' && m.projectId !== currentProjectId);
      const activeAsMenteeCount = (u.activeMemberships || []).filter(m => m.role === 'mentee' && m.projectId !== currentProjectId).length;
      
      let disabled = false;
      let badge = '<span style="font-size:10px; background:rgba(76,175,80,0.1); color:#4caf50; padding:2px 6px; border-radius:10px; margin-left:auto;">Available</span>';
      
      if (activeAsLeader) {
         disabled = true;
         badge = '<span style="font-size:10px; background:rgba(255,152,0,0.1); color:#ff9800; padding:2px 6px; border-radius:10px; margin-left:auto;">Active Leader</span>';
      } else if (activeAsMenteeCount >= 2) {
         disabled = true;
         badge = '<span style="font-size:10px; background:rgba(244,67,54,0.1); color:#f44336; padding:2px 6px; border-radius:10px; margin-left:auto;">Mentee Limit Reached</span>';
      }
      
      return `
      <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-1); cursor: ${disabled ? 'not-allowed' : 'pointer'}; padding: 4px 0; opacity: ${disabled ? '0.5' : '1'}; width: 100%;">
        <input type="checkbox" name="projectMentees" value="${u.id}" style="accent-color: var(--accent);" ${disabled ? 'disabled' : ''} />
        <span>${esc(u.username)} (${u.email})</span>
        ${badge}
      </label>
      `;
    }).join('');
  }
}

function openAddProjectModal() {
  getEl("projectForm").reset();
  setValue("projectFormId", "");
  setText("projectModalTitle", "Tambah Proyek");
  setValue("projectFormStatus", "ongoing");
  const errBox = getEl("projectFormError");
  if (errBox) { errBox.style.display = "none"; errBox.textContent = ""; }
  
  renderMemberSelectors(null);

  // Uncheck all mentees
  document.querySelectorAll('input[name="projectMentees"]').forEach(cb => cb.checked = false);

  const overlay = getEl("projectModalOverlay");
  if (overlay) overlay.classList.add("open");
}

function openEditProjectModal(id) {
  const p = allProjects.find(x => x.id === id);
  if (!p) return;
  
  setValue("projectFormId", p.id);
  setValue("projectFormName", p.project_name);
  setValue("projectFormDesc", p.description || "");
  setValue("projectFormStart", p.start_date.substring(0, 10));
  setValue("projectFormEnd", p.end_date.substring(0, 10));
  setValue("projectFormStatus", p.project_status);
  
  renderMemberSelectors(p.id);
  
  setValue("projectFormLeader", p.leader ? p.leader.id : "");
  
  const errBox = getEl("projectFormError");
  if (errBox) { errBox.style.display = "none"; errBox.textContent = ""; }

  // Check mentees
  const menteeIds = (p.mentees || []).map(m => m.id);
  document.querySelectorAll('input[name="projectMentees"]').forEach(cb => {
    cb.checked = menteeIds.includes(cb.value);
  });

  setText("projectModalTitle", "Edit Proyek");
  const overlay = getEl("projectModalOverlay");
  if (overlay) overlay.classList.add("open");
}

function closeProjectModal() {
  const overlay = getEl("projectModalOverlay");
  if (overlay) overlay.classList.remove("open");
}
window.closeProjectModal = closeProjectModal;
window.openAddProjectModal = openAddProjectModal;
window.openEditProjectModal = openEditProjectModal;

async function saveProject(event) {
  event.preventDefault();
  const id = getValue("projectFormId");
  const project_name = getValue("projectFormName").trim();
  const description = getValue("projectFormDesc").trim();
  const start_date = getValue("projectFormStart");
  const end_date = getValue("projectFormEnd");
  const project_status = getValue("projectFormStatus");
  const leader_id = getValue("projectFormLeader") || null;
  
  const mentee_ids = [];
  document.querySelectorAll('input[name="projectMentees"]:checked').forEach(cb => {
    mentee_ids.push(cb.value);
  });

  const errBox = getEl("projectFormError");
  if (errBox) { errBox.style.display = "none"; errBox.textContent = ""; }

  const method = id ? "PUT" : "POST";
  const url = id ? `/api/admin/projects/${id}` : "/api/admin/projects";

  const res = await adminFetch(url, {
    method,
    body: JSON.stringify({
      project_name,
      description,
      start_date,
      end_date,
      project_status,
      leader_id,
      mentee_ids
    })
  });

  if (!res) return;
  const json = await res.json();
  if (json.success) {
    showToast(id ? "Proyek diperbarui!" : "Proyek ditambahkan!", "success");
    closeProjectModal();
    await loadProjects();
    await loadStats(true);
  } else {
    if (errBox) {
      errBox.textContent = json.error || "Gagal menyimpan proyek";
      errBox.style.display = "block";
    } else {
      showToast(json.error || "Gagal menyimpan proyek", "error");
    }
  }
}
window.saveProject = saveProject;

async function deleteProject(id, name) {
  openDeleteModal("project", id, `Hapus proyek <strong>${esc(name)}</strong>? Semua log relasi member proyek akan dihapus.`);
  const confirmBtn = getEl("confirmDeleteBtn");
  if (confirmBtn) {
    confirmBtn.onclick = async () => {
      closeDeleteModal();
      const res = await adminFetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      if (!res) return;
      const json = await res.json();
      if (json.success) {
        showToast("Proyek berhasil dihapus!", "success");
        await loadProjects();
        await loadStats(true);
      } else {
        showToast(json.error || "Gagal menghapus proyek", "error");
      }
    };
  }
}
window.deleteProject = deleteProject;

async function openProjectTimeline(id, name) {
  setText("projectTimelineTitle", `Timeline Proyek: ${name}`);
  const container = getEl("projectTimelineLogs");
  if (container) container.innerHTML = '<div class="a-spinner" style="margin:20px auto;"></div>';
  
  const overlay = getEl("projectTimelineModalOverlay");
  if (overlay) overlay.classList.add("open");

  try {
    const res = await fetch(`/api/projects/${id}/timeline`, {
      headers: { "Authorization": `Bearer ${getToken()}` }
    });
    if (!res.ok) throw new Error("Gagal mengambil timeline");
    const json = await res.json();
    const diaries = json.data || [];
    
    if (container) {
      if (!diaries.length) {
        container.innerHTML = '<div style="text-align:center; padding:30px; opacity:0.5;">Belum ada aktivitas diary terhubung dengan proyek ini.</div>';
        return;
      }
      container.innerHTML = diaries.map(d => {
        const timeStr = formatDate(d.created_at);
        return `
          <div style="border-left: 2px solid var(--accent); padding-left: 16px; margin-bottom: 20px; position: relative;">
            <div style="position: absolute; left: -6px; top: 4px; width: 10px; height: 10px; border-radius: 50%; background: var(--accent);"></div>
            <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); padding: 12px; border-radius: 8px;">
              <div style="display:flex; justify-content:space-between; align-items:start; gap:8px;">
                <h4 style="margin:0; font-size:14px; color:var(--text-1); font-weight:600;">${esc(d.diary_title)}</h4>
                <span style="font-size:11px; opacity:0.5;">${timeStr}</span>
              </div>
              <p style="margin: 8px 0; font-size: 13px; line-height: 1.4; color: var(--text-2);">${esc(d.activity_description)}</p>
              <div style="display:flex; justify-content:space-between; font-size:11px; opacity:0.6; align-items:center;">
                <span>Oleh: <b>${esc(d.username)}</b></span>
                <span style="color:var(--accent); font-weight:600;">Progress: ${d.work_progress}%</span>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }
  } catch (err) {
    if (container) container.innerHTML = `<div style="color:var(--danger); text-align:center; padding:20px;">${err.message}</div>`;
  }
}
window.openProjectTimeline = openProjectTimeline;

function closeProjectTimelineModal() {
  const overlay = getEl("projectTimelineModalOverlay");
  if (overlay) overlay.classList.remove("open");
}
window.closeProjectTimelineModal = closeProjectTimelineModal;

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
      : _deleteType === "diary"
      ? `/api/admin/diaries/${_deleteId}`
      : _deleteType === "project"
      ? `/api/admin/projects/${_deleteId}`
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
  
  CREATE_DIARY: "➕ Tulis Diary",
  EDIT_DIARY: "✏️ Edit Diary",
  DELETE_DIARY: "🗑️ Hapus Diary",
  DELETE_DIARY_ADMIN: "🛡️ Hapus Diary (Admin)"
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
let allCategories = [];
let editingScheduleId = null;

// Helper: get category color class from category name
function getCategoryColorClass(categoryName) {
  const cat = allCategories.find(c => c.name === categoryName);
  if (!cat) return 'cat-daily';
  return `cat-${cat.color}`;
}

// Helper: get category color label
function getCategoryColorLabel(color) {
  const labels = { blue: 'Blue', green: 'Green', orange: 'Orange', purple: 'Purple', cyan: 'Cyan', red: 'Red' };
  return labels[color] || color;
}

async function loadCategories() {
  const res = await adminFetch('/api/community/categories');
  if (!res) return;
  const json = await res.json();
  allCategories = json.data || [];
  populateCategorySelect();
}

function populateCategorySelect() {
  const select = getEl('scheduleCategory');
  if (!select) return;
  const currentVal = select.value;
  select.innerHTML = '<option value="">— Pilih Kategori —</option>';
  allCategories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat.name;
    opt.textContent = cat.name;
    select.appendChild(opt);
  });
  if (currentVal) select.value = currentVal;
}

async function loadSchedules() {
  const grid = getEl("adminCalendarGrid");
  if (grid) grid.innerHTML = '<div class="a-empty"><div class="a-spinner"></div></div>';
  await loadCategories();
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

  let html = `
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
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;

  const today = new Date();

  for (let i = 0; i < startOffset; i++) {
    html += `<div class="fc-day-cell other-month"></div>`;
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = day === today.getDate() && currentMonthAdmin === today.getMonth() && currentYearAdmin === today.getFullYear();
    const dateStr = `${currentYearAdmin}-${String(currentMonthAdmin + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    // Multi-day: show if dateStr is within [start_date, end_date]
    const dayEvents = allSchedules.filter(s => s.start_date <= dateStr && dateStr <= s.end_date);
    const eventsHtml = dayEvents.map(s => {
      const colorClass = getCategoryColorClass(s.category);
      const isStart = s.start_date === dateStr;
      const isEnd = s.end_date === dateStr;
      const pillStyle = isStart && !isEnd ? 'border-radius: 6px 0 0 6px; margin-right: -2px;' :
                        isEnd && !isStart ? 'border-radius: 0 6px 6px 0; margin-left: -2px;' :
                        !isStart && !isEnd ? 'border-radius: 0; margin-left: -2px; margin-right: -2px;' : '';
      return `<div class="fc-event-pill ${colorClass}" onclick="event.stopPropagation(); openScheduleModal('${s.id}')" title="${esc(s.title)}\nKategori: ${esc(s.category)}\nOleh: ${esc(s.created_by_username)}" style="${pillStyle}">
        <span class="a-cat-badge ${colorClass}" style="padding:1px 5px; font-size:9px; margin-right:3px;">${esc(s.category)}</span>${isStart ? esc(s.title) : ''}
      </div>`;
    }).join('');

    html += `
      <div class="fc-day-cell ${isToday ? 'today' : ''}" onclick="openScheduleModal(null, '${dateStr}')">
        <div class="fc-day-num">${day}</div>
        <div class="fc-events">${eventsHtml}</div>
      </div>
    `;
  }
  grid.innerHTML = html;
}

function openScheduleModal(id = null, selectedDate = null) {
  editingScheduleId = id;
  setText("scheduleModalTitle", id ? "Edit Schedule" : "Tambah Schedule");
  setText("scheduleTitleErr", "");
  setText("scheduleCategoryErr", "");
  setText("scheduleStartDateErr", "");
  setText("scheduleEndDateErr", "");

  // Ensure category select is populated
  populateCategorySelect();

  if (id) {
    const s = allSchedules.find(x => x.id === id);
    if (s) {
      setValue("scheduleTitle", s.title);
      setValue("scheduleDesc", s.description || "");
      setValue("scheduleCategory", s.category);
      setValue("scheduleStartDate", s.start_date);
      setValue("scheduleEndDate", s.end_date);

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
    setValue("scheduleCategory", "");
    setValue("scheduleStartDate", selectedDate || "");
    setValue("scheduleEndDate", selectedDate || "");

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
  const category = getValue("scheduleCategory");
  const start_date = getValue("scheduleStartDate");
  const end_date = getValue("scheduleEndDate");

  let ok = true;
  if (!title) { setText("scheduleTitleErr", "Wajib diisi"); ok = false; }
  else setText("scheduleTitleErr", "");
  if (!category) { setText("scheduleCategoryErr", "Pilih kategori terlebih dahulu"); ok = false; }
  else setText("scheduleCategoryErr", "");
  if (!start_date) { setText("scheduleStartDateErr", "Wajib diisi"); ok = false; }
  else setText("scheduleStartDateErr", "");
  if (!end_date) { setText("scheduleEndDateErr", "Wajib diisi"); ok = false; }
  else setText("scheduleEndDateErr", "");
  if (start_date && end_date && end_date < start_date) {
    setText("scheduleEndDateErr", "Tanggal selesai tidak boleh sebelum tanggal mulai");
    ok = false;
  }

  if (!ok) return;

  const btn = getEl("btnSaveSchedule");
  if (btn) btn.disabled = true;
  const id = getValue("editingScheduleId");
  const method = id ? "PUT" : "POST";
  const url = id ? `/api/community/schedules/${id}` : "/api/community/schedules";

  const res = await adminFetch(url, {
    method,
    body: JSON.stringify({ title, description: desc, category, start_date, end_date })
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

// ── Category Management ────────────────────────────────────────
let editingCategoryId = null;

function openCategoryModal() {
  const overlay = getEl("categoryModalOverlay");
  if (overlay) overlay.classList.add("open");
  cancelCategoryEdit();
  renderCategoryTable();
}

function closeCategoryModal() {
  const overlay = getEl("categoryModalOverlay");
  if (overlay) overlay.classList.remove("open");
  cancelCategoryEdit();
}

function cancelCategoryEdit() {
  editingCategoryId = null;
  setValue("categoryName", "");
  setValue("categoryColor", "blue");
  setValue("editingCategoryId", "");
  setText("categoryNameErr", "");
  setText("categoryFormTitle", "Tambah Kategori Baru");
  setText("categorySubmitText", "Tambah");
  const icon = getEl("categorySubmitIcon");
  if (icon) { icon.className = "bi bi-plus-lg"; }
  const cancelBtn = getEl("btnCancelCategoryEdit");
  if (cancelBtn) cancelBtn.style.display = "none";
}

function editCategory(id) {
  const cat = allCategories.find(c => c.id === id);
  if (!cat) return;
  editingCategoryId = id;
  setValue("categoryName", cat.name);
  setValue("categoryColor", cat.color);
  setValue("editingCategoryId", id);
  setText("categoryNameErr", "");
  setText("categoryFormTitle", `Edit Kategori: ${cat.name}`);
  setText("categorySubmitText", "Simpan");
  const icon = getEl("categorySubmitIcon");
  if (icon) { icon.className = "bi bi-floppy-fill"; }
  const cancelBtn = getEl("btnCancelCategoryEdit");
  if (cancelBtn) cancelBtn.style.display = "inline-flex";
}

async function saveCategory() {
  const name = getValue("categoryName").trim();
  const color = getValue("categoryColor");
  const id = getValue("editingCategoryId");

  if (!name) { setText("categoryNameErr", "Nama kategori wajib diisi"); return; }
  setText("categoryNameErr", "");

  const method = id ? "PUT" : "POST";
  const url = id ? `/api/community/categories/${id}` : "/api/community/categories";

  const res = await adminFetch(url, {
    method,
    body: JSON.stringify({ name, color })
  });
  if (!res) return;
  const data = await res.json();
  if (data.success) {
    showToast(id ? "Kategori diperbarui!" : "Kategori ditambahkan!", "success");
    cancelCategoryEdit();
    await loadCategories();
    renderCategoryTable();
    populateCategorySelect();
  } else {
    setText("categoryNameErr", data.error || "Gagal menyimpan");
  }
}

async function deleteCategoryConfirm(id, name) {
  openDeleteModal("category", id, `Hapus kategori <strong>${esc(name)}</strong>?`);
  const confirmBtn = getEl("confirmDeleteBtn");
  if (confirmBtn) {
    confirmBtn.onclick = async () => {
      closeDeleteModal();
      const res = await adminFetch(`/api/community/categories/${id}`, { method: "DELETE" });
      if (!res) return;
      const data = await res.json();
      if (data.success) {
        showToast("Kategori dihapus!", "success");
        await loadCategories();
        renderCategoryTable();
        populateCategorySelect();
      } else showToast(data.error || "Gagal hapus", "error");
    };
  }
}

function renderCategoryTable() {
  const tbody = getEl("categoryTableBody");
  if (!tbody) return;
  if (allCategories.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" style="text-align: center; color: var(--at-2); padding: 20px;">Belum ada kategori</td></tr>';
    return;
  }
  tbody.innerHTML = allCategories.map(cat => `
    <tr>
      <td><strong>${esc(cat.name)}</strong></td>
      <td><span class="a-cat-badge cat-${esc(cat.color)}">${getCategoryColorLabel(cat.color)}</span></td>
      <td style="text-align: right">
        <div style="display: inline-flex; gap: 6px;">
          <button class="a-icon-btn" onclick="editCategory('${cat.id}')" title="Edit Kategori" style="width: 30px; height: 30px; font-size: 13px;">
            <i class="bi bi-pencil-fill"></i>
          </button>
          <button class="a-icon-btn" onclick="deleteCategoryConfirm('${cat.id}', '${esc(cat.name)}')" title="Hapus Kategori" style="width: 30px; height: 30px; font-size: 13px; color: var(--danger);">
            <i class="bi bi-trash3-fill"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}



