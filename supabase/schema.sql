-- ============================================================
-- PHOTONIA — Database Schema
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'buyer' check (role in ('admin', 'photographer', 'buyer')),
  name text not null default '',
  slug text unique,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table photographer_profiles (
  user_id uuid primary key references users(id) on delete cascade,
  display_name text not null default '',
  bio text,
  website text,
  instagram text,
  commission_rate numeric(4,2) not null default 0.80
);

create table galleries (
  id uuid primary key default uuid_generate_v4(),
  photographer_id uuid not null references users(id) on delete cascade,
  title text not null,
  slug text not null unique,
  description text,
  cover_photo_id uuid,
  category text not null default 'Настан',
  event_date date,
  is_public boolean not null default false,
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table photos (
  id uuid primary key default uuid_generate_v4(),
  gallery_id uuid not null references galleries(id) on delete cascade,
  title text not null default '',
  cloudinary_public_id text not null,
  width integer not null default 0,
  height integer not null default 0,
  price_personal numeric(10,2) not null default 0,
  price_commercial numeric(10,2) not null default 0,
  price_extended numeric(10,2) not null default 0,
  ls_product_id text,
  tags text[] not null default '{}',
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

-- FK for cover_photo_id
alter table galleries
  add constraint galleries_cover_photo_id_fkey
  foreign key (cover_photo_id) references photos(id) on delete set null;

create table orders (
  id uuid primary key default uuid_generate_v4(),
  buyer_id uuid references users(id) on delete set null,
  buyer_email text not null,
  ls_order_id text not null unique,
  status text not null default 'pending' check (status in ('pending', 'paid', 'refunded')),
  total numeric(10,2) not null default 0,
  created_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  photo_id uuid not null references photos(id) on delete restrict,
  license text not null check (license in ('personal', 'commercial', 'extended')),
  price numeric(10,2) not null,
  photographer_amount numeric(10,2) not null,
  platform_amount numeric(10,2) not null,
  download_token text not null unique default encode(gen_random_bytes(32), 'hex'),
  download_expires_at timestamptz not null default (now() + interval '48 hours'),
  download_count integer not null default 0
);

create table payouts (
  id uuid primary key default uuid_generate_v4(),
  photographer_id uuid not null references users(id) on delete cascade,
  amount numeric(10,2) not null,
  status text not null default 'pending' check (status in ('pending', 'paid')),
  period text not null,
  created_at timestamptz not null default now()
);

create table photographer_invites (
  id uuid primary key default uuid_generate_v4(),
  email text not null,
  token text not null unique default encode(gen_random_bytes(32), 'hex'),
  invited_by uuid references users(id) on delete set null,
  accepted_at timestamptz,
  expires_at timestamptz not null default (now() + interval '7 days'),
  created_at timestamptz not null default now()
);

-- ============================================================
-- INDEXES
-- ============================================================

create index galleries_photographer_id_idx on galleries(photographer_id);
create index galleries_is_public_idx on galleries(is_public);
create index galleries_is_featured_idx on galleries(is_featured);
create index photos_gallery_id_idx on photos(gallery_id);
create index photos_order_index_idx on photos(gallery_id, order_index);
create index orders_buyer_id_idx on orders(buyer_id);
create index orders_buyer_email_idx on orders(buyer_email);
create index order_items_order_id_idx on order_items(order_id);
create index order_items_download_token_idx on order_items(download_token);
create index payouts_photographer_id_idx on payouts(photographer_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table users enable row level security;
alter table photographer_profiles enable row level security;
alter table galleries enable row level security;
alter table photos enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table payouts enable row level security;
alter table photographer_invites enable row level security;

-- Helper function to get current user's role
create or replace function current_user_role()
returns text
language sql stable
as $$
  select role from users where id = auth.uid()
$$;

-- users
create policy "Users can view their own profile" on users
  for select using (id = auth.uid());
create policy "Admin can view all users" on users
  for all using (current_user_role() = 'admin');
create policy "Public profiles are viewable" on users
  for select using (role = 'photographer');

-- photographer_profiles
create policy "Anyone can view photographer profiles" on photographer_profiles
  for select using (true);
create policy "Photographer can update own profile" on photographer_profiles
  for update using (user_id = auth.uid());

-- galleries
create policy "Anyone can view public galleries" on galleries
  for select using (is_public = true);
create policy "Photographer can manage own galleries" on galleries
  for all using (photographer_id = auth.uid());
create policy "Admin can manage all galleries" on galleries
  for all using (current_user_role() = 'admin');

-- photos
create policy "Anyone can view photos in public galleries" on photos
  for select using (
    exists (select 1 from galleries where id = photos.gallery_id and is_public = true)
  );
create policy "Photographer can manage own photos" on photos
  for all using (
    exists (select 1 from galleries where id = photos.gallery_id and photographer_id = auth.uid())
  );
create policy "Admin can manage all photos" on photos
  for all using (current_user_role() = 'admin');

-- orders
create policy "Buyers can view own orders" on orders
  for select using (buyer_id = auth.uid());
create policy "Admin can view all orders" on orders
  for all using (current_user_role() = 'admin');

-- order_items
create policy "Buyers can view own order items" on order_items
  for select using (
    exists (select 1 from orders where id = order_items.order_id and buyer_id = auth.uid())
  );
create policy "Admin can view all order items" on order_items
  for all using (current_user_role() = 'admin');

-- payouts
create policy "Photographer can view own payouts" on payouts
  for select using (photographer_id = auth.uid());
create policy "Admin can manage all payouts" on payouts
  for all using (current_user_role() = 'admin');

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-create user profile on signup
create or replace function handle_new_user()
returns trigger
language plpgsql security definer
as $$
begin
  insert into users (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'buyer')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
