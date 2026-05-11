/**
 * public/src/common/utils/api.js
 * Common API fetch wrapper that automatically handles Auth tokens.
 */

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...(options.headers || {})
  };

  try {
    const res = await fetch(endpoint, { ...options, headers });
    if (res.status === 401 || res.status === 403) {
      if (window.location.pathname !== '/login.html') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login.html';
      }
      return null;
    }
    return res;
  } catch (err) {
    console.error(`API Fetch Error [${endpoint}]:`, err);
    throw err;
  }
}
