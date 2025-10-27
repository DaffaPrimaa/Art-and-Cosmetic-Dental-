import { useState, useEffect } from "react";

interface Laporan {
  tanggal: string;
  dokter: string;
  pasien: string;
  tindakan: string;
  total_biaya: number; // 🆕 kolom baru dari backend
}

const DataLaporan = () => {
  const [data, setData] = useState<Laporan[]>([]);
  const [dokterList, setDokterList] = useState<string[]>(["Semua"]);
  const [selectedDokter, setSelectedDokter] = useState("Semua");
  const [selectedMonth, setSelectedMonth] = useState("");

  // Ambil data laporan dari BE
  useEffect(() => {
    fetch("http://localhost:8000/rekam-medis/")
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => console.error("Gagal fetch data:", err));
  }, []);

  // Ambil daftar dokter
  useEffect(() => {
    fetch("http://localhost:8000/dokter/")
      .then((res) => res.json())
      .then((res) => {
        const namaDokter = res.map((d: { nama: string }) => d.nama);
        setDokterList(["Semua", ...namaDokter]);
      })
      .catch((err) => console.error("Gagal fetch dokter:", err));
  }, []);

  // Filter data berdasarkan bulan & dokter
  const filteredData = data.filter((laporan) => {
    const monthMatch = selectedMonth
      ? laporan.tanggal.startsWith(selectedMonth)
      : true;
    const dokterMatch =
      selectedDokter === "Semua" || laporan.dokter === selectedDokter;
    return monthMatch && dokterMatch;
  });

  // Hitung total semua biaya
  const totalKeseluruhan = filteredData.reduce(
    (acc, curr) => acc + (curr.total_biaya || 0),
    0
  );

  // Format rupiah
  const formatRupiah = (angka: number) =>
    angka.toLocaleString("id-ID", { style: "currency", currency: "IDR" });

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold text-[#0B2C5F] flex items-center gap-2 mb-4">
          📄 Data Laporan
        </h2>

      {/* Filter Section */}
      <div className="bg-white shadow rounded p-4 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-2">
          <label className="font-medium">Pilih Dokter:</label>
          <select
            value={selectedDokter}
            onChange={(e) => setSelectedDokter(e.target.value)}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {dokterList.map((d, i) => (
              <option key={i} value={d}>
                {d}
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

      {/* Tabel Data */}
      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-[#0B2C5F] text-white">
            <tr>
              <th className="py-3 px-4 text-left">No</th>
              <th className="py-3 px-4 text-left">Tanggal</th>
              <th className="py-3 px-4 text-left">Dokter</th>
              <th className="py-3 px-4 text-left">Nama Pasien</th>
              <th className="py-3 px-4 text-left">Tindakan</th>
              <th className="py-3 px-4 text-right">Total Biaya</th> {/* 🆕 */}
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center text-gray-500 py-4 px-4 italic"
                >
                  Tidak ada data laporan
                </td>
              </tr>
            ) : (
              filteredData.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">{item.tanggal}</td>
                  <td className="py-2 px-4">{item.dokter}</td>
                  <td className="py-2 px-4">{item.pasien}</td>
                  <td className="py-2 px-4">{item.tindakan}</td>
                  <td className="py-2 px-4 text-right font-medium text-blue-600">
                    {formatRupiah(item.total_biaya || 0)}
                  </td>
                </tr>
              ))
            )}
          </tbody>

          {/* Baris total keseluruhan */}
          {filteredData.length > 0 && (
            <tfoot className="bg-gray-100 font-semibold">
              <tr>
                <td colSpan={5} className="py-3 px-4 text-right">
                  Total Keseluruhan:
                </td>
                <td className="py-3 px-4 text-right text-green-700">
                  {formatRupiah(totalKeseluruhan)}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};

export default DataLaporan;
