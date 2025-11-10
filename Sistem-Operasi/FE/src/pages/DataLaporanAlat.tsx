import { useState, useEffect } from "react";

// 1. Interface diperbarui agar 100% cocok dengan BE
interface LaporanAlat {
  id: number;
  tanggal: string;
  nama_alat: string;
  status: string; // Mis: "MASUK", "KELUAR", "DIUPDATE"
  jumlah: number;
  harga_satuan: number; // <-- Ditambahkan kembali
  keterangan: string | null; // <-- Diubah dari string menjadi string | null
}

const DataLaporanAlat = () => {
  const [data, setData] = useState<LaporanAlat[]>([]);
  const [statusList] = useState(["Semua", "MASUK", "KELUAR", "DIUPDATE"]);
  const [selectedStatus, setSelectedStatus] = useState("Semua");
  const [selectedMonth, setSelectedMonth] = useState("");

  // Fungsi fetchAlat untuk me-refresh data
  const fetchAlatLog = () => {
    fetch("http://localhost:8000/laporan-alat/")
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => console.error("Gagal fetch data log alat:", err));
  };

  useEffect(() => {
    fetchAlatLog();
  }, []);

  // 2. Fungsi formatRupiah (Sudah Benar)
  const formatRupiah = (angka: number) =>
    (angka || 0).toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    });

  // 3. Filter data (Sudah Benar)
  const filteredData = data.filter((laporan) => {
    const monthMatch = selectedMonth
      ? laporan.tanggal.startsWith(selectedMonth)
      : true;
    const statusMatch =
      selectedStatus === "Semua" || laporan.status === selectedStatus;
    return monthMatch && statusMatch;
  });

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold text-[#0B2C5F] flex items-center gap-2 mb-4">
        📄 Laporan Alat / Bahan
      </h2>

      {/* Filter Section (Sudah Benar) */}
      <div className="bg-white shadow rounded p-4 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-2">
          <label className="font-medium">Pilih Status:</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statusList.map((s, i) => (
              <option key={i} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="font-medium">Pilih Bulan:</label>
          <input
            type="month"
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        </div>
      </div>

      {/* Tabel Data (Sudah Benar) */}
      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-[#0B2C5F] text-white">
            {/* 4. Kolom Tabel (Sudah Benar) */}
            <tr>
              <th className="py-3 px-4 text-left">No</th>
              <th className="py-3 px-4 text-left">Tanggal</th>
              <th className="py-3 px-4 text-left">Nama Alat/Bahan</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-right">Jumlah</th>
              <th className="py-3 px-4 text-right">Harga Satuan</th>
              <th className="py-3 px-4 text-left">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                {/* 5. colSpan (Sudah Benar) */}
                <td
                  colSpan={7}
                  className="text-center text-gray-500 py-4 px-4 italic"
                >
                  Tidak ada data laporan
                </td>
              </tr>
            ) : (
              filteredData.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  {/* 6. Data (Sudah Benar) */}
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">
                    {new Date(item.tanggal).toLocaleDateString("id-ID")}
                  </td>
                  <td className="py-2 px-4">{item.nama_alat}</td>
                  <td className="py-2 px-4">
                    {/* Logika Status (Sudah Benar) */}
                    {item.status === "MASUK" ? (
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">
                        {item.status}
                      </span>
                    ) : item.status === "KELUAR" ? (
                      <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs">
                        {item.status}
                      </span>
                    ) : (
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                        {item.status}
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-4 text-right">{item.jumlah}</td>
                  <td className="py-2 px-4 text-right">
                    {formatRupiah(item.harga_satuan)}
                  </td>
                  <td className="py-2 px-4">{item.keterangan || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataLaporanAlat;