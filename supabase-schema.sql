-- ============================================================
-- TAGGED — Schéma de base de données
-- À copier-coller dans Supabase → SQL Editor → Run
-- ============================================================

-- Table des collections (catégories personnalisées)
create table categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nom text not null,
  emoji text default '🏷️',
  budget numeric,
  created_at timestamptz default now()
);

-- Table des produits
create table products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid references categories(id) on delete cascade,
  type text,                      -- ex: T-shirt, Sneakers, Sac...
  is_vetement boolean default true,
  nom text not null,
  marque text,
  prix numeric,
  url text,
  taille text,
  couleur text,
  notes text,
  statut text default 'à acheter', -- 'à acheter' | 'acheté'
  paid_by text default 'Moi',      -- 'Moi' | 'Parents' | 'Autre'
  image_url text,
  created_at timestamptz default now()
);

-- ============================================================
-- Sécurité (Row Level Security)
-- Chacune ne voit et ne modifie que ses propres données
-- ============================================================

alter table categories enable row level security;
alter table products enable row level security;

create policy "Voir ses propres collections"
  on categories for select using (auth.uid() = user_id);
create policy "Créer ses propres collections"
  on categories for insert with check (auth.uid() = user_id);
create policy "Modifier ses propres collections"
  on categories for update using (auth.uid() = user_id);
create policy "Supprimer ses propres collections"
  on categories for delete using (auth.uid() = user_id);

create policy "Voir ses propres produits"
  on products for select using (auth.uid() = user_id);
create policy "Créer ses propres produits"
  on products for insert with check (auth.uid() = user_id);
create policy "Modifier ses propres produits"
  on products for update using (auth.uid() = user_id);
create policy "Supprimer ses propres produits"
  on products for delete using (auth.uid() = user_id);

-- ============================================================
-- Stockage des photos produits
-- ============================================================

insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true);

create policy "Voir les images"
  on storage.objects for select using (bucket_id = 'product-images');
create policy "Uploader ses images"
  on storage.objects for insert with check (bucket_id = 'product-images' and auth.uid() = owner);
create policy "Supprimer ses images"
  on storage.objects for delete using (bucket_id = 'product-images' and auth.uid() = owner);
