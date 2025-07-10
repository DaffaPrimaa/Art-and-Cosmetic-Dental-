import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import DataPasien from "./pages/DataPasien";
import DataDokter from "./pages/DataDokter";
import DataLaporan from "./pages/DataLaporan";
import DataAlat from "./pages/DataAlat";
import EditPasien from "./pages/EditPasien";
import EditDokter from "./pages/EditDokter";
import EditRekamMedis from "./pages/EditRekamMedis";
import EditAlat from "./pages/EditAlat";
import TambahPasien from "./pages/TambahPasien";
import TambahDokter from "./pages/TambahDokter";
import TambahRekamMedis from "./pages/TambahRekamMedis";
import TambahAlat from "./pages/TambahAlat";
import RekamMedis from "./pages/RekamMedis";
import DetailRekamMedis from "./pages/DetailRekamMedis";

function App() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            🏠 Klinik
          </h1>
        </div>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pasien" element={<DataPasien />} />
          <Route path="/dokter" element={<DataDokter />} />
          <Route path="/rekam-medis" element={<RekamMedis />} />
          <Route path="/alat" element={<DataAlat />} />
          <Route path="/laporan" element={<DataLaporan />} />
          <Route path="/pasien/edit/:id" element={<EditPasien />} />
          <Route path="/dokter/edit/:id" element={<EditDokter />} />
          <Route path="/rekam-medis/edit/:id" element={<EditRekamMedis />} />
          <Route path="/alat/edit/:id" element={<EditAlat />} />
          <Route path="/pasien/tambah" element={<TambahPasien />} />
          <Route path="/dokter/tambah" element={<TambahDokter />} />
          <Route path="/rekam-medis/tambah" element={<TambahRekamMedis />} />
          <Route path="/alat/tambah" element={<TambahAlat />} />
          <Route path="/rekam-medis/detail/:id" element={<DetailRekamMedis />} />
          <Route path="*" element={<div>Halaman tidak ditemukan</div>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
