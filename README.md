# PNS Lab Website

Website **Programming & Network Security Lab** Telkom University Purwokerto. Situs ini menampilkan profil laboratorium, area riset, publikasi, organisasi, berita, serta dokumentasi praktikum. Konten tertentu dapat dikelola melalui dashboard admin.

## Fitur

- Halaman profil dan informasi laboratorium.
- Daftar area riset, publikasi, anggota organisasi, dan berita.
- Dokumentasi praktikum beserta foto dan file modul.
- Dashboard admin untuk mengelola konten dan dokumentasi praktikum.
- Login admin dengan password yang di-hash dan sesi bertanda tangan.

## Teknologi

- [Next.js](https://nextjs.org/) 16 dengan App Router
- React 19 dan TypeScript
- Tailwind CSS 4
- SQLite, Drizzle ORM, dan `better-sqlite3`

## Menjalankan secara lokal

### Prasyarat

- Node.js yang kompatibel dengan Next.js 16
- npm

### Instalasi

1. Clone repository, lalu masuk ke folder proyek.
2. Pasang dependency:

   ```bash
   npm install
   ```

3. Siapkan konfigurasi lokal:

   ```bash
   cp .env.example .env.local
   ```

4. Buat password admin. Perintah ini akan meminta password secara tersembunyi dan mengisi hash serta secret sesi di `.env.local`:

   ```bash
   npm run admin:hash
   ```

   Gunakan password minimal 12 karakter. Jangan bagikan atau commit `.env.local`.

5. Buat tabel SQLite dan isi data awal dari `data/db.json`:

   ```bash
   npm run db:push
   npm run db:migrate-json
   ```

   Migrasi JSON mengganti data area riset, publikasi, tim, organisasi, dan berita di database lokal dengan isi `data/db.json`. Database SQLite dan file upload tidak disimpan di Git.

6. Jalankan server pengembangan:

   ```bash
   npm run dev
   ```

   Buka [http://localhost:3002](http://localhost:3002).

## Halaman

| URL | Keterangan |
| --- | --- |
| `/` | Beranda dan informasi laboratorium |
| `/praktikum` | Dokumentasi kegiatan praktikum |
| `/login` | Login administrator |
| `/admin` | Dashboard pengelolaan konten (memerlukan login) |

## Perintah yang tersedia

| Perintah | Kegunaan |
| --- | --- |
| `npm run dev` | Menjalankan server pengembangan di port 3002 |
| `npm run build` | Membuat build produksi |
| `npm start` | Menjalankan build produksi di port 3002 |
| `npm run lint` | Memeriksa kode dengan ESLint |
| `npm run admin:hash` | Mengatur password admin dan secret sesi |
| `npm run db:push` | Membuat atau memperbarui skema SQLite |
| `npm run db:migrate-json` | Mengimpor data awal dari `data/db.json` |
| `npm run db:studio` | Membuka Drizzle Studio untuk melihat database |

## Catatan deployment

Atur `ADMIN_PASSWORD_HASH` dan `ADMIN_SESSION_SECRET` sebagai environment variables di server produksi. Password admin dapat di-hash secara lokal dengan `npm run admin:hash`; salin hanya nilai hash yang dihasilkan secara lokal ke konfigurasi server, dan buat secret sesi yang unik serta rahasia. Jangan gunakan `.env.local` dari komputer lokal sebagai file deployment.

Aplikasi menyimpan database SQLite di `data/school.db` dan file praktikum di `data/uploads/`. Pastikan lingkungan deployment menyediakan penyimpanan persisten dan dapat ditulis untuk lokasi tersebut; penyimpanan sementara dapat menyebabkan database atau file unggahan hilang saat aplikasi dimulai ulang atau di-deploy ulang.
