/**
 * Single source of truth for product facts and copy constants.
 *
 * RULE: Nothing in this file may be invented. Every value here is a confirmed
 * fact about CabSnap. If a fact is not confirmed, it does not go on the site.
 *
 * Specifically NOT present, and deliberately so:
 *   - star ratings, download counts, user counts
 *   - testimonials
 *   - pricing (not yet confirmed — omit rather than guess)
 *   - any IFTA or fuel-tax language
 *   - mileage tracking (the app does not do this)
 */

export const SITE = {
  name: 'CabSnap',
  domain: 'getcabsnap.com',
  tagline: 'Snap the receipt. Keep the deduction.',
  description:
    "Point your phone at any receipt. CabSnap's AI reads it, files it, and keeps it — built for owner-operators and 1099 drivers.",
  company: 'Nuvol Holdings LLC',
  /** Full registered address — use where an address is what's wanted (footer, legal). */
  companyLocation: '426 Main St. #166, Spotswood, NJ 08884',
  /** Short form for running prose, where a street address reads badly. */
  companyCity: 'Spotswood, NJ',
  email: 'admin@getcabsnap.com',
  packageId: 'com.getcabsnap.android',
} as const;

/**
 * Contact routing. These mailboxes are the ones named in the privacy policy
 * and terms — keep them in sync with those documents rather than inventing
 * new addresses here.
 */
export const CONTACTS = {
  general: 'admin@getcabsnap.com',
  privacy: 'privacy@getcabsnap.com',
  security: 'security@getcabsnap.com',
  legal: 'legal@getcabsnap.com',
} as const;

export const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.getcabsnap.android';

export const CTA = {
  primary: 'Download for Free',
  note: 'Free to download.',
  nav: 'Get the app',
} as const;

/** Confirmed platform facts. Answered honestly wherever a visitor might ask. */
export const PLATFORM = {
  android: true,
  ios: false,
  mileageTracking: false,
  inAppPurchases: true,
} as const;

/**
 * IRS electronic-records conditions, from Rev. Proc. 97-22.
 * This is a public government source and the only external authority the site cites.
 * The site describes recordkeeping requirements. It never gives tax advice.
 */
export const IRS = {
  citation: 'IRS Rev. Proc. 97-22, Recordkeeping — Electronic Storage Systems',
  conditions: [
    'The copy is identical to the original',
    'The image is clear and readable',
    'You can produce a printed copy if asked',
    'The records are stored securely',
  ],
} as const;

export const DISCLAIMER =
  'CabSnap is a receipt capture and recordkeeping tool. It is not a tax preparation service and does not provide tax, legal, or accounting advice. Consult a qualified tax professional about your own circumstances.';

export const AUDIENCES = [
  { slug: 'truck-drivers', label: 'Truck drivers', note: 'Fuel, tolls, repairs' },
  { slug: 'owner-operators', label: 'Owner-operators', note: 'Your truck, your expenses' },
  { slug: 'lease-operators', label: 'Lease operators', note: 'Settlement deductions' },
  { slug: '1099-contractors', label: '1099 contractors', note: 'No employer, no reimbursement' },
  { slug: 'gig-drivers', label: 'Gig drivers', note: 'Rideshare & delivery' },
  { slug: 'local-drivers', label: 'Local & regional', note: 'Home nightly, paper still piles up' },
] as const;
