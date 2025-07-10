import React, { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export interface RekamMedis {
  pasien: string;
  keluhan: string;
  dokter: string;
  diagnosa: string;
  obat: string;
}

interface TambahRekamMedisProps {
  onSubmit?: (data: RekamMedis) => void;
  onClose?: () => void;
}

const TambahRekamMedis: React.FC<TambahRekamMedisProps> = ({
  onSubmit,
  onClose,
}) => {
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);

  const [form, setForm] = useState<RekamMedis>({
    pasien: "",
    keluhan: "",
    dokter: "",
    diagnosa: "",
    obat: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setForm({
      pasien: "",
      keluhan: "",
      dokter: "",
      diagnosa: "",
      obat: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(form);
    setShowNotif(true);
    setTimeout(() => {
      setShowNotif(false);
      onClose?.();
      navigate("/rekam-medis");
    }, 1500);
  };

  return (
    <div className="relative">
      <div className="bg-white p-6 rounded shadow-md mb-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">➕ Tambah Data Rekam Medis</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Pasien */}
          <div>
            <label className="block font-medium">Pasien</label>
            <select
              name="pasien"
              value={form.pasien}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded"
              required
            >
              <option value="">Pilih Pasien</option>
              <option value="Pasien 1">Pasien 1</option>
              <option value="Pasien 6">Pasien 6</option>
              <option value="Pasien 7">Pasien 7</option>
              {/* Tambahkan opsi pasien lainnya */}
            </select>
          </div>

          {/* Keluhan */}
          <div>
            <label className="block font-medium">Keluhan</label>
            <textarea
              name="keluhan"
              value={form.keluhan}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded"
              placeholder="Masukkan keluhan pasien"
              required
            />
          </div>

          {/* Dokter */}
          <div>
            <label className="block font-medium">Dokter</label>
            <select
              name="dokter"
              value={form.dokter}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded"
              required
            >
              <option value="">Pilih Dokter</option>
              <option value="Dokter 1">Dokter 1</option>
              <option value="Dokter 4">Dokter 4</option>
              {/* Tambahkan opsi dokter lainnya */}
            </select>
          </div>

          {/* Diagnosa */}
          <div>
            <label className="block font-medium">Diagnosa</label>
            <input
              type="text"
              name="diagnosa"
              value={form.diagnosa}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded"
              placeholder="Masukkan diagnosa"
              required
            />
          </div>

          {/* Obat */}
          <div>
            <label className="block font-medium">Obat</label>
            <input
              type="text"
              name="obat"
              value={form.obat}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded"
              placeholder="Masukkan obat yang diberikan"
            />
          </div>

          {/* Tombol Aksi */}
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
          <span>Data rekam medis telah ditambahkan</span>
        </div>
      )}
    </div>
  );
};

export default TambahRekamMedis;
