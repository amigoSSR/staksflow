const http = require('http');
const prisma = require('./prisma/client');

async function testDownload() {
  const report = await prisma.weeklyReport.findFirst();
  if (!report) {
    console.log("No reports found in DB");
    return;
  }
  console.log(`Testing download for report ID: ${report.id}`);

  // Note: Since the route is protected by adminMW, we can't easily hit it without a session.
  // Instead, let's write a small Express app that directly mounts the route handler without auth,
  // just to test what res.download() does with the file.
  
  const express = require('express');
  const path = require('path');
  const fs = require('fs');
  const app = express();

  app.get('/download-test', (req, res) => {
    try {
      const fullPath = path.join(__dirname, report.file_path);
      if (!fs.existsSync(fullPath)) return res.status(404).json({ error: 'File not found' });
      const safeFilename = path.basename(report.file_path);
      res.download(fullPath, safeFilename);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  const server = app.listen(0, () => {
    const port = server.address().port;
    console.log(`Test server running on port ${port}`);
    
    http.get(`http://localhost:${port}/download-test`, (res) => {
      console.log('--- Response Headers ---');
      console.log(res.headers);
      
      let data = '';
      res.on('data', chunk => {
        if (data.length < 500) data += chunk.toString();
      });
      res.on('end', () => {
        console.log('--- Response Body Preview ---');
        console.log(data.slice(0, 200));
        server.close();
        prisma.$disconnect();
      });
    });
  });
}

testDownload().catch(console.error);
