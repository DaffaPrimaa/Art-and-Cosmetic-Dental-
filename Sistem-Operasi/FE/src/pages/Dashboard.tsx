import Card from "../components/Card";
import Chart from "../components/Chart";

export default function Dashboard() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Card title="Total Pasien" value="7" color="#0B2C5F" icon="🧑‍⚕️" />
        <Card title="Total Dokter" value="4" color="#3EC6D3" icon="👨‍⚕️" />
      </div>
      <Chart />
    </>
  );
}
