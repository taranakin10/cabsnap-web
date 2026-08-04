import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'https://getcabsnap.com',
  integrations: [sitemap()],
  build: { inlineStylesheets: 'auto' },
  compressHTML: true,
  vite: {
    preview: { allowedHosts: true },
  },
});
