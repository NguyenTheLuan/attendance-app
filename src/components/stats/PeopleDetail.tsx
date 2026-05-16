import { useMemo } from "react";
import { useIsMobile } from "~/hooks/useIsMobile";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Rectangle,
} from "recharts";

import type { AttendanceRecord } from "~/types";

interface PeopleDetailProps {
  records: AttendanceRecord[];
}

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
  "var(--chart-8)",
];

const DAY_LABELS = [
  "Chủ nhật",
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
];

export default function PeopleDetail({ records }: PeopleDetailProps) {
  const isMobile = useIsMobile();

  // 1. Pie data - total per person (sorted)
  const pieData = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of records) {
      map.set(r.name, (map.get(r.name) ?? 0) + 1);
    }
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [records]);

  // 2. Day-of-week data - which days people attend most
  const weekDayData = useMemo(() => {
    const dayCounts = new Array(7).fill(0);
    for (const r of records) {
      const d = new Date(r.date + "T00:00:00");
      const dayOfWeek = d.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
      dayCounts[dayOfWeek]++;
    }
    return dayCounts.map((count, i) => ({
      label: DAY_LABELS[i],
      count,
    }));
  }, [records]);

  const top = Math.max(...pieData.map((d) => d.value), 1);

  // Responsive chart sizing
  const chartHeight = isMobile
    ? Math.max(220, pieData.length * 38)
    : Math.max(350, pieData.length * 48);

  const chartMargin = isMobile
    ? { top: 4, right: 8, left: 4, bottom: 4 }
    : { top: 8, right: 40, left: 80, bottom: 8 };

  const yAxisWidth = isMobile ? 90 : 70;
  const barSize = isMobile ? 18 : 24;
  const barLabelFontSize = isMobile ? 10 : 12;

  return (
    <>
      {/* Bar chart: comparison between people */}
      <div className="card">
        <h2>📊 Thống kê các thành viên</h2>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart data={pieData} layout="vertical" margin={chartMargin}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, top + Math.ceil(top * 0.15)]}
              tick={{ fontSize: barLabelFontSize, fill: "var(--text-muted)" }}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={yAxisWidth}
              tick={{ fontSize: barLabelFontSize, fill: "var(--text-primary)" }}
            />
            <Tooltip
              formatter={(value) => [`${value ?? 0} lần`, "Tổng số"]}
              contentStyle={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: isMobile ? 12 : 13,
              }}
            />
            <Bar
              dataKey="value"
              radius={[0, 8, 8, 0]}
              maxBarSize={barSize}
              label={{
                position: "right",
                fill: "var(--text-muted)",
                fontSize: barLabelFontSize,
                formatter: (v) => `${v ?? 0} lần`,
              }}
              shape={(props: {
                index: number;
                x: number;
                y: number;
                width: number;
                height: number;
              }) => {
                return (
                  <Rectangle
                    {...props}
                    fill={COLORS[props.index % COLORS.length]}
                  />
                );
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Day-of-week chart */}
      <div className="card">
        <h2>📅 Ngày trong tuần thường trực nhất</h2>
        <ResponsiveContainer width="100%" height={isMobile ? 220 : 320}>
          <BarChart
            data={weekDayData}
            margin={{ top: 8, right: 8, bottom: 8, left: -8 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              fontSize={isMobile ? 11 : 12}
              tick={{ fill: "var(--text-muted)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              fontSize={isMobile ? 10 : 11}
              tick={{ fill: "var(--text-muted)" }}
              axisLine={false}
              tickLine={false}
              width={30}
            />
            <Tooltip
              formatter={(value) => [`${value ?? 0} lượt`, "Số lượt"]}
              contentStyle={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: isMobile ? 12 : 13,
              }}
            />
            <Bar dataKey="count" radius={[3, 3, 0, 0]}>
              {weekDayData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
