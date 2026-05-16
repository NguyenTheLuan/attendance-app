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
  const [y, m] = month.split("-").map(Number);
  const lastDay = new Date(y, m, 0).getDate();

  const daysInMonth: string[] = [];
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
