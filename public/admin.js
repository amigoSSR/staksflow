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

  if (section === "users") await loadUsers();
  if (section === "projects") await loadProjects();
  if (section === "tasks") await loadTasks();
  if (section === "house-rules" && typeof loadHouseRules === "function") loadHouseRules();
  if (section === "duty" && typeof loadDutySchedules === "function") loadDutySchedules();
  if (section === "calendar" && typeof loadSchedules === "function") loadSchedules();
  if (section === "weekly-checkup") {
    // MPA: inject module HTML into #app-sections, then load data
    const container = getEl("app-sections");
    if (container && !getEl("sec-weekly-checkup")) {
      try {
        const modRes = await fetch("/src/modules/admin/weekly-checkup/weekly-checkup.html");
        if (modRes.ok) {
          container.innerHTML = await modRes.text();
        }
      } catch (_) { /* fallback: HTML already in DOM */ }
    }
    if (typeof loadWeeklyCheckup === "function") await loadWeeklyCheckup();
  }

  // ── Socket.io ───────────────────────────────────────────────────────────────
  if (typeof io !== "undefined") {
    const socket = io();

    socket.on("connect", () => {
      socket.emit("join_admin");
    });
socket.on("diary_created", ({ diary }) => {
  allTasks.unshift(diary);
  if (typeof filterDiaries === "function") filterDiaries();
  loadStats(true);
      showToast(
        `Aktivitas Baru: Diary "${diary.diary_title}" ditulis oleh ${diary.username}`,
        "info"
      );
    });

    socket.on("diary_updated", ({ diary }) => {
      const idx = allTasks.findIndex((t) => t.id === diary.id);
      if (idx !== -1) allTasks[idx] = diary;
      if (typeof filterDiaries === "function") filterDiaries();
      loadStats(true);
    });

    socket.on("diary_deleted", ({ diaryId }) => {
      allTasks = allTasks.filter((t) => t.id !== diaryId);
      if (typeof filterDiaries === "function") filterDiaries();
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
  if (currentSection === "weekly-checkup" && typeof loadWeeklyCheckup === "function") await loadWeeklyCheckup();
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
  if (section === "weekly-checkup" && typeof loadWeeklyCheckup === "function") await loadWeeklyCheckup();
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
  if (!sidebar) return;

  const isOpen = sidebar.classList.toggle("open");
  if (overlay) {
    if (isOpen) {
      overlay.classList.add("show");
      document.body.style.overflow = "hidden";
    } else {
      overlay.classList.remove("show");
      document.body.style.overflow = "";
    }
  }
}

function closeSidebar() {
  const sidebar = getEl("aSidebar");
  const overlay = getEl("aOverlay");
  if (sidebar) sidebar.classList.remove("open");
  if (overlay) overlay.classList.remove("show");
  document.body.style.overflow = "";
}

document.addEventListener("DOMContentLoaded", () => {
  const overlay = getEl("aOverlay");
  if (overlay) {
    overlay.addEventListener("click", closeSidebar);
  }
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

  // Also load weekly leaderboard if on overview
  if (currentSection === "overview") {
    loadWeeklyLeaderboard(nocache);
  }
}

async function loadWeeklyLeaderboard(nocache = false) {
  const tbody = getEl("weeklyLeaderboardBody");
  if (!tbody) return;
  
  const url = nocache ? "/api/admin/active-users-weekly?nocache=1" : "/api/admin/active-users-weekly";
  const res = await adminFetch(url);
  if (!res) return;
  const { data } = await res.json();
  
  if (!data || !data.length) {
    tbody.innerHTML = '<tr><td colspan="4" class="a-empty">Tidak ada aktivitas tercatat dalam 7 hari terakhir.</td></tr>';
    return;
  }
  
  const maxActivity = Math.max(...data.map(u => u.activityCount));
  
  tbody.innerHTML = data.map((u, index) => {
    const pct = maxActivity > 0 ? (u.activityCount / maxActivity) * 100 : 0;
    const rankIcon = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `<span style="opacity:0.5">${index + 1}</span>`;
    
    return `
      <tr>
        <td>
          <div class="a-user-cell">
            <div style="font-weight:700; color:var(--accent); min-width:24px; text-align:center;">${rankIcon}</div>
            <div class="a-cell-avatar" style="width:28px; height:28px; font-size:12px;">${u.username.charAt(0).toUpperCase()}</div>
            <div class="a-cell-name">${esc(u.username)}</div>
          </div>
        </td>
        <td><span class="a-status-badge pending" style="opacity:0.8; font-size:11px;">${esc(u.currentProject)}</span></td>
        <td style="text-align:center; font-weight:700; color:var(--at-1);">${u.activityCount}</td>
        <td>
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="flex:1; height:6px; background:rgba(255,255,255,0.06); border-radius:3px; overflow:hidden;">
              <div style="width:${pct}%; height:100%; background:linear-gradient(to right, var(--accent), var(--accent2));"></div>
            </div>
          </div>
        </td>
      </tr>
    `;
  }).join('');
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
  const filter = getValue('userProjectFilter') || 'all';
  const res = await adminFetch(`/api/admin/users?filter=${filter}`);
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
      (u) => {
        let projectsHtml = '<span class="a-status-badge pending" style="opacity:0.7">Belum Dipilih</span>';
        
        if (u.activeMemberships && u.activeMemberships.length > 0) {
          projectsHtml = u.activeMemberships.map(m => {
            let statusClass = 'pending';
            if (m.status === 'ongoing') statusClass = 'done';
            
            return `<div style="margin-bottom:4px;">
              <span class="a-role-badge ${m.role === 'leader' ? 'admin' : 'user'}" style="font-size:10px;padding:1px 6px;margin-right:4px;">${m.role.toUpperCase()}</span>
              <span class="a-status-badge ${statusClass}" title="Status: ${m.status}">${esc(m.projectName)}</span>
            </div>`;
          }).join('');
        }

        return `
    <tr>
      <td>
        <div class="a-user-cell">
          <div class="a-cell-avatar">${u.username.charAt(0).toUpperCase()}</div>
          <div><div class="a-cell-name">${esc(u.username)}</div></div>
        </div>
      </td>
      <td><span class="a-cell-email">${esc(u.email)}</span></td>
      <td><span class="a-role-badge ${u.role}"><i class="bi bi-${u.role === "admin" ? "shield-fill-check" : "person-fill"}"></i>${u.role}</span></td>
      <td>
        <div style="display:flex;flex-direction:column;gap:2px;">
          ${projectsHtml}
        </div>
      </td>
      <td style="color:var(--at-3);font-size:12px">${formatDate(u.created_at)}</td>
      <td>
        <div class="a-action-btns">
          <button class="a-tbl-btn edit" onclick="openRoleModal('${u.id}','${esc(u.username)}')" title="Ubah role"><i class="bi bi-shield-lock-fill"></i></button>
          <button class="a-tbl-btn del"  onclick="openDeleteModal('user','${u.id}','Hapus akun <strong>${esc(u.username)}</strong>? Semua data user akan hilang.')" title="Hapus user"><i class="bi bi-trash3-fill"></i></button>
        </div>
      </td>
    </tr>`;
      }
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
      '<option value="none">Independent Activities</option>' +
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
  if (proj && proj !== "all") {
    if (proj === "none") {
      filtered = filtered.filter(t => !t.project_id);
    } else {
      filtered = filtered.filter(t => t.project_id === proj);
    }
  }
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
          ${p.project_status === 'completed' && p.completed_at ? `<div style="color:#4caf50; margin-top:2px;">Selesai: <b>${formatDate(p.completed_at)}</b></div>` : ''}
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
            ${p.project_status !== 'completed' ? `
              <button class="a-tbl-btn edit" onclick="confirmProjectCompletionFromTable('${p.id}')" title="Selesaikan Proyek" style="background:rgba(76, 175, 80, 0.15); color:#4caf50;">
                <i class="bi bi-check-circle-fill"></i>
              </button>
            ` : ''}
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
  const selectedLeaderId = leaderSelect?.value || "";

  if (leaderSelect) {
    leaderSelect.innerHTML = '<option value="">— Pilih Project Leader —</option>' +
      allUsers.map(u => {
        // Only consider "ongoing" or "upcoming" projects as active
        const activeAsLeader = (u.activeMemberships || []).find(m => 
          m.role === 'leader' && 
          m.projectId !== currentProjectId && 
          ['ongoing', 'upcoming'].includes(m.status)
        );
        
        let disabled = false;
        let labelText = `${esc(u.username)} (${u.email})`;

        if (activeAsLeader) { 
          disabled = true; 
          labelText += ' - [Project Leader (Unavailable)]';
        }
        
        return `<option value="${u.id}" ${disabled ? 'disabled' : ''}>${labelText}</option>`;
      }).join('');
    
    // Restore selected leader if it was set
    if (selectedLeaderId) leaderSelect.value = selectedLeaderId;
  }
  
  const menteesContainer = getEl("projectFormMenteesContainer");
  if (menteesContainer) {
    menteesContainer.innerHTML = allUsers.map(u => {
      const activeAsLeader = (u.activeMemberships || []).find(m => 
        m.role === 'leader' && 
        m.projectId !== currentProjectId && 
        ['ongoing', 'upcoming'].includes(m.status)
      );
      const activeAsMentee = (u.activeMemberships || []).find(m => 
        m.role === 'mentee' && 
        m.projectId !== currentProjectId && 
        ['ongoing', 'upcoming'].includes(m.status)
      );
      
      let disabled = false;
      let badge = '';
      
      if (u.id === selectedLeaderId) {
         disabled = true;
         badge = '<span class="a-role-badge admin" style="font-size:10px; padding:2px 6px; border-radius:10px; margin-left:auto; background:rgba(255,152,0,0.1); color:#ff9800;">Project Leader</span>';
      } else if (activeAsMentee) {
         disabled = true;
         badge = '<span class="a-role-badge user" style="font-size:10px; padding:2px 6px; border-radius:10px; margin-left:auto; background:rgba(244,67,54,0.1); color:#f44336;">Mentee (Unavailable)</span>';
      } else if (activeAsLeader) {
         badge = '<span class="a-role-badge admin" style="font-size:10px; padding:2px 6px; border-radius:10px; margin-left:auto; background:rgba(76,175,80,0.1); color:#4caf50;">Project Leader (Available)</span>';
      } else {
         badge = '<span style="font-size:10px; opacity:0.5; margin-left:auto;">Available</span>';
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

// Add listener to leader select to refresh mentee list
document.addEventListener("change", (e) => {
  if (e.target && e.target.id === "projectFormLeader") {
    // We need to preserve checked mentees before re-rendering
    const checkedMenteeIds = Array.from(document.querySelectorAll('input[name="projectMentees"]:checked')).map(cb => cb.value);
    
    // Get current project ID if editing
    const currentProjectId = getValue("projectFormId") || null;
    
    renderMemberSelectors(currentProjectId);
    
    // Restore checked mentees
    document.querySelectorAll('input[name="projectMentees"]').forEach(cb => {
      if (checkedMenteeIds.includes(cb.value) && !cb.disabled) {
        cb.checked = true;
      }
    });
  }
});

function openAddProjectModal() {
  getEl("projectForm").reset();
  setValue("projectFormId", "");
  setText("projectModalTitle", "Tambah Proyek");
  setValue("projectFormStatus", "ongoing");
  const errBox = getEl("projectFormError");
  if (errBox) { errBox.style.display = "none"; errBox.textContent = ""; }
  
  // Hide complete action on new project
  const completeAction = getEl("completeActionContainer");
  if (completeAction) completeAction.style.display = "none";
  
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
  setValue("projectFormStatus", p.project_status);
  
  // Handle completion UI
  const completeAction = getEl("completeActionContainer");
  if (completeAction) {
    completeAction.style.display = p.project_status === 'completed' ? 'none' : 'block';
  }

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

// --- Project Completion Logic ---
function confirmProjectCompletion() {
  const overlay = getEl("completionModalOverlay");
  if (overlay) overlay.classList.add("open");
  
  const confirmBtn = getEl("confirmCompleteBtn");
  if (confirmBtn) {
    confirmBtn.onclick = async () => {
      const id = getValue("projectFormId");
      closeCompletionModal();
      
      const res = await adminFetch(`/api/admin/projects/${id}/complete`, {
        method: "POST"
      });
      
      const json = await res.json();
      if (json.success) {
        showToast("Proyek telah diselesaikan!", "success");
        closeProjectModal();
        await loadProjects();
        await loadStats(true);
      } else {
        showToast(json.error || "Gagal menyelesaikan proyek", "error");
      }
    };
  }
}
window.confirmProjectCompletion = confirmProjectCompletion;

function closeCompletionModal() {
  const overlay = getEl("completionModalOverlay");
  if (overlay) overlay.classList.remove("open");
}
window.closeCompletionModal = closeCompletionModal;

function confirmProjectCompletionFromTable(id) {
  const overlay = getEl("completionModalOverlay");
  if (overlay) overlay.classList.add("open");
  
  const confirmBtn = getEl("confirmCompleteBtn");
  if (confirmBtn) {
    confirmBtn.onclick = async () => {
      closeCompletionModal();
      const res = await adminFetch(`/api/admin/projects/${id}/complete`, {
        method: "POST"
      });
      const json = await res.json();
      if (json.success) {
        showToast("Proyek telah diselesaikan!", "success");
        await loadProjects();
        await loadStats(true);
      } else {
        showToast(json.error || "Gagal menyelesaikan proyek", "error");
      }
    };
  }
}
window.confirmProjectCompletionFromTable = confirmProjectCompletionFromTable;

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

// ══════════════════════════════════════════════════════════════
//  WEEKLY CHECK-UP  —  Report Manager
// ══════════════════════════════════════════════════════════════

// Register section title + route
sectionTitles['weekly-checkup'] = [
  'Weekly Check-Up',
  'Auto-generated weekly PDF reports from project diary activity',
];

let allWeeklyReports = [];

// ── Load ─────────────────────────────────────────────────────
async function loadWeeklyCheckup() {
  showWcLoading();
  try {
    const res = await adminFetch('/api/admin/combined-reports');
    if (!res) return;
    const rj = await res.json();
    allWeeklyReports = rj.data || [];
    renderWeeklyReports(allWeeklyReports);
    updateWcStats(allWeeklyReports);
  } catch (err) {
    showWcError(err.message);
  }
}

// ── Stats ─────────────────────────────────────────────────────
function updateWcStats(reports) {
  const totalEl = getEl('wcStatTotal');
  if (totalEl) totalEl.textContent = reports.length;

  const now = new Date();
  const thisMonth = reports.filter(r => {
    const d = new Date(r.generated_at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  const monthEl = getEl('wcStatThisWeek');
  if (monthEl) monthEl.textContent = thisMonth;

  // Total leaders covered (sum of leader_count per report)
  const totalLeaders = reports.reduce((s, r) => s + (r.leader_count || 0), 0);
  const usersEl = getEl('wcStatUsers');
  if (usersEl) usersEl.textContent = totalLeaders;

  // Total diary entries covered
  const totalDiaries = reports.reduce((s, r) => s + (r.diary_count || 0), 0);
  const totalActivities = reports.reduce((s, r) => s + (r.total_activities || r.diary_count || 0), 0);
  const projEl = getEl('wcStatProjects');
  if (projEl) projEl.textContent = totalActivities;

  const badge = getEl('navWeeklyCount');
  if (badge) {
    if (reports.length > 0) { badge.textContent = reports.length; badge.style.display = 'inline-block'; }
    else badge.style.display = 'none';
  }
}

// ── Filter ────────────────────────────────────────────────────
function filterWeeklyReports() {
  const monthFilter = (getEl('wcFilterMonth')?.value) || '';
  const q = (getEl('wcSearch')?.value || '').toLowerCase();
  let filtered = allWeeklyReports;
  if (monthFilter) {
    filtered = filtered.filter(r => {
      if (!r.generated_at) return false;
      const d  = new Date(r.generated_at);
      const ym = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
      return ym === monthFilter;
    });
  }
  if (q) {
    filtered = filtered.filter(r =>
      (r.report_name   || '').toLowerCase().includes(q) ||
      (r.report_period || '').toLowerCase().includes(q) ||
      (r.file_name     || '').toLowerCase().includes(q)
    );
  }
  renderWeeklyReports(filtered);
  updateWcStats(filtered);
}
window.filterWeeklyReports = filterWeeklyReports;

// ── Render ────────────────────────────────────────────────────
function renderWeeklyReports(reports) {
  const grid = getEl('wcReportGrid');
  if (!grid) return;

  if (!reports.length) {
    grid.innerHTML = `
      <div class="wc-empty">
        <i class="bi bi-file-earmark-pdf"></i>
        <div class="wc-empty-title">No Combined Reports Found</div>
        <div class="wc-empty-sub">No weekly reports yet. Use "Generate Now" to create this week's combined report, or wait for the automatic Monday 01:00 WIB generation.</div>
      </div>`;
    return;
  }

  grid.innerHTML = reports.map(r => {
    const genDate = r.generated_at ? formatDate(r.generated_at) : '—';
    const exists = r.file_exists !== false; // default true
    const statusClass = exists ? 'status-ready' : 'status-missing';
    const statusLabel = exists ? 'Ready' : 'Missing';
    const statusIcon  = exists ? 'bi-check-circle-fill' : 'bi-exclamation-octagon-fill';

    return `
    <div class="wc-card ${exists ? '' : 'is-missing'}" id="wc-card-${r.id}">
      <div class="wc-card-stripe"></div>
      <div class="wc-card-body">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;">
          <div class="wc-pdf-badge"><i class="bi bi-file-earmark-pdf-fill"></i> Combined PDF</div>
          <div class="wc-status-indicator ${statusClass}">
            <i class="bi ${statusIcon}"></i> ${statusLabel}
          </div>
        </div>
        <div class="wc-card-title" title="${esc(r.report_name)}">${esc(r.report_name)}</div>
        <div class="wc-period-chip"><i class="bi bi-calendar-range-fill"></i> ${esc(r.report_period)}</div>
        <div class="wc-card-meta">
          <div class="wc-meta-row"><i class="bi bi-people-fill"></i><span>Leaders: <strong>${r.leader_count || 0}</strong></span></div>
          <div class="wc-meta-row"><i class="bi bi-lightning-charge-fill"></i><span>Total Activities: <strong>${r.total_activities || r.diary_count || 0}</strong></span></div>
          <div class="wc-meta-row"><i class="bi bi-file-earmark"></i><span style="font-size:11px;opacity:0.7">${esc(r.file_name)}</span></div>
          <div class="wc-meta-row"><i class="bi bi-clock-fill"></i><span>Generated: ${genDate}</span></div>
        </div>
      </div>
      <div class="wc-card-actions">
        <button class="wc-action-btn preview" onclick="previewWcReport('${r.id}','${esc(r.report_name)}','${esc(r.report_period)}')" ${exists ? '' : 'disabled'}>
          <i class="bi bi-eye-fill"></i> Preview
        </button>
        <button class="wc-action-btn download" onclick="downloadWcReport('${r.id}','${esc(r.file_name)}')" title="Download PDF" ${exists ? '' : 'disabled'}>
          <i class="bi bi-download"></i> Download
        </button>
        <button class="wc-action-btn del" onclick="deleteWcReport('${r.id}','${esc(r.report_name)}')" title="Delete Report">
          <i class="bi bi-trash3-fill"></i>
        </button>
      </div>
    </div>`;
  }).join('');
}

// ── Download (authenticated blob) ────────────────────────────
async function downloadWcReport(id, fileName) {
  try {
    const token = getToken();
    const res = await fetch(`/api/admin/combined-reports/${id}/download`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    if (res.status === 401 || res.status === 403) { showToast('Akses ditolak. Silakan login ulang.', 'error'); return; }
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      showToast(json.error || 'Gagal mengunduh PDF.', 'error');
      return;
    }
    const blob = await res.blob();
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = fileName || 'weekly-checkup.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  } catch (err) {
    showToast(`Error: ${err.message}`, 'error');
  }
}
window.downloadWcReport = downloadWcReport;

// ── Generate ──────────────────────────────────────────────────
async function generateWeeklyReportsNow() {
  const btn   = getEl('wcGenerateBtn');
  const badge = getEl('wcGeneratingBadge');
  if (btn)   { btn.disabled = true; btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Generating…'; }
  if (badge) badge.style.display = 'inline-flex';
  try {
    const res = await adminFetch('/api/admin/combined-reports/generate', { method: 'POST' });
    if (!res) return;
    const json = await res.json();
    if (json.success) {
      const cnt = json.data?.created_count ?? 0;
      showToast(
        cnt > 0
          ? `✅ Combined report generated for period ${json.data?.period}. All project leaders included!`
          : '⚠️ No new report — no diary activity found for the previous week, or a report for this period already exists.',
        cnt > 0 ? 'success' : 'info'
      );
      await loadWeeklyCheckup();
    } else {
      showToast(json.error || 'Failed to generate report.', 'error');
    }
  } catch (err) {
    showToast(`Error: ${err.message}`, 'error');
  } finally {
    if (btn)   { btn.disabled = false; btn.innerHTML = '<i class="bi bi-lightning-charge-fill"></i> Generate Now'; }
    if (badge) badge.style.display = 'none';
  }
}
window.generateWeeklyReportsNow = generateWeeklyReportsNow;

// ── Preview ───────────────────────────────────────────────────
let _wcPreviewBlobUrl = null;

async function previewWcReport(id, name, period) {
  const modal = getEl('wcPreviewModal');
  const frame = getEl('wcPreviewFrame');
  const title = getEl('wcPreviewTitle');
  const sub   = getEl('wcPreviewSub');
  const dlBtn = getEl('wcPreviewDlBtn');
  const loader = getEl('wcPreviewLoading');
  const errBox = getEl('wcPreviewError');
  const errMsg = getEl('wcPreviewErrorMsg');

  if (title) title.textContent = name;
  if (sub)   sub.textContent   = period;
  if (dlBtn) dlBtn.onclick     = () => downloadWcReport(id, name);

  // Reset state
  if (frame) { frame.src = ''; frame.style.display = 'none'; }
  if (loader) loader.style.display = 'flex';
  if (errBox) errBox.style.display = 'none';
  if (modal) modal.classList.add('open');

  try {
    const token = getToken();
    const res = await fetch(`/api/admin/weekly-checkup/${id}/preview`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json.error || `HTTP error! status: ${res.status}`);
    }

    const blob = await res.blob();
    if (blob.size === 0) throw new Error('Received empty PDF file.');

    // Revoke previous blob URL if any
    if (_wcPreviewBlobUrl) URL.revokeObjectURL(_wcPreviewBlobUrl);
    _wcPreviewBlobUrl = URL.createObjectURL(blob);
    
    if (frame) {
      frame.src = _wcPreviewBlobUrl;
      // Show iframe after a small delay to allow PDF viewer to init
      setTimeout(() => {
        if (loader) loader.style.display = 'none';
        frame.style.display = 'block';
      }, 600);
    }
  } catch (err) {
    if (loader) loader.style.display = 'none';
    if (errBox) errBox.style.display = 'flex';
    if (errMsg) errMsg.textContent = err.message || 'Gagal memuat preview PDF.';
    showToast(err.message || 'Gagal memuat preview PDF.', 'error');
  }
}
window.previewWcReport = previewWcReport;

function closeWcPreview() {
  const modal = getEl('wcPreviewModal');
  const frame = getEl('wcPreviewFrame');
  if (modal) modal.classList.remove('open');
  // Clear iframe src to stop PDF loading
  setTimeout(() => {
    if (frame) frame.src = '';
    // Revoke blob URL to free memory
    if (_wcPreviewBlobUrl) {
      URL.revokeObjectURL(_wcPreviewBlobUrl);
      _wcPreviewBlobUrl = null;
    }
  }, 300);
}
window.closeWcPreview = closeWcPreview;

// Close preview on overlay click
document.addEventListener('click', (e) => {
  if (e.target && e.target.id === 'wcPreviewModal') closeWcPreview();
});

// ── Delete ────────────────────────────────────────────────────
function deleteWcReport(id, name) {
  openDeleteModal('combined-report', id, `Hapus combined report <strong>${esc(name)}</strong>? File PDF akan dihapus permanen.`);
  const confirmBtn = getEl('confirmDeleteBtn');
  if (confirmBtn) {
    confirmBtn.onclick = async () => {
      closeDeleteModal();
      const res = await adminFetch(`/api/admin/combined-reports/${id}`, { method: 'DELETE' });
      if (!res) return;
      const json = await res.json();
      if (json.success) {
        showToast('Report berhasil dihapus.', 'success');
        const card = getEl(`wc-card-${id}`);
        if (card) {
          card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          card.style.opacity    = '0';
          card.style.transform  = 'scale(0.95)';
          setTimeout(() => {
            allWeeklyReports = allWeeklyReports.filter(r => r.id !== id);
            renderWeeklyReports(allWeeklyReports);
            updateWcStats(allWeeklyReports);
          }, 300);
        }
      } else {
        showToast(json.error || 'Failed to delete report.', 'error');
      }
    };
  }
}
window.deleteWcReport = deleteWcReport;

// ── Loading / Error states ────────────────────────────────────
function showWcLoading() {
  const grid = getEl('wcReportGrid');
  if (grid) {
    grid.innerHTML = `
      <div class="wc-loading">
        <div class="a-spinner" style="width:36px;height:36px;border-width:4px;"></div>
        <span>Loading reports…</span>
      </div>`;
  }
}

function showWcError(msg) {
  const grid = getEl('wcReportGrid');
  if (grid) {
    grid.innerHTML = `
      <div class="wc-empty">
        <i class="bi bi-exclamation-triangle-fill" style="color:var(--danger);"></i>
        <div class="wc-empty-title">Failed to load reports</div>
        <div class="wc-empty-sub">${esc(msg)}</div>
      </div>`;
  }
}

// ── Wire into section routing ─────────────────────────────────
// Hook into the DOMContentLoaded section loader
document.addEventListener('DOMContentLoaded', () => {
  // Override loadAll to include weekly-checkup
  const _origLoadAll = window.loadAll;
  if (typeof _origLoadAll === 'function') {
    window.loadAll = async function() {
      await _origLoadAll();
      if (currentSection === 'weekly-checkup') await loadWeeklyCheckup();
    };
  }
});




