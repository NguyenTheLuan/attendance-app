import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#e94560",
  "#0f3460",
  "#533483",
  "#e94560",
  "#16213e",
  "#1a1a2e",
  "#ff6b81",
  "#7bed9f",
  "#70a1ff",
  "#ffa502",
  "#2ed573",
  "#ff4757",
];

interface PieChartSectionProps {
  data: { name: string; value: number }[];
}

export default function PieChartSection({ data }: PieChartSectionProps) {
  return (
    <div className="card chart-card">
      <h2>🧑‍🤝‍🧑 So sánh người trực</h2>
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ name, percent }) =>
              `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`
            }
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
