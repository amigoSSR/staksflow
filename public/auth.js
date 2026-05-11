/* =============================================
   STAKS FLOW — Auth Logic (Login & Register)
   ============================================= */

const AUTH_BASE = '/api/auth';
const setToken = (t) => sessionStorage.setItem('tf_token', t);

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
  const container = document.getElementById('toastContainer');
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
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const identifier = document.getElementById('loginIdentifier').value.trim();
    const password   = document.getElementById('loginPassword').value;
    if (!identifier) { document.getElementById('loginIdentifierError').textContent = 'Wajib diisi'; return; }
    if (!password)   { document.getElementById('loginPasswordError').textContent   = 'Wajib diisi'; return; }
    document.getElementById('loginIdentifierError').textContent = '';
    document.getElementById('loginPasswordError').textContent   = '';
    
    const btn = document.getElementById('btnLogin');
    btn.disabled = true;
    document.getElementById('loginSpinner').classList.remove('hidden');
    document.getElementById('loginBtnText').textContent = 'Masuk...';
    try {
      const res = await authFetch(`${AUTH_BASE}/login`, { identifier, password });
      setToken(res.token);
      window.location.href = res.user.role === 'admin' ? '/admin.html' : '/index.html';
    } catch (err) {
      document.getElementById('loginPasswordError').textContent = err.message;
    } finally {
      btn.disabled = false;
      document.getElementById('loginSpinner').classList.add('hidden');
      document.getElementById('loginBtnText').textContent = 'Masuk';
    }
  });

  const togglePwd = document.getElementById('loginTogglePwd');
  if (togglePwd) {
    togglePwd.addEventListener('click', () => {
      const inp = document.getElementById('loginPassword');
      const ic  = document.querySelector('#loginTogglePwd i');
      if (inp.type === 'password') { inp.type = 'text';     ic.className = 'bi bi-eye-slash-fill'; }
      else                         { inp.type = 'password'; ic.className = 'bi bi-eye-fill'; }
    });
  }
}

// ─── REGISTER LOGIC ───
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username        = document.getElementById('regUsername').value.trim();
    const email           = document.getElementById('regEmail').value.trim();
    const password        = document.getElementById('regPassword').value;
    const passwordConfirm = document.getElementById('regPasswordConfirm').value;
    let ok = true;
    
    ['regUsernameError','regEmailError','regPasswordError','regPasswordConfirmError'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '';
    });
    
    if (!username || username.length < 3) { document.getElementById('regUsernameError').textContent = 'Minimal 3 karakter'; ok = false; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { document.getElementById('regEmailError').textContent = 'Email tidak valid'; ok = false; }
    if (!password || password.length < 6) { document.getElementById('regPasswordError').textContent = 'Minimal 6 karakter'; ok = false; }
    if (password !== passwordConfirm) { document.getElementById('regPasswordConfirmError').textContent = 'Password tidak cocok'; ok = false; }
    if (!ok) return;
    
    const btn = document.getElementById('btnRegister');
    btn.disabled = true;
    document.getElementById('registerSpinner').classList.remove('hidden');
    document.getElementById('registerBtnText').textContent = 'Mendaftar...';
    try {
      const res = await authFetch(`${AUTH_BASE}/register`, { username, email, password });
      setToken(res.token);
      showToast('🎉 Akun berhasil dibuat!', 'success');
      setTimeout(() => {
         window.location.href = res.user.role === 'admin' ? '/admin.html' : '/index.html';
      }, 1000);
    } catch (err) {
      document.getElementById('regUsernameError').textContent = err.message;
    } finally {
      btn.disabled = false;
      document.getElementById('registerSpinner').classList.add('hidden');
      document.getElementById('registerBtnText').textContent = 'Daftar';
    }
  });

  const regTogglePwd = document.getElementById('regTogglePwd');
  if (regTogglePwd) {
    regTogglePwd.addEventListener('click', () => {
      const inp = document.getElementById('regPassword');
      const ic  = document.querySelector('#regTogglePwd i');
      if (inp.type === 'password') { inp.type = 'text';     ic.className = 'bi bi-eye-slash-fill'; }
      else                         { inp.type = 'password'; ic.className = 'bi bi-eye-fill'; }
    });
  }
}
