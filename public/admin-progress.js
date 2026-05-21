/**
 * admin-progress.js — Progress Monitoring Module
 * Handles: user progress cards, detail modal, Chart.js charts
 *
 * NOTE: getEl, getValue, setText, setHTML, adminFetch, showToast
 * are provided by admin.js which loads before this file.
 */
'use strict';


// ── State ─────────────────────────────────────────────────────────────────────
let allProgressData = [];
let weeklyChartInst = null;
let monthlyChartInst = null;

const PM_CATEGORIES = ['daily', 'weekly', 'monthly', 'quarterly', 'semesterly', 'yearly'];
const CAT_LABELS = {
  daily: 'Harian', weekly: 'Mingguan', monthly: 'Bulanan',
  quarterly: 'Per 3 Bln', semesterly: 'Per 6 Bln', yearly: 'Tahunan',
};
const ACTION_MAP = {
  CREATE_TASK: { label: 'Buat Task', icon: 'bi-plus-circle-fill', cls: 'act-create' },
  EDIT_TASK:   { label: 'Edit Task', icon: 'bi-pencil-fill',        cls: 'act-edit'   },
  DELETE_TASK: { label: 'Hapus Task', icon: 'bi-trash3-fill',       cls: 'act-delete' },
  COMPLETE_TASK: { label: 'Selesaikan', icon: 'bi-check-circle-fill', cls: 'act-done' },
  REOPEN_TASK: { label: 'Buka Kembali', icon: 'bi-arrow-counterclockwise', cls: 'act-reopen' },
  DELETE_TASK_ADMIN: { label: 'Hapus (Admin)', icon: 'bi-shield-fill-x', cls: 'act-admin' },
};

// ── Register Progress Section in admin.js navigation ─────────────────────────
// Patch sectionTitles from admin.js
document.addEventListener('DOMContentLoaded', () => {
  // Register with admin nav
  if (typeof sectionTitles !== 'undefined') {
    sectionTitles['progress'] = ['Progress Monitoring', 'Pantau produktivitas dan aktivitas setiap user'];
  }

  // Hook into nav click for progress section
  const navProgress = getEl('nav-progress');
  if (navProgress) {
    navProgress.addEventListener('click', () => {
      loadProgressSection();
    });
  }

  // Setup CSP-compliant event listeners
  const btnExport = getEl('btnExportExcel');
  if (btnExport) {
    btnExport.addEventListener('click', exportProgressExcel);
    btnExport.addEventListener('mouseover', function() {
      this.style.transform = 'translateY(-1px)';
      this.style.boxShadow = '0 4px 8px rgba(16,185,129,0.3)';
    });
    btnExport.addEventListener('mouseout', function() {
      this.style.transform = 'none';
      this.style.boxShadow = '0 2px 4px rgba(16,185,129,0.2)';
    });
  }

  const searchInput = getEl('progressSearch');
  if (searchInput) {
    searchInput.addEventListener('input', filterProgress);
  }
});

// ── Load Progress Data ────────────────────────────────────────────────────────
async function loadProgressSection(silent = false) {
  const grid = getEl('pmUserGrid');
  if (!grid) return;

  if (!silent) {
    grid.innerHTML = '<div class="a-spinner" style="margin:40px auto;display:block"></div>';
  }

  try {
    const res = await adminFetch('/api/admin/progress');
    if (!res) return;
    const { data } = await res.json();
    allProgressData = data || [];
    renderProgressSummary(allProgressData);
    filterProgress(); // Re-render grid with current filter

    // If modal is open, refresh it silently
    const overlay = getEl('progressDetailOverlay');
    if (overlay && overlay.classList.contains('open')) {
      const activeUserId = overlay.dataset.userId;
      if (activeUserId) {
        refreshProgressDetail(activeUserId);
      }
    }
  } catch (e) {
    if (!silent) setHTML('pmUserGrid', `<p style="color:var(--at-3);padding:24px">Gagal memuat data: ${e.message}</p>`);
  }
}

// ── Render Summary Cards ──────────────────────────────────────────────────────
function renderProgressSummary(data) {
  const row = getEl('pmSummaryRow');
  if (!row) return;

  const totalUsers = data.length;
  const totalTasks = data.reduce((s, u) => s + u.total, 0);
  const totalDone  = data.reduce((s, u) => s + u.done, 0);
  const avgProd    = totalUsers > 0
    ? Math.round(data.reduce((s, u) => s + u.productivity, 0) / totalUsers)
    : 0;
  const topUser = data.length
    ? data.reduce((top, u) => (u.productivity > top.productivity ? u : top), data[0])
    : null;

  row.innerHTML = `
    <div class="pm-summary-card purple">
      <div class="pm-s-icon"><i class="bi bi-people-fill"></i></div>
      <div class="pm-s-info">
        <div class="pm-s-num">${totalUsers}</div>
        <div class="pm-s-lbl">Total User</div>
      </div>
    </div>
    <div class="pm-summary-card blue">
      <div class="pm-s-icon"><i class="bi bi-clipboard-data-fill"></i></div>
      <div class="pm-s-info">
        <div class="pm-s-num">${totalTasks}</div>
        <div class="pm-s-lbl">Total Task</div>
      </div>
    </div>
    <div class="pm-summary-card green">
      <div class="pm-s-icon"><i class="bi bi-check-circle-fill"></i></div>
      <div class="pm-s-info">
        <div class="pm-s-num">${totalDone}</div>
        <div class="pm-s-lbl">Task Selesai</div>
      </div>
    </div>
    <div class="pm-summary-card orange">
      <div class="pm-s-icon"><i class="bi bi-speedometer2"></i></div>
      <div class="pm-s-info">
        <div class="pm-s-num">${avgProd}%</div>
        <div class="pm-s-lbl">Avg Produktivitas</div>
      </div>
    </div>
    <div class="pm-summary-card gold">
      <div class="pm-s-icon"><i class="bi bi-trophy-fill"></i></div>
      <div class="pm-s-info">
        <div class="pm-s-num pm-s-sm">${topUser ? esc(topUser.username) : '-'}</div>
        <div class="pm-s-lbl">User Terbaik</div>
      </div>
    </div>`;
}

// ── Render User Progress Grid ─────────────────────────────────────────────────
function renderProgressGrid(data) {
  const grid = getEl('pmUserGrid');
  if (!grid) return;
  if (!data.length) {
    grid.innerHTML = '<p class="a-empty" style="padding:40px">Belum ada user terdaftar.</p>';
    return;
  }

  grid.innerHTML = data.map(u => {
    const pct = u.productivity;
    const pctColor = pct >= 70 ? '#22c55e' : pct >= 40 ? '#f59e0b' : '#ef4444';
    const topCat = PM_CATEGORIES.reduce(
      (top, c) => (u.byCategory[c]?.done || 0) > (u.byCategory[top]?.done || 0) ? c : top,
      PM_CATEGORIES[0]
    );

    return `
    <div class="pm-user-card" onclick="openProgressDetail('${u.id}')">
      <div class="pm-uc-header">
        <div class="pm-uc-avatar">${u.username.charAt(0).toUpperCase()}</div>
        <div class="pm-uc-info">
          <div class="pm-uc-name">${esc(u.username)}</div>
          <div class="pm-uc-email">${esc(u.email)}</div>
        </div>
        <div class="pm-uc-pct" style="color:${pctColor}">${pct}%</div>
      </div>

      <div class="pm-uc-progress-wrap">
        <div class="pm-uc-progress-bar">
          <div class="pm-uc-progress-fill" style="width:${pct}%;background:${pctColor}"></div>
        </div>
        <span class="pm-uc-progress-label">Produktivitas</span>
      </div>

      <div class="pm-uc-stats">
        <div class="pm-uc-stat">
          <span class="pm-uc-stat-num">${u.total}</span>
          <span class="pm-uc-stat-lbl">Total</span>
        </div>
        <div class="pm-uc-stat green">
          <span class="pm-uc-stat-num">${u.done}</span>
          <span class="pm-uc-stat-lbl">Selesai</span>
        </div>
        <div class="pm-uc-stat yellow">
          <span class="pm-uc-stat-num">${u.pending}</span>
          <span class="pm-uc-stat-lbl">Pending</span>
        </div>
      </div>

      ${u.total > 0 ? `
      <div class="pm-uc-footer">
        <i class="bi bi-star-fill" style="color:#f59e0b;font-size:11px"></i>
        <span>Top kategori: <strong>${CAT_LABELS[topCat] || topCat}</strong></span>
      </div>` : '<div class="pm-uc-footer" style="color:var(--at-3)">Belum ada task</div>'}
    </div>`;
  }).join('');
}

// ── Filter Progress Grid ──────────────────────────────────────────────────────
function filterProgress() {
  const q = getValue('progressSearch').toLowerCase();
  const filtered = allProgressData.filter(u =>
    u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
  );
  renderProgressGrid(filtered);
}

// ── Open Detail Modal ─────────────────────────────────────────────────────────
async function openProgressDetail(userId) {
  const overlay = getEl('progressDetailOverlay');
  if (!overlay) return;
  overlay.dataset.userId = userId;
  overlay.classList.add('open');

  // Reset charts
  destroyCharts();

  // Show loading state
  setHTML('pdStats', '<div class="a-spinner" style="margin:20px auto;display:block"></div>');
  setHTML('pdCategoryGrid', '');
  setHTML('pdActivityList', '');
  setHTML('pdRecentTasks', '');

  try {
    const res = await adminFetch(`/api/admin/progress/${userId}`);
    if (!res) return;
    const { data } = await res.json();
    renderDetailModal(data, false);
  } catch (e) {
    setHTML('pdStats', `<p style="color:var(--at-3)">Gagal memuat: ${e.message}</p>`);
  }
}

async function refreshProgressDetail(userId) {
  try {
    const res = await adminFetch(`/api/admin/progress/${userId}`);
    if (!res) return;
    const { data } = await res.json();
    renderDetailModal(data, true);
  } catch (e) {
    console.error("Gagal refresh detail:", e);
  }
}

function closeProgressDetail() {
  const overlay = getEl('progressDetailOverlay');
  if (overlay) overlay.classList.remove('open');
  destroyCharts();
}

function destroyCharts() {
  if (weeklyChartInst)  { weeklyChartInst.destroy();  weeklyChartInst  = null; }
  if (monthlyChartInst) { monthlyChartInst.destroy(); monthlyChartInst = null; }
}

// Close on backdrop click
document.addEventListener('DOMContentLoaded', () => {
  const overlay = getEl('progressDetailOverlay');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeProgressDetail();
    });
  }
});

// ── Render Detail Modal ───────────────────────────────────────────────────────
function renderDetailModal(d, isUpdate = false) {
  const { user, total, done, pending, productivity, byCategory,
          weeklyChart, monthlyChart, recentTasks, topCategory, activityLog } = d;

  // Header
  setText('pdAvatar', user.username.charAt(0).toUpperCase());
  setText('pdName', user.username);
  setText('pdEmail', user.email);

  // Productivity color
  const pctColor = productivity >= 70 ? '#22c55e' : productivity >= 40 ? '#f59e0b' : '#ef4444';

  // Stats
  setHTML('pdStats', `
    <div class="pd-stat-card">
      <div class="pd-stat-num">${total}</div>
      <div class="pd-stat-lbl">Total Task</div>
    </div>
    <div class="pd-stat-card green">
      <div class="pd-stat-num">${done}</div>
      <div class="pd-stat-lbl">Selesai</div>
    </div>
    <div class="pd-stat-card yellow">
      <div class="pd-stat-num">${pending}</div>
      <div class="pd-stat-lbl">Pending</div>
    </div>
    <div class="pd-stat-card" style="border-color:${pctColor}40">
      <div class="pd-stat-num" style="color:${pctColor}">${productivity}%</div>
      <div class="pd-stat-lbl">Produktivitas</div>
    </div>
    <div class="pd-stat-card gold">
      <div class="pd-stat-num pd-stat-sm">${CAT_LABELS[topCategory] || topCategory || '-'}</div>
      <div class="pd-stat-lbl">Kategori Terbaik</div>
    </div>`);

  // Get theme colors dynamically
  const colors = getThemeColors();

  // Weekly Chart
  if (isUpdate && weeklyChartInst) {
    weeklyChartInst.data.datasets[0].data = weeklyChart.map(d => d.completed);
    weeklyChartInst.data.datasets[1].data = weeklyChart.map(d => d.created);
    weeklyChartInst.update();
  } else {
    const wCanvas = getEl('weeklyChart');
    if (!wCanvas) return;
    const wCtx = wCanvas.getContext('2d');
    if (!wCtx) return;
    weeklyChartInst = new Chart(wCtx, {
      type: 'bar',
      data: {
        labels:   weeklyChart.map(d => d.label),
        datasets: [
          {
            label: 'Selesai',
            data:  weeklyChart.map(d => d.completed),
            backgroundColor: hexToRgba(colors.success, 0.75),
            borderRadius: 6,
          },
          {
            label: 'Dibuat',
            data:  weeklyChart.map(d => d.created),
            backgroundColor: hexToRgba(colors.accent, 0.6),
            borderRadius: 6,
          },
        ],
      },
      options: chartOpts('Aktivitas Harian'),
    });
  }

  // Monthly Chart
  if (isUpdate && monthlyChartInst) {
    monthlyChartInst.data.datasets[0].data = monthlyChart.map(d => d.completed);
    monthlyChartInst.data.datasets[1].data = monthlyChart.map(d => d.created);
    monthlyChartInst.update();
  } else {
    const mCanvas = getEl('monthlyChart');
    if (!mCanvas) return;
    const mCtx = mCanvas.getContext('2d');
    if (!mCtx) return;
    monthlyChartInst = new Chart(mCtx, {
      type: 'line',
      data: {
        labels:   monthlyChart.map(d => d.label),
        datasets: [
          {
            label: 'Selesai',
            data:  monthlyChart.map(d => d.completed),
            borderColor: colors.success,
            backgroundColor: hexToRgba(colors.success, 0.12),
            tension: 0.4,
            fill: true,
            pointBackgroundColor: colors.success,
            pointRadius: 4,
          },
          {
            label: 'Dibuat',
            data:  monthlyChart.map(d => d.created),
            borderColor: colors.accent,
            backgroundColor: hexToRgba(colors.accent, 0.08),
            tension: 0.4,
            fill: true,
            pointBackgroundColor: colors.accent,
            pointRadius: 4,
          },
        ],
      },
      options: chartOpts('Task per Bulan'),
    });
  }

  // Category Performance Grid
  const catGrid = getEl('pdCategoryGrid');
  if (catGrid) {
    catGrid.innerHTML = PM_CATEGORIES.map(cat => {
      const c = byCategory[cat] || { total: 0, done: 0, pending: 0 };
      const pct = c.total > 0 ? Math.round((c.done / c.total) * 100) : 0;
      const barColor = pct >= 70 ? '#22c55e' : pct >= 40 ? '#f59e0b' : pct > 0 ? '#ef4444' : '#5a5e8a';
      return `
        <div class="pm-cat-item">
          <div class="pm-cat-header">
            <span class="pm-cat-label">${CAT_LABELS[cat]}</span>
            <span class="pm-cat-pct" style="color:${barColor}">${pct}%</span>
          </div>
          <div class="pm-cat-bar-wrap">
            <div class="pm-cat-bar-fill" style="width:${pct}%;background:${barColor}"></div>
          </div>
          <div class="pm-cat-sub">${c.done} selesai / ${c.total} total</div>
        </div>`;
    }).join('');
  }

  // Activity Log
  const actList = getEl('pdActivityList');
  if (!activityLog.length) {
    if (actList) actList.innerHTML = '<p class="pm-empty-msg">Belum ada aktivitas</p>';
  } else {
    actList.innerHTML = activityLog.map(a => {
      const info = ACTION_MAP[a.action] || { label: a.action, icon: 'bi-circle', cls: '' };
      return `
        <div class="pm-act-item">
          <div class="pm-act-icon ${info.cls}"><i class="bi ${info.icon}"></i></div>
          <div class="pm-act-body">
            <div class="pm-act-label">${info.label}</div>
            <div class="pm-act-task">${esc(a.task_title || '-')}</div>
          </div>
          <div class="pm-act-time">${timeAgoLocal(a.timestamp)}</div>
        </div>`;
    }).join('');
  }

  // Recent Tasks
  const taskList = getEl('pdRecentTasks');
  if (!recentTasks.length) {
    if (taskList) taskList.innerHTML = '<p class="pm-empty-msg">Belum ada task</p>';
  } else {
    taskList.innerHTML = recentTasks.map(t => {
      const isDone = t.status.startsWith('selesai');
      return `
        <div class="pm-act-item">
          <div class="pm-act-icon ${isDone ? 'act-done' : 'act-reopen'}">
            <i class="bi ${isDone ? 'bi-check-circle-fill' : 'bi-hourglass-split'}"></i>
          </div>
          <div class="pm-act-body">
            <div class="pm-act-label">${esc(t.title)}</div>
            <div class="pm-act-task">
              <span class="a-cat-badge cat-${t.category}" style="font-size:9px;padding:2px 6px">${t.category}</span>
            </div>
          </div>
          <span class="a-status-badge ${t.status}" style="font-size:10px;padding:2px 8px">
            ${isDone ? '✓' : '⏳'}
          </span>
        </div>`;
    }).join('');
  }
}

// ── Chart Default Options & Theme Helpers ─────────────────────────────────────
function getCssVar(varName) {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

function hexToRgba(hex, alpha) {
  hex = hex.replace('#', '').trim();
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getThemeColors() {
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  const successColor = getCssVar('--success') || '#22c55e';
  const accentColor = getCssVar('--accent') || '#36ADA3';
  const textColor = getCssVar('--at-2') || (isDark ? '#9a9ec8' : '#64748b');
  const gridColor = getCssVar('--at-border') || (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)');
  const cardBg = getCssVar('--at-card') || (isDark ? '#181b40' : '#fff');
  
  return {
    success: successColor,
    accent: accentColor,
    text: textColor,
    grid: gridColor,
    cardBg: cardBg
  };
}

function chartOpts(title) {
  const colors = getThemeColors();
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: colors.text, font: { family: 'Inter', size: 11 }, boxWidth: 12, padding: 12 },
      },
      tooltip: {
        backgroundColor: colors.cardBg,
        titleColor: colors.text,
        bodyColor:  colors.text,
        borderColor: colors.grid,
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        ticks: { color: colors.text, font: { size: 10, family: 'Inter' } },
        grid:  { color: colors.grid },
      },
      y: {
        beginAtZero: true,
        ticks: { color: colors.text, font: { size: 10, family: 'Inter' }, stepSize: 1 },
        grid:  { color: colors.grid },
      },
    },
  };
}

// Listen for theme changes to redraw charts dynamically
window.addEventListener('themechanged', () => {
  const overlay = getEl('progressDetailOverlay');
  if (overlay && overlay.classList.contains('open')) {
    const activeUserId = overlay.dataset.userId;
    if (activeUserId) {
      destroyCharts();
      refreshProgressDetail(activeUserId);
    }
  }
});

// ── Helpers ───────────────────────────────────────────────────────────────────
function esc(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function timeAgoLocal(str) {
  if (!str) return '-';
  try {
    const diff = Date.now() - new Date(str).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1)  return 'Baru saja';
    if (m < 60) return `${m} mnt lalu`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} jam lalu`;
    return `${Math.floor(h / 24)} hari lalu`;
  } catch { return str; }
}

// ── Export Excel ─────────────────────────────────────────────────────────────
async function exportProgressExcel() {
  const btn = getEl('btnExportExcel');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<div class="a-spinner" style="width:14px;height:14px;border-width:2px;margin-right:6px;"></div> Exporting...';
  }
  
  try {
    const cat = getValue('exportCatFilter') || 'all';
    const start = getValue('exportStartDate') || '';
    const end = getValue('exportEndDate') || '';
    
    const overlay = getEl('progressDetailOverlay');
    let userId = '';
    // Optional: if the admin has a detail modal open, export only that user's data
    // if (overlay && overlay.classList.contains('open') && overlay.dataset.userId) {
    //   userId = overlay.dataset.userId;
    // }
    
    const params = new URLSearchParams();
    if (cat !== 'all') params.append('category', cat);
    if (start) params.append('startDate', start);
    if (end) params.append('endDate', end);
    if (userId) params.append('userId', userId);
    
    const url = `/api/admin/progress/export?${params.toString()}`;
    
    const token = sessionStorage.getItem('tf_token');
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      let errStr = 'Gagal export data';
      try { const err = await response.json(); errStr = err.error || errStr; } catch(e){}
      throw new Error(errStr);
    }
    
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    
    let filename = `progress-monitoring-${new Date().toISOString().split('T')[0]}.xlsx`;
    const disposition = response.headers.get('Content-Disposition');
    if (disposition && disposition.indexOf('filename=') !== -1) {
        const matches = /filename="([^"]+)"/.exec(disposition);
        if (matches != null && matches[1]) filename = matches[1];
    }
    
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(downloadUrl);
    document.body.removeChild(a);
    
    if (typeof showToast === 'function') showToast('Export Excel berhasil!', 'success');
  } catch (error) {
    if (typeof showToast === 'function') showToast(error.message, 'error');
    else alert(error.message);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="bi bi-file-earmark-excel-fill"></i> Export';
    }
  }
}
