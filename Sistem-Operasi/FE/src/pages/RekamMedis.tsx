import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

export type RekamMedis = {
  id: number;
  tanggal: string;
  pasien: string;
  keluhan: string;
  diagnosa: string;
  tindakan: string;
  dokter: string;
};

export default function RekamMedis() {
  const navigate = useNavigate();
  const [rekamMedis, setRekamMedis] = useState<RekamMedis[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    fetchRekamMedis();
  }, []);

  const fetchRekamMedis = async () => {
    try {
      const res = await fetch("http://localhost:8000/rekam-medis");
      if (!res.ok) throw new Error("Gagal fetch data");
      const data = await res.json();
      setRekamMedis(data);
    } catch (err) {
      console.error("Error fetching data:", err);
      alert("Gagal mengambil data rekam medis dari server.");
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
      const res = await fetch(`http://localhost:8000/rekam-medis/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Gagal menghapus dari server");

      Swal.fire({
        title: "Terhapus!",
        text: "Data rekam medis berhasil dihapus.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      fetchRekamMedis();
    } catch (err) {
      console.error(err);
      Swal.fire("Gagal", "Terjadi kesalahan saat menghapus data.", "error");
    }
  };

  const filteredData = rekamMedis.filter((rm) => {
    const matchesSearch = Object.values(rm).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesMonth = selectedMonth
      ? rm.tanggal.startsWith(selectedMonth)
      : true;
    return matchesSearch && matchesMonth;
  });

  const indexOfLast = currentPage * entriesPerPage;
  const indexOfFirst = indexOfLast - entriesPerPage;
  const currentEntries = filteredData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  return (
    <div className="mt-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-semibold text-[#0B2C5F] flex items-center gap-2">
          📋 Data Rekam Medis
        </h2>
        <button
          onClick={() => navigate("/rekam-medis/tambah")}
          className="bg-[#0B2C5F] text-white px-4 py-2 rounded-lg hover:bg-[#153a73] transition"
        >
          + Tambah Data
        </button>
      </div>

      <div className="bg-white shadow-md rounded p-4">
        {/* Filter & Search */}
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
              placeholder="Cari pasien / dokter..."
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

        {/* Tabel Data */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border-collapse table-fixed">
            <thead className="bg-[#0B2C5F] text-white">
              <tr>
                <th className="py-2 px-3 text-center w-[60px] rounded-tl-md">
                  No
                </th>
                <th className="py-2 px-3 w-[120px]">Tanggal</th>
                <th className="py-2 px-3 w-[200px]">Pasien</th>
                <th className="py-2 px-3 w-auto">Keterangan</th>
                <th className="py-2 px-3 w-[220px]">Dokter</th>
                <th className="py-2 px-3 text-center w-[120px] rounded-tr-md">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {currentEntries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-gray-500">
                    Tidak ada data rekam medis
                  </td>
                </tr>
              ) : (
                currentEntries.map((rm, i) => (
                  <tr
                    key={rm.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-2 px-3 text-center">
                      {indexOfFirst + i + 1}.
                    </td>
                    <td className="py-2 px-3">{rm.tanggal}</td>
                    <td className="py-2 px-3">{rm.pasien}</td>
                    <td className="py-2 px-3 whitespace-pre-line">
                      <strong>Keluhan:</strong> {rm.keluhan}
                      {"\n"}
                      <strong>Diagnosa:</strong> {rm.diagnosa}
                      {"\n"}
                      <strong>Tindakan:</strong> {rm.tindakan}
                    </td>
                    <td className="py-2 px-3">{rm.dokter}</td>
                    <td className="h-full px-3 py-2">
                      <div className="flex h-full items-center justify-center space-x-2">
                        <button
                          className="bg-green-100 text-green-600 p-2 rounded-lg hover:bg-green-200 transition"
                          title="Detail"
                          onClick={() =>
                            navigate(`/rekam-medis/detail/${rm.id}`)
                          }
                        >
                          <FaEye />
                        </button>
                        <button
                          className="bg-yellow-100 text-yellow-600 p-2 rounded-lg hover:bg-yellow-200 transition"
                          title="Edit Data"
                          onClick={() => navigate(`/rekam-medis/edit/${rm.id}`)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition"
                          title="Hapus Data"
                          onClick={() => handleDelete(rm.id)}
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

        {/* Pagination */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 text-sm gap-3">
          <div className="text-gray-600">
            Menampilkan {indexOfFirst + 1} -{" "}
            {Math.min(indexOfLast, filteredData.length)} dari{" "}
            {filteredData.length} data
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
