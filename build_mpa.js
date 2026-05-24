const fs = require('fs');
const path = require('path');

const templateHtmlPath = path.join(__dirname, 'public', 'template.html');
const baseHtml = fs.readFileSync(templateHtmlPath, 'utf8');

const modules = [
  { name: 'overview', title: 'Dashboard Overview', sub: 'Selamat datang di panel administrasi STAKS FLOW' },
  { name: 'users', title: 'Manajemen User', sub: 'Kelola akun dan role pengguna' },
  { name: 'projects', title: 'Manajemen Proyek', sub: 'Kelola proyek aktif, leader, mentee, dan roadmap' },
  { name: 'tasks', title: 'Diary & Aktivitas', sub: 'Lihat dan kelola diary/aktivitas harian pengguna' },
  { name: 'weekly-checkup', title: 'Weekly Check-Up', sub: 'Auto-generated weekly PDF reports from project diary activity' },
  { name: 'manual', title: 'Manual Book Manager', sub: 'Kelola tutorial dan panduan penggunaan STAKS Flow' },
  { name: 'house-rules', title: 'House Rules', sub: 'Kelola peraturan dan tata tertib' },
  { name: 'duty', folder: 'piket', title: 'Jadwal Piket', sub: 'Kelola jadwal piket Ganjil & Genap' },
  { name: 'calendar', folder: 'schedule', title: 'Calendar / Schedule', sub: 'Kelola jadwal dan agenda kegiatan' }
];

modules.forEach(mod => {
  const folder = mod.folder || mod.name;
  const fragmentPath = path.join(__dirname, 'public', 'src', 'modules', 'admin', folder, `${folder}.html`);
  
  if (fs.existsSync(fragmentPath)) {
    let fragment = fs.readFileSync(fragmentPath, 'utf8');
    
    // Ensure section is active and visible
    fragment = fragment.replace(/class="a-section"/g, 'class="a-section active" style="display:flex;"');
    
    // Replace the app-sections div with the fragment
    let pageHtml = baseHtml.replace('<div id="app-sections"></div>', fragment);
    
    // Set titles
    pageHtml = pageHtml.replace(/<h1 class="a-page-title" id="pageTitle">.*?<\/h1>/, `<h1 class="a-page-title" id="pageTitle">${mod.title}</h1>`);
    pageHtml = pageHtml.replace(/<p class="a-page-sub" id="pageSub">.*?<\/p>/, `<p class="a-page-sub" id="pageSub">${mod.sub}</p>`);
    
    // Set active nav
    pageHtml = pageHtml.replace(/class="a-nav-item active"/g, 'class="a-nav-item"');
    const navRegex = new RegExp(`class="a-nav-item" data-section="${mod.name}"`);
    pageHtml = pageHtml.replace(navRegex, `class="a-nav-item active" data-section="${mod.name}"`);
    
    // Write out the independent HTML file
    const fileName = mod.name === 'overview' ? 'admin.html' : `admin-${mod.name}.html`;
    const outPath = path.join(__dirname, 'public', fileName);
    fs.writeFileSync(outPath, pageHtml);
    console.log(`Generated ${outPath}`);
  }
});
