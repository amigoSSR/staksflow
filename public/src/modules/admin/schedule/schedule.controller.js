import { scheduleService } from './schedule.service.js';

let allSchedules = [];
let currentMonthAdmin = new Date().getMonth();
let currentYearAdmin = new Date().getFullYear();

// Define a simple event emitter/store concept if needed, or directly manipulate DOM
export async function initScheduleModule() {
  await loadSchedules();
}

export async function loadSchedules() {
  const grid = document.getElementById('adminCalendarGrid');
  if (grid) grid.innerHTML = '<div class="a-empty"><div class="a-spinner"></div></div>';
  
  allSchedules = await scheduleService.getSchedules();
  renderSchedules();
}

export function prevMonth() {
  currentMonthAdmin--;
  if (currentMonthAdmin < 0) {
    currentMonthAdmin = 11;
    currentYearAdmin--;
  }
  renderSchedules();
}

export function nextMonth() {
  currentMonthAdmin++;
  if (currentMonthAdmin > 11) {
    currentMonthAdmin = 0;
    currentYearAdmin++;
  }
  renderSchedules();
}

function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function renderSchedules() {
  const grid = document.getElementById("adminCalendarGrid");
  if (!grid) return;
  const title = document.getElementById("adminCalendarTitle");
  
  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  title.textContent = `${monthNames[currentMonthAdmin]} ${currentYearAdmin}`;

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
    const dateStr = `${currentYearAdmin}-${String(currentMonthAdmin+1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    const dayEvents = allSchedules.filter(s => s.date === dateStr);
    const eventsHtml = dayEvents.map(s => 
      `<div class="fc-event-pill" onclick="event.stopPropagation(); window.openScheduleModal('${s.id}')" title="${escapeHtml(s.title)}\nOleh: ${escapeHtml(s.created_by_username)}">
        ${s.time} ${escapeHtml(s.title)}
      </div>`
    ).join('');

    html += `
      <div class="fc-day-cell ${isToday ? 'today' : ''}" onclick="window.openScheduleModal(null, '${dateStr}')">
        <div class="fc-day-num">${day}</div>
        <div class="fc-events">${eventsHtml}</div>
      </div>
    `;
  }
  grid.innerHTML = html;
}
