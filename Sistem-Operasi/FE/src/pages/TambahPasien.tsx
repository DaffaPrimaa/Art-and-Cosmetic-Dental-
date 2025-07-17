import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

export interface Pasien {
  nama: string;
  gender: string;
  email: string;
  telp: string;
  alamat: string;
}

export default function TambahPasien() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Pasien>({
    nama: "",
    gender: "Laki-laki",
    email: "",
    telp: "",
    alamat: "",
  });

  const [showNotif, setShowNotif] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8000/pasien", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Gagal menambahkan pasien");
      }

      setShowNotif(true);
      setTimeout(() => {
        navigate("/pasien");
      }, 1000);
    } catch (err) {
      setError("Terjadi kesalahan saat menyimpan data.");
      console.error(err);
    }
  };

  const handleReset = () => {
    setFormData({
      nama: "",
      gender: "Laki-laki",
      email: "",
      telp: "",
      alamat: "",
    });
    setError("");
  };

  return (
    <div className="bg-white p-6 rounded shadow-md mb-6 mt-6">
      <h2 className="text-2xl font-semibold mb-4">➕ Tambah Data Pasien</h2>

      {showNotif && (
        <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-2 rounded mb-4 flex items-center gap-2">
          <FaCheckCircle />
          <span>Data pasien berhasil ditambahkan.</span>
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
          <div className="flex space-x-4 mt-1">
            <label>
              <input
                type="radio"
                name="gender"
                value="Laki-laki"
                checked={formData.gender === "Laki-laki"}
                onChange={handleChange}
              />
              <span className="ml-1">Laki-laki</span>
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="Perempuan"
                checked={formData.gender === "Perempuan"}
                onChange={handleChange}
              />
              <span className="ml-1">Perempuan</span>
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
  );
}
