import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

interface RekamMedis {
  pasien: string;
  keluhan: string;
  tanggal: string;
  dokter: string;
  diagnosa: string;
}

const DetailRekamMedis = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [data, setData] = useState<RekamMedis | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch data dari backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:8000/rekam-medis/${id}`);
        if (!res.ok) throw new Error("Gagal ambil data");
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error(err);
        alert("Gagal mengambil data rekam medis");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handlePrint = () => {
    const printContents = document.getElementById("printArea")?.innerHTML;
    const originalContents = document.body.innerHTML;

    if (printContents) {
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };

  if (loading) return <div className="mt-6">Loading...</div>;
  if (!data) return <div className="mt-6 text-red-500">Data tidak ditemukan.</div>;

  return (
    <div className="mt-6 space-y-6">
      {/* Area Cetak */}
      <div id="printArea" className="space-y-6">
        <div className="bg-white rounded shadow p-6 print:shadow-none print:border print:rounded-none">
          <h2 className="text-xl font-bold mb-6">🩺 Detail Data Rekam Medis</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 text-sm">
            <div>
              <p className="mb-2">
                <span className="font-semibold">Tanggal Periksa:</span>{" "}
                <span className="text-gray-700">{data.tanggal}</span>
              </p>
              <p className="mb-2">
                <span className="font-semibold">Pasien:</span>{" "}
                <span className="text-gray-700">{data.pasien}</span>
              </p>
              <p>
                <span className="font-semibold">Dokter:</span>{" "}
                <span className="text-gray-700">{data.dokter}</span>
              </p>
            </div>

            <div>
              <p className="mb-2">
                <span className="font-semibold">Keluhan Pasien:</span>{" "}
                <span className="text-gray-700">{data.keluhan}</span>
              </p>
              <p>
                <span className="font-semibold">Diagnosa:</span>{" "}
                <span className="text-gray-700">{data.diagnosa}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tombol aksi */}
      <div className="flex gap-3 print:hidden">
        <button
          onClick={() => navigate("/rekam-medis")}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Kembali
        </button>
        <button
          onClick={handlePrint}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Cetak
        </button>
      </div>
    </div>
  );
};

export default DetailRekamMedis;
