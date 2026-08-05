-- iOS waitlist capture for the CabSnap marketing site.
--
-- The site is a static Astro build with no server, so the browser inserts
-- directly using the anon key. That key is public by design; RLS is the
-- security boundary, which is why this table grants insert and nothing else.
--
-- Apply with:  supabase db push        (or paste into the SQL editor)

create table if not exists public.ios_waitlist (
  id             uuid primary key default gen_random_uuid(),
  contact        text not null,
  contact_type   text not null check (contact_type in ('email', 'phone')),
  source         text,
  utm_source     text,
  utm_medium     text,
  utm_campaign   text,
  -- SMS consent is recorded per record rather than assumed. A phone number
  -- without an explicit tick is not a lawful thing to text.
  sms_consent    boolean not null default false,
  sms_consent_at timestamptz,
  created_at     timestamptz not null default now()
);

-- Dedupe on the normalised value the client sends (lowercased email, or
-- E.164 phone), so a second signup is a no-op rather than a duplicate row.
create unique index if not exists ios_waitlist_contact_key
  on public.ios_waitlist (contact);

alter table public.ios_waitlist enable row level security;

-- Insert only, and only for anon. No select, update, or delete policy exists,
-- so the client cannot read the list back out even with the key in hand.
drop policy if exists ios_waitlist_anon_insert on public.ios_waitlist;
create policy ios_waitlist_anon_insert
  on public.ios_waitlist
  for insert
  to anon
  with check (
    -- Belt and braces: the database itself refuses to store a phone number
    -- that did not come with consent, even if the client is bypassed.
    contact_type = 'email'
    or (contact_type = 'phone' and sms_consent = true and sms_consent_at is not null)
  );

comment on table public.ios_waitlist is
  'Signups for notification when the CabSnap iPhone app ships. Insert-only from the site; read via service role or the dashboard.';
