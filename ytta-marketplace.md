# Spec: Bot Pemesanan Makanan Diaspora (Single Vendor)

**Versi**: 1.0
**Status**: Draft — siap direview sebelum implementasi
**Tipe bot**: Template/tombol-driven (bukan free-form AI chat)

---

## 1. Problem Statement

Diaspora dari negara X yang tinggal di negara Y kesulitan mendapatkan makanan khas negara asal mereka secara rutin. Toko/vendor makanan negara X yang ada di negara Y masih melayani pemesanan secara manual (chat WA/IG personal), yang lambat, rawan salah catat, dan tidak ada jejak status order yang jelas bagi customer maupun admin.

Solusi: bot Telegram berbasis tombol/template yang menuntun customer dari lihat menu sampai konfirmasi pengambilan, dengan seluruh data tersimpan di RDBMS sejak awal — tanpa bergantung pada AI generatif di jalur utama.

---

## 2. Goals

1. Customer bisa menyelesaikan pemesanan penuh (lihat menu → checkout → bayar) tanpa mengetik teks bebas, kecuali saat upload bukti transfer.
2. Semua order tersimpan otomatis ke database — nol pencatatan manual oleh admin untuk data order.
3. Admin bisa verifikasi pembayaran dan update status order dalam ≤3 tindakan (klik tombol), bukan tulis ulang di spreadsheet.
4. Customer bisa cek status order miliknya sendiri kapan saja tanpa nanya admin.
5. Response time bot untuk setiap interaksi tombol < 2 detik.

## 3. Non-Goals

- **Multi-vendor/marketplace** — di luar scope versi ini; skema data dirancang agar *bisa* diperluas nanti, tapi UI dan alur tetap single vendor.
- **AI generative chat sebagai jalur utama** — LLM (kalau dipakai) hanya sebagai fallback ringan di "Tanya Admin", bukan penentu alur order.
- **Delivery/pengantaran** — asumsi awal customer ambil sendiri di lokasi. Delivery jadi pertimbangan fase berikutnya.
- **Payment gateway otomatis di v1** — MVP pakai transfer manual + upload bukti; integrasi Midtrans/Xendit masuk fase 2 (alasan: butuh registrasi bisnis & KYC yang makan waktu, tidak boleh memblokir MVP).
- **Multi-bahasa penuh** — v1 hanya satu bahasa utama (ditentukan di Open Questions); bilingual UI masuk pertimbangan fase berikutnya.

---

## 4. User Stories

**Customer**
- Sebagai customer, saya ingin melihat daftar menu per kategori dengan tombol, supaya saya tidak perlu mengetik nama produk.
- Sebagai customer, saya ingin menambah beberapa item ke keranjang sebelum checkout, supaya saya bisa belanja lebih dari satu jenis makanan sekaligus.
- Sebagai customer, saya ingin mendapat instruksi pembayaran otomatis (nominal + rekening/QRIS) setelah konfirmasi order, supaya saya tidak perlu tanya admin.
- Sebagai customer, saya ingin mengecek status order saya (pending/lunas/siap diambil) kapan saja, supaya saya tahu kapan harus datang ke toko.
- Sebagai customer, saya ingin bertanya hal di luar menu (mis. "ada yang halal?") dan pesan saya diteruskan ke admin, supaya pertanyaan non-standar tetap terjawab.

**Admin**
- Sebagai admin, saya ingin menerima notifikasi Telegram saat ada bukti transfer masuk, supaya saya bisa verifikasi cepat.
- Sebagai admin, saya ingin update status order lewat tombol (bukan edit manual), supaya customer otomatis dapat notifikasi tanpa saya ketik ulang.
- Sebagai admin, saya ingin melihat riwayat order per customer, supaya saya bisa deteksi pelanggan berulang atau pola order.

---

## 5. Arsitektur & Data Model

### 5.1 Ringkasan Alur Data
`Telegram webhook → Laravel controller → state machine (bot_sessions) → RDBMS (orders, products, payments) → notifikasi balik ke Telegram`

### 5.2 Skema Tabel (RDBMS — MySQL/PostgreSQL)

**customers**
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint PK | |
| telegram_chat_id | string, unique | identitas utama customer |
| nama | string | diambil dari profil Telegram atau diisi manual saat order pertama |
| no_hp | string, nullable | opsional, diisi saat checkout pertama |
| created_at | timestamp | |

**products**
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint PK | |
| kategori | string | mis. "Makanan Berat", "Snack", "Bumbu/Sembako" |
| nama | string | |
| harga | decimal | |
| stok | int | dikurangi otomatis saat order dikonfirmasi |
| foto_url | string, nullable | |
| aktif | boolean | untuk sembunyikan produk tanpa hapus data |

**orders**
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint PK | |
| order_code | string, unique | format mis. ORD0001, ditampilkan ke customer |
| customer_id | FK → customers | |
| status | enum | pending, verifikasi, lunas, diproses, siap_diambil, selesai, batal |
| total | decimal | |
| created_at / updated_at | timestamp | |

**order_items**
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint PK | |
| order_id | FK → orders | |
| product_id | FK → products | |
| qty | int | |
| harga_satuan | decimal | snapshot harga saat order (bukan reference live ke products.harga) |
| subtotal | decimal | |

**payments**
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint PK | |
| order_id | FK → orders | |
| metode | enum | transfer_manual, qris (gateway masuk fase 2) |
| nominal | decimal | |
| bukti_url | string, nullable | path gambar bukti transfer |
| status | enum | pending, lunas, tidak_valid |
| verified_by | string, nullable | admin_id/nama admin yang verifikasi |
| verified_at | timestamp, nullable | |

**bot_sessions**
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint PK | |
| telegram_chat_id | string, unique | |
| current_step | string | lihat daftar step di §6 |
| cart_data | JSON | keranjang sementara sebelum jadi order |
| updated_at | timestamp | untuk deteksi session expired/timeout |

**admin_fallback_messages**
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint PK | |
| customer_id | FK → customers | |
| pesan | text | pesan bebas dari customer |
| status | enum | baru, dibalas | |

---

## 6. State Machine Bot (Alur Template)

| Step (current_step) | Trigger tombol | Aksi sistem | Step berikutnya |
|---|---|---|---|
| `start` | `/start` | Tampilkan menu utama | `main_menu` |
| `main_menu` | "Lihat Menu" | Query kategori aktif dari `products` | `pilih_kategori` |
| `main_menu` | "Cek Status Order" | Query order terakhir customer | `cek_status` |
| `main_menu` | "Tanya Admin" | Set mode terima teks bebas | `admin_fallback` |
| `pilih_kategori` | pilih kategori | Query produk dalam kategori | `pilih_item` |
| `pilih_item` | pilih produk | Tampilkan pilihan qty | `pilih_qty` |
| `pilih_qty` | pilih angka qty | Simpan ke `cart_data` (JSON di bot_sessions) | `konfirmasi_item` |
| `konfirmasi_item` | "Tambah item lain" / "Checkout" | Balik ke `pilih_kategori` atau lanjut | `pilih_kategori` / `checkout` |
| `checkout` | "Konfirmasi" | Buat row `orders` + `order_items` dari `cart_data`, generate `order_code` | `pilih_metode_bayar` |
| `pilih_metode_bayar` | pilih metode | Hitung nominal, buat row `payments` (status=pending) | `instruksi_bayar` |
| `instruksi_bayar` | (tampilkan info) | Kirim nomor rekening/QRIS + nominal | `menunggu_bukti` |
| `menunggu_bukti` | upload foto | Simpan `bukti_url`, notifikasi admin | `menunggu_verifikasi` |
| `menunggu_verifikasi` | (admin aksi) | Admin klik "Valid"/"Tidak Valid" di chat admin | order.status → `lunas` atau kembali minta bukti |
| `admin_fallback` | teks bebas | Simpan ke `admin_fallback_messages`, forward ke admin | tetap di `admin_fallback` sampai admin balas |

Catatan: transisi status order (`diproses` → `siap_diambil` → `selesai`) dilakukan lewat aksi admin di sisi admin, bukan bagian dari state machine customer — trigger notifikasi ke customer secara otomatis setiap kali status berubah.

---

## 7. API / Webhook Contract (ringkas)

| Endpoint | Method | Fungsi |
|---|---|---|
| `/webhook/telegram` | POST | Entry point utama dari Telegram Bot API, routing berdasarkan `current_step` + `callback_data` |
| `/internal/orders` | POST | Dipanggil dari webhook handler saat checkout dikonfirmasi |
| `/internal/payments/{id}/verify` | POST | Dipanggil saat admin klik tombol verifikasi di chat admin |
| `/internal/orders/{id}/status` | PATCH | Update status order, trigger notifikasi Telegram ke customer |
| `/webhook/payment-gateway` | POST | *(fase 2)* callback otomatis dari Midtrans/Xendit |

---

## 8. Requirements (MoSCoW)

**Must-Have (P0)**
- [ ] Alur lihat menu → pilih item → qty → keranjang sepenuhnya tombol
- [ ] Order tersimpan otomatis ke RDBMS dengan `order_code` unik
- [ ] Instruksi pembayaran otomatis setelah checkout
- [ ] Upload bukti transfer + notifikasi ke admin
- [ ] Admin verifikasi via tombol (Valid/Tidak Valid)
- [ ] Update status order memicu notifikasi otomatis ke customer
- [ ] Fallback "Tanya Admin" untuk pertanyaan di luar skrip

**Should-Have (P1)**
- [ ] Cek status order mandiri oleh customer
- [ ] Riwayat order per customer (untuk deteksi repeat customer)
- [ ] Timeout session — kalau customer diam >30 menit di tengah alur, keranjang tetap tersimpan tapi ada reminder

**Could-Have (P2, arsitektur harus mendukung tanpa perlu refactor besar)**
- [ ] Integrasi payment gateway otomatis (Midtrans/Xendit)
- [ ] Dashboard admin berbasis React (menggantikan interaksi via chat admin)
- [ ] Dukungan bilingual
- [ ] Opsi delivery selain ambil di toko

---

## 9. Acceptance Criteria (contoh)

**Checkout & pembayaran**
- Given customer sudah menambahkan minimal 1 item ke keranjang
- When customer menekan "Checkout"
- Then sistem membuat 1 row `orders` + N row `order_items`, dan tidak boleh membuat order kosong (0 item)

- Given customer sudah menerima instruksi pembayaran
- When customer upload foto bukti transfer
- Then admin menerima notifikasi berisi order_code, nominal, dan foto dalam ≤5 detik

**Verifikasi pembayaran**
- Given admin menerima bukti transfer
- When admin menekan "Valid"
- Then `payments.status` → `lunas`, `orders.status` → `lunas`, customer menerima notifikasi otomatis
- Given admin menekan "Tidak Valid"
- Then customer diminta kirim ulang bukti, order **tidak** berubah status ke `lunas`

**Fallback admin**
- Given customer menekan "Tanya Admin" dan mengetik pertanyaan bebas
- When pesan terkirim
- Then pesan tersimpan di `admin_fallback_messages` dan diteruskan ke chat admin, bot tidak mencoba menjawab otomatis

---

## 10. Non-Functional Requirements

- Response time tiap interaksi tombol < 2 detik (P95)
- Pembuatan order harus idempotent — retry webhook Telegram tidak boleh membuat order duplikat (gunakan `update_id` Telegram sebagai idempotency key)
- Foto bukti transfer disimpan di storage privat (bukan public bucket), akses hanya lewat signed URL untuk admin
- Semua perubahan status order tercatat dengan timestamp (audit trail sederhana, bisa 1 kolom `status_history` JSON atau tabel terpisah)
- Validasi stok: qty yang dipesan tidak boleh melebihi `products.stok` saat checkout

---

## 11. Open Questions

- **[Product]** ~~Apakah pengambilan hanya di satu lokasi toko, atau sudah perlu opsi delivery di v1?~~
  → **Keputusan**: 1 toko/1 lokasi pengambilan dulu. Delivery belum masuk v1 (konsisten dengan Non-Goals §3).
- **[Product]** ~~Apakah dibutuhkan dukungan bilingual sejak v1?~~
  → **Keputusan**: Hanya Bahasa Indonesia untuk v1. Tidak ada dukungan bilingual di web maupun bot.
- **[Engineering]** Berapa lama SLA sebelum bukti transfer yang belum diverifikasi dianggap kedaluwarsa dan order otomatis dibatalkan?
  → **Status**: Belum ditentukan — perlu diputuskan sebelum implementasi fitur pembatalan otomatis (§9 Acceptance Criteria bagian verifikasi pembayaran).
- **[Product]** ~~Apakah "Tanya Admin" tetap 100% manual, atau nanti diberi lapisan AI tipis?~~
  → **Keputusan**: AI hanya menjawab pertanyaan umum/FAQ (lihat §13), tidak menyentuh alur order. Sesuai desain hybrid Template + AI Service Layer.

---

## 12. Fasing Implementasi

| Fase | Cakupan |
|---|---|
| **Fase 1 — MVP** | State machine dasar, tabel inti (customers, products, orders, order_items, payments, bot_sessions), transfer manual + verifikasi manual admin via tombol Telegram |
| **Fase 2 — Otomasi Pembayaran** | Integrasi payment gateway (Midtrans/Xendit), hilangkan ketergantungan verifikasi manual |
| **Fase 3 — Admin Experience** | Dashboard React menggantikan interaksi lewat chat admin, laporan penjualan |
| **Fase 4 — Ekspansi (belum di-scope)** | Delivery, bilingual, evaluasi kebutuhan multi-vendor |

---

## 13. Addendum: Perubahan Scope — Web Marketplace + Bot sebagai Notifikasi & AI FAQ

> Bagian ini menggantikan asumsi di §1 dan §6 bahwa bot Telegram adalah jalur pemesanan utama. Berdasarkan diskusi lanjutan dengan client, scope berubah menjadi web-first marketplace, dengan bot berperan sebagai kanal notifikasi dan asisten FAQ berbasis AI.

### 13.1 Perubahan Peran Bot

| Fungsi | Sebelumnya (§6) | Sekarang |
|---|---|---|
| Browsing produk, pilih qty, checkout | Alur utama di bot | Pindah ke web app (React) — marketplace-style: grid produk, kategori, search |
| Notifikasi status order | Bagian dari alur bot | Tetap, jadi **fungsi utama** bot |
| Kirim lokasi pengambilan | Ada | Tetap ada |
| "Tanya Admin" (fallback teks bebas) | Diteruskan manual ke admin | Dipecah dua: **Tombol Template** (jawaban statis instan) + **AI Service Layer** (untuk pertanyaan teks bebas, scope terbatas FAQ/rekomendasi produk) |
| Proses order | Bot yang membuat order | **AI tidak memproses order** — order tetap 100% lewat web, AI hanya menjawab pertanyaan |

### 13.2 Menghubungkan Akun Web ↔ Chat Telegram (Deep-Link Token)

Karena order dibuat di web (identitas: nomor HP/nama) sementara notifikasi dikirim lewat Telegram (identitas: `chat_id`), dibutuhkan mekanisme linking:

1. Halaman "Order Berhasil" di web menampilkan tombol `https://t.me/namatoko_bot?start=<token>`
2. `<token>` adalah string sekali-pakai yang di-generate saat order dibuat, terhubung ke `customer_id`
3. Saat customer menekan tombol dan "Start" di Telegram, webhook menerima `/start <token>`
4. Laravel decode token → simpan `update.message.chat.id` ke `customers.telegram_chat_id`
5. Selanjutnya seluruh notifikasi order customer tersebut otomatis terkirim ke `chat_id` itu

**Kolom tambahan pada tabel `customers`:**

| Kolom | Tipe | Keterangan |
|---|---|---|
| `telegram_chat_id` | string, nullable, unique | null jika belum link |
| `telegram_link_token` | string, nullable | token sementara, satu kali pakai, expired 1x24 jam |
| `telegram_linked_at` | timestamp, nullable | audit |

### 13.3 Tabel Tambahan — Template & AI FAQ

**faq_templates**
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint PK | |
| pertanyaan | string | Teks tombol template, mis. "Jam Operasional & Lokasi" |
| jawaban_statis | text | Jawaban tetap, tidak lewat AI |
| kategori | string | Untuk pengelompokan di admin |
| urutan_tampil | int | Urutan tombol muncul di bot |

**ai_conversations**
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint PK | |
| customer_id | FK → customers | |
| pertanyaan | text | Input bebas dari customer |
| jawaban | text | Output AI |
| data_produk_dipakai | JSON | ID produk yang disuntikkan ke prompt (untuk audit) |
| escalated | boolean | true jika akhirnya diteruskan ke admin |
| created_at | timestamp | |

### 13.4 Alur Bot (Hybrid Template + AI)

```
Pesan Masuk
 |- Tombol Template -> Jawaban Statis (faq_templates), instan, tanpa AI
 `- Teks Bebas -> AI Service Layer
                   |- Ambil data produk relevan dari DB (bukan dari ingatan model)
                   |- Panggil LLM API dengan system prompt dibatasi ketat
                   `- Kalau AI tidak yakin/di luar scope -> Eskalasi ke Admin
```

### 13.5 Prinsip Desain AI Service Layer

AI **hanya boleh menyusun kalimat, tidak boleh menentukan angka**. Setiap kali dipanggil, sistem query database dulu untuk data produk relevan (harga, stok, kategori), lalu data itu disuntikkan ke prompt sebagai fakta — model tidak boleh mengarang dari training data.

```php
class AiFaqService
{
    public function answer(string $pertanyaan, Customer $customer): string
    {
        $produkRelevan = $this->productSearch->findRelevant($pertanyaan); // max 5-10 produk

        if ($this->rateLimiter->tooManyRequests($customer, limit: 20, per: 'day')) {
            return "Maaf, kamu sudah mencapai batas tanya-jawab hari ini. Hubungi admin langsung ya.";
        }

        $systemPrompt = <<<PROMPT
        Kamu adalah asisten toko {$this->storeName}. Jawab HANYA berdasarkan data produk berikut, jangan mengarang harga/stok:
        {$produkRelevan->toPromptFormat()}

        Aturan:
        - Kalau data tidak tersedia di atas, katakan tidak tahu dan sarankan hubungi admin.
        - JANGAN memproses order, ubah status, atau menjanjikan hal di luar data ini.
        - Kalau pertanyaan di luar topik toko/makanan, tolak dengan sopan.
        PROMPT;

        $response = $this->llmClient->complete($systemPrompt, $pertanyaan);

        AiConversation::create([
            'customer_id' => $customer->id,
            'pertanyaan' => $pertanyaan,
            'jawaban' => $response,
            'data_produk_dipakai' => $produkRelevan->pluck('id'),
        ]);

        return $response;
    }
}
```

### 13.6 Guardrail AI (Wajib, Bukan Opsional)

| Risiko | Mitigasi |
|---|---|
| AI mengarang harga/stok/promo | Selalu suntik data real dari DB ke prompt, bukan andalkan training data model |
| Prompt injection (mis. minta ubah harga/diskon lewat chat) | System prompt eksplisit larang AI mengubah harga/status apa pun; AI bersifat read-only terhadap data |
| Biaya AI membengkak | Rate limit per customer per hari; gunakan model kecil/murah untuk FAQ, bukan model paling mahal |
| AI dipakai di luar topik toko | System prompt tolak topik di luar produk/toko |
| Customer terlalu percaya jawaban AI yang keliru | Selalu sertakan opsi "Kurang yakin? Chat admin langsung" di tiap jawaban AI |

### 13.7 Open Questions Tambahan

- Pilihan model AI — model kecil/cepat sudah cukup karena scope sempit (FAQ produk), bukan reasoning kompleks. **Status: belum ditentukan model spesifiknya.**
- Siapa yang mengisi/update `faq_templates` — perlu UI admin sederhana atau cukup lewat database langsung di awal? **Status: belum ditentukan.**
- ~~Bahasa jawaban AI — ikut bahasa pertanyaan customer, atau dipaksa satu bahasa saja?~~
  → **Keputusan**: Hanya Bahasa Indonesia, konsisten dengan keputusan di §11 (tidak ada bilingual). System prompt AI di §13.5 perlu ditambah instruksi eksplisit untuk selalu menjawab dalam Bahasa Indonesia.

---

## 14. Addendum: Monitoring Lonjakan Traffic (Positioning "Hidden Gem")

> Konteks: aplikasi ini diposisikan sebagai "hidden gem" — dikenal lewat word-of-mouth/referral, sengaja tidak ditemukan lewat mesin pencari (lihat §13 untuk konteks scope AI/bot; kontrol discoverability & invite-only system akan dibahas lebih lanjut di section terpisah). Bagian ini fokus ke satu kebutuhan konkret: **mendeteksi kalau link aplikasi tersebar lebih luas dari yang diinginkan**, lewat monitoring lonjakan traffic tidak wajar.

### 14.1 Tujuan

Alert otomatis ke admin kalau traffic naik drastis dalam waktu singkat — indikasi link sudah di-share ke luar lingkaran yang dituju (misal ter-post di grup Facebook besar, forum publik, dsb.), bukan cuma menyebar organik dari mulut ke mulut.

### 14.2 Opsi A (Direkomendasikan untuk MVP) — Cloudflare

Kalau domain sudah di belakang Cloudflare (gratis), tidak perlu membangun sistem sendiri:

| Fitur Cloudflare | Fungsi |
|---|---|
| Cloudflare Analytics | Dashboard traffic per jam/hari otomatis tersedia |
| Rate Limiting Rules | Set threshold (mis. block IP kalau >100 request/menit) |
| Notifications | Kirim email/webhook otomatis kalau traffic melewati threshold yang ditentukan |

Nol kode tambahan — cukup konfigurasi. Jadi pilihan pertama untuk MVP.

### 14.3 Opsi B (DIY) — Redis Counter + Scheduled Check

Kalau butuh kontrol penuh atau tidak memakai Cloudflare:

```php
// Middleware: hitung request per menit ke Redis
class TrackTrafficMiddleware
{
    public function handle($request, Closure $next)
    {
        $key = 'traffic:' . now()->format('Y-m-d:H:i'); // per menit
        Redis::incr($key);
        Redis::expire($key, 3600); // simpan 1 jam untuk dibandingkan
        return $next($request);
    }
}
```

```php
// Scheduled command, jalan tiap 5 menit
class CheckTrafficAnomaly extends Command
{
    public function handle()
    {
        $currentMinuteCount = Redis::get('traffic:' . now()->format('Y-m-d:H:i')) ?? 0;

        // Bandingkan dengan rata-rata jam yang sama, 7 hari terakhir
        $baseline = $this->getHistoricalAverage(now()->format('H:i'));

        if ($currentMinuteCount > $baseline * 3) { // 3x lipat dari normal
            $this->alertAdmin("Traffic naik {$currentMinuteCount} req/menit, biasanya cuma {$baseline}. Cek apakah link sudah tersebar lebih luas.");
        }
    }

    private function alertAdmin(string $message)
    {
        // Reuse infrastruktur notifikasi Telegram admin yang sudah ada (lihat §13)
        Http::post("https://api.telegram.org/bot{token}/sendMessage", [
            'chat_id' => config('services.telegram.admin_chat_id'),
            'text' => $message,
        ]);
    }
}
```

Registrasi jadwal: `$schedule->command('traffic:check')->everyFiveMinutes();`

Baseline "rata-rata historis" bisa mulai sederhana (rata-rata 7 hari terakhir per jam, disimpan di tabel kecil), disempurnakan belakangan setelah ada cukup data.

### 14.4 Keputusan Desain

- Alert dikirim ke chat admin Telegram yang **sama** dengan yang sudah dipakai untuk notifikasi order (§13) — tidak perlu sistem alerting terpisah.
- Mulai dari Opsi A (Cloudflare) untuk MVP; pertimbangkan Opsi B hanya kalau butuh logika deteksi yang lebih custom dari yang disediakan Cloudflare.
