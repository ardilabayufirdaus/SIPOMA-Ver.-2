import React, { useEffect, useState, useMemo } from "react";
import { supabase, packingPlantStockTable } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/toaster";

// data will be fetched from Supabase table `packing_plant_master`

type PackingPlant = {
  id: number | null;
  nama: string;
  kode: string;
  kapasitas: number | string;
  deadStock: number | string;
  tipeSemen: string;
};

const defaultForm: PackingPlant = {
  id: null,
  nama: "",
  kode: "",
  kapasitas: "",
  deadStock: "",
  tipeSemen: "",
};

export default function PackingPlantTable() {
  const { addToast } = useToast();
  const [data, setData] = useState<PackingPlant[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof PackingPlant | null;
    direction: "asc" | "desc";
  }>({ key: "nama", direction: "asc" });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [form, setForm] = useState<PackingPlant>(defaultForm);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    setForm(defaultForm);
    setEditId(null);
    setShowForm(true);
  };

  const handleEdit = (item: PackingPlant) => {
    setForm(item);
    setEditId(item.id as number);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Hapus data ini?")) {
      // delete from supabase if possible
      (async () => {
        try {
          const { error } = await supabase
            .from("packing_plant_master")
            .delete()
            .eq("id", id);
          if (error) throw error;
          setData((d) => d.filter((x) => x.id !== id));
          addToast({
            type: "success",
            title: "Berhasil",
            description: "Data packing plant dihapus",
          });
        } catch (err) {
          console.error(err);
          addToast({
            type: "error",
            title: "Gagal menghapus",
            description: (err as any)?.message ?? String(err),
          });
        }
      })();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newData: PackingPlant = {
      ...form,
      kapasitas: Number(form.kapasitas),
      deadStock: Number(form.deadStock),
      id: editId ? editId : Date.now(),
    };
    (async () => {
      try {
        if (editId) {
          const { data: updated, error } = await supabase
            .from("packing_plant_master")
            .update({
              nama: newData.nama,
              kode: newData.kode,
              kapasitas: newData.kapasitas,
              dead_stock: newData.deadStock,
              tipe_semen: newData.tipeSemen,
            })
            .eq("id", editId)
            .select()
            .single();
          if (error) throw error;
          setData((d) =>
            d.map((it) => (it.id === editId ? (updated as any) : it))
          );
          addToast({
            type: "success",
            title: "Berhasil",
            description: "Data packing plant diperbarui",
          });
        } else {
          const { data: created, error } = await supabase
            .from("packing_plant_master")
            .insert({
              nama: newData.nama,
              kode: newData.kode,
              kapasitas: newData.kapasitas,
              dead_stock: newData.deadStock,
              tipe_semen: newData.tipeSemen,
            })
            .select()
            .single();
          if (error) throw error;
          setData((d) => [...d, created as any]);
          addToast({
            type: "success",
            title: "Berhasil",
            description: "Packing plant baru ditambahkan",
          });
        }
        setShowForm(false);
      } catch (err) {
        console.error(err);
        addToast({
          type: "error",
          title: "Gagal menyimpan",
          description: (err as any)?.message ?? String(err),
        });
      }
    })();
  };

  // fetch packing plant master on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: rows, error } = await supabase
        .from("packing_plant_master_view")
        .select("id, nama, kode, kapasitas, deadStock, tipeSemen")
        .order("nama", { ascending: true });
      if (error) {
        console.error(error);
        return;
      }
      if (mounted && Array.isArray(rows)) {
        setData(rows as any[]);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Always primary sort by area name (nama) A-Z, optionally secondary sort by selected column
  const sortedData = useMemo(() => {
    const arr = [...data];
    const nameCompare = (a: PackingPlant, b: PackingPlant) =>
      String(a.nama || "").localeCompare(String(b.nama || ""));

    const cfg = sortConfig;
    arr.sort((a, b) => {
      // primary: nama A-Z
      const n = nameCompare(a, b);
      if (n !== 0) return n;

      // if primary same, and cfg selects another key, use that
      if (!cfg || !cfg.key || cfg.key === "nama") return 0;
      const key = cfg.key as keyof PackingPlant;
      const va = a[key] ?? "";
      const vb = b[key] ?? "";

      // numeric compare if both numbers
      const na = Number(va as any);
      const nb = Number(vb as any);
      let cmp = 0;
      if (!isNaN(na) && !isNaN(nb)) {
        cmp = na - nb;
      } else {
        cmp = String(va).localeCompare(String(vb));
      }
      return cfg.direction === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [data, sortConfig]);

  // Apply search filter (case-insensitive) after sorting
  const filteredData = useMemo(() => {
    const q = String(searchQuery || "")
      .trim()
      .toLowerCase();
    if (!q) return sortedData;
    return sortedData.filter((r) => {
      return (
        String(r.nama ?? "")
          .toLowerCase()
          .includes(q) ||
        String(r.kode ?? "")
          .toLowerCase()
          .includes(q) ||
        String(r.tipeSemen ?? "")
          .toLowerCase()
          .includes(q)
      );
    });
  }, [sortedData, searchQuery]);

  const toggleSort = (key: keyof PackingPlant) => {
    // nama (Area) must always be A-Z
    if (key === "nama") {
      setSortConfig({ key: "nama", direction: "asc" });
      return;
    }
    setSortConfig((s) => {
      if (s.key === key) {
        return { key, direction: s.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };
  return (
    <div className="mt-4">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-800">Packing Plant</h3>
          <div>
            <input
              type="text"
              placeholder="Cari..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-200 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
            />
          </div>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-red-600 shadow-sm border border-red-600 hover:bg-red-50"
        >
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-sm">
            ➕
          </span>
          <span>Tambah Packing Plant</span>
        </button>
      </div>

      <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th
                role="button"
                onClick={() => toggleSort("nama")}
                className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer select-none"
              >
                <div className="inline-flex items-center gap-2">
                  <span>Area Packing Plant</span>
                  <span className="text-xs text-gray-400">A–Z</span>
                </div>
              </th>

              <th
                role="button"
                onClick={() => toggleSort("kode")}
                className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer select-none"
              >
                <div className="inline-flex items-center gap-2">
                  <span>Kode Plant</span>
                  <span className="text-xs text-gray-400">
                    {sortConfig.key === "kode"
                      ? sortConfig.direction === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </span>
                </div>
              </th>

              <th
                role="button"
                onClick={() => toggleSort("kapasitas")}
                className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer select-none"
              >
                <div className="inline-flex items-center gap-2">
                  <span>Total Kapasitas (Ton)</span>
                  <span className="text-xs text-gray-400">
                    {sortConfig.key === "kapasitas"
                      ? sortConfig.direction === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </span>
                </div>
              </th>

              <th
                role="button"
                onClick={() => toggleSort("deadStock")}
                className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer select-none"
              >
                <div className="inline-flex items-center gap-2">
                  <span>Dead Stock (Ton)</span>
                  <span className="text-xs text-gray-400">
                    {sortConfig.key === "deadStock"
                      ? sortConfig.direction === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </span>
                </div>
              </th>

              <th
                role="button"
                onClick={() => toggleSort("tipeSemen")}
                className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer select-none"
              >
                <div className="inline-flex items-center gap-2">
                  <span>Tipe Semen</span>
                  <span className="text-xs text-gray-400">
                    {sortConfig.key === "tipeSemen"
                      ? sortConfig.direction === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </span>
                </div>
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-400">
                  Tidak ada data
                </td>
              </tr>
            )}

            {filteredData.map((item, idx) => (
              <tr
                key={item.id ?? idx}
                className={`hover:bg-gray-50 ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="px-4 py-3 text-sm text-gray-700">{item.nama}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{item.kode}</td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {item.kapasitas}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {item.deadStock}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {item.tipeSemen}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  <div className="flex items-center gap-3">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() =>
                        typeof item.id === "number" && handleDelete(item.id)
                      }
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 px-4">
          <form
            className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
            onSubmit={handleSubmit}
          >
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-semibold mb-4">
                {editId ? "Edit" : "Tambah"} Packing Plant
              </h2>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setShowForm(false)}
                aria-label="Tutup"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1 text-gray-700">
                  Area Packing Plant
                </label>
                <input
                  name="nama"
                  value={form.nama}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700">
                  Kode Plant
                </label>
                <input
                  name="kode"
                  value={form.kode}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700">
                  Total Kapasitas (Ton)
                </label>
                <input
                  name="kapasitas"
                  value={form.kapasitas}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200"
                  type="number"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700">
                  Dead Stock (Ton)
                </label>
                <input
                  name="deadStock"
                  value={form.deadStock}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200"
                  type="number"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700">
                  Tipe Semen
                </label>
                <input
                  name="tipeSemen"
                  value={form.tipeSemen}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                className="px-3 py-1 rounded-md bg-gray-100 text-gray-700"
                onClick={() => setShowForm(false)}
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-md bg-red-600 text-white"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
