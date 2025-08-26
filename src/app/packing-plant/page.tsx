"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import dynamic from "next/dynamic";

import EntriDataStokTable from "@/components/packing-plant/EntriDataStokTable";

const PackingPlantTable = dynamic(
  () => import("@/components/packing-plant/PackingPlantTable"),
  { ssr: false }
);

export default function PackingPlantPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Packing Plant</h1>
      <Tabs defaultValue="prognosa-stok" className="space-y-6">
        <TabsList className="grid grid-cols-6 w-full mb-4">
          <TabsTrigger value="prognosa-stok">
            <span className="text-xl mr-2">📈</span> Prognosa Stok
          </TabsTrigger>
          <TabsTrigger value="kinerja-logistik">
            <span className="text-xl mr-2">🚚</span> Kinerja Logistik
          </TabsTrigger>
          <TabsTrigger value="kinerja-packer">
            <span className="text-xl mr-2">📦</span> Kinerja Packer
          </TabsTrigger>
          <TabsTrigger value="gudang-distributor">
            <span className="text-xl mr-2">🏬</span> Gudang Distributor
          </TabsTrigger>
          <TabsTrigger value="entri-data-stok">
            <span className="text-xl mr-2">📝</span> Entri Data Stok
          </TabsTrigger>
          <TabsTrigger value="master-data">
            <span className="text-xl mr-2">🗄️</span> Master Data
          </TabsTrigger>
        </TabsList>
        <TabsContent value="prognosa-stok">
          <div>Placeholder Prognosa Stok</div>
        </TabsContent>
        <TabsContent value="kinerja-logistik">
          <div>Placeholder Kinerja Logistik</div>
        </TabsContent>
        <TabsContent value="kinerja-packer">
          <div>Placeholder Kinerja Packer</div>
        </TabsContent>
        <TabsContent value="gudang-distributor">
          <div>Placeholder Gudang Distributor</div>
        </TabsContent>
        <TabsContent value="entri-data-stok">
          <EntriDataStokTable />
        </TabsContent>
        <TabsContent value="master-data">
          <PackingPlantTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
