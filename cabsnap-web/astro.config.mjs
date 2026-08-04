import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Staging builds set PUBLIC_NOINDEX=true so Google never indexes new.getcabsnap.com
// and creates duplicate-content competition with the live domain.
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'https://getcabsnap.com',
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
});
