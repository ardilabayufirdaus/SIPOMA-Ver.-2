-- SIPOMA Supabase SQL Schema (v1)
-- User authentication & registration integration only

-- 1. User profile table (extends Supabase Auth)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  status text default 'pending', -- 'pending', 'active', 'rejected'
  created_at timestamp with time zone default now()
);

-- 2. Trigger: Insert profile row on user signup
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists handle_new_user();
create function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, status)
  values (new.id, new.raw_user_meta_data->>'full_name', 'pending');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure handle_new_user();

-- 3. Table for admin notifications (optional, for approval workflow)
create table if not exists notifications (
  id bigserial primary key,
  type text, -- 'register', 'info', etc
  user_id uuid references auth.users(id),
  message text,
  is_read boolean default false,
  created_at timestamp with time zone default now()
);

-- Add more tables as needed for SIPOMA modules (factory, dashboard, etc)
