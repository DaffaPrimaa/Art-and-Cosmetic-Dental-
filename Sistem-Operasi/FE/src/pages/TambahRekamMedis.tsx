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
    tanggal: new Date().toISOString().split("T")[0],
  });

  const [dokterList, setDokterList] = useState<Dokter[]>([]);
  const [pasienList, setPasienList] = useState<Pasien[]>([]);

  const [namaPasien, setNamaPasien] = useState("");
  const [namaDokter, setNamaDokter] = useState("");

  const [showDropdownPasien, setShowDropdownPasien] = useState(false);
  const [showDropdownDokter, setShowDropdownDokter] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/dokter")
      .then((res) => res.json())
      .then((data) => setDokterList(data));

    fetch("http://localhost:8000/pasien")
      .then((res) => res.json())
      .then((data) => setPasienList(data));
  }, []);

  const filteredPasien =
    namaPasien.trim() === ""
      ? pasienList
      : pasienList.filter((p) =>
          p.nama.toLowerCase().includes(namaPasien.toLowerCase())
        );

  const filteredDokter =
    namaDokter.trim() === ""
      ? dokterList
      : dokterList.filter((d) =>
          d.nama.toLowerCase().includes(namaDokter.toLowerCase())
        );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNamaPasienChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNamaPasien(value);
    setShowDropdownPasien(true);
    const selected = pasienList.find(
      (p) => p.nama.toLowerCase() === value.toLowerCase()
    );
    setForm((prev) => ({
      ...prev,
      pasien_id: selected ? selected.id : 0,
    }));
  };

  const handleNamaDokterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNamaDokter(value);
    setShowDropdownDokter(true);
    const selected = dokterList.find(
      (d) => d.nama.toLowerCase() === value.toLowerCase()
    );
    setForm((prev) => ({
      ...prev,
      dokter_id: selected ? selected.id : 0,
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
    setNamaPasien("");
    setNamaDokter("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.pasien_id || !form.dokter_id) {
      alert("Pasien dan Dokter wajib dipilih.");
      return;
    }

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

          {/* Pasien Autocomplete */}
          <div className="relative">
            <label className="block font-medium">Pasien</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={namaPasien}
                onChange={handleNamaPasienChange}
                onFocus={() => setShowDropdownPasien(true)}
                onBlur={() =>
                  setTimeout(() => setShowDropdownPasien(false), 150)
                }
                className="border w-full px-3 py-2 rounded"
                placeholder="Ketik nama pasien..."
                required
              />
              
            </div>
            {showDropdownPasien && (
              <ul className="absolute z-10 w-full bg-white border rounded shadow mt-1 max-h-40 overflow-y-auto">
                {filteredPasien.length === 0 ? (
                  <li className="px-3 py-2 text-red-500">❌ Tidak ditemukan</li>
                ) : (
                  filteredPasien.map((p) => (
                    <li
                      key={p.id}
                      onClick={() => {
                        setNamaPasien(p.nama);
                        setForm((prev) => ({ ...prev, pasien_id: p.id }));
                        setShowDropdownPasien(false);
                      }}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {p.nama}
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>

          {/* Dokter Autocomplete */}
          <div className="relative">
            <label className="block font-medium">Dokter</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={namaDokter}
                onChange={handleNamaDokterChange}
                onFocus={() => setShowDropdownDokter(true)}
                onBlur={() =>
                  setTimeout(() => setShowDropdownDokter(false), 150)
                }
                className="border w-full px-3 py-2 rounded"
                placeholder="Ketik nama dokter..."
                required
              />
              
            </div>
            {showDropdownDokter && (
              <ul className="absolute z-10 w-full bg-white border rounded shadow mt-1 max-h-40 overflow-y-auto">
                {filteredDokter.length === 0 ? (
                  <li className="px-3 py-2 text-red-500">❌ Tidak ditemukan</li>
                ) : (
                  filteredDokter.map((d) => (
                    <li
                      key={d.id}
                      onClick={() => {
                        setNamaDokter(d.nama);
                        setForm((prev) => ({ ...prev, dokter_id: d.id }));
                        setShowDropdownDokter(false);
                      }}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {d.nama}
                    </li>
                  ))
                )}
              </ul>
            )}
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

          {/* Tombol */}
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
