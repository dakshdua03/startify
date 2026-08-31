
# Startify - Daksh Dua | Accelerator @ UoH

**I help founders at UoH build & grow profitable businesses.**

This is the full local codebase for Startify platform - positioned as YOUR accelerator brand, not just a community board.

## Founder Brand Positioning
- You are the product, Startify is the method
- Services are monetizable (Idea Validation ₹999, MVP ₹4999, Growth ₹2999/mo, Fundraising ₹1999, Team Free, Community Free→₹499/yr)
- Batch 1 free till Dec 2025, paid Jan 2026 - urgency to lock free
- 8-week Startify Accelerate program Batch 1 free → next ₹9999

## Features Included
1. **Hero with Daksh as accelerator** - profile card, stats 11 businesses, 187 members, 2x growth
2. **Services grid** - 6 monetizable services with outcome badges, booking modals
3. **8-Week Accelerator** - dark section, week breakdown, Apply CTA
4. **5 Community Tools** - Ideas, Business & Resources, Skills & Talent, Core Team, Community - with your custom logos (in src/assets/)
5. **Case Studies** - Businesses you've helped grow (UoH Merch 2.6x, CampusKart 0→47 users, Chai & Code idea→revenue)
6. **Pricing Table** - Free / Builder ₹999/mo / Accelerator ₹9999 - monthly/yearly toggle, future monetization note
7. **Booking System** - Modal with form (name, idea, help, budget) saves to localStorage key startify_bookings, ready for Razorpay integration
8. **Group Modals** - WhatsApp join flow via Daksh request
9. **Admin Panel** - Separate artifact (container:///mnt/data/startify_admin_panel_agentic_artifact_3_37fce3d03942.html) - password startifyUoH2025 - manages Ideas, Talent, Businesses, Mentors, Community, Members, Events, Settings, Export JSON

## Run Locally
```bash
npm install
npm run dev
```
Open http://localhost:3000

## Build for Production
```bash
npm run build
npm run preview
```

## Future Monetization - How You Charge (as requested)
1. **Add Razorpay**: 
   - Create .env with VITE_RAZORPAY_KEY_ID
   - In src/App.jsx handleSubmit, after form save, call Razorpay checkout
   - Example in code comments near handleSubmit

2. **Database**: Replace localStorage with Supabase/Firebase
   - Create table bookings, ideas, talent
   - Update handleSubmit to insert to Supabase

3. **UoH Verification**: Add email check @uohyd.ac.in for free tier

4. **Deploy**: Vercel - import this folder, env vars, deploy

## Your Logos Included
- src/assets/startify_ideas_logo_1.webp
- src/assets/startify_business_resources_logo_1.webp
- src/assets/startify_skills_talent_badge.webp
- src/assets/core_team_shield_logo.webp
- src/assets/community_network_logo.webp
All have beautiful Startify wordmark small + group icon big - as you requested (group purpose broad, Startify logo small but present)

## Admin Panel
Full admin is at artifact link. To integrate locally:
- Copy admin artifact source into src/Admin.jsx
- Add route in main.jsx: <Route path="/admin" element={<Admin />} />

Password: startifyUoH2025

## Contact
Daksh Dua - dakshdua03 Instagram
Built to help people grow businesses with Startify platform

## Next Steps You Asked
- Charge people: pricing table already shows future prices, Razorpay placeholder ready
- Market YOU not just idea: hero is Daksh, services are your offers, case studies are your wins, Startify is your system

Enjoy!


---

## ☁️ Cloudflare Pages Deployment (RECOMMENDED FOR YOU - Commercial Use Allowed on Free)

### Why Cloudflare Pages for Startify?
- **YES commercial use on FREE tier** - Unlike Vercel Hobby ($0 but personal only), Cloudflare explicitly allows monetization on free. You will charge ₹999/₹2999/₹9999 from Jan 2026, so you NEED this.
- **Unlimited bandwidth** - UoH has 5000+ students, if your Idea Board goes viral, Netlify 100GB cap would cut you. Cloudflare = unlimited, no overage bills.
- **500 builds/mo, custom domains free, Workers 100k req/day free**

### Deploy in 2 minutes (Dashboard method - easiest):

1. Push this folder to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Startify accelerator v2 - Cloudflare ready"
   git branch -M main
   git remote add origin https://github.com/dakshdua03/startify.git
   git push -u origin main
   ```

2. Go to https://dash.cloudflare.com → Pages → Create a project → Connect to Git → Select `startify` repo

3. Build settings:
   - Framework preset: Vite
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/` (leave empty)

4. Env vars (Add in Cloudflare Pages → Settings → Environment variables):
   ```
   VITE_RAZORPAY_KEY_ID=rzp_test_xxxx
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=xxxx
   ```

5. Click Save and Deploy → Live at `startify-daksh-accelerator.pages.dev`

6. Add custom domain (free): Pages → Custom domains → `startify.yourdomain.com` or `dakshdua03.com`

### Deploy via Wrangler CLI (alternative):

```bash
npm install -g wrangler
wrangler login
npm run build
wrangler pages publish dist --project-name=startify-daksh-accelerator
```

### GitHub Actions Auto-Deploy (already included):

File `.github/workflows/cloudflare-pages.yml` auto-deploys on every push to main.

Setup secrets in GitHub repo → Settings → Secrets:
- `CLOUDFLARE_API_TOKEN` - from Cloudflare → My Profile → API Tokens → Create Token → Edit Cloudflare Workers template
- `CLOUDFLARE_ACCOUNT_ID` - from Cloudflare Dashboard → right sidebar

### Cloudflare Pages Functions (Backend - optional):

You have `functions/api/bookings.js` and `functions/api/ideas.js` already.

- They run on Cloudflare's edge, 100k req/day free, commercial allowed
- Currently they just return success and rely on frontend localStorage
- To make real DB: connect Supabase in the function, or KV namespace

Example: To save bookings to KV:
1. Cloudflare Dashboard → Workers & Pages → KV → Create namespace `BOOKINGS`
2. Pages → your project → Settings → Functions → KV namespace bindings → Add `BOOKINGS_KV`
3. Uncomment KV code in `functions/api/bookings.js`

### What about backend / DB?

- **Frontend**: Cloudflare Pages (this project)
- **Database**: Supabase free tier (also allows commercial) - 500MB, 50k monthly active users free
- **Payments**: Razorpay (client-side checkout works on Cloudflare Pages)
- **No need for Render** - Render free sleeps after 15 min, bad for store/API

### Migration from Vercel/Netlify?

If you already deployed to Vercel Hobby, migrate now before you start charging, because Vercel ToS will force Pro $20/mo once you monetize. Cloudflare free stays free for commercial.

### Your Monetization Path on Cloudflare Free:

- Till Dec 2025: Free for UoH - build proof, get 7 founders for Batch 1
- Jan 2026: Add Razorpay checkout in `src/App.jsx` handleSubmit → call `functions/api/bookings.js` which creates Razorpay order
- Still on Cloudflare Pages free tier - no need to pay Cloudflare

<!-- deploy-trigger: 2026-08-31 rebake VITE_SUPABASE envs for CORS fix -->

---

