import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";

// Tipe data
export type RekamMedis = {
  tanggalPeriksa: string;
  pasien: string;
  keluhan: string;
  dokter: string;
  diagnosa: string;
};

export default function RekamMedis() {
  const navigate = useNavigate();
  const [rekamMedis, setRekamMedis] = useState<RekamMedis[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const dummy: RekamMedis[] = [
      {
        tanggalPeriksa: "10 Juni 2020",
        pasien: "Pasien 1",
        keluhan: "Gatal pada daerah tangan",
        dokter: "Dokter 2",
        diagnosa: "Penyakit kulit",
      },
      {
        tanggalPeriksa: "10 Juni 2020",
        pasien: "Pasien 2",
        keluhan: "Nyeri di perut saat hamil",
        dokter: "Dokter 4",
        diagnosa: "Masalah pada perut",
      },
      {
        tanggalPeriksa: "11 Juni 2020",
        pasien: "Pasien 3",
        keluhan: "Sakit pada paru-paru",
        dokter: "Dokter 3",
        diagnosa: "Penyakit paru-paru",
      },
      {
        tanggalPeriksa: "11 Juni 2020",
        pasien: "Pasien 4",
        keluhan: "Sakit pada janin",
        dokter: "Dokter 4",
        diagnosa: "Masalah kandungan",
      },
      {
        tanggalPeriksa: "11 Juni 2020",
        pasien: "Pasien 5",
        keluhan: "Perih pada mata kanan",
        dokter: "Dokter 1",
        diagnosa: "Sakit pada kornea mata",
      },
      {
        tanggalPeriksa: "12 Juni 2020",
        pasien: "Pasien 6",
        keluhan: "Demam tinggi",
        dokter: "Dokter 1",
        diagnosa: "Influenza",
      },
    ];
    setRekamMedis(dummy);
  }, []);

  const handleDelete = (index: number) => {
    const yakin = window.confirm("Yakin ingin menghapus data ini?");
    if (yakin) {
      const updated = [...rekamMedis];
      updated.splice(index, 1);
      setRekamMedis(updated);
    }
  };

  const filteredData = rekamMedis.filter((rm) =>
    Object.values(rm).some((val) =>
      val.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLast = currentPage * entriesPerPage;
  const indexOfFirst = indexOfLast - entriesPerPage;
  const currentEntries = filteredData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  const paginate = (page: number) => setCurrentPage(page);

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">📋 Data Rekam Medis</h2>
        <button
          onClick={() => navigate("/rekam-medis/tambah")}
          className="bg-[#3EC6D3] text-white px-3 py-1 rounded hover:bg-[#2BB6C0] transition-colors flex items-center gap-1"
        >
          <FaPlus /> Tambah Data
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
                <th className="py-2 px-3 text-center rounded-tl-md">No</th>
                <th className="py-2 px-3">Tanggal</th>
                <th className="py-2 px-3">Pasien</th>
                <th className="py-2 px-3">Keluhan</th>
                <th className="py-2 px-3">Dokter</th>
                <th className="py-2 px-3">Diagnosa</th>
                <th className="py-2 px-3 text-center rounded-tr-md">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentEntries.length === 0 ? (
                <tr>
                  <td
                    className="py-4 px-3 text-center text-gray-500"
                    colSpan={7}
                  >
                    Tidak ada data rekam medis
                  </td>
                </tr>
              ) : (
                currentEntries.map((rm, i) => (
                  <tr
                    key={indexOfFirst + i}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-2 px-3 text-center">
                      {indexOfFirst + i + 1}.
                    </td>
                    <td className="py-2 px-3">{rm.tanggalPeriksa}</td>
                    <td className="py-2 px-3">{rm.pasien}</td>
                    <td className="py-2 px-3">{rm.keluhan}</td>
                    <td className="py-2 px-3">{rm.dokter}</td>
                    <td className="py-2 px-3">{rm.diagnosa}</td>
                    <td className="py-2 px-3 space-x-2 flex justify-center items-center">
                      <button
                        className="text-green-600 hover:text-green-700 transition-colors p-1 rounded-full bg-green-100 hover:bg-green-200"
                        onClick={() =>
                          navigate(`/rekam-medis/detail/${indexOfFirst + i}`)
                        }
                      >
                        <FaEye />
                      </button>
                      <button
                        className="text-yellow-500 hover:text-yellow-600 transition-colors p-1 rounded-full bg-yellow-100 hover:bg-yellow-200"
                        onClick={() =>
                          navigate(`/rekam-medis/edit/${indexOfFirst + i}`)
                        }
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-600 transition-colors p-1 rounded-full bg-red-100 hover:bg-red-200"
                        onClick={() => handleDelete(indexOfFirst + i)}
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
            Showing {indexOfFirst + 1} to{" "}
            {Math.min(indexOfLast, filteredData.length)} of{" "}
            {filteredData.length} entries
          </div>
          <nav className="flex space-x-1">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="px-3 py-1 border rounded text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
