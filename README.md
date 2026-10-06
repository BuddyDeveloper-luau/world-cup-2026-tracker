# 🏆 FIFA World Cup 2026 Score & Bracket Tracker

A production-ready, security-hardened Next.js application displaying every match, score, and tournament stage of the **2026 FIFA World Cup** (won by **Spain**, with **Argentina** runner-up and **England** taking 3rd).

Built using the ultra-lean, modern serverless stack:
* **Next.js (App Router)** & **Tailwind CSS**
* **Supabase** (PostgreSQL with Row Level Security)
* **Clerk** (Authentication & Session Guard)
* **Upstash Redis** (Edge Rate Limiting)
* **Cloudflare Pages / DNS** (Global Edge CDN & DDoS Protection)

---

## 🛡️ Fully Protected Checklist Compliance
This project strictly implements all 19 security principles:
1. [x] **Remove unused packages:** Lean dependency tree without bloat.
2. [x] **Check git for secrets:** Comprehensive `.gitignore` ignores all `.env*` files.
3. [x] **Add rate limiting:** Upstash sliding-window rate limiter stops volumetric abuse.
4. [x] **Check user access:** Clerk role verification protects administrative routes.
5. [x] **Hash passwords properly:** Clerk handles multi-factor auth and cryptographic password hashing.
6. [x] **Hide API keys:** Public keys are strictly restricted; secret keys exist only in server environments.
7. [x] **Proper authentication:** Next.js middleware guards API and admin endpoints.
8. [x] **Update dependencies:** Modern versions pinned to secure releases.
9. [x] **Sanitize forms:** Strict Zod schema validation protects input parameters.
10. [x] **Protect against XSS:** Hardened Content Security Policy (CSP Level 3).
11. [x] **Disable debug mode:** React strict mode enabled; debug traces disabled for production.
12. [x] **Full security audit:** OWASP Top 10 hardening.
13. [x] **Check env variables:** Validated at runtime with safe fallbacks.
14. [x] **Check for exposed files:** `productionBrowserSourceMaps: false` disables source map leakage.
15. [x] **Protect admin routes:** `/admin` routes reject unauthorized session tokens.
16. [x] **Secure API endpoints:** HTTP methods restricted to safe verbs (`GET`, `OPTIONS`).
17. [x] **Check CORS settings:** Origin whitelist configured in middleware.
18. [x] **Add security headers:** HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`.
19. [x] **Secure database access:** Supabase Row Level Security (RLS) ensures public read-only access.

---

## 🚀 Quickstart: Local Setup in 3 Minutes

### 1. Extract and Install
```bash
# Unzip project
unzip world-cup-2026-tracker.zip
cd world-cup-2026-tracker

# Install dependencies
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. The application includes a fallback data store, meaning it works immediately even before you connect your cloud services!

---

## 🔑 Cloud Services & API Key Setup Guide

### 1. Supabase (Database & RLS)
1. Head to [supabase.com](https://supabase.com) and create a free account.
2. Click **New Project** and choose your nearest region.
3. Once created, go to the left sidebar -> **SQL Editor** -> **New Query**.
4. Paste the entire content of `supabase/schema.sql` into the editor and click **Run**.
5. Go to **Project Settings** (gear icon) -> **API**:
   * Copy the **Project URL** -> `NEXT_PUBLIC_SUPABASE_URL`
   * Copy the `anon` `public` key -> `SUPABASE_ANON_KEY`

### 2. Clerk (Authentication)
1. Head to [clerk.com](https://clerk.com) and sign up for free.
2. Click **Add Application**, name it `World Cup Tracker`, and select Email/Google authentication.
3. Under **API Keys** in the dashboard:
   * Copy **Publishable Key** -> `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   * Copy **Secret Key** -> `CLERK_SECRET_KEY`

### 3. Upstash (Redis Rate Limiting)
1. Head to [upstash.com](https://upstash.com) and sign up.
2. In the console, click **Create Database** -> Select **Redis** -> Region closest to your users.
3. Scroll down to the **REST API** section:
   * Copy `UPSTASH_REDIS_REST_URL`
   * Copy `UPSTASH_REDIS_REST_TOKEN`

### 4. Create your `.env.local`
Create a `.env.local` file in your root folder:
```bash
cp .env.example .env.local
```
Paste all your obtained keys into `.env.local`.

---

## 🐙 Step-by-Step: Git & GitHub Setup

Initialize your git repository and push your clean code to GitHub:

```bash
# 1. Initialize git
git init -b main

# 2. Stage all files (Notice: .gitignore automatically excludes secrets!)
git add .

# 3. Commit your files
git commit -m "feat: initial commit of secured 2026 world cup tracker"

# 4. Create a new repository on GitHub:
# Go to https://github.com/new and create a repository named 'world-cup-2026-tracker'.
# (Do NOT check initialize with README, license, or .gitignore)

# 5. Link and push to GitHub (replace YOUR-USERNAME with your GitHub handle):
git remote add origin https://github.com/YOUR-USERNAME/world-cup-2026-tracker.git
git push -u origin main
```

---

## ☁️ Step-by-Step: Deploy to Cloudflare Pages

Cloudflare Pages provides global edge distribution, automated SSL certificates, and zero-cost hosting.

### Method A: Automated Git Integration (Recommended)
1. Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**.
2. Authorize Cloudflare with your GitHub account and select your `world-cup-2026-tracker` repository.
3. Set your **Build Settings**:
   * **Framework preset**: `Next.js` (or `None`)
   * **Build command**: `npx @cloudflare/next-on-pages` (or `npm run pages:build`)
   * **Build output directory**: `.vercel/output/static`
4. Expand **Environment Variables** and add all the keys from your `.env.local`:
   * `NEXT_PUBLIC_SUPABASE_URL`
   * `SUPABASE_ANON_KEY`
   * `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   * `CLERK_SECRET_KEY`
   * `UPSTASH_REDIS_REST_URL`
   * `UPSTASH_REDIS_REST_TOKEN`
   * `NODE_VERSION`: `20`
5. Click **Save and Deploy**. Your site will be live across 300+ edge locations with custom SSL in under 2 minutes!

### Method B: Direct CLI Deployment (Wrangler)
If you prefer deploying directly from your terminal:
```bash
# Install wrangler globally
npm install -g wrangler

# Build the pages output
npx @cloudflare/next-on-pages

# Deploy to Cloudflare Pages
npx wrangler pages deploy .vercel/output/static --project-name world-cup-2026-tracker
```

---

## 🔒 Post-Launch Security Verification Checklist
After deploying, verify the security posture:
1. **Test Rate Limiter:** Send rapid curl requests to `/api/matches` to confirm HTTP 429 response after 30 hits.
2. **Test CSP Headers:** Open DevTools Network tab and verify `Content-Security-Policy`, `X-Frame-Options: DENY`, and `X-Content-Type-Options: nosniff` are present.
3. **Verify Database Isolation:** Attempt a `POST` or `DELETE` to Supabase without service credentials; confirm Supabase RLS returns permission denied.
