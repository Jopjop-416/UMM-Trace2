# UMM Trace - Sistem Pelacakan Alumni Publik

Aplikasi ini adalah prototipe dasbor admin kampus untuk melacak jejak digital alumni melalui sumber publik (LinkedIn, Google Scholar, ResearchGate, dll). Aplikasi ini dirancang untuk memenuhi 10 langkah alur pelacakan (pseudocode) yang telah ditentukan.

## Fitur Terbaru (Pembaruan UI & Autentikasi)

Aplikasi ini telah diperbarui dengan antarmuka bergaya modern (Vercel-style) dan fitur autentikasi simulasi:

*   **Halaman Login:** Antarmuka login minimalis dan bersih. Menggunakan kredensial simulasi (`admin@gmail.com` / `admin12345`) untuk masuk ke dasbor.
*   **Menu Dropdown Profil (Avatar):** Terletak di pojok kanan atas dasbor. Memungkinkan pengguna melihat info akun, mengakses halaman pengaturan, dan melakukan *logout*.
*   **Halaman Pengaturan (Settings):** Antarmuka pengaturan komprehensif dengan tab navigasi (Umum, Notifikasi, Keamanan, API Keys) untuk mengelola preferensi akun dan sistem.
*   **Proteksi Rute (Route Protection):** Pengguna yang belum login akan diarahkan ke halaman login. Pengguna yang sudah login tidak bisa kembali ke halaman login tanpa melakukan *logout*.

## Pemenuhan Alur Pelacakan (Pseudocode)

Aplikasi ini telah mengimplementasikan alur pelacakan dalam bentuk antarmuka pengguna (UI) dan simulasi logika (*mock data*):

1. **Profil Target Pencarian:** Diimplementasikan pada menu **Data Alumni**. Admin dapat menambahkan alumni baru dengan status awal "Belum Dilacak".
2. **Sumber & Prioritas:** Diimplementasikan pada menu **Scheduler (Jobs)** di bagian "Prioritas Sumber" (Google Scholar, LinkedIn, Web Umum).
3. **Job Pelacakan Berkala:** Diimplementasikan pada menu **Scheduler** dengan fitur "Jalankan Manual" yang menyimulasikan proses pencarian.
4. **Search Queries:** (Logika di belakang layar/simulasi) Sistem menghasilkan kueri berdasarkan nama dan prodi.
5. **Mengambil Hasil Pencarian:** (Simulasi) Saat scheduler dijalankan, sistem "mengambil" data dan memperbarui status alumni.
6. **Ekstrak Sinyal Identitas:** Diimplementasikan pada menu **Profil Alumni** (Jejak Digital) yang menampilkan role, lokasi, dan tahun aktivitas.
7. **Disambiguasi (Scoring):** Diimplementasikan pada menu **Verifikasi**. Sistem menampilkan *Match Score* (Kemungkinan Kuat/Perlu Verifikasi) berdasarkan kecocokan nama, afiliasi, dan timeline.
8. **Menetapkan Status:** Status otomatis berubah menjadi "Teridentifikasi", "Perlu Verifikasi", atau "Belum Ditemukan" setelah scheduler berjalan.
9. **Cross-Validation:** Diimplementasikan pada menu **Profil Alumni** di mana satu alumni bisa memiliki beberapa sumber (misal: LinkedIn & Scholar) yang saling menguatkan.
10. **Jejak Bukti:** Diimplementasikan pada menu **Profil Alumni** (Riwayat Pelacakan & Bukti Tautan).

---

## Pengujian Aplikasi (Berdasarkan Aspek Kualitas)

Berikut adalah hasil pengujian aplikasi berdasarkan aspek kualitas perangkat lunak (ISO 25010 / Kebutuhan Desain):

| ID | Skenario Pengujian | Aspek Kualitas | Hasil yang Diharapkan | Hasil Pengujian | Status |
|---|---|---|---|---|---|
| TC-01 | Login menggunakan kredensial yang valid (`admin@gmail.com`). | **Security & Functionality** | Pengguna berhasil masuk dan diarahkan ke halaman Dashboard. | Berhasil login dan masuk ke Dashboard. | ✅ Pass |
| TC-02 | Mengakses halaman Dashboard tanpa login. | **Security** | Pengguna ditolak dan diarahkan kembali ke halaman Login. | *Route protection* berfungsi, *redirect* ke Login. | ✅ Pass |
| TC-03 | Melakukan *Logout* melalui menu *dropdown* avatar. | **Functionality** | Sesi pengguna dihapus dan diarahkan kembali ke halaman Login. | Berhasil *logout* dan kembali ke Login. | ✅ Pass |
| TC-04 | Menambahkan data alumni baru melalui modal "Tambah Data". | **Functionality** (Fungsionalitas) | Data baru berhasil masuk ke tabel dengan status default "Belum Dilacak". | Data tersimpan dan tampil di tabel dengan status "Belum Dilacak". | ✅ Pass |
| TC-05 | Menjalankan "Scheduler Manual" pada menu Jobs. | **Reliability** (Keandalan) | Sistem memproses data "Belum Dilacak", mengubah status secara acak menjadi "Teridentifikasi" atau "Perlu Verifikasi", dan mencatat riwayat job. | Status alumni berubah, riwayat job bertambah, dan antrean verifikasi muncul. | ✅ Pass |
| TC-06 | Melakukan pencarian dan filter status pada menu "Data Alumni". | **Functionality** (Fungsionalitas) | Tabel hanya menampilkan data yang sesuai dengan kata kunci pencarian dan filter *dropdown* status. | Tabel terfilter secara *real-time* sesuai input pengguna. | ✅ Pass |
| TC-07 | Menyetujui (Approve) atau Menolak (Reject) kandidat pada menu "Verifikasi". | **Functionality** (Fungsionalitas) | Jika disetujui, status alumni menjadi "Teridentifikasi". Jika ditolak, status menjadi "Belum Ditemukan". Antrean verifikasi berkurang. | Status di tabel alumni berubah sesuai aksi, dan item hilang dari antrean verifikasi. | ✅ Pass |
| TC-08 | Mengubah preferensi pada halaman Pengaturan (Settings). | **Functionality** | Perubahan *toggle* dan input form dapat dilakukan dengan mulus. | Form interaktif dan merespons input dengan baik. | ✅ Pass |
| TC-09 | Navigasi antar menu (Dashboard, Alumni, Jobs, Verifikasi, Profil, Settings). | **Usability** (Kebergunaan) | Perpindahan halaman berjalan mulus tanpa *reload* halaman (SPA), *state* tetap terjaga. | Transisi halaman instan, *active state* pada *sidebar* sesuai. | ✅ Pass |
| TC-10 | Tampilan antarmuka pada berbagai ukuran layar (Responsivitas). | **Portability** (Portabilitas) | Elemen UI (tabel, *grid*, *card*) menyesuaikan ukuran layar tanpa *layout* yang rusak. | UI responsif, tabel dapat di-*scroll* horizontal pada layar kecil. | ✅ Pass |
| TC-11 | Kecepatan respons interaksi UI (klik tombol, buka modal, filter). | **Performance** (Kinerja) | Interaksi merespons dalam waktu < 1 detik tanpa *lag*. | Animasi *fade-in* dan transisi berjalan mulus dan instan. | ✅ Pass |
| TC-12 | Kejelasan informasi *Match Score* dan Sumber Data pada Profil. | **Usability** (Kebergunaan) | Pengguna dapat dengan mudah membaca indikator warna (hijau/kuning/merah) dan sumber bukti pelacakan. | Indikator visual jelas, tipografi mudah dibaca, hierarki informasi baik. | ✅ Pass |

