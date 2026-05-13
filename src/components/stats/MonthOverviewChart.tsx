import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatMonth } from "~/utils/formatDate";
import type { MonthStats } from "~/types";

interface MonthOverviewChartProps {
  months: MonthStats[];
}

export default function MonthOverviewChart({
  months,
}: MonthOverviewChartProps) {
  const data = months.map((m) => ({
    label: formatMonth(m.month),
    month: m.month,
    "Lượt trực": m.totalDuty,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" fontSize={12} />
        <YAxis allowDecimals={false} fontSize={12} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="Lượt trực"
          stroke="#e94560"
          strokeWidth={2}
          dot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
