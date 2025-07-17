// EditPasien.tsx

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export interface Pasien {
  id?: number;
  nama: string;
  gender: string;
  email: string;
  telp: string;
  alamat: string;
}

export default function EditPasien() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Pasien>({
    nama: "",
    gender: "Laki-laki",
    email: "",
    telp: "",
    alamat: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showNotif, setShowNotif] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8000/pasien/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Gagal mengambil data pasien");
          return res.json();
        })
        .then((data: Pasien) => {
          setFormData(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError("Pasien tidak ditemukan.");
          setLoading(false);
        });
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, gender: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`http://localhost:8000/pasien/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Gagal memperbarui pasien");
      }

      setShowNotif(true);
      setTimeout(() => {
        navigate("/pasien");
      }, 1000);
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat menyimpan data.");
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="bg-white p-6 rounded shadow-md mb-6 mt-6">
      <h2 className="text-2xl font-semibold mb-4">📝 Edit Data Pasien</h2>

      {showNotif && (
        <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-2 rounded mb-4">
          Data pasien berhasil diperbarui.
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-800 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Nama Pasien</label>
          <input
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Jenis Kelamin</label>
          <div className="flex items-center gap-6 mt-1">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="gender"
                value="Laki-laki"
                checked={formData.gender === "Laki-laki"}
                onChange={handleGenderChange}
              />
              Laki-laki
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="gender"
                value="Perempuan"
                checked={formData.gender === "Perempuan"}
                onChange={handleGenderChange}
              />
              Perempuan
            </label>
          </div>
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
            onClick={() => navigate("/pasien")}
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
