import React, { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // ✅ Tambahkan ini

export interface Pasien {
  nama: string;
  gender: string;
  email: string;
  telp: string;
  alamat: string;
}

interface TambahPasienProps {
  onSubmit?: (data: Pasien) => void;
  onClose?: () => void;
}

const TambahPasien: React.FC<TambahPasienProps> = ({ onSubmit, onClose }) => {
  const [form, setForm] = useState<Pasien>({
    nama: "",
    gender: "Laki-laki",
    email: "",
    telp: "",
    alamat: "",
  });

  const [showNotif, setShowNotif] = useState(false);
  const navigate = useNavigate(); // ✅ Inisialisasi navigate

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(form);
    setShowNotif(true);
    setTimeout(() => {
      setShowNotif(false);
      onClose?.();
      navigate("/pasien"); // ✅ Navigasi setelah submit
    }, 1500);
  };

  const handleReset = () => {
    setForm({
      nama: "",
      gender: "Laki-laki",
      email: "",
      telp: "",
      alamat: "",
    });
  };

  return (
    <div className="relative">
      <div className="bg-white p-6 rounded shadow-md mb-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">➕ Tambah Data Pasien</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Nama Pasien</label>
            <input
              type="text"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Jenis Kelamin</label>
            <div className="flex space-x-4 mt-1">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Laki-laki"
                  checked={form.gender === "Laki-laki"}
                  onChange={handleChange}
                />
                <span className="ml-1">Laki-laki</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Perempuan"
                  checked={form.gender === "Perempuan"}
                  onChange={handleChange}
                />
                <span className="ml-1">Perempuan</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Alamat</label>
            <textarea
              name="alamat"
              value={form.alamat}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Nomor Telepon</label>
            <input
              type="text"
              name="telp"
              value={form.telp}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded"
              required
            />
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={handleReset}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              Reset
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>

      {/* Notifikasi */}
      {showNotif && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-700 px-6 py-3 rounded-lg shadow-md flex items-center gap-2 z-50 animate-bounce">
          <FaCheckCircle className="text-green-600" />
          <span>Data pasien telah ditambahkan</span>
        </div>
      )}
    </div>
  );
};

export default TambahPasien;
