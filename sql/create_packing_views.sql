-- Create views that expose packing tables with camelCase column names
-- Useful when frontend expects camelCase fields (e.g. deadStock, tipeSemen)
-- Run after migrations have been applied.

BEGIN;

CREATE OR REPLACE VIEW public.packing_plant_master_view AS
SELECT
  id,
  nama,
  kode,
  kapasitas,
  dead_stock AS "deadStock",
  tipe_semen AS "tipeSemen",
  is_active,
  created_at,
  updated_at
FROM public.packing_plant_master;

CREATE OR REPLACE VIEW public.packing_plant_stock_view AS
SELECT
  id,
  plant_id,
  tanggal,
  stok_diterima AS "stokDiterima",
  stok_keluar AS "stokKeluar",
  stok_akhir AS "stokAkhir",
  dead_stock AS "deadStock",
  life_stock AS "lifeStock",
  notes,
  created_at,
  updated_at
FROM public.packing_plant_stock;

-- Optional: grant select to public (or replace with your role e.g. authenticated)
GRANT SELECT ON public.packing_plant_master_view TO public;
GRANT SELECT ON public.packing_plant_stock_view TO public;

COMMIT;

-- Quick verification queries:
-- SELECT * FROM public.packing_plant_master_view LIMIT 10;
-- SELECT * FROM public.packing_plant_stock_view WHERE plant_id = 1 LIMIT 20;
