# OTP Authentication — Production Integration Guide

Current implementation (`src/App.jsx:350-367`) is **mock** for local testing:

```js
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();
const sendOtp = (email, role) => {
  const code = generateOtp();
  setOtpCode(code);
  setOtpModalOpen(true);
  showToast(`OTP for ${email}: ${code} (demo)`);
  localStorage.setItem("startify_otp_map", ...);
};
const verifyOtp = (input, expected) => input.trim() === expected.trim();
```

- Code is generated client-side, shown in toast, stored in `localStorage`.
- **DO NOT use in production** — anyone can read `localStorage` or toast.

---

## Production Options (pick one)

### Option A — Supabase Auth (recommended if you already use Supabase)
Supabase handles OTP via email magic link or `signInWithOtp`.

1. Enable Email OTP: Dashboard → **Authentication → Providers → Email → Enable Confirm email / Enable Magic Link**
2. In `src/lib/supabase.js`, replace mock with:

```js
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)

export const sendOtp = async (email) => {
  const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false } })
  if (error) throw error
  showToast(`OTP sent to ${email} — check inbox`)
}
export const verifyOtp = async (email, token) => {
  const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'email' })
  return !error && !!data.session
}
```

Pros: No SMS cost, built-in rate limiting, no server code. For SMS, use `signInWithOtp({ phone })`.

### Option B — Cloudflare Pages Function + Email (SendGrid / Resend) — custom 6-digit code

1. Create API route `functions/api/otp.js`:

```js
export async function onRequestPost({ request, env }) {
  const { email, role } = await request.json()
  const code = Math.floor(100000 + Math.random()*900000).toString()
  // Store in KV/DO with TTL 5 min: await env.OTP_KV.put(email.toLowerCase(), code, { expirationTtl: 300 })
  // Fallback: use env variable store (not recommended) or D1
  // Send via SendGrid:
  await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.SENDGRID_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      personalizations: [{ to: [{ email }] }],
      from: { email: "noreply@startify.in" },
      subject: `Your Startify OTP is ${code}`,
      content: [{ type: "text/plain", value: `Your OTP is ${code}. Valid 5 min.` }]
    })
  })
  return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } })
}
```

2. Frontend `sendOtp` becomes:

```js
const sendOtp = async (email, role) => {
  const res = await fetch("/api/otp", { method: "POST", body: JSON.stringify({ email, role }) })
  if (!res.ok) throw new Error("send failed")
  setOtpModalOpen(true)
}
const verifyOtp = async (email, token) => {
  const res = await fetch("/api/otp-verify", { method: "POST", body: JSON.stringify({ email, token }) })
  const { valid } = await res.json()
  return valid
}
```

Add `functions/api/otp-verify.js` that checks KV/D1 and deletes on success.

### Option C — SMS (India) — MSG91 / Twilio for @uohyd.ac.in + phone

If you collect phone, use MSG91 (cheap India OTP) or Twilio.

**MSG91:**

```js
await fetch(`https://control.msg91.com/api/v5/otp?mobile=${phone}&otp=${code}&template_id=${env.MSG91_TEMPLATE_ID}`, {
  headers: { authkey: env.MSG91_AUTHKEY }
})
```

**Twilio Verify:**

```js
import twilio from 'twilio'
const client = twilio(env.TWILIO_SID, env.TWILIO_AUTH)
await client.verify.v2.services(env.TWILIO_SERVICE_SID).verifications.create({ to: `+91${phone}`, channel: 'sms' })
// verify: client.verify.v2.services(...).verificationChecks.create({ to, code })
```

---

## Checklist to go live

- [ ] Remove `showToast(code)` and `localStorage.setItem("startify_otp_map")` from `sendOtp`
- [ ] Add rate limiting (e.g., 3 OTPs / 10 min per email, Cloudflare KV counter)
- [ ] Store code server-side with 5-min TTL, hash it, delete after verify
- [ ] Add env vars in Cloudflare Pages → Settings → Variables: `SENDGRID_API_KEY` / `SUPABASE_URL` / `MSG91_AUTHKEY`
- [ ] Keep `@uohyd.ac.in` gate for Founder/Builder (`isUoHEmail` in `handleAuthSubmit`)
- [ ] Test: blocked non-UoH Founder, allowed Backer any email, OTP expiry, resend

Current mock is kept for `npm run dev` without keys. Set `VITE_USE_MOCK_OTP=false` to force real flow.

