import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import DataPasien from "./pages/DataPasien";
import DataDokter from "./pages/DataDokter";
import DataLaporan from "./pages/DataLaporan";
import EditPasien from "./pages/EditPasien";
import EditDokter from "./pages/EditDokter";
import TambahPasien from "./pages/TambahPasien";
import TambahDokter from "./pages/TambahDokter";
import RekamMedis from "./pages/RekamMedis";

function App() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            🏠 Klinik
          </h1>
        </div>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pasien" element={<DataPasien />} />
          <Route path="/dokter" element={<DataDokter />} />
          <Route path="/laporan" element={<DataLaporan />} />
          <Route path="/pasien/edit/:id" element={<EditPasien />} />
          <Route path="/dokter/edit/:id" element={<EditDokter />} />
          <Route path="/pasien/tambah" element={<TambahPasien />} />
          <Route path="/dokter/tambah" element={<TambahDokter />} />
          <Route path="/rekam-medis" element={<RekamMedis />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
