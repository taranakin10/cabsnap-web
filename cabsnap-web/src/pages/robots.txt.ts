import type { APIRoute } from 'astro';

/**
 * robots.txt, generated rather than served from public/.
 *
 * It used to be a static file with `Sitemap: https://getcabsnap.com/...`
 * typed into it — the non-www host, which 301s. A static file cannot follow
 * PUBLIC_SITE_URL, so it drifted the moment the canonical host changed.
 * Building it here means the Sitemap line comes from the same `site` value as
 * every canonical tag on the site, and cannot disagree with them.
 *
 * The whole site is crawlable. The ad landing pages under /lp/ are kept out of
 * search by a noindex tag on the pages themselves (see Landing.astro), not by
 * a Disallow here — a disallowed page is never fetched, so its noindex is
 * never read, and the URL can still surface in results.
 */
export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('robots.txt needs `site` set in astro.config.mjs');

  const sitemapUrl = new URL('/sitemap-index.xml', site).href;

  const body = `User-agent: *
Allow: /

Sitemap: ${sitemapUrl}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
