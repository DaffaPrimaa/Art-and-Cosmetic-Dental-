import { useEffect, useState } from "react";
import Card from "../components/Card";
import Chart from "../components/Chart";

export default function Dashboard() {
  const [totalPasien, setTotalPasien] = useState(0);
  const [totalDokter, setTotalDokter] = useState(0);

  useEffect(() => {
    // Ambil data pasien
    fetch("http://localhost:8000/pasien/")
      .then((res) => res.json())
      .then((data) => setTotalPasien(data.length))
      .catch((err) => console.error("Error fetching pasien:", err));

    // Ambil data dokter
    fetch("http://localhost:8000/dokter/")
      .then((res) => res.json())
      .then((data) => setTotalDokter(data.length))
      .catch((err) => console.error("Error fetching dokter:", err));
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Card title="Total Pasien" value={`${totalPasien}`} color="#0B2C5F" icon="🧑‍⚕️" />
        <Card title="Total Dokter" value={`${totalDokter}`} color="#3EC6D3" icon="👨‍⚕️" />
      </div>
      <Chart />
    </>
  );
}
