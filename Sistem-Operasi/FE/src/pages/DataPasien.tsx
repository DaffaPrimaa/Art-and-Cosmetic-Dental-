import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Pasien } from "./TambahPasien"; // Assuming this path is correct
import { FaEdit, FaTrash } from "react-icons/fa";

export default function DataPasien() {
  const navigate = useNavigate();
  const [pasien, setPasien] = useState<Pasien[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Extended dummy data to match the image's 7 entries and pagination example
    const dummy: Pasien[] = [
      {
        nama: "Daffa",
        gender: "Laki-laki",
        email: "daffapp22@gmail.com",
        telp: "085775254782",
        alamat: "jakarta",
      },
      {
        nama: "Sari",
        gender: "Perempuan",
        email: "user2@gmail.com",
        telp: "081234567890",
        alamat: "Bandung",
      },
      {
        nama: "Pasien 3",
        gender: "Laki-laki",
        email: "pasien3@gmail.com",
        telp: "0000000003",
        alamat: "Jakarta",
      },
      {
        nama: "Pasien 4",
        gender: "Laki-laki",
        email: "pasien4@gmail.com",
        telp: "0000000004",
        alamat: "Jambi",
      },
      {
        nama: "Pasien 5",
        gender: "Perempuan",
        email: "pasien5@gmail.com",
        telp: "0000000005",
        alamat: "Medan",
      },
      {
        nama: "Pasien 6",
        gender: "Laki-laki",
        email: "pasien6@gmail.com",
        telp: "0000000006",
        alamat: "Surabaya",
      },
      {
        nama: "Pasien 7",
        gender: "Perempuan",
        email: "pasien7@gmail.com",
        telp: "0000000007",
        alamat: "Bandung",
      },
    ];
    setPasien(dummy);
  }, []);

  const handleDelete = (index: number) => {
    const yakin = window.confirm("Yakin ingin menghapus data ini?");
    if (yakin) {
      const updated = [...pasien];
      updated.splice(index, 1);
      setPasien(updated);
    }
  };

  // Filtering data based on search term
  const filteredPasien = pasien.filter((p) =>
    Object.values(p).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Pagination logic
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredPasien.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );
  const totalPages = Math.ceil(filteredPasien.length / entriesPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className=" mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">🧍 Data Pasien</h2>
        <button
          onClick={() => navigate("/pasien/tambah")}
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
                setCurrentPage(1); // Reset to first page when entries per page changes
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
                setCurrentPage(1); // Reset to first page on search
              }}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border-collapse">
            <thead className="bg-[#0B2C5F] text-white">
              {" "}
              {/* Changed to red-600 for header as in image */}
              <tr>
                <th className="py-2 px-3 font-semibold text-center rounded-tl-md">
                  No
                </th>
                <th className="py-2 px-3 font-semibold">Nama Pasien</th>
                <th className="py-2 px-3 font-semibold">Jenis Kelamin</th>
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
                    Tidak ada data pasien
                  </td>
                </tr>
              ) : (
                currentEntries.map((p, i) => (
                  <tr
                    key={indexOfFirstEntry + i}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-2 px-3 text-center">
                      {indexOfFirstEntry + i + 1}.
                    </td>
                    <td className="py-2 px-3">{p.nama}</td>
                    <td className="py-2 px-3">{p.gender}</td>
                    <td className="py-2 px-3">{p.email}</td>
                    <td className="py-2 px-3">{p.telp}</td>
                    <td className="py-2 px-3">{p.alamat}</td>
                    <td className="py-2 px-3 space-x-2 flex justify-center items-center">
                      <button
                        className="text-yellow-500 hover:text-yellow-600 transition-colors p-1 rounded-full bg-yellow-100 hover:bg-yellow-200"
                        onClick={() =>
                          navigate(`/pasien/edit/${indexOfFirstEntry + i}`)
                        }
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-600 transition-colors p-1 rounded-full bg-red-100 hover:bg-red-200"
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
            {Math.min(indexOfLastEntry, filteredPasien.length)} of{" "}
            {filteredPasien.length} entries
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
