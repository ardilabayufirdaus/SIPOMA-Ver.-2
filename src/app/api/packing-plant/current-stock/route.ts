import { NextResponse, NextRequest } from "next/server";

export const dynamic = "force-dynamic";

// This route reads search params from the incoming request and should run dynamically

import { supabase } from "@/lib/supabase/client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const areaId = searchParams.get("areaId");

    if (!areaId) {
      return NextResponse.json({ error: "areaId required" }, { status: 400 });
    }

    // Fetch product master list
    const { data: products, error: prodErr } = await supabase
      .from("master_product")
      .select("id, product_code, product_name, unit")
      .order("product_name", { ascending: true });

    if (prodErr) {
      console.error(prodErr);
      return NextResponse.json({ error: String(prodErr) }, { status: 500 });
    }

    // Fetch recent stock rows for the area and pick latest per product in JS
    const { data: stockRows, error: stockErr } = await supabase
      .from("packing_plant_stock")
      .select("product_id, stok_akhir, tanggal")
      .eq("plant_id", Number(areaId))
      .order("tanggal", { ascending: false })
      .limit(10000);

    if (stockErr) {
      console.error(stockErr);
      return NextResponse.json({ error: String(stockErr) }, { status: 500 });
    }

    const latestByProduct: Record<number, number> = {};
    ((stockRows as any[]) || []).forEach((r) => {
      const pid = Number(r.product_id);
      if (!(pid in latestByProduct)) {
        latestByProduct[pid] = Number(r.stok_akhir ?? 0);
      }
    });

    const result = ((products as any[]) || []).map((p) => ({
      product_id: p.id,
      product_code: p.product_code,
      product_name: p.product_name,
      unit: p.unit,
      stok: latestByProduct[p.id] ?? 0,
    }));

    return NextResponse.json({ data: result });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: (err as any).message ?? String(err) },
      { status: 500 }
    );
  }
}
