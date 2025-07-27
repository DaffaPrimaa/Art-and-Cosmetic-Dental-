import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface RekamMedis {
  pasien_id: number;
  dokter_id: number;
  keluhan: string;
  diagnosa: string;
  tindakan: string;
  tanggal: string;
}

interface Dokter {
  id: number;
  nama: string;
}

interface Pasien {
  id: number;
  nama: string;
}

const TambahRekamMedis: React.FC = () => {
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);

  const [form, setForm] = useState<RekamMedis>({
    pasien_id: 0,
    dokter_id: 0,
    keluhan: "",
    diagnosa: "",
    tindakan: "",
    tanggal: new Date().toISOString().split("T")[0], // default hari ini
  });

  const [dokterList, setDokterList] = useState<Dokter[]>([]);
  const [pasienList, setPasienList] = useState<Pasien[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/dokter")
      .then((res) => res.json())
      .then((data) => setDokterList(data));

    fetch("http://localhost:8000/pasien")
      .then((res) => res.json())
      .then((data) => setPasienList(data));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "pasien_id" || name === "dokter_id"
          ? parseInt(value)
          : value,
    }));
  };

  const handleReset = () => {
    setForm({
      pasien_id: 0,
      dokter_id: 0,
      keluhan: "",
      diagnosa: "",
      tindakan: "",
      tanggal: new Date().toISOString().split("T")[0],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/rekam-medis/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Gagal menambahkan rekam medis");

      setShowNotif(true);
      setTimeout(() => {
        setShowNotif(false);
        navigate("/rekam-medis");
      }, 1500);
    } catch (err) {
      alert("Gagal menyimpan data. Periksa konsol.");
      console.error(err);
    }
  };

  return (
    <div className="relative">
      <div className="bg-white p-6 rounded shadow-md mb-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">
          ➕ Tambah Data Rekam Medis
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tanggal */}
          <div>
            <label className="block font-medium">Tanggal</label>
            <input
              type="date"
              name="tanggal"
              value={form.tanggal}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded"
              required
            />
          </div>

          {/* Pasien */}
          <div>
            <label className="block font-medium">Pasien</label>
            <select
              name="pasien_id"
              value={form.pasien_id}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded"
              required
            >
              <option value="">Pilih Pasien</option>
              {pasienList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nama}
                </option>
              ))}
            </select>
          </div>

          {/* Dokter */}
          <div>
            <label className="block font-medium">Dokter</label>
            <select
              name="dokter_id"
              value={form.dokter_id}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded"
              required
            >
              <option value="">Pilih Dokter</option>
              {dokterList.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nama}
                </option>
              ))}
            </select>
          </div>

          {/* Keluhan */}
          <div>
            <label className="block font-medium">Keluhan</label>
            <input
              type="text"
              name="keluhan"
              value={form.keluhan}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded"
              placeholder="Masukkan keluhan pasien"
              required
            />
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

          {/* Tindakan */}
          <div>
            <label className="block font-medium">Tindakan</label>
            <input
              type="text"
              name="tindakan"
              value={form.tindakan}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded"
              placeholder="Masukkan tindakan"
              required
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
