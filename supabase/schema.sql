-- Habi ng Basey — source of truth for tables, RLS and seed.
-- Paste the whole file into the Supabase SQL editor and run once.
-- Officer account: create it in Dashboard → Authentication → Users (email + password). No sign-up UI.

-- ---------- tables ----------
create table if not exists public.orders (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique check (code ~ '^HB-[A-HJ-NP-Z2-9]{4}$'),
  created_at  timestamptz not null default now(),
  buyer_name  text not null check (char_length(buyer_name) between 2 and 80),
  contact     text not null check (contact ~ '^(09|\+639)[0-9]{9}$'),
  size        text not null check (size in ('2x3', '3x5', '4x6', '5x7')),
  pattern     text not null check (pattern in ('bulaklak', 'diamond', 'stripes', 'dahon', 'church', 'lettering')),
  quantity    int  not null check (quantity between 1 and 500),
  needed_by   date not null,
  notes       text check (char_length(notes) <= 500),
  status      text not null default 'received' check (status in ('received', 'weaving', 'ready', 'picked_up'))
);

create table if not exists public.order_events (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references public.orders (id) on delete cascade,
  from_status text check (from_status in ('received', 'weaving', 'ready', 'picked_up')),
  to_status   text not null check (to_status in ('received', 'weaving', 'ready', 'picked_up')),
  note        text check (char_length(note) <= 300),
  created_at  timestamptz not null default now()
);

create index if not exists orders_needed_by_idx on public.orders (needed_by);
create index if not exists order_events_order_id_idx on public.order_events (order_id, created_at);

-- ---------- RLS ----------
alter table public.orders enable row level security;
alter table public.order_events enable row level security;

drop policy if exists "anon places orders" on public.orders;
create policy "anon places orders" on public.orders
  for insert to anon with check (status = 'received');

drop policy if exists "officer reads orders" on public.orders;
create policy "officer reads orders" on public.orders
  for select to authenticated using (true);

drop policy if exists "officer updates orders" on public.orders;
create policy "officer updates orders" on public.orders
  for update to authenticated using (true) with check (true);

drop policy if exists "officer reads events" on public.order_events;
create policy "officer reads events" on public.order_events
  for select to authenticated using (true);

drop policy if exists "officer adds events" on public.order_events;
create policy "officer adds events" on public.order_events
  for insert to authenticated with check (true);

-- No anon SELECT on either table. Buyers read through get_order() only.

-- ---------- buyer tracking ----------
-- Returns {"order": {...without contact}, "events": [...]} or NULL when the code is unknown.
create or replace function public.get_order(p_code text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'order', to_jsonb(o) - 'contact',
    'events', coalesce(
      (select jsonb_agg(to_jsonb(e) order by e.created_at)
         from public.order_events e
        where e.order_id = o.id),
      '[]'::jsonb)
  )
  from public.orders o
  where o.code = upper(trim(p_code))
$$;

revoke all on function public.get_order(text) from public;
grant execute on function public.get_order(text) to anon, authenticated;

-- ---------- seed: 12 orders ----------
insert into public.orders (code, created_at, buyer_name, contact, size, pattern, quantity, needed_by, notes, status) values
  ('HB-K7P2', '2026-09-20 09:10+08', 'Maricel Dacuycuy',            '09171234501', '4x6', 'bulaklak',  1,  '2026-10-20', 'Wedding gift for my niece. Magenta and gold if possible.', 'ready'),
  ('HB-M3QX', '2026-09-26 14:30+08', 'Tacloban Souvenir Hub',       '09181234502', '2x3', 'stripes',   20, '2026-10-25', null, 'weaving'),
  ('HB-R9TW', '2026-10-01 11:05+08', 'Ana Lim',                     '09191234503', '3x5', 'diamond',   1,  '2026-11-05', 'Visiting Basey Oct 4, can I watch the weaving?', 'received'),
  ('HB-D4HN', '2026-09-28 08:45+08', 'Leyte Park Hotel – Front Desk','09201234504', '3x5', 'dahon',     10, '2026-10-02', null, 'weaving'),
  ('HB-F6VY', '2026-10-02 16:20+08', 'Kape Tinapay Café',           '09211234505', '5x7', 'lettering', 2,  '2026-11-15', 'Weave the word KAPE across the center.', 'received'),
  ('HB-B2ZC', '2026-09-10 10:00+08', 'Rosalinda Cabueños',          '09221234506', '3x5', 'church',    1,  '2026-09-28', 'For the fiesta of San Miguel.', 'picked_up'),
  ('HB-G8JL', '2026-09-15 13:15+08', 'Catbalogan Pilot School',     '09231234507', '2x3', 'stripes',   15, '2026-10-01', 'Classroom reading mats.', 'ready'),
  ('HB-N5WK', '2026-09-30 09:40+08', 'Samar Provincial Tourism Office','09241234508','5x7','church',   1,  '2026-11-20', 'Exhibit piece for the provincial capitol lobby.', 'weaving'),
  ('HB-P7QD', '2026-10-02 12:00+08', 'Calicoan Surf Resort',        '09251234509', '4x6', 'diamond',   8,  '2026-12-01', null, 'received'),
  ('HB-T3XM', '2026-09-05 15:30+08', 'Ernesto Villanueva',          '09261234510', '3x5', 'bulaklak',  1,  '2026-09-25', 'Pasalubong for Canada.', 'picked_up'),
  ('HB-W9CF', '2026-09-22 10:25+08', 'Palo Cathedral Parish Office','09271234511', '4x6', 'church',    1,  '2026-10-10', null, 'ready'),
  ('HB-H4RS', '2026-10-03 08:05+08', 'Calbayog Pasalubong Center',  '09281234512', '2x3', 'dahon',     12, '2026-11-10', null, 'received')
on conflict (code) do nothing;

-- status history consistent with each order's current status
insert into public.order_events (order_id, from_status, to_status, note, created_at)
select o.id, v.from_s, v.to_s, v.note, o.created_at + v.d
from (values
  ('HB-K7P2', 'received', 'weaving',   'Started by Nanay Lita',            interval '1 day'),
  ('HB-K7P2', 'weaving',  'ready',     'Finished, wrapped for pickup',     interval '9 days'),
  ('HB-M3QX', 'received', 'weaving',   '3 weavers on this batch',          interval '2 days'),
  ('HB-D4HN', 'received', 'weaving',   null,                               interval '1 day'),
  ('HB-B2ZC', 'received', 'weaving',   null,                               interval '1 day'),
  ('HB-B2ZC', 'weaving',  'ready',     null,                               interval '12 days'),
  ('HB-B2ZC', 'ready',    'picked_up', 'Picked up before the fiesta',      interval '17 days'),
  ('HB-G8JL', 'received', 'weaving',   null,                               interval '1 day'),
  ('HB-G8JL', 'weaving',  'ready',     'Ready, waiting for school pickup', interval '13 days'),
  ('HB-N5WK', 'received', 'weaving',   'Large piece, two looms',           interval '1 day'),
  ('HB-T3XM', 'received', 'weaving',   null,                               interval '1 day'),
  ('HB-T3XM', 'weaving',  'ready',     null,                               interval '10 days'),
  ('HB-T3XM', 'ready',    'picked_up', null,                               interval '15 days'),
  ('HB-W9CF', 'received', 'weaving',   null,                               interval '1 day'),
  ('HB-W9CF', 'weaving',  'ready',     null,                               interval '8 days')
) as v(code, from_s, to_s, note, d)
join public.orders o on o.code = v.code
where not exists (select 1 from public.order_events e where e.order_id = o.id);
