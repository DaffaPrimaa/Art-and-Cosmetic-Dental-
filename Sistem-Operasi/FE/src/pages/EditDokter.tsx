import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export interface Dokter {
  nama: string;
  spesialis: string;
  email: string;
  telp: string;
  alamat: string;
}

const dummyData: Dokter[] = [
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

export default function EditDokter() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Dokter>({
    nama: "",
    spesialis: "",
    email: "",
    telp: "",
    alamat: "",
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowNotif(true);

    setTimeout(() => {
      setShowNotif(false);
      navigate("/dokter");
    }, 1000);
  };

  return (
    <div className="bg-white p-6 rounded shadow-md mb-6 mt-6">
      <h2 className="text-2xl font-semibold mb-4">📝 Edit Data Dokter</h2>

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
          <span>Data dokter telah diperbarui</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Nama Dokter</label>
          <input
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Spesialis</label>
          <input
            name="spesialis"
            value={formData.spesialis}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Email</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Nomor Telepon</label>
          <input
            name="telp"
            value={formData.telp}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Alamat</label>
          <textarea
            name="alamat"
            value={formData.alamat}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            rows={3}
            required
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/dokter")}
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
