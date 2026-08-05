import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'https://getcabsnap.com',
  integrations: [sitemap()],
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
