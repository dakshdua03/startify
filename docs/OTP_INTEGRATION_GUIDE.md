# Auth — Password + Email Link (Firebase)

Current implementation (`src/lib/firebase.js` + `src/App.jsx:369`) uses **Firebase Auth Email/Password + Email Verification Link**. No OTP.

```js
import { authService } from "./lib/firebase"
await authService.signUp(email, password) // createUser + sendEmailVerification (link)
await authService.signIn(email, password) // signIn, requires emailVerified
await authService.resendVerification(email, password)
await authService.sendPasswordReset(email)
```

- On register: account created in Firebase Auth + verification link sent from `startifyuoh@gmail.com` (if you enabled SMTP settings) or `noreply@startify-01.firebaseapp.com` by default. Must click link before Sign In works.
- In dev with no Firebase keys, falls back to localStorage credential (no email).

---

## Production Setup — Firebase (active)

### 1. Firebase Console
1. `Build → Authentication → Sign-in method → Email/Password → Enable`
2. `Build → Authentication → Templates → Email address verification` → customize sender / subject.
3. `Build → Authentication → Settings → Authorized domains` → add `localhost`, `startify2.pages.dev`, `startify-daksh-accelerator.pages.dev`
4. `Build → Firestore Database → Rules` (for ideas/registrations/payments):
```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /ideas/{doc} { allow read: if true; allow write: if true; }
    match /registrations/{doc} { allow read, write: if true; }
    match /payments/{doc} { allow read, write: if true; }
  }
}
```

### 2. Env Vars (local + Cloudflare Pages)

Local `.env`:
```
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=startify-01.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=startify-01
VITE_FIREBASE_STORAGE_BUCKET=startify-01.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=451...
VITE_FIREBASE_APP_ID=1:451...
```

Cloudflare Pages → Settings → Environment variables → add same `VITE_FIREBASE_*` + redeploy.

### 3. Custom SMTP (optional — fixes Sender name not provided)

`Authentication → Settings → SMTP settings → Enable`:
```
Sender: startifyuoh@gmail.com
Host: smtp.gmail.com
Port: 587
Username: startifyuoh@gmail.com
Password: Gmail App Password (myaccount.google.com → App passwords, 16 chars)
Security: STARTTLS
```
→ Save → future verification / password reset emails come from your Gmail.

### 4. How flow works
- `signUp`: `createUserWithEmailAndPassword` → `sendEmailVerification` (link `https://startify-01.firebaseapp.com/__/auth/action?mode=verifyEmail&oobCode=...`)
- User clicks link → Firebase marks `emailVerified=true` → can now `signIn`
- `signIn`: checks `user.emailVerified`, else throws `Please verify your email first — click link`
- `resendVerification` / `sendPasswordReset` use same SMTP.

Pros: No OTP code to manage, no console leak, Firestore only for DB (no `email_otps` collection needed). Scales free for 5000 UoH students.

---

## Checklist to go live
- [ ] Set `VITE_FIREBASE_*` in Cloudflare Pages and redeploy
- [ ] Add all `*.pages.dev` domains to Authorized domains
- [ ] Test: @uohyd.ac.in gate for Founder/Builder, Backer any email, link expiry (3 days), resend link, forgot password
- [ ] Configure SMTP so sender shows `Startify` / `startifyuoh@gmail.com`

Legacy Supabase file kept as `src/lib/supabase.js` (unused) — safe to delete. Active import is `src/lib/firebase.js` via `src/App.jsx:3`.
