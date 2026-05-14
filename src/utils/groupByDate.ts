import type { AttendanceRecord } from "~/types";

/**
 * Group an array of attendance records by their `date` field.
 * Returns entries sorted descending by date.
 */
export function groupByDate(
  records: AttendanceRecord[]
): [string, AttendanceRecord[]][] {
  const grouped = records.reduce<Record<string, AttendanceRecord[]>>(
    (acc, r) => {
      (acc[r.date] ??= []).push(r);
      return acc;
    },
    {}
  );
  return Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a));
}
