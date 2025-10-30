import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

export interface Pasien {
  id?: number;
  nama: string;
  email: string;
  telp: string;
  alamat: string;
  gender?: string;
}

export default function DataPasien() {
  const navigate = useNavigate();
  const [pasien, setPasien] = useState<Pasien[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPasien = async () => {
    try {
      const res = await fetch("http://localhost:8000/pasien");
      const data = await res.json();
      setPasien(data);
    } catch (err) {
      console.error("Gagal fetch pasien:", err);
    } finally {
      setLoading(false);
    }
  };

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
      await fetch(`http://localhost:8000/pasien/${id}`, {
        method: "DELETE",
      });
      setPasien((prev) => prev.filter((p) => p.id !== id));

      Swal.fire({
        title: "Terhapus!",
        text: "Data berhasil dihapus.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Gagal hapus pasien:", err);
      Swal.fire("Gagal", "Terjadi kesalahan saat menghapus data.", "error");
    }
  };

  useEffect(() => {
    fetchPasien();
  }, []);

  const filteredPasien = pasien.filter((p) =>
    Object.values(p).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLast = currentPage * entriesPerPage;
  const indexOfFirst = indexOfLast - entriesPerPage;
  const currentEntries = filteredPasien.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredPasien.length / entriesPerPage);

  return (
    <div className="mt-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-semibold text-[#0B2C5F] flex items-center gap-2">
          🧍 Data Pasien
        </h2>
        <button
          onClick={() => navigate("/pasien/tambah")}
          className="bg-[#0B2C5F] text-white px-4 py-2 rounded-lg hover:bg-[#153a73] transition"
        >
          + Tambah Pasien
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
              placeholder="Ketik nama / email..."
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
                  <th className="py-3 px-4 font-medium">Nama</th>
                  <th className="py-3 px-4 font-medium">Email</th>
                  <th className="py-3 px-4 font-medium">Telepon</th>
                  <th className="py-3 px-4 font-medium">Alamat</th>
                  <th className="py-3 px-4 font-medium text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-500">
                      Tidak ada data pasien
                    </td>
                  </tr>
                ) : (
                  currentEntries.map((p, i) => (
                    <tr
                      key={p.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="py-3 px-4">{indexOfFirst + i + 1}</td>
                      <td className="py-3 px-4 font-medium">{p.nama}</td>
                      <td className="py-3 px-4">{p.email}</td>
                      <td className="py-3 px-4">{p.telp}</td>
                      <td className="py-3 px-4">{p.alamat}</td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => navigate(`/pasien/edit/${p.id}`)}
                            className="bg-yellow-100 text-yellow-600 p-2 rounded-lg hover:bg-yellow-200 transition"
                            title="Edit Data"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id!)}
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
            {Math.min(indexOfLast, filteredPasien.length)} dari{" "}
            {filteredPasien.length} data
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
