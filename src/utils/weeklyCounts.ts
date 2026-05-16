import type { AttendanceRecord } from "~/types";

/**
 * Split all records into 8 equal time chunks based on the full date range
 * (earliest to latest), and return an array with chunk labels and totals
 * suitable for a line chart (e.g. MonthOverviewChart).
 */
export function getEightChunks(records: AttendanceRecord[]) {
  if (records.length === 0) return [];

  let minDate = records[0].date;
  let maxDate = records[0].date;
  for (const r of records) {
    if (r.date < minDate) minDate = r.date;
    if (r.date > maxDate) maxDate = r.date;
  }

  const start = new Date(minDate);
  const end = new Date(maxDate);
  const totalDays =
    Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const daysPerChunk = Math.ceil(totalDays / 8);

  const allDates: string[] = [];
  for (let i = 0; i < totalDays; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    allDates.push(`${y}-${m}-${day}`);
  }

  const dailyCounts = new Map<string, number>();
  for (const r of records) {
    dailyCounts.set(r.date, (dailyCounts.get(r.date) ?? 0) + 1);
  }

  const chunks: { label: string; total: number }[] = [];
  for (let chunkIdx = 0; chunkIdx < 8; chunkIdx++) {
    const startIdx = chunkIdx * daysPerChunk;
    const endIdx = Math.min(startIdx + daysPerChunk - 1, allDates.length - 1);
    if (startIdx >= allDates.length) break;

    const chunkDates = allDates.slice(startIdx, endIdx + 1);
    const firstDate = chunkDates[0];
    const lastDate = chunkDates[chunkDates.length - 1];
    const firstMonth = parseInt(firstDate.slice(5, 7), 10);
    const lastMonth = parseInt(lastDate.slice(5, 7), 10);
    const firstDay = parseInt(firstDate.slice(8, 10), 10);
    const lastDay = parseInt(lastDate.slice(8, 10), 10);

    const label =
      firstMonth !== lastMonth
        ? `${firstDay}/${firstMonth}-${lastDay}/${lastMonth}`
        : `${firstDay}-${lastDay}/${firstMonth}`;

    const total = chunkDates.reduce(
      (sum, d) => sum + (dailyCounts.get(d) ?? 0),
      0
    );

    chunks.push({ label, total });
  }

  return chunks;
}

export function getWeeklyDailyCounts(
  records: AttendanceRecord[],
  month: string
): { day: number; count: number }[] {
  const monthRecords = records.filter((r) => r.date.startsWith(month));
  const [y, m] = month.split("-").map(Number);
  const lastDay = new Date(y, m, 0).getDate();

  const dailyCounts: { day: number; count: number }[] = [];
  for (let d = 1; d <= lastDay; d++) {
    const dateStr = `${month}-${String(d).padStart(2, "0")}`;
    const count = monthRecords.filter((r) => r.date === dateStr).length;
    dailyCounts.push({ day: d, count });
  }
  return dailyCounts;
}
