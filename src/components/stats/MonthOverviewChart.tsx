import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getEightChunks } from "~/utils/weeklyCounts";
import { formatMonth } from "~/utils/formatDate";
import type { AttendanceRecord, MonthStats } from "~/types";

interface MonthOverviewChartProps {
  months: MonthStats[];
  records: AttendanceRecord[];
}

export default function MonthOverviewChart({
  months,
  records,
}: MonthOverviewChartProps) {
  const [subMode, setSubMode] = useState<"compare" | "detail">("compare");
  const chunks = useMemo(() => getEightChunks(records), [records]);

  const monthData = useMemo(
    () =>
      months.map((m) => ({
        label: formatMonth(m.month),
        month: m.month,
        "Lượt trực": m.totalDuty,
      })),
    [months]
  );

  return (
    <div className="card">
      <div className="chart-sub-tabs">
        <button
          className={`chart-tab chart-tab-sm ${
            subMode === "compare" ? "active" : ""
          }`}
          onClick={() => setSubMode("compare")}
        >
          📊 So sánh các tháng
        </button>
        <button
          className={`chart-tab chart-tab-sm ${
            subMode === "detail" ? "active" : ""
          }`}
          onClick={() => setSubMode("detail")}
        >
          📈 Cụ thể
        </button>
      </div>

      {subMode === "compare" && monthData.length > 0 && (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={monthData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              fontSize={12}
              tick={{ fill: "var(--text-muted)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              fontSize={12}
              tick={{ fill: "var(--text-muted)" }}
              axisLine={false}
              tickLine={false}
              width={30}
            />
            <Tooltip
              contentStyle={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 13,
              }}
            />

            <Line
              type="monotone"
              dataKey="Lượt trực"
              stroke="var(--primary)"
              strokeWidth={2}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}

      {subMode === "detail" && chunks.length > 0 && (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={chunks}
            margin={{ top: 8, right: 8, bottom: 16, left: -8 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              fontSize={11}
              height={40}
              angle={-30}
              textAnchor="end"
              tick={{ fill: "var(--text-muted)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              fontSize={11}
              tick={{ fill: "var(--text-muted)" }}
              axisLine={false}
              tickLine={false}
              width={30}
            />
            <Tooltip
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => [`${value} lượt`, "Tổng"]}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              labelFormatter={(label: any) => label}
              contentStyle={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 13,
              }}
            />

            <Line
              type="monotone"
              dataKey="total"
              stroke="var(--primary)"
              strokeWidth={3}
              dot={{ fill: "var(--primary)", r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
