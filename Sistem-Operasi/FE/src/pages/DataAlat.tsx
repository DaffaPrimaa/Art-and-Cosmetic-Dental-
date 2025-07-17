import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch dari backend
  useEffect(() => {
    fetch("http://localhost:8000/alat")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal fetch data alat");
        return res.json();
      })
      .then((data: Alat[]) => setAlat(data))
      .catch((err) => {
        console.error("Gagal memuat data:", err);
        alert("Gagal memuat data alat");
      });
  }, []);

  // Hapus dari backend
  const handleDelete = async (id: number) => {
    const yakin = window.confirm("Yakin ingin menghapus data ini?");
    if (!yakin) return;

    try {
      const res = await fetch(`http://localhost:8000/alat/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus");

      // Refresh state setelah hapus
      setAlat((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Gagal hapus:", err);
      alert("Terjadi kesalahan saat menghapus data.");
    }
  };

  const filteredAlat = alat.filter((a) =>
    Object.values(a).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredAlat.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredAlat.length / entriesPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">💊 Data Alat / Obat</h2>
        <button
          onClick={() => navigate("/alat/tambah")}
          className="bg-[#3EC6D3] text-white px-3 py-1 rounded hover:bg-[#2BB6C0] transition-colors"
        >
          + Tambah Data
        </button>
      </div>

      <div className="bg-white shadow-md rounded p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <span>Show</span>
            <select
              className="border rounded px-2 py-1"
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
            <span>entries</span>
          </div>

          <div className="flex items-center space-x-2">
            <label htmlFor="search" className="font-semibold">
              Search:
            </label>
            <input
              type="text"
              id="search"
              className="border rounded px-3 py-1 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border-collapse">
            <thead className="bg-[#0B2C5F] text-white">
              <tr>
                <th className="py-2 px-3 font-semibold text-center rounded-tl-md">No</th>
                <th className="py-2 px-3 font-semibold">Nama Obat</th>
                <th className="py-2 px-3 font-semibold">Jumlah</th>
                <th className="py-2 px-3 font-semibold">Harga</th>
                <th className="py-2 px-3 font-semibold">Keterangan</th>
                <th className="py-2 px-3 font-semibold text-center rounded-tr-md">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentEntries.length === 0 ? (
                <tr>
                  <td className="py-4 px-3 text-center text-gray-500" colSpan={6}>
                    Tidak ada data alat / obat
                  </td>
                </tr>
              ) : (
                currentEntries.map((a, i) => (
                  <tr
                    key={a.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-2 px-3 text-center">
                      {indexOfFirstEntry + i + 1}.
                    </td>
                    <td className="py-2 px-3">{a.nama}</td>
                    <td className="py-2 px-3">{a.jumlah}</td>
                    <td className="py-2 px-3">Rp {a.harga.toLocaleString("id-ID")},00</td>
                    <td className="py-2 px-3">{a.keterangan}</td>
                    <td className="py-2 px-3 flex justify-center items-center space-x-2">
                      <button
                        className="text-yellow-500 hover:text-yellow-600 transition-colors p-1 rounded-full bg-yellow-100 hover:bg-yellow-200"
                        onClick={() => navigate(`/alat/edit/${a.id}`)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-600 transition-colors p-1 rounded-full bg-red-100 hover:bg-red-200"
                        onClick={() => handleDelete(a.id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="text-gray-600">
            Showing {indexOfFirstEntry + 1} to{" "}
            {Math.min(indexOfLastEntry, filteredAlat.length)} of {filteredAlat.length} entries
          </div>
          <nav className="flex space-x-1">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`px-3 py-1 border rounded ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
