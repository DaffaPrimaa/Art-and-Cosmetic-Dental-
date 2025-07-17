import { useState } from "react";
import { useNavigate } from "react-router-dom";

export interface Alat {
  nama: string;
  jumlah: string;
  harga: string;
  keterangan: string;
}

export default function TambahAlat() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Alat>({
    nama: "",
    jumlah: "",
    harga: "",
    keterangan: "",
  });

  const [showNotif, setShowNotif] = useState(false);

  const formatRupiah = (value: string) => {
    const angka = value.replace(/[^\d]/g, "");
    if (!angka) return "";
    return parseInt(angka).toLocaleString("id-ID");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "harga") {
      const onlyNumbers = value.replace(/[^\d]/g, "");
      setFormData((prev) => ({
        ...prev,
        harga: formatRupiah(onlyNumbers),
      }));
    } else if (name === "jumlah") {
      const onlyNumbers = value.replace(/[^\d]/g, "");
      setFormData((prev) => ({
        ...prev,
        jumlah: onlyNumbers,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSend = {
      ...formData,
      jumlah: parseInt(formData.jumlah || "0"),
      harga: parseInt(formData.harga.replace(/\./g, "") || "0"),
    };

    try {
      const response = await fetch("http://localhost:8000/alat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error("Gagal menambahkan data alat");
      }

      setShowNotif(true);
      setTimeout(() => {
        setShowNotif(false);
        navigate("/alat");
      }, 1000);
    } catch (err) {
      alert("Terjadi kesalahan saat menyimpan: " + err);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md mb-6 mt-6">
      <h2 className="text-2xl font-semibold mb-4">➕ Tambah Data Alat</h2>

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
          <span>Data alat berhasil ditambahkan</span>
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
            inputMode="numeric"
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
            inputMode="numeric"
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
