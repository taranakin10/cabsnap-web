/**
 * iOS waitlist capture.
 *
 * THE SWAP POINT: `deliver()` at the bottom of this file is the only thing
 * that knows where a signup goes. Moving to Klaviyo means rewriting that one
 * function — the form, the parsing, the consent rules, and the duplicate
 * handling above it all stay put.
 *
 * Runs in the browser: the site is a static build with no server. The anon
 * key is public by design and the table is insert-only under RLS, so the key
 * being in the bundle is the intended Supabase model, not a leak. It must
 * never be swapped for a service_role key.
 */

export type ContactType = 'email' | 'phone';

export interface WaitlistPayload {
  contact: string;
  contact_type: ContactType;
  source: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  sms_consent: boolean;
  sms_consent_at: string | null;
}

export type SubmitResult =
  | { ok: true }
  | { ok: false; reason: 'invalid' | 'needs_consent' | 'network' };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Decides whether the single input holds an email or a US phone number, and
 * returns it normalised so the unique index dedupes reliably.
 *
 * Phone rules are deliberately narrow: 10 digits, or 11 starting with 1.
 * Anything else is not a US number we can text, so it is rejected rather
 * than stored as something we cannot use.
 */
export function parseContact(raw: string): { value: string; type: ContactType } | null {
  const input = raw.trim();
  if (!input) return null;

  if (input.includes('@')) {
    const value = input.toLowerCase();
    return EMAIL.test(value) ? { value, type: 'email' } : null;
  }

  const digits = input.replace(/\D/g, '');
  if (digits.length === 10) return { value: `+1${digits}`, type: 'phone' };
  if (digits.length === 11 && digits.startsWith('1')) return { value: `+${digits}`, type: 'phone' };
  return null;
}

/** Reads the UTMs the visitor arrived with, if any. */
export function captureContext(loc: Location = window.location) {
  const q = new URLSearchParams(loc.search);
  const get = (k: string) => {
    const v = q.get(k);
    return v && v.trim() ? v.trim().slice(0, 200) : null;
  };
  return {
    source: loc.pathname,
    utm_source: get('utm_source'),
    utm_medium: get('utm_medium'),
    utm_campaign: get('utm_campaign'),
  };
}

export function buildPayload(raw: string, smsConsent: boolean): WaitlistPayload | 'invalid' | 'needs_consent' {
  const parsed = parseContact(raw);
  if (!parsed) return 'invalid';
  // A phone number without a tick is not submitted at all. The RLS policy
  // rejects it too, but it should never get that far.
  if (parsed.type === 'phone' && !smsConsent) return 'needs_consent';

  return {
    contact: parsed.value,
    contact_type: parsed.type,
    ...captureContext(),
    sms_consent: parsed.type === 'phone' ? true : smsConsent,
    sms_consent_at: parsed.type === 'phone' || smsConsent ? new Date().toISOString() : null,
  };
}

export async function submitWaitlist(raw: string, smsConsent: boolean): Promise<SubmitResult> {
  const payload = buildPayload(raw, smsConsent);
  if (payload === 'invalid') return { ok: false, reason: 'invalid' };
  if (payload === 'needs_consent') return { ok: false, reason: 'needs_consent' };
  return deliver(payload);
}

// ---------------------------------------------------------------------------
// Delivery. Replace the body of this function to move to Klaviyo.
// ---------------------------------------------------------------------------
async function deliver(payload: WaitlistPayload): Promise<SubmitResult> {
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // Unconfigured is a deployment problem, not something to show a visitor
    // a database error about.
    console.warn('[waitlist] PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_ANON_KEY are not set');
    return { ok: false, reason: 'network' };
  }

  try {
    const res = await fetch(`${url}/rest/v1/ios_waitlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) return { ok: true };

    // 409 / 23505 is the unique index doing its job: they are already on the
    // list. From the visitor's side that is a success, not an error.
    if (res.status === 409) return { ok: true };
    const body = await res.text().catch(() => '');
    if (body.includes('23505') || body.includes('duplicate key')) return { ok: true };

    console.warn('[waitlist] insert failed', res.status, body);
    return { ok: false, reason: 'network' };
  } catch (err) {
    console.warn('[waitlist] request failed', err);
    return { ok: false, reason: 'network' };
  }
}
