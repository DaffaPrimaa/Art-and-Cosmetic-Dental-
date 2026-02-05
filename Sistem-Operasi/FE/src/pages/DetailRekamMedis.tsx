import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { ChevronDown, Check } from "lucide-react";
import jsPDF from "jspdf";

// ---------------------------------------------------------
// FIX TYPE: Agar tidak error di TypeScript/ESLint
// ---------------------------------------------------------
type jsPDFCustom = jsPDF & {
  setLineDash: (dashArray: number[], dashPhase: number) => void;
};

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
    setSelectedBahan((prev) => {
      if (prev.includes(bahanNama)) {
        return prev.filter((item) => item !== bahanNama);
      } else {
        return [...prev, bahanNama];
      }
    });
  };

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:8000/rekam-medis/${id}`);
        if (!res.ok) throw new Error("Gagal ambil data");
        const result = await res.json();
        setData(result);

        if (result.biaya_tindakan)
          setBiayaTindakan(result.biaya_tindakan.toString());
        if (result.biaya_bahan) setBiayaBahan(result.biaya_bahan.toString());
        if (result.biaya_obat) setBiayaObat(result.biaya_obat.toString());
        if (result.penggunaan_bahan) setSelectedBahan(result.penggunaan_bahan);
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
  // == FUNGSI PDF (FONT LEBIH BESAR & JELAS) ==
  // =================================================================
  const handleGeneratePdf = () => {
    if (!data) return;

    // Setting kertas panjang (roll)
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [58, 297], // Tinggi dibuat cukup panjang
    });

    const margin = 2; // Margin sedikit saja
    const docWidth = 58;
    const contentWidth = docWidth - margin * 2;
    let y = 6;

    // Helper Garis Putus-putus
    const drawLine = () => {
      y += 3; // Jarak agak jauh dikit biar ga nempel
      (doc as jsPDFCustom).setLineDash([1, 1], 0);
      doc.setDrawColor(0, 0, 0);
      doc.line(margin, y, docWidth - margin, y);
      (doc as jsPDFCustom).setLineDash([], 0);
      y += 5; // Jarak setelah garis
    };

    // Helper Garis Total (Lurus)
    const drawSolidLine = () => {
      y += 3;
      doc.setLineWidth(0.5);
      doc.line(margin, y, docWidth - margin, y);
      y += 5;
    };

    // === 1. HEADER (FONT SANGAT BESAR 14pt) ===
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14); // Diperbesar
    doc.text("Art & Cosmetic", docWidth / 2, y, { align: "center" });
    y += 6;

    doc.setFontSize(12); // Diperbesar
    doc.text("Dental Clinic", docWidth / 2, y, { align: "center" });
    y += 6;

    doc.setFontSize(9); // Alamat diperbesar sedikit jadi 9pt
    doc.setFont("helvetica", "normal");
    doc.text("Jl. Pasir Salam Asri No.7B", docWidth / 2, y, {
      align: "center",
    });
    y += 4;
    doc.text("Regol - Bandung", docWidth / 2, y, { align: "center" });
    y += 4;
    doc.text("0813 1564 1765", docWidth / 2, y, { align: "center" });

    drawLine();

    // === 2. INFO PASIEN (FONT BESAR 11pt) ===
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11); // Ukuran standar tulisan dokumen

    const printInfo = (label: string, value: string) => {
      doc.text(label, margin, y);

      const valueX = margin + 18; // Geser dikit karena font makin besar

      doc.setFont("helvetica", "normal");
      const textLines = doc.splitTextToSize(
        `: ${value}`,
        docWidth - valueX - margin,
      );
      doc.text(textLines, valueX, y);

      // Jarak antar baris diperlebar jadi 5
      y += textLines.length * 5 + 1;
      doc.setFont("helvetica", "bold");
    };

    printInfo("Tgl", data.tanggal);
    printInfo("Pasien", data.pasien);
    printInfo("Dokter", data.dokter);

    drawLine();

    // === 3. DETAIL MEDIS (FONT 11pt) ===
    doc.setFontSize(11); // Konsisten 11pt

    const printDetail = (label: string, value: string) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, margin, y);
      y += 5; // Jarak judul ke isi

      doc.setFont("helvetica", "normal");
      const val = value ? value : "-";
      const lines = doc.splitTextToSize(val, contentWidth);
      doc.text(lines, margin, y);
      y += lines.length * 5 + 3; // Jarak antar section lebih lega
    };

    printDetail("Diagnosa", data.diagnosa);
    printDetail("Tindakan", data.tindakan);

    const sBahan = selectedBahan.length > 0 ? selectedBahan.join(", ") : "-";
    printDetail("Bahan", sBahan);

    drawLine();

    // === 4. BIAYA (FONT 11pt) ===
    doc.setFont("helvetica", "normal");

    const printCost = (label: string, value: string) => {
      const valRp = `Rp ${formatNumber(value)}`;
      doc.text(label, margin, y);
      doc.text(valRp, docWidth - margin, y, { align: "right" });
      y += 5; // Jarak antar baris harga
    };

    if (parseNumber(biayaTindakan) > 0) printCost("Jasa Medis", biayaTindakan);
    if (parseNumber(biayaBahan) > 0) printCost("Biaya Bahan", biayaBahan);
    if (parseNumber(biayaObat) > 0) printCost("Biaya Obat", biayaObat);

    drawSolidLine();

    // === 5. TOTAL (FONT SANGAT BESAR 14pt) ===
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14); // Diperbesar biar mantap
    doc.text("TOTAL", margin, y);
    doc.text(`Rp ${formatNumber(totalBiaya)}`, docWidth - margin, y, {
      align: "right",
    });
    y += 10;

    // === 6. FOOTER (FONT 9pt) ===
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("* Simpan struk ini sebagai", docWidth / 2, y, {
      align: "center",
    });
    y += 5;
    doc.text("bukti pembayaran yang sah *", docWidth / 2, y, {
      align: "center",
    });
    y += 5;
    doc.text("Terima Kasih", docWidth / 2, y, { align: "center" });

    // === SPASI AKHIR AMAN ===
    y += 20;
    doc.text(".", margin, y); // Titik pancingan scroll

    // Finalisasi
    const safeTanggal = data.tanggal.replace(/\//g, "-");
    const docTitle = `STRUK-${data.pasien}-${safeTanggal}`;
    doc.setProperties({ title: docTitle });
    window.open(doc.output("bloburl"), "_blank");
  };
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
      {showNotif && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-700 px-6 py-3 rounded-lg shadow-md flex items-center gap-2 z-50 animate-bounce">
          <FaCheckCircle className="text-green-600" />
          <span>Total biaya berhasil disimpan</span>
        </div>
      )}

      {/* Tampilan Web (Form Input) */}
      <div id="printArea" className="space-y-6">
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-bold mb-6">Invoice Pembayaran Pasien</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 text-sm">
            <div>
              <p className="mb-2">
                <span className="font-semibold">Tanggal:</span>{" "}
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
                <span className="font-semibold">Keluhan:</span>{" "}
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
                    {listBahan.map((bahan) => (
                      <div
                        key={bahan.id}
                        className="py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg"
                        onClick={() => handleBahanSelect(bahan.nama)}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="font-medium">{bahan.nama}</span>
                          <span
                            className={`${selectedBahan.includes(bahan.nama) ? "opacity-100" : "opacity-0"}`}
                          >
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

          <div className="grid grid-cols-1 gap-4 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <label className="font-semibold w-40">Biaya Tindakan:</label>
              <input
                type="text"
                className="border rounded px-2 py-1 w-full"
                value={formatNumber(biayaTindakan)}
                onChange={(e) =>
                  setBiayaTindakan(parseNumber(e.target.value).toString())
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold w-40">Biaya Bahan:</label>
              <input
                type="text"
                className="border rounded px-2 py-1 w-full"
                value={formatNumber(biayaBahan)}
                onChange={(e) =>
                  setBiayaBahan(parseNumber(e.target.value).toString())
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold w-40">Biaya Obat:</label>
              <input
                type="text"
                className="border rounded px-2 py-1 w-full"
                value={formatNumber(biayaObat)}
                onChange={(e) =>
                  setBiayaObat(parseNumber(e.target.value).toString())
                }
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
          onClick={handleGeneratePdf}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Cetak Struk
        </button>
      </div>
    </div>
  );
};

export default DetailRekamMedis;
