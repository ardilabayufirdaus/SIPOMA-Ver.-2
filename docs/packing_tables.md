# Packing tables for SIPOMA - Supabase integration

## Overview

This document explains the schema added for packing plant master data and daily stock.
It corresponds to the migration `migrations/2025-08-26_create_packing_tables.sql`.

## Tables

### 1) `packing_plant_master`

- id: serial primary key
- nama: text (Area name)
- kode: text unique (plant code)
- kapasitas: numeric (total plant capacity in tons)
- dead_stock: numeric (minimum unusable stock kept as dead stock)
- tipe_semen: text (product type)
- is_active: boolean
- created_at, updated_at: timestamps

### 2) `packing_plant_stock`

- id: serial primary key
- plant_id: FK to `packing_plant_master.id`
- tanggal: date (the day this row applies to)
- stok_diterima: numeric (received that day)
- stok_keluar: numeric (outflow that day)
- stok_akhir: numeric (ending stock for the day)
- dead_stock: numeric (dead stock snapshot)
- life_stock: numeric (stok_akhir - dead_stock)
- notes: text
- created_at, updated_at: timestamps
- Unique constraint: (plant_id, tanggal)

## Triggers and helper

- `set_updated_at()` trigger function keeps `updated_at` current on UPDATE for both tables.
- A view `packing_plant_latest_stock` is created to fetch the latest stock per plant.

## Usage examples (Supabase / PostgREST)

- Fetch all packing areas:

  GET /rest/v1/packing_plant_master

- Insert a packing area (example payload):

  POST /rest/v1/packing_plant_master
  {
  "nama": "Plant A",
  "kode": "PLTA",
  "kapasitas": 1200,
  "dead_stock": 50,
  "tipe_semen": "OPC"
  }

- Upsert daily stock (using unique plant+date):

  POST /rest/v1/packing_plant_stock
  {
  "plant_id": 1,
  "tanggal": "2025-08-01",
  "stok_diterima": 200,
  "stok_keluar": 50,
  "stok_akhir": 1150,
  "dead_stock": 50,
  "life_stock": 1100
  }

## Notes and next steps

- Consider adding Row-Level Security (RLS) policies depending on your auth model.
- Consider a stored procedure that computes `stok_akhir`, `life_stock` server-side when inserting daily movements, or implement this logic in the application layer before writing to DB.
- Add tests / fixtures for migration when applying to CI.

## Contact

If you want, I can:

- Add an upsert RPC (stored procedure) to apply a day's movements and compute derived fields.
- Add RLS examples for Supabase's auth model.
