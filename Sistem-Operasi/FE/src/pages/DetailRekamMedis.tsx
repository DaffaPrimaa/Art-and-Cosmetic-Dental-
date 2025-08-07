import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

interface RekamMedis {
  pasien: string;
  keluhan: string;
  tanggal: string;
  dokter: string;
  diagnosa: string;
  tindakan: string;
  biaya_tindakan?: number; // ← sebelumnya biaya_dokter
  biaya_bahan?: number;    // ← sebelumnya biaya_tindakan
  biaya_obat?: number;
  total_biaya?: number;
}

const DetailRekamMedis = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [data, setData] = useState<RekamMedis | null>(null);
  const [loading, setLoading] = useState(true);

  const [biayaTindakan, setBiayaTindakan] = useState("");
  const [biayaBahan, setBiayaBahan] = useState("");
  const [biayaObat, setBiayaObat] = useState("");

  const [showNotif, setShowNotif] = useState(false);

  const formatNumber = (value: string | number) => {
    const num = typeof value === "string" ? parseInt(value) || 0 : value;
    return new Intl.NumberFormat("id-ID").format(num);
  };

  const parseNumber = (value: string) => {
    return parseInt(value.replace(/\./g, "")) || 0;
  };

  const totalBiaya =
    parseNumber(biayaTindakan) +
    parseNumber(biayaBahan) +
    parseNumber(biayaObat);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:8000/rekam-medis/${id}`);
        if (!res.ok) throw new Error("Gagal ambil data");
        const result = await res.json();
        setData(result);

        if (result.biaya_tindakan)
          setBiayaTindakan(result.biaya_tindakan.toString());
        if (result.biaya_bahan)
          setBiayaBahan(result.biaya_bahan.toString());
        if (result.biaya_obat)
          setBiayaObat(result.biaya_obat.toString());
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

  const handleSave = async () => {
    if (!id) return;

    const payload = {
      biaya_tindakan: parseNumber(biayaTindakan),
      biaya_bahan: parseNumber(biayaBahan),
      biaya_obat: parseNumber(biayaObat),
      total_biaya: totalBiaya,
    };

    try {
      const res = await fetch(`http://localhost:8000/rekam-medis/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Gagal menyimpan data");

      setShowNotif(true);
      setTimeout(() => {
        setShowNotif(false);
      }, 1500);
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menyimpan.");
    }
  };

  if (loading) return <div className="mt-6">Loading...</div>;
  if (!data)
    return <div className="mt-6 text-red-500">Data tidak ditemukan.</div>;

  return (
    <div className="mt-6 space-y-6">
      {/* ✅ Notifikasi berhasil */}
      {showNotif && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-700 px-6 py-3 rounded-lg shadow-md flex items-center gap-2 z-50 animate-bounce">
          <FaCheckCircle className="text-green-600" />
          <span>Total biaya berhasil disimpan</span>
        </div>
      )}

      {/* Area Cetak */}
      <div id="printArea" className="space-y-6">
        <div className="bg-white rounded shadow p-6 print:shadow-none print:border print:rounded-none print:p-0 print:mt-0 print:text-black">
          {/* Header Klinik */}
          <div className="hidden print:block border-b pb-4 mb-4">
            <h1 className="text-2xl font-bold text-center">
              Art and Cosmetic Dental Clinic
            </h1>
            <p className="text-center text-sm">
              Jl. Pasir Salam Asri No.7B Blok D, Pasirluyu, Kec. Regol, Kota
              Bandung, Jawa Barat 40254
            </p>
            <p className="text-center text-sm">
              artandcosmeticdentalclinic@gmail.com
            </p>
            <p className="text-center text-sm">0813 1564 1765</p>
          </div>

          <h2 className="text-xl font-bold mb-6 print:text-center print:underline print:mb-4">
            Invoice Pembayaran Pasien
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 text-sm print:text-sm print:px-6">
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
              <p className="mb-2">
                <span className="font-semibold">Diagnosa:</span>{" "}
                <span className="text-gray-700">{data.diagnosa}</span>
              </p>
              <p>
                <span className="font-semibold">Tindakan:</span>{" "}
                <span className="text-gray-700">{data.tindakan}</span>
              </p>
            </div>
          </div>

          {/* Rincian Biaya */}
          <div className="grid grid-cols-1 gap-4 mt-6 text-sm print:px-6 print:mt-8">
            <div className="flex items-center gap-2 print:gap-4">
              <label className="font-semibold w-40 print:w-48">
                Biaya Tindakan:
              </label>
              <input
                type="text"
                className="border rounded px-2 py-1 w-full print:hidden"
                value={formatNumber(biayaTindakan)}
                onChange={(e) =>
                  setBiayaTindakan(parseNumber(e.target.value).toString())
                }
              />
              <span className="hidden print:block">
                Rp {formatNumber(biayaTindakan)}
              </span>
            </div>
            <div className="flex items-center gap-2 print:gap-4">
              <label className="font-semibold w-40 print:w-48">
                Biaya Bahan:
              </label>
              <input
                type="text"
                className="border rounded px-2 py-1 w-full print:hidden"
                value={formatNumber(biayaBahan)}
                onChange={(e) =>
                  setBiayaBahan(parseNumber(e.target.value).toString())
                }
              />
              <span className="hidden print:block">
                Rp {formatNumber(biayaBahan)}
              </span>
            </div>
            <div className="flex items-center gap-2 print:gap-4">
              <label className="font-semibold w-40 print:w-48">
                Biaya Obat:
              </label>
              <input
                type="text"
                className="border rounded px-2 py-1 w-full print:hidden"
                value={formatNumber(biayaObat)}
                onChange={(e) =>
                  setBiayaObat(parseNumber(e.target.value).toString())
                }
              />
              <span className="hidden print:block">
                Rp {formatNumber(biayaObat)}
              </span>
            </div>
            <div className="flex items-center gap-2 print:gap-4">
              <label className="font-semibold w-40 print:w-48">
                Total Biaya:
              </label>
              <span className="text-gray-700 font-semibold">
                Rp {formatNumber(totalBiaya)}
              </span>
            </div>
          </div>

          {/* Tanda Tangan */}
          <div className="hidden print:flex justify-between mt-12 px-6">
            <div className="text-center">
              <p className="mb-16">Petugas Klinik</p>
              <p className="border-t border-black w-40 mx-auto"></p>
            </div>
          </div>
        </div>
      </div>

      {/* Tombol Aksi */}
      <div className="flex gap-3 print:hidden">
        <button
          onClick={() => navigate("/rekam-medis")}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Kembali
        </button>
        <button
          onClick={handleSave}
          className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600"
        >
          Simpan
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
