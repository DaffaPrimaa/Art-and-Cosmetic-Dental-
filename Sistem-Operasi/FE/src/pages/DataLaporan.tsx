import { useState } from "react";

interface Laporan {
  tanggal: string; // format: YYYY-MM-DD
  dokter: string;
  pasien: string;
  keluhan: string;
}

// ✅ DATA BARU UNTUK BULAN JULI 2025
const dummyLaporan: Laporan[] = [
  {
    tanggal: "2025-07-01",
    dokter: "dr. Daffa",
    pasien: "Siti Aminah",
    keluhan: "Demam dan batuk",
  },
  {
    tanggal: "2025-07-03",
    dokter: "dr. Sari",
    pasien: "Ahmad Yani",
    keluhan: "Sakit kepala dan pusing",
  },
  {
    tanggal: "2025-07-05",
    dokter: "dr. Daffa",
    pasien: "Budi Santoso",
    keluhan: "Nyeri di bagian perut",
  },
  {
    tanggal: "2025-07-07",
    dokter: "dr. Sari",
    pasien: "Rina Kusuma",
    keluhan: "Sakit gigi belakang",
  },
  {
    tanggal: "2025-07-08",
    dokter: "dr. Daffa",
    pasien: "Toni Wijaya",
    keluhan: "Mata merah dan gatal",
  },
];

const allDokter = ["Semua", "dr. Daffa", "dr. Sari"];

const DataLaporan = () => {
  const [selectedDokter, setSelectedDokter] = useState("Semua");
  const [selectedMonth, setSelectedMonth] = useState("");

  const filteredData = dummyLaporan.filter((laporan) => {
    const monthMatch = selectedMonth
      ? laporan.tanggal.startsWith(selectedMonth)
      : true;

    const dokterMatch =
      selectedDokter === "Semua" || laporan.dokter === selectedDokter;

    return monthMatch && dokterMatch;
  });

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">📄 Data Laporan</h2>

      {/* Filter */}
      <div className="bg-white shadow rounded p-4 mb-6 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
        <div className="flex items-center space-x-2">
          <label className="font-medium">Pilih Dokter:</label>
          <select
            value={selectedDokter}
            onChange={(e) => setSelectedDokter(e.target.value)}
            className="border p-2 rounded"
          >
            {allDokter.map((d, i) => (
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
            className="border p-2 rounded"
            onChange={(e) => {
              const [year, month] = e.target.value.split("-");
              setSelectedMonth(`${year}-${month}`);
            }}
          />
        </div>
      </div>

      {/* Tabel */}
      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-[#0B2C5F] text-white">
            <tr>
              <th className="py-2 px-3 text-left">No</th>
              <th className="py-2 px-3 text-left">Tanggal</th>
              <th className="py-2 px-3 text-left">Dokter</th>
              <th className="py-2 px-3 text-left">Nama Pasien</th>
              <th className="py-2 px-3 text-left">Keluhan</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td className="text-center text-gray-500 py-4 px-3" colSpan={5}>
                  Tidak ada data laporan
                </td>
              </tr>
            ) : (
              filteredData.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-2 px-3">{index + 1}</td>
                  <td className="py-2 px-3">{item.tanggal}</td>
                  <td className="py-2 px-3">{item.dokter}</td>
                  <td className="py-2 px-3">{item.pasien}</td>
                  <td className="py-2 px-3">{item.keluhan}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataLaporan;
