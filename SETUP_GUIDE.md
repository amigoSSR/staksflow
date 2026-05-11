# STAKS FLOW — Panduan Setup Lengkap

## Kenapa Data Gagal Tersimpan?
File `.env` belum ada dan Google Sheets API belum dikonfigurasi.
Ikuti langkah berikut secara berurutan.

---

## LANGKAH 1 — Install Node Packages

```bash
cd "d:\Project to-do-list"
npm install
```

---

## LANGKAH 2 — Buat Google Spreadsheet

1. Buka https://sheets.google.com
2. Buat spreadsheet baru → beri nama **STAKS FLOW DB**
3. Rename tab sheet pertama menjadi: **Tasks**
4. Baris 1 sudah otomatis dibuat oleh server, tapi boleh tambahkan manual:

   A=id | B=title | C=description | D=category | E=deadline | F=status | G=created_at

5. Salin Spreadsheet ID dari URL:
   ```
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID_DI_SINI]/edit
   ```

---

## LANGKAH 3 — Buat Google Service Account

### 3a. Aktifkan Google Sheets API
1. Buka https://console.cloud.google.com
2. Buat project baru (atau pilih yang sudah ada)
3. Klik "APIs & Services" -> "Enable APIs and Services"
4. Cari "Google Sheets API" -> Enable

### 3b. Buat Service Account
1. "APIs & Services" -> "Credentials"
2. Klik "+ CREATE CREDENTIALS" -> "Service account"
3. Isi nama: taskflow-service -> Create and Continue -> Done

### 3c. Download JSON Key
1. Klik service account yang baru dibuat
2. Tab "Keys" -> "ADD KEY" -> "Create new key" -> Format: JSON -> Create
3. File JSON otomatis ter-download

### 3d. Share Spreadsheet ke Service Account
1. Buka file JSON, salin nilai "client_email"
   Contoh: taskflow-service@your-project.iam.gserviceaccount.com
2. Buka spreadsheet -> klik Share
3. Paste client_email -> set ke Editor -> Send

---

## LANGKAH 4 — Buat File .env

Buat file `.env` di folder `d:\Project to-do-list\` dengan isi:

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=taskflow-service@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nISI_PRIVATE_KEY\n-----END RSA PRIVATE KEY-----"
SPREADSHEET_ID=1AbCdEfGhIjKlMnOpQrStUvWxYz
PORT=3000
```

Cara mengisi dari file JSON yang didownload:
- "client_email"  -> GOOGLE_SERVICE_ACCOUNT_EMAIL
- "private_key"   -> GOOGLE_PRIVATE_KEY (salin apa adanya termasuk \n)
- URL Spreadsheet -> SPREADSHEET_ID

---

## LANGKAH 5 — Jalankan Aplikasi

```bash
npm run dev
```

Buka browser: http://localhost:3000

---

## Verifikasi

Buka: http://localhost:3000/api/health
Harus muncul: {"status":"OK","message":"Server is running"}

---

## Troubleshooting

| Error                              | Solusi                                          |
|------------------------------------|-------------------------------------------------|
| invalid_grant                      | Cek email service account di .env              |
| The caller does not have permission| Share spreadsheet ke service account           |
| Unable to parse range: Tasks!A:G   | Rename tab sheet menjadi "Tasks"               |
| Cannot find module                 | Jalankan npm install                           |
| EADDRINUSE: port 3000              | Ubah PORT=3001 di .env                         |
