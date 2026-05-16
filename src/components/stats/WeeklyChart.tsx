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
import type { WeekData } from "~/utils/weeklyCounts";

/**
 * Flatten weeks into a single dataset with prefix labels
 * so they render as one unified chart.
 */
function flattenWeeks(weeks: WeekData[]) {
  const result: { label: string; count: number; _color: string }[] = [];
  const weekColors = ["#e94560", "#4a6fa5", "#2ecc71", "#f39c12", "#9b59b6"];

  weeks.forEach((week, wi) => {
    const color = weekColors[wi % weekColors.length];
    week.days.forEach((day) => {
      result.push({
        label: `${week.weekLabel.slice(-1)}/${day.name}`,
        count: day.count,
        _color: color,
      });
    });
  });

  return result;
}

interface WeeklyChartProps {
  weeks: WeekData[];
}

export default function WeeklyChart({ weeks }: WeeklyChartProps) {
  if (weeks.length === 0) return null;

  const allDays = flattenWeeks(weeks);

  return (
    <div className="card">
      <h2>📅 Trực theo tuần</h2>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={allDays}
          margin={{ top: 8, right: 8, bottom: 16, left: -8 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            fontSize={10}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis allowDecimals={false} fontSize={11} />
          <Tooltip
            formatter={(value) => [`${value} lượt`, "Số lượt"]}
            labelFormatter={(label) => `Ngày ${label}`}
          />
          <Bar dataKey="count" radius={[3, 3, 0, 0]}>
            {allDays.map((entry, idx) => (
              <Cell key={idx} fill={entry._color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
