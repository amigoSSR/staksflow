const fs = require('fs');
const path = require('path');

const adminHtmlPath = path.join(__dirname, 'public', 'admin.html');
let html = fs.readFileSync(adminHtmlPath, 'utf8');

function extractModal(markerStart, markerEnd, fileDest) {
  const startIdx = html.indexOf(markerStart);
  if (startIdx === -1) return;
  const endIdx = html.indexOf(markerEnd, startIdx);
  if (endIdx === -1) return;
  
  const block = html.substring(startIdx, endIdx + markerEnd.length);
  
  // Append to dest
  if (fs.existsSync(fileDest)) {
    fs.appendFileSync(fileDest, '\n' + block + '\n');
  }
  
  // Remove from html
  html = html.replace(block, '');
}

extractModal('<!-- PROGRESS DETAIL MODAL -->', '      </div>\n    </main>', path.join(__dirname, 'public', 'src', 'modules', 'admin', 'progress', 'progress.html'));
extractModal('<!-- ROLE MODAL -->', '      </div>\n    </div>', path.join(__dirname, 'public', 'src', 'modules', 'admin', 'users', 'users.html'));
extractModal('<!-- HOUSE RULE MODAL -->', '      </div>\n    </div>', path.join(__dirname, 'public', 'src', 'modules', 'admin', 'house-rules', 'house-rules.html'));
extractModal('<!-- DUTY MODAL -->', '      </div>\n    </div>', path.join(__dirname, 'public', 'src', 'modules', 'admin', 'piket', 'piket.html'));
extractModal('<!-- CALENDAR SCHEDULE MODAL -->', '      </div>\n    </div>', path.join(__dirname, 'public', 'src', 'modules', 'admin', 'schedule', 'schedule.html'));

// Note: The PROGRESS modal extraction ends at </main>. Let's fix that.
// The PROGRESS modal is inside <main>. So we need to put </main> back if we removed it.
if (!html.includes('</main>')) {
  // It was removed. We need to add it before <!-- ROLE MODAL --> or whatever is next
  html = html.replace('<!-- ROLE MODAL -->', '</main>\n\n    <!-- ROLE MODAL -->');
  // Or just put it after app-sections
  if (html.indexOf('</main>') === -1) {
    html = html.replace('<div id="app-sections"></div>', '<div id="app-sections"></div>\n    </main>');
  }
}

fs.writeFileSync(adminHtmlPath, html.trim() + '\n');
console.log('Modals moved!');
