export default function Card({ title, value, color, icon }: {
  title: string;
  value: string;
  color: string;
  icon: string;
}) {
  return (
    <div className="bg-white shadow-md p-4 rounded flex items-center">
      <div className="w-12 h-12 text-white rounded flex items-center justify-center text-xl mr-4" style={{ backgroundColor: color }}>
        {icon}
      </div>
      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-xl font-bold">{value}</div>
      </div>
    </div>
  );
}
