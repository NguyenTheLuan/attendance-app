import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface PieDataItem {
  name: string;
  value: number;
}

interface PieChartSectionProps {
  data: PieDataItem[];
}

const COLORS = [
  "#e94560",
  "#ff6b6b",
  "#f7a072",
  "#f9d56e",
  "#6bcb77",
  "#4d96ff",
  "#9b59b6",
  "#e67e22",
];

export default function PieChartSection({ data }: PieChartSectionProps) {
  return (
    <div className="card">
      <h2>� Phân bố theo người</h2>
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label={({ name, value }) => `${name}: ${value}`}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
