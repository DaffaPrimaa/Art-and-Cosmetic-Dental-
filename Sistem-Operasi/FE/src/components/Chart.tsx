import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Daftar bulan lengkap
const bulanList = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

interface RekamMedis {
  tanggal: string;
  // kolom lain boleh diabaikan
}

interface ChartDataItem {
  bulan: string;
  jumlah: number;
}

export default function Chart() {

  const [dataPerTahun, setDataPerTahun] = useState<Record<string, ChartDataItem[]>>({});
  const [selectedYear, setSelectedYear] = useState<string>("");

  // Fetch data dari backend
  useEffect(() => {
  fetch("http://localhost:8000/rekam-medis/")
    .then((res) => res.json())
    .then((data: RekamMedis[]) => {
      const grouped = groupByYearAndMonth(data);
      setDataPerTahun(grouped);
      // Auto pilih tahun terbaru
      const years = Object.keys(grouped).sort().reverse();
      if (years.length > 0) setSelectedYear(years[0]);
    });
}, []);

  // Proses data jadi per tahun dan bulan
  const groupByYearAndMonth = (data: RekamMedis[]): Record<string, ChartDataItem[]> => {
    const result: Record<string, ChartDataItem[]> = {};

    data.forEach((item) => {
      const tanggal = new Date(item.tanggal);
      const year = tanggal.getFullYear().toString();
      const monthIndex = tanggal.getMonth(); // 0-11

      // Pastikan tahun dan bulan ada
      if (!result[year]) {
        result[year] = bulanList.map((b) => ({ bulan: b, jumlah: 0 }));
      }

      result[year][monthIndex].jumlah += 1;
    });

    return result;
  };

  const chartData = dataPerTahun[selectedYear] || [];

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
            {Object.keys(dataPerTahun).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <XAxis dataKey="bulan" />
          <YAxis allowDecimals={false} />
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
