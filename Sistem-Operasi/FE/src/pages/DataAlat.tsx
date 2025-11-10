import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

export interface Alat {
  id: number;
  nama: string;
  jumlah: number;
  harga: number;
  keterangan: string;
  tanggal: string | null; // <-- Ini sudah ada dari sebelumnya
}

export default function DataAlat() {
  const navigate = useNavigate();
  const [alat, setAlat] = useState<Alat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(""); // <-- 1. DITAMBAHKAN

  // Ambil data alat dari backend
  const fetchAlat = async () => {
    try {
      const res = await fetch("http://localhost:8000/alat");
      if (!res.ok) throw new Error("Gagal fetch data alat");
      const data = await res.json();
      setAlat(data);
    } catch (err) {
      console.error("Gagal memuat data:", err);
      Swal.fire("Gagal", "Tidak dapat memuat data alat/obat.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlat();
  }, []);

  // Hapus alat dari backend
  const handleDelete = async (id: number) => {
    // ... (Logika handleDelete Anda tidak berubah)
    const result = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data ini akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`http://localhost:8000/alat/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal hapus alat");
      setAlat((prev) => prev.filter((a) => a.id !== id));
      Swal.fire({
        title: "Terhapus!",
        text: "Data alat/obat berhasil dihapus.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Gagal hapus:", err);
      Swal.fire("Gagal", "Terjadi kesalahan saat menghapus data.", "error");
    }
  };

  // 3. LOGIKA FILTER DIPERBARUI
  const filteredAlat = alat.filter((a) => {
    const matchesSearch = Object.values(a).some((v) =>
      String(v).toLowerCase().includes(searchTerm.toLowerCase())
    );
    // Cek null/undefined untuk tanggal sebelum 'startsWith'
    const matchesMonth = selectedMonth
      ? a.tanggal && a.tanggal.startsWith(selectedMonth)
      : true;
    return matchesSearch && matchesMonth;
  });

  const indexOfLast = currentPage * entriesPerPage;
  const indexOfFirst = indexOfLast - entriesPerPage;
  const currentEntries = filteredAlat.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredAlat.length / entriesPerPage);

  return (
    <div className="mt-6">
      {/* Header (Tidak berubah) */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-semibold text-[#0B2C5F] flex items-center gap-2">
          💊 Data Alat / Obat
        </h2>
        <button
          onClick={() => navigate("/alat/tambah")}
          className="bg-[#0B2C5F] text-white px-4 py-2 rounded-lg hover:bg-[#153a73] transition"
        >
          + Tambah Data
        </button>
      </div>

      {/* Kontainer utama (Styling dari DataAlat) */}
      <div className="bg-white shadow-lg rounded-xl p-5 border border-gray-100">
        
        {/* 2. BLOK FILTER & SEARCH DIGANTI (Layout dari RekamMedis) */}
        <div className="flex flex-wrap justify-between items-center mb-5 gap-3">
          <div className="flex items-center gap-2">
            <span className="text-gray-700">Show</span>
            <select
              className="border rounded-lg px-2 py-1 focus:ring-2 focus:ring-[#0B2C5F]"
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span className="text-gray-700">entries</span>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="search" className="font-medium text-gray-700">
              Search:
            </label>
            <input
              type="text"
              id="search"
              placeholder="Ketik nama / keterangan..." // Placeholder diubah
              className="border rounded-lg px-3 py-1 focus:ring-2 focus:ring-[#0B2C5F]"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="flex items-center space-x-2">
            <label className="font-semibold">Bulan:</label>
            <input
              type="month"
              className="border px-2 py-1 rounded"
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* Tabel Data (Tidak berubah) */}
        {loading ? (
          <p className="text-center text-gray-500 py-6">⏳ Memuat data...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-[#0B2C5F] text-white text-left">
                <tr>
                  <th className="py-3 px-4 font-medium">No</th>
                  <th className="py-3 px-4 font-medium">Tanggal</th>
                  <th className="py-3 px-4 font-medium">Nama Alat / Obat</th>
                  <th className="py-3 px-4 font-medium">Jumlah</th>
                  <th className="py-3 px-4 font-medium">Harga</th>
                  <th className="py-3 px-4 font-medium">Keterangan</th>
                  <th className="py-3 px-4 font-medium text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-500">
                      Tidak ada data alat / obat
                    </td>
                  </tr>
                ) : (
                  currentEntries.map((a, i) => (
                    <tr
                      key={a.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="py-3 px-4">{indexOfFirst + i + 1}</td>
                      <td className="py-3 px-4">
                        {a.tanggal
                          ? new Date(a.tanggal).toLocaleDateString("id-ID")
                          : "-"}
                      </td>
                      <td className="py-3 px-4 font-medium">{a.nama}</td>
                      <td className="py-3 px-4">{a.jumlah}</td>
                      <td className="py-3 px-4">
                        Rp {a.harga.toLocaleString("id-ID")},00
                      </td>
                      <td className="py-3 px-4">{a.keterangan}</td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => navigate(`/alat/edit/${a.id}`)}
                            className="bg-yellow-100 text-yellow-600 p-2 rounded-lg hover:bg-yellow-200 transition"
                            title="Edit Data"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(a.id)}
                            className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition"
                            title="Hapus Data"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination (Tidak berubah) */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 text-sm gap-3">
          <div className="text-gray-600">
            Menampilkan {indexOfFirst + 1} -{" "}
            {Math.min(indexOfLast, filteredAlat.length)} dari{" "}
            {filteredAlat.length} data
          </div>

          <div className="flex gap-1 flex-wrap">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1.5 border rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`px-3 py-1.5 border rounded-md transition ${
                  currentPage === idx + 1
                    ? "bg-[#0B2C5F] text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1.5 border rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}