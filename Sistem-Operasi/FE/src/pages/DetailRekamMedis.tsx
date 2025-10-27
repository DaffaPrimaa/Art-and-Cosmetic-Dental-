import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { ChevronDown, Check } from "lucide-react";
import jsPDF from "jspdf"; // Pastikan sudah di-import

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
      if (!target.closest(".select-container")) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);
  
  // =================================================================
  // == FUNGSI PDF DENGAN FONT MIX (Besar di Header/Total, Kecil di rincian) ==
  // =================================================================
  const handleGeneratePdf = () => {
    if (!data) return;

    const doc = new jsPDF("portrait", "mm", [57, 150]); 
    const margin = 3; 
    const docWidth = doc.internal.pageSize.getWidth();
    let y = 10; 
    const lineHeight = 4.5; // Kembalikan line height normal
    const smallLineHeight = 4; // Line height untuk font kecil
    const divider = "------------------------------------"; // Disesuaikan sedikit

    doc.setFont("Courier", "normal");
    
    // === HEADER KLINIK (Ukuran BESAR) ===
    doc.setFont("Courier", "bold");
    doc.setFontSize(11); // 👈 Ukuran font BESAR
    doc.text("Art & Cosmetic", docWidth / 2, y, { align: "center" });
    y += lineHeight;
    doc.text("Dental Clinic", docWidth / 2, y, { align: "center" });
    y += lineHeight;
    
    doc.setFont("Courier", "normal");
    doc.setFontSize(9); // 👈 Ukuran font BESAR (level 2)
    doc.text("Jl. Pasir Salam Asri No.7B", docWidth / 2, y, { align: "center" });
    y += lineHeight;
    doc.text("Regol - Bandung", docWidth / 2, y, { align: "center" });
    y += lineHeight;
    doc.text("0813 1564 1765", docWidth / 2, y, { align: "center" });
    y += 5; // Spasi ekstra

    // === GARIS PEMISAH (Ukuran KECIL) ===
    doc.setFontSize(7); // 👈 Ukuran font KECIL
    doc.text(divider, docWidth / 2, y, { align: "center" });
    y += 4;

    // === INFO PASIEN (Ukuran KECIL) ===
    doc.setFontSize(8); // 👈 Ukuran font KECIL
    doc.setFont("Courier", "normal");
    
    const printRow = (label: string, value: string) => {
      const valueX = 18; 
      const maxWidth = docWidth - valueX - margin;
      
      const textLines = doc.splitTextToSize(value, maxWidth);
      
      doc.text(label, margin, y);
      doc.text(`: ${textLines[0]}`, valueX, y);
      
      if (textLines.length > 1) {
        for (let i = 1; i < textLines.length; i++) {
          y += smallLineHeight; // Pakai line height kecil
          doc.text(textLines[i], valueX + 2, y); 
        }
      }
      y += smallLineHeight; // Pakai line height kecil
    };

    printRow("Tanggal", data.tanggal);
    printRow("Pasien", data.pasien);
    printRow("Dokter", data.dokter);
    y += 3; 

    // === GARIS PEMISAH (Ukuran KECIL) ===
    doc.setFontSize(7); // 👈 Ukuran font KECIL
    doc.text(divider, docWidth / 2, y, { align: "center" });
    y += 4;
    
    // === DETAIL TINDAKAN (Ukuran KECIL) ===
    doc.setFontSize(8); // 👈 Ukuran font KECIL
    doc.setFont("Courier", "normal");
    printRow("Keluhan", data.keluhan);
    printRow("Diagnosa", data.diagnosa);
    printRow("Tindakan", data.tindakan);
    const sBahan = selectedBahan.length > 0 ? selectedBahan.join(", ") : "-";
    printRow("Bahan", sBahan);
    y += 3;

    // === GARIS PEMISAH (Ukuran KECIL) ===
    doc.setFontSize(7); // 👈 Ukuran font KECIL
    doc.text(divider, docWidth / 2, y, { align: "center" });
    y += 4;

    // === RINCIAN BIAYA (Ukuran KECIL) ===
    doc.setFontSize(8); // 👈 Ukuran font KECIL
    doc.setFont("Courier", "normal");
    
    const printCost = (label: string, value: string) => {
      const valueString = `Rp ${formatNumber(value)}`;
      doc.text(label, margin, y);
      doc.text(valueString, docWidth - margin, y, { align: "right" });
      y += smallLineHeight; // Pakai line height kecil
    };

    printCost("Biaya Tindakan", biayaTindakan);
    printCost("Biaya Bahan", biayaBahan);
    printCost("Biaya Obat", biayaObat);
    y += 3;

    // === GARIS PEMISAH (Ukuran KECIL) ===
    doc.setFontSize(7); // 👈 Ukuran font KECIL
    doc.text(divider, docWidth / 2, y, { align: "center" });
    y += 5; // Spasi ekstra sebelum total

    // === TOTAL (Ukuran BESAR) ===
    doc.setFont("Courier", "bold");
    doc.setFontSize(11); // 👈 Ukuran font BESAR
    doc.text("TOTAL:", margin, y);
    const totalString = `Rp ${formatNumber(totalBiaya)}`;
    doc.text(totalString, docWidth - margin, y, { align: "right" });
    y += 5; // Spasi ekstra

    // === GARIS PEMISAH (Ukuran KECIL) ===
    doc.setFontSize(7); // 👈 Ukuran font KECIL
    doc.setFont("Courier", "normal");
    doc.text(divider, docWidth / 2, y, { align: "center" });
    y += 4;

    // === FOOTER (Ukuran KECIL) ===
    doc.setFontSize(7); // 👈 Ukuran font KECIL
    doc.text("Terima kasih atas kunjungannya", docWidth / 2, y, { align: "center" });


    // =======================================================
    // 👇 PERUBAHAN DI SINI: Atur Judul/Nama File PDF
    // =======================================================
    
    // Ganti '/' dengan '-' agar aman untuk nama file
    const safeTanggal = data.tanggal.replace(/\//g, '-');
    const docTitle = `${data.pasien} || ${safeTanggal}`;
    
    // Set judul PDF. Saat dibuka di tab baru, ini akan jadi judul tab.
    // Saat disimpan (Save As), browser BIASANYA akan menyarankan nama ini.
    doc.setProperties({
      title: docTitle
    });

    // Buka PDF di tab baru
    doc.output("dataurlnewwindow");
  };
  // =================================================================
  // == AKHIR DARI FUNGSI PDF BARU ==
  // =================================================================


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
      {/* ... (Kode Notifikasi tidak berubah) ... */}
      {showNotif && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-700 px-6 py-3 rounded-lg shadow-md flex items-center gap-2 z-50 animate-bounce">
          <FaCheckCircle className="text-green-600" />
          <span>Total biaya berhasil disimpan</span>
        </div>
      )}

      {/* Area ini tetap ada untuk tampilan di web */}
      <div id="printArea" className="space-y-6">
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-bold mb-6">
            Invoice Pembayaran Pasien
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 text-sm">
            {/* ... (Info Pasien tidak berubah) ... */}
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
          
          {/* ... (Dropdown Bahan tidak berubah) ... */}
          <div className="grid grid-cols-1 gap-4 mt-6 text-sm">
            <div className="flex items-start gap-2">
              <label className="font-semibold w-40 mt-2">
                Penggunaan Bahan:
              </label>
              <div className="relative w-full select-container">
                <button
                  type="button"
                  className="relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-300 transition-colors"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  aria-expanded={isDropdownOpen}
                >
                  <div className="flex flex-wrap gap-1 w-full">
                    {selectedBahan.length === 0 ? (
                      <span className="text-gray-500">Pilih bahan...</span>
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
                      className={`w-3.5 h-3.5 text-gray-500 ${isDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </div>
                </button>
                {isDropdownOpen && (
                  <div className="absolute mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto shadow-lg">
                    {listBahan.map(bahan => (
                      <div
                        key={bahan.id}
                        className="py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg"
                        onClick={() => handleBahanSelect(bahan.nama)}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="font-medium">{bahan.nama}</span>
                          <span className={`${selectedBahan.includes(bahan.nama) ? "opacity-100" : "opacity-0"}`}>
                            <Check className="w-3.5 h-3.5 text-blue-600" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* ... (Rincian Biaya tidak berubah) ... */}
          <div className="grid grid-cols-1 gap-4 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <label className="font-semibold w-40">Biaya Tindakan:</label>
              <input
                type="text"
                className="border rounded px-2 py-1 w-full"
                value={formatNumber(biayaTindakan)}
                onChange={e => setBiayaTindakan(parseNumber(e.target.value).toString())}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold w-40">Biaya Bahan:</label>
              <input
                type="text"
                className="border rounded px-2 py-1 w-full"
                value={formatNumber(biayaBahan)}
                onChange={e => setBiayaBahan(parseNumber(e.target.value).toString())}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold w-40">Biaya Obat:</label>
              <input
                type="text"
                className="border rounded px-2 py-1 w-full"
                value={formatNumber(biayaObat)}
                onChange={e => setBiayaObat(parseNumber(e.target.value).toString())}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold w-40">Total Biaya:</label>
              <span className="text-gray-700 font-semibold">
                Rp {formatNumber(totalBiaya)}
              </span>
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
          onClick={handleGeneratePdf} // Tetap panggil fungsi PDF
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Cetak
        </button>
      </div>
    </div>
  );
};

export default DetailRekamMedis;