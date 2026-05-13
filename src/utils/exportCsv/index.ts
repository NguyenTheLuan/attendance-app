import type { AttendanceRecord } from "../../types";

function formatDate(ymd: string) {
  const [y, m, d] = ymd.split("-");
  return `${d}/${m}/${y}`;
}

export function exportRecordsToCsv(records: AttendanceRecord[]): void {
  const grouped = records.reduce<Record<string, AttendanceRecord[]>>(
    (acc, r) => {
      (acc[r.date] ??= []).push(r);
      return acc;
    },
    {}
  );

  const rows: string[][] = [];

  rows.push(["Ngày", "Tên người trực", "Ảnh URL"]);

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  for (const date of sortedDates) {
    for (const record of grouped[date]) {
      rows.push([formatDate(date), record.name, record.imageUrl]);
    }
  }

  const csvContent = rows
    .map((row) =>
      row
        .map((cell) => {
          const escaped = cell.replace(/"/g, '""');
          return /[",\n]/.test(cell) ? `"${escaped}"` : escaped;
        })
        .join(",")
    )
    .join("\n");

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
