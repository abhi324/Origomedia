# ORIGO Creator Analytics — Implementation Roadmap

---

## Phase 1 — MVP (Week 1–2)

### Goal: Working local demo you can show to beta testers.

**Backend**
- [ ] `pip install -r requirements.txt`
- [ ] `playwright install chromium`
- [ ] Copy `.env.example` → `.env`, fill SUPABASE_URL + SUPABASE_KEY
- [ ] Run schema: paste `supabase/schema.sql` into Supabase SQL editor
- [ ] `uvicorn main:app --reload` → API on port 8000
- [ ] Test: `POST /api/v1/lookup` with body `{"username":"hudabeauty","platform":"instagram"}`

**Frontend**
- [ ] `cd frontend && npm install`
- [ ] Copy `.env.example` → `.env.local`, fill NEXT_PUBLIC vars
- [ ] `npm run dev` → Dashboard on port 3000
- [ ] Search a creator → see analytics card rendered

**Validation checklist (MVP)**
- Search for 5 known beauty creators and confirm data returns
- Confirm engagement rate formula: (likes + comments) / followers × 100
- Confirm niche detection works for bio keywords
- Submit 1 verification request end-to-end via UI
- Approve it from admin panel at `/admin`

---

## Phase 2 — Production Hardening (Week 3–4)

### Scraping quality
- [ ] Sign up for SerpAPI (free 100/mo, $50/mo for 5,000)
- [ ] Sign up for ScrapingBee (free 1,000 credits)
- [ ] Add SERPAPI_KEY + SCRAPING_BEE_KEY to `.env`
- [ ] Re-test all three platforms — confidence scores should be ≥ 0.7

### Background jobs
- [ ] `docker compose up redis` → Redis running
- [ ] `celery -A worker.celery_app worker` → Worker running
- [ ] Enqueue 50 beauty creator lookups as a batch test

### Database
- [ ] Enable Supabase Point-in-Time Recovery
- [ ] Create `analytics_snapshots` cron (nightly) to snapshot all creators
- [ ] Set up Supabase weekly backups

---

## Phase 3 — Scale (Month 2)

### Infrastructure
- [ ] Deploy backend to Railway or Fly.io (both support Docker)
- [ ] Deploy frontend to Vercel (zero config for Next.js)
- [ ] Deploy Redis to Upstash (serverless, free tier is generous)
- [ ] Set up environment variables in each platform's dashboard

### Proxy rotation (for Instagram/TikTok reliability)
- [ ] Sign up for Bright Data Residential Proxies
  - Add proxy credentials to `ScrapingBee` calls (already wired)
  - OR configure Playwright to use proxy pool directly
- [ ] Target: >80% success rate on Instagram scrapes

### Admin improvements
- [ ] Add Supabase Auth for admin login (replace header key)
- [ ] Email notification when new verification request arrives
- [ ] Bulk approve/reject in admin queue
- [ ] Creator score trend chart (uses analytics_snapshots)

---

## Anti-Ban Strategy (Critical)

### Rate Limiting
| Platform   | Recommended delay | Hard limit     |
|------------|-------------------|----------------|
| Instagram  | 4–8s per request  | Max 30/hour    |
| YouTube    | 2–4s per request  | Max 60/hour    |
| TikTok     | 5–12s per request | Max 20/hour    |

### User Agent Rotation
Already implemented in `utils/user_agents.py`. Rotate per-request.

### Request fingerprinting reduction
- Block fonts/images in Playwright (already done)
- Use `navigator.webdriver = undefined` patch (done for TikTok)
- Use mobile viewport for TikTok (done)
- Add realistic mouse movements for high-value scrapes (Phase 3)

### Caching strategy
- Cache all results for **1 hour** (Redis TTL)
- Never re-scrape a profile within 1 hour
- For verified creators, refresh every 24h via background job

### IP health
- Use ScrapingBee / residential proxies for Instagram and TikTok
- YouTube is relatively permissive — direct requests usually work
- Rotate proxies every 10–15 requests per IP

---

## Folder Structure

```
origometer/
├── backend/
│   ├── main.py                  ← FastAPI app entry
│   ├── config.py                ← Settings (pydantic-settings)
│   ├── worker.py                ← Celery async jobs
│   ├── api/
│   │   ├── routes.py            ← Public API endpoints
│   │   └── admin.py             ← Admin-only endpoints
│   ├── scrapers/
│   │   ├── base.py              ← Abstract scraper + RawCreatorData
│   │   ├── instagram.py         ← Instagram scraper (3-method waterfall)
│   │   ├── youtube.py           ← YouTube scraper
│   │   ├── tiktok.py            ← TikTok scraper
│   │   └── search_discovery.py  ← SerpAPI + ScrapingBee
│   ├── services/
│   │   ├── analytics.py         ← Build final CreatorAnalytics payload
│   │   └── niche_detector.py    ← Keyword-based niche detection
│   ├── db/
│   │   ├── supabase_client.py   ← Supabase singleton
│   │   └── repository.py        ← All DB operations
│   └── utils/
│       ├── normalizer.py        ← "42.5K" → 42500
│       ├── rate_limiter.py      ← Redis-backed throttle + cache
│       └── user_agents.py       ← Rotating UA strings
│
├── frontend/
│   ├── app/
│   │   ├── layout.tsx           ← Root layout + fonts
│   │   ├── page.tsx             ← Main discovery dashboard
│   │   ├── globals.css          ← Tailwind + design tokens
│   │   └── admin/
│   │       └── page.tsx         ← Verification queue admin UI
│   ├── components/
│   │   ├── SearchPanel.tsx      ← Username + platform input
│   │   ├── CreatorCard.tsx      ← Discovery grid card
│   │   ├── CreatorDetailModal.tsx  ← Full analytics modal
│   │   ├── DiscoveryFilters.tsx ← Sidebar filters
│   │   ├── StatsBar.tsx         ← Live stats header bar
│   │   └── VerificationRequestForm.tsx
│   ├── lib/
│   │   ├── api.ts               ← All API calls (typed)
│   │   └── utils.ts             ← cn(), formatNumber(), etc.
│   └── types/
│       └── index.ts             ← TypeScript interfaces
│
├── supabase/
│   └── schema.sql               ← Full DB schema with RLS
│
├── docs/
│   └── IMPLEMENTATION_ROADMAP.md
├── docker-compose.yml
└── .env.example
```

---

## Creator Score Formula

| Factor                    | Max Points | Logic                                      |
|---------------------------|------------|--------------------------------------------|
| Followers tier            | 20         | 1M+ = 20, 100K+ = 15, 10K+ = 10, 1K+ = 5  |
| Engagement rate           | 40         | 2–6% sweet spot = 40, 1–2% = 25, >15% = 15|
| Bio completeness          | 15         | >30 chars = 15, present = 7               |
| Profile image             | 10         | Present = 10                               |
| Data confidence           | 15         | confidence × 15                            |
| **Total**                 | **100**    |                                            |

**Brand trust tiers:**
- 80–100: Premium creator ✦
- 60–79:  Strong creator
- 40–59:  Developing creator
- <40:    Needs review

---

## Confidence Score Logic

Data confidence (0.0–1.0) is calculated from the presence of verified fields:

| Field                 | Weight |
|-----------------------|--------|
| Profile name present  | +0.20  |
| Followers present     | +0.30  |
| Bio present           | +0.15  |
| Profile image present | +0.10  |
| Post count present    | +0.10  |
| Following count       | +0.05  |
| Platform verified     | +0.10  |

Confidence ≥ 0.7 = display "High Confidence" badge
Confidence ≥ 0.5 = "Medium Confidence"
Below 0.5 = "Low Confidence" (data may be partial)

---

## SaaS Scaling Path

When you want to grow ORIGO into a full platform:

1. **Auth layer** — Add Supabase Auth for brand accounts
2. **Saved lists** — Brands can save creator shortlists
3. **Campaign tracking** — Link creators to active campaigns
4. **Outreach CRM** — Track brand ↔ creator communication
5. **Bulk discovery** — Upload a CSV of usernames for batch analytics
6. **API access tier** — Expose the analytics API as a paid product
7. **Chrome extension** — Analyze creators while browsing Instagram/TikTok
