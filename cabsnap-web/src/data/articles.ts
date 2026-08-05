/**
 * ARTICLE REGISTRY — single source of truth for the content section.
 *
 * Index pages, cross-links, and Article schema all read from here, so an
 * article's metadata is written once.
 *
 * EDITORIAL RULES for everything under /guide and /blog. These are not
 * style preferences; they are the reason this section can exist at all.
 *
 *   1. RECORDKEEPING ONLY. Describe what records to keep and why. Never
 *      advise what a reader can or should deduct, and never state an amount
 *      anyone is entitled to. The three articles whose titles name
 *      deductions or per diem must open by saying plainly that they will
 *      not answer the deduction question.
 *   2. CITE THE DOCUMENT. Where an IRS rule is referenced, name the actual
 *      publication or procedure and the year. See SOURCES below.
 *   3. NEVER PRINT A FIGURE THAT CHANGES. Per diem rates are set per federal
 *      fiscal year. Say the rate changes annually and point at the source;
 *      do not print a number that goes stale silently.
 *   4. UNVERIFIED MEANS OMITTED. No estimates, no invented statistics, no
 *      ratings, user counts, or testimonials.
 *   5. NO IFTA OR FUEL-TAX CONTENT ANYWHERE.
 *
 * SOURCES verified against irs.gov on 2026-08-05:
 *   - "How long should I keep records?" — the retention periods and the
 *     definition of the period of limitations.
 *   - Publication 463 — the four elements (amount, time, place, business
 *     purpose), the adequate-records standard, and the special standard
 *     meal allowance for workers under DOT hours of service limits. Also
 *     confirms per diem rates are listed by federal fiscal year at
 *     GSA.gov/travel/plan-book/per-diem-rates.
 *   - Publication 583 — supporting documents, and the electronic storage
 *     conditions (legible, indexed, retrievable, reproducible; originals
 *     destroyed only after testing compliance).
 *   - "What kind of records should I keep" — "All requirements that apply
 *     to hard copy books and records also apply to electronic records."
 *
 * DELIBERATELY OMITTED because they could not be verified from primary
 * sources on that date, and the rule is that unverified facts are left out:
 *   - The dollar threshold under which documentary evidence is not required.
 *     Pub 463's recordkeeping text as retrieved states the exception without
 *     a figure, so no figure is printed anywhere on this site.
 *   - Every per diem dollar rate.
 *   - The clause-level text of Rev. Proc. 97-22 (1997). It is cited as the
 *     authority for electronic storage, consistent with config.ts, but the
 *     specific conditions described in articles are sourced to Pub 583,
 *     whose text was verifiable.
 */

export const REVIEWED = 'August 5, 2026';

export interface Article {
  slug: string;
  kind: 'guide' | 'blog';
  title: string;
  /** H1. May differ from the <title> tag. */
  heading: string;
  description: string;
  /** One line shown on index cards. */
  blurb: string;
  published: string;
  /** ISO, for schema. */
  publishedISO: string;
}

export const ARTICLES: Article[] = [
  {
    slug: 'irs-receipt-requirements',
    kind: 'guide',
    title: 'IRS Receipt Requirements: What Counts as a Record',
    heading: 'IRS receipt requirements',
    description:
      'What the IRS asks of a business record, what makes a receipt adequate, and why a photograph of a receipt is an accepted form of record. Recordkeeping guidance, not tax advice.',
    blurb: 'What makes a record adequate, and why a photo counts.',
    published: 'August 5, 2026',
    publishedISO: '2026-08-05',
  },
  {
    slug: 'how-long-to-keep-tax-records',
    kind: 'guide',
    title: 'How Long to Keep Tax Records — The Actual Periods',
    heading: 'How long to keep tax records',
    description:
      'The retention periods the IRS publishes, what the period of limitations means, and the conditions that make records worth keeping longer. Recordkeeping guidance, not tax advice.',
    blurb: 'The published periods, and the conditions that extend them.',
    published: 'August 5, 2026',
    publishedISO: '2026-08-05',
  },
  {
    slug: 'owner-operator-recordkeeping',
    kind: 'guide',
    title: 'Owner-Operator Recordkeeping: A Practical System',
    heading: 'Owner-operator recordkeeping',
    description:
      'A recordkeeping system built around how an owner-operator actually works: capture at the point of purchase, one place for everything, and records that survive the year.',
    blurb: 'Building a system that survives a year in a truck.',
    published: 'August 5, 2026',
    publishedISO: '2026-08-05',
  },
  {
    slug: 'truck-driver-tax-deductions',
    kind: 'guide',
    title: 'Truck Driver Expense Records: What to Document',
    heading: 'Truck driver expense records',
    description:
      'This article does not tell you what to deduct. It covers the expense categories a tax preparer will ask you to document, and which record substantiates each one.',
    blurb: 'The categories your preparer will ask you to document.',
    published: 'August 5, 2026',
    publishedISO: '2026-08-05',
  },
  {
    slug: 'per-diem-for-truck-drivers',
    kind: 'guide',
    title: 'Per Diem for Truck Drivers: What Records It Takes',
    heading: 'Per diem and the records behind it',
    description:
      'What per diem is, why the rate is not printed here, and the travel records — time, place, and business purpose — that any per diem conversation depends on.',
    blurb: 'Why the rate is not printed here, and what records matter.',
    published: 'August 5, 2026',
    publishedISO: '2026-08-05',
  },
  {
    slug: '1099-tax-deductions',
    kind: 'guide',
    title: '1099 Contractor Expense Records: What to Document',
    heading: '1099 contractor expense records',
    description:
      'With no employer reimbursing you, the paper trail is entirely yours. The expense categories to document as a 1099 contractor and what record supports each.',
    blurb: 'No employer, no reimbursement, no one else filing it.',
    published: 'August 5, 2026',
    publishedISO: '2026-08-05',
  },

  {
    slug: 'why-thermal-receipts-fade',
    kind: 'blog',
    title: 'Why Thermal Receipts Fade — And How Fast',
    heading: 'Why thermal receipts fade',
    description:
      'Thermal paper has no ink. It has a coating that reacts to heat — which is also why a receipt left in a hot cab turns into a blank slip.',
    blurb: 'There is no ink on a fuel receipt. That is the problem.',
    published: 'August 5, 2026',
    publishedISO: '2026-08-05',
  },
  {
    slug: 'what-receipts-to-keep-trucking',
    kind: 'blog',
    title: 'What Receipts to Keep in Trucking',
    heading: 'What receipts to keep',
    description:
      'A practical list of the paper a driver collects, which pieces are worth photographing, and why the small ones are the ones that go missing.',
    blurb: 'The paper worth keeping, and the paper that vanishes.',
    published: 'August 5, 2026',
    publishedISO: '2026-08-05',
  },
  {
    slug: 'scale-tickets-and-lumper-fees',
    kind: 'blog',
    title: 'Scale Tickets and Lumper Fees: The Hardest Receipts',
    heading: 'Scale tickets and lumper fees',
    description:
      'Two of the hardest records a driver has to hold on to: thermal weigh slips that fade, and cash lumper payments that may never produce a receipt at all.',
    blurb: 'Thermal slips that fade and cash that leaves no trace.',
    published: 'August 5, 2026',
    publishedISO: '2026-08-05',
  },
  {
    slug: 'receipts-for-doordash-uber-drivers',
    kind: 'blog',
    title: 'Receipts for DoorDash and Uber Drivers',
    heading: 'Receipts for gig drivers',
    description:
      'Mileage apps handle the miles. Nothing handles the gas, the car washes, the mounts, and the hot bags — the purchases that leave paper behind.',
    blurb: 'Mileage apps do miles. Something has to do the purchases.',
    published: 'August 5, 2026',
    publishedISO: '2026-08-05',
  },
  {
    slug: 'what-happens-if-you-lose-a-receipt',
    kind: 'blog',
    title: 'What Happens If You Lose a Receipt',
    heading: 'What happens if you lose a receipt',
    description:
      'A missing receipt is a missing record, not the end of the world. What the IRS says about incomplete records, and why reconstruction is harder than capture.',
    blurb: 'A missing record is a problem, not a catastrophe.',
    published: 'August 5, 2026',
    publishedISO: '2026-08-05',
  },
];

export const GUIDES = ARTICLES.filter((a) => a.kind === 'guide');
export const POSTS = ARTICLES.filter((a) => a.kind === 'blog');

export const byKind = (kind: 'guide' | 'blog') =>
  ARTICLES.filter((a) => a.kind === kind);

export const findArticle = (slug: string) =>
  ARTICLES.find((a) => a.slug === slug);

/** Path for an article, used by the layout and every cross-link. */
export const articlePath = (a: Article) => `/${a.kind}/${a.slug}`;
