const MONTHS = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

export function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-");
  return `Ngày ${d} tháng ${m} năm ${y}`;
}

export function formatMonth(monthStr: string): string {
  const [, m] = monthStr.split("-");
  return MONTHS[parseInt(m, 10) - 1] ?? monthStr;
}
