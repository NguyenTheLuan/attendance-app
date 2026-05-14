import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

interface BarDataItem {
  name: string;
  value: number;
}

interface PieChartSectionProps {
  data: BarDataItem[];
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
  const sorted = [...data].sort((a, b) => b.value - a.value);
  const top = Math.max(...sorted.map((d) => d.value), 1);

  return (
    <div className="card">
      <h2>📊 Phân bố theo người</h2>
      <ResponsiveContainer
        width="100%"
        height={Math.max(300, sorted.length * 36)}
      >
        <BarChart
          data={sorted}
          layout="vertical"
          margin={{ top: 8, right: 40, left: 80, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, top + Math.ceil(top * 0.15)]}
            tick={{ fontSize: 12, fill: "var(--text-muted)" }}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={70}
            tick={{ fontSize: 13, fill: "var(--text-primary)" }}
          />
          <Tooltip
            formatter={(value: number) => [`${value} lần`, "Tổng số"]}
            contentStyle={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 8,
            }}
          />
          <Bar
            dataKey="value"
            radius={[0, 8, 8, 0]}
            maxBarSize={24}
            label={{
              position: "right",
              fill: "var(--text-muted)",
              fontSize: 12,
              formatter: (v: number) => `${v} lần`,
            }}
          >
            {sorted.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
