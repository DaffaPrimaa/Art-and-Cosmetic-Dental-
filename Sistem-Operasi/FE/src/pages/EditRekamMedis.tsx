import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

interface Pasien {
  id: number;
  nama: string;
}

interface Dokter {
  id: number;
  nama: string;
}

interface RekamMedisForm {
  tanggal: string;
  pasien_id: number;
  keluhan: string;
  dokter_id: number;
  diagnosa: string;
  tindakan: string;
}

const EditRekamMedis = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showNotif, setShowNotif] = useState(false);

  const [form, setForm] = useState<RekamMedisForm>({
    tanggal: "",
    pasien_id: 0,
    keluhan: "",
    dokter_id: 0,
    diagnosa: "",
    tindakan: "",
  });

  const [pasienList, setPasienList] = useState<Pasien[]>([]);
  const [dokterList, setDokterList] = useState<Dokter[]>([]);

  const [namaPasien, setNamaPasien] = useState("");
  const [namaDokter, setNamaDokter] = useState("");
  const [showDropdownPasien, setShowDropdownPasien] = useState(false);
  const [showDropdownDokter, setShowDropdownDokter] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rekamRes, pasienRes, dokterRes] = await Promise.all([
          fetch(`http://localhost:8000/rekam-medis/${id}`),
          fetch("http://localhost:8000/pasien"),
          fetch("http://localhost:8000/dokter"),
        ]);

        const rekamData = await rekamRes.json();
        const pasienData = await pasienRes.json();
        const dokterData = await dokterRes.json();

        setForm({
          tanggal: rekamData.tanggal,
          pasien_id: rekamData.pasien_id || 0,
          keluhan: rekamData.keluhan,
          dokter_id: rekamData.dokter_id || 0,
          diagnosa: rekamData.diagnosa,
          tindakan: rekamData.tindakan || "",
        });

        const pasien = pasienData.find((p: Pasien) => p.id === rekamData.pasien_id);
        const dokter = dokterData.find((d: Dokter) => d.id === rekamData.dokter_id);

        setNamaPasien(pasien?.nama || "");
        setNamaDokter(dokter?.nama || "");

        setPasienList(pasienData);
        setDokterList(dokterData);
      } catch (err) {
        console.error("Gagal fetch data:", err);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleNamaPasienChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNamaPasien(value);
    setShowDropdownPasien(true);
    const selected = pasienList.find((p) => p.nama.toLowerCase() === value.toLowerCase());
    setForm((prev) => ({
      ...prev,
      pasien_id: selected ? selected.id : 0,
    }));
  };

  const handleNamaDokterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNamaDokter(value);
    setShowDropdownDokter(true);
    const selected = dokterList.find((d) => d.nama.toLowerCase() === value.toLowerCase());
    setForm((prev) => ({
      ...prev,
      dokter_id: selected ? selected.id : 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.pasien_id || !form.dokter_id) {
      alert("Pasien dan Dokter wajib dipilih.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/rekam-medis/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setShowNotif(true);
        setTimeout(() => {
          setShowNotif(false);
          navigate("/rekam-medis");
        }, 1500);
      } else {
        console.error("Gagal update data");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

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

  return (
    <div className="relative mt-6">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-4">✏️ Edit Rekam Medis</h2>

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
            <input
              type="text"
              value={namaPasien}
              onChange={handleNamaPasienChange}
              onFocus={() => setShowDropdownPasien(true)}
              onBlur={() => setTimeout(() => setShowDropdownPasien(false), 150)}
              className="border w-full px-3 py-2 rounded"
              placeholder="Ketik nama pasien..."
              required
            />
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
            <input
              type="text"
              value={namaDokter}
              onChange={handleNamaDokterChange}
              onFocus={() => setShowDropdownDokter(true)}
              onBlur={() => setTimeout(() => setShowDropdownDokter(false), 150)}
              className="border w-full px-3 py-2 rounded"
              placeholder="Ketik nama dokter..."
              required
            />
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
              name="tindakan"
              value={form.tindakan}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded"
              placeholder="Masukkan tindakan"
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
