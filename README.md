# 🎵 NEO MUSIC — Discord Music Bot

Bot musik Discord lengkap seperti Hydra. Support YouTube, Spotify, SoundCloud, playlist, filter audio, dan tombol interaktif.

---

## ✨ Fitur

| Fitur | Detail |
|-------|--------|
| 🎵 Multi-platform | YouTube, Spotify, SoundCloud, playlist |
| 🎛️ Filter Audio | Bass Boost, 8D, Nightcore, Lo-Fi, Echo, Karaoke, dll |
| 🖱️ Tombol Interaktif | Pause, Skip, Stop, Shuffle, Loop, Vol+/-, Queue, Lyrics |
| 📋 Queue System | Add, Remove, Move, Shuffle, Loop mode |
| 🔍 Search | Cari lagu & pilih dari dropdown |
| ⏩ Seek | Lompat ke waktu tertentu |
| 📝 Lyrics | Tampilkan lirik via Genius API |
| 🔁 Autoplay | Auto putar lagu related saat queue habis |

---

## 📋 Commands

| Command | Deskripsi |
|---------|-----------|
| `/play [query]` | Putar lagu / playlist |
| `/search [query]` | Cari & pilih lagu |
| `/playnext [query]` | Tambah ke antrian berikutnya |
| `/nowplaying` | Lihat lagu yang sedang diputar |
| `/queue` | Tampilkan antrian |
| `/skip [amount]` | Skip 1 atau beberapa lagu |
| `/previous` | Kembali ke lagu sebelumnya |
| `/pause` | Pause / Resume |
| `/stop` | Stop & leave VC |
| `/volume [0-100]` | Atur volume |
| `/loop [off/song/queue]` | Atur mode loop |
| `/shuffle` | Acak queue |
| `/filter [nama]` | Terapkan filter audio |
| `/seek [waktu]` | Loncat ke waktu (1:30 / +30 / -30) |
| `/remove [posisi]` | Hapus lagu dari queue |
| `/move [from] [to]` | Pindahkan posisi lagu |
| `/autoplay` | Toggle autoplay |
| `/lyrics [judul]` | Tampilkan lirik |

---

## 🚀 Setup

### 1. Clone & Install
```bash
git clone https://github.com/kamu/neo-music
cd neo-music
npm install
```

### 2. Buat file `.env`
```env
DISCORD_TOKEN=your_bot_token
CLIENT_ID=your_client_id
SPOTIFY_CLIENT_ID=your_spotify_id
SPOTIFY_CLIENT_SECRET=your_spotify_secret
GENIUS_TOKEN=optional_untuk_lirik
```

### 3. Register Slash Commands
```bash
node deploy-commands.js
```

### 4. Jalankan Bot
```bash
node index.js
```

---

## 🚂 Deploy ke Railway

1. Push ke GitHub
2. New Project → Deploy from GitHub repo
3. Add Environment Variables di Railway
4. Railway otomatis build dari `Dockerfile`

---

## 🎛️ Dapat Spotify & Genius Token

**Spotify:**
1. Buka [developer.spotify.com](https://developer.spotify.com/dashboard)
2. Create App → ambil Client ID & Secret

**Genius (opsional untuk lirik):**
1. Buka [genius.com/developers](https://genius.com/api-clients)
2. Create API Client → ambil Access Token

---

## 🔧 Requirements

- Node.js 18+
- FFmpeg (auto-install via Docker)
- yt-dlp (auto-install via Docker)
