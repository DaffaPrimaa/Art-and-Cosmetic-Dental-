import { useNavigate } from "react-router-dom";

const DetailRekamMedis = () => {
  const navigate = useNavigate();

  const data = {
    pasien: "Pasien 6",
    keluhan: "Gatal pada seluruh tubuh dan panas",
    tanggal: "11 Juni 2020",
    dokter: "Dokter SourceCodeKu.com",
    diagnosa: "Menderita penyakit menular",
    biayaDokter: 10000,
    biayaObat: 30000,
    obat: "Obat SourceCodeKu",
  };

  const totalHarga = data.biayaDokter + data.biayaObat;

  const handlePrint = () => {
    const printContents = document.getElementById("printArea")?.innerHTML;
    const originalContents = document.body.innerHTML;

    if (printContents) {
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload(); // reload untuk kembalikan tampilan semula
    }
  };

  return (
    <div className="mt-6 space-y-6">
      {/* Area yang akan dicetak */}
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

        <div className="rounded shadow overflow-hidden print:shadow-none print:border print:rounded-none">
          <div className="bg-[#0B2C5F] text-white px-6 py-3 print:bg-white print:text-black print:border-b">
            <h3 className="font-semibold">Rincian Biaya</h3>
          </div>
          <div className="bg-white p-6 text-sm space-y-4 print:p-4">
            <div className="flex justify-between">
              <span>Biaya Dokter</span>
              <span>Rp. {data.biayaDokter.toLocaleString("id-ID")},00</span>
            </div>
            <div>
              <span className="font-semibold">Biaya Obat</span>
              <div className="flex justify-between mt-1 pl-4">
                <span>+ {data.obat}</span>
                <span>Rp. {data.biayaObat.toLocaleString("id-ID")},00</span>
              </div>
            </div>
            <hr />
            <div className="flex justify-between font-semibold pt-2">
              <span>Total Harga</span>
              <span>Rp. {totalHarga.toLocaleString("id-ID")},00</span>
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
