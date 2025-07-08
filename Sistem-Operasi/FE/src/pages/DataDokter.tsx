import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

export interface Dokter {
  nama: string;
  spesialis: string;
  email: string;
  telp: string;
  alamat: string;
}

export default function DataDokter() {
  const navigate = useNavigate();
  const [dokter, setDokter] = useState<Dokter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const dummy: Dokter[] = [
      {
        nama: "dr. Daffa",
        spesialis: "Mata",
        email: "drdaffa@gmail.com",
        telp: "081234567890",
        alamat: "Bandung",
      },
      {
        nama: "dr. Sari",
        spesialis: "Gigi",
        email: "drsari@gmail.com",
        telp: "089876543210",
        alamat: "Jakarta",
      },
    ];
    setDokter(dummy);
  }, []);

  const handleDelete = (index: number) => {
    const yakin = window.confirm("Yakin ingin menghapus data ini?");
    if (yakin) {
      const updated = [...dokter];
      updated.splice(index, 1);
      setDokter(updated);
    }
  };

  const filteredDokter = dokter.filter((d) =>
    Object.values(d).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredDokter.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );
  const totalPages = Math.ceil(filteredDokter.length / entriesPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">🧑‍⚕️ Data Dokter</h2>
        <button
          onClick={() => navigate("/dokter/tambah")}
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
              className="border rounded px-3 py-1"
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
                <th className="py-2 px-3 font-semibold text-center rounded-tl-md">
                  No
                </th>
                <th className="py-2 px-3 font-semibold">Nama Dokter</th>
                <th className="py-2 px-3 font-semibold">Spesialis</th>
                <th className="py-2 px-3 font-semibold">Email</th>
                <th className="py-2 px-3 font-semibold">No Telp</th>
                <th className="py-2 px-3 font-semibold">Alamat</th>
                <th className="py-2 px-3 font-semibold text-center rounded-tr-md">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {currentEntries.length === 0 ? (
                <tr>
                  <td
                    className="py-4 px-3 text-center text-gray-500"
                    colSpan={7}
                  >
                    Tidak ada data dokter
                  </td>
                </tr>
              ) : (
                currentEntries.map((d, i) => (
                  <tr
                    key={indexOfFirstEntry + i}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-2 px-3 text-center">
                      {indexOfFirstEntry + i + 1}.
                    </td>
                    <td className="py-2 px-3">{d.nama}</td>
                    <td className="py-2 px-3">{d.spesialis}</td>
                    <td className="py-2 px-3">{d.email}</td>
                    <td className="py-2 px-3">{d.telp}</td>
                    <td className="py-2 px-3">{d.alamat}</td>
                    <td className="py-2 px-3 space-x-2 flex justify-center items-center">
                      <button
                        className="text-yellow-500 hover:text-yellow-600 p-1 rounded-full bg-yellow-100 hover:bg-yellow-200"
                        onClick={() =>
                          navigate(`/dokter/edit/${indexOfFirstEntry + i}`)
                        }
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-600 p-1 rounded-full bg-red-100 hover:bg-red-200"
                        onClick={() => handleDelete(indexOfFirstEntry + i)}
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
            {Math.min(indexOfLastEntry, filteredDokter.length)} of{" "}
            {filteredDokter.length} entries
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
