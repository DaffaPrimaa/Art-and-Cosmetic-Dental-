import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

export interface Dokter {
  id: number;
  nama: string;
  spesialis: string;
  email: string;
  telp: string;
  alamat: string;
}

export default function DataDokter() {
  const navigate = useNavigate();
  const [dokter, setDokter] = useState<Dokter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchDokter = async () => {
    try {
      const res = await fetch("http://localhost:8000/dokter");
      const data = await res.json();
      setDokter(data);
    } catch (err) {
      console.error("Gagal fetch data dokter", err);
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
      await fetch(`http://localhost:8000/dokter/${id}`, {
        method: "DELETE",
      });
      setDokter((prev) => prev.filter((d) => d.id !== id));

      Swal.fire({
        title: "Terhapus!",
        text: "Data berhasil dihapus.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Gagal hapus dokter:", err);
      Swal.fire("Gagal", "Terjadi kesalahan saat menghapus data.", "error");
    }
  };

  useEffect(() => {
    fetchDokter();
  }, []);

  const filteredDokter = dokter.filter((d) =>
    Object.values(d).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLast = currentPage * entriesPerPage;
  const indexOfFirst = indexOfLast - entriesPerPage;
  const currentEntries = filteredDokter.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredDokter.length / entriesPerPage);

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">🧑‍⚕️ Data Dokter</h2>
        <button
          onClick={() => navigate("/dokter/tambah")}
          className="bg-[#3EC6D3] text-white px-3 py-1 rounded hover:bg-[#2BB6C0]"
        >
          + Tambah Data
        </button>
      </div>

      <div className="bg-white shadow-md rounded p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border px-2 py-1 rounded"
            >
              {[5, 10, 25, 50].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            <span>entries</span>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="search">Search:</label>
            <input
              id="search"
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="border px-2 py-1 rounded"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-center py-4">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm table-auto border-collapse">
              <thead className="bg-[#0B2C5F] text-white">
                <tr>
                  <th className="py-2 px-3 text-center w-10">No</th>
                  <th className="py-2 px-3 text-left">Nama</th>
                  <th className="py-2 px-3 text-left">Spesialis</th>
                  <th className="py-2 px-3 text-left">Email</th>
                  <th className="py-2 px-3 text-left">Telp</th>
                  <th className="py-2 px-3 text-left">Alamat</th>
                  <th className="py-2 px-3 text-center w-28">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.length === 0 ? (
                  <tr>
                    <td className="text-center py-4" colSpan={7}>
                      Tidak ada data
                    </td>
                  </tr>
                ) : (
                  currentEntries.map((d, i) => (
                    <tr
                      key={d.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-2 px-3 text-center">
                        {indexOfFirst + i + 1}.
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap">{d.nama}</td>
                      <td className="py-2 px-3 whitespace-nowrap">
                        {d.spesialis}
                      </td>
                      <td className="py-2 px-3">{d.email}</td>
                      <td className="py-2 px-3 whitespace-nowrap">{d.telp}</td>
                      <td className="py-2 px-3">{d.alamat}</td>
                      <td className="py-2 px-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => navigate(`/dokter/edit/${d.id}`)}
                            className="bg-yellow-100 text-yellow-600 p-1 rounded hover:bg-yellow-200"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(d.id)}
                            className="bg-red-100 text-red-600 p-1 rounded hover:bg-red-200"
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

        <div className="flex justify-between mt-4">
          <div className="text-gray-600">
            Showing {indexOfFirst + 1} to{" "}
            {Math.min(indexOfLast, filteredDokter.length)} of{" "}
            {filteredDokter.length} entries
          </div>
          <div className="flex gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`px-3 py-1 border rounded ${
                  currentPage === idx + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
