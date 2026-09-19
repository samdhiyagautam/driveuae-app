-- Migration: auto_create_profile_on_signup
--
-- Why this is needed: `profiles` has RLS policies for select/update, but no
-- INSERT policy for the authenticated role — by design, a customer shouldn't
-- be able to insert an arbitrary profiles row (e.g. with role='admin'). But
-- that also means nothing currently creates the row on sign-up. Without this
-- trigger, a person can authenticate with Supabase Auth but never get a
-- matching `public.profiles` row, so every RLS check that joins on
-- profiles.id (bookings, documents, payments, etc.) has nothing to match.
--
-- This adds the standard Supabase pattern: a SECURITY DEFINER trigger on
-- auth.users that inserts a row into public.profiles, pulling full_name and
-- phone from the sign-up metadata when available. It runs with elevated
-- privilege specifically to do this one insert, bypassing RLS for that
-- purpose only — it does not grant clients any new ability themselves.
-- Purely additive: doesn't touch any existing table, column, or policy.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1), 'Customer'),
    new.email,
    coalesce(new.raw_user_meta_data->>'phone', new.phone),
    'customer'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
