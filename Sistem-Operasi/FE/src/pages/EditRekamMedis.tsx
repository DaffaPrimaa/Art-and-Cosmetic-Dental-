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
  pasien_id: number | "";
  keluhan: string;
  dokter_id: number | "";
  diagnosa: string;
}

const EditRekamMedis = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showNotif, setShowNotif] = useState(false);
  const [form, setForm] = useState<RekamMedisForm>({
    tanggal: "",
    pasien_id: "",
    keluhan: "",
    dokter_id: "",
    diagnosa: "",
  });

  const [pasienList, setPasienList] = useState<Pasien[]>([]);
  const [dokterList, setDokterList] = useState<Dokter[]>([]);

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
          pasien_id: rekamData.pasien_id || "",
          keluhan: rekamData.keluhan,
          dokter_id: rekamData.dokter_id || "",
          diagnosa: rekamData.diagnosa,
        });

        setPasienList(pasienData);
        setDokterList(dokterData);
      } catch (err) {
        console.error("Gagal fetch data:", err);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: name.includes("_id")
        ? value === "" ? "" : parseInt(value)
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <div className="relative mt-6">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-4">✏️ Edit Rekam Medis</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Tanggal Periksa</label>
            <input
              type="date"
              name="tanggal"
              value={form.tanggal}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Pasien</label>
            <select
              name="pasien_id"
              value={form.pasien_id}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded"
              required
            >
              <option value="">-- Pilih Pasien --</option>
              {pasienList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nama}
                </option>
              ))}
            </select>
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
            <select
              name="dokter_id"
              value={form.dokter_id}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded"
              required
            >
              <option value="">-- Pilih Dokter --</option>
              {dokterList.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nama}
                </option>
              ))}
            </select>
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
