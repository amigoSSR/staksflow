const fs = require('fs');
const path = require('path');

const adminHtmlPath = path.join(__dirname, 'public', 'admin.html');
let html = fs.readFileSync(adminHtmlPath, 'utf8');

const sections = [
  'overview',
  'users',
  'tasks',
  'activity',
  'progress',
  'house-rules',
  'duty',
  'calendar'
];

let replacedHtml = html;

sections.forEach(sec => {
  const regex = new RegExp(`<section id="sec-${sec}" class="a-section(?: active)?">([\\s\\S]*?)</section>`);
  const match = html.match(regex);
  if (match) {
    const content = match[0];
    
    // Map section IDs to folder names
    let folder = sec;
    if (sec === 'duty') folder = 'piket';
    if (sec === 'calendar') folder = 'schedule';
    
    const outPath = path.join(__dirname, 'public', 'src', 'modules', 'admin', folder, `${folder}.html`);
    fs.writeFileSync(outPath, content);
    console.log(`Wrote ${outPath}`);
    
    replacedHtml = replacedHtml.replace(content, '');
  }
});

// Add the router outlet container right after the topbar header
const topbarEnd = `</header>`;
if (replacedHtml.includes(topbarEnd)) {
  replacedHtml = replacedHtml.replace(
    topbarEnd, 
    `${topbarEnd}\n      <!-- MODULAR ROUTER OUTLET -->\n      <div id="app-sections"></div>`
  );
}

fs.writeFileSync(adminHtmlPath, replacedHtml);
console.log('Updated admin.html');
