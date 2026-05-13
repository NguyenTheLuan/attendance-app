import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { AttendanceRecord } from "~/types";

export interface WeekData {
  weekLabel: string;
  days: { name: string; count: number }[];
}

export function getWeeklyDailyCounts(
  records: AttendanceRecord[],
  month: string
): WeekData[] {
  const monthRecords = records.filter((r) => r.date.startsWith(month));
  const daysInMonth: string[] = [];
  const [y, m] = month.split("-").map(Number);
  const lastDay = new Date(y, m, 0).getDate();
  for (let d = 1; d <= lastDay; d++) {
    const dateStr = `${month}-${String(d).padStart(2, "0")}`;
    daysInMonth.push(dateStr);
  }

  const dailyCounts = daysInMonth.map((d) => ({
    date: d,
    count: monthRecords.filter((r) => r.date === d).length,
  }));

  const weeks: WeekData[] = [];
  for (let d = 1; d <= lastDay; d += 7) {
    const weekDates = daysInMonth.slice(d - 1, d + 6);
    const weekNum = Math.ceil(d / 7);
    weeks.push({
      weekLabel: `Tuần ${weekNum}`,
      days: weekDates.map((wd) => ({
        name: wd.slice(-2),
        count: dailyCounts.find((dc) => dc.date === wd)?.count ?? 0,
      })),
    });
  }
  return weeks;
}

interface WeeklyChartProps {
  weeks: WeekData[];
}

export default function WeeklyChart({ weeks }: WeeklyChartProps) {
  if (weeks.length === 0) return null;

  return (
    <div className="card">
      <h2>📅 Trực theo tuần</h2>
      {weeks.map((week) => (
        <div key={week.weekLabel} style={{ marginBottom: 24 }}>
          <h4 style={{ margin: "8px 0", color: "#555" }}>{week.weekLabel}</h4>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={week.days}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={11} />
              <YAxis allowDecimals={false} fontSize={11} />
              <Tooltip />
              <Bar dataKey="count" fill="#e94560" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
}
