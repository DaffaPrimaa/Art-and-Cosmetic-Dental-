import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Stethoscope,
  Package,
  FileText,
} from "lucide-react"; // 🆕 Import ikon lucide-react

const menuItems = [
  { label: "Dashboard", path: "/", icon: <LayoutDashboard size={18} /> },
  { label: "Data Pasien", path: "/pasien", icon: <Users size={18} /> },
  { label: "Rekam Medis", path: "/rekam-medis", icon: <ClipboardList size={18} /> },
  { label: "Data Dokter", path: "/dokter", icon: <Stethoscope size={18} /> },
  { label: "Data Alat", path: "/alat", icon: <Package size={18} /> },
  { label: "Laporan Pengunjung", path: "/laporan", icon: <FileText size={18} /> },
  { label: "Laporan Alat/Bahan", path: "/laporan-alat", icon: <FileText size={18} /> },
];

export default function Sidebar() {
  return (
    <div
      className="w-64 text-white flex flex-col shadow-xl"
      style={{ backgroundColor: "#0B2C5F" }}
    >
      {/* Header */}
      <div className="p-5 border-b border-white/20 text-center">
        <h1 className="text-xl font-bold leading-tight">
          <span className="text-2xl mr-1"></span> Art & Cosmetic
          <div className="text-sm font-light">Dental Clinic</div>
        </h1>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-white text-[#0B2C5F] font-semibold shadow-md"
                  : "text-white hover:bg-[#1A3C6E] hover:translate-x-1"
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer kecil (opsional) */}
      <div className="p-3 text-center text-xs text-gray-300 border-t border-white/20">
        © {new Date().getFullYear()} Art & Cosmetic
      </div>
    </div>
  );
}
