import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import DataPasien from "./pages/DataPasien";
import DataDokter from "./pages/DataDokter";
import DataLaporan from "./pages/DataLaporan";
import EditPasien from "./pages/EditPasien";
import TambahPasien from "./pages/TambahPasien";

function App() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            🏠 Klinik
          </h1>
          <div className="text-gray-600">Admin</div>
        </div>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pasien" element={<DataPasien />} />
          <Route path="/dokter" element={<DataDokter />} />
          <Route path="/laporan" element={<DataLaporan />} />
          <Route path="/pasien/edit/:id" element={<EditPasien />} />
          <Route path="/pasien/tambah" element={<TambahPasien />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
