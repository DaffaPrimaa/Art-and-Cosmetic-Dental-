import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const data = [
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
];

export default function Chart() {
  return (
    <div className="bg-white shadow-md rounded mt-6 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Data Rekam Medis (2020)</h2>
        <button className="bg-[#3EC6D3] text-white px-4 py-1 rounded hover:bg-[#32B5C2]">
          Cetak Laporan
        </button>
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
