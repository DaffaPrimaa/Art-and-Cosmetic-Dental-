import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Pasien } from "./TambahPasien";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function DataPasien() {
  const navigate = useNavigate();
  const [pasien, setPasien] = useState<Pasien[]>([]);

  useEffect(() => {
    const dummy: Pasien[] = [
      {
        nama: "Daffa",
        gender: "Laki-laki",
        email: "daffapp22@gmail.com",
        telp: "085775254782",
        alamat: "Gang langgar kebagusan",
      },
      {
        nama: "Sari",
        gender: "Perempuan",
        email: "user2@gmail.com",
        telp: "081234567890",
        alamat: "Jakarta",
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

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">🧍 Data Pasien</h2>
        <button
          onClick={() => navigate("/pasien/tambah")}
          className="bg-[#3EC6D3] text-white px-3 py-1 rounded hover:bg-[#2BB6C0]"
        >
          + Tambah Data
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[#0B2C5F] text-white">
            <tr>
              <th className="py-2 px-3">No</th>
              <th className="py-2 px-3">Nama</th>
              <th className="py-2 px-3">Gender</th>
              <th className="py-2 px-3">Email</th>
              <th className="py-2 px-3">Telp</th>
              <th className="py-2 px-3">Alamat</th>
              <th className="py-2 px-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pasien.length === 0 ? (
              <tr>
                <td className="py-4 px-3 text-center" colSpan={7}>
                  Tidak ada data pasien
                </td>
              </tr>
            ) : (
              pasien.map((p, i) => (
                <tr key={i} className="border-b hover:bg-gray-100">
                  <td className="py-2 px-3">{i + 1}</td>
                  <td className="py-2 px-3">{p.nama}</td>
                  <td className="py-2 px-3">{p.gender}</td>
                  <td className="py-2 px-3">{p.email}</td>
                  <td className="py-2 px-3">{p.telp}</td>
                  <td className="py-2 px-3">{p.alamat}</td>
                  <td className="py-2 px-3 space-x-2">
                    <button
                      className="text-yellow-600 hover:text-yellow-700"
                      onClick={() => navigate(`/pasien/edit/${i}`)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(i)}
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
    </div>
  );
}
