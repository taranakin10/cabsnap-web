# cabsnap-web

Marketing site for CabSnap. Astro, static output, deployed on Railway.

The site has exactly one job: route qualified visitors to the Play Store listing.

---

## Running it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
npm run preview  # serve the built site
```

Node 18 or newer.

---

## Deploying to Railway

1. Push this repo to GitHub.
2. New Railway project → deploy from the repo.
3. Build command `npm run build`, start command `npm start`.
4. Environment variables — copy from `.env.example`:

| Variable | Staging | Production |
|---|---|---|
| `PUBLIC_SITE_URL` | `https://new.getcabsnap.com` | `https://getcabsnap.com` |
| `PUBLIC_NOINDEX` | `true` | `false` |

**`PUBLIC_NOINDEX=true` on staging is not optional.** Without it Google indexes
the staging subdomain and it competes with the live site for the same keywords.

---

## Before this can go live

- [ ] Add the four photos to `public/img/` as WebP (see below)
- [ ] Create `public/img/og-default.jpg` at 1200×630 — the old site shares as a blank card
- [ ] Fill in every `[CONFIRM]` on `/privacy`, `/terms`, and `/security`
- [ ] Legal review of privacy and terms
- [ ] Add the Meta Pixel snippet to `src/layouts/Base.astro`
- [ ] Confirm or remove the "you can correct any field yourself" claim in the FAQ

### Images

Four images, all currently referenced but not committed:

| File | Source | Aspect |
|---|---|---|
| `hero-cab.webp` | Driver photographing a receipt on the wheel | 4:5 |
| `faded-receipt.webp` | Faded thermal receipt on a dashboard | 4:3 |
| `glovebox.webp` | Glovebox stuffed with receipts | 1:1 |
| `hands-receipts.webp` | Hands holding receipts at a fuel island | 1:1 |

Convert to WebP, target under 150KB each. They currently sit on a third-party CDN;
serve them from this domain instead.

---

## Structure

```
src/
├── config.ts             every product fact, in one place
├── styles/global.css     Highway palette tokens
├── layouts/
│   ├── Base.astro        SEO head, schema, UTM + Pixel handling
│   └── Prose.astro       text pages
├── components/
│   ├── Nav.astro  Cta.astro  Faq.astro  IrsProof.astro  Footer.astro
└── pages/
    ├── index.astro
    ├── receipt-app-for-truck-drivers.astro    ← the audience template
    ├── vs/shoeboxed.astro                     ← the comparison template
    └── about, contact, security, privacy, terms
```

---

## Rules for editing this site

These are not style preferences. They exist because the audience is skeptical
and will catch a lie faster than they will notice good design.

### 1. Never invent a fact

No star ratings, download counts, user numbers, testimonials, or statistics that
aren't sourced. Every product fact lives in `src/config.ts`. If it isn't there,
it isn't confirmed, and it doesn't go on the site.

Pricing is deliberately absent. It wasn't confirmed, so it was omitted rather
than guessed.

### 2. No IFTA, no tax advice

No IFTA or fuel-tax language anywhere. The site describes **recordkeeping** —
what to keep and why. It never advises what to deduct. Every page touching tax
topics carries the disclaimer from `config.ts`.

### 3. Answer the awkward questions honestly, in public

The FAQ says there's no mileage tracking and no iOS app. That's on purpose.
Admitting a gap is the most credible thing on the page, and it's the one thing
an incumbent with a full feature list will never do.

### 4. One color, one job

```
navy    surface, ink, structure
orange  the primary action, and nothing else
green   brand mark and confirmation only
```

Green is `#3CBF52` and measures 1.8:1 on the paper background — it fails contrast
badly. It appears **only** on navy, where it reads at about 6:1. On light
backgrounds use `--green-ink`.

Orange never does a second job. That's why the buttons pull. Don't spend it on
decoration.

### 5. Competitor claims must be verifiable and dated

Everything on `/vs/shoeboxed` was checked against their live site and the page
says when. Their product changes; an undated comparison becomes a false claim
by neglect. Re-verify quarterly.

### 6. One page, one keyword

Two pages targeting the same phrase compete with each other and both lose.
Check `cabsnap-site-architecture.md` before adding a page.

---

## Adding an audience page

Copy `src/pages/receipt-app-for-truck-drivers.astro` and change the `RECEIPTS`
and `faq` blocks at the top. The markup stays as-is.

What makes these pages work is naming the *specific* receipts that audience
actually holds. "Business expenses" converts nobody. "Lumper fees" converts
someone who has paid one.

---

## Analytics

`Base.astro` handles two things on every Play Store click: it appends the current
UTM parameters to the Play Store URL as `referrer`, and it fires `PlayStoreClick`.

That's what makes the key diagnostic possible — compare `PlayStoreClick` counts in
Meta Events Manager against store visitor counts in Play Console:

- **Few PlayStoreClicks** → the landing page isn't persuading
- **Many PlayStoreClicks, few installs** → the store listing is losing them

These are different problems with different fixes. Run this before optimizing anything.
