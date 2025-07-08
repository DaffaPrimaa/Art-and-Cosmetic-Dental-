import { NavLink } from "react-router-dom";

const menuItems = [
  { label: "Dashboard", path: "/" },
  { label: "Data Pasien", path: "/pasien" },
  { label: "Rekam Medis", path: "/rekam-medis" },
  { label: "Data Dokter", path: "/dokter" },
  { label: "Data Laporan", path: "/laporan" },
];

export default function Sidebar() {
  return (
    <div
      className="w-64 text-white flex flex-col"
      style={{ backgroundColor: "#0B2C5F" }}
    >
      <div className="p-4 border-b border-white/20">
        <h1 className="text-xl font-semibold leading-tight tracking-wide text-white">
          <span className="block text-lg">🦷</span>
          <span className="text-lg font-bold">Art</span>{" "}
          <span className="text-base font-light">and</span>{" "}
          <span className="text-lg font-bold">Cosmetic</span>{" "}
          <span className="text-lg">Dental Clinic</span>
        </h1>
      </div>

      <nav className="flex-1 p-2 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block px-4 py-2 rounded transition ${
                isActive
                  ? "bg-white text-[#0B2C5F] font-semibold"
                  : "hover:bg-[#1A3C6E] text-white"
              }`
            }
          >
            📁 {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
