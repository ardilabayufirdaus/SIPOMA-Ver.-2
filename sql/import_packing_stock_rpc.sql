-- RPC: import_packing_stock
-- Purpose: safe upsert(import/replace) of packing_plant_stock rows for a plant and period.
-- Call this RPC with a JSONB array of records; each record must include at least `tanggal` (YYYY-MM-DD)
-- Example record: { "tanggal": "2025-08-01", "stok_diterima": 10, "stok_keluar": 5, "stok_akhir": 100, "dead_stock": 10, "notes": "import" }

CREATE OR REPLACE FUNCTION public.import_packing_stock(
  p_plant_id integer,
  p_year integer,
  p_month integer,
  p_records jsonb
)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  rec jsonb;
  v_tanggal date;
  v_stok_diterima numeric;
  v_stok_keluar numeric;
  v_stok_akhir numeric;
  v_dead_stock numeric;
  v_life_stock numeric;
  v_notes text;
BEGIN
  IF p_records IS NULL THEN
    RAISE NOTICE 'No records provided';
    RETURN;
  END IF;

  -- ensure plant exists
  PERFORM 1 FROM public.packing_plant_master WHERE id = p_plant_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'plant_id % not found', p_plant_id;
  END IF;

  -- iterate array and upsert each row using the unique constraint (plant_id, tanggal)
  FOR rec IN SELECT * FROM jsonb_array_elements(p_records)
  LOOP
    -- normalize fields with fallback names used by the front-end import
    v_tanggal := COALESCE((rec->> 'tanggal')::date, make_date(p_year, p_month, 1));
    v_stok_diterima := COALESCE(NULLIF(rec->> 'stok_diterima','')::numeric, NULLIF(rec->> 'diterima','')::numeric, 0);
    v_stok_keluar := COALESCE(NULLIF(rec->> 'stok_keluar','')::numeric, NULLIF(rec->> 'keluar','')::numeric, 0);
    v_stok_akhir := COALESCE(NULLIF(rec->> 'stok_akhir','')::numeric, NULLIF(rec->> 'akhir','')::numeric, 0);
    v_dead_stock := COALESCE(NULLIF(rec->> 'dead_stock','')::numeric, NULLIF(rec->> 'dead','')::numeric, 0);
    v_life_stock := COALESCE(NULLIF(rec->> 'life_stock','')::numeric, NULLIF(rec->> 'life','')::numeric, v_stok_akhir - v_dead_stock);
    v_notes := COALESCE(rec->> 'notes','');

    INSERT INTO public.packing_plant_stock(
      plant_id, tanggal, stok_diterima, stok_keluar, stok_akhir, dead_stock, life_stock, notes, created_at, updated_at
    ) VALUES (
      p_plant_id, v_tanggal, v_stok_diterima, v_stok_keluar, v_stok_akhir, v_dead_stock, v_life_stock, v_notes, now(), now()
    )
    ON CONFLICT (plant_id, tanggal) DO UPDATE
      SET stok_diterima = EXCLUDED.stok_diterima,
          stok_keluar = EXCLUDED.stok_keluar,
          stok_akhir = EXCLUDED.stok_akhir,
          dead_stock = EXCLUDED.dead_stock,
          life_stock = EXCLUDED.life_stock,
          notes = EXCLUDED.notes,
          updated_at = now();
  END LOOP;
END;
$$;

-- Example: call from SQL
-- SELECT public.import_packing_stock(1, 2025, 8, '[{"tanggal":"2025-08-01","stok_diterima":10,"stok_keluar":2,"stok_akhir":100,"dead_stock":10,"notes":"imported"}]'::jsonb);

-- Example: call from Supabase JS
-- const { data, error } = await supabase.rpc('import_packing_stock', {
--   p_plant_id: 1,
--   p_year: 2025,
--   p_month: 8,
--   p_records: rowsJson // JSON array (will be sent as JSONB)
-- });

-- SECURITY / RLS notes:
-- If your DB uses Row Level Security, you may need to create a POLICY allowing the calling role to run this RPC, or create a SECURITY DEFINER wrapper owned by a trusted role and grant execute to authenticated users.
