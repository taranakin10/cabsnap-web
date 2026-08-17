import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * CANONICAL HOST — the single source of truth for every absolute URL.
 *
 * The site is served at https://www.getcabsnap.com only, with no trailing
 * slashes. Non-www 301s to www. Canonical tags, og:url, og:image, the JSON-LD
 * url/@id fields, robots.txt and the sitemap all derive from `site` below —
 * nothing types a host literal into a page. Change it here or in
 * PUBLIC_SITE_URL, and everything follows.
 *
 * The fallback is the www form on purpose: a build with PUBLIC_SITE_URL unset
 * (a fresh environment, a local build, a fork) must still emit URLs that
 * resolve 200 rather than URLs that 301.
 */
const SITE_URL = process.env.PUBLIC_SITE_URL || 'https://www.getcabsnap.com';

/**
 * Route prefixes that are deliberately noindex and therefore have no business
 * in the sitemap. Keep this in sync with the `noindex` prop set by
 * src/layouts/Landing.astro — a page that says noindex and appears in the
 * sitemap is a contradiction Google reports as an error.
 */
const NOINDEX_PREFIXES = ['/lp/'];

/**
 * NOINDEX SAFETY RAIL.
 *
 * PUBLIC_NOINDEX=true exists for staging. On 8-10 Aug 2026 Google crawled five
 * live pages and found a noindex tag, which means the production build was
 * once made with this switch on. It cannot happen silently again: if the
 * global switch is on while building for the production host, the build fails
 * here rather than shipping an unindexable site.
 *
 * Note the direction of the default. Only the exact string 'true' turns
 * noindex on; anything else — unset, empty, 'false', whitespace — leaves the
 * site indexable. This must never be inverted. An unset variable that noindexes
 * production is a failure mode with no visible symptom until traffic is gone.
 */
const NOINDEX = process.env.PUBLIC_NOINDEX?.trim().toLowerCase() === 'true';
const PRODUCTION_HOSTS = ['getcabsnap.com', 'www.getcabsnap.com'];

if (NOINDEX && PRODUCTION_HOSTS.includes(new URL(SITE_URL).hostname)) {
  throw new Error(
    `Refusing to build: PUBLIC_NOINDEX=true while PUBLIC_SITE_URL is ${SITE_URL}.\n` +
      'That combination noindexes the live site. PUBLIC_NOINDEX belongs on staging\n' +
      'hosts only — unset it for production, or point PUBLIC_SITE_URL at staging.',
  );
}

/** Tracks sitemap URLs already written, so normalisation cannot emit a route twice. */
const emitted = new Set();

export default defineConfig({
  site: SITE_URL,

  /**
   * TRAILING SLASHES — this value describes what the server does, not what we
   * would like it to do.
   *
   * `astro preview` (which is what `npm start` runs on Railway) serves the
   * build in dist/. With build.format `directory` a page is dist/about/index.html,
   * and under `ignore` both /about and /about/ return 200. That is the actual
   * behaviour, verified against the running preview, so `ignore` is what goes here.
   *
   * `never` was tried and rejected: it makes preview return 404 for /about/.
   * The old sitemap advertised the trailing-slash form for months, so those
   * URLs are in Google's index — 404ing them is strictly worse than the
   * duplicate they are today.
   *
   * The site still advertises exactly ONE form. /about is what the canonical
   * tag, og:url and the sitemap all say (see `serialize` below); /about/ merely
   * keeps working. Google consolidates on the canonical.
   */
  trailingSlash: 'ignore',

  integrations: [
    sitemap({
      filter: (page) => {
        const { pathname } = new URL(page);
        return !NOINDEX_PREFIXES.some((prefix) => pathname.startsWith(prefix));
      },
      /**
       * This is what actually strips the trailing slashes.
       *
       * Left alone, the integration emits https://www.getcabsnap.com/about/
       * because build.format is `directory` — which is not what the canonical
       * tag on that page says, so the sitemap and the page disagree about the
       * URL of every route on the site. Normalising here makes the sitemap
       * entry byte-identical to the canonical.
       *
       * The homepage keeps its slash, because its canonical is
       * https://www.getcabsnap.com/ — same rule, not an exception to it.
       *
       * The dedupe is needed because the integration de-duplicates its URL
       * list BEFORE serialize runs, so any collision normalising creates has
       * to be resolved here (returning nothing drops an entry).
       */
      serialize: (item) => {
        const url = new URL(item.url);
        if (url.pathname !== '/') url.pathname = url.pathname.replace(/\/+$/, '');
        if (emitted.has(url.href)) return undefined;
        emitted.add(url.href);
        return { ...item, url: url.href };
      },
    }),
  ],

  build: { inlineStylesheets: 'auto' },
  compressHTML: true,

  // `astro preview` only honors Astro's own server.allowedHosts,
  // not vite.preview.allowedHosts
  server: {
    allowedHosts: [
      'getcabsnap.com',
      'www.getcabsnap.com',
      'site-production-235e.up.railway.app',
      '.up.railway.app',
    ],
  },
});
