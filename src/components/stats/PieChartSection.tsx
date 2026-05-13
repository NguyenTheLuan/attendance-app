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
      <div className="pie-layout">
        {/* Left: PieChart */}
        <div className="pie-chart-wrapper">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={160}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Right: Person list */}
        <div className="pie-person-list">
          {data.map((item, i) => (
            <div key={item.name} className="pie-person-item">
              <span
                className="pie-person-dot"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span className="pie-person-name">{item.name}</span>
              <span className="pie-person-count">{item.value}</span>
              <span className="pie-person-pct">
                ({((item.value / sum) * 100).toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
