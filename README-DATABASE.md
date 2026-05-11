# 🗄️ STAKS FLOW — Database & Server Architecture Documentation

Aplikasi STAKS FLOW Anda sekarang telah sepenuhnya bermigrasi dari Google Sheets ke **Database Lokal / Server-side Relational Database** menggunakan **Prisma ORM**. 

Sistem ini jauh lebih **cepat, secure, offline-friendly**, dan **scalable** layaknya aplikasi production modern.

---

## 1. 📂 Struktur Folder Baru (Clean Architecture)
Struktur project sekarang terpusat pada sistem API dan Prisma ORM.

```text
d:\Project to-do-list\
├── prisma/
│   ├── schema.prisma   # Skema database & konfigurasi ORM
│   ├── client.js       # Instance PrismaClient terpusat
│   └── dev.db          # (Local) File SQLite database Anda saat ini
├── routes/
│   ├── auth.js         # Endpoint login & register (menggunakan Prisma)
│   ├── tasks.js        # Endpoint CRUD Task harian (menggunakan Prisma)
│   └── admin.js        # Endpoint Dashboard Admin (menggunakan Prisma)
├── services/
│   └── authService.js  # Layer logic Auth & Bcrypt password hashing
├── middleware/
│   ├── auth.js         # JWT Token verifier
│   └── admin.js        # RBAC (Role-based Access Control) untuk admin
├── public/             # File Frontend (HTML, CSS, JS) - Tidak berubah, 100% decoupling!
├── server.js           # Entry point Express backend
├── migrate.js          # Script migrasi satu-kali dari Google Sheets & SQLite lama
├── .env                # Variabel Environment (termasuk DATABASE_URL)
└── package.json
```

---

## 2. 🗃️ SQL Schema (Prisma)
Kita menggunakan Prisma ORM. Berikut adalah relasi tabelnya.

```prisma
model User {
  id              String           @id @default(uuid())
  username        String           @unique
  email           String           @unique
  password        String
  role            String           @default("user")
  created_at      DateTime         @default(now())

  tasks           Task[]           // 1-to-many
  activities      ActivityLog[]    // 1-to-many
  progressReports ProgressReport[] // 1-to-many
  @@map("users")
}

model Task {
  id          String   @id @default(uuid())
  title       String
  description String?
  category    String   @default("daily")
  deadline    String?
  status      String   @default("pending")
  created_at  DateTime @default(now())
  updated_at  DateTime @updatedAt
  user_id     String
  user        User     @relation(fields: [user_id], references: [id], onDelete: Cascade)
  @@map("tasks")
}

model ActivityLog {
  id         String   @id @default(uuid())
  action     String
  task_title String?
  category   String?
  timestamp  DateTime @default(now())
  user_id    String
  user       User     @relation(fields: [user_id], references: [id], onDelete: Cascade)
  @@map("activity_logs")
}
```

---

## 3. ⚡ Cara Mengubah Database (Migrasi ke MySQL / PostgreSQL)
Saat ini server dikonfigurasi dengan `SQLite` agar **bisa langsung jalan di PC Anda (Zero-config)**. Namun, jika Anda ingin lanjut ke level Production (MySQL / PostgreSQL), ikuti langkah sangat mudah ini:

1. Buka file `prisma/schema.prisma`
2. Ubah `provider = "sqlite"` menjadi `provider = "mysql"`
3. Buka file `.env` dan ubah nilai URL-nya sesuai akun MySQL Anda:
   ```env
   DATABASE_URL="mysql://root:password123@localhost:3306/taskflow_db"
   ```
4. Buka terminal dan jalankan:
   ```bash
   npx prisma db push
   ```
   *(Perintah ini akan membaca skema Prisma Anda dan otomatis membangun tabel `users`, `tasks`, dan `activity_logs` di dalam MySQL!)*

---

## 4. 🚀 Cara Setup & Menjalankan Project (Local / Dev)

Untuk menjalankan environment development secara lokal:
```bash
# 1. Install semua dependency (jika belum)
npm install

# 2. Sinkronisasi database Prisma
npx prisma db push
npx prisma generate

# 3. Jalankan server backend & frontend (Live Reload)
npm run dev
```

---

## 5. 🌍 Cara Deploy ke VPS (Production)

Gunakan **PM2** dan **Nginx** sebagai reverse proxy:

1. **Clone repo** ke dalam VPS Anda (Ubuntu disarankan).
2. Install Node.js dan jalankan `npm install`.
3. Buat file `.env` Production (pastikan mengisi `DATABASE_URL` MySQL/PostgreSQL dan `JWT_SECRET` yang kuat).
4. Build database: `npx prisma db push` dan `npx prisma generate`.
5. Install PM2: `npm install -g pm2`.
6. **Jalankan Aplikasi:**
   ```bash
   pm2 start server.js --name "taskflow"
   pm2 save
   pm2 startup
   ```
7. Setup **Nginx** agar domain Anda (misal `app.taskflow.com`) me-reverse proxy traffic ke port lokal `http://127.0.0.1:3000`.

---

## 6. 💾 Cara Backup & Restore Database

### Jika Menggunakan SQLite (Saat ini)
- **Backup:** Cukup copy file `prisma/dev.db` dan simpan ke cloud/harddisk. File ini berisi *seluruh* data Anda.
- **Restore:** Taruh kembali file `dev.db` ke folder `prisma/` lalu jalankan server.

### Jika Menggunakan MySQL
- **Backup (Dump):** 
  ```bash
  mysqldump -u root -p taskflow_db > backup_taskflow_tanggal.sql
  ```
- **Restore:**
  ```bash
  mysql -u root -p taskflow_db < backup_taskflow_tanggal.sql
  ```

---

## 7. 🔗 Ringkasan API Endpoint (RESTful API)
*(Semua endpoint menggunakan format JSON dan dilindungi JWT Bearer Token `Authorization: Bearer <token>`)*

**Auth (`/api/auth`)**
- `POST /register`
- `POST /login`
- `GET /me`

**Tasks (`/api/tasks`)**
- `GET /` (Query: `?category=x&sort=y`)
- `POST /` (Buat task)
- `PUT /:id` (Edit task)
- `PATCH /:id/status` (Toggle Done/Pending)
- `DELETE /:id`

**Admin (`/api/admin`)**
- `GET /stats`
- `GET /users`
- `DELETE /users/:id`
- `GET /tasks`
- `GET /progress` (Dashboard Monitoring)
- `GET /progress/:userId` (Detail performa individu)

*(Frontend sudah dikoding untuk secara otomatis membaca `/api/...`, jadi frontend **TIDAK PERLU DIUBAH SAMA SEKALI** dan sudah otomatis berjalan dengan database Prisma!)*
