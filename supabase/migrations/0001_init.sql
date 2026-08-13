-- MacroMates initial schema
-- Households (a pair of two users) + user profiles + food logging

create table households (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Household',
  created_at timestamptz not null default now()
);

create table user_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  household_id uuid not null references households (id) on delete cascade,
  name text not null,
  accent_color text not null default '#a3e635', -- electric lime default
  daily_calorie_goal integer not null default 2000,
  daily_protein_goal integer not null default 150,
  daily_carb_goal integer,
  daily_fat_goal integer,
  created_at timestamptz not null default now()
);

create type food_category as enum ('whole_food', 'supplement');
create type food_source as enum ('barcode', 'manual', 'photo', 'custom');
create type meal_category as enum ('breakfast', 'lunch', 'dinner', 'snack', 'supplement');

create table food_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand text,
  calories_per_serving numeric not null default 0,
  protein_per_serving numeric not null default 0,
  carbs_per_serving numeric,
  fat_per_serving numeric,
  serving_unit text not null default 'serving',
  category food_category not null default 'whole_food',
  source food_source not null default 'manual',
  barcode text,
  created_by uuid references user_profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index food_items_barcode_idx on food_items (barcode);
create index food_items_name_idx on food_items using gin (to_tsvector('english', name));

create table log_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references user_profiles (id) on delete cascade,
  food_item_id uuid not null references food_items (id) on delete cascade,
  servings numeric not null default 1,
  meal_category meal_category not null,
  logged_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index log_entries_user_logged_at_idx on log_entries (user_id, logged_at desc);

create table favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references user_profiles (id) on delete cascade,
  food_item_id uuid not null references food_items (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, food_item_id)
);

create table nudges (
  id uuid primary key default gen_random_uuid(),
  from_user_id uuid not null references user_profiles (id) on delete cascade,
  to_user_id uuid not null references user_profiles (id) on delete cascade,
  message text not null,
  sent_at timestamptz not null default now(),
  read_at timestamptz
);

-- Row Level Security: users can only see their own household's data
alter table households enable row level security;
alter table user_profiles enable row level security;
alter table food_items enable row level security;
alter table log_entries enable row level security;
alter table favorites enable row level security;
alter table nudges enable row level security;

create function current_household_id() returns uuid as $$
  select household_id from user_profiles where id = auth.uid();
$$ language sql stable security definer;

create policy "household members can view household" on households
  for select using (id = current_household_id());

create policy "household members can view each other's profiles" on user_profiles
  for select using (household_id = current_household_id());

create policy "users can update their own profile" on user_profiles
  for update using (id = auth.uid());

create policy "household members can view food items" on food_items
  for select using (true);

create policy "household members can create food items" on food_items
  for insert with check (auth.uid() is not null);

create policy "household members can view household log entries" on log_entries
  for select using (
    user_id in (select id from user_profiles where household_id = current_household_id())
  );

create policy "users can manage their own log entries" on log_entries
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "users can manage their own favorites" on favorites
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "household members can view nudges" on nudges
  for select using (
    from_user_id in (select id from user_profiles where household_id = current_household_id())
    or to_user_id in (select id from user_profiles where household_id = current_household_id())
  );

create policy "users can send nudges" on nudges
  for insert with check (from_user_id = auth.uid());

create policy "recipients can mark nudges read" on nudges
  for update using (to_user_id = auth.uid());
