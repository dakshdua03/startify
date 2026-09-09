# OTP Authentication — Production Integration Guide

Current implementation (`src/lib/firebase.js:20-60` + `src/App.jsx:369`) uses **Firebase Firestore + Auth** with local fallback for `npm run dev`:

```js
import { authService } from "./lib/firebase"
await authService.sendOtp(email) // generates 6-digit, stores in Firestore `email_otps` + tries Firebase email link
await authService.verifyOtp(email, token) // checks Firestore, 5-min TTL
```

- Code is generated client+cloud, stored in Firestore `email_otps/{email}` with `expiresAt` (5 min), and mirrored to `localStorage` for dev.
- In dev with no Firebase keys, code is logged to console and stored locally.
- **Do not rely on localStorage alone in prod** — set Firebase env vars.

---

## Production Setup — Firebase (Option A, active)

### 1. Create Firebase Project
1. Go to https://console.firebase.google.com → Add project `startify-daksh`
2. Enable **Firestore Database** (start in test mode, then add rules below)
3. Enable **Authentication → Sign-in method → Email/Password + Email link** (optional for real email sending)
4. Add Web App → copy config.

### 2. Add Env Vars (local + Cloudflare Pages)

Local `.env`:
```
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=startify-daksh.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=startify-daksh
VITE_FIREBASE_STORAGE_BUCKET=startify-daksh.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123...
VITE_FIREBASE_APP_ID=1:123:web:abc...
```

Cloudflare Pages → Settings → Environment variables → add same `VITE_FIREBASE_*` + redeploy.

### 3. Firestore Rules (for `email_otps`, `ideas`, `registrations`, `payments`)
```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /email_otps/{email} { allow read, write: if true; } // lock down with request.auth in prod if needed
    match /ideas/{doc} { allow read: if true; allow write: if true; }
    match /registrations/{doc} { allow read, write: if true; }
    match /payments/{doc} { allow read, write: if true; }
  }
}
```
For tight security, add: `allow write: if request.time < resource.data.expiresAt` and auth checks.

### 4. How OTP Works
- `sendOtp(email)`: creates `email_otps/{lowerEmail}` with `{code, expiresAt: now+5min}`. Also calls `sendSignInLinkToEmail` if Auth configured (real email). Logs code to console for dev.
- `verifyOtp(email, token)`: reads doc, checks `code === token && now < expiresAt`, marks `verified:true`.
- `src/App.jsx` wraps this with `isFirebaseConfigured` gate and toast.

Pros: No Supabase CORS, pay-as-you-go free tier (1GB, 50k reads/day), commercial allowed. Firestore auto-scales for 5000 UoH students.

---

## Option B — Cloudflare Pages Function + Email (SendGrid / Resend) — custom 6-digit code

1. Create API route `functions/api/otp.js`:
```js
export async function onRequestPost({ request, env }) {
  const { email } = await request.json()
  const code = Math.floor(100000 + Math.random()*900000).toString()
  await env.OTP_KV.put(email.toLowerCase(), code, { expirationTtl: 300 })
  await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.SENDGRID_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ personalizations: [{ to: [{ email }] }], from: { email: "noreply@startify.in" }, subject: `OTP ${code}`, content: [{ type: "text/plain", value: `Code ${code} valid 5 min` }] })
  })
  return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } })
}
```

---

## Checklist to go live
- [ ] Set `VITE_FIREBASE_*` in Cloudflare Pages and redeploy (no Supabase vars needed)
- [ ] Create Firestore collections: `ideas`, `registrations`, `payments`, `email_otps` (auto-created on first write)
- [ ] Test: blocked non-UoH Founder (`@uohyd.ac.in` gate in `handleAuthSubmit`), allowed Backer any email, OTP expiry, resend
- [ ] Add rate limiting (Firestore `email_otps` doc has `createdAt`, reject if <60s since last)
- [ ] Remove console.log OTP in `src/lib/firebase.js:47` for prod (or keep for support)

Legacy Supabase file kept as `src/lib/supabase.js` (unused) — safe to delete after verifying Firestore works. Active import is `src/lib/firebase.js` via `src/App.jsx:3`.
