/* =============================================
   STAKS FLOW — Auth Logic (Login & Register)
   ============================================= */

const AUTH_BASE = '/api/auth';
const setToken = (t) => sessionStorage.setItem('tf_token', t);
const getEl = (id) => document.getElementById(id);
const getValue = (id) => document.getElementById(id)?.value || '';
const setText = (id, text) => { const el = getEl(id); if (el) el.textContent = text; };

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

// Redirect if already logged in
if (sessionStorage.getItem('tf_token')) {
  fetch('/api/auth/me', { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('tf_token')}` } })
    .then(res => {
      if (!res.ok) throw new Error('Invalid token');
      return res.json();
    })
    .then(data => {
      window.location.href = data.user?.role === 'admin' ? '/admin.html' : '/index.html';
    })
    .catch(() => {
      sessionStorage.removeItem('tf_token');
    });
} else {
  // Show session expired message if redirected
  const msg = sessionStorage.getItem('tf_auth_msg');
  if (msg) {
    document.addEventListener("DOMContentLoaded", () => {
      showToast(msg, 'error');
      sessionStorage.removeItem('tf_auth_msg');
    });
  }
}

// ─── LOGIN LOGIC ───
const loginForm = getEl('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const identifier = getValue('loginIdentifier').trim();
    const password   = getValue('loginPassword');
    if (!identifier) { setText('loginIdentifierError', 'Wajib diisi'); return; }
    if (!password)   { setText('loginPasswordError', 'Wajib diisi'); return; }
    setText('loginIdentifierError', '');
    setText('loginPasswordError', '');
    
    const btn = getEl('btnLogin');
    if (btn) btn.disabled = true;
    const spinner = getEl('loginSpinner');
    if (spinner) spinner.classList.remove('hidden');
    setText('loginBtnText', 'Masuk...');
    try {
      const res = await authFetch(`${AUTH_BASE}/login`, { identifier, password });
      setToken(res.token);
      window.location.href = res.user.role === 'admin' ? '/admin.html' : '/index.html';
    } catch (err) {
      setText('loginPasswordError', err.message);
    } finally {
      if (btn) btn.disabled = false;
      if (spinner) spinner.classList.add('hidden');
      setText('loginBtnText', 'Masuk');
    }
  });

  const togglePwd = getEl('loginTogglePwd');
  if (togglePwd) {
    togglePwd.addEventListener('click', () => {
      const inp = getEl('loginPassword');
      const ic  = togglePwd.querySelector('i');
      if (!inp || !ic) return;
      if (inp.type === 'password') { inp.type = 'text';     ic.className = 'bi bi-eye-slash-fill'; }
      else                         { inp.type = 'password'; ic.className = 'bi bi-eye-fill'; }
    });
  }
}

// ─── REGISTER LOGIC ───
const registerForm = getEl('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username        = getValue('regUsername').trim();
    const email           = getValue('regEmail').trim();
    const password        = getValue('regPassword');
    const passwordConfirm = getValue('regPasswordConfirm');
    let ok = true;
    
    ['regUsernameError','regEmailError','regPasswordError','regPasswordConfirmError'].forEach(id => {
        const el = getEl(id);
        if (el) el.textContent = '';
    });
    
    if (!username || username.length < 3) { setText('regUsernameError', 'Minimal 3 karakter'); ok = false; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setText('regEmailError', 'Email tidak valid'); ok = false; }
    if (!password || password.length < 6) { setText('regPasswordError', 'Minimal 6 karakter'); ok = false; }
    if (password !== passwordConfirm) { setText('regPasswordConfirmError', 'Password tidak cocok'); ok = false; }
    if (!ok) return;
    
    const btn = getEl('btnRegister');
    if (btn) btn.disabled = true;
    const spinner = getEl('registerSpinner');
    if (spinner) spinner.classList.remove('hidden');
    setText('registerBtnText', 'Mendaftar...');
    try {
      const res = await authFetch(`${AUTH_BASE}/register`, { username, email, password });
      setToken(res.token);
      showToast('🎉 Akun berhasil dibuat!', 'success');
      setTimeout(() => {
         window.location.href = res.user.role === 'admin' ? '/admin.html' : '/index.html';
      }, 1000);
    } catch (err) {
      setText('regUsernameError', err.message);
    } finally {
      if (btn) btn.disabled = false;
      if (spinner) spinner.classList.add('hidden');
      setText('registerBtnText', 'Daftar');
    }
  });

  const regTogglePwd = getEl('regTogglePwd');
  if (regTogglePwd) {
    regTogglePwd.addEventListener('click', () => {
      const inp = getEl('regPassword');
      const ic  = regTogglePwd.querySelector('i');
      if (!inp || !ic) return;
      if (inp.type === 'password') { inp.type = 'text';     ic.className = 'bi bi-eye-slash-fill'; }
      else                         { inp.type = 'password'; ic.className = 'bi bi-eye-fill'; }
    });
  }
}
