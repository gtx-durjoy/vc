# 🚀 LUNA Discord Bot • Vercel 3D Web Dashboard Deployment Guide

Manage your Discord server **A to Z directly from the web** without typing any slash commands in Discord!

---

## 🌟 Key Features
- **Zero Slash Command Hassle:** Configure Welcome greetings, Leave logs, and publish embeds straight from the web browser.
- **Real-Time Channel Sync:** Automatically fetches real text channels from Discord via the REST API.
- **High Security Verification:** Discord OAuth2 authorization + Bitwise Administrator/Manage Server permission checks + Master Admin Passkey fallback (`luna2026`).
- **Direct Discord Dispatcher:** One-click buttons to send live Welcome test cards and announcements straight into your server.
- **Vercel Serverless Ready:** Instant global deployment with `@vercel/node`.

---

## 📦 How to Deploy on Vercel (1-Minute Guide)

### Option 1: Deploy with Vercel CLI (Fastest)
1. Open terminal inside the `dashboard` folder:
   ```bash
   cd "d:/DISCORD BOT/dashboard"
   ```
2. Run:
   ```bash
   vercel
   ```
3. Follow the quick prompts and select your Vercel account.

---

### Option 2: Deploy via GitHub + Vercel Web
1. Push this `dashboard` folder (or your repository) to GitHub.
2. Go to [Vercel Dashboard](https://vercel.com/new).
3. Import your GitHub repository.
4. Set **Root Directory** to `dashboard` (if deploying from a monorepo).
5. In **Environment Variables**, add:
   - `DISCORD_BOT_TOKEN` = `ENTER YOU BOT TOKEN`
   - `APPLICATION_ID` = `ENTER YOUR APPLICATION ID`
   - `ADMIN_PASSKEY` = `luna2026`
   - `CLIENT_SECRET` = *(Optional: From Discord Developer Portal -> OAuth2 -> Client Secret)*
6. Click **Deploy**!

---

## 🔒 Discord Developer Portal OAuth2 Setup (For Public Users)
If you want other server owners to log in via Discord OAuth2 on your live Vercel domain:
1. Go to [Discord Developer Portal](https://discord.com/developers/applications/).
2. Click **OAuth2** -> **General**.
3. Under **Redirects**, add your Vercel URL:
   ```
   https://your-vercel-domain.vercel.app/api/auth?action=callback
   ```
4. Copy your **Client Secret** and paste it into Vercel's Environment Variables as `CLIENT_SECRET`.

---

## 💻 Running Locally
You can also run this dashboard locally anytime:
```bash
cd dashboard
node server.js
```
Open **http://localhost:4000** in your browser!
Passkey: `luna2026`
