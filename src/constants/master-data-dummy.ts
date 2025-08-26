// Dummy data untuk Master Data SIPOMA
// Struktur: id, kode, nama, deskripsi, status

export const masterDataDummy = [
  {
    id: 1,
    kode: "MD-001",
    nama: "Bahan Baku Semen",
    deskripsi: "Data bahan baku utama untuk produksi semen",
    status: "Aktif",
  },
  {
    id: 2,
    kode: "MD-002",
    nama: "Supplier",
    deskripsi: "Daftar supplier bahan baku dan pendukung",
    status: "Aktif",
  },
  {
    id: 3,
    kode: "MD-003",
    nama: "Jenis Produk",
    deskripsi: "Master data jenis produk semen",
    status: "Nonaktif",
  },
  {
    id: 4,
    kode: "MD-004",
    nama: "Lokasi Gudang",
    deskripsi: "Data lokasi gudang penyimpanan",
    status: "Aktif",
  },
  {
    id: 5,
    kode: "MD-005",
    nama: "Customer",
    deskripsi: "Daftar customer utama",
    status: "Aktif",
  },
];

// Dummy list untuk Area Packing Plant / Lokasi
export const packingAreasDummy = [
  { id: 1, nama: "Ambon", kode: "AMB", deadStock: 850 },
  { id: 2, nama: "Balikpapan", kode: "BPN", deadStock: 1500 },
  { id: 3, nama: "Jakarta", kode: "JKT", deadStock: 500 },
];
