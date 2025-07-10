import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export interface Alat {
  nama: string;
  jumlah: number;
  harga: number;
  keterangan: string;
}

const dummyData: Alat[] = [
  {
    nama: "Obat Paracetamol",
    jumlah: 10,
    harga: 5000,
    keterangan: "Obat penurun demam",
  },
  {
    nama: "Obat Amoxicillin",
    jumlah: 20,
    harga: 8000,
    keterangan: "Antibiotik",
  },
];

export default function EditAlat() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Alat>({
    nama: "",
    jumlah: 0,
    harga: 0,
    keterangan: "",
  });

  const [showNotif, setShowNotif] = useState(false);

  useEffect(() => {
    if (id) {
      const index = parseInt(id);
      const selected = dummyData[index];
      if (selected) setFormData(selected);
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "jumlah" || name === "harga" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowNotif(true);

    setTimeout(() => {
      setShowNotif(false);
      navigate("/alat");
    }, 1000);
  };

  return (
    <div className="bg-white p-6 rounded shadow-md mb-6 mt-6">
      <h2 className="text-2xl font-semibold mb-4">📝 Edit Data Alat</h2>

      {showNotif && (
        <div className="flex items-center gap-2 bg-green-100 border border-green-400 text-green-800 px-4 py-2 rounded mb-4 shadow-md">
          <svg
            className="w-5 h-5 text-green-600"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>Data alat telah diperbarui</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Nama Obat</label>
          <input
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Jumlah</label>
          <input
            name="jumlah"
            type="number"
            value={formData.jumlah}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Harga</label>
          <input
            name="harga"
            type="number"
            value={formData.harga}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Keterangan</label>
          <textarea
            name="keterangan"
            value={formData.keterangan}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            rows={3}
            required
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/alat")}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Batal
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
}
