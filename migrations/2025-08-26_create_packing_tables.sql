-- Migration: Create packing_plant_master and packing_plant_stock tables
-- Date: 2025-08-26
-- Purpose: Add tables and supporting functions/triggers for packing plant master data
-- and per-day stock entries. Designed for use with Supabase (Postgres).

BEGIN;

-- 1) packing_plant_master: master data for packing plants
CREATE TABLE IF NOT EXISTS public.packing_plant_master (
  id                serial PRIMARY KEY,
  nama              text NOT NULL,
  kode              text UNIQUE NOT NULL,
  kapasitas         numeric DEFAULT 0 NOT NULL, -- in tons
  dead_stock        numeric DEFAULT 0 NOT NULL,  -- in tons (minimum unusable stock)
  tipe_semen        text DEFAULT ''::text,
  is_active         boolean DEFAULT true,
  created_at        timestamptz DEFAULT now() NOT NULL,
  updated_at        timestamptz DEFAULT now() NOT NULL
);

-- 2) packing_plant_stock: daily stock records for each packing plant
CREATE TABLE IF NOT EXISTS public.packing_plant_stock (
  id                serial PRIMARY KEY,
  plant_id          integer NOT NULL REFERENCES public.packing_plant_master(id) ON DELETE CASCADE,
  tanggal           date NOT NULL,
  stok_diterima     numeric DEFAULT 0 NOT NULL, -- received that day (ton)
  stok_keluar       numeric DEFAULT 0 NOT NULL, -- outflow that day (ton)
  stok_akhir        numeric DEFAULT 0 NOT NULL, -- ending stock (ton)
  dead_stock        numeric DEFAULT 0 NOT NULL, -- dead stock snapshot (ton)
  life_stock        numeric DEFAULT 0 NOT NULL, -- stok_akhir - dead_stock (ton)
  notes             text DEFAULT ''::text,
  created_at        timestamptz DEFAULT now() NOT NULL,
  updated_at        timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT uniq_plant_date UNIQUE (plant_id, tanggal)
);

-- Indexes to speed up common queries
CREATE INDEX IF NOT EXISTS idx_packing_plant_stock_plant_date ON public.packing_plant_stock (plant_id, tanggal);
CREATE INDEX IF NOT EXISTS idx_packing_plant_master_kode ON public.packing_plant_master (kode);

-- 3) Trigger helper to keep `updated_at` current
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Attach the trigger to both tables
DROP TRIGGER IF EXISTS trg_set_updated_at_master ON public.packing_plant_master;
CREATE TRIGGER trg_set_updated_at_master
BEFORE UPDATE ON public.packing_plant_master
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_set_updated_at_stock ON public.packing_plant_stock;
CREATE TRIGGER trg_set_updated_at_stock
BEFORE UPDATE ON public.packing_plant_stock
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

COMMIT;

-- OPTIONAL: Example RLS policies (Supabase) - enable and adapt to your auth model
-- NOTE: Uncomment and adapt only if you want to enable Row Level Security and
-- allow authenticated users to work with these tables.
-- ALTER TABLE public.packing_plant_master ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.packing_plant_stock ENABLE ROW LEVEL SECURITY;
--
-- CREATE POLICY "Allow authenticated users on master"
-- ON public.packing_plant_master
-- FOR ALL
-- USING (auth.role() = 'authenticated')
-- WITH CHECK (auth.role() = 'authenticated');
--
-- CREATE POLICY "Allow authenticated users on stock"
-- ON public.packing_plant_stock
-- FOR ALL
-- USING (auth.role() = 'authenticated')
-- WITH CHECK (auth.role() = 'authenticated');

-- OPTIONAL: Helper view to get latest stock per plant
CREATE OR REPLACE VIEW public.packing_plant_latest_stock AS
SELECT s.plant_id,
       pm.nama,
       pm.kode,
       s.tanggal,
       s.stok_akhir,
       s.dead_stock,
       s.life_stock
FROM public.packing_plant_stock s
JOIN public.packing_plant_master pm ON pm.id = s.plant_id
WHERE (s.plant_id, s.tanggal) IN (
  SELECT plant_id, MAX(tanggal) FROM public.packing_plant_stock GROUP BY plant_id
);

-- End of migration
