# 🚀 Panduan Deploy Farcaster Mini App - Step by Step

Panduan lengkap dari file yang sudah ada sampai Mini App aktif di Farcaster.

---

## 📋 Persiapan Awal

### Yang Dibutuhkan:
- [ ] Akun GitHub
- [ ] Akun Vercel (gratis) - https://vercel.com
- [ ] Akun Neynar (gratis tier) - https://neynar.com
- [ ] Akun Farcaster yang sudah aktif
- [ ] Node.js 22+ di komputer lokal

---

## STEP 1: Dapatkan Neynar API Key

### 1.1 Daftar di Neynar
```
1. Buka https://dev.neynar.com
2. Klik "Sign Up" atau "Log In"
3. Bisa login dengan Farcaster account
```

### 1.2 Buat API Key
```
1. Setelah login, masuk ke Dashboard
2. Klik "Create New App" atau "API Keys"
3. Beri nama app (misal: "Neynar Score Checker")
4. Copy API Key yang muncul
5. SIMPAN API KEY INI! (akan dipakai nanti)
```

**Contoh API Key:** `NEYNAR_API_DOCS` (ini contoh, pakai yang asli)

---

## STEP 2: Setup Project di Lokal

### 2.1 Extract File
```bash
# Extract zip yang sudah di-download
unzip neynar-score-checker.zip
cd neynar-score-checker
```

### 2.2 Install Dependencies
```bash
npm install
```

### 2.3 Buat File Environment
```bash
# Copy template environment
cp .env.example .env.local
```

### 2.4 Edit .env.local (SEMENTARA)
```bash
# Buka dengan editor
nano .env.local
# atau
code .env.local
```

Isi sementara:
```env
NEYNAR_API_KEY=paste_api_key_dari_step_1_disini
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Kosongkan dulu, akan diisi setelah deploy
NEXT_PUBLIC_FARCASTER_HEADER=
NEXT_PUBLIC_FARCASTER_PAYLOAD=
NEXT_PUBLIC_FARCASTER_SIGNATURE=

JWT_SECRET=buatsecretrandomminimal32karakter123
```

### 2.5 Test di Lokal
```bash
npm run dev
```

Buka http://localhost:3000 - pastikan tidak ada error.

---

## STEP 3: Upload ke GitHub

### 3.1 Buat Repository Baru di GitHub
```
1. Buka https://github.com/new
2. Repository name: neynar-score-checker
3. Pilih "Private" (recommended) atau "Public"
4. JANGAN centang "Add README" (sudah ada)
5. Klik "Create repository"
```

### 3.2 Push Code ke GitHub
```bash
# Di folder project, jalankan:
git init
git add .
git commit -m "Initial commit - Neynar Score Checker Mini App"
git branch -M main
git remote add origin https://github.com/USERNAME_KAMU/neynar-score-checker.git
git push -u origin main
```

**Ganti `USERNAME_KAMU` dengan username GitHub kamu!**

---

## STEP 4: Deploy ke Vercel

### 4.1 Import Project ke Vercel
```
1. Buka https://vercel.com
2. Login dengan GitHub
3. Klik "Add New..." → "Project"
4. Pilih repository "neynar-score-checker"
5. Klik "Import"
```

### 4.2 Configure Project
```
Framework Preset: Next.js (auto-detect)
Root Directory: ./ (default)
Build Command: npm run build (default)
Output Directory: .next (default)
```

### 4.3 Add Environment Variables
Di halaman configure, expand "Environment Variables" dan tambahkan:

| Key | Value |
|-----|-------|
| `NEYNAR_API_KEY` | (paste API key dari Step 1) |
| `NEXT_PUBLIC_APP_URL` | (kosongkan dulu, isi setelah deploy) |
| `JWT_SECRET` | (buat random string 32+ karakter) |

### 4.4 Deploy!
```
1. Klik "Deploy"
2. Tunggu build selesai (2-3 menit)
3. Setelah selesai, catat URL yang diberikan
   Contoh: https://neynar-score-checker-abc123.vercel.app
```

---

## STEP 5: Update URL di Vercel

### 5.1 Update Environment Variable
```
1. Di Vercel Dashboard, buka project
2. Klik "Settings" → "Environment Variables"
3. Edit NEXT_PUBLIC_APP_URL
4. Isi dengan URL Vercel kamu:
   https://neynar-score-checker-abc123.vercel.app
5. Klik "Save"
```

### 5.2 Redeploy
```
1. Klik "Deployments"
2. Klik titik 3 (...) di deployment terakhir
3. Klik "Redeploy"
4. Tunggu selesai
```

---

## STEP 6: Generate Farcaster Manifest Signature ⚠️ PENTING!

Ini step yang WAJIB agar Mini App diakui oleh Farcaster.

### 6.1 Buka Farcaster Developer Tools
```
1. Buka https://farcaster.xyz/~/developers/new
   ATAU
   Buka Warpcast → Settings → Developer Tools → Create Manifest
   
2. Pastikan sudah login dengan akun Farcaster
```

### 6.2 Isi Domain
```
Domain: neynar-score-checker-abc123.vercel.app

⚠️ TANPA https://
⚠️ TANPA trailing slash /
⚠️ Harus EXACT match dengan URL Vercel
```

### 6.3 Sign Manifest
```
1. Klik "Claim Ownership" atau "Generate Signature"
2. Akan muncul prompt di HP (Warpcast) untuk sign
3. Approve/Sign di HP
4. Setelah berhasil, akan muncul 3 nilai:
   - header: eyJmaWQiOj...
   - payload: eyJkb21haW4i...
   - signature: MHgxMGQwZGU4...
```

### 6.4 Copy Ketiga Nilai Tersebut
Simpan di notepad dulu, akan dipakai di step berikutnya.

---

## STEP 7: Update Manifest di Vercel

### 7.1 Tambah Environment Variables Baru
```
1. Vercel Dashboard → Project → Settings → Environment Variables
2. Tambahkan 3 variable baru:
```

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_FARCASTER_HEADER` | (paste header dari Step 6) |
| `NEXT_PUBLIC_FARCASTER_PAYLOAD` | (paste payload dari Step 6) |
| `NEXT_PUBLIC_FARCASTER_SIGNATURE` | (paste signature dari Step 6) |

### 7.2 Redeploy Lagi
```
1. Klik "Deployments"
2. Klik "Redeploy" di deployment terakhir
3. Tunggu selesai
```

---

## STEP 8: Verifikasi Manifest

### 8.1 Cek Manifest Sudah Benar
Buka di browser:
```
https://YOUR-DOMAIN.vercel.app/.well-known/farcaster.json
```

Harus muncul JSON seperti ini:
```json
{
  "accountAssociation": {
    "header": "eyJmaWQi...",
    "payload": "eyJkb21haW4i...",
    "signature": "MHgxMGQw..."
  },
  "miniapp": {
    "version": "1",
    "name": "Neynar Score Checker",
    ...
  }
}
```

**Jika muncul "REPLACE_WITH_YOUR..." berarti env variable belum ke-set!**

---

## STEP 9: Test di Farcaster

### 9.1 Gunakan Embed Tool
```
1. Buka https://farcaster.xyz/~/developers/tools/embed
2. Paste URL Vercel kamu
3. Klik "Debug" atau "Preview"
4. Harus muncul preview Mini App
```

### 9.2 Test Launch
```
1. Di Embed Tool, klik tombol launch
2. Mini App harus terbuka
3. Jika sudah login Farcaster, profile kamu harus muncul otomatis
```

### 9.3 Test di Warpcast Mobile
```
1. Buka Warpcast di HP
2. Buat cast baru
3. Paste URL Vercel kamu
4. Harus muncul embed card
5. Tap untuk buka Mini App
```

---

## STEP 10: Publish Mini App (Opsional)

Agar Mini App muncul di App Store Farcaster:

### 10.1 Submit untuk Discovery
```
1. Pastikan manifest lengkap dengan:
   - screenshotUrls (upload screenshot)
   - description
   - primaryCategory
   - tags
   
2. Mini App akan otomatis terindex setelah manifest valid
```

### 10.2 Share di Farcaster
```
Cast tentang Mini App kamu!
Semakin banyak yang pakai, semakin tinggi di discovery.
```

---

## 🔧 Troubleshooting

### Error: "Manifest not found"
```
- Cek URL /.well-known/farcaster.json bisa diakses
- Pastikan tidak ada typo di domain
- Redeploy jika perlu
```

### Error: "Invalid signature"
```
- Domain di manifest HARUS sama persis dengan yang di-sign
- Regenerate signature jika domain berubah
- Pastikan tidak ada https:// atau trailing /
```

### Error: "User not found" di app
```
- Cek NEYNAR_API_KEY sudah benar
- Cek API key aktif di dashboard Neynar
- Lihat logs di Vercel untuk error detail
```

### Mini App tidak load / infinite loading
```
- Pastikan sdk.actions.ready() dipanggil
- Cek console browser untuk error
- Test di Embed Tool untuk debug
```

### Wallet tidak connect
```
- Pastikan buka dari dalam Farcaster client
- Tidak bisa test wallet di browser biasa
- Harus test di Warpcast/Farcaster client
```

---

## 📱 Custom Domain (Opsional)

Jika ingin pakai domain sendiri:

### Di Vercel:
```
1. Settings → Domains
2. Add domain: score.yourdomain.com
3. Update DNS sesuai instruksi Vercel
```

### Update Manifest:
```
1. Generate signature BARU dengan domain baru
2. Update NEXT_PUBLIC_APP_URL
3. Update semua env variables
4. Redeploy
```

---

## ✅ Checklist Final

- [ ] App bisa diakses di URL Vercel
- [ ] /.well-known/farcaster.json menampilkan data benar
- [ ] Embed Tool menampilkan preview
- [ ] Mini App bisa dibuka dari Warpcast
- [ ] Login otomatis bekerja (dalam Farcaster client)
- [ ] Score ditampilkan dengan benar
- [ ] Search user bekerja
- [ ] Share button bisa buat cast

---

## 🎉 Selesai!

Mini App kamu sekarang aktif di Farcaster. Share ke teman-teman dan lihat Neynar Score mereka!

**URL Mini App:** `https://YOUR-DOMAIN.vercel.app`

---

## 📞 Butuh Bantuan?

- Farcaster Developer Chat: https://farcaster.xyz/~/group/X2P7HNc4PHTriCssYHNcmQ
- Neynar Slack: https://neynar.com/slack
- Farcaster Mini Apps Docs: https://miniapps.farcaster.xyz
