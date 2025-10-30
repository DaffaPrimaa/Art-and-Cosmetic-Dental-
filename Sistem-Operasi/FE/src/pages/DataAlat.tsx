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
}

export default function DataAlat() {
  const navigate = useNavigate();
  const [alat, setAlat] = useState<Alat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

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

  // Filter dan pagination
  const filteredAlat = alat.filter((a) =>
    Object.values(a).some((v) =>
      String(v).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLast = currentPage * entriesPerPage;
  const indexOfFirst = indexOfLast - entriesPerPage;
  const currentEntries = filteredAlat.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredAlat.length / entriesPerPage);

  return (
    <div className="mt-6">
      {/* Header */}
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

      {/* Kontainer utama */}
      <div className="bg-white shadow-lg rounded-xl p-5 border border-gray-100">
        {/* Filter Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span>Tampilkan</span>
            <select
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border rounded-md px-2 py-1 focus:ring-[#0B2C5F] focus:border-[#0B2C5F]"
            >
              {[5, 10, 25, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <span>data</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <label htmlFor="search" className="font-medium">
              Cari:
            </label>
            <input
              id="search"
              type="text"
              placeholder="Ketik nama / keterangan..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="border rounded-md px-3 py-1 focus:ring-[#0B2C5F] focus:border-[#0B2C5F]"
            />
          </div>
        </div>

        {/* Tabel Data */}
        {loading ? (
          <p className="text-center text-gray-500 py-6">⏳ Memuat data...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-[#0B2C5F] text-white text-left">
                <tr>
                  <th className="py-3 px-4 font-medium">No</th>
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
                    <td colSpan={6} className="text-center py-6 text-gray-500">
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

        {/* Pagination */}
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
