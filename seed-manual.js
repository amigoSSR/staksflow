const { PrismaClient } = require('./src/generated/client');
const prisma = new PrismaClient();

async function seed() {
  try {
    const user = await prisma.user.findFirst({ where: { role: 'admin' } });
    if (!user) {
      console.log('Admin user not found. Please register an admin first.');
      return;
    }

    const categories = [
      // USER CATEGORIES
      { name: 'Dashboard Overview', icon: 'bi-grid-1x2-fill', order: 1, access_role: 'user' },
      { name: 'My Projects', icon: 'bi-folder-fill', order: 2, access_role: 'user' },
      { name: 'Roadmap & Milestones', icon: 'bi-map-fill', order: 3, access_role: 'user' },
      { name: 'Activity Diary', icon: 'bi-journal-text', order: 4, access_role: 'user' },
      { name: 'Schedule / Calendar', icon: 'bi-calendar-event-fill', order: 5, access_role: 'user' },
      { name: 'Weekly Check-Up', icon: 'bi-file-earmark-pdf-fill', order: 6, access_role: 'user' },
      { name: 'Profile Settings', icon: 'bi-person-circle', order: 7, access_role: 'user' },
    ];

    for (const catData of categories) {
      const cat = await prisma.manualCategory.upsert({
        where: { name: catData.name },
        update: { icon: catData.icon, order: catData.order, access_role: catData.access_role },
        create: { ...catData, description: `Panduan penggunaan fitur ${catData.name}` }
      });

      await prisma.manualBook.create({
        data: {
          category_id: cat.id,
          title: `Pengenalan ${catData.name}`,
          order: 1,
          access_role: catData.access_role,
          created_by: user.id,
          content: `
            <h1>Selamat Datang di ${catData.name}!</h1>
            <p>Ini adalah panduan dasar untuk fitur ${catData.name}.</p>
            <div class="info-box">
              <i class="bi bi-info-circle"></i> Gunakan fitur ini untuk meningkatkan produktivitas tim Anda.
            </div>
            <h2>Langkah-langkah:</h2>
            <ul>
              <li>Buka menu <b>${catData.name}</b> di sidebar.</li>
              <li>Ikuti petunjuk yang muncul di layar.</li>
              <li>Selesaikan tugas Anda tepat waktu.</li>
            </ul>
            <div class="tip-box">
              <strong>Tips:</strong> Anda bisa mencari panduan lain menggunakan bar pencarian di sidebar Manual Book.
            </div>
          `
        }
      });
    }

    console.log('Manual Book seeded successfully with initial data!');
  } catch (e) {
    console.error('Seeding error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
