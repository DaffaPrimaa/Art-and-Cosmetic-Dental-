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

function App() {
  const [menu, setMenu] = useState("Dashboard");

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 text-white flex flex-col" style={{ backgroundColor: "#0B2C5F" }}>
        <div className="text-2xl font-bold p-4">ARM</div>
        <nav className="flex-1 p-2 space-y-2">
          {[
            "Dashboard",
            "Data Pasien",
            "Data Dokter",
            "Data Rekam Medis",
            "Data Laporan",
          ].map((item) => (
            <button
              key={item}
              onClick={() => setMenu(item)}
              className={`flex items-center gap-2 w-full px-4 py-2 text-left rounded ${
                menu === item ? "bg-white text-[#0B2C5F]" : "hover:bg-[#1A3C6E]"
              }`}
            >
              <span>📁</span> {item}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold flex items-center gap-2">🏠 Dashboard</h1>
          <div className="text-gray-600">Admin ⏷</div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <Card title="Total Pasien" value="7" color="#0B2C5F" icon="🧑‍⚕️" />
          <Card title="Total Dokter" value="4" color="#3EC6D3" icon="👨‍⚕️" />
        </div>

        {/* Chart */}
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
      </div>
    </div>
  );
}

function Card({
  title,
  value,
  color,
  icon,
}: {
  title: string;
  value: string;
  color: string;
  icon: string;
}) {
  return (
    <div className="bg-white shadow-md p-4 rounded flex items-center">
      <div
        className="w-12 h-12 text-white rounded flex items-center justify-center text-xl mr-4"
        style={{ backgroundColor: color }}
      >
        {icon}
      </div>
      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-xl font-bold">{value}</div>
      </div>
    </div>
  );
}

export default App;
