# TBR LIVE QUOTE OVERLAY

> Production-ready live broadcast quote overlay application for **The Bontot Radio (TBR)** with independent **Control / Editor Mode** and **OBS Live Overlay Mode** powered by **Supabase Realtime Broadcast**.

---

## 📁 Project Structure

```
d:/tbr-live-overlay/
├── .env.example                # Supabase environment variables template
├── .gitignore                  # Git ignore rules
├── index.html                  # HTML entry point with Space Grotesk & JetBrains Mono fonts
├── package.json                # Project dependencies and build scripts
├── postcss.config.js           # PostCSS Tailwind configuration
├── tailwind.config.js          # Cyber radio dark palette & custom typography
├── vercel.json                 # Vercel SPA routing rewrite rules
├── vite.config.js              # Vite server & build configuration
├── public/
│   └── favicon.svg             # Cyber radio antenna SVG icon
└── src/
    ├── App.jsx                 # Dynamic route switcher (/ for Editor, /live for OBS)
    ├── index.css               # Global cyber aesthetics, scrollbars, and canvas styles
    ├── main.jsx                # React DOM root mounting
    ├── config/
    │   └── supabase.js         # Supabase client singleton & configuration manager
    ├── services/
    │   ├── realtimeService.js  # Supabase Realtime Broadcast publisher & listener
    │   └── quotesService.js    # Curated TBR quotes bank & default overlay state
    ├── canvas/
    │   └── overlayRenderer.js  # 1080x1920 HTML5 Canvas rendering engine (styles, HUD, glow)
    ├── components/
    │   ├── editor/
    │   │   ├── ChannelManager.jsx   # Live channel switcher & OBS URL generator
    │   │   ├── GlowControls.jsx     # Typography size, glow intensity & frame opacity
    │   │   ├── HeaderBar.jsx        # Cyber radio header & live telemetry badges
    │   │   ├── PositionControls.jsx # Y-axis coordinate sliders (Quote, Header, Footer)
    │   │   ├── PushControls.jsx     # PUSH TO LIVE button & Auto-Push toggle
    │   │   ├── QuoteControls.jsx    # Quote text editor & quote randomizer
    │   │   ├── StatusBadge.jsx      # Connection state indicators
    │   │   ├── StyleControls.jsx    # Overlay theme presets & category selector
    │   │   └── SupabaseModal.jsx    # Interactive Supabase credentials modal
    │   └── preview/
    │       └── OverlayPreview.jsx   # Scaled 9:16 responsive canvas preview with safe zones
    └── pages/
        ├── EditorPage.jsx      # Cyber radio broadcast control room interface
        └── LiveOverlayPage.jsx # Ultra-lightweight 1080x1920 transparent OBS canvas receiver
```

---

## ⚙️ 1. Configuring Supabase Credentials

### Option A: Environment Variables (`.env.local`)
1. Duplicate `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Populate with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-browser-safe-anon-key
   ```

### Option B: In-App UI Configuration
1. Open the Editor in your browser.
2. Click the ⚙️ **Settings** button in the top navigation bar.
3. Paste your **Supabase URL** and **Publishable Anon Key**.
4. Click **Save & Connect**. The app will immediately establish a Realtime Broadcast connection.

> [!WARNING]
> Only use the **Public / Anon Key** from your Supabase Dashboard (`Settings > API`). Never use the `service_role` secret key.

---

## 🚀 2. How to Run Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Open the Editor:
   ```
   http://localhost:5173/
   ```

4. Open the OBS Live Canvas:
   ```
   http://localhost:5173/live?channel=tbr-default
   ```

---

## 📦 3. How to Build for Production

Run the production build:
```bash
npm run build
```
This generates the optimized production bundle in `dist/`.

---

## 🌐 4. Exact Vercel Deployment Steps

1. Push your code to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit of TBR Live Quote Overlay"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/tbr-live-quote-overlay.git
   git push -u origin main
   ```

2. Log into [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your GitHub repository.
4. Set the build settings (detected automatically):
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. In **Environment Variables**, add:
   - `VITE_SUPABASE_URL` = `https://your-project-id.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `your-supabase-browser-safe-anon-key`
6. Click **Deploy**.
7. Vercel will deploy your app. The included `vercel.json` ensures that routes like `/live?channel=...` resolve properly to the SPA without 404 errors.

---

## 🎬 5. Exact OBS Browser Source Setup

In OBS Studio:
1. Under **Sources**, click **`+`** and choose **Browser**.
2. Name the source: `TBR Quote Overlay`.
3. Configure the source properties:
   - **URL**: `https://YOUR-VERCEL-DOMAIN.vercel.app/live?channel=tbr-default`
   - **Width**: `1080`
   - **Height**: `1920`
   - **FPS**: `30` (or `60`)
   - **Custom CSS**: Leave empty (the canvas and body are natively 100% transparent)
   - Check: **Shutdown source when not visible** (optional)
   - Check: **Refresh browser when scene becomes active** (optional)
4. Click **OK**.

---

## 📡 6. Realtime Architecture & Channel Isolation

- **Transport**: Supabase Realtime Broadcast (`channel.send({ type: 'broadcast', event: 'overlay_update', payload })`).
- **Channel Format**: `tbr_overlay_<channelId>`.
- **Isolation**:
  - `tbr-default` transmits only to `tbr_overlay_tbr-default`.
  - `tbr-room-01` transmits only to `tbr_overlay_tbr-room-01`.
  - Different channels will never receive each other's updates.
