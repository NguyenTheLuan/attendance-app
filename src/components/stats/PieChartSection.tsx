import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

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

const total = (data: PieDataItem[]) =>
  data.reduce((sum, d) => sum + d.value, 0);

export default function PieChartSection({ data }: PieChartSectionProps) {
  const sum = total(data);

  return (
    <div className="card">
      <h2>📊 Phân bố theo người</h2>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={160}
            label={({ name, value }) =>
              `${name} (${((value / sum) * 100).toFixed(1)}%)`
            }
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} lần`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
