import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Data berdasarkan tahun
const dummyData: Record<string, { bulan: string; jumlah: number }[]> = {
  "2020": [
    { bulan: "Jan", jumlah: 0 },
    { bulan: "Feb", jumlah: 0 },
    { bulan: "Mar", jumlah: 0 },
    { bulan: "Apr", jumlah: 0 },
    { bulan: "Mei", jumlah: 0 },
    { bulan: "Jun", jumlah: 6 },
    { bulan: "Jul", jumlah: 1 },
    { bulan: "Agu", jumlah: 0 },
    { bulan: "Sep", jumlah: 0 },
    { bulan: "Okt", jumlah: 0 },
    { bulan: "Nov", jumlah: 0 },
    { bulan: "Des", jumlah: 0 },
  ],
  "2021": [
    { bulan: "Jan", jumlah: 2 },
    { bulan: "Feb", jumlah: 4 },
    { bulan: "Mar", jumlah: 1 },
    { bulan: "Apr", jumlah: 3 },
    { bulan: "Mei", jumlah: 2 },
    { bulan: "Jun", jumlah: 0 },
    { bulan: "Jul", jumlah: 1 },
    { bulan: "Agu", jumlah: 1 },
    { bulan: "Sep", jumlah: 2 },
    { bulan: "Okt", jumlah: 4 },
    { bulan: "Nov", jumlah: 2 },
    { bulan: "Des", jumlah: 3 },
  ],
};

export default function Chart() {
  const [selectedYear, setSelectedYear] = useState("2020");

  const data = dummyData[selectedYear] || [];

  return (
    <div className="bg-white shadow-md rounded mt-6 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          Data Rekam Medis ({selectedYear})
        </h2>
        <div className="flex items-center gap-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            {Object.keys(dummyData).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <button className="bg-[#3EC6D3] text-white px-4 py-1 rounded hover:bg-[#32B5C2]">
            Cetak Laporan
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <XAxis dataKey="bulan" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="jumlah"
            stroke="#3EC6D3"
            strokeWidth={3}
            dot
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
