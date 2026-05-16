import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface DailyData {
  day: number;
  count: number;
}

interface WeeklyChartProps {
  dailyData: DailyData[];
  monthLabel?: string;
}

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
  "var(--chart-8)",
];

function formatMonthLabel(month?: string) {
  if (!month) return "";
  const [y, m] = month.split("-");
  return `Tháng ${parseInt(m, 10)}/${y}`;
}

export default function WeeklyChart({
  dailyData,
  monthLabel,
}: WeeklyChartProps) {
  if (dailyData.length === 0) return null;

  const maxDay = dailyData.length;
  const maxCount = Math.max(...dailyData.map((d) => d.count), 1);

  return (
    <div className="card">
      <h2>📊 {formatMonthLabel(monthLabel)}</h2>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={dailyData}
          margin={{ top: 8, right: 8, bottom: 16, left: -8 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="day"
            fontSize={10}
            height={40}
            tick={{ fill: "var(--text-muted)" }}
            axisLine={false}
            tickLine={false}
            interval={Math.floor(maxDay / 10) || 1}
          />
          <YAxis
            allowDecimals={false}
            fontSize={11}
            tick={{ fill: "var(--text-muted)" }}
            axisLine={false}
            tickLine={false}
            width={30}
            domain={[0, "auto"]}
          />
          <Tooltip
            formatter={(value: number) => [`${value} lượt`, "Ngày"]}
            labelFormatter={(label: number) => `Ngày ${label}`}
            contentStyle={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontSize: 13,
            }}
          />
          <Bar dataKey="count" radius={[3, 3, 0, 0]}>
            {dailyData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
