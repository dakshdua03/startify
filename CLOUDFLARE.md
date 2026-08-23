# Cloudflare Pages - Why It's Winner for Startify (Your Commercial Site)

Your corrected table is right:

| Platform | Commercial on Free? | Free Tier |
|---|---|---|
| Cloudflare Pages | YES | Unlimited bandwidth, 500 builds, Workers 100k/day |
| Netlify | YES | 100GB bandwidth, 300 build mins |
| Render | YES | Unlimited static, but sleeps after 15min |
| Vercel Hobby | NO | 100GB, personal only - need Pro $20 when you monetize |
| GitHub Pages | NO | 100GB soft cap, ToS no business sites |

**You will charge people from Jan 2026** → You MUST NOT use Vercel Hobby or GitHub Pages free.

**Your site type:** Vite React static + future Supabase backend → Cloudflare Pages is winner.

**Action:** Deploy this zip to Cloudflare Pages now. It has:
- wrangler.toml
- public/_headers and _redirects (SPA routing)
- functions/api/* (backend placeholders, 100k req/day free, commercial allowed)
- .github/workflows/cloudflare-pages.yml (auto deploy)

**Cost:** $0 for commercial, unlimited bandwidth.

**When to outgrow free?** You won't for long time. Even at 10k users/mo, still free.

**Next:** Add custom domain, then Supabase, then Razorpay.

- Daksh, Founder - Startify