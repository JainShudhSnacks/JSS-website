-- Run in your business-owned Supabase SQL editor before deploying live on Vercel.
create table if not exists public.jss_records (
  kind text not null,
  id text not null,
  payload jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (kind, id)
);
alter table public.jss_records enable row level security;
-- No anon/authenticated table policies: application routes authorise all requests.
-- Only the server-held service role accesses catalogue records; never expose that key.
revoke all on public.jss_records from anon, authenticated;
grant select, insert, update on public.jss_records to service_role;

insert into storage.buckets (id, name, public) values ('product-images','product-images',true)
on conflict (id) do nothing;
-- Public product imagery only. Uploads use the protected server endpoint/service role.
