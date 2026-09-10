# Startify - Daksh Dua | Accelerator @ UoH

**Live:** https://startify1.pages.dev / https://startify2.pages.dev

**I help founders at UoH build & grow profitable businesses.**

Share this link — anyone at UoH can join as Founder (@uohyd.ac.in), Builder (@uohyd.ac.in), or Backer (any email). Password + email verification link, Firestore DB.

## Join in 30s
1. Open live link → `Sign in` → `Create Account` → pick role → `Founder` / `Builder` needs `@uohyd.ac.in`, `Backer` any email
2. Enter password (6+ chars) → Create → check inbox for `Verify your email for Startify` → click link
3. Back to site → `Sign In` → dashboard: Ideas Board / Skilled Talent / Backers Hub / Events / Chats

> Verification email from `noreply@startify-01.firebaseapp.com` (or `startifyuoh@gmail.com` if SMTP enabled). Check Spam. Link expires 3 days. `Resend link` or `Forgot password` available on Sign In.

## Features
- **Ideas Board** — post CampusKart-style ideas, seek co-founders
- **Skilled Talent** — find React/Node/Figma builders
- **Backers Hub** — angel mentors, pre-seed micro-capital
- **Events** — Demo Day, speed networking
- **Chats & Requests** — connect → accept → message
- **Dashboard** — your ideas, incoming/outgoing requests
- **Admin** — `/admin.html` → Ideas/Talent/Registrations/Payments (password `startifyUoH2025`, change in `public/admin.html:28`)

## Tech Stack
- **Frontend:** React 18 + Vite + Tailwind, deployed on **Cloudflare Pages** (free, commercial allowed, unlimited bandwidth)
- **Auth:** Firebase Auth Email/Password + verification link (SMTP via `startifyuoh@gmail.com` optional)
- **DB:** Firebase Firestore (`ideas`, `registrations`, `payments`) + localStorage fallback — 50k reads/day free
- **Payments:** Razorpay (test `rzp_test_StartifyDemoKey`, set `VITE_RAZORPAY_KEY_ID`)
- **Functions:** `functions/api/bookings.js` + `ideas.js` on Cloudflare edge (100k req/day free)

## Run Locally
```bash
npm install
cp .env.example .env   # fill VITE_FIREBASE_*
npm run dev            # http://localhost:3000
npm run build && npm run preview
```

## Env Vars
Local `.env` and Cloudflare Pages → `Settings → Environment variables` (Production):
```
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=startify-01.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=startify-01
VITE_FIREBASE_STORAGE_BUCKET=startify-01.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=451...
VITE_FIREBASE_APP_ID=1:451...web:abc...
VITE_RAZORPAY_KEY_ID=rzp_test_xxxx
```
See `.env.example`.

## Firebase Setup (once)
1. https://console.firebase.google.com → project `startify-01` → `Firestore Database → Create → Test mode → asia-south1` → Rules:
```js
rules_version='2'; service cloud.firestore { match /databases/{database}/documents {
  match /ideas/{d} { allow read, write: if true; }
  match /registrations/{d} { allow read, write: if true; }
  match /payments/{d} { allow read, write: if true; }
}}
```
2. `Authentication → Sign-in method → Email/Password → Enable`
3. `Authentication → Templates → Email address verification` → Subject `Verify your email for Startify` → Body with `%LINK%` → Save, set `Public-facing name: Startify`
4. `Authentication → Settings → Authorized domains → Add` `startify1.pages.dev`, `startify2.pages.dev`, `localhost`
5. Optional SMTP: `Authentication → Settings → SMTP → smtp.gmail.com:587` with App Password to send from `startifyuoh@gmail.com`

## Deploy
Push to `main` → Cloudflare Pages auto-deploys via GitHub webhook (`dakshdua03/startify`).

- Build: `npm run build` → `dist` (ignored in repo, built on Cloudflare)
- Custom domain: `Pages → Custom domains → startify.yourdomain.com` (free)

## Sharing
Send `https://startify1.pages.dev` — no install, works on phone/desktop. New users click `Create Account` and go through verification above.

## Contact
Daksh Dua — dakshdua03 (Instagram)

<!-- deploy-trigger: 2026-09-10 finalize for sharing — cleaned dist/.env, fixed bookings API, polished README -->
