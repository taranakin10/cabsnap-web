import type { APIRoute, GetStaticPaths } from 'astro';
import satori from 'satori';
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { OG, ogSlug } from '../../data/og';

/**
 * Build-time OG card generation. One 1200x630 PNG per route in the registry.
 *
 * Satori renders the layout to SVG with the text already converted to vector
 * paths, which means sharp can rasterize it without any system font being
 * installed — important because the Railway build container has none.
 *
 * Palette is the Highway palette from global.css, repeated here because this
 * runs in Node with no access to CSS custom properties.
 */
const NAVY = '#14213D';
const PAPER = '#F7F6F3';
const ORANGE = '#F26B21';
const GREEN = '#3CBF52';
const MUTED = '#9AA3B8';

// Resolved from the project root, not import.meta.url: this module is bundled
// into dist/ before it executes, so a relative URL would point at the wrong
// place. Astro builds run with cwd at the project root.
const font = readFileSync(
  join(process.cwd(), 'src/assets/fonts/BarlowCondensed-Black.ttf'),
);

export const getStaticPaths: GetStaticPaths = () =>
  OG.map((entry) => ({
    params: { slug: ogSlug(entry.path) },
    props: { entry },
  }));

export const GET: APIRoute = async ({ props }) => {
  const { entry } = props as { entry: (typeof OG)[number] };
  const lines = entry.title.split('\n');

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: NAVY,
          padding: '68px 72px',
          fontFamily: 'Barlow Condensed',
        },
        children: [
          // Kicker
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                fontSize: '26px',
                letterSpacing: '4px',
                textTransform: 'uppercase',
                color: ORANGE,
              },
              children: entry.kicker.toUpperCase(),
            },
          },
          // Headline
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'column' },
              children: lines.map((line) => ({
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    fontSize: lines.length > 1 ? '86px' : '96px',
                    lineHeight: 1.02,
                    letterSpacing: '-1px',
                    textTransform: 'uppercase',
                    color: PAPER,
                  },
                  children: line.toUpperCase(),
                },
              })),
            },
          },
          // Footer: wordmark + rule
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: `2px solid rgba(247,246,243,0.16)`,
                paddingTop: '26px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', fontSize: '42px', letterSpacing: '-1px' },
                    children: [
                      { type: 'span', props: { style: { color: PAPER }, children: 'CAB' } },
                      { type: 'span', props: { style: { color: GREEN }, children: 'SNAP' } },
                    ],
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', fontSize: '24px', letterSpacing: '2px', color: MUTED },
                    children: 'GETCABSNAP.COM',
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [{ name: 'Barlow Condensed', data: font, weight: 900, style: 'normal' }],
    },
  );

  const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
