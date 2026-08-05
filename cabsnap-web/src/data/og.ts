/**
 * OG IMAGE REGISTRY — one entry per route that needs a share card.
 *
 * The og title is deliberately shorter than the page's <title> tag. A share
 * card is read at a glance in a feed, so it gets the punchy version, not the
 * SEO version.
 *
 * Adding a page? Add it here. `npm run build` fails the audit if a built page
 * points at an OG image that was never generated, so drift gets caught rather
 * than shipping as a blank card.
 */

export interface OgEntry {
  /** Route path, no trailing slash. '' is the homepage. */
  path: string;
  /** Headline on the card. Use \n for an explicit line break. */
  title: string;
  /** Small mono line above the headline. */
  kicker: string;
}

export const OG: OgEntry[] = [
  { path: '', kicker: 'Receipt app for owner-operators', title: 'Snap the receipt.\nKeep the deduction.' },

  // Audience pages
  { path: '/receipt-app-for-truck-drivers', kicker: 'For truck drivers', title: 'Your receipts are\nin the glovebox.' },
  { path: '/receipt-app-for-owner-operators', kicker: 'For owner-operators', title: "It's your truck.\nIt's your paper." },
  { path: '/receipt-app-for-lease-operators', kicker: 'For lease operators', title: 'Their portal.\nYour records.' },
  { path: '/receipt-app-for-1099-contractors', kicker: 'For 1099 contractors', title: 'No employer.\nNo reimbursement.' },
  { path: '/receipt-app-for-gig-drivers', kicker: 'For rideshare & delivery', title: 'Receipts, yes.\nMileage, no.' },
  { path: '/receipt-app-for-local-drivers', kicker: 'For local & regional drivers', title: 'Home nightly.\nPaper still piles up.' },

  // Comparisons
  { path: '/best-receipt-app-for-truck-drivers', kicker: 'Honest roundup', title: 'Best receipt app\nfor truck drivers' },
  { path: '/vs/shoeboxed', kicker: 'Comparison', title: 'CabSnap\nvs Shoeboxed' },
  { path: '/vs/expensify', kicker: 'Comparison', title: 'CabSnap\nvs Expensify' },
  { path: '/vs/spreadsheets', kicker: 'Comparison', title: 'CabSnap\nvs a spreadsheet' },
  { path: '/vs/glovebox', kicker: 'Comparison', title: 'CabSnap\nvs the glovebox' },

  // Tool
  { path: '/tools/undocumented-spend-calculator', kicker: 'Free tool', title: "What did you spend\nthat you can't prove?" },

  // Section indexes
  { path: '/guide', kicker: 'Guides', title: 'Recordkeeping,\nexplained properly.' },
  { path: '/blog', kicker: 'Blog', title: 'Notes on paper.' },

  // Guides
  { path: '/guide/irs-receipt-requirements', kicker: 'Guide', title: 'IRS receipt\nrequirements' },
  { path: '/guide/how-long-to-keep-tax-records', kicker: 'Guide', title: 'How long to keep\ntax records' },
  { path: '/guide/owner-operator-recordkeeping', kicker: 'Guide', title: 'Owner-operator\nrecordkeeping' },
  { path: '/guide/truck-driver-tax-deductions', kicker: 'Guide', title: 'Truck driver\nexpense records' },
  { path: '/guide/per-diem-for-truck-drivers', kicker: 'Guide', title: 'Per diem and the\nrecords behind it' },
  { path: '/guide/1099-tax-deductions', kicker: 'Guide', title: '1099 contractor\nexpense records' },

  // Blog
  { path: '/blog/why-thermal-receipts-fade', kicker: 'Blog', title: 'Why thermal\nreceipts fade' },
  { path: '/blog/what-receipts-to-keep-trucking', kicker: 'Blog', title: 'What receipts\nto keep' },
  { path: '/blog/scale-tickets-and-lumper-fees', kicker: 'Blog', title: 'Scale tickets and\nlumper fees' },
  { path: '/blog/receipts-for-doordash-uber-drivers', kicker: 'Blog', title: 'Receipts for\ngig drivers' },
  { path: '/blog/what-happens-if-you-lose-a-receipt', kicker: 'Blog', title: 'What happens if you\nlose a receipt' },

  // Static
  { path: '/iphone', kicker: 'iPhone & iOS', title: 'Not on iPhone\nyet.' },
  { path: '/about', kicker: 'About', title: 'A receipt app for\npeople who buy fuel.' },
  { path: '/contact', kicker: 'Contact', title: 'Talk to a person.' },
  { path: '/security', kicker: 'Security', title: 'How your records\nare handled.' },
  { path: '/privacy', kicker: 'Privacy', title: 'Privacy policy' },
  { path: '/terms', kicker: 'Terms', title: 'Terms of service' },

  // Ad landing pages
  { path: '/lp/fade', kicker: 'Free on Google Play', title: 'The receipt fades.\nThe photo does not.' },
  { path: '/lp/glovebox', kicker: 'Free on Google Play', title: 'The glovebox is not\na filing system.' },
  { path: '/lp/deduction', kicker: 'Free on Google Play', title: "Spent it. Can't\nprove it." },
];

/**
 * Route path -> OG image URL. Slashes become double-underscores so every
 * image is a flat file with no nested directories to manage.
 */
export function ogSlug(path: string): string {
  const clean = path.replace(/^\/+|\/+$/g, '');
  return clean === '' ? 'home' : clean.replace(/\//g, '__');
}

export function ogImageFor(path: string): string {
  const normalized = '/' + path.replace(/^\/+|\/+$/g, '');
  const entry = OG.find((o) => (o.path === '' ? '/' : o.path) === normalized);
  if (!entry) return '/og/home.png';
  return `/og/${ogSlug(entry.path)}.png`;
}
