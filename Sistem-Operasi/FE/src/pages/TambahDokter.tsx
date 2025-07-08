import React, { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export interface Dokter {
  nip: string;
  nama: string;
  spesialis: string;
  email: string;
  telp: string;
  alamat: string;
}

interface TambahDokterProps {
  onSubmit?: (data: Dokter) => void;
  onClose?: () => void;
}

const TambahDokter: React.FC<TambahDokterProps> = ({ onSubmit, onClose }) => {
  const [form, setForm] = useState<Dokter>({
    nip: "",
    nama: "",
    spesialis: "Umum",
    email: "",
    telp: "",
    alamat: "",
  });

  const [showNotif, setShowNotif] = useState(false);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
      navigate("/dokter");
    }, 1500);
  };

  const handleReset = () => {
    setForm({
      nip: "",
      nama: "",
      spesialis: "Umum",
      email: "",
      telp: "",
      alamat: "",
    });
  };

  return (
    <div className="relative">
      <div className="bg-white p-6 rounded shadow-md mb-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">➕ Tambah Data Dokter</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">NIP</label>
            <input
              type="text"
              name="nip"
              value={form.nip}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Nama Dokter</label>
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
            <label className="block font-medium">Spesialis</label>
            <select
              name="spesialis"
              value={form.spesialis}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded"
              required
            >
              <option value="Umum">Umum</option>
              <option value="Mata">Mata</option>
              <option value="Mulut">Mulut</option>
              <option value="Gigi">Gigi</option>
              <option value="Kulit">Kulit</option>
              <option value="THT">THT</option>
            </select>
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

      {showNotif && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-700 px-6 py-3 rounded-lg shadow-md flex items-center gap-2 z-50 animate-bounce">
          <FaCheckCircle className="text-green-600" />
          <span>Data dokter telah ditambahkan</span>
        </div>
      )}
    </div>
  );
};

export default TambahDokter;
