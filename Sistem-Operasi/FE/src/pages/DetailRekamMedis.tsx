import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { ChevronDown, Check } from "lucide-react";

interface RekamMedis {
  pasien: string;
  keluhan: string;
  tanggal: string;
  dokter: string;
  diagnosa: string;
  tindakan: string;
  penggunaan_bahan?: string[];
  biaya_tindakan?: number;
  biaya_bahan?: number;
  biaya_obat?: number;
  total_biaya?: number;
}

interface Bahan {
  id: number;
  nama: string;
}

const DetailRekamMedis = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [data, setData] = useState<RekamMedis | null>(null);
  const [listBahan, setListBahan] = useState<Bahan[]>([]);
  const [selectedBahan, setSelectedBahan] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  const handleBahanSelect = (bahanNama: string) => {
    setSelectedBahan(prev => {
      if (prev.includes(bahanNama)) {
        return prev.filter(item => item !== bahanNama);
      } else {
        return [...prev, bahanNama];
      }
    });
  };

  // 🔹 Ambil daftar bahan dari DB
  useEffect(() => {
    const fetchBahan = async () => {
      try {
        const res = await fetch("http://localhost:8000/alat");
        if (!res.ok) throw new Error("Gagal ambil data alat");
        const result = await res.json();
        setListBahan(result);
      } catch (err) {
        console.error(err);
        alert("Gagal mengambil daftar bahan");
      }
    };

    fetchBahan();
  }, []);

  // 🔹 Ambil data rekam medis
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

        if (result.penggunaan_bahan)
          setSelectedBahan(result.penggunaan_bahan);
      } catch (err) {
        console.error(err);
        alert("Gagal mengambil data rekam medis");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.select-container')) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

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
      penggunaan_bahan: selectedBahan,
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

          {/* 🔹 Penggunaan Bahan dengan Dropdown Kustom */}
          <div className="grid grid-cols-1 gap-4 mt-6 text-sm print:px-6">
            <div className="flex items-start gap-2 print:gap-4">
              <label className="font-semibold w-40 print:w-48 mt-2">
                Penggunaan Bahan:
              </label>
              
              <div className="relative w-full print:hidden select-container">
                <button
                  type="button"
                  className="relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-300 transition-colors"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  aria-expanded={isDropdownOpen}
                >
                  <div className="flex flex-wrap gap-1 w-full">
                    {selectedBahan.length === 0 ? (
                      <span className="text-gray-500">Pilih bahan yang digunakan...</span>
                    ) : (
                      selectedBahan.map((bahan, index) => (
                        <span 
                          key={index} 
                          className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full border border-blue-200"
                        >
                          {bahan}
                        </span>
                      ))
                    )}
                  </div>
                  <div className="absolute top-1/2 end-3 -translate-y-1/2">
                    <ChevronDown 
                      className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${
                        isDropdownOpen ? 'rotate-180' : ''
                      }`} 
                    />
                  </div>
                </button>

                {isDropdownOpen && (
                  <div className="absolute mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto shadow-lg ring-1 ring-black ring-opacity-5">
                    {listBahan.map((bahan) => (
                      <div
                        key={bahan.id}
                        className="py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-none focus:bg-gray-100 transition-colors"
                        onClick={() => handleBahanSelect(bahan.nama)}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="font-medium">{bahan.nama}</span>
                          <span className={`transition-opacity ${selectedBahan.includes(bahan.nama) ? 'opacity-100' : 'opacity-0'}`}>
                            <Check className="w-3.5 h-3.5 text-blue-600" />
                          </span>
                        </div>
                      </div>
                    ))}
                    {listBahan.length === 0 && (
                      <div className="py-2 px-4 text-sm text-gray-500">
                        Tidak ada bahan tersedia
                      </div>
                    )}
                  </div>
                )}
              </div>

              <span className="hidden print:block">
                {selectedBahan.join(", ")}
              </span>
            </div>
          </div>

          {/* Rincian Biaya */}
          <div className="grid grid-cols-1 gap-4 mt-6 text-sm print:px-6">
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