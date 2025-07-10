import { useState } from "react";
import { useNavigate} from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

interface RekamMedis {
  tanggalPeriksa: string;
  pasien: string;
  keluhan: string;
  dokter: string;
  diagnosa: string;
  obat: string;
}

const EditRekamMedis = () => {
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);

  const [form, setForm] = useState<RekamMedis>({
    tanggalPeriksa: "2020-06-11", // contoh default, sebaiknya fetch real data
    pasien: "Pasien 6",
    keluhan: "Demam tinggi",
    dokter: "Dokter 1",
    diagnosa: "Influenza",
    obat: "Paracetamol, Vitamin C",
  });

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
    // Simulasikan penyimpanan data
    setShowNotif(true);
    setTimeout(() => {
      setShowNotif(false);
      navigate("/rekam-medis");
    }, 1500);
  };

  return (
    <div className="relative mt-6">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-4">✏️ Edit Rekam Medis</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Tanggal Periksa</label>
            <input
              type="date"
              name="tanggalPeriksa"
              value={form.tanggalPeriksa}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Pasien</label>
            <input
              type="text"
              name="pasien"
              value={form.pasien}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Keluhan</label>
            <textarea
              name="keluhan"
              value={form.keluhan}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Dokter</label>
            <input
              type="text"
              name="dokter"
              value={form.dokter}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Diagnosa</label>
            <textarea
              name="diagnosa"
              value={form.diagnosa}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Obat</label>
            <textarea
              name="obat"
              value={form.obat}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded"
              required
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => navigate("/rekam-medis")}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>

      {/* Notifikasi */}
      {showNotif && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-700 px-6 py-3 rounded-lg shadow-md flex items-center gap-2 z-50 animate-bounce">
          <FaCheckCircle className="text-green-600" />
          <span>Data rekam medis berhasil diperbarui</span>
        </div>
      )}
    </div>
  );
};

export default EditRekamMedis;
