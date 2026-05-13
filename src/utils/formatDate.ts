/**
 * Format "YYYY-MM-DD" to "DD/MM/YYYY"
 */
export function formatDate(ymd: string) {
  const [y, m, d] = ymd.split("-");
  return `${d}/${m}/${y}`;
}

/**
 * Format "YYYY-MM-DD" to "D/M" (short)
 */
export function formatDateShort(ymd: string) {
  const [_y, m, d] = ymd.split("-");
  return `${parseInt(d)}/${parseInt(m)}`;
}

/**
 * Format "YYYY-MM" to "Tháng M/YYYY"
 */
export function formatMonth(ym: string) {
  const [y, m] = ym.split("-");
  return `Tháng ${parseInt(m)}/${y}`;
}
