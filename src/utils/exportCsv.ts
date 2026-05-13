import type { AttendanceRecord } from "../types";

function formatDate(ymd: string) {
  const [y, m, d] = ymd.split("-");
  return `${d}/${m}/${y}`;
}

export function exportRecordsToCsv(records: AttendanceRecord[]): void {
  // Group by date
  const grouped = records.reduce<Record<string, AttendanceRecord[]>>(
    (acc, r) => {
      (acc[r.date] ??= []).push(r);
      return acc;
    },
    {}
  );

  // Build CSV rows
  const rows: string[][] = [];

  // Header
  rows.push(["Ngày", "Tên người trực", "Ảnh URL"]);

  // Sort dates descending
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  for (const date of sortedDates) {
    for (const record of grouped[date]) {
      rows.push([formatDate(date), record.name, record.imageUrl]);
    }
  }

  // Convert to CSV string
  const csvContent = rows
    .map((row) =>
      row
        .map((cell) => {
          // Escape quotes and wrap in quotes if contains comma or quotes
          const escaped = cell.replace(/"/g, '""');
          return /[",\n]/.test(cell) ? `"${escaped}"` : escaped;
        })
        .join(",")
    )
    .join("\n");

  // Create download
  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `lich-truc-nhat-${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
