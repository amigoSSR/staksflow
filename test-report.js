const { generateWeeklyReports } = require('./services/weeklyReportService');

async function test() {
  console.log('Testing weekly report generation...');
  try {
    // Generate for the current week (which will look at last week)
    const result = await generateWeeklyReports();
    console.log('Result:', JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
}

test();
